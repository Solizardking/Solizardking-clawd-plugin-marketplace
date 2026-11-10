---
name: imperial-position-management
description: Inspect, reduce, and close Imperial-routed positions across Phoenix, Flash, Jupiter, and GMTrade, with Phoenix preferred by default.
---

# Imperial Position Management

## Owner approval (required)

This skill is read-only or dry-run by default. Prefer devnet or testnet first where those networks apply.

Before any mainnet transaction, order, launch, or signature, show the owner the exact transaction or order — venue, market, side, size/notional, price/slippage, fees, destination, and signer — and get an explicit yes for that exact one. One approval covers one transaction only.

Autonomous, loop, auto_execute, mirror, or interval modes must still ask per transaction, or stay in paper/dry-run. Prefer user-device signing (OWS or the owner's wallet) over server-held keys. Never print or log keys.


Use for:

- listing open positions
- checking current exposure before new trades
- sending close-side `action=1` market orders
- reviewing whether residue sync is needed after a close

Rules:

- Match `profileIndex` to the live position.
- Prefer explicit user input for symbol, side, venue, and notional when closing.
- After non-USDC collateral venues, consider `/passthrough/users/{wallet}/profiles/{index}/sync`.
