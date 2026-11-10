# Protocol and integration inventory

This document separates observed bundled source material from planned integrations. **Nothing below certifies production deployment or live execution.**

## MCP and ChatGPT UI
- Model Context Protocol (MCP): Streamable HTTP servers; initialize, tools/list and tools/call; MCP Apps resource `ui://` and embedded trade ticket; host tool calls are not owner signatures.
- Existing plugin MCP entries are `https://pumpai.ai/mcp`, `https://pumpai.ai/tools`, and Bubblemaps documentation `https://docs.bubblemaps.io/mcp` (documentation, not a live analytics service).
- Proposed canonical proxy `https://mcp.percolator.trade/mcp` must be DNS/TLS and production readiness tested before switching clients. Use the dedicated backend for authenticated operations; don't naively expose an unauthenticated write MCP as a global plugin connection.
- Dynamic per-user auth: authorization bearer for each principal; nonces, refresh/revocation; never one shared trading JWT in a public process.

## Execution and market protocols
- Solana: Ed25519, base58 public addresses, Solana versioned transactions and blockhash expiry, RPC confirmation, program-derived addresses (off curve), Token/Token-2022, CAIP-2 identification, Solana devnet versus mainnet.
- Imperial: JWT-backed `/api/v1/mobile/*` order flow, venue router, Phoenix underwriter 2, profiles, micro-USDC scale, mark and trigger price scale, positions/orders/preflight; HTTP 200 may still be an order rejection; maker and taker venue behavior must be rechecked upstream.
- Phoenix Eternal: public REST `/v1/view/exchange/markets`, `/v1/view/orderbook/{symbol}`, `/v1/candles/{symbol}`, `/v1/trader/state/{authority_pubkey}`; optional wallet challenge JWT; separate Rise SDK `@ellipsis-labs/rise`, Vulcan CLI, order instructions, fee payer signatures, margin, funding, TP/SL, TWAP, grid, and TA. Auth never replaces owner transaction signing.
- Percolator: risk engine/market program, CLAWD collateral and oracle mechanisms; distinct clusters and program IDs must not be mixed. Devnet and local staging before any mainnet support. No program audit was supplied.
- Pump.fun and PumpSwap, Raydium LaunchLab/Stonk, Jupiter swaps, DFlow quotes, Helius RPC/DAS, Solana Tracker, Bubblemaps metrics: external market/data rails; distinguish data retrieval, unsigned instruction builders, and actually authorized execution.
- x402: HTTP 402 challenge/settlement and per-tool payments; do not let agent loops spend without per-asset and per-day policies. CLAWD holder authentication is separate from spending authority.
- Agent metadata: owner-signed identity, wallet-scoped permissions, SIWS challenge/verify, delegated session boundaries and policy attached to a scoped API key.

## Wallet architecture
- OWS v1.4 encrypted storage and `ows_key_` token-as-capability: HKDF/AES-GCM key separation, wallet scoping, rules AND custom executables. OWS owner passphrase bypasses agent rules, so it must never be offered to a model tool.
- OWS calls: sign, signAndSend, signMessage, signTypedData (EIP-712), signHash, signAuthorization (EIP-7702), list and create. These are heterogeneous across chains and require operation-specific policy inspection.
- Ephemeral Solana wallets: private key generated client-side in a secure, user-controlled context, never sent to ChatGPT or shared API. One-time 'press-and-hold' display is a UX behavior, not secure custody by itself.
- Vanity `pump` addresses: case-sensitive Solana base58 prefix, generated locally, preferably offline. The new candidate cannot be installed as an OWS wallet without an import path and an encrypted backup; a zero-persistence browser-only key is irrecoverable after exit.
- Verify a Solana keypair by signing a challenge and verifying Ed25519 against the claimed pubkey; never infer ownership from matching string metadata or on-curve status alone.

## Safety boundaries
- Observe / quote / plan / paper / dry-run / live are distinct states. All live operations require explicit principal approval of the exact order or transaction, per-wallet and per-chain scope, risk checks, signed nonce, expiry and replay protection.
- Policy service: allowlist instruments, side, profile, venue, max notional, leverage, slippage, cumulative daily exposure, account health, mark freshness, PnL, and emergency kill switch; unknowns deny.
- Signed approval is separate from Imperial's delegated JWT. Hosted token refresh and routing must be isolated per account. OWS agent token policy is not a substitute for a separate delegated trading credential.
- Background strategy workers and multi-instance hosts require transactional shared storage and reconciliation, not in-memory or SQLite counters replicated across pods.
- Never put a wallet seed, private key, vault password, OWS capability token, Imperial JWT, Phoenix JWT, or Composio API key in skill bundles or tool output.

## Documentation provenance
- Upload: `clawd-percolator-connected-v0.6.9.0.zip` (actual manifest v0.6.0); this inventory is source-derived.
- `https://docs.phoenix.trade/llms.txt` (Phoenix API and SDK docs; verified in the current task).
- `https://docs.openwallet.sh/doc.html?slug=03-policy-engine`, `05-key-isolation`, `02-signing-interface` (OWS user-supplied docs).
- `https://github.com/Solizardking/imperial-perps-mcp-server` (observed source including `server.py`).
