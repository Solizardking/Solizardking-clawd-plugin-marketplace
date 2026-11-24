// MCP tool definitions + handlers for the backpack-trading server.
//
// Fail-closed shape throughout:
// - Read tools use the READ key only and never sign trade instructions.
// - Every trade-flow step checks the master switch + trade key + caps
//   locally BEFORE anything is signed.
// - Value-moving calls (rfq accept, order place) require a confirm token
//   issued by the matching quote/preview step, bound to the exact terms
//   shown to the user. No token, no signature.
// - After a value-moving call, the result is verified from the history /
//   query endpoints and reported from the response — never from the request.

import {
  assertReadReady,
  assertTradeKeyReady,
  assertTradeReady,
  assertCapsConfigured,
  assertWithinPerOrderCap,
  GateError,
} from './config.mjs';
import { INSTRUCTIONS, assertWithinDailyCap, recordLedger } from './client.mjs';
import { issueToken, verifyToken, assertBindingMatches, tokenKeyFromSeed } from './tokens.mjs';

export const STOCK_BINDING_WARNING =
  'BINDING: accepting a stock quote is binding — funds are locked and settlement is deferred. ' +
  'It is NOT a cancellable order-book order. Only confirm if you intend to be bound.';

const ORDER_TOKEN_TTL_MS = 5 * 60 * 1000;

function roundUsd(x) {
  return Math.round(x * 1e6) / 1e6;
}

function priceString(x) {
  let s = Number(x).toFixed(10);
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s;
}

export function isStockRfqSymbol(symbol) {
  return typeof symbol === 'string' && symbol.includes('.US_');
}

function tokenKey(ctx) {
  return tokenKeyFromSeed(ctx.config.tradeKey.seed);
}

async function tickerPrice(ctx, symbol) {
  const t = await ctx.client.publicRequest({ path: '/api/v1/ticker', params: { symbol } });
  const px = Number(t?.lastPrice);
  if (!Number.isFinite(px) || px <= 0) {
    throw new GateError(`Could not read a usable last price for ${symbol} — cannot size the trade, refusing (fail-closed).`);
  }
  return px;
}

function requireOneOf(args, a, b, toolName) {
  const hasA = args[a] !== undefined && args[a] !== null;
  const hasB = args[b] !== undefined && args[b] !== null;
  if (hasA === hasB) {
    throw new GateError(`${toolName}: pass exactly one of ${a} / ${b}.`);
  }
}

// ---------------------------------------------------------------------------
// Read tools (read-only key, no confirm)
// ---------------------------------------------------------------------------

async function account(ctx) {
  assertReadReady(ctx.config);
  return ctx.client.signedRequest({
    key: 'read', method: 'GET', path: '/api/v1/account',
    instruction: INSTRUCTIONS.account, params: {},
  });
}

async function balances(ctx) {
  assertReadReady(ctx.config);
  return ctx.client.signedRequest({
    key: 'read', method: 'GET', path: '/api/v1/capital',
    instruction: INSTRUCTIONS.balances, params: {},
  });
}

async function positions(ctx) {
  assertReadReady(ctx.config);
  return ctx.client.signedRequest({
    key: 'read', method: 'GET', path: '/api/v1/position',
    instruction: INSTRUCTIONS.positions, params: {},
  });
}

async function rfqHistory(ctx, args) {
  assertReadReady(ctx.config);
  const params = {};
  for (const k of ['symbol', 'side', 'status', 'rfqId', 'quoteId', 'limit', 'offset']) {
    if (args[k] !== undefined) params[k] = args[k];
  }
  return ctx.client.signedRequest({
    key: 'read', method: 'GET', path: '/wapi/v1/history/rfq',
    instruction: INSTRUCTIONS.rfqHistory, params,
  });
}

async function orderHistory(ctx, args) {
  assertReadReady(ctx.config);
  const params = {};
  for (const k of ['symbol', 'side', 'status', 'limit', 'offset']) {
    if (args[k] !== undefined) params[k] = args[k];
  }
  return ctx.client.signedRequest({
    key: 'read', method: 'GET', path: '/wapi/v1/history/orders',
    instruction: INSTRUCTIONS.orderHistory, params,
  });
}

