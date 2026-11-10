---
name: imperial
description: Entry-point skill for Imperial perpetual routing on Solana. Use before answering or acting on Imperial router flows, Phoenix-routed perps, profile funding, market/portfolio intel, risk checks, TP/SL, TWAP, grid, or Telegram bot trading workflows.
---

# Imperial

## Owner approval (required)

This skill is read-only or dry-run by default. Prefer devnet or testnet first where those networks apply.

Before any mainnet transaction, order, launch, or signature, show the owner the exact transaction or order — venue, market, side, size/notional, price/slippage, fees, destination, and signer — and get an explicit yes for that exact one. One approval covers one transaction only.

Autonomous, loop, auto_execute, mirror, or interval modes must still ask per transaction, or stay in paper/dry-run. Prefer user-device signing (OWS or the owner's wallet) over server-held keys. Never print or log keys.


Imperial is the router layer. In this project, Phoenix is the preferred default venue when the user asks to "go straight Phoenix", but execution still flows through Imperial's authenticated `mobile/*` endpoints when the bot is acting as the operator.

Use this skill first, then route to the focused Imperial skill that matches intent.

Core rules:

- Treat `IMPERIAL_API_KEY` / `IMPERIAL_JWT` as a trading credential. Never display or log it.
- Treat every profile as isolated. Always track `profileIndex`.
- Always inspect `success` in `POST /api/v1/mobile/orders` responses even on HTTP 200.
- Prefer Phoenix (`underwriter=2`) unless the user explicitly requests another venue or route data says otherwise.
- For Telegram/webhook flows, only promise durable strategy execution when a real runner exists. Do not present a stateless webhook as a TWAP/grid engine.

See also: `imperial-skills-index`.
