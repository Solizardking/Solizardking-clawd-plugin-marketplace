---
name: composio-instant
description: Use when connecting Composio Instant tools, configuring COMPOSIO_API_KEY, building a CLAWD custom toolkit, or preparing user-approved external actions.
---

# Composio Instant tools for CLAWD

- First discover current `pumpai-tools` capabilities. A search result or success-shaped placeholder does not prove COMPOSIO_API_KEY is configured or a paid tool executed. Verify a real authenticated response before claiming live integration.
- `COMPOSIO_API_KEY` is a **server-only** project secret, never a chat argument, plugin ZIP file, URL query, or client-side App resource. Use per-environment secret storage and rotate leaks.
- To create a Composio custom MCP toolkit, first deploy an independent HTTPS MCP server and confirm its *final* URL (no redirects), its tools, and authentication. Then run `examples/composio/register-custom-toolkit.mjs` in the trusted server environment. It requires `COMPOSIO_API_KEY`, `CUSTOM_MCP_URL`, and `COMPOSIO_USER_ID`. Creating a user-private custom toolkit may require a Composio Pro plan.
- Composio **Custom MCP** is experimental and distinct from in-process Custom Tools/Toolkits. Tool catalog membership and Instant search do not grant spending or trading approval.
- Route read-only searches immediately where permitted; for writes, trades, signatures, paid calls or account linking, require explicit user approval with the target, chain, amount, destination, fees, and expected effects. Do not execute on behalf of another user with a project-wide credential.
- Use `https://docs.composio.dev/docs/extending-sessions/custom-mcp` and Composio session documentation for current API requirements.
