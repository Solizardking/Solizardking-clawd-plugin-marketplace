// Backpack Exchange — ED25519 canonical signing (zero-dependency, node:crypto).
//
// Canonical signing string (Backpack docs + official SDKs, verified against
// the reference implementation in the local-backpack skill,
// bin/backpack_sign.py):
//
//   instruction=<name>&<params sorted alphabetically as k=v>&timestamp=<ms>&window=<ms>
//
// - Only parameters actually sent are included.
// - `window` is ALWAYS present in the signing string (default 5000 ms).
// - Numbers never use exponent notation; booleans serialize as true/false.
// - GET: params come from the query string. POST/DELETE: params from the body.
//
// This module never sees a network socket and never logs anything. Seeds are
// passed in as Buffers by the caller and are never persisted here.

import crypto from 'node:crypto';

// DER prefixes for wrapping a raw 32-byte Ed25519 seed / verifying key.
const PKCS8_PREFIX = Buffer.from('302e020100300506032b657004220420', 'hex');
const SPKI_PREFIX = Buffer.from('302a300506032b6570032100', 'hex');

export function formatParamValue(value) {
  if (typeof value === 'string') return value;
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new Error(`Cannot sign non-finite number: ${value}`);
    }
    return expandExponential(String(value));
  }
  throw new Error(`Cannot sign param value of type ${typeof value}`);
}

function expandExponential(s) {
  if (!/[eE]/.test(s)) return s;
  // Shift the decimal point manually (Number#toFixed itself returns the
  // exponential form for |x| >= 1e21, so it cannot be used here).
  const [mantissa, expStr] = s.split(/[eE]/);
  const exp = parseInt(expStr, 10);
  const negative = mantissa.startsWith('-');
  const m = negative ? mantissa.slice(1) : mantissa;
  const [intPart, fracPart = ''] = m.split('.');
  const digits = intPart + fracPart;
  const decimalPos = intPart.length + exp;
  let out;
  if (decimalPos <= 0) {
    out = `0.${'0'.repeat(-decimalPos)}${digits}`;
  } else if (decimalPos >= digits.length) {
    out = digits + '0'.repeat(decimalPos - digits.length);
  } else {
    out = `${digits.slice(0, decimalPos)}.${digits.slice(decimalPos)}`;
  }
  if (out.includes('.')) out = out.replace(/0+$/, '').replace(/\.$/, '');
  return (negative ? '-' : '') + out;
}

// Build the canonical signing string. `instruction` may be null for the few
// endpoints where Backpack documents no instruction name; then the string is
// params + timestamp + window only.
export function canonicalSigningString(instruction, params, timestampMs, windowMs = 5000) {
  const parts = [];
  if (instruction) parts.push(`instruction=${instruction}`);
  const clean = {};
  for (const [k, v] of Object.entries(params ?? {})) {
    if (v === undefined || v === null) continue; // only params actually sent
    clean[k] = v;
  }
  for (const k of Object.keys(clean).sort()) {
    parts.push(`${k}=${formatParamValue(clean[k])}`);
  }
  parts.push(`timestamp=${timestampMs}`);
  parts.push(`window=${windowMs}`);
  return parts.join('&');
}

export function seedFromBase64(seedB64, label = 'seed') {
  let buf;
  try {
    buf = Buffer.from(String(seedB64), 'base64');
  } catch {
    throw new Error(`${label}: not valid base64`);
  }
  if (buf.length !== 32) {
    throw new Error(`${label}: expected a 32-byte Ed25519 seed, got ${buf.length} bytes`);
  }
  return buf;
}

export function privateKeyFromSeed(seedBytes) {
  if (!Buffer.isBuffer(seedBytes) || seedBytes.length !== 32) {
    throw new Error('Ed25519 seed must be a 32-byte Buffer');
  }
  return crypto.createPrivateKey({
    key: Buffer.concat([PKCS8_PREFIX, seedBytes]),
    format: 'der',
    type: 'pkcs8',
  });
}

// Raw 32-byte verifying key (Buffer) derived from a 32-byte seed.
export function verifyingKeyFromSeed(seedBytes) {
  const pub = crypto.createPublicKey(privateKeyFromSeed(seedBytes));
  const spki = pub.export({ format: 'der', type: 'spki' });
  return Buffer.from(spki).subarray(spki.length - 32);
}

export function verifyingKeyBase64(seedBytes) {
  return verifyingKeyFromSeed(seedBytes).toString('base64');
}

// Sign a canonical string with the seed. Returns base64 signature.
// The API key for the headers is the base64 verifying key (see
// verifyingKeyBase64) — Backpack API keys ARE base64 verifying keys.
export function signString(seedBytes, signingString) {
  const key = privateKeyFromSeed(seedBytes);
  const sig = crypto.sign(null, Buffer.from(signingString, 'utf8'), key);
  return sig.toString('base64');
}

export function verifyString(verifyingKeyBytes, signatureBytes, signingString) {
  const pub = crypto.createPublicKey({
    key: Buffer.concat([SPKI_PREFIX, Buffer.from(verifyingKeyBytes)]),
    format: 'der',
    type: 'spki',
  });
  return crypto.verify(
    null,
    Buffer.from(signingString, 'utf8'),
    pub,
    Buffer.from(signatureBytes),
  );
}

// Build the four Backpack auth headers for one request. Signs at call time —
// signatures expire with the window, so never pre-build these.
export function authHeaders(seedBytes, instruction, params, timestampMs, windowMs = 5000) {
  const signingString = canonicalSigningString(instruction, params, timestampMs, windowMs);
  return {
    'X-API-Key': verifyingKeyBase64(seedBytes),
    'X-Signature': signString(seedBytes, signingString),
    'X-Timestamp': String(timestampMs),
    'X-Window': String(windowMs),
  };
}