async function status(ctx) {
  const c = ctx.config;
  return {
    server: 'backpack-trading',
    baseUrl: c.baseUrl,
    network: c.isMainnet ? 'mainnet' : 'testnet',
    tradingEnabled: c.tradingEnabled,
    caps: {
      maxOrderNotionalUsd: c.maxOrderNotionalUsd,
      maxDailyNotionalUsd: c.maxDailyNotionalUsd,
      configured: c.maxOrderNotionalUsd !== null && c.maxDailyNotionalUsd !== null,
    },
    keys: {
      readKeyConfigured: Boolean(c.readKey),
      tradeKeyConfigured: Boolean(c.tradeKey),
    },
    note: 'Status only — no request was signed or sent. Trading stays off unless BACKPACK_TRADING_ENABLED=1 and caps are set.',
  };
}

// ---------------------------------------------------------------------------
// RFQ requester flow (trade key, confirm-gated)
// ---------------------------------------------------------------------------

async function rfqSubmit(ctx, args) {
  assertTradeReady(ctx.config);
  const { symbol, side } = args;
  if (typeof symbol !== 'string' || !symbol.endsWith('_RFQ')) {
    throw new GateError(`backpack_rfq_submit: symbol must be an RFQ market (ending in _RFQ), got ${JSON.stringify(symbol)}.`);
  }
  if (side !== 'Bid' && side !== 'Ask') {
    throw new GateError('backpack_rfq_submit: side must be "Bid" or "Ask".');
  }
  requireOneOf(args, 'quantity', 'quoteQuantity', 'backpack_rfq_submit');
  if (args.executionMode !== undefined && args.executionMode !== 'AwaitAccept') {
    throw new GateError(
      `backpack_rfq_submit: executionMode ${JSON.stringify(args.executionMode)} is refused — only AwaitAccept is supported in v1 (Immediate stays disabled).`,
    );
  }

  // Size the RFQ for the per-order cap before signing anything.
  let notionalUsd;
  if (args.quoteQuantity !== undefined) {
    notionalUsd = Number(args.quoteQuantity);
  } else if (args.price !== undefined) {
    notionalUsd = Number(args.quantity) * Number(args.price);
  } else {
    const underlying = symbol.replace(/_RFQ$/, '');
    const px = await tickerPrice(ctx, underlying);
    notionalUsd = Number(args.quantity) * px;
  }
  notionalUsd = roundUsd(notionalUsd);
  assertWithinPerOrderCap(ctx.config, notionalUsd);

  const params = { symbol, side, executionMode: 'AwaitAccept' };
  if (args.quantity !== undefined) params.quantity = args.quantity;
  if (args.quoteQuantity !== undefined) params.quoteQuantity = args.quoteQuantity;
  if (args.price !== undefined) params.price = args.price;
  if (args.clientId !== undefined) params.clientId = args.clientId;

  const res = await ctx.client.signedRequest({
    key: 'trade', method: 'POST', path: '/api/v1/rfq',
    instruction: INSTRUCTIONS.rfqSubmit, params,
  });
  return {
    submitted: res,
    estimatedNotionalUsd: notionalUsd,
    nextStep: 'Call backpack_rfq_quote with the rfqId to get exact terms and a confirm token. Nothing has executed yet.',
  };
}

