#!/usr/bin/env node
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
/* get-user-smart-account.js
   Usage:
   COLLABLAND_ACCOUNTKIT_API_KEY=... node get-user-smart-account.js <discordUserId> [--platform=discord|github] [--chain=84532]
   Notes:
   - PLATFORM defaults to 'discord'. For QA keys that require the workaround, use --platform=github.
   - CHAIN optional: if provided, returns the address for that chainId when available; otherwise returns the first EVM address.
*/

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// Load .env from CWD explicitly (works when run from repo root)
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const API_BASE = process.env.ACCOUNT_KIT_BASE_URL || 'https://api-qa.collab.land'; // override for PROD if needed

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { userId: undefined, platform: 'discord', chain: undefined, apiKey: undefined, debug: false };
  for (const a of args) {
    if (!a.startsWith('--') && !out.userId) out.userId = a;
    else if (a.startsWith('--platform=')) out.platform = a.split('=')[1] || out.platform;
    else if (a.startsWith('--chain=')) out.chain = Number(a.split('=')[1] || '');
    else if (a === '--debug') out.debug = true;
    else if (a.startsWith('--apiKey=')) out.apiKey = a.split('=')[1] || undefined;
  }
  if (!out.userId) {
    console.error('Usage: COLLABLAND_ACCOUNTKIT_API_KEY=... node get-user-smart-account.js <discordUserId> [--platform=discord|github] [--chain=84532]');
    process.exit(1);
  }
  return out;
}

async function main() {
  const { userId, platform, chain, apiKey: cliKey, debug } = parseArgs();

  const API_KEY = cliKey
    || process.env.COLLABLAND_ACCOUNTKIT_API_KEY
    || process.env.ACCOUNTKIT_API_KEY
    || process.env.ACCOUNT_KIT_API_KEY
    || process.env.COLLABLAND_API_KEY;

  if (!API_KEY) {
    console.error('Missing API key. Set COLLABLAND_ACCOUNTKIT_API_KEY (or ACCOUNTKIT_API_KEY / ACCOUNT_KIT_API_KEY / COLLABLAND_API_KEY) or pass --apiKey=...');
    process.exit(1);
  }

  const url = `${API_BASE}/accountkit/v2/evm/calculateAccountAddress`;
  const body = { platform, userId };

  if (debug) {
    console.error('[DEBUG] URL:', url);
    console.error('[DEBUG] PLATFORM:', platform);
    console.error('[DEBUG] USER ID:', userId);
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-API-KEY': API_KEY
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    if (debug) {
      console.error('[DEBUG] HTTP ERROR STATUS:', res.status);
      console.error('[DEBUG] RAW RESPONSE:', text);
    }
    console.error(`HTTP ${res.status}: ${text}`);
    process.exit(1);
  }

  const text = await res.text();
  if (debug) {
    console.error('[DEBUG] RAW RESPONSE:', text.slice(0, 2000));
  }
  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse JSON response');
    if (debug) console.error('[DEBUG] PARSE ERROR:', e?.message || String(e));
    process.exit(1);
  }
  const evm = (Array.isArray(json?.data?.evm) ? json.data.evm : (Array.isArray(json?.evm) ? json.evm : []));

  if (!Array.isArray(evm) || evm.length === 0) {
    if (debug) {
      console.error('[DEBUG] Parsed JSON keys:', Object.keys(json || {}));
      console.error('[DEBUG] data.evm:', json?.data?.evm);
      console.error('[DEBUG] evm:', json?.evm);
    }
    console.error('No EVM addresses found for this user.');
    process.exit(2);
  }

  let address = evm[0].address;
  if (chain) {
    const match = evm.find(e => Number(e.chainId) === Number(chain));
    if (match && match.address) address = match.address;
  }

  console.log(address);
}

main().catch(err => {
  console.error(err?.message || String(err));
  process.exit(1);
});