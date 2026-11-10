# Changelog

## 0.6.0

- Added valid `name` and `description` frontmatter to eight `clawd-pump-agent-skills` skills that were missing it: `straight-talk`, `laso-finance`, `risk-manager`, `alpha-scanner`, `dca-strategy`, `survivor-check`, `meme-analyzer`, and `whale-tracker`. Descriptions are derived from each file's own content.
- Renamed the `handoff` skill frontmatter `name` from `agent-orchestration-handoff` to `handoff` to match its folder. No name collision.
- Added a required **Owner approval** section to live-execution skills: `imperial`, `imperial-execution-modes`, `imperial-trade-execution`, `imperial-position-management`, `pumpfun-trading`, `pumpfun-launcher`, `vulcan-execution-modes`, `copy-trade`, `dca-bot`, `dca-strategy` (only one copy is in the package), `rh-launchpad-v3`, `dflow-spot-trading`, and `dflow-kalshi-trading`. Minimally edited sentences that contradicted per-transaction owner approval; other owner text was left intact.
- Documented the approval policy and known missing references in the README.
