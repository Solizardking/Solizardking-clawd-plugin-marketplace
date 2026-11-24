# Clawd Compute — plugin & MCP connector

One plugin that connects Claude Code, Cursor (including Grok-driven
agents), Antigravity, Codex, and any MCP client to the **Clawd Compute
gateway**: 262 tools
for Solana / x402 AI infrastructure — market data, perps intel, tokenized
equities, Backpack stocks and RFQ, the agent registry, the research board,
and more.

- **MCP server:** `https://mcp.clawdcompute.us/mcp` (streamable HTTP) —
  the same portal also answers at `https://clawdcompute.us/mcp`; public
  shelves need no token (see Auth)
- **Companion server:** the plugin also registers the official
  **Solana Developer MCP** (`https://mcp.solana.com/mcp`, Solana
  Foundation, free, no auth) as `solana-dev` — live Solana docs search
  plus the `program_autofixer` Rust security checker, next to the
  gateway's market/tool shelves.
- **Catalog snapshot:** [`catalog/ALL-X402-TOOLS.md`](catalog/ALL-X402-TOOLS.md)
  (catalog verified live 2026-11-24: 262 tools)
- **Operator:** Clawd ($CLAWD) · https://clawdcompute.us

## Skills included

Version 0.3.3 bundles **51 skills**: the gateway skill plus 50
Solana development skills harvested from the live catalog at
**https://clawdcompute.us/skills** (the Musebook skills catalog,
`musebook.trade/api/skills` — 272 skills total; this plugin bundles the
full Solana category plus the Solana-dev essentials catalogued under
General). Each skill's source text is preserved verbatim under
`skills/<slug>/SKILL.md` with a provenance comment; the full catalog
inventory is snapshotted at
[`catalog/skills-catalog.json`](catalog/skills-catalog.json).

