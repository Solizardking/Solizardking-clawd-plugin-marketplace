---
name: "imperial-trade-execution"
description: "Safe Imperial live execution: authenticated market orders, Phoenix-first venue preference, profile-aware routing, and post-trade verification."
---

# Imperial Trade Execution

## Owner approval (required)

This skill is read-only or dry-run by default. Prefer devnet or testnet first where those networks apply.

Before any mainnet transaction, order, launch, or signature, show the owner the exact transaction or order — venue, market, side, size/notional, price/slippage, fees, destination, and signer — and get an explicit yes for that exact one. One approval covers one transaction only.

Autonomous, loop, auto_execute, mirror, or interval modes must still ask per transaction, or stay in paper/dry-run. Prefer user-device signing (OWS or the owner's wallet) over server-held keys. Never print or log keys.


Primary endpoint: `POST /api/v1/mobile/orders`

Default live open:

- `action=0`
- `orderType=0`
- `fundingStatus=0`
- `underwriter=2` for Phoenix unless requested otherwise

Default live close:

- `action=1`
- `orderType=0`
- same wallet and profile as the open position

Always verify:

- response `success`
- transaction `signature`
- follow-up state via `/positions` and `/orders`
