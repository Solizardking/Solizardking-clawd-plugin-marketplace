---
name: solana-vanity-wallet
description: Generate secure local Solana vanity addresses such as pump-prefixed addresses, verify keypairs and teach one-time recovery reveal.
---
# Private vanity Solana wallet

A case-sensitive base58 prefix such as `pump` is valid, but longer prefixes require exponentially more attempts. Use trusted offline `solana-keygen grind --starts-with pump:1` **on the owner's device**, never on a shared service, AI chat server or Railway instance. The resulting keypair MUST be imported to a user-controlled encrypted OWS vault before funding; ensure safe backup and a recovery drill. CLI file permissions and disk encryption are important; the CLI creates a key file and is **not** an ephemeral non-saving mode.

Verify an existing keypair by signing a fresh nonce and verifying Ed25519 against its claimed public key. A Solana PDA can be off-curve and has no corresponding private key; checking the curve alone does not establish ownership.

For a one-time reveal UX, draw the recovery phrase only in a local trusted client surface, require press-and-hold, block screenshots where platform permits, consume a one-use reveal token, hide on release/background and zeroize buffers where possible. One-time reveal does not prevent OS, browser extension or screenshot capture. Never reveal or send secrets via MCP/ChatGPT.

True ephemeral wallets are memory-only and unrecoverable when the session dies; encrypted persistent vault mode is recommended for funds.
