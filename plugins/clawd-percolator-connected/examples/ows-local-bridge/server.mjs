// Owner-controlled local STDIO MCP example: public metadata + encrypted wallet creation only.
// Not a cloud server; private keys and passphrases are NEVER tool inputs or outputs.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { createWallet, listWallets } from '@open-wallet-standard/core';

const server = new McpServer({ name: 'clawd-ows-local', version: '0.1.0' });
const PUBLIC = w => ({id: w.id, name: w.name, createdAt: w.createdAt,
  accounts: (w.accounts || []).map(a=>({chainId:a.chainId, address:a.address, derivationPath:a.derivationPath}))});

server.tool('ows_wallet_list', 'List public wallet descriptors in the owner-controlled OWS vault.',
  {}, async () => ({content:[{type:'text',text:JSON.stringify({wallets:listWallets().map(PUBLIC)})}]}));

server.tool('ows_wallet_create', 'Create a new encrypted multi-chain OWS wallet on the owner-controlled device. Disabled until owner opts in locally.',
  { name: z.string().min(1).max(64).regex(/^[a-zA-Z0-9][a-zA-Z0-9._ -]*$/) },
  async ({name}) => {
    if (process.env.OWS_ALLOW_CREATE !== '1')
      return {isError:true,content:[{type:'text',text:'OWNER_ACTION_REQUIRED: local owner must enable OWS_ALLOW_CREATE=1'}]};
    const passphrase=process.env.OWS_VAULT_PASSPHRASE;
    if (!passphrase || passphrase.length < 16)
      return {isError:true,content:[{type:'text',text:'OWNER_ACTION_REQUIRED: configure a strong local OWS_VAULT_PASSPHRASE outside chat'}]};
    const prior = listWallets();
    if (prior.some(w=>w.name === name))
      return {isError:true,content:[{type:'text',text:'INVALID_INPUT: wallet name already exists; choose a new name'}]};
    const wallet = createWallet(name, passphrase, 12);
    return {content:[{type:'text',text:JSON.stringify({wallet:PUBLIC(wallet),notice:'Back up this vault securely on the owner device; no keys or mnemonic are sent to the model.'})}]};
  });

// Intentionally no `sign`, `signAndSend`, `signMessage`, `signTypedData`, `signHash`,
// or `signAuthorization` tools: they require audited policies and human authorization.
await server.connect(new StdioServerTransport());
