// Configuration for the backpack-trading server — env only, fail-closed.
//
// Keys come ONLY from the process environment (populated by the user's own
// MCP client config / shell, sourced from their local secure storage). They
// are never read from files in this repo, never written anywhere, and never
// logged. The seed env values are base64 32-byte Ed25519 seeds; the API key
// env values are the matching base64 verifying keys (Backpack's key model).
// loadConfig verifies each pair matches and refuses to start otherwise.

import os from 'node:os';
import path from 'node:path';
import { seedFromBase64, verifyingKeyBase64 } from './signing.mjs';

export const TESTNET_BASE_URL = 'https://api-testnet.backpack.exchange';
export const MAINNET_BASE_URL = 'https://api.backpack.exchange';

export class ConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConfigError';
  }
}

function parsePositiveFloat(raw, name) {
  if (raw === undefined || raw === '') return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) {
    throw new ConfigError(`${name} must be a positive number, got ${JSON.stringify(raw)}`);
  }
  return n;
}

function loadKeyPair(env, apiKeyName, seedName) {
  const apiKey = env[apiKeyName];
  const seedB64 = env[seedName];
  if (!apiKey && !seedB64) return null;
  if (!apiKey || !seedB64) {
    throw new ConfigError(
      `${apiKeyName} and ${seedName} must be set together (got only one of them)`,
    );
  }
  const seed = seedFromBase64(seedB64, seedName);
  const derived = verifyingKeyBase64(seed);
  if (derived !== apiKey) {
    throw new ConfigError(
      `${apiKeyName} does not match the verifying key derived from ${seedName} — refusing to start with a mismatched key pair`,
    );
  }
  return { apiKey, seed };
}

export function resolveBaseUrl(env) {
  const allowMainnet = env.BACKPACK_ALLOW_MAINNET === '1';
  const network = (env.BACKPACK_NETWORK || 'testnet').toLowerCase();
  if (network !== 'testnet' && network !== 'mainnet') {
    throw new ConfigError(`BACKPACK_NETWORK must be "testnet" or "mainnet", got ${JSON.stringify(env.BACKPACK_NETWORK)}`);
  }
  let baseUrl = env.BACKPACK_BASE_URL || (network === 'mainnet' ? MAINNET_BASE_URL : TESTNET_BASE_URL);
  baseUrl = baseUrl.replace(/\/+$/, '');
  let host;
  try {
    host = new URL(baseUrl).host;
  } catch {
    throw new ConfigError(`BACKPACK_BASE_URL is not a valid URL: ${JSON.stringify(env.BACKPACK_BASE_URL)}`);
  }
  if (host === 'api.backpack.exchange' && !allowMainnet) {
    throw new ConfigError(
      'Mainnet base URL selected but BACKPACK_ALLOW_MAINNET is not "1" — refusing (fail-closed). ' +
        'Mainnet is a separate, deliberate opt-in; the default is testnet.',
    );
  }
  return { baseUrl, isMainnet: host === 'api.backpack.exchange', network };
}

export function loadConfig(env = process.env) {
  const { baseUrl, isMainnet } = resolveBaseUrl(env);

  const windowMsRaw = env.BACKPACK_WINDOW_MS;
  let windowMs = 5000;
  if (windowMsRaw !== undefined && windowMsRaw !== '') {
    windowMs = Number(windowMsRaw);
    if (!Number.isInteger(windowMs) || windowMs < 1 || windowMs > 60000) {
      throw new ConfigError(`BACKPACK_WINDOW_MS must be an integer between 1 and 60000, got ${JSON.stringify(windowMsRaw)}`);
    }
  }

  const tradingEnabled =
    env.BACKPACK_TRADING_ENABLED === '1' ||
    (typeof env.BACKPACK_TRADING_ENABLED === 'string' &&
      env.BACKPACK_TRADING_ENABLED.toLowerCase() === 'true');

  const configDir =
    env.BACKPACK_TRADING_CONFIG_DIR ||
    path.join(os.homedir(), '.config', 'backpack-trading');

  return {
    baseUrl,
    isMainnet,
    windowMs,
    tradingEnabled,
    maxOrderNotionalUsd: parsePositiveFloat(env.BACKPACK_MAX_ORDER_NOTIONAL_USD, 'BACKPACK_MAX_ORDER_NOTIONAL_USD'),
    maxDailyNotionalUsd: parsePositiveFloat(env.BACKPACK_MAX_DAILY_NOTIONAL_USD, 'BACKPACK_MAX_DAILY_NOTIONAL_USD'),
    readKey: loadKeyPair(env, 'BACKPACK_READ_API_KEY', 'BACKPACK_READ_SEED_B64'),
    tradeKey: loadKeyPair(env, 'BACKPACK_TRADE_API_KEY', 'BACKPACK_TRADE_SEED_B64'),
    configDir,
  };
}

// Gate helpers — every check here runs locally BEFORE any signing.

export class GateError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GateError';
  }
}

export function assertReadReady(config) {
  if (!config.readKey) {
    throw new GateError(
      'Read key not configured: set BACKPACK_READ_API_KEY and BACKPACK_READ_SEED_B64 ' +
        '(a Read Only key created in Backpack\u2019s web UI) in the server environment.',
    );
  }
}

export function assertTradeKeyReady(config) {
  if (!config.tradeKey) {
    throw new GateError(
      'Trade key not configured: set BACKPACK_TRADE_API_KEY and BACKPACK_TRADE_SEED_B64 ' +
        '(a trade key on its own sub-account, withdrawals never enabled) in the server environment.',
    );
  }
}

export function assertTradingEnabled(config) {
  if (!config.tradingEnabled) {
    throw new GateError(
      'Trading is disabled (master switch off). Set BACKPACK_TRADING_ENABLED=1 in the ' +
        'server environment to enable the trade tools. Installing the plugin never enables trading.',
    );
  }
}

export function assertCapsConfigured(config) {
  if (config.maxOrderNotionalUsd === null || config.maxDailyNotionalUsd === null) {
    throw new GateError(
      'Caps not configured: set BACKPACK_MAX_ORDER_NOTIONAL_USD and BACKPACK_MAX_DAILY_NOTIONAL_USD. ' +
        'No caps named, no trading (fail-closed).',
    );
  }
}

// Full gate for any value-moving or trade-flow call.
export function assertTradeReady(config, { requireCaps = true } = {}) {
  assertTradingEnabled(config);
  assertTradeKeyReady(config);
  if (requireCaps) assertCapsConfigured(config);
}

export function assertWithinPerOrderCap(config, notionalUsd) {
  if (typeof notionalUsd !== 'number' || !Number.isFinite(notionalUsd) || notionalUsd < 0) {
    throw new GateError(`Cannot size this trade (notional ${notionalUsd}) — refusing (fail-closed).`);
  }
  if (notionalUsd > config.maxOrderNotionalUsd) {
    throw new GateError(
      `Notional $${notionalUsd} exceeds the per-order cap of $${config.maxOrderNotionalUsd} — refusing before signing.`,
    );
  }
}
