# Complete CLAWD skill catalog

Source ZIP: `clawd-percolator-connected-v0.6.9.0.zip`; **128 SKILL.md entries**; SHA-256 at each entry in accompanying JSON.

The descriptions below are extracted from the skill frontmatter or an initial non-heading paragraph; they are not independent security endorsements. Nested skills and references should be read before implementation.

## Cheshire / agent (21)

### `agent-browser`
**Path:** `skills/agent-browser/SKILL.md`. **Manifest name:** `agent-browser`.
Use the host-side `agent-browser` CLI for local browser smoke tests, screenshots, snapshots, and simple UI validation against forwarded localhost URLs.

### `agent-desktop`
**Path:** `skills/agent-desktop/SKILL.md`. **Manifest name:** `agent-desktop`.
Use the built-in `Computer` sub-agent with `agent-desktop` for macOS desktop automation. Apply when a task needs application launching, accessibility snapshots, stable element refs, window focusing, semantic clicks/typing, or visual confirmation outside the browser sandbox.

### `agents-sdk`
**Path:** `skills/agents-sdk/SKILL.md`. **Manifest name:** `agents-sdk`.
Build AI agents on Cloudflare Workers using the Agents SDK. Load when creating stateful agents, durable workflows, real-time WebSocket apps, scheduled tasks, MCP servers, chat applications, voice agents, or browser automation. Covers Agent class, state management, callable RPC, Workflows, durable execution, q

### `cheshire-agent-identity-registry`
**Path:** `skills/cheshire-agent-identity-registry/SKILL.md`. **Manifest name:** `cheshire-agent-identity-registry`.
ERC-8004-compatible **identity singleton** for Robinhood Chain. Dependency-free ERC-721 + URI + arbitrary metadata + reserved `agentWallet` with EIP-712 / ERC-1271 proof.

### `cheshire-agent-registries`
**Path:** `skills/cheshire-agent-registries/SKILL.md`. **Manifest name:** `cheshire-agent-registries`.
Open-source suite under `cheshire-terminal/robinhood-agents/contracts/`.

### `cheshire-agent-reputation-registry`
**Path:** `skills/cheshire-agent-reputation-registry/SKILL.md`. **Manifest name:** `cheshire-agent-reputation-registry`.
On-chain **feedback signals** for agents registered in `CheshireAgentIdentityRegistry`.

### `cheshire-agent-validation-registry`
**Path:** `skills/cheshire-agent-validation-registry/SKILL.md`. **Manifest name:** `cheshire-agent-validation-registry`.
**Validation request/response** registry for Robinhood Chain agents.

### `cheshire-api`
**Path:** `skills/cheshire-api/SKILL.md`. **Manifest name:** `cheshire-api`.
1. Discover → `GET /api/developer/status` + OpenAPI + `llms.txt`

### `cheshire-noxa`
**Path:** `skills/cheshire-noxa/SKILL.md`. **Manifest name:** `cheshire-noxa`.
NOXA Fun/DEX collab for Cheshire Terminal — launch feed, DEX registry, QuoterV2 quotes, EVM RPC. One-shot npm package @x402solana/cheshire-noxa.

### `cheshire-omni-mint`
**Path:** `skills/cheshire-omni-mint/SKILL.md`. **Manifest name:** `cheshire-omni-mint`.
Become **both** rails in one logical agent identity:

### `cheshire-terminal`
**Path:** `skills/cheshire-terminal/SKILL.md`. **Manifest name:** `cheshire-terminal`.
Operate and extend Cheshire Terminal, the cheshireterminal.ai voice-controlled Solana terminal powered by $CLAWD. Use when working on voice terminal flows, token launch commands, LiveKit voice integration, Jupiter swap surfaces, burn/staking flows, or any task that mentions Cheshire Terminal, cheshireterminal

### `cheshire-zk-omni`
**Path:** `skills/cheshire-zk-omni/SKILL.md`. **Manifest name:** `cheshire-zk-omni`.
Cross-chain messenger for **Robinhood Chain ↔ Solana** with **domain-separated nullifiers** (anti-replay). LayerZero authenticates peers; this contract enforces peer allowlist, nullifier uniqueness, expiry, and optional agent identity auth on send.

### `clawd-agent-launchpad`
**Path:** `skills/clawd-agent-launchpad/SKILL.md`. **Manifest name:** `clawd-agent-launchpad`.
Build, launch, stake, and manage Clawd or Cheshire Terminal agents. Use when working on Agent Launchpad, agent templates, agent builder, agent hub, deployed agent detail pages, runtime matrix, Metaplex agent minting, staking, agent chat, or Clawd/Cheshire agent lifecycle tasks.

### `clawd-skills-installer`
**Path:** `skills/clawd-skills-installer/SKILL.md`. **Manifest name:** `clawd-skills-installer`.
Install and make Clawd, Cheshire Terminal, Solizardking, Vercel, and eve agent skills available to local coding agents. Use when a user asks to add all skills, install this repo with npx github, install into ~/.agents/skills, ~/.codex/skills, ~/.claude/skills, or an eve project's agent/skills directory.

