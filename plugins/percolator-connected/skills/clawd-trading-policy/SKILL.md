---
name: clawd-trading-policy
description: Enforce owner-signed exact-order approval and deny-by-default Imperial, Phoenix, and OWS trading policies.
---
# CLAWD Trading Policy

Default to research, paper, and dry-run. A model never signs or holds an owner's secret. Live execution requires a separately deployed authenticated gateway, an active per-user delegated account, the user's one-time Ed25519 approval of the **exact** order body, current margin/price/position checks and server-side guardrails.

Reject unsigned or expired intents, reused approval IDs, wrong signer, wrong wallet/profile, disallowed asset or venue, over-limit notional/leverage/slippage, stale marks, unsafe chain, ambiguous upstream results or missing auth. The existing fixed string `CONFIRM_LIVE_ORDER` is **not** a signature.

Never send or log a private key, seed phrase, OWS passphrase, agent token, Imperial JWT or Phoenix JWT to ChatGPT. Do not expose owner-passphrase bypass to an agent. Production multi-replica execution requires shared atomic replay/budget storage, account isolation and independent security review.

Implementation repo: https://github.com/Solizardking/imperial-perps-mcp-server ; source-only work on branch `feat/clawd-signed-policy-phoenix-wallet`.
