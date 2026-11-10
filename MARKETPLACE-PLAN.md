# Marketplace go-live plan — Musebook Claude plugin marketplace

Status of this document: plan only. The marketplace tree at
`~/workspace/clawd-plugin-marketplace/` is **scaffolded locally and NOT
pushed**. Nothing here is live until the steps below are done and verified.

## What exists locally

- `.claude-plugin/marketplace.json` — marketplace name `musebook`, owner
  Musebook / Clawd, 6 plugins.
- `plugins/` — `musebook-directory`, `musebook-launches`, `musebook-markets`,
  `musebook-paper`, `musebook-chess`, `musebook-x402`. Each has
  `.claude-plugin/plugin.json` (v0.1.0), `.mcp.json` →
  `https://musebook.trade/mcp` (public, no auth), `README.md`, and
  `skills/<name>/SKILL.md`.
- `README.md`, `validate.py` (stdlib-only validator), this plan.
- Tool split verified against the 107-tool public snapshot
  (`~/workspace/musebook-provider/mcp-tools.json`, checked 2026-11-09):
  13 + 27 + 47 + 3 + 7 + 10 = 107, each tool in exactly one plugin.

Prior art this builds on (not duplicated): the fixed single-plugin package in
`~/workspace/plugin-fix/` (public read-only edition, plugin.json v1.0.1,
`mcp.json` → `https://musebook.trade/mcp`), the live pages
https://musebook.trade/plugin and https://musebook.trade/connector, and the
Swarms Marketplace listings. This repo is the Claude-Code-style multi-plugin
marketplace form of the same surface.

## Go-live steps

1. **Owner creates the GitHub repo (owner step — the agent cannot).**
   Create an empty **public** repo `Solizardking/clawd-plugin-marketplace`
   on github.com (no README/.gitignore/license pre-added, so the first push
   is clean). Public because end users must be able to
   `/plugin marketplace add` it without credentials.
2. **Final local check.** Run `python3 validate.py` in the local tree; it
   must print PASS. Re-run the tool-split check against a fresh
   `tools/list` from `https://musebook.trade/mcp` if the snapshot is stale,
   and update per-plugin READMEs/counts if tools moved.
3. **Init + first push via SSH (standing rules).**
   - `git init`, commit the tree (exclude nothing — no secrets exist in this
     repo; still run a secret scan before committing, per house rules).
   - Push with the proven SSH form:
     `GIT_SSH_COMMAND="ssh -i $HOME/.ssh/id_ed25519 -o IdentitiesOnly=yes -o BatchMode=yes" git push git@github.com:Solizardking/clawd-plugin-marketplace.git main`
     (Do NOT use `~/workspace/git-ssh-mb.sh` — its key is missing. The legacy
     GitHub connector credential is dead (401); SSH is the working path.)
   - **Verify the push landed**: `git ls-remote` must show the commit sha on
     `refs/heads/main`. A push command's success output alone is not proof.
4. **Install smoke test.** From a clean Claude Code profile:
   `/plugin marketplace add Solizardking/clawd-plugin-marketplace`, install
   each plugin, confirm the `musebook` MCP server connects to
   `https://musebook.trade/mcp` and one read per plugin returns data
   (e.g. `directory_stats`, `live_launches`, `backpack_ticker` SOL_USDC,
   `paper_leaderboard`, `chess_daily_puzzle`, `x402_supported`). Record the
   results; empty results are valid, invented data is not.
5. **Listing / submission notes.**
   - A git-hosted Claude plugin marketplace needs no central submission —
     adding the repo URL *is* the distribution channel. If Anthropic opens a
     public plugin directory/marketplace submission flow, submit this repo
     URL plus the owner identity (Musebook / Clawd, https://musebook.trade).
   - Cross-link from the existing surfaces once live: musebook.trade/plugin
     and /connector pages, and the Swarms Marketplace listing, should point
     at the repo. Page edits are a separate, coordinated site change — do not
     bundle them into the repo push.
   - Keep the honesty copy intact in listings: public read-only edition,
     nothing signs/broadcasts, the `/mcp-auth` connector is the documented
     upgrade path (262 tools, SIWS OAuth), SolGPT execution caveat included.
6. **Announce only after verification.** Any public post follows the standing
   social rules (exact copy + art approved by the owner first; one $CLAWD
   cashtag, footer only).

## Versioning policy

- Marketplace metadata version and each plugin version start at `0.1.0` and
  follow semver independently per plugin; the marketplace version bumps when
  the plugin set changes.
- Tool-surface changes (tools added/removed/moved between plugins) = minor
  bump for the affected plugin(s) + README/catalog count updates in the same
  commit, re-verified against a fresh `tools/list` snapshot.
- Breaking changes (plugin renamed/removed, endpoint change) = major bump
  and a note in this plan's changelog section.
- Every release commit is pushed via SSH and verified with `ls-remote`
  before being announced; tags (`vX.Y.Z`) are optional and only cut on the
  owner's go.

## Blockers / owner steps

- [ ] Owner creates empty public repo `Solizardking/clawd-plugin-marketplace`.
- [ ] Owner go-ahead for the first push (repo creation alone is not a push order).
- [ ] (Later, separate) Site cross-links on musebook.trade/plugin + /connector.
