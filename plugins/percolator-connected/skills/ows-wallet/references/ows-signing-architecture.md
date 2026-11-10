# Reference signing architecture (not yet active in CLAWD)

Local vault (owner-controlled, encrypted) -> authenticated, per-user signer -> per-wallet scoped API token -> policy engine -> user approval -> OWS SDK signer -> optionally submit signed bytes -> chain confirmation tracker.

Supported desired surface:

| Operation | Input | Gate |
| --- | --- | --- |
| sign | walletId, CAIP chainId, serialized transactionHex | auth + policy + owner approval |
| signAndSend | previous plus optional rpcUrl | same plus simulation, nonce and idempotency management; mainnet only after exact-tx approval |
| signMessage | walletId, chainId, message, encoding | origin and message review |
| signTypedData | EVM walletId, typedDataJson | complete domain, verifyingContract, chain review |
| signHash | 32-byte hash; secp256k1 chain | heightened review; opaque preimage cannot be decoded |
| signAuthorization | EVM delegate address and nonce | explicit EIP-7702 delegate and expiry/nonce review |

Never store raw private keys in secrets/env or send them to the model. Vault passphrase is configured only on user-controlled device, not passed through an MCP request. Do not expose the example local creation bridge to the public internet. For multisession cloud, design separately with passkey-authorized client signing or hardware-backed per-user isolation, independent identity mapping and auditable revocation. A common global `COMPOSIO_API_KEY` is not authorization to touch any user's wallet.
A hosted PumpAI `/perps` vault, if used at all, is a different trust model (server-held encrypted keys) and is not enabled by this package.
