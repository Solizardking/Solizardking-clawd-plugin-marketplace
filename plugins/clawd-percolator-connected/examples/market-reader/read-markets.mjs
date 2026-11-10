#!/usr/bin/env node
// Read-only: GET verified public market endpoints. Never signs or posts transactions.
const TIMEOUT_MS = 20_000;

async function getJson(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { accept: 'application/json', 'user-agent': 'percolator-connected-market-reader/0.1.0' },
      signal: ctrl.signal,
    });
    const text = await res.text();
    let body = text;
    try { body = JSON.parse(text); } catch {}
    return { url, status: res.status, ok: res.ok, body };
  } finally {
    clearTimeout(t);
  }
}

function summarizeClawd(body) {
  if (!body || typeof body !== 'object') return body;
  const markets = Array.isArray(body.markets)
    ? body.markets.map((m) => ({
      name: m.name, symbol: m.symbol, tradable: m.tradable, market: m.market, perp: m.perp,
    }))
    : undefined;
  return { registry: body.registry, count: body.count, trading: body.trading, programs: body.programs, markets };
}

function summarizePumpai(body) {
  if (!body || typeof body !== 'object') return body;
  const markets = Array.isArray(body.markets)
    ? body.markets.map((m) => ({
      slab: m.slab, oracle: m.oracle, priceE6: m.priceE6, openInterest: m.openInterest,
      insurance: m.insurance, maxLeverage: m.maxLeverage, paused: m.paused, resolved: m.resolved,
    }))
    : undefined;
  return { ok: body.ok, cluster: body.cluster, programId: body.programId, count: body.count, markets };
}

function summarizeImperialStatus(body) {
  if (!body || typeof body !== 'object') return body;
  const phases = {};
  for (const row of body.markets || []) {
    const p = row.phase || 'unknown';
    phases[p] = (phases[p] || 0) + 1;
  }
  return { enabled: body.enabled, marketCount: (body.markets || []).length, phases };
}

function summarizeImperialMarkets(body) {
  const rows = Array.isArray(body) ? body : [];
  return {
    count: rows.length,
    sample: rows.slice(0, 5).map((m) => ({
      symbol: m.symbol, maxLeverage: m.maxLeverage, markPrice: m.markPrice,
      volume24hUsd: m.volume24hUsd, openInterest: m.openInterest,
    })),
  };
}

const urls = {
  clawdMarkets: 'https://percolator.tech/api/markets',
  musebookHealth: 'https://percolator.musebook.trade/api/health',
  pumpaiPerps: 'https://pumpai.ai/api/perps',
  pumpaiMarkets: 'https://pumpai.ai/api/perps/markets?cluster=devnet',
  imperialStatus: 'https://api.imperial.trade/api/v1/armada/status',
  imperialMarkets: 'https://api.imperial.trade/api/v1/armada/markets',
};

const owner = process.env.PERCOLATOR_POSITION_OWNER || '';
const market = process.env.PERCOLATOR_POSITION_MARKET || '';
if (owner && market) {
  urls.position = `https://percolator.clawdchain.trade/api/position?market=${encodeURIComponent(market)}&owner=${encodeURIComponent(owner)}`;
}

const out = { fetchedAt: new Date().toISOString(), readOnly: true, results: {} };
for (const [key, url] of Object.entries(urls)) {
  const r = await getJson(url);
  let summary = r.body;
  if (r.ok) {
    if (key === 'clawdMarkets') summary = summarizeClawd(r.body);
    else if (key === 'pumpaiMarkets') summary = summarizePumpai(r.body);
    else if (key === 'imperialStatus') summary = summarizeImperialStatus(r.body);
    else if (key === 'imperialMarkets') summary = summarizeImperialMarkets(r.body);
    else if (key === 'musebookHealth' && r.body && typeof r.body === 'object') {
      summary = { ok: r.body.ok, app: r.body.app, backend: r.body.backend, network: r.body.network, mainnetStatus: r.body.mainnet?.status };
    }
  }
  out.results[key] = { url, status: r.status, ok: r.ok, summary };
}

const failed = Object.values(out.results).filter((r) => !r.ok);
console.log(JSON.stringify(out, null, 2));
if (failed.length) {
  console.error(`read-only fetch had ${failed.length} non-OK response(s)`);
  process.exit(1);
}
