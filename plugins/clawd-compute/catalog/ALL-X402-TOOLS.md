# All Clawd x402 Tools — one list

Compiled 2026-11-21; section 1 recompiled 2026-11-24 from the live gateway catalog
(GET https://clawdcompute.us/v1/tools). Sections 2-3 as compiled 2026-11-21 from the
Musebook x402 registry (GET https://musebook.trade/api/x402/catalog) and the
live Clawd Domains service at domains.musebook.trade (OpenAPI + .well-known/x402, read 2026-11-21).

## 1. ClawdCompute gateway — per-tool x402

- **Base URLs (added 2026-11-21 — the tools went main on both public hosts):** the same catalog and per-tool endpoints answer identically at `https://clawdcompute.us/v1/tools`, `https://x402.wtf/v1/tools`, and `https://x402.life/v1/tools` (mainnet rails only). The two public hosts facade to the gateway — execution, pricing and settlement stay single-sourced, the 402 challenge is the gateway's own, and every settled payment is traced into a daily per-chain/per-stable rollup (~/workspace/x402-tracing/).
- Endpoint pattern: `POST https://clawdcompute.us/v1/tools/<tool_name>` with `{"arguments": {...}}` (same path on x402.wtf / x402.life)
- Catalog: **262 tools — 244 payable, 18 free**; flat **$0.01 USDC** per payable call
- Networks: Solana (`solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`) and Base (`eip155:8453`)
- payTo — Solana: `5rxgJXoN2xvoZHcLXav1pEHAhvygLziZsz3xAzNEJfgr` · Base: `0x984d175669bfd511316eee81c6af4ad4c89de630`
- Settlement: Solana via the x402.wtf facilitator + on-chain confirmation; Base via EIP-3009 through the CDP facilitator. One payment = one execution; replays get 409.
- Locked servers (callable through the same endpoint with the caller's own Clerk OAuth token; tools not publicly enumerated): Perps MCP (mcp.perps.musebook.trade) and Musebook MCP (musebook.trade).

### Payable tools ($0.01 each)

| Tool | What it does |
| --- | --- |
| `ai_chat` | Chat completion over the Musebook AI catalog: the Workers AI chat models listed at ai.musebook.trade/v1/models |
| `ai_decide` | Clef typed decisions: given a state text and a set of named questions, return a choice with per-option probabi |
| `ai_extract` | Clairic typed extraction: pull typed values (text, number, date, time, datetime, duration, list, estimate, for |
| `backpack_candles` | OHLCV candles (klines) for a Backpack market symbol. Intervals from 1s to 1month; priceType Last/Index/Mark fo |
| `backpack_depth` | Order book depth for a Backpack market symbol: best bids/asks with spread and mid, plus top levels per side. R |
| `backpack_mark_prices` | Perpetual mark prices for Backpack: mark, index, funding rate and next funding time per perp — including the s |
| `backpack_market` | Full detail for one Backpack market: state, order book state and the complete price/quantity filters (tick siz |
| `backpack_markets` | List Backpack markets (spot, perpetuals, prediction). Stock and index markets are flagged via rwaMarketType (S |
| `backpack_open_interest` | Open interest for Backpack perpetuals — one symbol, or all perps (optionally stocksOnly). Read-only. |
| `backpack_rfq_estimate` | Book-derived block size estimate for any Backpack market: walks the public order book for the requested side a |
| `backpack_rfq_indicative` | RFQ indicative quote for a US stock from the Backpack exchange broker — the same broker that quotes live stock |
| `backpack_status` | Backpack Exchange operational status (GET /status). Read-only. |
| `backpack_stocks_actions` | Corporate actions (cash dividends, splits) for Backpack-listed stocks, with ex/record/pay dates. Optional tick |
| `backpack_stocks_list` | The Backpack US securities catalogue: every stock tradable on Backpack (1,200+ names) with CUSIP, company name |
| `backpack_stocks_quote` | Three-way quote for a US stock on Backpack: the exchange broker's indicative bid/ask (the RFQ pricing source), |
| `backpack_stocks_sessions` | US equity session hours on Backpack (pre-market / regular / post-market / overnight, America/New_York), which  |
| `backpack_ticker` | 24h ticker for one Backpack market symbol (last price, high/low, change %, volume, trades). Pass source=Extern |
| `backpack_trades` | Recent public trades for one Backpack market symbol (price, quantity, quote quantity, buyer-maker flag, timest |
| `desk_bottom_board` | Call the Bottom board: live BTC/SOL/ETH prices vs their running season bottoms, the desk context (Smart Play s |
| `desk_engine_verdict` | Unified Engine verdict per asset: the Bottom Engine's V Score against the Top Engine's Top Score, with price p |
| `desk_exit_evaluate` | Exit Engine: evaluate one open position (asset, entry price, optional USD size and entry date) against the des |
| `desk_fear_greed` | Clawd Fear & Greed index: per-asset (BTC/SOL/ETH) and composite 0-100 readings with band labels and the full c |
| `desk_top_board` | Top Hunter board: per-asset running tops (intraday/daily/weekly/cycle timeframes vs the guarded cycle ATH), To |
| `equities_candles` | Candles for a ticker from Backpack (24h of klines, any Backpack interval) or Financial Datasets (daily, 30d).  |
| `equities_fundamentals` | Financial Datasets fundamentals for a ticker: financial metrics, company facts, earnings, news. Returns financ |
| `equities_list` | Registry of tokenized equities on Solana: ticker -> Financial Datasets ticker, Backpack perp symbol, RPC-verif |
| `equities_market_status` | US market open/closed (America/New_York 09:30-16:00, Mon-Fri) plus per-leg staleness notes. |
| `equities_quote` | Three-way quote for a tokenized equity: Financial Datasets underlying snapshot vs Backpack perp mark vs on-cha |
| `equities_raydium_pools` | Raydium pools for a tokenized equity (registry ticker or raw mint) via Raydium api-v3: pool type/program, pric |
| `equities_raydium_price` | Batch USD prices from Raydium api-v3 /mint/price for registry tickers and/or raw Solana mints (up to 20). |
| `equities_stonk_stocks` | Tokenized-stock catalog from stonk.fun: the stock tokens (xStocks, Sunrise/Backpack Securities, prestock, bask |
| `equities_stonk_token` | Detail for one stonk.fun token by mint or registry ticker: live market block, launch record (creator, start/ta |
| `equities_stonk_tokens` | Search/list tokens on stonk.fun with live market data (price, market cap, volume, liquidity, graduation progre |
| `equities_token_info` | On-chain mint truth via Solana RPC: supply, mint/freeze authorities, top holders. Accepts a registry ticker or |
| `equities_wallet` | A Solana wallet's holdings of registry tokenized equities, valued at the on-chain price and (when available) t |
| `massive_candles` | Custom-range OHLC aggregates for a US stock: multiplier × timespan (minute/hour/day/week/month/quarter/year) b |
| `massive_dividends` | Cash dividends for US stocks (declaration/ex/record/pay dates, amount, frequency) — filter by ticker or list r |
| `massive_indicator` | Technical indicator series for a US stock: SMA, EMA, RSI (window) or MACD (12/26/9) over a timespan. Read-only |
| `massive_market_status` | US market status right now (open/closed, exchange states) plus upcoming holidays and early closes (Massive mar |
| `massive_news` | Recent news for a US ticker (or market-wide when ticker is omitted), with publisher, summary and Massive's sen |
| `massive_open_close` | One specific day's official open/close for a US stock, with pre/post-market prints when available. Read-only. |
| `massive_prev_day` | Previous trading day's OHLC + volume + VWAP for a US stock (Massive aggregates). Read-only. |
| `massive_related_companies` | Companies related to a US ticker (peers by Massive's related-companies graph). Read-only. |
| `massive_short_interest` | Short interest for a US ticker (settlement-date series: shares short, avg daily volume, days to cover) or rece |
| `massive_splits` | Stock splits for US stocks (execution date, split factors) — filter by ticker or list recent market-wide. Read |
| `massive_ticker_overview` | Reference overview for a US ticker: company name, CIK, market cap, industry/SIC, exchange, share class shares  |
| `massive_ticker_search` | Search/list US tickers by name or symbol substring (Massive reference data). Read-only. |
| `pumpai_analyze_phoenix_account_health` | Phoenix Eternal: account health context — trader account state plus the market's risk factors (maintenance/bac |
| `pumpai_batch_wallet_identity` | Helius Wallet API: identity info for multiple wallets (fetched per address and merged). Read-only. |
| `pumpai_calculate_phoenix_position_margin` | Phoenix Eternal: estimate a position's margin from the market's leverage tiers and risk factors at the latest  |
| `pumpai_clawd_coinbase_balance` | Proxy to Coinbase for Agents balance. |
| `pumpai_clawd_composio_search` | Search Instant toolkits for trading research. Returns prices when available. |
| `pumpai_clawd_composio_verify` | Verify COMPOSIO_API_KEY works. |
| `pumpai_clawd_create_approval` | Create a pending action that requires explicit user approval. |
| `pumpai_clawd_decide_approval` | Approve or reject a pending CLAWD request. |
| `pumpai_clawd_instant_trading_research` | One-shot Instant research for a symbol (news + price). No approval needed. |
| `pumpai_clawd_list_approvals` | List pending and recent CLAWD approval requests. |
| `pumpai_clawd_portfolio_summary` | Unified view across Robinhood, Solana, Wallet MCP, and Coinbase. |
| `pumpai_clawd_wallet_get_portfolio` | Proxy to Wallet MCP get_portfolio. |
| `pumpai_coinbase_products_best_bid_ask` | Best bid/ask for up to 10 Coinbase products (via per-product ticker). |
| `pumpai_coinbase_products_book` | Order book depth for one Coinbase product (public API currently 404s this route unauthenticated). |
| `pumpai_coinbase_products_candles` | OHLCV candles for one Coinbase product. |
| `pumpai_coinbase_products_get` | Read one Coinbase Advanced Trade product. |
| `pumpai_coinbase_products_list` | List Coinbase Advanced Trade products with live price, 24h change and volume. |
| `pumpai_coinbase_products_ticker` | Latest trade and best bid/ask for one Coinbase product. |
| `pumpai_get_asset` | Helius DAS: one digital asset by id (metadata, ownership, royalty, compression). Read-only. |
| `pumpai_get_asset_batch` | Helius DAS: multiple digital assets by id. Read-only. |
| `pumpai_get_asset_proof` | Helius DAS: Merkle proof for a compressed asset. Read-only. |
| `pumpai_get_asset_proof_batch` | Helius DAS: Merkle proofs for multiple compressed assets. Read-only. |
| `pumpai_get_assets_by_authority` | Helius DAS: assets by authority address. Read-only. |
| `pumpai_get_assets_by_creator` | Helius DAS: assets by creator address. Read-only. |
| `pumpai_get_assets_by_group` | Helius DAS: assets by group (e.g. a collection). Read-only. |
| `pumpai_get_base_quote_chart` | Birdeye: base/quote pair OHLCV candles. Read-only. |
| `pumpai_get_base_quote_live_price` | Birdeye: latest base/quote pair price. One-shot snapshot of the live feed (latest 1-minute candle), not a stre |
| `pumpai_get_birdeye_security` | Birdeye: token security analysis for a mint (authorities, holder risks, flags). Read-only. |
| `pumpai_get_creation_info` | Birdeye: token creation info for a mint (creator, creation transaction and time). Read-only. |
| `pumpai_get_creator_reputation` | Observed launch reputation for one creator wallet: launch counts plus its recent Jev decisions |
| `pumpai_get_dflow_priority_fees` | DFlow: current priority fee levels for DFlow trades. Read-only. |
| `pumpai_get_exit_liquidity` | Birdeye: exit/tradeable liquidity estimate for a token. Read-only. |
| `pumpai_get_gainers_losers` | Birdeye: trader gainers/losers board. Read-only. |
| `pumpai_get_health` | Feed health and status |
| `pumpai_get_history_price` | Birdeye: historical price line series for a token. Read-only. |
| `pumpai_get_imperial_builder_summary` | Imperial: builder/referral summary for a builder code. Read-only. |
| `pumpai_get_imperial_deposit_history` | Imperial: deposit/withdrawal history for a wallet. Read-only; wallet is a required parameter. |
| `pumpai_get_imperial_flash_markets` | Imperial: Flash markets list. Read-only. (Route not present in Imperial's current public OpenAPI; upstream err |
| `pumpai_get_imperial_funding_history` | Imperial: funding payment history for a wallet. Read-only; wallet is a required parameter. |
| `pumpai_get_imperial_funding_rates` | Imperial: current funding rates across markets. Read-only. |
| `pumpai_get_imperial_gmtrade_funding_rates` | Imperial: GMTrade venue funding rates. Read-only. (Route not present in Imperial's current public OpenAPI; ups |
| `pumpai_get_imperial_gmtrade_liquidity` | Imperial: GMTrade venue liquidity. Read-only. (Route not present in Imperial's current public OpenAPI; upstrea |
| `pumpai_get_imperial_gmtrade_markets` | Imperial: GMTrade venue markets. Read-only. (Route not present in Imperial's current public OpenAPI; upstream  |
| `pumpai_get_imperial_jupiter_pool_info` | Imperial: Jupiter pool information used by the router. Read-only. |
| `pumpai_get_imperial_mark_prices` | Imperial: current mark prices across markets. Read-only. |
| `pumpai_get_imperial_order_history` | Imperial: order history for a wallet. Read-only; wallet is a required parameter. |
| `pumpai_get_imperial_order_history_detail` | Imperial: one historical order by its order PDA. Read-only. |
| `pumpai_get_imperial_orders` | Imperial: open orders for a wallet. Read-only; wallet is a required parameter. |
| `pumpai_get_imperial_passthrough_orders` | Imperial: passthrough (Phoenix-routed) orders for a wallet. Read-only; wallet is a required parameter. |
| `pumpai_get_imperial_phoenix_depth` | Imperial: Phoenix order-book depth aggregated by the router. Read-only. |
| `pumpai_get_imperial_phoenix_direct_positions` | Imperial: direct Phoenix positions for a wallet. Read-only; wallet is a required parameter. |
| `pumpai_get_imperial_phoenix_mark_prices` | Imperial: Phoenix mark prices via the router. Read-only. |
| `pumpai_get_imperial_phoenix_markets` | Imperial: Phoenix markets listed by the router. Read-only. |
| `pumpai_get_imperial_pnl_history` | Imperial: profit-and-loss history series for a wallet. Read-only; wallet is a required parameter. |
| `pumpai_get_imperial_positions` | Imperial: open positions for a wallet, with lifetime collateral/PnL summary. Read-only; wallet is a required p |
| `pumpai_get_imperial_route` | Imperial: route quote for a trade (venue selection for an asset/side/notional). Read-only quote; does not plac |
| `pumpai_get_imperial_stats_markets` | Imperial: per-market statistics. Read-only. |
| `pumpai_get_imperial_stats_open_interest` | Imperial: open interest statistics. Read-only. |
| `pumpai_get_imperial_stats_open_interest_history` | Imperial: open interest history. Read-only. |
| `pumpai_get_imperial_stats_summary` | Imperial: platform-wide statistics summary. Read-only. |
| `pumpai_get_imperial_stats_volume` | Imperial: traded volume statistics. Read-only. |
| `pumpai_get_imperial_status` | Imperial: router service status. Read-only. |
| `pumpai_get_imperial_touch_deals` | Imperial: Touch (binary) deals/markets. Read-only. (Route not present in Imperial's current public OpenAPI; up |
| `pumpai_get_imperial_touch_markets` | Imperial: Touch (binary options) markets. Read-only. (Route not present in Imperial's current public OpenAPI;  |
| `pumpai_get_imperial_touch_positions` | Imperial: Touch positions for a wallet. Read-only; wallet is a required parameter. |
| `pumpai_get_imperial_trades` | Imperial: trade history for a wallet. Read-only; wallet is a required parameter. |
| `pumpai_get_launch_decision` | The latest Jev decide-agent decision for one launch mint, or null when the agent has not judged it yet. |
| `pumpai_get_launch_decisions` | Latest Jev decide-agent verdicts on launches, newest first: verdict (promising/watch/avoid), creator risk, ser |
| `pumpai_get_live_price` | Birdeye: latest price for a token. One-shot snapshot of the live price feed, not a streaming subscription. Rea |
| `pumpai_get_live_txs` | Birdeye: latest swap transactions for a token. One-shot snapshot of the live transaction tape (most recent pag |
| `pumpai_get_meme_list` | Birdeye: meme token list with market filters. Read-only. |
| `pumpai_get_meme_listings` | Birdeye: newly listed meme tokens. Read-only. |
| `pumpai_get_mint_burn_txs` | Helius: recent mint and burn transactions for a token mint (TOKEN_MINT and BURN enhanced transactions, merged  |
| `pumpai_get_multi_price` | Jupiter Price V3: USD prices for up to 50 mints in one call. Read-only. |
| `pumpai_get_net_worth_chart` | Birdeye: a wallet's net-worth history chart. Read-only. |
| `pumpai_get_new_listings` | Birdeye: newly listed tokens. Read-only. |
| `pumpai_get_nft_editions` | Helius DAS: print editions of a master-edition NFT mint. Read-only. |
| `pumpai_get_pair_chart` | Birdeye: pair/market OHLCV candles by pair address. Read-only. |
| `pumpai_get_pair_trades` | Birdeye: recent trades on a pair/market. Read-only. |
| `pumpai_get_phoenix_candles` | Phoenix Eternal: OHLC candles for a market (includes mark OHLC). Read-only. |
| `pumpai_get_phoenix_exchange_snapshot` | Phoenix Eternal: full exchange snapshot (global keys/authorities and all markets). Large payload. Read-only. |
| `pumpai_get_phoenix_exchange_status` | Phoenix Eternal: exchange status (slot, state freshness). Read-only. |
| `pumpai_get_phoenix_funding_overview` | Phoenix Eternal: funding configuration and cumulative funding per market (intervals, caps, cumulative rate). R |
| `pumpai_get_phoenix_funding_rates` | Phoenix Eternal: current cumulative funding rate per market, from the exchange stats snapshots. Read-only. |
| `pumpai_get_phoenix_mark_price` | Phoenix Eternal: latest mark price for a market, from the most recent 1-minute candle's mark close. Read-only. |
| `pumpai_get_phoenix_market` | Phoenix Eternal: one market's full parameters (leverage tiers, risk factors, funding, stats). Read-only. |
| `pumpai_get_phoenix_market_calendar` | Phoenix Eternal: market calendar — scheduled earnings dates per listed market, from exchange metadata. Read-on |
| `pumpai_get_phoenix_market_fills` | Phoenix Eternal: recent fills for a market. Read-only. (If the REST fills route is unavailable upstream, this  |
| `pumpai_get_phoenix_market_stats` | Phoenix Eternal: one market's live stats snapshot (open interest, funding start, slot). Read-only. |
| `pumpai_get_phoenix_my_trader_state` | Phoenix Eternal: trader state for a trader account address (same on-chain read as get_phoenix_trader, SOL GPT  |
| `pumpai_get_phoenix_orderbook` | Phoenix Eternal: order book for a market. Read-only. (The perp API's book is primarily stream-served; if the R |
| `pumpai_get_phoenix_rpc_context` | Solana RPC context bundle used by the Phoenix desk: current slot, block height, and (if a wallet is given) its |
| `pumpai_get_phoenix_trader` | Phoenix Eternal: trader account state read — the Phoenix trader account's on-chain account (existence, owner p |
| `pumpai_get_prediction_market` | DFlow/Kalshi prediction market by ticker (located by scanning the markets list). Read-only. |
| `pumpai_get_prediction_orderbook` | DFlow/Kalshi prediction market orderbook by ticker. Read-only. |
| `pumpai_get_price_volume` | Birdeye: price and volume summary for a token over a window. Read-only. |
| `pumpai_get_quote` | DFlow: spot swap quote for a token pair (expected out amount, price impact, fees). Quote only — does not build |
| `pumpai_get_recent_launches` | Recent Solana launch signals, newest first, each with a speech field for TTS and a decision field when the Jev |
| `pumpai_get_research_feed` | Curated research fed into PumpAI: articles and repos on Solana programs, CPI patterns and protocol mechanics,  |
| `pumpai_get_signatures_for_asset` | Helius DAS: transaction signatures involving an asset. Read-only. |
| `pumpai_get_smart_money` | Birdeye: smart-money wallets list (tracked profitable traders). Read-only. |
| `pumpai_get_token_accounts_das` | Helius DAS: token accounts by owner (DAS form), optionally filtered to one mint. Read-only. |
| `pumpai_get_token_fees` | Birdeye: fee data for a token (transfer/pool fees where available). Read-only. |
| `pumpai_get_token_liquidity_ohlc` | Birdeye: liquidity OHLC series for a token. Read-only. |
| `pumpai_get_token_market_data` | Birdeye: market data for a token (price, market cap, FDV, liquidity, volume windows). Read-only. |
| `pumpai_get_token_markets` | Birdeye: DEX markets/pools trading a token. Read-only. |
| `pumpai_get_token_overview` | Birdeye: token overview (price, market cap, volume, holders, socials). Read-only. |
| `pumpai_get_token_trade_data` | Birdeye: buy/sell trade statistics for a token across windows. Read-only. |
| `pumpai_get_token_trades` | Birdeye: recent transactions for a token. Read-only. |
| `pumpai_get_wallet_balance_at` | Helius Wallet API: a wallet's historical balance at a Unix timestamp. Read-only. |
| `pumpai_get_wallet_funded_by` | Helius Wallet API: the wallet or exchange that first funded an address. Read-only. |
| `pumpai_get_wallet_history` | Helius Wallet API: parsed transaction history for a wallet. Read-only. |
| `pumpai_get_wallet_identity` | Helius Wallet API: identity labels, domains and known-entity info for a wallet. Read-only. |
| `pumpai_get_wallet_transfers` | Helius Wallet API: transfer history for a wallet. Read-only. |
| `pumpai_imperial_funding_rates` | Funding (and borrow) rates per hour % by symbol/venue. Positive = longs pay shorts. |
| `pumpai_imperial_health` | Imperial API health + indexer/order-bot status. Read-only. |
| `pumpai_imperial_mark_prices` | Mark prices per symbol per venue. Optional symbol filter. |
| `pumpai_imperial_markets` | Armada markets: leverage, mark/index/last, 24h change & volume, open interest. Optional symbol filter. |
| `pumpai_imperial_orders` | A wallet's open/resting orders. Read-only. |
| `pumpai_imperial_phoenix_markets` | Phoenix-venue market list. Optional symbol filter. |
| `pumpai_imperial_positions` | A wallet's open positions across venues. Read-only public lookup by pubkey. |
| `pumpai_list_dflow_tokens` | DFlow: tokens tradeable through DFlow. Read-only. (Metadata host route is docs-based; upstream errors surface  |
| `pumpai_list_phoenix_markets` | Phoenix Eternal: all listed markets with status and key parameters (projection of the exchange snapshot). Read |
| `pumpai_list_tokens` | Birdeye: filterable DEX token list, sortable by volume, liquidity and market cap. Read-only. |
| `pumpai_open_launch_dashboard` | Open the PumpAI launch dashboard: latest launches, feed health (Solana and Robinhood Chain listener shown sepa |
| `pumpai_perps_eligibility` | Paste a token mint: detect pump.fun curve / PumpSwap / Raydium LaunchLab (Stonk.fun) pool, liquidity, perps el |
| `pumpai_perps_list_markets` | List CLAWD Percolator perps markets (pool-oracle and admin-oracle) with price, open interest and insurance. Re |
| `pumpai_perps_oracle_price` | Index price of a CLAWD Percolator market: trustless pool EMA, or admin-pushed price (flagged). |
| `pumpai_perps_quote` | Quote a position on a CLAWD Percolator market: notional, initial/maintenance margin, fee, leverage cap. |
| `pumpai_perps_read_market` | Decode one CLAWD Percolator market (slab): config, pool-oracle state, engine totals, accounts. |
| `pumpai_render_launch_feed` | Show recent launches in the PumpAI launch dashboard (MCP App UI). Returns the same launch data as text/structu |
| `pumpai_rh_block_number` | Latest Robinhood Chain block number. |
| `pumpai_rh_chain_id` | Robinhood Chain chain ID (4663). |
| `pumpai_rh_get_balance` | Native ETH balance of an address on Robinhood Chain. |
| `pumpai_rh_get_block` | Robinhood Chain block summary by tag or number. |
| `pumpai_scanner_daily_picks` | Today's AI-ranked buy-worthy pump.fun launches (Neon AI Gateway / TypeSafe Jev decisions over enriched on-chai |
| `pumpai_search_assets` | Helius DAS: search assets with owner/creator/burnt/compressed filters. Read-only. |
| `pumpai_search_market_data` | Birdeye: search tokens and markets by keyword. Read-only. |
| `pumpai_search_prediction_markets` | DFlow/Kalshi prediction markets list/search (status filter, text search, cursor paging). Read-only. |
| `pumpai_st_das_get_asset` | DAS getAsset (SOL GPT st_das_* name; routed to the shared Helius DAS upstream, not Solana Tracker's DAS RPC).  |
| `pumpai_st_das_get_asset_proof` | DAS getAssetProof (SOL GPT st_das_* name; routed to the shared Helius DAS upstream). Read-only. |
| `pumpai_st_das_get_assets_by_authority` | DAS getAssetsByAuthority (SOL GPT st_das_* name; routed to the shared Helius DAS upstream). Read-only. |
| `pumpai_st_das_get_assets_by_creator` | DAS getAssetsByCreator (SOL GPT st_das_* name; routed to the shared Helius DAS upstream). Read-only. |
| `pumpai_st_das_get_assets_by_group` | DAS getAssetsByGroup (SOL GPT st_das_* name; routed to the shared Helius DAS upstream). Read-only. |
| `pumpai_st_das_get_assets_by_owner` | DAS getAssetsByOwner (SOL GPT st_das_* name; routed to the shared Helius DAS upstream). Read-only. |
| `pumpai_st_das_get_nft_editions` | DAS getNFTEditions (SOL GPT st_das_* name; routed to the shared Helius DAS upstream). Read-only. |
| `pumpai_st_das_get_signatures_for_asset` | DAS getSignaturesForAsset (SOL GPT st_das_* name; routed to the shared Helius DAS upstream). Read-only. |
| `pumpai_st_das_get_token_accounts` | DAS getTokenAccounts (SOL GPT st_das_* name; routed to the shared Helius DAS upstream). Read-only. |
| `pumpai_st_das_search_assets` | DAS searchAssets (SOL GPT st_das_* name; routed to the shared Helius DAS upstream). Read-only. |
| `pumpai_st_get_chart` | Solana Tracker: OHLCV chart series for a mint. Read-only. |
| `pumpai_st_get_first_buyers` | Solana Tracker: first buyers of a mint and whether they still hold. Read-only. |
| `pumpai_st_get_graduated_tokens` | Solana Tracker: tokens that recently graduated from pump.fun to Raydium. Read-only. |
| `pumpai_st_get_graduating_tokens` | Solana Tracker: pump.fun tokens currently close to graduating to Raydium. Read-only. |
| `pumpai_st_get_latest_tokens` | Solana Tracker: most recently created tokens. Read-only. |
| `pumpai_st_get_multi_tokens` | Solana Tracker: full token profiles for multiple mints in one call. Read-only. |
| `pumpai_st_get_multiple_prices` | Solana Tracker: current prices for multiple tokens in one call. Read-only. |
| `pumpai_st_get_price` | Solana Tracker: current price for one token. Read-only. |
| `pumpai_st_get_price_history` | Solana Tracker: historical price series for a token. Read-only. |
| `pumpai_st_get_token` | Solana Tracker: full token profile for a mint (metadata, price, market cap, liquidity, pools, risk). Read-only |
| `pumpai_st_get_token_bundlers` | Solana Tracker: bundler analysis for a mint's launch (bundled wallets and their supply share). Read-only. |
| `pumpai_st_get_token_events` | Solana Tracker: notable on-chain events recorded for a mint. Read-only. |
| `pumpai_st_get_token_holders` | Solana Tracker: paginated holder list for a mint with balances and share of supply. Read-only. |
| `pumpai_st_get_token_stats` | Solana Tracker: interval statistics for a mint (buys/sells, volume, price change across windows). Read-only. |
| `pumpai_st_get_token_top_holders` | Solana Tracker: top holders for a mint, largest first. Read-only. |
| `pumpai_st_get_token_top_traders` | Solana Tracker: top traders for a mint ranked by realized profit. Read-only. |
| `pumpai_st_get_token_trades` | Solana Tracker: recent trades for a mint (side, size, price, wallet, pool). Read-only. |
| `pumpai_st_get_tokens_by_deployer` | Solana Tracker: tokens deployed by a wallet. Read-only. |
| `pumpai_st_get_tokens_by_volume` | Solana Tracker: tokens ranked by traded volume. Read-only. |
| `pumpai_st_get_top_performers` | Solana Tracker: top-performing tokens by price appreciation. Read-only. |
| `pumpai_st_get_top_traders` | Solana Tracker: top Solana traders ranked by profit over a timeframe. Read-only. |
| `pumpai_st_get_trending_tokens` | Solana Tracker: trending tokens by recent activity. Read-only. |
| `pumpai_st_get_wallet` | Solana Tracker: wallet portfolio — token balances with values and total net worth. Read-only. |
| `pumpai_st_get_wallet_basic` | Solana Tracker: lightweight wallet summary (net worth and token count). Read-only. |
| `pumpai_st_get_wallet_chart` | Solana Tracker: a wallet's portfolio value chart over time. Read-only. |
| `pumpai_st_get_wallet_page` | Solana Tracker: one page of a wallet's token portfolio. Read-only. |
| `pumpai_st_get_wallet_pnl` | Solana Tracker: a wallet's overall profit and loss summary. Read-only. |
| `pumpai_st_get_wallet_token_pnl` | Solana Tracker: a wallet's profit and loss on one token. Read-only. |
| `pumpai_st_get_wallet_trades` | Solana Tracker: a wallet's trade history. Read-only. |
| `pumpai_st_rpc_get_block` | Solana RPC getBlock: confirmed block at a slot. Read-only. |
| `pumpai_st_rpc_get_block_height` | Solana RPC getBlockHeight: current block height. Read-only. |
| `pumpai_st_rpc_get_block_production` | Solana RPC getBlockProduction: block production info, optionally for one validator identity or slot range. Rea |
| `pumpai_st_rpc_get_blocks` | Solana RPC getBlocks: confirmed blocks between two slots. Read-only. |
| `pumpai_st_rpc_get_fee_for_message` | Solana RPC getFeeForMessage: fee for a base64-encoded message. Read-only. |
| `pumpai_st_rpc_get_multiple_accounts` | Solana RPC getMultipleAccounts: account infos for multiple addresses. Read-only. |
| `pumpai_st_rpc_get_program_accounts` | Solana RPC getProgramAccounts: accounts owned by a program (basic form — encoding selectable, no filters). Rea |
| `pumpai_st_rpc_get_signature_statuses` | Solana RPC getSignatureStatuses: confirmation statuses for transaction signatures. Read-only. |
| `pumpai_st_rpc_get_signatures_for_address` | Solana RPC getSignaturesForAddress: confirmed signatures for an address, newest first. Read-only. |
| `pumpai_st_rpc_get_token_account_balance` | Solana RPC getTokenAccountBalance: balance of an SPL token account. Read-only. |
| `pumpai_st_rpc_get_token_accounts_by_delegate` | Solana RPC getTokenAccountsByOwner (delegate form): token accounts by delegate, filtered by exactly one of min |
| `pumpai_st_rpc_get_token_accounts_by_owner` | Solana RPC getTokenAccountsByOwner: token accounts by owner, filtered by exactly one of mint or program. Read- |
| `pumpai_st_rpc_get_token_largest_accounts` | Solana RPC getTokenLargestAccounts: largest token accounts for a mint. Read-only. |
| `pumpai_st_rpc_get_token_supply` | Solana RPC getTokenSupply: total supply of a mint. Read-only. |
| `pumpai_st_rpc_get_transaction` | Solana RPC getTransaction: a confirmed transaction by signature. Read-only. |
| `pumpai_st_rpc_get_transaction_count` | Solana RPC getTransactionCount: total confirmed transaction count. Read-only. |
| `pumpai_st_rpc_simulate_transaction` | Solana RPC simulateTransaction: dry-run a base64-encoded signed/unsigned transaction. Never broadcasts. Read-o |
| `pumpai_st_search_tokens` | Solana Tracker: search tokens by name/symbol with optional liquidity, market-cap, volume and holder filters. R |
| `pumpai_stream_wallet_activity` | Helius Wallet API: recent wallet activity composite (history + transfers merged into one read). One-shot snaps |

### Free tools ($0)

| Tool | What it does |
| --- | --- |
| `portal_identity` | The portal operator's public AgentID identity card (Clawd, $CLAWD). |
| `portal_list_servers` | List the MCP servers mirrored by the Clawd Compute portal, with live tool counts and auth status. |
| `pumpai_clawd_composio_execute_instant` | Execute an Instant tool after CLAWD approval. Charges org balance. |
| `pumpai_clawd_phoenix_prepare_order` | Build unsigned Phoenix market/limit order. |
| `pumpai_clawd_rh_place_equity` | Place an equity order after CLAWD approval. |
| `pumpai_clawd_rh_preview_crypto` | Preview a crypto order on Robinhood. |
| `pumpai_clawd_rh_preview_equity` | Preview an equity order on Robinhood. Creates CLAWD approval. |
| `pumpai_clawd_solana_execute` | Execute approved Solana action. Signs with OWS. |
| `pumpai_clawd_solana_preview` | Preview Pump.fun, Raydium, Phoenix, or Backpack action. |
| `pumpai_imperial_build_deposit_tx` | BLOCKED unless allowlisted. Returns unsigned txs only when enabled; never signs or submits. |
| `pumpai_imperial_cancel_order` | BLOCKED unless allowlisted. This host never signs. |
| `pumpai_imperial_place_order` | BLOCKED unless IMPERIAL_TRADING_ENABLED=true and tool is in IMPERIAL_TRADING_ALLOWLIST. This host never signs. |
| `pumpai_imperial_update_order` | BLOCKED unless allowlisted. This host never signs. |
| `pumpai_perps_close_position` | Close the whole position. Devnet only; confirmation-gated. |
| `pumpai_perps_create_market` | Create a permissionless perps market on a pump.fun / PumpSwap / LaunchLab token (atomic slab + vault + InitMar |
| `pumpai_perps_deposit` | Deposit collateral into a CLAWD Percolator market (init=true opens the account first). Devnet only; confirmati |
| `pumpai_perps_open_position` | Open/increase a position against an LP (refreshes the pool oracle first). Devnet only; confirmation-gated. |
| `pumpai_perps_withdraw` | Withdraw collateral (margin-checked on-chain). Devnet only; confirmation-gated. |

## 2. Clawd Domains — domains.musebook.trade (live)

NOTE: `domains.clawdcompute.us` has no DNS record and does not resolve (checked 2026-11-21, browser + shell). The live domains service is the Domain Agent API at **domains.musebook.trade** (OpenAPI `/openapi.json`, discovery `/.well-known/x402`, guide `/llms.txt`). The older `~/workspace/clawd-domains` codebase (Porkbun `/check` + `/quote` shape) is NOT the live deployment.

Domain registration for agents, paid in USDC on Solana via x402 v2 (`exact` scheme, facilitator https://facilitator.payai.network, payTo `5rxgJXoN2xvoZHcLXav1pEHAhvygLziZsz3xAzNEJfgr` — the same Solana payTo as the gateway). No accounts or API keys; the paying wallet becomes the owner. WHOIS privacy included; premium names are not sold.

| Endpoint | Price | What it does |
| --- | --- | --- |
| `GET /domains/check?name=<domain>` | free | Availability + exact USDC price |
| `POST /domains/register` `{"name": "..."}` | quoted price | x402-gated; registers the domain, owner = payer wallet |
| `POST /domains/{domain}/renew` | quoted price | x402-gated renewal |
| `GET /domains?owner=<solana pubkey>` | free | Domains owned by a wallet |
| `GET /domains/{domain}/dns` | free (owner-signed) | List DNS records |
| `POST /domains/{domain}/dns` | free (owner-signed) | Create a DNS record |
| `DELETE /domains/{domain}/dns?id=<id>` | free (owner-signed) | Delete a DNS record |

Pricing: **registrar price × 1.15 + $1 flat**, in USDC; the same formula for renewals, and the 402 amount always equals the quote. First-year examples from the live page: .com $12.15, .dev $14.15, .xyz $15.15, .io $43.65, .ai $104.60, .site $5.65. DNS writes are authorized by owner-wallet ed25519 signatures (X-Wallet / X-Signature / X-Nonce / X-Expires headers), not by payment.

## 3. Musebook x402 facilitator + registry — musebook.trade

- Facilitator `musebook` — wellKnown https://musebook.trade/.well-known/x402-facilitator; networks: solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp, solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1, eip155:8453, eip155:84532; extensions: x402m-batch-v0, x402m-receipts-v0, x402m-referral-v0
- `GET /api/x402/catalog` + `GET /api/x402/providers` — the public registry/catalog (worker-native, live since 2026-11-20). Registry writes are admin-gated.
- The facilitator verifies and settles the Solana leg for the gateway above and for Clawd Domains (`POST /api/x402/verify`, `POST /api/x402/settle`).

## Review layer

402reviews (set up 2026-11-21, account cheshireterminal@gmail.com, auto-review ON): before paying for any third-party x402/MPP API, check it with `~/workspace/custom-connectors/custom.402reviews/bin/reviews.py check`; after a paid call, reviews post automatically (public, no user data). Say "stop reviewing" to turn it off.
