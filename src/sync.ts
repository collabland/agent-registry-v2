import { sync } from '@0xintuition/sdk'
import { config } from './setup'
import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

async function main() {

  // Sample data
  // did:example:123 - can be any identifier, for example - ethereum address
  // key / value pairs currently supported only one level deep (no nested objects)

  // const data = {
  //   'did:example:456': {
  //     type: 'agent',
  //     name: 'Claude',
  //     description: 'Your ultimate ai assistant',
  //     url: 'https://agent.example.com/a2a',
  //     capabilities: [
  //       'web_search',
  //       // 'defi',
  //     ]
  //   },
  // }

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const csvPath = path.resolve(__dirname, '../discord-active-community-data.csv')

  const ids: string[] = []
  const rl = createInterface({ input: createReadStream(csvPath), crlfDelay: Infinity })
  let skippedHeader = false
  for await (const line of rl) {
    if (!skippedHeader) { skippedHeader = true; continue }
    const [communityId] = line.split(',')
    if (communityId) {
      ids.push(communityId.trim())
      if (ids.length >= 3) break
    }
  }

  const data: Record<string, Record<string, string>> = {}
  for (const id of ids) {
    data[`discord:${id}`] = {
      'https://schema.org/keywords': 'ipfs://bafkreid2jcekdzf5vr3kdlyckpd2edpr22nhzdigsd4ccobvbthb64xssy'
    }
  }

  // the sync function will check for existing data, and will try to create
  // missing atoms / triples in two transactions

  console.log('Syncing data...')
  await sync(config, data)
  console.log('Done.')

}

main().catch(e => console.error(e))


