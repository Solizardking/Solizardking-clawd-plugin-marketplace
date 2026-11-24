// Tests for the backpack-trading server. No authenticated network calls:
// the client is driven through an injected fake fetch, and every refusal
// test asserts the fake fetch was never called (nothing was signed or sent).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
  canonicalSigningString,
  formatParamValue,
  seedFromBase64,
  signString,
  verifyString,
  verifyingKeyFromSeed,
  verifyingKeyBase64,
} from '../signing.mjs';
import { loadConfig, ConfigError, GateError } from '../config.mjs';
import { BackpackClient, dailyTotalUsd, recordLedger } from '../client.mjs';
import { issueToken, verifyToken, tokenKeyFromSeed, TokenError } from '../tokens.mjs';
import { TOOLS } from '../tools.mjs';

const tool = (name) => {
  const t = TOOLS.find((x) => x.name === name);
  assert.ok(t, `tool ${name} exists`);
  return t.handler;
};

// ---------------------------------------------------------------------------
// Signing
// ---------------------------------------------------------------------------

test('canonical string matches the documented orderCancel example', () => {
  const got = canonicalSigningString(
    'orderCancel',
    { symbol: 'BTC_USDT', orderId: '28' }, // deliberately unsorted input
    1614550000000,
    5000,
  );
  assert.equal(got, 'instruction=orderCancel&orderId=28&symbol=BTC_USDT&timestamp=1614550000000&window=5000');
});

test('canonical string: only params actually sent are included', () => {
  const s = canonicalSigningString('orderCancel', { clientId: 'abc', orderId: undefined }, 1, 5000);
  assert.equal(s, 'instruction=orderCancel&clientId=abc&timestamp=1&window=5000');
});

test('canonical string matches the documented orderExecute example ordering', () => {
  const s = canonicalSigningString(
    'orderExecute',
    { symbol: 'SOL_USDC', side: 'Bid', orderType: 'Limit', quantity: '1.5', price: '100.50' },
    1614550000000,
    5000,
  );
  assert.equal(s, 'instruction=orderExecute&orderType=Limit&price=100.50&quantity=1.5&side=Bid&symbol=SOL_USDC&timestamp=1614550000000&window=5000');
});

test('param formatting: booleans and exponent-free numbers', () => {
  assert.equal(formatParamValue(true), 'true');
  assert.equal(formatParamValue(false), 'false');
  assert.equal(formatParamValue(1e-7), '0.0000001');
  assert.equal(formatParamValue(1e21), '1000000000000000000000');
  assert.equal(formatParamValue(100.5), '100.5');
});

test('Ed25519 derivation + signature match RFC 8032 test vector 1', () => {
  // Same throwaway seed as the Python reference signer (RFC 8032 TEST 1).
  const seed = Buffer.from('9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60', 'hex');
  assert.equal(seed.length, 32);
  const vk = verifyingKeyFromSeed(seed);
  assert.equal(vk.toString('hex'), 'd75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a');
  const sigB64 = signString(seed, '');
  assert.equal(
    Buffer.from(sigB64, 'base64').toString('hex'),
    'e5564300c360ac729086e2cc806e828a84877f1eb8e5d974d873e065224901555fb8821590a33bacc61e39701cf9b46bd25bf5f0595bbe24655141438e7a100b',
  );
});

test('Ed25519 sign/verify round-trip with a throwaway key; tamper rejected', () => {
  const seed = crypto.randomBytes(32);
  const vk = verifyingKeyFromSeed(seed);
  const msg = 'instruction=orderCancel&orderId=28&symbol=BTC_USDT&timestamp=1&window=5000';
  const sig = Buffer.from(signString(seed, msg), 'base64');
  assert.equal(verifyString(vk, sig, msg), true);
  assert.equal(verifyString(vk, sig, `${msg}tampered`), false);
});

test('seedFromBase64 rejects wrong-length seeds', () => {
  assert.throws(() => seedFromBase64(Buffer.alloc(16).toString('base64')), /32-byte/);
});