async function rfqQuote(ctx, args) {
  assertTradeReady(ctx.config);
  if (args.rfqId === undefined) throw new GateError('backpack_rfq_quote: rfqId is required.');
  const rfq = await ctx.client.signedRequest({
    key: 'trade', method: 'GET', path: '/api/v1/rfq',
    instruction: INSTRUCTIONS.rfqQuery, params: { rfqId: args.rfqId },
  });
  const quote = await ctx.client.signedRequest({
    key: 'trade', method: 'GET', path: '/api/v1/rfq/quote',
    instruction: INSTRUCTIONS.rfqQuote, params: { rfqId: args.rfqId },
  });
  const accountInfo = await ctx.client.signedRequest({
    key: 'trade', method: 'GET', path: '/api/v1/account',
    instruction: INSTRUCTIONS.account, params: {},
  });

  const now = ctx.now();
  const W = Number(rfq?.expiryTime);
  const w = Number(rfq?.submissionTime);
  if (!Number.isFinite(W)) {
    throw new GateError('backpack_rfq_quote: RFQ response carried no expiryTime — cannot bound the quote, refusing (fail-closed).');
  }
  if (now > W) {
    throw new GateError(`backpack_rfq_quote: this RFQ expired at ${new Date(W).toISOString()} (W) — re-submit for a fresh quote.`);
  }
  if (!quote || quote.quoteId === undefined) {
    throw new GateError('backpack_rfq_quote: no live quote is available for this RFQ yet — try again before expiry (W).');
  }
  const feeRate = Number(accountInfo?.spotTakerFee);
  if (!Number.isFinite(feeRate)) {
    throw new GateError('backpack_rfq_quote: account response carried no usable spotTakerFee — cannot compute the fee-inclusive taker price, refusing (fail-closed).');
  }
  const side = rfq.side;
  const rawPrice = Number(side === 'Bid' ? quote.askPrice : quote.bidPrice);
  if (!Number.isFinite(rawPrice) || rawPrice <= 0) {
    throw new GateError('backpack_rfq_quote: quote carried no usable price — refusing (fail-closed).');
  }
  // Taker price = quote price plus fee (requester side). Computed from the
  // REST quote + the account's live taker fee; the private WS rfqCandidate
  // price is authoritative where available — v1 polls REST (see README).
  const taker = side === 'Bid' ? rawPrice * (1 + feeRate) : rawPrice * (1 - feeRate);
  const takerPrice = priceString(taker);
  const notionalUsd = roundUsd(
    rfq.quantity !== undefined && rfq.quantity !== null
      ? taker * Number(rfq.quantity)
      : Number(rfq.quoteQuantity),
  );

  const payload = {
    kind: 'rfq_accept',
    quoteId: String(quote.quoteId),
    rfqId: String(args.rfqId),
    symbol: rfq.symbol,
    side,
    takerPrice,
    notionalUsd,
    expiryW: W,
    iat: now,
    exp: W,
  };
  const confirmToken = issueToken(tokenKey(ctx), payload);

  const warnings = [
    'Estimated fee-inclusive taker price: REST quote + account taker fee. Verify the fill from history after accepting.',
  ];
  if (isStockRfqSymbol(rfq.symbol)) warnings.push(STOCK_BINDING_WARNING);

  return {
    rfqId: String(args.rfqId),
    quoteId: String(quote.quoteId),
    symbol: rfq.symbol,
    side,
    quantity: rfq.quantity ?? null,
    quoteQuantity: rfq.quoteQuantity ?? null,
    quotePrice: priceString(rawPrice),
    feeRate,
    takerPrice,
    notionalUsd,
    submissionTime: Number.isFinite(w) ? w : null,
    expiryTime: W,
    expiryIso: new Date(W).toISOString(),
    warnings,
    confirmToken,
    nextStep: 'Show these exact terms to the user. Only on their explicit confirmation, call backpack_rfq_accept with this confirmToken and quoteId.',
  };
}

async function rfqAccept(ctx, args) {
  assertTradeReady(ctx.config);
  if (args.confirmToken === undefined) {
    throw new GateError('backpack_rfq_accept: confirmToken is required — no token, no signature (fail-closed).');
  }
  if (args.quoteId === undefined) {
    throw new GateError('backpack_rfq_accept: quoteId is required.');
  }
  const payload = verifyToken(tokenKey(ctx), args.confirmToken, 'rfq_accept', ctx.now());
  if (String(payload.quoteId) !== String(args.quoteId)) {
    throw new GateError(
      `backpack_rfq_accept: quoteId ${JSON.stringify(args.quoteId)} does not match the confirmed quote ${JSON.stringify(payload.quoteId)} — refusing.`,
    );
  }
  if (ctx.now() > payload.expiryW) {
    throw new GateError('backpack_rfq_accept: the quote is stale (past expiry W) — refusing. Re-quote for fresh terms.');
  }
  assertWithinPerOrderCap(ctx.config, payload.notionalUsd);
  assertWithinDailyCap(ctx.config, payload.notionalUsd, ctx.now());

  const params = { quoteId: payload.quoteId };
  if (payload.rfqId !== undefined) params.rfqId = payload.rfqId;
  const res = await ctx.client.signedRequest({
    key: 'trade', method: 'POST', path: '/api/v1/rfq/accept',
    instruction: INSTRUCTIONS.quoteAccept, params,
  });
  const dailyTotal = recordLedger(ctx.config.configDir, {
    notionalUsd: payload.notionalUsd, kind: 'rfq_accept', ref: payload.quoteId,
  }, ctx.now());

  // Verify from the fill history — report what the exchange recorded.
  let verification;
  try {
    const fills = await ctx.client.signedRequest({
      key: 'trade', method: 'GET', path: '/wapi/v1/history/rfq/fill',
      instruction: INSTRUCTIONS.rfqFillHistory, params: { rfqId: payload.rfqId },
    });
    const list = Array.isArray(fills) ? fills : [];
    verification = list.length
      ? { status: 'fill_recorded', fills: list }
      : { status: 'not_yet_visible', note: 'Accept succeeded but no fill is visible in history yet — for stocks, settlement is deferred (binding accept). Re-check backpack_rfq_history / fill history shortly.' };
  } catch (err) {
    verification = { status: 'check_failed', note: `Fill-history check failed: ${err.message}` };
  }
  return { accepted: res, confirmedTerms: payload, dailyTotalUsdAfter: dailyTotal, verification };
}

