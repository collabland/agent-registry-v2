import { sync } from '@0xintuition/sdk'
import { config } from './setup'

async function main() {

  // Sample data
  // did:example:123 - can be any identifier, for example - ethereum address
  // key / value pairs currently supported only one level deep (no nested objects)

  const data = {
    'gaianet.ai': {
      "https://schema.org/keywords": "ipfs://bafkreignirseakgl3f4a6ux7oslc67md5tvzcskifkirdz5u7xfqrddeli"
    }
  }
  }

  // the sync function will check for existing data, and will try to create
  // missing atoms / triples in two transactions

  console.log('Syncing data...')
  await sync(config, data)
  console.log('Done.')

}

main().catch(e => console.error(e))