### `clawd-token-ops`
**Path:** `skills/clawd-token-ops/SKILL.md`. **Manifest name:** `clawd-token-ops`.
Work with $CLAWD token operations for Solana CLAWD and Cheshire Terminal. Use when checking or documenting the $CLAWD mint, token-gated balances, Jupiter buy/swap flows, burn tracking, holders, staking, treasury payments, or any task that asks to include the Clawd token address.

### `clawd-trading-terminal`
**Path:** `skills/clawd-trading-terminal/SKILL.md`. **Manifest name:** `clawd-trading-terminal`.
Use or implement Cheshire Terminal trading surfaces for $CLAWD and Solana markets. Use when working on live spot trading, Jupiter swaps, DFlow markets, OODA trading flows, Phoenix perps, DEX/contract explorer, wallet scanner, Pump page, token tickers, or Clawd trading terminal workflows.

### `clawdex`
**Path:** `skills/clawdex/SKILL.md`. **Manifest name:** `clawdex`.
Clawdex — dual-engine coding agent. Claude Code (reasoning + planning) + OpenAI Codex (fast execution) + Browser Use boxes (web research) + Upstash compute boxes (isolated sandboxes).

### `clawdhub`
**Path:** `skills/clawdhub/SKILL.md`. **Manifest name:** `clawdhub`.
Use the ClawdHub CLI to search, install, update, and publish agent skills from clawdhub.com. Use when you need to fetch new skills on the fly, sync installed skills to latest or a specific version, or publish new/updated skill folders with the npm-installed clawdhub CLI.

### `rh-bonded-launch`
**Path:** `skills/rh-bonded-launch/SKILL.md`. **Manifest name:** `rh-bonded-launch`.
**Anyone can launch a token.** No `$CLAWD` holder login. No factory allowlist.

### `rh-crypto-agent`
**Path:** `skills/rh-crypto-agent/SKILL.md`. **Manifest name:** `rh-crypto-agent`.
Open-source skill **pack** for building Robinhood Chain / EVM trading and launch agents with Zero Clawd (`go-bot` / `clawdbot`).

### `rh-launchpad-v3`
**Path:** `skills/rh-launchpad-v3/SKILL.md`. **Manifest name:** `rh-launchpad-v3`.
This skill is read-only or dry-run by default. Prefer devnet or testnet first where those networks apply.

## DFlow (9)

### `dflow-docs`
**Path:** `skills/dflow-docs/SKILL.md`. **Manifest name:** `dflow-docs`.
Discover and use DFlow documentation, Agent CLI, Trading API, Metadata API, Proof KYC, prediction markets, and the hosted DFlow docs MCP. Use before implementing DFlow features or when field-level endpoint details are needed.

### `dflow-kalshi-market-data`
**Path:** `skills/dflow-kalshi-market-data/SKILL.md`. **Manifest name:** `dflow-kalshi-market-data`.
Read market data for a known Kalshi prediction market on DFlow — orderbook, trades, top-of-book prices, candlesticks, forecast-percentile history, and Kalshi in-game live data — via one-shot REST snapshots, historical ranges, or live WebSocket streams. Use when the user asks "show me the orderbook for X", "ge

### `dflow-kalshi-market-scanner`
**Path:** `skills/dflow-kalshi-market-scanner/SKILL.md`. **Manifest name:** `dflow-kalshi-market-scanner`.
Find Kalshi prediction markets on DFlow that match a criterion — arbitrage (YES+NO<$1), cheap long-shots, near-certain short-dated plays, biggest movers, widest spreads, highest volume, closing soonest, and series/event-level scans. Use when the user asks "where's the free money?", "any mispriced markets?", "

### `dflow-kalshi-portfolio`
**Path:** `skills/dflow-kalshi-portfolio/SKILL.md`. **Manifest name:** `dflow-kalshi-portfolio`.
View what a wallet holds on DFlow's Kalshi prediction markets — current positions, unrealized mark-to-market, realized P&L, activity history, and redeemable winners. Use when the user asks "what are my positions?", "what do I own?", "am I up or down?", "what's my fill history?", "what can I redeem?", "mark my

### `dflow-kalshi-trading`
**Path:** `skills/dflow-kalshi-trading/SKILL.md`. **Manifest name:** `dflow-kalshi-trading`.
Buy, sell, or redeem YES/NO outcome tokens on Kalshi prediction markets via DFlow. Use when the user wants to bet on an event, place a Kalshi order, take a YES or NO position, exit a Kalshi position, redeem winning outcome tokens after a market resolves, tune priority fees on a PM trade, or build a gasless / 

### `dflow-phantom-connect`
**Path:** `skills/dflow-phantom-connect/SKILL.md`. **Manifest name:** `dflow-phantom-connect`.
Build Solana wallet-connected apps with Phantom Connect SDKs and DFlow trading. Use when user asks to connect a Phantom wallet, integrate Phantom in React, React Native, or vanilla JS, sign messages or transactions, build token-gated pages, mint NFTs, accept crypto payments, swap tokens with DFlow, trade pred

### `dflow-platform-fees`
**Path:** `skills/dflow-platform-fees/SKILL.md`. **Manifest name:** `dflow-platform-fees`.
Monetize a DFlow integration by collecting a builder-defined fee on trades your app routes through the Trade API — either a fixed percentage (spot + PM) via `platformFeeBps`, or a probability-weighted dynamic fee (PM outcome tokens only) via `platformFeeScale`. Use when the user asks "how do I take a cut of t