| Skill | What it's for | Source |
|---|---|---|
| `clawd-compute` | The gateway itself: what mcp.clawdcompute.us is, the portal shelves, x402 cost, auth paths, fail-closed trading rules. | This plugin |
| `cheshire-omni-mint` | > | clawdcompute.us/skills · Solana catalog |
| `clawd-agent-launchpad` | Build, launch, stake, and manage Clawd or Cheshire Terminal agents. Use when working on Agent Launchpad, agent templa… | clawdcompute.us/skills · Solana catalog |
| `clawd-token-ops` | Work with $CLAWD token operations for Solana CLAWD and Cheshire Terminal. Use when checking or documenting the $CLAWD… | clawdcompute.us/skills · Solana catalog |
| `compressed-pda` | For client and program development on Solana ~160x cheaper and without rent-exemption for per-user state, DePIN regis… | clawdcompute.us/skills · Solana catalog |
| `compressed-token` | For compressed token operations on Solana ~400x cheaper than SPL: create mints with interface PDAs, mint, transfer, a… | clawdcompute.us/skills · Solana catalog |
| `helius-dflow` | Build Solana trading applications combining DFlow trading APIs with Helius infrastructure. Covers spot swaps (imperat… | clawdcompute.us/skills · General catalog |
| `helius-jupiter` | Build Solana DeFi applications combining Jupiter APIs with Helius infrastructure. Covers token swaps (Swap API V2), l… | clawdcompute.us/skills · General catalog |
| `helius-phantom` | Build frontend Solana applications with Phantom Connect SDK and Helius infrastructure. Covers React, React Native, an… | clawdcompute.us/skills · General catalog |
| `metaplex-nft-mint` | Mint NFTs on Solana with Metaplex Core. The agent builds the create-asset transaction and partially signs with an eph… | clawdcompute.us/skills · General catalog |
| `musebook` | The on-chain directory of Solana AI agents. Register your agent in one shot, post to the feed, and every profile show… | clawdcompute.us/skills · General catalog |
| `pay-with-any-token` | > | clawdcompute.us/skills · Solana catalog |
| `phantom-wallet-mcp` | > | clawdcompute.us/skills · Solana catalog |
| `pons-launch` | > | clawdcompute.us/skills · Solana catalog |
| `pump-admin-ops` | Build and execute Pump.fun admin workflows for authority management, creator reassignment, IDL authority changes, cas… | clawdcompute.us/skills · Solana catalog |
| `pump-ai-agents` | Create and maintain AI-agent integration files for Pump.fun SDK work, including AGENTS/CLAUDE/COPILOT/GEMINI instruct… | clawdcompute.us/skills · Solana catalog |
| `pump-bonding-curve` | Implement Pump.fun bonding-curve math for token pricing, buy/sell quotes, fee-aware calculations, market cap, tiered … | clawdcompute.us/skills · Solana catalog |
| `pump-build-release` | Run and maintain Pump.fun SDK build, release, and publishing workflows across TypeScript, Rust, npm, Vercel, Makefile… | clawdcompute.us/skills · Solana catalog |
| `pump-claims-readonly` | Query Pump.fun claim state without sending transactions: unclaimed token incentives, creator vault balances, volume a… | clawdcompute.us/skills · Solana catalog |
| `pump-fee-sharing` | Configure and distribute Pump.fun creator fees through the PumpFees program with BPS shareholder splits, admin manage… | clawdcompute.us/skills · Solana catalog |
| `pump-fee-system` | Implement and audit the Pump.fun fee system, including market-cap fee tiers, creator fee vaults across Pump and PumpA… | clawdcompute.us/skills · Solana catalog |
| `pump-mcp-server` | Build and operate a Pump.fun Model Context Protocol server for AI agents, covering stdio transport, wallet/session sa… | clawdcompute.us/skills · Solana catalog |
| `pump-rust-vanity` | Build production Rust vanity-address tooling for Pump.fun/Solana wallets with Rayon parallelism, solana-sdk key gener… | clawdcompute.us/skills · Solana catalog |
| `pump-sdk-core` | Build and extend the Pump.fun SDK core: offline TypeScript instruction builders, online RPC helpers, account decoders… | clawdcompute.us/skills · Solana catalog |
| `pump-security` | Apply Pump.fun SDK security practices across Rust, TypeScript, and Bash: key handling, memory zeroization, secure fil… | clawdcompute.us/skills · Solana catalog |
| `pump-shell-scripts` | Write and maintain secure Bash tooling for Pump.fun/Solana workflows, including vanity generation wrappers, keypair v… | clawdcompute.us/skills · Solana catalog |
| `pump-solana-architecture` | Design Pump.fun Solana program architecture, PDAs, account layouts, global singletons, per-token state, per-user accu… | clawdcompute.us/skills · Solana catalog |
| `pump-solana-dev` | Apply Solana development patterns used by Pump.fun: Anchor IDL interaction, SPL Token and Token-2022 handling, transa… | clawdcompute.us/skills · Solana catalog |
| `pump-solana-wallet` | Generate and validate secure Solana wallets for Pump.fun workflows using official Solana libraries, Ed25519 keypairs,… | clawdcompute.us/skills · Solana catalog |
| `pump-testing` | Design and run Pump.fun SDK test infrastructure across Rust, TypeScript, Python, and Bash, including unit tests, inte… | clawdcompute.us/skills · Solana catalog |
| `pump-token-incentives` | Implement and operate Pump.fun PUMP token incentive rewards with day-indexed epochs, pro-rata volume distribution, us… | clawdcompute.us/skills · Solana catalog |
| `pump-token-lifecycle` | Manage the full Pump.fun token lifecycle from creation through bonding-curve trading, graduation detection, AMM migra… | clawdcompute.us/skills · Solana catalog |
| `pump-ts-vanity` | Build educational TypeScript vanity-address tooling for Pump.fun/Solana wallets with @solana/web3.js, async generator… | clawdcompute.us/skills · Solana catalog |
| `pumpfun` | Entry-point router for the local Pump.fun skill suite. Use when the user asks about launching Pump.fun tokens, bondin… | clawdcompute.us/skills · Solana catalog |
| `pumpfun-analytics` | Quick Pump.fun analytics shortcut for bonding curve state, graduation progress, price impact, token pricing, fee tier… | clawdcompute.us/skills · Solana catalog |
| `pumpfun-fees` | Quick Pump.fun fee shortcut for creator fee sharing setup, shareholder BPS splits, claim/distribution flows, fee-tier… | clawdcompute.us/skills · Solana catalog |
| `pumpfun-launcher` | Quick Pump.fun token-launch shortcut for creating tokens with the Pump SDK, optional initial buys, metadata upload fl… | clawdcompute.us/skills · Solana catalog |
| `rh-bonded-launch` | > | clawdcompute.us/skills · Solana catalog |
| `rh-launchpad-v3` | > | clawdcompute.us/skills · Solana catalog |
| `solana-agent-registration` | Register an AI agent on-chain via the Metaplex Agent Registry: mint an MPL Core asset, bind an Agent Identity record,… | clawdcompute.us/skills · General catalog |
| `solana-clawd` | One-shot setup and operation guide for the solana-clawd agentic engine. Use when: cloning the repo, setting up MCP to… | clawdcompute.us/skills · Solana catalog |
| `solana-clawd-agentic-commerce` | Build and operate Solana CLAWD agents that spend through Pay CLI, expose paid stores, mint Metaplex-readable identiti… | clawdcompute.us/skills · Solana catalog |
| `solana-clawd-agents` | Use the imported Solana Clawd Agents hub catalog to browse, validate, build, deploy, mint, stake, and integrate produ… | clawdcompute.us/skills · Solana catalog |
| `solana-common-errors` | > | clawdcompute.us/skills · Solana catalog |
| `solana-dev` | Use when user asks to "build a Solana dapp", "write an Anchor program", "create a token", "debug Solana errors", "set… | clawdcompute.us/skills · Solana catalog |
| `solana-formal-verification` | Formally verify programs by writing Lean 4 proofs. Trigger this skill whenever the user wants to formally verify code… | clawdcompute.us/skills · Solana catalog |
| `solana-ralphy-skill` | Autonomous AI coding loop for Solana development that combines Ralphy-style task execution with Solana program, token… | clawdcompute.us/skills · Solana catalog |
| `solana-redpill-verifier` | Solana RedPill TEE verifier development and operations for the `web/solana-redpill-verifier` stack. Use for Pinocchio… | clawdcompute.us/skills · Solana catalog |
| `solana-rent-free-dev` | > | clawdcompute.us/skills · Solana catalog |
| `sponge-wallet` | Crypto wallet, token swaps, cross-chain bridges, and access to paid external services (search, image gen, web scrapin… | clawdcompute.us/skills · Solana catalog |
| `svm` | Explore Solana's architecture and protocol internals. Covers the SVM execution engine, account model, consensus, tran… | clawdcompute.us/skills · General catalog |

## What it costs

- 244 of the 262 tools are payable at a flat **$0.01 USDC per call**,
  settled via **x402** on Solana mainnet or Base. 18 are free or gated
  (portal meta tools are MCP-only; several price-$0 entries are gated
  trading tools, not free data — read each description).
- x402 pricing applies to the gateway's per-tool HTTP surface
  (`POST https://clawdcompute.us/v1/tools/<tool_name>`); the MCP portal
  shelves below are callable over MCP as described under Auth.

## Auth

The portal's public shelves answer **anonymously** — no token needed to
list or call them: `pumpai_*` (the complete PumpAI catalog), `equities_*`
(tokenized equities, stonk.fun, Raydium), `backpack_*` (Backpack crypto +
US stocks, broker indicative quotes, RFQ indicative/estimate), `desk_*`,
`massive_*` (US stock data) and the free `portal_*` meta tools.

Two shelves are **locked**: `perps_*` (Perps MCP) and `musebook_*`
(Musebook MCP) enumerate and call only with your own Clerk OAuth Bearer
token, forwarded upstream (issuer `https://clerk.clawdcompute.us`,
scopes `profile email`; protected-resource metadata at
`https://mcp.clawdcompute.us/.well-known/oauth-protected-resource/mcp`).
MCP clients that support remote-MCP OAuth run that flow automatically
when a locked shelf is used. Real Backpack RFQ submit/accept is
per-account ED25519-signed and is not offered by the portal — only
indicative quotes and book-walk estimates are.

## Install

### Claude Code

Local checkout:

```text
/plugin marketplace add ./clawdcompute-plugin   # or the GitHub repo once published
/plugin install clawd-compute
```

Or skip the plugin and add just the server:

```text
claude mcp add --transport http clawd-compute https://mcp.clawdcompute.us/mcp
```

### Cursor

Cursor loads both plugin formats in this repo (`.cursor-plugin/plugin.json`
and the root Agent Plugins `plugin.json`), with MCP servers from the
root `mcp.json`. For local development, copy/symlink this folder to
`~/.cursor/plugins/local/clawd-compute`, or add the server directly in
`~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "clawd-compute": { "url": "https://mcp.clawdcompute.us/mcp" }
  }
}
```

Marketplace listing is a separate, manually reviewed submission to the
Cursor team — see "Publishing" below; until then, local install is the
route (this is also how a Grok bot running inside Cursor picks it up:
same Cursor plugin/MCP config).

### Antigravity

Antigravity reads remote MCP servers from `mcp_config.json` (global:
`~/.gemini/config/mcp_config.json`, or workspace-local
`.agents/mcp_config.json`; format per Google's Antigravity MCP docs —
remote servers use `serverUrl`). This repo ships a ready example at
[`antigravity/mcp_config.json`](antigravity/mcp_config.json):

```json
{
  "mcpServers": {
    "clawd-compute": { "serverUrl": "https://mcp.clawdcompute.us/mcp" }
  }
}
```

Merge that entry into your `mcp_config.json` (Agent panel → … →
MCP Servers → Manage MCP Servers → View raw config), then restart
Antigravity and complete the OAuth sign-in on first connect. For the
skills: copy or symlink the folders under this plugin's `skills/`
directory into your Antigravity skills directory (`.agent/skills/` in a
workspace, or the global Antigravity skills folder) so its agents load
the same Solana development skills.

### Codex

Codex reads MCP servers from `config.toml`. This repo ships a ready
block at [`.codex/config.toml`](.codex/config.toml) — merge it into
`~/.codex/config.toml` (or a project `.codex/config.toml`):

```toml
[mcp_servers.clawd-compute]
url = "https://mcp.clawdcompute.us/mcp"
```

Codex runs the OAuth flow on first connect; no secret belongs in the
file. For the skills: copy or symlink the folders under `skills/` into
`~/.codex/skills/` (or a project `.codex/skills/`), and drop this
snippet into your `AGENTS.md` so Codex agents know where they live:

```markdown
## Clawd Compute + Solana skills

This project uses the Clawd Compute MCP server (`clawd-compute`,
https://mcp.clawdcompute.us/mcp) for Solana market data, perps intel,
the agent registry and the research board. Solana development skills
(Anchor/Pinocchio programs, compressed accounts/tokens, Pump, Metaplex,
wallets, RPC) are bundled in the clawd-compute plugin's `skills/`
directory (installed under ~/.codex/skills/): load the matching
SKILL.md before Solana work — start with `solana-dev`, and reach for
`solana-common-errors` first when a build or deploy fails. Trading
tools on the gateway stay fail-closed: never place a trade without the
user's explicit confirmation.
```

### Any MCP client

```json
{
  "mcpServers": {
    "clawd-compute": { "type": "http", "url": "https://mcp.clawdcompute.us/mcp" }
  }
}
```

No API keys or secrets belong in any of these configs — the public
shelves need no auth, and the locked shelves use the OAuth flow handled
by the client/server.

## Fail-closed trading — read this

Data tools are read-only. Trading and write tools on this gateway stay
**fail-closed**: server-side trading gate + explicit user confirmation +
a per-action confirm token are all required, and nothing in this plugin
changes that. Installing the plugin never authorizes a trade.

## Backpack trading server (optional, local, off by default)

Version 0.3.2 adds `servers/backpack-trading/` — a **local** MCP server
(stdio, zero-dependency Node) for Backpack Exchange trading. Backpack's
RFQ lifecycle and order placement are ED25519-signed per account, so
anything that can move value signs **on your machine**; the gateway
above stays read-only and never sees a key. The server is **not** in
any default server list — each client config carries it only as a
clearly marked, disabled optional entry.

- **Testnet by default** (`api-testnet.backpack.exchange`). Mainnet
  needs a separate opt-in (`BACKPACK_ALLOW_MAINNET=1`) and stays a
  separate decision after a testnet rehearsal.
- **Off by default:** read tools need a Read Only key; trade tools
  additionally require `BACKPACK_TRADING_ENABLED=1`, user-set caps
  (`BACKPACK_MAX_ORDER_NOTIONAL_USD`, `BACKPACK_MAX_DAILY_NOTIONAL_USD`
  — unset means the trade tools refuse), and a per-trade confirm token
  bound to the exact terms shown to you.
- **Your setup (web UI only — keys can't be created via API):** create
  a **Read Only** key and a **trade key on its own sub-account** in
  Backpack's Settings → API Keys, **withdrawals never enabled** on
  either, and pass the key/seed pairs to the server via its environment
  (`BACKPACK_READ_API_KEY` / `BACKPACK_READ_SEED_B64` /
  `BACKPACK_TRADE_API_KEY` / `BACKPACK_TRADE_SEED_B64`) from your local
  secure storage. Seeds never go in this repo or any config file in it.
- **Stocks warning:** stocks trade on Backpack only via RFQ, and
  accepting a stock quote is **binding** — funds lock and settlement is
  deferred; it is not a cancellable order-book order. The quote step
  prints this warning with the terms.

Full docs, tool list and gate list:
[`servers/backpack-trading/README.md`](servers/backpack-trading/README.md).

## Layout

```text
.claude-plugin/plugin.json   Claude Code plugin manifest
.cursor-plugin/plugin.json   Cursor plugin manifest
plugin.json                  Agent Plugins (open standard) manifest — also loads in Cursor
.mcp.json                    MCP servers (Claude Code convention)
mcp.json                     MCP servers (Cursor / Agent Plugins convention)
skills/                      51 skills: clawd-compute (gateway) + 50 bundled Solana dev skills
servers/backpack-trading/    optional local Backpack trading MCP server (off by default; see its README)
.codex/config.toml           Codex MCP config example (merge into ~/.codex/config.toml)
antigravity/mcp_config.json  Antigravity MCP config example (serverUrl form)
catalog/                     tool catalog snapshot (md + raw json; live count 262 as of 2026-11-24) + skills-catalog.json (272-skill inventory)
```

## Publishing (not yet done)

- **GitHub:** push this repo to `Solizardking/clawdcompute-plugin`
  (the manifests already reference that URL), then it is installable as
  a Claude Code marketplace repo and submittable to Cursor.
- **Cursor Marketplace:** plugins are distributed as Git repos and
  manually reviewed by the Cursor team before listing
  (cursor.com/docs/plugins). Submit the repo URL once published.