// ---------------------------------------------------------------------------
// Config gates
// ---------------------------------------------------------------------------

test('config defaults: testnet, trading off, caps unset', () => {
  const c = loadConfig({});
  assert.equal(c.baseUrl, 'https://api-testnet.backpack.exchange');
  assert.equal(c.isMainnet, false);
  assert.equal(c.tradingEnabled, false);
  assert.equal(c.maxOrderNotionalUsd, null);
  assert.equal(c.maxDailyNotionalUsd, null);
});

test('mainnet without opt-in fails closed (network and base URL forms)', () => {
  assert.throws(() => loadConfig({ BACKPACK_NETWORK: 'mainnet' }), ConfigError);
  assert.throws(() => loadConfig({ BACKPACK_BASE_URL: 'https://api.backpack.exchange' }), ConfigError);
  const ok = loadConfig({ BACKPACK_NETWORK: 'mainnet', BACKPACK_ALLOW_MAINNET: '1' });
  assert.equal(ok.isMainnet, true);
  assert.equal(ok.baseUrl, 'https://api.backpack.exchange');
});

test('mismatched API key / seed pair is refused at load', () => {
  const seed = crypto.randomBytes(32);
  const otherVk = verifyingKeyBase64(crypto.randomBytes(32));
  assert.throws(
    () => loadConfig({ BACKPACK_TRADE_API_KEY: otherVk, BACKPACK_TRADE_SEED_B64: seed.toString('base64') }),
    /does not match/,
  );
  const good = loadConfig({
    BACKPACK_TRADE_API_KEY: verifyingKeyBase64(seed),
    BACKPACK_TRADE_SEED_B64: seed.toString('base64'),
  });
  assert.ok(good.tradeKey);
});

// ---------------------------------------------------------------------------
// Confirm tokens
// ---------------------------------------------------------------------------

test('confirm token: issue + verify round-trip', () => {
  const key = tokenKeyFromSeed(crypto.randomBytes(32));
  const tok = issueToken(key, { kind: 'order_place', symbol: 'SOL_USDC', exp: Date.now() + 60000 });
  const payload = verifyToken(key, tok, 'order_place');
  assert.equal(payload.symbol, 'SOL_USDC');
});

test('confirm token: tamper, wrong kind and expiry are all refused', () => {
  const key = tokenKeyFromSeed(crypto.randomBytes(32));
  const tok = issueToken(key, { kind: 'order_place', symbol: 'SOL_USDC', exp: Date.now() + 60000 });
  const [body, mac] = tok.split('.');
  const forged = `${Buffer.from(JSON.stringify({ kind: 'order_place', symbol: 'BTC_USDC', exp: Date.now() + 60000 })).toString('base64url')}.${mac}`;
  assert.throws(() => verifyToken(key, forged, 'order_place'), TokenError);
  assert.throws(() => verifyToken(key, tok, 'rfq_accept'), TokenError);
  const expired = issueToken(key, { kind: 'order_place', exp: Date.now() - 1000 });
  assert.throws(() => verifyToken(key, expired, 'order_place'), TokenError);
  assert.ok(body.length > 0);
});

// ---------------------------------------------------------------------------
// Tool-level gates with a fake fetch
// ---------------------------------------------------------------------------

function jsonResponse(body, status = 200) {
  return { ok: status >= 200 && status < 300, status, text: async () => JSON.stringify(body) };
}

function makeFakeFetch(routes = []) {
  const calls = [];
  const fetchImpl = async (url, init = {}) => {
    const u = new URL(url);
    calls.push({ url, pathname: u.pathname, method: init.method ?? 'GET', init });
    const route = routes.find((r) => r.method === (init.method ?? 'GET') && r.path === u.pathname);
    if (!route) throw new Error(`unexpected fetch: ${init.method ?? 'GET'} ${u.pathname}`);
    return jsonResponse(typeof route.body === 'function' ? route.body() : route.body, route.status ?? 200);
  };
  return { fetchImpl, calls };
}

