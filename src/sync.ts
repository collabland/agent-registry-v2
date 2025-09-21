import { sync } from '@0xintuition/sdk'
import { config } from './setup'

async function main() {

  // Sample data
  // did:example:123 - can be any identifier, for example - ethereum address
  // key / value pairs currently supported only one level deep (no nested objects)

  const data = {
    "0x18181c2997781115FE69c46D71CEa6a551c63Fd6":{
      "is a member of": "discord:904119310702772254"
    },
    "0xf574dBf90e36bf88B78Db883887fa947a1534132":{
      "is a member of": "discord:904119310702772254"
    },
    "0x9c68952d7a8ACbf235200396B9044770c4ACc649":{
      "is a member of": "discord:904119310702772254"
    },
    "0x2Bb354985f87D2c3D4a9121aAA03E536CE8D5a0f":{
      "is a member of": "discord:904119310702772254"
    }
  }

  // the sync function will check for existing data, and will try to create
  // missing atoms / triples in two transactions

  console.log('Syncing data...')
  await sync(config, data)
  console.log('Done.')

}

main().catch(e => console.error(e))


