import { sync, search } from '@0xintuition/sdk'
import { account, config } from './setup'

async function main() {

  // Sample data
  // did:example:123 - can be any identifier, for example - ethereum address
  // key / value pairs currently supported only one level deep (no nested objects)

  const data = {
    'did:example:123': {
      type: 'agent',
      name: 'The Automator',
      description: 'Your ultimate ai assistant',
      url: 'https://example.com/a2a',
      capabilities: ['defi', 'web_search', 'file_search']
    },
  }

  // the sync function will check for existing data, and will try to create
  // missing atoms / triples in two transactions

  console.log('Syncing data...')
  await sync(config, data)


  // the search function takes an array of required key/value pairs
  // and an array of trusted account addresses 

  console.log('Searching...')
  const result = await search([
    { type: 'agent' },
    // { capabilities: 'defi' },
    // { capabilities: 'web_search' },
  ], [account.address])

  console.dir(result, { depth: 10 })

}

main().catch(e => console.error(e))


