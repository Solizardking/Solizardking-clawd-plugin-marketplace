---
name: "vulcan-execution-modes"
description: "Canonical Vulcan execution mode taxonomy: Observe, Paper, Dry-Run, Confirm-Each, Auto-Execute. Use before launching strategies or live-capable perps flows."
---

# Vulcan Execution Modes

## Owner approval (required)

This skill is read-only or dry-run by default. Prefer devnet or testnet first where those networks apply.

Before any mainnet transaction, order, launch, or signature, show the owner the exact transaction or order — venue, market, side, size/notional, price/slippage, fees, destination, and signer — and get an explicit yes for that exact one. One approval covers one transaction only.

Autonomous, loop, auto_execute, mirror, or interval modes must still ask per transaction, or stay in paper/dry-run. Prefer user-device signing (OWS or the owner's wallet) over server-held keys. Never print or log keys.


Canonical source: `../../vulcan-cli-master/skills/vulcan-execution-modes/SKILL.md`

Default user-facing mode is Paper unless the user explicitly selects a live mode. Live `confirm_each` and `auto_execute` still require per-transaction owner approval (see [Owner approval (required)](#owner-approval-required)); `auto_execute` after a one-time approval is not permitted. Collect safety parameters before any live mode.
