---
name: percolator-markets
description: Use when researching a Percolator perpetual market, reading market or insurance-fund state, or explaining how to launch, trade or stake. Read-only by default. Covers Musebook Clawd Chain terminals and PumpAI CLAWD Percolator devnet tools.
---

# Percolator markets (read-only default)

Musebook's Percolator is a permissionless perp-market launcher. Site copy: "Any Token. Any Market. Permissionless." and "Launch a perp market. Trade it. Stake its insurance fund." Clawd is the mascot. There is **no** implied affiliation with Solana Labs. Do not promise returns. Say "one of the first" if you need a firstness claim; never "first ever".

Default mode is read-only. Prefer Clawd Chain testnet or Solana devnet. Never execute a mainnet transaction unless the owner has approved that exact transaction. Sign on the owner's device with OWS or the site wallet. Backends that build transactions return unsigned bytes; this plugin does not broadcast. Never print or request seed phrases, private keys, or vault passphrases.

There are **two live surfaces**. Do not mix their program IDs, clusters, or market accounts.

## 1. Clawd Chain testnet terminals

Front ends: https://percolator.tech, https://percolator.musebook.trade, https://percolator.clawdchain.trade. The Musebook terminal reports backend `https://percolator.clawdchain.trade` and network `clawd-chain-testnet`. CLAWD and test cUSD on this chain are test tokens with no real-world value. The Musebook page states markets currently trade at a provisioned price and that an oracle/keeper is not in place on that terminal yet; report only what a live read returns.

Verified public reads:

- `GET https://percolator.tech/api/markets` (also on the musebook and clawdchain hosts) — registry, program IDs, launched markets (`name`, `symbol`, `creator`, `market`, `perp`, `tradable`, explorer links).
- `GET https://percolator.tech/api/feed` — public build feed (commits, program deploy status). `GET https://percolator.tech/ops-snapshot.json` — sanitized ops snapshot. `GET /api/health` or `/health` — liveness (`ok` on tech/clawdchain; JSON on musebook).
- `GET https://percolator.musebook.trade/api/position?market=<perp>&owner=<address>` (also on the clawdchain host) — owner-scoped state. Observed fields: `portfolio`, `position`, `usd`, `lp` (insurance LP for that owner), `nft`, `price`. Both `market` (perp account) and `owner` are required; omitting `owner` returns HTTP 400.
- `GET https://percolator.musebook.trade/api/community/stats` and `/api/community/leaderboard` — public community boards.
- `GET https://percolator.musebook.trade/api/health` — app/backend/network plus a **pre-live** Solana mainnet plan (`status: "pre-live"`). Mainnet is not live.

On-chain program IDs published by the terminals (Clawd Chain):

- wrapper `6Grr3eyuJVME5gDbeT6g6Q3pojQGSuSDaEmHDM7QYhzx`
- insurance stake `85rgQvJsqVq5gF9TPMtxmPQaoVMGK1wd6qx1FZqfXk5q`
- position NFT `GDaUkuhbErfBuL92oV93bWWHEVn9NF7pRNikSeq6nHLR`
- matcher `EyjkN2LRcnMfTcfChz4R33nYHKWMbuKVKRufUx2TfuXE` (shown on percolator.tech)
- registry `56dhUqcecQyQun9WbSLrTouVxP6UhPbc3VXvdRZEHg1y`

RPC: https://rpc.clawdchain.trade. Explorer: https://explorer.clawdchain.trade. Source cited by the terminal: https://github.com/Solizardking/clawd-percolator.

No public `GET /api/insurance` route was found (404). Insurance for a wallet is the `lp` field on `/api/position`. There is no verified unauthenticated insurance-fund TVL endpoint on these hosts.

### Launch / trade / stake (how it works — do not call writes from this plugin)

The terminals state that the chain backend builds **unsigned** transactions and the browser wallet signs them. Documented UI flow:

1. Get a test wallet and faucet CLAWD (testnet).
2. Launch records a market on the registry (fee 0.001 CLAWD), then `POST /api/markets/provision` activates trading (perp account, test-cUSD mint, house LP, insurance pool).
3. Trade desk actions post to `/api/tx/<action>` and, when a `tx` is returned, the wallet signs it. Observed actions: `usd` (mint 1,000 test cUSD), `portfolio` (open a trading account), `deposit` / `withdraw` (margin), `trade` (`side`: `long`|`short`, `size`), `stakeDeposit` / `stakeWithdraw` (insurance LP), `nftMint` / `nftBurn`.

Do **not** invoke those POST routes from this plugin. If the owner wants to act, send them to the terminal or have their local OWS wallet sign an unsigned transaction they have reviewed. Mainnet remains pre-live on the Musebook plan page.

## 2. PumpAI CLAWD Percolator (Solana devnet slabs)

Live on the PumpAI MCP at `https://pumpai.ai/mcp` and on HTTP `https://pumpai.ai/api/perps`. This is a different program and cluster than the Clawd Chain terminals.

- Program (live status): `Anw121Fk3gKvUHXk938cY2xVb9Eq46WX3k15WESS49PA`
- Default cluster: `devnet`. Live status also reports `httpWrites: false`, `mainnetWrites: "refused"`, and `imperial: "not configured"`.
- Verified HTTP: `GET /api/perps`, `GET /api/perps/markets`, `GET /api/perps/markets/<slab>`, `GET /api/perps/oracle/<slab>`.
- Read MCP tools (free, unauthenticated when probed): `perps_list_markets`, `perps_read_market`, `perps_oracle_price`, `perps_eligibility`, `perps_quote`. Market summaries include `insurance` and `openInterest` units, oracle kind, leverage cap, paused/migrated/resolved flags.
- Write MCP tools exist (`perps_create_market`, `perps_deposit`, `perps_withdraw`, `perps_open_position`, `perps_close_position`) but are protected, devnet/localnet only, confirmation-gated, and currently cannot build transactions on the live server because the Imperial write MCP URL is not configured. Do not call them. Do not treat `confirm:true` as owner approval of an exact transaction.

Discover tool schemas at runtime with `tools/list`. Do not invent endpoints or markets. Quote only fields a live read returned, with cluster, program ID, slab, and a timestamp.

## Research workflow

1. Identify the surface (Clawd Chain terminal vs PumpAI devnet program).
2. List markets from the matching read API or `perps_list_markets`.
3. For one market, read slab/terminal details and insurance (`insurance` on PumpAI summaries; owner `lp` on Clawd Chain `/api/position`).
4. Present results as research, not financial advice. Include links to the explorer or API response source.
