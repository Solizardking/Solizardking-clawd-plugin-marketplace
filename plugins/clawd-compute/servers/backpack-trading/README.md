# backpack-trading — local Backpack trading MCP server

A **local, off-by-default** MCP server (stdio, zero-dependency Node) that
adds Backpack Exchange trading to the Clawd Compute plugin. It exists
because Backpack's RFQ lifecycle and order placement are ED25519-signed
per account: anything that can move value must sign **on your machine**,
which is what this server does. The Clawd Compute gateway stays read-only
and never sees a key.

**Defaults: testnet, trading disabled.** Mainnet requires a separate
explicit opt-in flag. Nothing here has been exercised against the live
API yet — no real keys exist; the full flow is code-complete and covered
by unit tests against a fake transport, and must be rehearsed on testnet
before any mainnet decision.

## Tools

Read (Read Only key, no confirmation):

| Tool | What it reads |
|---|---|
| `backpack_trading_status` | Local config status (signs/sends nothing) |
| `backpack_account` | Account object incl. the live fee surface |
| `backpack_balances` | Balances |
| `backpack_positions` | Futures positions |
| `backpack_rfq_history` | RFQ history |
| `backpack_order_history` | Order history |

RFQ requester flow (trade key, confirm-gated):

1. `backpack_rfq_submit` — submits an RFQ (`AwaitAccept` only;
   `Immediate` is refused). Sized against the per-order cap first.
2. `backpack_rfq_quote` — fetches the live quote and returns exact terms:
   quote id, fee-inclusive taker price (quote price + taker fee), the
   validity window `w` → `W`, and a **confirm token** bound to those
   terms. v1 polls the REST quote endpoint; the private WebSocket
   `account.rfqUpdate` candidate stream is a future enhancement, and the
   REST-derived taker price is labelled an estimate — fills are always
   verified from history after execution.
3. `backpack_rfq_accept` — the single value-moving RFQ call. Requires the
   confirm token; stale (past `W`) or mismatched terms are refused
   before signing. The fill is then read back from
   `GET /wapi/v1/history/rfq/fill` and reported from that record.
4. `backpack_rfq_cancel` / `backpack_rfq_refresh` — signed,
   non-value-moving.

Orders (trade key, confirm-gated): `backpack_order_preview` returns exact
terms + a confirm token; `backpack_order_place` (spot or perp by symbol)
requires the token bound to the same fields and verifies the order from
the exchange afterwards; `backpack_order_cancel` cancels one order.
Batch orders are disabled.

Out of scope in v1: the quoter side (submitting quotes against other
users' RFQs), `Immediate` execution mode, withdrawals, transfers,
strategy endpoints.

## Key setup (your steps — the plugin cannot do these)

1. In Backpack's web UI (Settings → API Keys) create **two keys on two
   sub-accounts**:
   - a **Read Only** key, and
   - a **trade** key on its **own sub-account** (isolated margin and
     positions), spot and/or futures as you choose.
   - **Never enable withdrawals on either key.** Enable IP whitelisting
     where your setup allows.
2. Store each seed in your local secure storage (OS keychain / Secure
   Vault, 0600). The seed never transits chat, the gateway, or any log.
3. Pass the keys to this server through its environment (your MCP client
   config for the local server process — never committed to this repo):

| Env var | Meaning |
|---|---|
| `BACKPACK_READ_API_KEY` | Base64 verifying key of the Read Only key |
| `BACKPACK_READ_SEED_B64` | Base64 32-byte seed of the Read Only key |
| `BACKPACK_TRADE_API_KEY` | Base64 verifying key of the trade key |
| `BACKPACK_TRADE_SEED_B64` | Base64 32-byte seed of the trade key |

The server verifies each API key matches the seed's derived verifying
key at startup and refuses to run with a mismatched pair.

## Enabling trading (deliberate, separate from installing)

| Env var | Meaning |
|---|---|
| `BACKPACK_TRADING_ENABLED` | Master switch. Unset/`0` = all trade tools refuse. Set to `1` to enable. |
| `BACKPACK_MAX_ORDER_NOTIONAL_USD` | Per-order cap (USD). **Unset = trade tools refuse.** |
| `BACKPACK_MAX_DAILY_NOTIONAL_USD` | Daily cap (USD, UTC day). **Unset = trade tools refuse.** |
| `BACKPACK_NETWORK` | `testnet` (default) or `mainnet`. |
| `BACKPACK_ALLOW_MAINNET` | Must be `1` before any mainnet base URL is accepted — otherwise startup fails closed. |
| `BACKPACK_BASE_URL` | Optional override (a mainnet URL still needs `BACKPACK_ALLOW_MAINNET=1`). |
| `BACKPACK_WINDOW_MS` | Signature window, default `5000`, max `60000`. |
| `BACKPACK_TRADING_CONFIG_DIR` | Where the daily ledger + audit log live. Default `~/.config/backpack-trading`. |

Fail-closed gates, all checked locally **before** signing: master
switch → trade key present → caps configured → confirm token valid and
bound to the exact terms → per-order cap → daily cap (from the local
ledger). Every signed call is appended to `audit.jsonl` in the config
dir with instruction + params only (never the seed or signature).

## Stocks warning

Stocks trade on Backpack **only via RFQ**, and accepting a stock quote
is **binding** (`rfqAcceptedBinding`): funds are locked and settlement
is deferred. It is not a cancellable order-book order. The quote step
prints this warning in the terms for every stock RFQ symbol.

## Run / test

```sh
node server.mjs          # stdio MCP server
npm test                 # node --test — signing vectors, gate refusals, full flows vs a fake transport
```

## Known unverified surface

All trading-path signing instructions (`rfqSubmit`, `quoteAccept`,
`rfqRefresh`, `rfqCancel`, `orderExecute`, `orderCancel`, `orderQuery`,
`balanceQuery`, `rfqQuery`) are documented. A few read/history
instruction names (`accountQuery`, `positionQuery`, `*HistoryQuery`)
follow the documented `*Query` pattern but were not individually
captured from the docs — they are marked `INFERRED` in `client.mjs` and
are first on the list to verify during the testnet rehearsal.
