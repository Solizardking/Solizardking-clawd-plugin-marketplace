---
name: phoenix-trader
description: Read Phoenix Eternal markets, orderbooks, trader capabilities, trader state and use Phoenix Rise/Vulcan safely.
---
# Phoenix Trader / Vulcan

Start with https://docs.phoenix.trade/llms.txt. Most Phoenix market/trader GETs are public. The Rise SDK (`@ellipsis-labs/rise`) is the preferred typed surface for exchange metadata, streaming trader state and building instructions. The `vulcan-*` skill pack documents its CLI and execution modes.

Supported proposed MCP tools: `phoenix_markets`, `phoenix_market`, `phoenix_orderbook`, `phoenix_mark_price`, `phoenix_candles`, `phoenix_funding_rates`, `phoenix_trader_state`, `phoenix_wallet_login_challenge`, and read-only capability metadata. They only become live when the safe gateway deploys successfully.

Phoenix wallet auth: get nonce, let owner sign exact message locally, submit to login from a private client, rotate access+refresh tokens privately. An auth JWT is not a Solana transaction signature. No direct Phoenix write from ChatGPT until independently tested owner-signer, preflight, margin, slippage and transaction simulation.