async function rfqCancel(ctx, args) {
  assertTradeReady(ctx.config, { requireCaps: false });
  requireOneOf(args, 'rfqId', 'clientId', 'backpack_rfq_cancel');
  const params = {};
  if (args.rfqId !== undefined) params.rfqId = args.rfqId;
  if (args.clientId !== undefined) params.clientId = args.clientId;
  return ctx.client.signedRequest({
    key: 'trade', method: 'POST', path: '/api/v1/rfq/cancel',
    instruction: INSTRUCTIONS.rfqCancel, params,
  });
}

async function rfqRefresh(ctx, args) {
  assertTradeReady(ctx.config, { requireCaps: false });
  if (args.rfqId === undefined) throw new GateError('backpack_rfq_refresh: rfqId is required.');
  return ctx.client.signedRequest({
    key: 'trade', method: 'POST', path: '/api/v1/rfq/refresh',
    instruction: INSTRUCTIONS.rfqRefresh, params: { rfqId: args.rfqId },
  });
}

// ---------------------------------------------------------------------------
// Order book (trade key, confirm-gated)
// ---------------------------------------------------------------------------

const ORDER_BINDING_FIELDS = ['symbol', 'side', 'orderType', 'quantity', 'quoteQuantity', 'price', 'timeInForce', 'postOnly'];

async function orderPreview(ctx, args) {
  assertTradeKeyReady(ctx.config);
  assertCapsConfigured(ctx.config);
  const { symbol, side, orderType } = args;
  if (!symbol || (side !== 'Bid' && side !== 'Ask') || (orderType !== 'Market' && orderType !== 'Limit')) {
    throw new GateError('backpack_order_preview: symbol, side (Bid|Ask) and orderType (Market|Limit) are required.');
  }
  requireOneOf(args, 'quantity', 'quoteQuantity', 'backpack_order_preview');
  if (orderType === 'Limit' && args.price === undefined) {
    throw new GateError('backpack_order_preview: Limit orders require a price.');
  }
  const priceEst = orderType === 'Limit' ? Number(args.price) : await tickerPrice(ctx, symbol);
  const notionalUsd = roundUsd(
    args.quoteQuantity !== undefined ? Number(args.quoteQuantity) : priceEst * Number(args.quantity),
  );
  assertWithinPerOrderCap(ctx.config, notionalUsd);

  const now = ctx.now();
  const payload = { kind: 'order_place', symbol, side, orderType, notionalUsd, iat: now, exp: now + ORDER_TOKEN_TTL_MS };
  for (const f of ['quantity', 'quoteQuantity', 'price', 'timeInForce', 'postOnly']) {
    if (args[f] !== undefined) payload[f] = args[f];
  }
  const confirmToken = issueToken(tokenKey(ctx), payload);
  return {
    symbol, side, orderType,
    quantity: args.quantity ?? null,
    quoteQuantity: args.quoteQuantity ?? null,
    price: args.price ?? null,
    estimatedPrice: priceString(priceEst),
    priceSource: orderType === 'Limit' ? 'limit price' : 'public ticker lastPrice (estimate — market fills may differ)',
    notionalUsd,
    confirmToken,
    expiresAt: new Date(now + ORDER_TOKEN_TTL_MS).toISOString(),
    nextStep: 'Show these exact terms to the user. Only on their explicit confirmation, call backpack_order_place with the same fields and this confirmToken.',
  };
}

