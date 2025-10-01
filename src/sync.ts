import { sync } from '@0xintuition/sdk'
import { config } from './setup'
import { readFileSync } from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

async function main() {

  // Sample data
  // did:example:123 - can be any identifier, for example - ethereum address
  // key / value pairs currently supported only one level deep (no nested objects)

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const notesPath = path.resolve(__dirname, '../gaia_nodes_notes.json')

  const fileText = readFileSync(notesPath, 'utf8')
  const addressRegex = /"address"\s*:\s*"(0x[a-fA-F0-9]{40})"/g
  const addresses: string[] = []
  for (const m of fileText.matchAll(addressRegex)) {
    const addr = m[1]
    if (addr && !addresses.includes(addr)) addresses.push(addr)
  }

  const data: Record<string, Record<string, string>> = {}
  for (const addr of addresses) {
    data[addr] = {
      "https://schema.org/keywords": "ipfs://bafkreiedul7h4objcusen77cnffhcv4oi4yyc4w7avwiwpd3qrvzqun4sm"
    }
  }

  // the sync function will check for existing data, and will try to create
  // missing atoms / triples in two transactions

  console.log('Syncing data...')
  await sync(config, data)
  console.log('Done.')

}

main().catch(e => console.error(e))


