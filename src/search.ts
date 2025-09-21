import { search } from '@0xintuition/sdk'
import { account } from './setup'

async function main() {

  // the search function takes an array of required key/value pairs
  // and an array of trusted account addresses 

  console.log('Searching...')
  // const result = await search([
  //   { type: 'agent' },
  //   // { capabilities: 'defi' },
  //   { capabilities: 'web_search' },
  // ], [account.address])

  const result = await search([
    // { type: 'agent' },
    // { capabilities: 'test' },
    {"name": "The Collab.Land Discord"},
    //{ capabilities: 'web_search' },
  ], [account.address])

  console.dir(result, { depth: 10 })

}

main().catch(e => console.error(e))


