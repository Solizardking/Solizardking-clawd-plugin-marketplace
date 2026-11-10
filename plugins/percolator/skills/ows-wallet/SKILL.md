---
name: ows-wallet
description: Use when the user wants to create or manage an Open Wallet Standard (OWS) wallet, sign an on-chain transaction or a message, or connect the local vault to a ChatGPT-compatible MCP client.
---

# CLAWD OWS Wallet

OWS stores keys **locally**. An installed skill or remote read-only MCP connector does not create or own user wallets, and no wallet is provisioned by this plugin package alone. For Percolator and Imperial work, default to read-only research; signing happens on the owner's device after they approve the exact transaction.

## Creation path

1. Owner installs `@open-wallet-standard/core` and creates an encrypted local vault, for example via `ows wallet create --name my-wallet` in their own trusted terminal. Never ask for a mnemonic, private key, passphrase, or OWS agent token in chat.
2. For a local MCP-capable client, optionally use the example `examples/ows-local-bridge/server.mjs`, which exposes `ows_wallet_create` and `ows_wallet_list` through **stdio**. The owner configures `OWS_VAULT_PASSPHRASE` in their own local protected process environment, sets `OWS_ALLOW_CREATE=1`, and installs dependencies. Do not configure this example on an untrusted public/cloud host. It is sample code, not a deployed wallet service.
3. Owner receives only wallet ID, public CAIP chain IDs and addresses in chat. The vault and backups stay under user control. New OWS wallets may derive several chain addresses at once.
4. A cloud ChatGPT connector cannot connect directly to local stdio in all clients. Before claiming native in-chat wallet creation, verify the user's client supports that executor or complete an authenticated, owner-controlled pairing bridge. No shared remote vault or app-wide passphrase.

PumpAI also hosts a separate `/perps` paper vault UI. That path uses a **server-side** OWS vault and is not the default for this plugin. Do not create or fund a hosted custody wallet unless the owner explicitly asks for that exact service. Live trading on that UI is documented as off (`LIVE_TRADING=false`) when last checked.

## Signing contract & gated actions

- `sign(walletId,chainId,transactionHex)` signs serialized bytes but does not broadcast; requires scoped auth and policy evaluation.
- `signAndSend(...)` requires the same checks plus explicit owner confirmation of network, recipient, amount, fees and simulation. Return stable tx ID only after broadcast; never retry ambiguous submissions blindly. Refuse Solana mainnet submits unless the owner approved that exact transaction.
- `signMessage` for Solana uses Ed25519 raw bytes; EVM uses EIP-191. Warn before signing human-readable and opaque messages alike.
- `signTypedData` is EVM-only EIP-712. `signHash` is for secp256k1-backed chains only. `signAuthorization` EIP-7702 can delegate EOA execution: require especially prominent review and chain/domain checks.
- Transaction input is **hex-encoded already serialized bytes**. Validate CAIP identifiers, wallet scopes, expiry, allowlists, amounts, calldata/recipient and simulation before any signing. Owner bypass of agent policy is **not** permission for a model to sign without owner confirmation.
- Per-wallet nonce coordination/serialization must be implemented by the caller; never claim OWS handles it. Report errors accurately: `WALLET_NOT_FOUND`, `CHAIN_NOT_SUPPORTED`, `INVALID_PASSPHRASE`, `INVALID_INPUT`, `CAIP_PARSE_ERROR`, `POLICY_DENIED`, `API_KEY_NOT_FOUND`, `API_KEY_EXPIRED`.
- The included local bridge **does not expose signing or broadcasting**; these require additional audited owner-approval and policy-gated implementation. See `references/ows-signing-architecture.md`.

Reference: https://github.com/open-wallet-standard/core/blob/main/docs/sdk-node.md and https://docs.openwallet.sh/ .