### `dflow-proof-kyc`
**Path:** `skills/dflow-proof-kyc/SKILL.md`. **Manifest name:** `dflow-proof-kyc`.
Integrate DFlow Proof — a Solana wallet identity-verification primitive (Stripe Identity under the hood) — for either (a) gating your own app's features behind KYC, or (b) completing the mandatory verification step for Kalshi prediction-market buys on DFlow. Use when the user asks "how do I KYC a wallet?", "c

### `dflow-spot-trading`
**Path:** `skills/dflow-spot-trading/SKILL.md`. **Manifest name:** `dflow-spot-trading`.
Swap any pair of Solana tokens via DFlow. Use when the user wants to trade, swap, or convert tokens on Solana, get a price quote, build a swap UI, tune priority fees so a swap lands under congestion, or build a gasless / sponsored swap where the app pays fees. Covers both the `dflow` CLI and the DFlow Trading

## Imperial (12)

### `imperial-execution-modes`
**Path:** `skills/imperial-execution-modes/SKILL.md`. **Manifest name:** `imperial-execution-modes`.
Execution-mode taxonomy for Imperial router workflows in this repo: observe, route-check, paper/spec, live single-shot, and external durable runner.

### `imperial-grid-trading`
**Path:** `skills/imperial-grid-trading/SKILL.md`. **Manifest name:** `imperial-grid-trading`.
Grid strategy design for Imperial/Phoenix perps: ladder layout, venue pinning, replacement logic, and durable-runner boundaries.

### `imperial-margin-operations`
**Path:** `skills/imperial-margin-operations/SKILL.md`. **Manifest name:** `imperial-margin-operations`.
Imperial profile funding, deposit/withdraw transaction building, profile isolation, and margin-state reporting.

### `imperial-market-intel`
**Path:** `skills/imperial-market-intel/SKILL.md`. **Manifest name:** `imperial-market-intel`.
Imperial and Phoenix market data: funding, mark prices, route checks, Phoenix depth, and pre-trade venue context.

### `imperial-portfolio-intel`
**Path:** `skills/imperial-portfolio-intel/SKILL.md`. **Manifest name:** `imperial-portfolio-intel`.
Imperial profile balances, open positions, open orders, exposure summary, and wallet-level Telegram/admin portfolio recaps.

### `imperial-position-management`
**Path:** `skills/imperial-position-management/SKILL.md`. **Manifest name:** `imperial-position-management`.
Inspect, reduce, and close Imperial-routed positions across Phoenix, Flash, Jupiter, and GMTrade, with Phoenix preferred by default.

### `imperial-risk-management`
**Path:** `skills/imperial-risk-management/SKILL.md`. **Manifest name:** `imperial-risk-management`.
Risk checks for Imperial-routed perps: profile funding, existing exposure, venue choice, margin headroom, and Telegram pre-trade snapshots.

### `imperial-skills-index`
**Path:** `skills/imperial-skills-index/SKILL.md`. **Manifest name:** `imperial-skills-index`.
Index for the bundled Imperial skill pack exposed through solana-clawd. Use to discover the correct focused Imperial skill.

### `imperial-tpsl-management`
**Path:** `skills/imperial-tpsl-management/SKILL.md`. **Manifest name:** `imperial-tpsl-management`.
Take-profit and stop-loss management for Imperial-routed positions, including close-leg design, verification, and Telegram operator caveats.

### `imperial-trade-execution`
**Path:** `skills/imperial-trade-execution/SKILL.md`. **Manifest name:** `imperial-trade-execution`.
Safe Imperial live execution: authenticated market orders, Phoenix-first venue preference, profile-aware routing, and post-trade verification.

### `imperial-twap-execution`
**Path:** `skills/imperial-twap-execution/SKILL.md`. **Manifest name:** `imperial-twap-execution`.
TWAP execution guidance for Imperial: slice planning, venue pinning, profile budgeting, and durable-runner requirements.

### `imperial`
**Path:** `skills/imperial/SKILL.md`. **Manifest name:** `imperial`.
Entry-point skill for Imperial perpetual routing on Solana. Use before answering or acting on Imperial router flows, Phoenix-routed perps, profile funding, market/portfolio intel, risk checks, TP/SL, TWAP, grid, or Telegram bot trading workflows.

## OWS / wallet (2)

### `ows-wallet`
**Path:** `skills/ows-wallet/SKILL.md`. **Manifest name:** `ows-wallet`.
Use when the user wants to create or manage an Open Wallet Standard (OWS) wallet, sign an on-chain transaction or a message, or connect the local vault to a ChatGPT-compatible MCP client.

### `phantom-wallet-mcp`
**Path:** `skills/phantom-wallet-mcp/SKILL.md`. **Manifest name:** `phantom-wallet-mcp`.
Use the `phantom` MCP server to interact with the user's Phantom wallet directly — no SDK integration code needed.

## Other (16)

### `1password`
**Path:** `skills/1password/SKILL.md`. **Manifest name:** `1password`.
Set up and use 1Password CLI (op). Use when installing the CLI, enabling desktop app integration, signing in (single or multi-account), or reading/injecting/running secrets via op.

### `composio-instant`
**Path:** `skills/composio-instant/SKILL.md`. **Manifest name:** `composio-instant`.
Use when connecting Composio Instant tools, configuring COMPOSIO_API_KEY, building a CLAWD custom toolkit, or preparing user-approved external actions.

