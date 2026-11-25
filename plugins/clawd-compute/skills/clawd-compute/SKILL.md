---
name: clawd-compute
description: Use the Clawd Compute MCP gateway (mcp.clawdcompute.us) — 244 Solana/x402 tools for market data, perps intel, tokenized equities, Backpack stocks and RFQ, the agent registry, the research board, and more. Use when a task needs live Solana market/perps data, stock or tokenized-equity data, the Clawd agent/tool catalog, or any tool exposed by the Clawd Compute gateway.
---

# Clawd Compute gateway

On a new install, a scheduled refresh, or when asked to update, run
the `clawd-self-update` skill first so this plugin stays current with
the latest Clawd skills and MCP connectors.

One remote MCP portal fronts the Clawd fleet's tool catalog. The same
portal answers at both doors — installed plugins point at the first and
need no config change:

- **MCP endpoints:** `https://mcp.clawdcompute.us/mcp` and
  `https://clawdcompute.us/mcp` (streamable HTTP, same server, same
  tools). `POST https://mcp.clawdcompute.us/` (root) also answers MCP;
  `GET` on the root is a human landing page.
- **Shelves** (namespaced by server): `pumpai_*` (213 — the complete
  PumpAI catalog: launches, scanner, perps, wallets, prediction
  markets), `equities_*` (12 — tokenized equities on Solana: registry,
  three-way quotes, stonk.fun stocks/tokens, Raydium pools/prices),
  `backpack_*` (12 — Backpack Exchange crypto + US stock markets, the
  1,213-security catalogue, broker indicative quotes and RFQ
  indicative/estimate tools), `desk_*` (5), `portal_*` (2, free).
  `massive_*` (US stock aggregates, reference, indicators, news, short
  interest) joins automatically once the gateway's Massive API key is
  set; until then `portal_list_servers` reports it `awaiting_key`.
- **Auth:** the public shelves above answer anonymously. Two upstream
  servers are *locked* — `perps_*` (Perps MCP) and `musebook_*`
  (Musebook MCP) enumerate and call only with the caller's own Clerk
  OAuth Bearer token, forwarded upstream (scopes `profile email`;
  protected-resource metadata at
  `https://mcp.clawdcompute.us/.well-known/oauth-protected-resource/mcp`).
  Real Backpack RFQ submit/accept is per-account ED25519-signed and is
  NOT offered by the portal — only indicative quotes and book-walk
  estimates are.
- **Catalog:** 244 tools (verified live 2026-11-24 via
  `GET https://clawdcompute.us/v1/tools`): 226 payable, 18 free or
  gated. `tools/list` on the MCP session is the source of truth for
  what *your* session can call; `catalog/ALL-X402-TOOLS.md` in this
  plugin lists the public catalog with descriptions.

## Cost — x402

- Payable tools cost a flat **$0.01 USDC per call**, settled via x402
  (HTTP 402 → pay → resend with the payment header; one payment = one
  execution, replays are rejected).
- Rails: Solana mainnet (`solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`) or
  Base (`eip155:8453`).
- The same payable tools are also callable over plain HTTP at
  `POST https://clawdcompute.us/v1/tools/<tool_name>` with
  `{"arguments": {...}}` — that is the x402 surface; the MCP surface is
  the portal above.
- Budget before you loop: a payable call inside a retry loop burns $0.01
  per attempt. Never retry a paid call blindly; check state first.

## Honesty and safety rules

- **Data tools are read-only.** Prices, funding, order books, scans,
  registry and research reads change nothing. Present their output as
  data with its timestamp — never as financial advice or a promise.
- **Trading/write tools stay fail-closed.** They require the server-side
  trading gate **plus** explicit user confirmation **plus** a per-action
  confirm token, enforced by the upstream server on every call. Never
  auto-trade, never pre-approve, never treat a preview/prepare result
  as an execution. If a user has not explicitly confirmed the exact
  terms in this conversation, do not call a place/execute/deposit/
  withdraw tool.
- Some price-$0 tools in the catalog are gated trading tools, not free
  data — price is not permission. Read each tool's description first.
- If a tool is missing from `tools/list`, say so — do not invent a
  substitute or guess its schema.
- The operator is Clawd ($CLAWD). Amounts, payees and prices come from
  the tool responses themselves, never from memory.

## Companion server

The plugin also registers the official **Solana Developer MCP**
(`https://mcp.solana.com/mcp`, server `solana-mcp`, free, no auth) as
`solana-dev`: `list_sections`, `get_documentation`,
`Solana_Documentation_Search`, `Solana_Expert__Ask_For_Help`, and
`program_autofixer` (a Rust program security checker with a fix loop).
Reach for it for Solana docs and program review; reach for the Clawd
Compute portal for market data, tools and payments.

## Discovering tools

1. Connect to `https://mcp.clawdcompute.us/mcp` (no token needed for
   the public shelves).
2. `tools/list` — the session's real catalog; `portal_list_servers`
   shows every shelf with live counts and auth status.
3. For the full public list with prices, read
   `catalog/ALL-X402-TOOLS.md` in this plugin or
   `GET https://clawdcompute.us/v1/tools`.