async function orderPlace(ctx, args) {
  assertTradeReady(ctx.config);
  if (args.confirmToken === undefined) {
    throw new GateError('backpack_order_place: confirmToken is required — no token, no signature (fail-closed).');
  }
  const payload = verifyToken(tokenKey(ctx), args.confirmToken, 'order_place', ctx.now());
  assertBindingMatches(payload, args, ORDER_BINDING_FIELDS);
  assertWithinPerOrderCap(ctx.config, payload.notionalUsd);
  assertWithinDailyCap(ctx.config, payload.notionalUsd, ctx.now());

  const params = {};
  for (const f of ['symbol', 'side', 'orderType', 'quantity', 'quoteQuantity', 'price', 'timeInForce', 'postOnly', 'clientId', 'reduceOnly', 'selfTradePrevention']) {
    if (args[f] !== undefined) params[f] = args[f];
  }
  const res = await ctx.client.signedRequest({
    key: 'trade', method: 'POST', path: '/api/v1/order',
    instruction: INSTRUCTIONS.orderExecute, params,
  });
  const dailyTotal = recordLedger(ctx.config.configDir, {
    notionalUsd: payload.notionalUsd, kind: 'order_place', ref: res?.id ?? args.clientId ?? null,
  }, ctx.now());

  let verification;
  try {
    const q = { symbol: payload.symbol };
    if (res?.id !== undefined) q.orderId = res.id;
    else if (args.clientId !== undefined) q.clientId = args.clientId;
    if (q.orderId !== undefined || q.clientId !== undefined) {
      const order = await ctx.client.signedRequest({
        key: 'trade', method: 'GET', path: '/api/v1/order',
        instruction: INSTRUCTIONS.orderQuery, params: q,
      });
      verification = { status: 'order_recorded', order };
    } else {
      verification = { status: 'skipped', note: 'Place response carried no order id and no clientId was given — verify via backpack_order_history.' };
    }
  } catch (err) {
    verification = { status: 'check_failed', note: `Order query failed: ${err.message}` };
  }
  return { placed: res, confirmedTerms: payload, dailyTotalUsdAfter: dailyTotal, verification };
}

async function orderCancel(ctx, args) {
  assertTradeReady(ctx.config, { requireCaps: false });
  if (!args.symbol) throw new GateError('backpack_order_cancel: symbol is required.');
  requireOneOf(args, 'orderId', 'clientId', 'backpack_order_cancel');
  const params = { symbol: args.symbol };
  if (args.orderId !== undefined) params.orderId = args.orderId;
  if (args.clientId !== undefined) params.clientId = args.clientId;
  return ctx.client.signedRequest({
    key: 'trade', method: 'DELETE', path: '/api/v1/order',
    instruction: INSTRUCTIONS.orderCancel, params,
  });
}

// ---------------------------------------------------------------------------
// Tool registry
// ---------------------------------------------------------------------------

const S = (props, required = []) => ({ type: 'object', properties: props, required, additionalProperties: false });
const STR = { type: 'string' };
const NUMSTR = { type: 'string', description: 'Decimal as a string (no exponent notation)' };

