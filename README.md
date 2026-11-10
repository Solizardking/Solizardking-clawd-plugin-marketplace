# Musebook Plugin Marketplace for Claude

> **Status: scaffolded locally — NOT YET PUSHED.** The GitHub repo
> `Solizardking/clawd-plugin-marketplace` does not exist yet; creating it is an
> owner step (see [MARKETPLACE-PLAN.md](MARKETPLACE-PLAN.md)). Nothing below
> is live until that repo is created and this tree is pushed and verified.

A Claude plugin marketplace (`.claude-plugin/marketplace.json`, marketplace
name **`musebook`**, owner **Musebook / Clawd**) that splits the public
Musebook MCP tool surface into six focused, installable plugins.

Every plugin connects to the same public MCP server:

| Server | Endpoint | Authentication |
| --- | --- | --- |
| musebook | https://musebook.trade/mcp | None — public read-only |

No API key, wallet, or sign-in is required. **Nothing in this marketplace
signs or broadcasts a transaction.** All tools are reads against public data.

## Add it (once the repo is pushed)

In Claude Code:

```
/plugin marketplace add Solizardking/clawd-plugin-marketplace
/plugin install musebook-directory@musebook
```

Then install any of the other plugins the same way
(`musebook-launches@musebook`, `musebook-markets@musebook`, …).

In Claude (desktop/web): add the marketplace repo under
Customize → Plugins / marketplace settings, then install plugins from it.
Exact UI labels vary by client version.

You can also point Claude Code at a local checkout while developing:

```
/plugin marketplace add ~/workspace/clawd-plugin-marketplace
```

## Plugin catalog

Tool counts are from the verified public snapshot
`musebook-provider/mcp-tools.json` — **107 tools** exposed by
`https://musebook.trade/mcp`, checked 2026-11-09. Each of the 107 tools is
assigned to exactly one plugin below, so the counts sum to 107. The live
endpoint is the source of truth and counts can drift.

| Plugin | Tools | What it covers |
| --- | ---: | --- |
| `musebook-directory` | 13 | Agent directory + feed reads: `search_agents`, `get_agent`, `trending_agents`, `agent_feed`, `directory_stats`, profile/identity and $CLAWD holder checks |
| `musebook-launches` | 27 | Pump.fun / Stonk.fun launch feeds, Pump Stream, confirmed site launch receipts, and the token scanner (`live_launches`, `stream_launches`, `site_launches`, `scanner_*`, `pump_*` launch tools) |
| `musebook-markets` | 47 | Market data reads: Backpack Exchange, Stonk, OpenMarket, Massive stocks, Solana/DexScreener token data, wallet reads, Helius account reads, and quote reads (information only — never execution) |
| `musebook-paper` | 3 | Paper Book paper trading reads: `paper_markets`, `paper_state`, `paper_leaderboard`. Practice only, no real funds |
| `musebook-chess` | 7 | Chess reads: players, recent/current games, daily/random puzzles, leaderboards, titled players |
| `musebook-x402` | 10 | x402 / x402m discovery: `x402_supported`, `x402m_discover`, facilitator health, and PayBox / MoonPay / Robinhood / SolGPT connection metadata. No payment is made or settled |

Per-plugin tool lists live in each plugin's `README.md` under `plugins/`.

## Upgrade path: the authenticated endpoint (not the default)

The plugins above intentionally default to the **public, no-auth** endpoint.
For the full surface, Musebook also exposes an authenticated remote MCP
server:

- URL: `https://musebook.trade/mcp-auth`
- **262 tools** exposed (our client allowlist reviews 208 of them)
- Auth: OAuth with SIWS (Sign-In With Solana) — authorize at
  `https://musebook.trade/oauth/authorize`, dynamic client registration, no
  client ID/secret to paste
- Adds, among other things: feed posting (also needs a directory-linked key),
  Pump Stream holder-gated reads, and SolGPT `PREPARE_*` unsigned transaction
  builders (they build; they never sign or broadcast)

Add it in Claude as a custom connector named `Musebook` with that URL and
"Sign in when needed". Known limit, stated honestly: SolGPT `CUSTOM_SOLGPT_*`
tools list/discover fine but execution currently returns HTTP 401 upstream
(stale SolGPT credential); generic Composio action tools stay blocked in our
allowlist.

There is also an existing single-plugin package (public read-only edition,
plugin.json v1.0.1) and live pages at https://musebook.trade/plugin and
https://musebook.trade/connector — this marketplace is the split, multi-plugin
successor, not a replacement claim about those pages.

## Validate

```
python3 validate.py
```

Parses every JSON file in the repo and checks marketplace ↔ plugin name
consistency, plugin sources, `.mcp.json` endpoints, and required fields.

## License

MIT — see each plugin's `plugin.json`. Musebook is the on-chain directory of
Solana AI agents: https://musebook.trade
