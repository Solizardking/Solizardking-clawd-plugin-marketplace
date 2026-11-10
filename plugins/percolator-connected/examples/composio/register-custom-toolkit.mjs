/** Run in a trusted deployment shell. Creates a Composio custom MCP toolkit only after prerequisites are set. */
const { COMPOSIO_API_KEY, CUSTOM_MCP_URL, COMPOSIO_USER_ID } = process.env;
if (!COMPOSIO_API_KEY || !CUSTOM_MCP_URL || !COMPOSIO_USER_ID) {
  throw new Error('Set COMPOSIO_API_KEY, CUSTOM_MCP_URL and COMPOSIO_USER_ID in trusted environment');
}
const endpoint = new URL(CUSTOM_MCP_URL);
if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password || endpoint.search || endpoint.hash) {
  throw new Error('CUSTOM_MCP_URL must be HTTPS with no credentials, query string or fragment');
}
// For NO_AUTH use ONLY a read-only server that is intentionally public.
// For authenticated servers set an appropriate API_KEY or DCR_OAUTH auth_schemes,
// then connect the user's account securely. Never hardcode a global trading token.
const body = {name: 'CLAWD Unified Research', mcp_url: endpoint.toString(),
  auth_schemes: [{mode: 'NO_AUTH'}], user_id: COMPOSIO_USER_ID};
const response = await fetch('https://backend.composio.dev/api/v3.1/custom/toolkits', {
  method: 'POST', redirect: 'error',
  headers: {'x-api-key': COMPOSIO_API_KEY, 'Content-Type':'application/json'},
  body: JSON.stringify(body)
});
const result = await response.json().catch(() => ({}));
if (!response.ok) throw new Error(`Composio toolkit registration failed: HTTP ${response.status}`);
console.log(JSON.stringify({slug: result.slug, connect_link: result.connect_link?.redirect_url ?? null}));