### `compressed-pda`
**Path:** `skills/compressed-pda/SKILL.md`. **Manifest name:** `compressed-pda`.
For client and program development on Solana ~160x cheaper and without rent-exemption for per-user state, DePIN registrations, or custom compressed accounts. Create, update, close, burn, and reinitialize compressed accounts.

### `compressed-token`
**Path:** `skills/compressed-token/SKILL.md`. **Manifest name:** `compressed-token`.
For compressed token operations on Solana ~400x cheaper than SPL: create mints with interface PDAs, mint, transfer, approve, revoke, compress, decompress, merge, and Token-2022 with compression. Compressed token accounts are always rent-free. @lightprotocol/compressed-token (TypeScript) with createRpc() from 

### `copy-trade`
**Path:** `skills/copy-trade/SKILL.md`. **Manifest name:** `copy-trade`.
This skill should be used when the user asks to "copy trades from" a wallet, "mirror a wallet", "follow this address", set up "copy trading", "track and replicate a trader", or mirror another account's swaps bounded by guardrails. Watches a target wallet and mirrors its trades, filtered by chain, asset match,

### `create-agent-tui`
**Path:** `skills/create-agent-tui/SKILL.md`. **Manifest name:** `create-agent-tui`.
Scaffolds a complete agent TUI in TypeScript using @openrouter/agent — like create-react-app for terminal agents. Generates a customizable terminal interface with three input styles, four tool display modes, ASCII banners, streaming output, session persistence, and configurable tools. Use when building an age