function makeCtx({ env = {}, routes = [], withKeys = true } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bp-trading-test-'));
  const seed = crypto.randomBytes(32);
  const vk = verifyingKeyBase64(seed);
  const fullEnv = { BACKPACK_TRADING_CONFIG_DIR: dir, ...env };
  if (withKeys) {
    fullEnv.BACKPACK_TRADE_API_KEY = vk;
    fullEnv.BACKPACK_TRADE_SEED_B64 = seed.toString('base64');
    fullEnv.BACKPACK_READ_API_KEY = vk;
    fullEnv.BACKPACK_READ_SEED_B64 = seed.toString('base64');
  }
  const config = loadConfig(fullEnv);
  const { fetchImpl, calls } = makeFakeFetch(routes);
  const client = new BackpackClient(config, { fetchImpl });
  return { ctx: { config, client, now: () => Date.now() }, config, dir, seed, calls };
}

const ENABLED = { BACKPACK_TRADING_ENABLED: '1', BACKPACK_MAX_ORDER_NOTIONAL_USD: '1000', BACKPACK_MAX_DAILY_NOTIONAL_USD: '5000' };

test('gate: master switch off refuses trade tools before any fetch', async () => {
  const { ctx, calls } = makeCtx({ env: { BACKPACK_MAX_ORDER_NOTIONAL_USD: '1000', BACKPACK_MAX_DAILY_NOTIONAL_USD: '5000' } });
  await assert.rejects(() => tool('backpack_order_place')(ctx, { symbol: 'SOL_USDC', side: 'Bid', orderType: 'Limit', quantity: '1', price: '10', confirmToken: 'x.y' }), GateError);
  await assert.rejects(() => tool('backpack_rfq_submit')(ctx, { symbol: 'SOL_USDC_RFQ', side: 'Bid', quantity: '1' }), GateError);
  assert.equal(calls.length, 0);
});

test('gate: caps unset refuses trade tools before any fetch', async () => {
  const { ctx, calls } = makeCtx({ env: { BACKPACK_TRADING_ENABLED: '1' } });
  await assert.rejects(
    () => tool('backpack_order_preview')(ctx, { symbol: 'SOL_USDC', side: 'Bid', orderType: 'Limit', quantity: '1', price: '10' }),
    /Caps not configured/,
  );
  assert.equal(calls.length, 0);
});

test('gate: over per-order cap refuses at preview', async () => {
  const { ctx, calls } = makeCtx({ env: ENABLED });
  await assert.rejects(
    () => tool('backpack_order_preview')(ctx, { symbol: 'SOL_USDC', side: 'Bid', orderType: 'Limit', quantity: '1', price: '2000' }),
    /per-order cap/,
  );
  assert.equal(calls.length, 0);
});

test('gate: daily cap exceeded via ledger refuses at place', async () => {
  const { ctx, config, dir, calls } = makeCtx({
    env: { BACKPACK_TRADING_ENABLED: '1', BACKPACK_MAX_ORDER_NOTIONAL_USD: '1000', BACKPACK_MAX_DAILY_NOTIONAL_USD: '150' },
  });
  recordLedger(dir, { notionalUsd: 100, kind: 'order_place', ref: 'earlier' });
  const preview = await tool('backpack_order_preview')(ctx, { symbol: 'SOL_USDC', side: 'Bid', orderType: 'Limit', quantity: '1', price: '100' });
  await assert.rejects(
    () => tool('backpack_order_place')(ctx, { symbol: 'SOL_USDC', side: 'Bid', orderType: 'Limit', quantity: '1', price: '100', confirmToken: preview.confirmToken }),
    /Daily cap exceeded/,
  );
  assert.equal(calls.length, 0);
  assert.ok(config);
});

test('gate: confirm-token binding mismatch refuses at place', async () => {
  const { ctx, calls } = makeCtx({ env: ENABLED });
  const preview = await tool('backpack_order_preview')(ctx, { symbol: 'SOL_USDC', side: 'Bid', orderType: 'Limit', quantity: '1', price: '100' });
  await assert.rejects(
    () => tool('backpack_order_place')(ctx, { symbol: 'SOL_USDC', side: 'Bid', orderType: 'Limit', quantity: '2', price: '100', confirmToken: preview.confirmToken }),
    TokenError,
  );
  assert.equal(calls.length, 0);
});

