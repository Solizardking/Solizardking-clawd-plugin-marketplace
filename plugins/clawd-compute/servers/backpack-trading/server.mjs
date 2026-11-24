#!/usr/bin/env node
// backpack-trading — local MCP server (stdio, zero-dependency).
//
// Local Backpack Exchange trading for the Clawd Compute plugin: ED25519
// signing happens HERE, on the user's machine, in-process. The gateway never
// sees a key. The server is OFF BY DEFAULT: read tools need a Read Only key,
// and every trade tool additionally requires BACKPACK_TRADING_ENABLED=1 plus
// user-set caps, and a per-trade confirm token bound to the exact terms.
//
// Keys come only from the environment (BACKPACK_READ_API_KEY /
// BACKPACK_READ_SEED_B64 / BACKPACK_TRADE_API_KEY / BACKPACK_TRADE_SEED_B64),
// sourced by the user from their local secure storage. Nothing is logged to
// stdout except MCP protocol frames; diagnostics go to stderr and never
// include seeds or signatures.

import readline from 'node:readline';
import { loadConfig, ConfigError } from './config.mjs';
import { BackpackClient } from './client.mjs';
import { TOOLS } from './tools.mjs';

const SERVER_NAME = 'backpack-trading';
const SERVER_VERSION = '0.3.2';
const PROTOCOL_VERSION = '2024-11-05';

let config;
try {
  config = loadConfig(process.env);
} catch (err) {
  if (err instanceof ConfigError) {
    process.stderr.write(`backpack-trading: configuration error: ${err.message}\n`);
    process.exit(1);
  }
  throw err;
}

const client = new BackpackClient(config);
const ctx = { config, client, now: () => Date.now() };
const toolMap = new Map(TOOLS.map((t) => [t.name, t]));

function send(obj) {
  process.stdout.write(`${JSON.stringify(obj)}\n`);
}

function result(id, value) {
  send({ jsonrpc: '2.0', id, result: value });
}

function error(id, code, message) {
  send({ jsonrpc: '2.0', id, error: { code, message } });
}

async function handle(msg) {
  if (!msg || msg.jsonrpc !== '2.0' || typeof msg.method !== 'string') return;
  const isNotification = msg.id === undefined || msg.id === null;

  switch (msg.method) {
    case 'initialize': {
      if (isNotification) return;
      result(msg.id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
      });
      return;
    }
    case 'ping': {
      if (!isNotification) result(msg.id, {});
      return;
    }
    case 'tools/list': {
      if (isNotification) return;
      result(msg.id, {
        tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
      });
      return;
    }
    case 'tools/call': {
      if (isNotification) return;
      const name = msg.params?.name;
      const args = msg.params?.arguments ?? {};
      const tool = toolMap.get(name);
      if (!tool) {
        result(msg.id, {
          content: [{ type: 'text', text: `Unknown tool: ${name}` }],
          isError: true,
        });
        return;
      }
      try {
        const out = await tool.handler(ctx, args);
        result(msg.id, {
          content: [{ type: 'text', text: JSON.stringify(out, null, 2) }],
        });
      } catch (err) {
        // Gate refusals, token failures and API errors all surface as tool
        // errors with the plain reason — never as a signed request.
        result(msg.id, {
          content: [{ type: 'text', text: `${err.name ?? 'Error'}: ${err.message}` }],
          isError: true,
        });
      }
      return;
    }
    default: {
      if (!isNotification) error(msg.id, -32601, `Method not found: ${msg.method}`);
    }
  }
}

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
rl.on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  let msg;
  try {
    msg = JSON.parse(trimmed);
  } catch {
    process.stderr.write('backpack-trading: ignoring non-JSON input line\n');
    return;
  }
  handle(msg).catch((err) => {
    process.stderr.write(`backpack-trading: handler error: ${err.message}\n`);
  });
});

process.stderr.write(
  `backpack-trading ${SERVER_VERSION} ready (base ${config.baseUrl}, trading ${config.tradingEnabled ? 'ENABLED' : 'disabled'})\n`,
);