### `dca-bot`
**Path:** `skills/dca-bot/SKILL.md`. **Manifest name:** `dca-bot`.
This skill should be used when the user wants to "dca into" a token, "buy X every day", set up a "recurring buy", "dollar cost average" into an asset, "schedule a buy", or "auto-buy on a dip". Buys a fixed amount into a token on a schedule, optionally only when a condition holds (for example only when ETH is 

### `deployer`
**Path:** `skills/deployer/SKILL.md`. **Manifest name:** `deployer`.
Deploy CCA (Continuous Clearing Auction) smart contracts using the Factory pattern. Use when user says "deploy auction", "deploy cca", "factory deployment", or wants to deploy a configured auction.

### `pay-with-any-token`
**Path:** `skills/pay-with-any-token/SKILL.md`. **Manifest name:** `pay-with-any-token`.
Use the **Tempo CLI** to call paid APIs and handle 402 challenges automatically.

### `pay-with-app`
**Path:** `skills/pay-with-app/SKILL.md`. **Manifest name:** `pay-with-app`.
Pay HTTP 402 challenges issued by OKX's **Agent Payments Protocol (APP)**

### `pay`
**Path:** `skills/pay/SKILL.md`. **Manifest name:** `pay`.
`pay` (also referred to as `pay-cli` or `pay.sh`) gives agents paid HTTP/API

### `percolator-markets`
**Path:** `skills/percolator-markets/SKILL.md`. **Manifest name:** `percolator-markets`.
Use when researching a Percolator perpetual market, reading market or insurance-fund state, or explaining how to launch, trade or stake. Read-only by default. Covers Musebook Clawd Chain terminals and PumpAI CLAWD Percolator devnet tools.

### `pons-launch`
**Path:** `skills/pons-launch/SKILL.md`. **Manifest name:** `pons-launch`.
Grounded in shipped `client/src/lib/pons-launch/registry.ts` and live probes.

### `token-research`
**Path:** `skills/token-research/SKILL.md`. **Manifest name:** `token-research`.
Use when researching Solana token launches, holder concentration, wallet clusters, token security, trading activity, or market context through PumpAI and Bubbles.

### `zk-omni-messaging`
**Path:** `skills/zk-omni-messaging/SKILL.md`. **Manifest name:** `zk-omni-messaging`.
Zero-knowledge omnichain messaging between Robinhood Chain and Solana using CheshireZkOmniMessenger (msgType 4) with nullifier anti-replay and the zk-omni-relayer service.

### `zk`
**Path:** `skills/zk/SKILL.md`. **Manifest name:** `zk`.
For custom ZK Solana programs and privacy-preserving applications to prevent double spending. Guide to integrate rent-free nullifier PDAs for double-spend prevention.

## Phoenix / Vulcan (18)

### `vulcan-error-recovery`
**Path:** `skills/vulcan-error-recovery/SKILL.md`. **Manifest name:** `vulcan-error-recovery`.
Error category routing and recovery for Vulcan/Phoenix perps. Use on failed CLI/MCP calls, tx failures, auth/config/API/network/rate-limit errors, and strategy recovery.

### `vulcan-execution-modes`
**Path:** `skills/vulcan-execution-modes/SKILL.md`. **Manifest name:** `vulcan-execution-modes`.
Canonical Vulcan execution mode taxonomy: Observe, Paper, Dry-Run, Confirm-Each, Auto-Execute. Use before launching strategies or live-capable perps flows.

### `vulcan-grid-trading`
**Path:** `skills/vulcan-grid-trading/SKILL.md`. **Manifest name:** `vulcan-grid-trading`.
Grid trading with layered limit orders on Phoenix perpetuals. Use for grid setup, monitoring, pausing/stopping, and live/paper grid strategy safety.

### `vulcan-lot-size-calculator`
**Path:** `skills/vulcan-lot-size-calculator/SKILL.md`. **Manifest name:** `vulcan-lot-size-calculator`.
Convert desired token/notional amounts to Phoenix base lots. Use whenever a Vulcan command requires size/base lots.

### `vulcan-margin-operations`
**Path:** `skills/vulcan-margin-operations/SKILL.md`. **Manifest name:** `vulcan-margin-operations`.
Vulcan/Phoenix collateral, deposits, withdrawals, transfers, isolated margin, leverage tiers, and margin health.

### `vulcan-market-intel`
**Path:** `skills/vulcan-market-intel/SKILL.md`. **Manifest name:** `vulcan-market-intel`.
Phoenix market data, tickers, orderbooks, candles, funding, spreads, liquidity, and pre-trade market context.

### `vulcan-onboarding`
**Path:** `skills/vulcan-onboarding/SKILL.md`. **Manifest name:** `vulcan-onboarding`.
First-run Vulcan setup for paper trading, wallet, registration, collateral, MCP skills, and live readiness.

### `vulcan-portfolio-intel`
**Path:** `skills/vulcan-portfolio-intel/SKILL.md`. **Manifest name:** `vulcan-portfolio-intel`.
Phoenix portfolio snapshots: margin, positions, resting orders, funding exposure, PnL, and account reporting.

### `vulcan-position-management`
**Path:** `skills/vulcan-position-management/SKILL.md`. **Manifest name:** `vulcan-position-management`.
List, show, close, reduce Phoenix positions and attach/cancel TP/SL.

### `vulcan-quickstart`
**Path:** `skills/vulcan-quickstart/SKILL.md`. **Manifest name:** `vulcan-quickstart`.
Five-minute Vulcan quickstart for install, health check, first market read, and first paper trade.

### `vulcan-risk-management`
**Path:** `skills/vulcan-risk-management/SKILL.md`. **Manifest name:** `vulcan-risk-management`.
Risk checks for Phoenix perps: margin health, leverage tiers, liquidation distance, notional caps, exposure, stops, and strategy guardrails.

### `vulcan-skills-index`
**Path:** `skills/vulcan-skills-index/SKILL.md`. **Manifest name:** `vulcan-skills-index`.
Index for the bundled Vulcan skill pack exposed through solana-clawd. Use to discover the correct focused Vulcan skill.

### `vulcan-ta-strategy`
**Path:** `skills/vulcan-ta-strategy/SKILL.md`. **Manifest name:** `vulcan-ta-strategy`.
Technical-analysis-driven Phoenix strategy runner using declarative rules and Vulcan strategy ledgers.

### `vulcan-technical-analysis`
**Path:** `skills/vulcan-technical-analysis/SKILL.md`. **Manifest name:** `vulcan-technical-analysis`.
Technical indicators and trigger evaluation for Phoenix markets: RSI, MACD, BBands, ATR, ADX, VWAP, Stoch, SMA, EMA.

### `vulcan-tpsl-management`
**Path:** `skills/vulcan-tpsl-management/SKILL.md`. **Manifest name:** `vulcan-tpsl-management`.
Take-profit and stop-loss setup, cancellation, laddered exits, position-side rules, and verification for Vulcan/Phoenix.

### `vulcan-trade-execution`
**Path:** `skills/vulcan-trade-execution/SKILL.md`. **Manifest name:** `vulcan-trade-execution`.
Safe Phoenix order execution via Vulcan: pre-trade checks, market/limit orders, paper/dry-run/live gates, and post-trade verification.

### `vulcan-twap-execution`
**Path:** `skills/vulcan-twap-execution/SKILL.md`. **Manifest name:** `vulcan-twap-execution`.
TWAP strategy execution on Phoenix perps using Vulcan's first-class runner, tick logs, ledgers, status/monitor/finalize controls.

### `vulcan`
**Path:** `skills/vulcan/SKILL.md`. **Manifest name:** `vulcan`.
Entry-point skill for Phoenix perpetuals through Vulcan/Rise SDK inside solana-clawd. Use before answering or acting on Vulcan, Phoenix DEX, Solana perps, paper trading, live trading, margin, TP/SL, TWAP, grid, TA strategies, or perps agent setup.

## Pump / Pump.fun (24)

### `pump-ai-agents`
**Path:** `skills/pump-ai-agents/SKILL.md`. **Manifest name:** `pump-ai-agents`.
Create and maintain AI-agent integration files for Pump.fun SDK work, including AGENTS/CLAUDE/COPILOT/GEMINI instructions, .well-known discovery, LLM context docs, skills registries, MCP prompts, and terminal rules. Use when wiring agents to Pump.fun development workflows.

### `pump-bonding-curve`
**Path:** `skills/pump-bonding-curve/SKILL.md`. **Manifest name:** `pump-bonding-curve`.
Implement Pump.fun bonding-curve math for token pricing, buy/sell quotes, fee-aware calculations, market cap, tiered fees, ceiling division, virtual versus real reserves, and migration edge cases. Use when reviewing or coding Pump.fun pricing logic.

### `pump-build-release`
**Path:** `skills/pump-build-release/SKILL.md`. **Manifest name:** `pump-build-release`.
Run and maintain Pump.fun SDK build, release, and publishing workflows across TypeScript, Rust, npm, Vercel, Makefile targets, linting, semantic release, and MCP server distribution. Use when preparing or debugging Pump.fun package releases.

### `pump-claims-readonly`
**Path:** `skills/pump-claims-readonly/SKILL.md`. **Manifest name:** `pump-claims-readonly`.
Query Pump.fun claim state without sending transactions: unclaimed token incentives, creator vault balances, volume accumulators, distributable fees, current-day token previews, and Pump/PumpAMM aggregate views. Use for read-only claim and fee diagnostics.

### `pump-fee-sharing`
**Path:** `skills/pump-fee-sharing/SKILL.md`. **Manifest name:** `pump-fee-sharing`.
Configure and distribute Pump.fun creator fees through the PumpFees program with BPS shareholder splits, admin management, validation, and Pump/PumpAMM fee consolidation for graduated tokens. Use when setting up or paying creator fee shares.

### `pump-fee-system`
**Path:** `skills/pump-fee-system/SKILL.md`. **Manifest name:** `pump-fee-system`.
Implement and audit the Pump.fun fee system, including market-cap fee tiers, creator fee vaults across Pump and PumpAMM, basis-point arithmetic, ceiling division, fee simulation, and dust-safe calculations. Use for protocol fee logic and creator-fee accounting.

### `pump-mcp-server`
**Path:** `skills/pump-mcp-server/SKILL.md`. **Manifest name:** `pump-mcp-server`.
Build and operate a Pump.fun Model Context Protocol server for AI agents, covering stdio transport, wallet/session safety, quoting, transaction builders, fee management, analytics, AMM operations, and prompt/resource design. Use when exposing Pump.fun operations through MCP.

### `pump-rust-vanity`
**Path:** `skills/pump-rust-vanity/SKILL.md`. **Manifest name:** `pump-rust-vanity`.
Build production Rust vanity-address tooling for Pump.fun/Solana wallets with Rayon parallelism, solana-sdk key generation, Base58 prefix/suffix matching, secure file output, zeroization, and Criterion benchmarks. Use for high-throughput vanity generation.

### `pump-sdk-core`
**Path:** `skills/pump-sdk-core/SKILL.md`. **Manifest name:** `pump-sdk-core`.
Build and extend the Pump.fun SDK core: offline TypeScript instruction builders, online RPC helpers, account decoders, PDAs, token creation, buy/sell, migration, fee collection, PumpAMM, PumpFees, and Mayhem support. Use for SDK API and implementation work.

### `pump-security`
**Path:** `skills/pump-security/SKILL.md`. **Manifest name:** `pump-security`.
Apply Pump.fun SDK security practices across Rust, TypeScript, and Bash: key handling, memory zeroization, secure file I/O, input validation, privilege boundaries, dependency auditing, and wallet/tool hardening. Use for Pump.fun security reviews and fixes.

### `pump-shell-scripts`
**Path:** `skills/pump-shell-scripts/SKILL.md`. **Manifest name:** `pump-shell-scripts`.
Write and maintain secure Bash tooling for Pump.fun/Solana workflows, including vanity generation wrappers, keypair verification, batch jobs, dependency audits, test orchestration, file permissions, input validation, and cleanup traps.

### `pump-solana-architecture`
**Path:** `skills/pump-solana-architecture/SKILL.md`. **Manifest name:** `pump-solana-architecture`.
Design Pump.fun Solana program architecture, PDAs, account layouts, global singletons, per-token state, per-user accumulators, Mayhem accounts, and cross-program coordination across Pump, PumpAMM, PumpFees, and Mayhem. Use for account-model or PDA work.

### `pump-solana-dev`
**Path:** `skills/pump-solana-dev/SKILL.md`. **Manifest name:** `pump-solana-dev`.
Apply Solana development patterns used by Pump.fun: Anchor IDL interaction, SPL Token and Token-2022 handling, transaction instruction composition, RPC batching, account decoding, simulation, BN arithmetic, and cross-program coordination.

### `pump-solana-wallet`
**Path:** `skills/pump-solana-wallet/SKILL.md`. **Manifest name:** `pump-solana-wallet`.
Generate and validate secure Solana wallets for Pump.fun workflows using official Solana libraries, Ed25519 keypairs, offline operation, memory zeroization, secure file permissions, and Rust/TypeScript/Bash implementations.

### `pump-testing`
**Path:** `skills/pump-testing/SKILL.md`. **Manifest name:** `pump-testing`.
Design and run Pump.fun SDK test infrastructure across Rust, TypeScript, Python, and Bash, including unit tests, integration tests, security tests, fuzzing, shell orchestration, Criterion benchmarks, coverage, and CI gates.

### `pump-token-incentives`
**Path:** `skills/pump-token-incentives/SKILL.md`. **Manifest name:** `pump-token-incentives`.
Implement and operate Pump.fun PUMP token incentive rewards with day-indexed epochs, pro-rata volume distribution, user/global accumulators, sync and claim flows, and Pump/PumpAMM cross-program aggregation.

### `pump-token-lifecycle`
**Path:** `skills/pump-token-lifecycle/SKILL.md`. **Manifest name:** `pump-token-lifecycle`.
Manage the full Pump.fun token lifecycle from creation through bonding-curve trading, graduation detection, AMM migration, AMM trading, creator fee collection, and volume tracking with PumpSdk and OnlinePumpSdk.

### `pump-ts-vanity`
**Path:** `skills/pump-ts-vanity/SKILL.md`. **Manifest name:** `pump-ts-vanity`.
Build educational TypeScript vanity-address tooling for Pump.fun/Solana wallets with @solana/web3.js, async generators, event-loop yielding, prefix/suffix matching, batch search, and best-effort memory zeroization.

### `pumpai-feed`
**Path:** `skills/pumpai-feed/SKILL.md`. **Manifest name:** `pumpai-feed`.
Use when the user asks for PumpAI launches, the PumpAI Launch Desk, feed health, daily research picks, or the Imperial and CLAWD Percolator tools exposed on pumpai.ai/mcp.

### `pumpfun-analytics`
**Path:** `skills/pumpfun-analytics/SKILL.md`. **Manifest name:** `pumpfun-analytics`.
Quick Pump.fun analytics shortcut for bonding curve state, graduation progress, price impact, token pricing, fee tiers, and buy/sell quote checks. Use for lightweight read-only token analysis.

### `pumpfun-fees`
**Path:** `skills/pumpfun-fees/SKILL.md`. **Manifest name:** `pumpfun-fees`.
Quick Pump.fun fee shortcut for creator fee sharing setup, shareholder BPS splits, claim/distribution flows, fee-tier checks, token incentives, and automated fee monitoring.

### `pumpfun-launcher`
**Path:** `skills/pumpfun-launcher/SKILL.md`. **Manifest name:** `pumpfun-launcher`.
Quick Pump.fun token-launch shortcut for creating tokens with the Pump SDK, optional initial buys, metadata upload flow, Mayhem mode, and launch safety checks.

### `pumpfun-trading`
**Path:** `skills/pumpfun-trading/SKILL.md`. **Manifest name:** `pumpfun-trading`.
Quick Pump.fun trading shortcut for buy/sell flow selection, bonding curve versus AMM state checks, slippage handling, risk controls, and SDK trade instruction building.

### `pumpfun`
**Path:** `skills/pumpfun/SKILL.md`. **Manifest name:** `pumpfun`.
Entry-point router for the local Pump.fun skill suite. Use when the user asks about launching Pump.fun tokens, bonding-curve or AMM trading, quotes, fees, claims, incentives, SDK work, agent/MCP integration, security, testing, or release workflows.

## agent-orchestration (7)

### `agent-self-scheduling`
**Path:** `skills/agent-self-scheduling/SKILL.md`. **Manifest name:** `agent-self-scheduling`.
Make an AI agent run on a schedule, loop, or interval — cron, heartbeats, recurring autonomous checks. Use for "run every N minutes", "schedule a task", "run on a loop", "heartbeat". Covers external clocks (Claude Code, Codex, Pi) vs Hermes' built-in scheduler.

### `cmux`
**Path:** `skills/cmux/SKILL.md`. **Manifest name:** `cmux`.
MUST be read ANY time you interact with cmux in ANY way — listing/inspecting/creating/closing cmux workspaces, panes, or surfaces; reading or capturing pane/screen output; sending input or keys to a pane/surface; delegating to, polling, or checking on other agents running in cmux panes/surfaces; building or r

### `codex-subagent`
**Path:** `skills/codex-subagent/SKILL.md`. **Manifest name:** `codex-subagent`.
Launch OpenAI Codex CLI as a subagent (ChatGPT subscription auth, no API key). Use when delegating a self-contained coding task to Codex from another agent — parallel implementation work, a second opinion, or an independent verification pass.

### `fable-safe-prompt`
**Path:** `skills/fable-safe-prompt/SKILL.md`. **Manifest name:** `fable-safe-prompt`.
Rewrite a user's prompt to reduce the chance it trips Claude Fable 5's server-side safety classifiers (cyber/bio guardrails that force-route to Opus 4.8 or return stop_reason "refusal"). Use when the user hands you a prompt that touches cybersecurity, auth, exploits, malware, pentesting, or other dual-use top

### `goal-loop`
**Path:** `skills/goal-loop/SKILL.md`. **Manifest name:** `goal-loop`.
Explain and write effective instructions for the `/goal` feature — the persistent self-checking agent loop (plan → act → test → review → iterate), available in agents like Codex, Claude Code, and Hermes Agent. Use when the user mentions `/goal`, "goal loop", "Ralph loop", wants to kick off a long-running auto

### `handoff`
**Path:** `skills/handoff/SKILL.md`. **Manifest name:** `handoff`.
Compact the current conversation into a single, detailed handoff message — everything that happened, why it happened, and what's left — output in a code block so it can be copy-pasted into a fresh agent session. Use when hitting context limits, switching focus, ending a work session, or partitioning a task ac

### `run-deep-swe`
**Path:** `skills/run-deep-swe/SKILL.md`. **Manifest name:** `run-deep-swe`.
Score any AI model on the DeepSWE coding-agent benchmark via the OpenRouter API. Use when the user wants an independent, reproducible coding-agent eval — "run DeepSWE", "benchmark this model on DeepSWE", "score model X on the coding benchmark", "test a model via OpenRouter on DeepSWE", or to verify vendor-rep

## clawd-pump-agent-skills (13)

### `alpha-scanner`
**Path:** `skills/alpha-scanner/SKILL.md`. **Manifest name:** `alpha-scanner`.
Scan Solana for early trading opportunities (new launches, unusual volume, social catalysts, and smart-money flow) and present structured alpha reports. Use when hunting early token signals. Not a buy recommendation.

### `clawhunter-bounties`
**Path:** `skills/clawhunter-bounties/SKILL.md`. **Manifest name:** `clawhunter-bounties`.
Claw Hunter is an HTTP API over crowdsourced crypto bounties aggregated from

### `clawhunter-content-studio`
**Path:** `skills/clawhunter-content-studio/SKILL.md`. **Manifest name:** `clawhunter-content-studio`.
Claw's agent tools for producing social/crypto content — text, images, video

### `clawpump`
**Path:** `skills/clawpump/SKILL.md`. **Manifest name:** `clawpump`.
ClawPump on Solana — create/chat with agents, trade, perps, DCA, lend, launch tokens, marketplace, predictions, gift cards, agent email, intelligence via mcp_clawpump_* tools. Use when the user mentions ClawPump, launching a token, an agent's wallet/balance, swaps, perps, gift cards, agent email, or DeFi on S

### `dca-strategy`
**Path:** `skills/dca-strategy/SKILL.md`. **Manifest name:** `dca-strategy`.
Plan and execute dollar-cost averaging into a Solana token on a budget, frequency, and duration, with per-interval reporting and a weekly summary. Use when the user wants a recurring buy plan.

### `dex-pools`
**Path:** `skills/dex-pools/SKILL.md`. **Manifest name:** `dex-pools`.
Solana DEX liquidity, OHLCV candles, and venue discovery for any token/pool via GeckoTerminal (keyless). Use to sanity-check swap slippage, find the deepest venue, and read price history.

### `laso-finance`
**Path:** `skills/laso-finance/SKILL.md`. **Manifest name:** `laso-finance`.
Order and manage Laso Finance wallet cards, gift cards, push-to-card payouts, and account state on Solana. Quote first, then wait for explicit approval before any paid order or secret reveal.

### `meme-analyzer`
**Path:** `skills/meme-analyzer/SKILL.md`. **Manifest name:** `meme-analyzer`.
Structured Solana meme-token analysis covering liquidity, holder distribution, social sentiment, rug-pull red flags, and a 0-100 score. Use when the user asks to analyze a meme token. Not financial advice.

### `risk-manager`
**Path:** `skills/risk-manager/SKILL.md`. **Manifest name:** `risk-manager`.
Pre-trade risk checks for position sizing, concentration, drawdown, and liquidity, returning a 1-10 score and a proceed, reduce, review, or block recommendation. Use before significant swaps.

### `rug-check`
**Path:** `skills/rug-check/SKILL.md`. **Manifest name:** `rug-check`.
Solana token safety diligence: mint/freeze authority, LP lock/burn, top-holder concentration, RugCheck score. Read-only — run before swapping into or launching alongside any token.

### `straight-talk`
**Path:** `skills/straight-talk/SKILL.md`. **Manifest name:** `straight-talk`.
Turn an agent trade, launch, hold, or flat day into an honest public SOAG post with no price promises and a trap flag when needed. Use when writing social posts about trading activity.

### `survivor-check`
**Path:** `skills/survivor-check/SKILL.md`. **Manifest name:** `survivor-check`.
Judge whether a Solana token has earned trust by surviving (age, liquidity still present, two-sided volume) or is a trap, and return a survivor, wait, or trap verdict. Use before buying.

### `whale-tracker`
**Path:** `skills/whale-tracker/SKILL.md`. **Manifest name:** `whale-tracker`.
Monitor and interpret large Solana wallet movements (accumulation, exits, and net flow) while excluding protocol and exchange addresses. Use when the user asks what whales are doing.

## pump-fun (5)

### `coin-fees`
**Path:** `skills/coin-fees/SKILL.md`. **Manifest name:** `coin-fees`.
**MANDATORY — Do NOT write or modify any code until every item below is answered by the user:**

### `create-coin`
**Path:** `skills/create-coin/SKILL.md`. **Manifest name:** `create-coin`.
**MANDATORY — Do NOT write or modify any code until every item below is answered by the user:**

### `interacting`
**Path:** `skills/interacting/SKILL.md`. **Manifest name:** `interacting`.
Load this skill when building PumpKit bots or looking up pump.fun protocol docs.

### `swap`
**Path:** `skills/swap/SKILL.md`. **Manifest name:** `swap`.
**MANDATORY — Do NOT write or modify any code until every item below is answered by the user:**

### `tokenized-agents`
**Path:** `skills/tokenized-agents/SKILL.md`. **Manifest name:** `tokenized-agents`.
**MANDATORY — Do NOT write or modify any code until every item below is answered by the user:**

## zk-omni-messaging (1)

### `zkrouter`
**Path:** `skills/zkrouter/SKILL.md`. **Manifest name:** `zkrouter`.
Self-hosted OpenAI-compatible LLM router — smart tier-based routing, ZK-stamped routing decisions, mode overrides, free OpenRouter at install via the Birth bot. Save 60-80% on inference costs by routing to the cheapest capable model across 12+ OpenRouter models.