export const TOOLS = [
  {
    name: 'backpack_trading_status',
    description: 'Local status of the backpack-trading server: network (testnet default), master switch, caps, key configuration. Signs nothing, sends nothing.',
    inputSchema: S({}),
    handler: status,
  },
  {
    name: 'backpack_account',
    description: 'Read the account object (fee surface: spotMakerFee/spotTakerFee/futures fees, limits) using the READ key.',
    inputSchema: S({}),
    handler: account,
  },
  {
    name: 'backpack_balances',
    description: 'Read balances (capital) using the READ key.',
    inputSchema: S({}),
    handler: balances,
  },
  {
    name: 'backpack_positions',
    description: 'Read futures positions using the READ key.',
    inputSchema: S({}),
    handler: positions,
  },
  {
    name: 'backpack_rfq_history',
    description: 'Read RFQ history using the READ key.',
    inputSchema: S({ symbol: STR, side: STR, status: STR, rfqId: STR, quoteId: STR, limit: { type: 'integer' }, offset: { type: 'integer' } }),
    handler: rfqHistory,
  },
  {
    name: 'backpack_order_history',
    description: 'Read order history using the READ key.',
    inputSchema: S({ symbol: STR, side: STR, status: STR, limit: { type: 'integer' }, offset: { type: 'integer' } }),
    handler: orderHistory,
  },
  {
    name: 'backpack_rfq_submit',
    description: 'Submit an RFQ (AwaitAccept only — Immediate is refused). Trade key + master switch + caps required. Does not execute anything; quotes are collected until the submission time, then backpack_rfq_quote returns terms for user confirmation.',
    inputSchema: S({
      symbol: { ...STR, description: 'RFQ market symbol, e.g. SOL_USDC_RFQ or AAPL.US_USDC_RFQ' },
      side: { type: 'string', enum: ['Bid', 'Ask'] },
      quantity: NUMSTR,
      quoteQuantity: NUMSTR,
      price: { ...NUMSTR, description: 'Optional limit price (stock limit RFQs)' },
      clientId: { type: 'integer' },
      executionMode: { type: 'string', enum: ['AwaitAccept'], description: 'Only AwaitAccept exists in v1' },
    }, ['symbol', 'side']),
    handler: rfqSubmit,
  },
  {
    name: 'backpack_rfq_quote',
    description: 'Fetch the live quote for an open RFQ and return exact terms (quote id, fee-inclusive taker price, validity window) plus a confirm token bound to those terms. For stock RFQs the terms carry a binding-acceptance warning. Signs nothing value-moving.',
    inputSchema: S({ rfqId: STR }, ['rfqId']),
    handler: rfqQuote,
  },
  {
    name: 'backpack_rfq_accept',
    description: 'VALUE-MOVING: accept a quote (quoteAccept) — the single RFQ execution step. Requires the confirmToken from backpack_rfq_quote bound to this exact quoteId + taker price + expiry; stale or mismatched terms are refused before signing. For stocks, acceptance is BINDING (funds lock, deferred settlement).',
    inputSchema: S({ quoteId: STR, confirmToken: STR }, ['quoteId', 'confirmToken']),
    handler: rfqAccept,
  },
  {
    name: 'backpack_rfq_cancel',
    description: 'Cancel an open RFQ (signed, non-value-moving). Pass exactly one of rfqId / clientId.',
    inputSchema: S({ rfqId: STR, clientId: { type: 'integer' } }),
    handler: rfqCancel,
  },
  {
    name: 'backpack_rfq_refresh',
    description: 'Refresh/extend an open RFQ (signed, non-value-moving).',
    inputSchema: S({ rfqId: STR }, ['rfqId']),
    handler: rfqRefresh,
  },
  {
    name: 'backpack_order_preview',
    description: 'Build exact order terms (symbol, side, type, quantity, price/estimate, notional) and a confirm token bound to them. Signs nothing. Caps are enforced on the previewed notional.',
    inputSchema: S({
      symbol: STR,
      side: { type: 'string', enum: ['Bid', 'Ask'] },
      orderType: { type: 'string', enum: ['Market', 'Limit'] },
      quantity: NUMSTR,
      quoteQuantity: NUMSTR,
      price: NUMSTR,
      timeInForce: { type: 'string', enum: ['GTC', 'IOC', 'FOK'] },
      postOnly: { type: 'boolean' },
    }, ['symbol', 'side', 'orderType']),
    handler: orderPreview,
  },
  {
    name: 'backpack_order_place',
    description: 'VALUE-MOVING: place one order (orderExecute; spot or perp by symbol). Requires the confirmToken from backpack_order_preview bound to the exact same fields; mismatched or expired terms are refused before signing. Batch orders are disabled in v1.',
    inputSchema: S({
      symbol: STR,
      side: { type: 'string', enum: ['Bid', 'Ask'] },
      orderType: { type: 'string', enum: ['Market', 'Limit'] },
      quantity: NUMSTR,
      quoteQuantity: NUMSTR,
      price: NUMSTR,
      timeInForce: { type: 'string', enum: ['GTC', 'IOC', 'FOK'] },
      postOnly: { type: 'boolean' },
      clientId: { type: 'integer' },
      confirmToken: STR,
    }, ['symbol', 'side', 'orderType', 'confirmToken']),
    handler: orderPlace,
  },
  {
    name: 'backpack_order_cancel',
    description: 'Cancel one open order (signed, non-value-moving). Pass exactly one of orderId / clientId.',
    inputSchema: S({ symbol: STR, orderId: STR, clientId: { type: 'integer' } }, ['symbol']),
    handler: orderCancel,
  },
];