test('gate: expired confirm token refuses at place', async () => {
  const { ctx, seed, calls } = makeCtx({ env: ENABLED });
  const stale = issueToken(tokenKeyFromSeed(seed), {
    kind: 'order_place', symbol: 'SOL_USDC', side: 'Bid', orderType: 'Limit', quantity: '1', price: '100', notionalUsd: 100, exp: Date.now() - 1000,
  });
  await assert.rejects(
    () => tool('backpack_order_place')(ctx, { symbol: 'SOL_USDC', side: 'Bid', orderType: 'Limit', quantity: '1', price: '100', confirmToken: stale }),
    TokenError,
  );
  assert.equal(calls.length, 0);
});

test('gate: Immediate execution mode is refused', async () => {
  const { ctx, calls } = makeCtx({ env: ENABLED });
  await assert.rejects(
    () => tool('backpack_rfq_submit')(ctx, { symbol: 'SOL_USDC_RFQ', side: 'Bid', quantity: '1', executionMode: 'Immediate' }),
    /Immediate/,
  );
  assert.equal(calls.length, 0);
});

test('gate: read tool without a read key refuses', async () => {
  const { ctx, calls } = makeCtx({ withKeys: false });
  await assert.rejects(() => tool('backpack_balances')(ctx, {}), GateError);
  assert.equal(calls.length, 0);
});

// ---------------------------------------------------------------------------
// Happy paths against the fake fetch
// ---------------------------------------------------------------------------

test('read tool: balances returns the API payload and sends a verifiable signature', async () => {
  const routes = [{ method: 'GET', path: '/api/v1/capital', body: { SOL: { available: '1.5', locked: '0' } } }];
  const { ctx, calls, seed } = makeCtx({ routes });
  const out = await tool('backpack_balances')(ctx, {});
  assert.deepEqual(out, { SOL: { available: '1.5', locked: '0' } });
  assert.equal(calls.length, 1);
  const headers = calls[0].init.headers;
  const vk = verifyingKeyFromSeed(seed);
  assert.equal(headers['X-API-Key'], vk.toString('base64'));
  const str = canonicalSigningString('balanceQuery', {}, Number(headers['X-Timestamp']), Number(headers['X-Window']));
  assert.equal(verifyString(vk, Buffer.from(headers['X-Signature'], 'base64'), str), true);
});

test('order flow: preview → place signs correctly, verifies, ledgers, audits without secrets', async () => {
  const routes = [
    { method: 'POST', path: '/api/v1/order', body: { id: 'ord1', symbol: 'SOL_USDC', status: 'New' } },
    { method: 'GET', path: '/api/v1/order', body: { id: 'ord1', symbol: 'SOL_USDC', status: 'New', executedQuantity: '0' } },
  ];
  const { ctx, dir, seed, calls } = makeCtx({ env: ENABLED, routes });
  const preview = await tool('backpack_order_preview')(ctx, { symbol: 'SOL_USDC', side: 'Bid', orderType: 'Limit', quantity: '2', price: '50' });
  assert.equal(preview.notionalUsd, 100);

  const placed = await tool('backpack_order_place')(ctx, {
    symbol: 'SOL_USDC', side: 'Bid', orderType: 'Limit', quantity: '2', price: '50', confirmToken: preview.confirmToken,
  });
  assert.equal(placed.placed.id, 'ord1');
  assert.equal(placed.verification.status, 'order_recorded');
  assert.equal(dailyTotalUsd(dir), 100);

  // The signature on the wire verifies against the canonical string.
  const post = calls.find((c) => c.method === 'POST');
  const bodyParams = JSON.parse(post.init.body);
  const headers = post.init.headers;
  const str = canonicalSigningString('orderExecute', bodyParams, Number(headers['X-Timestamp']), Number(headers['X-Window']));
  assert.equal(verifyString(verifyingKeyFromSeed(seed), Buffer.from(headers['X-Signature'], 'base64'), str), true);

  // Audit log contains the instruction but never the seed or the signature.
  const audit = fs.readFileSync(path.join(dir, 'audit.jsonl'), 'utf8');
  assert.match(audit, /orderExecute/);
  assert.ok(!audit.includes(seed.toString('base64')), 'audit must not contain the seed');
  assert.ok(!audit.includes(headers['X-Signature']), 'audit must not contain a signature');
});

