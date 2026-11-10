# Imperial API reference (plugin-verified)

This file accompanies the canonical `imperial` skill (the owner's Imperial pack entry-point). It does not replace that skill. It records public endpoints and MCP facts verified while building this plugin.

Official docs: https://docs.imperial.trade/developers/api  
Base URL: `https://api.imperial.trade/api/v1`

Owner-pack skills often write paths as `/api/v1/...` or `/funding-rates`. Resolve those against the base URL above unless a different `IMPERIAL_API_BASE` is explicitly configured.

## Verified public GETs

| Path | Status when probed | Returns |
| --- | --- | --- |
| `/armada/markets` | 200 | Market list with leverage, mark/index, volume, funding |
| `/armada/status` | 200 | `enabled` plus per-market phase |
| `/armada/fills` | 200 | Recent fills by market |
| `/funding-rates` | 200 | Funding rows (venue sources such as sunrise / phoenix) |
| `/mark-prices` | 200 | Mark prices |
| `/phoenix/markets` | 200 | Phoenix-routed market list |
| `/phoenix/mark-prices` | 200 | Phoenix mark mids |
| `/openapi.json` | 200 | OpenAPI document |
| `/armada/open-availability` | 400 without `asset` | Endpoint exists; pass the documented query |

## Paths cited by the Imperial skill pack, mapped to the verified base

These were documented in the owner's skills; not every one was re-probed for v0.4.0. Confirm with a live call or the OpenAPI file before relying on a path.

- Market intel: `GET /funding-rates`, `GET /mark-prices`, `GET /phoenix/mark-prices`, `GET /phoenix/depth`, `GET /route`
- Portfolio / risk: `GET /mobile/balances`, `GET /positions?walletAddress=...`, `GET /orders?walletAddress=...`
- Margin: `POST /deposit/build-tx` (docs/skills: returns a transaction the wallet must still sign), `GET /mobile/balances`
- Execution: `POST /mobile/orders` (authenticated)
- Position follow-up: `/passthrough/users/{wallet}/profiles/{index}/sync`

## Documented in official API docs, not all re-probed

`GET /armada/orderbook`, `GET /armada/quote`, account reads (`/positions`, `/orders`, `/order-history`, `/trades`, `/funding-history`, `/pnl-history`, `/armada/margin`), `GET /trade-preview`, WebSockets `/ws` and `/ws/market`.

## Not a public MCP

No MCP initialize response was obtained from imperial.trade, www.imperial.trade, api.imperial.trade/mcp, or docs.imperial.trade/mcp. Those URLs are not in this plugin's manifests.

PumpAI tool names (advertised on `https://pumpai.ai/mcp` and `/tools`; discover at runtime) include `get_imperial_status`, `get_imperial_funding_rates`, `get_imperial_mark_prices`, `get_imperial_phoenix_markets`, `get_imperial_phoenix_mark_prices`, `get_imperial_phoenix_depth`, `get_imperial_route`, `get_imperial_stats_*`, plus wallet-scoped history/position/order reads. Some `flash` / `gmtrade` / `touch` tools are described by the server as routes that may be absent from the current public OpenAPI.
