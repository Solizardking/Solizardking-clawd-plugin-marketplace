# Percolator v0.7.0

# Percolator

Research Solana launches and perp markets for $0.01420 USDC, no account. Default mode is read-only. Production writes stay off.

The open tool suite at https://opensea-tools-production.up.railway.app/ is connected at `https://opensea-tools-production.up.railway.app/mcp`. It serves a Solana token risk score and graded verdict, Imperial mark, funding and TA, a Stonk launch feed, wallet balances, transaction explain, and unsigned Jupiter and OpenSea swap quotes. Those routes do not sign or broadcast. `solana-wallet-personality` is listed there at $0.05 USDC and does not settle until a payTo address is set.

Combined update of the private PumpAI Connected v0.2.0 package with Percolator and Imperial research. Musebook is the provider; Clawd is the mascot. Default mode is **read-only**. Devnet / Clawd Chain testnet first. No promises of returns. This package does not imply any affiliation with Solana Labs or with any third-party launchpad.

Contains PumpAI remote launch and tools MCP connections; official Bubblemaps *documentation* MCP connection; token research, Composio setup, and OWS wallet skills; a local encrypted OWS wallet-creation MCP example; and a server-side Composio registration script. This package also contains Percolator market and PumpAI-feed skills; a read-only market-reader example; the CLAWD brand assets; and the owner skill bundle (the Imperial pack plus the remaining 88 folders). The owner `imperial` skill is the canonical entry-point; plugin-verified Imperial API notes live in `skills/imperial/references/imperial-api.md`. Lockfiles, `node_modules`, build outputs, and files over 5 MB were not copied from the bundle. v0.6.0 adds missing skill frontmatter, a per-transaction owner-approval gate on live-execution skills, and a list of known missing references.

**Not included:** a hosted OWS signing service, an authenticated Composio toolkit, or a remote Bubblemaps.dev live analytics MCP server. No COMPOSIO_API_KEY, private key, passphrase or seed phrase is bundled. Creation tools work only once the local bridge is installed on a compatible client.

Also not included: a public Percolator MCP server, a public Imperial MCP server, or any mainnet execution path. Launch, trade and stake transactions are not executed by this plugin.

Provider references:
- https://pumpai.ai/mcp and https://pumpai.ai/tools (existing MCP configuration)
- https://bubblemaps.dev/api (public live Solana API/WebMCP)
- https://docs.bubblemaps.io/mcp (Bubblemaps *documentation* MCP)
- https://docs.composio.dev/docs/extending-sessions/custom-mcp
- https://github.com/open-wallet-standard/core/blob/main/docs/sdk-node.md

Additional Percolator and Imperial references (verified when this package was built):
- https://percolator.tech — feed, proofs, trade/stake UI, `GET /api/markets`, `GET /api/feed`, `GET /api/health`
- https://percolator.musebook.trade — Musebook terminal, `GET /api/markets`, `GET /api/health`, `GET /api/position`, community reads
- https://percolator.clawdchain.trade — Clawd Chain app / backend, `GET /api/markets`, `GET /api/position`, `GET /health`
- https://explorer.clawdchain.trade and https://rpc.clawdchain.trade
- https://github.com/Solizardking/clawd-percolator
- https://pumpai.ai/api/perps and https://pumpai.ai/api/perps/markets (Solana devnet CLAWD Percolator reads)
- https://imperial.trade, https://docs.imperial.trade, https://api.imperial.trade/api/v1

There are two live Percolator surfaces; do not mix their program IDs, clusters, or market accounts:
1. Musebook Clawd Chain testnet terminals (the three percolator.* sites above). CLAWD and test cUSD there are test tokens with no real-world value. Solana mainnet for that stack was reported pre-live.
2. PumpAI CLAWD Percolator slabs on Solana devnet (`https://pumpai.ai/api/perps`, and the `perps_*` tools on `https://pumpai.ai/mcp`). That program is distinct from the Clawd Chain terminals. Live status reported HTTP writes off, mainnet writes refused, and the Imperial write MCP not configured.

Imperial is a separate Solana on-chain RFQ / perpetual venue. This plugin covers it as read-only market data (public REST and PumpAI `get_imperial_*` tools). There is no public Imperial MCP URL in the manifests.


## Skills

From PumpAI Connected v0.2.0:
- `token-research`
- `composio-instant`
- `ows-wallet` — with signing-architecture reference

Added for Percolator / PumpAI:
- `percolator-markets` — with verified-endpoints reference
- `pumpai-feed`

Owner skill bundle, grouped by family:

### cheshire
- `cheshire-agent-identity-registry`
- `cheshire-agent-registries`
- `cheshire-agent-reputation-registry`
- `cheshire-agent-validation-registry`
- `cheshire-api`
- `cheshire-noxa`
- `cheshire-omni-mint`
- `cheshire-terminal`
- `cheshire-zk-omni`

### clawd
- `clawd-agent-launchpad`
- `clawd-pump-agent-skills` — bundle (nested skills under `skills/`; several lack YAML frontmatter)
- `clawd-skills-installer`
- `clawd-token-ops`
- `clawd-trading-terminal`
- `clawdex`
- `clawdhub`

