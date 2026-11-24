// Confirm tokens — the fail-closed bridge between "terms shown to the user"
// and "value-moving call signed".
//
// A preview/quote step returns exact terms plus a confirm token. The token is
// an HMAC-SHA256 over a JSON payload, keyed by SHA-256 of the trade seed (so
// tokens are bound to the trade account without ever exposing the seed, and
// cannot be forged by anything that doesn't hold the seed). The execute step
// must present the token; verification re-checks the signature, the kind, the
// binding fields and the expiry BEFORE any signing happens. A stale or
// mismatched token is a refusal, not a warning.

import crypto from 'node:crypto';

export class TokenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TokenError';
  }
}

export function tokenKeyFromSeed(seedBytes) {
  return crypto.createHash('sha256').update(seedBytes).digest();
}

function b64url(buf) {
  return Buffer.from(buf).toString('base64url');
}

export function issueToken(tokenKey, payload) {
  if (!payload || typeof payload !== 'object' || !payload.kind) {
    throw new TokenError('Token payload must include a kind');
  }
  if (typeof payload.exp !== 'number') {
    throw new TokenError('Token payload must include a numeric exp (ms epoch)');
  }
  const body = b64url(JSON.stringify(payload));
  const mac = crypto.createHmac('sha256', tokenKey).update(body).digest();
  return `${body}.${b64url(mac)}`;
}

export function verifyToken(tokenKey, token, expectedKind, nowMs = Date.now()) {
  if (typeof token !== 'string' || !token.includes('.')) {
    throw new TokenError('Missing or malformed confirm token — no token, no signature (fail-closed).');
  }
  const [body, macB64] = token.split('.');
  const expectedMac = crypto.createHmac('sha256', tokenKey).update(body).digest();
  let actualMac;
  try {
    actualMac = Buffer.from(macB64, 'base64url');
  } catch {
    throw new TokenError('Malformed confirm token signature.');
  }
  if (actualMac.length !== expectedMac.length || !crypto.timingSafeEqual(actualMac, expectedMac)) {
    throw new TokenError('Confirm token signature mismatch — refusing. Re-run the quote/preview step and confirm the exact terms shown.');
  }
  let payload;
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    throw new TokenError('Malformed confirm token payload.');
  }
  if (payload.kind !== expectedKind) {
    throw new TokenError(`Confirm token kind is ${JSON.stringify(payload.kind)}, expected ${JSON.stringify(expectedKind)} — refusing.`);
  }
  if (typeof payload.exp !== 'number' || nowMs > payload.exp) {
    throw new TokenError('Confirm token expired — the terms are stale. Re-run the quote/preview step for fresh terms.');
  }
  return payload;
}

// Compare a set of binding fields between the token payload and the execute
// call's arguments. Values are compared as normalized strings; a field absent
// on both sides counts as equal.
export function assertBindingMatches(payload, args, fields) {
  for (const field of fields) {
    const a = payload[field];
    const b = args[field];
    const na = a === undefined || a === null ? undefined : String(a);
    const nb = b === undefined || b === null ? undefined : String(b);
    if (na !== nb) {
      throw new TokenError(
        `Confirm token binding mismatch on ${field}: token has ${JSON.stringify(na)}, call has ${JSON.stringify(nb)} — refusing. The confirmed terms must match the executed terms exactly.`,
      );
    }
  }
}
