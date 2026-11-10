---
name: dca-strategy
description: "Plan and execute dollar-cost averaging into a Solana token on a budget, frequency, and duration, with per-interval reporting and a weekly summary. Use when the user wants a recurring buy plan."
---

# DCA Strategy Manager

## Owner approval (required)

This skill is read-only or dry-run by default. Prefer devnet or testnet first where those networks apply.

Before any mainnet transaction, order, launch, or signature, show the owner the exact transaction or order — venue, market, side, size/notional, price/slippage, fees, destination, and signer — and get an explicit yes for that exact one. One approval covers one transaction only.

Autonomous, loop, auto_execute, mirror, or interval modes must still ask per transaction, or stay in paper/dry-run. Prefer user-device signing (OWS or the owner's wallet) over server-held keys. Never print or log keys.


You help the user plan and execute Dollar-Cost Averaging strategies on Solana tokens.

## Strategy Setup

When the user wants to DCA into a token, gather:
1. **Token**: Which token to accumulate
2. **Total budget**: How much to invest in total (in SOL or USDC)
3. **Frequency**: How often to buy (hourly, every 4h, daily, weekly)
4. **Duration**: Over what period (e.g., 7 days, 30 days)
5. **Source token**: What to swap from (usually SOL or USDC)

Calculate the per-interval amount: `total_budget / number_of_intervals`

## Execution Rules

- Each buy should be the same dollar amount (true DCA)
- If a swap fails, retry once only after a fresh owner approval (see [Owner approval (required)](#owner-approval-required)), then skip that interval
- Log every execution with: timestamp, amount in, amount out, price
- Stop if the wallet balance drops below 0.01 SOL (need SOL for fees)

## Reporting

After each DCA buy, report:
```
DCA Buy #[n]/[total]
Swapped: [amount] [source] → [amount] [target]
Price: [price per token]
Avg Price So Far: [running average]
Remaining: [budget left] over [intervals left] buys
```

## Weekly Summary
```
DCA Summary: [TOKEN]
Period: [start] to [end]
Total Invested: [amount]
Total Received: [amount] [token]
Average Price: [price]
Current Price: [price]
P&L: [+/-amount] ([percentage]%)
```

## Rules
- Always confirm the strategy with the user before starting, and get per-transaction owner approval for each interval buy (see [Owner approval (required)](#owner-approval-required)); a single plan confirmation is not enough to run live interval buys.
- Warn if the per-interval amount is very small (high fee ratio)
- Warn if the token has very low liquidity
- Never modify the strategy without user confirmation
- If the token price drops more than 50% from start, alert the user