### pump/pumpfun
- `pump-ai-agents`
- `pump-bonding-curve`
- `pump-build-release`
- `pump-claims-readonly`
- `pump-fee-sharing`
- `pump-fee-system`
- `pump-fun` — bundle (`coin-fees`, `create-coin`, `interacting`, `swap`, `tokenized-agents`)
- `pump-mcp-server`
- `pump-rust-vanity`
- `pump-sdk-core`
- `pump-security`
- `pump-shell-scripts`
- `pump-solana-architecture`
- `pump-solana-dev`
- `pump-solana-wallet`
- `pump-testing`
- `pump-token-incentives`
- `pump-token-lifecycle`
- `pump-ts-vanity`
- `pumpfun`
- `pumpfun-analytics`
- `pumpfun-fees`
- `pumpfun-launcher`
- `pumpfun-trading`

### dflow
- `dflow-docs`
- `dflow-kalshi-market-data`
- `dflow-kalshi-market-scanner`
- `dflow-kalshi-portfolio`
- `dflow-kalshi-trading`
- `dflow-phantom-connect`
- `dflow-platform-fees`
- `dflow-proof-kyc`
- `dflow-spot-trading`

### vulcan
- `vulcan`
- `vulcan-error-recovery`
- `vulcan-execution-modes`
- `vulcan-grid-trading`
- `vulcan-lot-size-calculator`
- `vulcan-margin-operations`
- `vulcan-market-intel`
- `vulcan-onboarding`
- `vulcan-portfolio-intel`
- `vulcan-position-management`
- `vulcan-quickstart`
- `vulcan-risk-management`
- `vulcan-skills-index`
- `vulcan-ta-strategy`
- `vulcan-technical-analysis`
- `vulcan-tpsl-management`
- `vulcan-trade-execution`
- `vulcan-twap-execution`

### imperial
- `imperial` — entry-point (plugin-verified endpoints in `references/imperial-api.md`)
- `imperial-skills-index`
- `imperial-execution-modes`
- `imperial-market-intel`
- `imperial-portfolio-intel`
- `imperial-position-management`
- `imperial-risk-management`
- `imperial-trade-execution`
- `imperial-tpsl-management`
- `imperial-margin-operations`
- `imperial-twap-execution`
- `imperial-grid-trading`

### pay
- `pay`
- `pay-with-any-token`
- `pay-with-app`

### zk
- `zk`
- `zk-omni-messaging`

### general agent tooling
- `1password`
- `agent-browser`
- `agent-desktop`
- `agent-orchestration` — bundle of nested agent skills (`agent-self-scheduling`, `cmux`, `codex-subagent`, `fable-safe-prompt`, `goal-loop`, `handoff`, `run-deep-swe`)
- `agents-sdk`
- `compressed-pda`
- `compressed-token`
- `copy-trade`
- `create-agent-tui`
- `dca-bot`
- `deployer`
- `phantom-wallet-mcp`
- `pons-launch`
- `rh-bonded-launch`
- `rh-crypto-agent`
- `rh-launchpad-v3`


## Owner approval policy

Live trading, launch, and order skills in this package are read-only or dry-run by default. Prefer devnet or testnet first where those networks apply. Before any mainnet transaction, order, launch, or signature, the skill must show the owner the exact transaction or order (venue, market, side, size/notional, price/slippage, fees, destination, and signer) and get an explicit yes for that exact one. One approval covers one transaction only. Autonomous, loop, auto_execute, mirror, or interval modes must still ask per transaction, or stay in paper/dry-run. Prefer user-device signing (OWS or the owner's wallet) over server-held keys. Never print or log keys.

## Known missing references

These paths are cited in owner skill text but were not in the skill bundle (they were not invented or filled in):

- Vulcan pack: 18 skills point at `../../vulcan-cli-master/...`, which is not in this package.
- `interacting`: many links into a larger upstream docs tree (tutorials, bonding-curve math, SECURITY.md, and related pages).
- `pump-shell-scripts/SKILL.md`: five missing scripts (`utils.sh`, `generate-vanity.sh`, `batch-generate.sh`, `verify-keypair.sh`, `test-rust.sh`).
- `deployer`: missing `docs/TechnicalDocumentation.md`, `DeploymentGuide.md`, `assets/whitepaper.pdf`, and `audits/README.md`.
- Several `dflow-*` skills link to `../../README.md` (the monorepo root, not in this package).
- `cheshire-omni-mint`: missing `docs/OMNI_MINT.md` and `docs/ZK_OMNI.md`; `cheshire-api`: missing `docs/cheshire-terminal-api.md`.
- `pay-with-any-token` and `pay-with-app` link to `../swap-integration/SKILL.md` (not in this package).
- `cmux`: missing `references/socket-api.md`.
- `rh-launchpad-v3`: missing `docs/v3-pool-from-launch.md`.
- `compressed-pda` `error-codes.md`: absolute `/resources/...` link.

Contact: toly@mail.grokbot.com


## Backend and skills documentation

The owner package retains all 128 original skills, and adds three focused skills: `clawd-trading-policy`, `phoenix-trader`, `solana-vanity-wallet`. See `docs/ALL-SKILLS.md`, `docs/PROTOCOLS.md`, `docs/BACKEND-MIGRATION.md`, `docs/OWNER-PLUGIN-RELEASE.md`. Host migration to `mcp.percolator.trade` is proposed but not deployed.
