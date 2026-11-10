# Local OWS wallet MCP bridge — example, not deployed

This is a user-owned **stdio** bridge for a ChatGPT-compatible local MCP executor or Codex. It is not automatically reachable from ChatGPT web. It creates actual encrypted OWS wallets via the official SDK when run locally.

1. Install Node.js 20+ and run `npm install` in this directory.
2. Configure `OWS_VAULT_PASSPHRASE` securely on **your device** using the platform's secrets/keychain manager. Never paste it into a chat, GitHub, cloud dashboard or the plugin archive. Set `OWS_ALLOW_CREATE=1` only for the time you intend to allow new wallets.
3. Register a local `stdio` MCP server command `node /absolute/path/examples/ows-local-bridge/server.mjs` in a client that supports local MCP executors. Use your client’s secured environment injection.
4. Ask for `ows_wallet_list` or `ows_wallet_create` and verify that the returned address is accessible from the local vault. Back up the vault and confirm restore before funding.
5. Disable `OWS_ALLOW_CREATE` when setup finishes. Production signing requires owner-side request review, policy enforcement, simulation and wallet-scoped auth. Do not expose this server over HTTP.

This bridge uses `createWallet(name, passphrase, 12)` and `listWallets()` from OWS. Signing tools are deliberately NOT exposed.

This same local vault is the preferred signing path for Percolator and Imperial work in this plugin. The bridge still does not expose signing tools.
