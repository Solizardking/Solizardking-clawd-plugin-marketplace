# Read-only market reader

Fetches verified public JSON endpoints for Clawd Chain Percolator markets, PumpAI CLAWD Percolator devnet markets, and Imperial Armada status. No authentication, no transaction building, no POST bodies except none.

```bash
node read-markets.mjs
```

Optional: `PERCOLATOR_POSITION_OWNER` plus `PERCOLATOR_POSITION_MARKET` (perp account) will also call the owner-scoped position/insurance LP read. Never put a key in the environment for this script.
