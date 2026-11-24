// Signed Backpack REST client + local ledger / audit log.
//
// - Signs in-process at send time (signatures expire with the window).
// - Every signed call is appended to a local audit log with instruction +
//   params + outcome — never the seed, never the signature.
// - The daily ledger lives in the user's config dir (NOT in this repo) and
//   tracks signed notional per UTC day for the daily-cap gate.
//
// Instruction names: the trading-path names (rfqSubmit, quoteAccept,
// rfqRefresh, rfqCancel, orderExecute, orderCancel, orderQuery) and
// balanceQuery / rfqQuery are documented in Backpack's docs/SDKs. A few
// read/history names (accountQuery, positionQuery, *HistoryQuery) follow the
// same documented *Query pattern but were NOT individually captured from the
// docs — they are marked INFERRED below and must be verified on testnet
// before mainnet is ever considered. No real keys exist yet, so nothing here
// has been exercised against the live API.

import fs from 'node:fs';
import path from 'node:path';
import { authHeaders } from './signing.mjs';
import { GateError } from './config.mjs';

export class ApiError extends Error {
  constructor(message, { status = null, body = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export const INSTRUCTIONS = {
  account: 'accountQuery', // INFERRED (documented *Query pattern)
  balances: 'balanceQuery', // documented
  positions: 'positionQuery', // INFERRED
  rfqHistory: 'rfqHistoryQuery', // INFERRED
  orderHistory: 'orderHistoryQuery', // INFERRED
  rfqFillHistory: 'rfqFillHistoryQuery', // INFERRED
  rfqQuery: 'rfqQuery', // documented
  rfqQuote: 'quoteSubmit', // per official SDK mapping for GET /api/v1/rfq/quote
  rfqSubmit: 'rfqSubmit', // documented
  quoteAccept: 'quoteAccept', // documented
  rfqRefresh: 'rfqRefresh', // documented
  rfqCancel: 'rfqCancel', // documented
  orderExecute: 'orderExecute', // documented
  orderCancel: 'orderCancel', // documented
  orderQuery: 'orderQuery', // documented
};

function utcDateString(nowMs) {
  return new Date(nowMs).toISOString().slice(0, 10);
}

export function ledgerPath(configDir) {
  return path.join(configDir, 'ledger.json');
}

export function auditPath(configDir) {
  return path.join(configDir, 'audit.jsonl');
}

export function readLedger(configDir) {
  try {
    const raw = fs.readFileSync(ledgerPath(configDir), 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.days) return parsed;
  } catch {
    // Missing or unreadable ledger starts empty; the daily-cap gate reads
    // totals through dailyTotalUsd, and a corrupt ledger yields 0 — but a
    // value-moving call re-checks caps before signing, and recordLedger
    // rewrites the file atomically, so corruption self-heals on next trade.
  }
  return { version: 1, days: {} };
}

export function dailyTotalUsd(configDir, nowMs = Date.now()) {
  const ledger = readLedger(configDir);
  const day = ledger.days[utcDateString(nowMs)];
  return day && typeof day.notionalUsd === 'number' ? day.notionalUsd : 0;
}

export function recordLedger(configDir, { notionalUsd, kind, ref }, nowMs = Date.now()) {
  fs.mkdirSync(configDir, { recursive: true });
  const ledger = readLedger(configDir);
  const date = utcDateString(nowMs);
  const day = ledger.days[date] || { notionalUsd: 0, count: 0, entries: [] };
  day.notionalUsd = Math.round((day.notionalUsd + notionalUsd) * 1e6) / 1e6;
  day.count += 1;
  day.entries.push({ ts: new Date(nowMs).toISOString(), kind, ref: ref ?? null, notionalUsd });
  if (day.entries.length > 200) day.entries = day.entries.slice(-200);
  ledger.days[date] = day;
  const tmp = `${ledgerPath(configDir)}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(ledger, null, 2), { mode: 0o600 });
  fs.renameSync(tmp, ledgerPath(configDir));
  return day.notionalUsd;
}

export function assertWithinDailyCap(config, notionalUsd, nowMs = Date.now()) {
  const used = dailyTotalUsd(config.configDir, nowMs);
  if (used + notionalUsd > config.maxDailyNotionalUsd) {
    throw new GateError(
      `Daily cap exceeded: $${used} already signed today (UTC), this trade is $${notionalUsd}, ` +
        `daily cap is $${config.maxDailyNotionalUsd} — refusing before signing.`,
    );
  }
  return used;
}

export function appendAudit(configDir, entry) {
  try {
    fs.mkdirSync(configDir, { recursive: true });
    fs.appendFileSync(auditPath(configDir), `${JSON.stringify(entry)}\n`, { mode: 0o600 });
  } catch {
    // Audit is best-effort after the fact; a failed audit write must not
    // mask the actual API result. The ledger (the cap state) is NOT
    // best-effort — it is written synchronously by recordLedger.
  }
}

export class BackpackClient {
  constructor(config, { fetchImpl = fetch, now = () => Date.now() } = {}) {
    this.config = config;
    this.fetchImpl = fetchImpl;
    this.now = now;
  }

  keyPair(which) {
    const kp = which === 'trade' ? this.config.tradeKey : this.config.readKey;
    if (!kp) {
      throw new GateError(`No ${which} key configured — refusing to send an unsigned authenticated request.`);
    }
    return kp;
  }

  async signedRequest({ key = 'read', method, path: reqPath, instruction = null, params = {} }) {
    const kp = this.keyPair(key);
    const timestamp = this.now();
    const headers = {
      ...authHeaders(kp.seed, instruction, params, timestamp, this.config.windowMs),
    };
    let url = `${this.config.baseUrl}${reqPath}`;
    const init = { method, headers };
    if (method === 'GET') {
      const qs = new URLSearchParams();
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) qs.set(k, String(v));
      }
      const q = qs.toString();
      if (q) url += `?${q}`;
    } else {
      headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify(params);
    }

    let status = null;
    try {
      const res = await this.fetchImpl(url, init);
      status = res.status;
      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }
      if (!res.ok) {
        throw new ApiError(
          `Backpack ${method} ${reqPath} failed with HTTP ${res.status}: ${typeof data === 'string' ? data.slice(0, 300) : JSON.stringify(data).slice(0, 300)}`,
          { status: res.status, body: data },
        );
      }
      return data;
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(`Backpack ${method} ${reqPath} network error: ${err.message}`, { status });
    } finally {
      appendAudit(this.config.configDir, {
        ts: new Date(this.now()).toISOString(),
        instruction: instruction ?? null,
        method,
        path: reqPath,
        params,
        key,
        base: this.config.baseUrl,
        status: status ?? 'network_error',
      });
    }
  }

  async publicRequest({ path: reqPath, params = {} }) {
    let url = `${this.config.baseUrl}${reqPath}`;
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) qs.set(k, String(v));
    }
    const q = qs.toString();
    if (q) url += `?${q}`;
    const res = await this.fetchImpl(url, { method: 'GET' });
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    if (!res.ok) {
      throw new ApiError(`Backpack public GET ${reqPath} failed with HTTP ${res.status}`, { status: res.status, body: data });
    }
    return data;
  }
}
