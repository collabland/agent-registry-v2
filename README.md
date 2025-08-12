# Reference implementation for agent registry

## Install

```
pnpm i
```

## Usage 

```
pnpm tsx src/sync.ts
```

```
pnpm tsx src/search.ts
```

```
Searching...
{
  'did:example:123': {
    name: 'The Automator',
    capabilities: [ 'file_search', 'web_search', 'defi' ],
    type: 'agent',
    description: 'Your ultimate ai assistant',
    url: 'https://example.com/a2a'
  },
}
```