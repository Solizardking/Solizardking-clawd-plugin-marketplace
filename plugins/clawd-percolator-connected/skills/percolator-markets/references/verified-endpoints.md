# Verified Percolator endpoints

Probed while building percolator-connected v0.1.0. Do not invent additional routes.

## Clawd Chain terminals

| Method | URL | Notes |
| --- | --- | --- |
| GET | https://percolator.tech/api/markets | 200 JSON, same catalog also served by the musebook and clawdchain hosts |
| GET | https://percolator.tech/api/feed | 200 JSON public build feed |
| GET | https://percolator.tech/api/health | 200 `ok` |
| GET | https://percolator.tech/health | 200 `ok` |
| GET | https://percolator.tech/ops-snapshot.json | 200 JSON sanitized snapshot |
| GET | https://percolator.musebook.trade/api/markets | 200 JSON |
| GET | https://percolator.musebook.trade/api/health | 200 JSON, backend + pre-live mainnet plan |
| GET | https://percolator.musebook.trade/api/position?market=&owner= | 200 JSON when both query params are present |
| GET | https://percolator.musebook.trade/api/community/stats | 200 JSON |
| GET | https://percolator.musebook.trade/api/community/leaderboard | 200 JSON |
| GET | https://percolator.clawdchain.trade/api/markets | 200 JSON |
| GET | https://percolator.clawdchain.trade/api/position?market=&owner= | 200 JSON when both query params are present |
| GET | https://percolator.clawdchain.trade/health | 200 `ok` |

`POST /mcp` on the three terminal hosts returned 404. `GET /api/insurance` returned 404. `POST /api/tx/*` and `POST /api/markets/provision` are write paths used by the site UI — do not call them from this package.

## PumpAI CLAWD Percolator (Solana devnet)

| Method | URL | Notes |
| --- | --- | --- |
| GET | https://pumpai.ai/api/perps | 200 status (programId, pollCluster, flags) |
| GET | https://pumpai.ai/api/perps/markets | 200 market list with insurance / open interest |
| GET | https://pumpai.ai/api/perps/markets/<slab> | 200 decoded market |
| GET | https://pumpai.ai/api/perps/oracle/<slab> | 200 oracle price |
| POST | https://pumpai.ai/mcp | MCP initialize + read tools verified |

Pages (not MCP): https://percolator.tech/feed, /proofs, /trade, /stake; https://percolator.musebook.trade/risk, /mainnet; https://pumpai.ai/perps (paper vault UI).
