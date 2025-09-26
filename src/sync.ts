import { sync } from '@0xintuition/sdk'
import { config } from './setup'

async function main() {

  // Sample data
  // did:example:123 - can be any identifier, for example - ethereum address
  // key / value pairs currently supported only one level deep (no nested objects)

  // const data = {
  //   'discord:1215232680942374912': {
  //     "https://schema.org/keywords": "ipfs://bafkreid2jcekdzf5vr3kdlyckpd2edpr22nhzdigsd4ccobvbthb64xssy"
  //   },
  // }

const data = {
  "0x92b83992f7d1BD4a9Cd94e25e82674098e3eCe3A": {
    "is a member of": "discord:1215232680942374912"
  },
  "0x873134b5FB54AC3C8b14FA32318dfc9e80984b41": {
    "is a member of": "discord:1215232680942374912"
  },
  "0x8B97eBB72F869BbDdc7Ff42AD35D2A81cBEF0BC1": {
    "is a member of": "discord:1215232680942374912"
  }
}

  // the sync function will check for existing data, and will try to create
  // missing atoms / triples in two transactions

  console.log('Syncing data...')
  await sync(config, data)
  console.log('Done.')

}

main().catch(e => console.error(e))


