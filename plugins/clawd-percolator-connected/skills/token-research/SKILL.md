---
name: token-research
description: Use when researching Solana token launches, holder concentration, wallet clusters, token security, trading activity, or market context through PumpAI and Bubbles.
---

# CLAWD Token Research

The connected `pumpai-launch` server at `https://pumpai.ai/mcp` is now a unified catalog: launch tools, provider reads (including Imperial `get_imperial_*`), and CLAWD Percolator `perps_*` tools. `https://pumpai.ai/tools` remains the 167-tool provider subset. Discover actual tool names at runtime. For perp markets and Imperial, use the `percolator-markets`, `imperial`, and `pumpai-feed` skills.

1. Start with `pumpai-launch` for launch-feed/health results and `pumpai-tools` for other provider research. Discover actual MCP tool names at runtime; do not assume a tool exists just because it is listed in a companion API guide.
2. Use `bubblemaps-docs` only for **documentation and developer reference**. The separately verified Bubbles site at `https://bubblemaps.dev/api` offers live read-only public endpoints, not necessarily tools in this MCP server. Do not misrepresent docs search as on-chain analytics.
3. When a capable browser exposes Bubbles WebMCP, the site can register read-only browser tools such as `map_token`, `wallet_xray`, `clawd_decide`, `compare_tokens`, `get_trending`, and `search_tokens`. Those do not automatically become remotely available ChatGPT MCP tools.
4. For source-backed on-chain analysis, inspect exact mint and chain, token supply, top-10 adjusted share, bundlers, linked wallets, cluster share, freshness, and potential missing history. Metrics have different denominators; do not claim a rug pull on concentration alone.
5. Use precise source naming, timestamp and link. Provide recommendations as research, not financial certainty.

## Public Bubbles HTTP API (external app integration only)

- `GET https://bubblemaps.dev/api/map/{mint}` — holder graph; may return 202 while building.
- `GET https://bubblemaps.dev/api/wallet/{address}` — indexed wallet exposure.
- `GET https://bubblemaps.dev/api/trending` — trending tokens.
- `GET https://bubblemaps.dev/v0/tokens/metrics/solana/{mint}` — network scoring & concentration.
- `GET https://bubblemaps.dev/v0/tokens/holders/solana/{mint}?limit=80` — token holders.
- See `https://bubblemaps.dev/api` and `/v0/openapi.json`; Solana only for this site. Keep rate under documented limits.

Do not call live endpoints or invent data when no HTTP data tool is connected. Prefer the already installed Bubbles app for live analysis if available.
