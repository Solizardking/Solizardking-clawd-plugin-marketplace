#!/usr/bin/env python3
"""Validate the Clawd Claude plugin marketplace (stdlib only).

Checks:
  1. Every *.json file in the repo parses as JSON.
  2. .claude-plugin/marketplace.json exists, is named, and lists plugins.
  3. Each marketplace plugin entry: source dir exists, its
     .claude-plugin/plugin.json parses and its "name" matches the
     marketplace entry name, version/description/author are present.
  4. Each plugin has a .mcp.json that parses and declares mcpServers
     entries with https URLs. Plugins named musebook-* must include the
     public endpoint https://musebook.trade/mcp. Other plugins keep their
     own declared servers.
  5. Each plugin has a README.md and at least one skills/*/SKILL.md.
  6. No plugin directory exists that is not listed in the marketplace,
     and no duplicate plugin names.

Exit code 0 = all checks passed; 1 = failures (printed).
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PUBLIC_MCP_URL = "https://musebook.trade/mcp"
failures = []
notes = []


def fail(msg):
    failures.append(msg)


def load_json(path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:  # noqa: BLE001 - report any parse failure
        fail(f"{path.relative_to(ROOT)}: invalid JSON: {e}")
        return None


def main():
    # 1. Parse every JSON file in the repo.
    json_files = sorted(p for p in ROOT.rglob("*.json") if ".git" not in p.parts)
    for p in json_files:
        load_json(p)
    notes.append(f"parsed {len(json_files)} JSON files")

    # 2. Marketplace manifest.
    mpath = ROOT / ".claude-plugin" / "marketplace.json"
    if not mpath.exists():
        fail(".claude-plugin/marketplace.json: missing")
        return report()
    market = load_json(mpath)
    if market is None:
        return report()
    if not market.get("name"):
        fail("marketplace.json: missing 'name'")
    plugins = market.get("plugins")
    if not isinstance(plugins, list) or not plugins:
        fail("marketplace.json: 'plugins' must be a non-empty list")
        return report()

    names = [e.get("name") for e in plugins]
    if len(names) != len(set(names)):
        fail(f"marketplace.json: duplicate plugin names: {names}")

    plugin_root = ROOT / "plugins"
    listed_dirs = set()

    # 3-5. Per-plugin checks.
    for entry in plugins:
        name = entry.get("name")
        if not name:
            fail("marketplace.json: plugin entry missing 'name'")
            continue
        source = entry.get("source", "")
        pdir = (ROOT / source).resolve() if source else plugin_root / name
        listed_dirs.add(pdir.name)
        if not pdir.is_dir():
            fail(f"{name}: source dir {source!r} does not exist")
            continue

        pj_path = pdir / ".claude-plugin" / "plugin.json"
        if not pj_path.exists():
            fail(f"{name}: .claude-plugin/plugin.json missing")
            continue
        pj = load_json(pj_path)
        if pj is not None:
            if pj.get("name") != name:
                fail(f"{name}: plugin.json name {pj.get('name')!r} != marketplace name {name!r}")
            for field in ("version", "description", "author"):
                if not pj.get(field):
                    fail(f"{name}: plugin.json missing {field!r}")
            if entry.get("version") and pj.get("version") != entry["version"]:
                fail(f"{name}: version mismatch marketplace={entry['version']} plugin={pj.get('version')}")

        mcp_path = pdir / ".mcp.json"
        if not mcp_path.exists():
            fail(f"{name}: .mcp.json missing")
        else:
            mcp = load_json(mcp_path)
            if mcp is not None:
                servers = mcp.get("mcpServers")
                if not isinstance(servers, dict) or not servers:
                    fail(f"{name}: .mcp.json has no mcpServers entries")
                else:
                    urls = [s.get("url") for s in servers.values() if isinstance(s, dict)]
                    if not urls or any(not isinstance(u, str) or not u.startswith("https://") for u in urls):
                        fail(f"{name}: .mcp.json servers need https URLs, got {urls}")
                    if name.startswith("musebook-") and PUBLIC_MCP_URL not in urls:
                        fail(f"{name}: .mcp.json must point at {PUBLIC_MCP_URL}, got {urls}")

        if not (pdir / "README.md").exists():
            fail(f"{name}: README.md missing")
        skills = list((pdir / "skills").glob("*/SKILL.md")) if (pdir / "skills").is_dir() else []
        if not skills:
            fail(f"{name}: no skills/*/SKILL.md found")

    # 6. No unlisted plugin dirs.
    if plugin_root.is_dir():
        on_disk = {d.name for d in plugin_root.iterdir() if d.is_dir()}
        extra = on_disk - listed_dirs
        if extra:
            fail(f"plugins/ contains dirs not listed in marketplace.json: {sorted(extra)}")

    notes.append(f"marketplace {market.get('name')!r}: {len(plugins)} plugins checked: {', '.join(names)}")
    return report()


def report():
    for n in notes:
        print(f"ok: {n}")
    if failures:
        print(f"\nFAIL ({len(failures)} problem(s)):")
        for f in failures:
            print(f"  - {f}")
        return 1
    print("\nPASS: marketplace is valid")
    return 0


if __name__ == "__main__":
    sys.exit(main())
