---
name: "imperial-execution-modes"
description: "Execution-mode taxonomy for Imperial router workflows in this repo: observe, route-check, paper/spec, live single-shot, and external durable runner."
---

# Imperial Execution Modes

## Owner approval (required)

This skill is read-only or dry-run by default. Prefer devnet or testnet first where those networks apply.

Before any mainnet transaction, order, launch, or signature, show the owner the exact transaction or order — venue, market, side, size/notional, price/slippage, fees, destination, and signer — and get an explicit yes for that exact one. One approval covers one transaction only.

Autonomous, loop, auto_execute, mirror, or interval modes must still ask per transaction, or stay in paper/dry-run. Prefer user-device signing (OWS or the owner's wallet) over server-held keys. Never print or log keys.


Use these modes consistently:

- `observe`: read-only market, funding, depth, balances, positions, and orders.
- `route-check`: evaluate venue, fees, and notional with `/funding-rates`, `/mark-prices`, and `/route`.
- `paper/spec`: build a trade or strategy plan without submitting.
- `live-single-shot`: one immediate authenticated order or close through `POST /mobile/orders`.
- `external-runner`: durable TWAP/grid logic owned by a real runner, not a webhook.

Telegram note:

- The current Telegram bot can do `observe`, `route-check`, and `live-single-shot`; live-single-shot still requires per-transaction owner approval (see [Owner approval (required)](#owner-approval-required)).
- Long-lived TWAP/grid behaviour should be described as runner-backed unless a durable worker owns the loop.