function rfqRoutes(symbol, { expired = false } = {}) {
  const now = Date.now();
  return [
    { method: 'POST', path: '/api/v1/rfq', body: { rfqId: 'r1', symbol, side: 'Bid', status: 'New' } },
    { method: 'GET', path: '/api/v1/ticker', body: { lastPrice: '50' } },
    {
      method: 'GET', path: '/api/v1/rfq',
      body: { rfqId: 'r1', symbol, side: 'Bid', quantity: '2', submissionTime: now - 1000, expiryTime: expired ? now - 1000 : now + 60000, status: 'New' },
    },
    { method: 'GET', path: '/api/v1/rfq/quote', body: { quoteId: 'q1', rfqId: 'r1', bidPrice: '49', askPrice: '50', status: 'New' } },
    { method: 'GET', path: '/api/v1/account', body: { spotTakerFee: '0.001', spotMakerFee: '0.0005' } },
    { method: 'POST', path: '/api/v1/rfq/accept', body: { quoteId: 'q1', status: 'Filled' } },
    { method: 'GET', path: '/wapi/v1/history/rfq/fill', body: [{ rfqId: 'r1', quoteId: 'q1', symbol, side: 'Bid', fillPrice: '50.05' }] },
  ];
}

test('RFQ flow: submit → quote terms (fee-inclusive) → accept verifies from fill history', async () => {
  const { ctx, dir } = makeCtx({ env: ENABLED, routes: rfqRoutes('SOL_USDC_RFQ') });
  const sub = await tool('backpack_rfq_submit')(ctx, { symbol: 'SOL_USDC_RFQ', side: 'Bid', quantity: '2' });
  assert.equal(sub.submitted.rfqId, 'r1');

  const terms = await tool('backpack_rfq_quote')(ctx, { rfqId: 'r1' });
  assert.equal(terms.quoteId, 'q1');
  assert.equal(terms.takerPrice, '50.05'); // ask 50 + 0.1% taker fee
  assert.equal(terms.notionalUsd, 100.1);

  // Wrong quoteId against the token refuses before any accept call.
  await assert.rejects(() => tool('backpack_rfq_accept')(ctx, { quoteId: 'qX', confirmToken: terms.confirmToken }), GateError);

  const accepted = await tool('backpack_rfq_accept')(ctx, { quoteId: 'q1', confirmToken: terms.confirmToken });
  assert.equal(accepted.accepted.status, 'Filled');
  assert.equal(accepted.verification.status, 'fill_recorded');
  assert.equal(accepted.verification.fills[0].fillPrice, '50.05');
  assert.equal(dailyTotalUsd(dir), 100.1);
});

test('RFQ quote: stock symbols carry the binding warning', async () => {
  const { ctx } = makeCtx({ env: ENABLED, routes: rfqRoutes('AAPL.US_USDC_RFQ') });
  await tool('backpack_rfq_submit')(ctx, { symbol: 'AAPL.US_USDC_RFQ', side: 'Bid', quantity: '2', price: '50' });
  const terms = await tool('backpack_rfq_quote')(ctx, { rfqId: 'r1' });
  assert.ok(terms.warnings.some((w) => w.startsWith('BINDING:')), 'stock terms must warn that acceptance is binding');
});

test('RFQ quote: expired RFQ (past W) is refused', async () => {
  const { ctx } = makeCtx({ env: ENABLED, routes: rfqRoutes('SOL_USDC_RFQ', { expired: true }) });
  await assert.rejects(() => tool('backpack_rfq_quote')(ctx, { rfqId: 'r1' }), /expired/);
});
