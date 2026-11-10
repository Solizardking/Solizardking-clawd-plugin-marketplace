# Proposed `mcp.percolator.trade` backend ownership and cutover

**Target:** `https://mcp.percolator.trade/mcp` (not yet proven deployed). Keep the existing public routes alive until verified.

## Routing design

| Edge route | Owner | Access | Notes |
|---|---|---|---|
| `GET /health` | gateway | public | Report upstream availability and config booleans only, not secrets |
| `POST /mcp` | Imperial MCP safe entrypoint | authenticated per-user for account/write tools | Read-only market tools can be public; exact signed approval required for execution |
| `/api/phoenix/*` | Phoenix read adapter / Rise | public reads, auth for account-only requests | Never expose Phoenix access/refresh token |
| `/api/markets/*` | Percolator + Imperial market adapters | public read | Label cluster/network/provider on each result |
| `/api/agent/*` | hedge-solana-agents | per-agent wallet-signed session | Research/paper by default, no global broker JWT |
| `/ws` | clawd-ws-v2 | signed channels where private | Keep launch feeds and reconnection separate from trade execution |

## Repository responsibilities
- `imperial-perps-mcp-server`: authoritative safe MCP actions and Phoenix read tools; disable legacy live orders at the deployed process entrypoint; signed approval policy; DB migrations and safety tests.
- `clawd-ws-v2`: existing launch+market streams, consumer-facing cards and documented pointers to the canonical MCP service. Never forward a raw privileged JWT or `ows_key_` token from a browser.
- `hedge-solana-agents`: distinct research/risk/strategy agents, each producing proposals in paper mode; live calls route through gateway with user-scoped approval and a separate persisted risk ledger.

## Cutover steps (do not assume completed)
1. Stage safe MCP backend under a private preview hostname; run unit, integration and staging wallet-signature tests.
2. Deploy a single safe instance with a durable state volume only for paper/reads; for live production move reservations to transactional Postgres.
3. Configure DNS CNAME for `mcp.percolator.trade` to the confirmed hosting domain, provision TLS, set strict origin rules and access controls. Domain owner must authorize DNS mutation.
4. Validate MCP initialize, tools/list, paper, challenge signing, replay rejection, rate limits, user isolation, HSTS and request audit hygiene.
5. Turn on read-only proxy, then update the ChatGPT plugin manifest to the new hostname only after successful actual availability verification.
6. Before enabling any live execution: independent security review, wallet-per-user OAuth/SIWS, nonce storage, policy enforcement at all endpoints, full simulation, mark freshness, kill switch, deposit/withdraw policy, incident procedures.
7. Reconcile and retire old routes only after consumer telemetry proves parity.

## Explicitly not achieved by a source commit
GitHub changes cannot themselves configure DNS, Railway variables, certificates, tokens, OAuth installation or prove a live endpoint is serving. Do not claim a deployment is live from a successful PR alone.
