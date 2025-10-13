# Agent Registry V2 - Project Understanding Document

## Overview

Agent Registry V2 is a reference implementation for a decentralized agent registry built on the Intuition Protocol. It provides a blockchain-based system for registering AI agents and their capabilities, enabling discovery and interaction between agents in a decentralized manner.

## Core Purpose

The project enables:

1. **Agent Registration**: Store agent metadata (name, capabilities, description, endpoint) on-chain
2. **Agent Discovery**: Search for agents based on capabilities and trust relationships
3. **Decentralized Identity**: Use DIDs (Decentralized Identifiers) for agent identification

## Architecture

### Tech Stack

- **Blockchain Layer**: Intuition Testnet (Chain ID: 13579)
- **Ethereum Library**: Viem 2.31.4
- **Protocol SDK**: @0xintuition/sdk (v2.0.0-alpha.0)
- **GraphQL Client**: @0xintuition/graphql (v2.0.0-alpha.0)
- **Language**: TypeScript
- **Runtime**: Node.js with tsx

### Key Components

#### 1. Setup (`src/setup.ts`)

**Purpose**: Configuration and initialization layer

**Key Elements**:

- **Chain Configuration**: Defines Intuition testnet with RPC endpoints
- **Wallet Client**: Creates wallet client for transaction signing
- **Public Client**: Creates read-only client for blockchain queries
- **Account**: Uses private key to create account (currently hardcoded - should use .env)
- **GraphQL Configuration**: Points to Intuition's development API

**Exports**:

```typescript
- account: Account object
- config: { walletClient, publicClient, address }
```

#### 2. Sync (`src/sync.ts`)

**Purpose**: Write agent data to the registry

**Functionality**:

- Takes agent data in key-value format
- Syncs to blockchain via Intuition protocol
- Creates missing atoms/triples in two transactions
- Atoms = individual data points
- Triples = relationships between atoms

**Data Structure**:

```typescript
{
  'did:example:456': {
    type: 'agent',
    name: 'Claude',
    description: 'Your ultimate ai assistant',
    url: 'https://agent.example.com/a2a',
    capabilities: ['web_search', 'defi']
  }
}
```

#### 3. Search (`src/search.ts`)

**Purpose**: Query agents from the registry

**Functionality**:

- Searches based on key/value pair requirements
- Filters by trusted account addresses
- Returns matching agent records

**Query Structure**:

```typescript
await search([
  { type: 'agent' },
  { capabilities: 'web_search' }
], [trustedAccountAddress])
```

## Data Model

### Agent Entity

| Field | Type | Description |
|-------|------|-------------|
| DID | string | Unique identifier (e.g., `did:example:123`) |
| type | string | Entity type (e.g., 'agent') |
| name | string | Human-readable agent name |
| description | string | Agent description |
| url | string | Agent endpoint URL (A2A protocol) |
| capabilities | string[] | Array of capability tags |

### Capability Examples

- `file_search` - File searching capability
- `web_search` - Web search capability
- `defi` - DeFi/blockchain operations

## Blockchain Integration

### Intuition Protocol

The project uses Intuition's atom/triple model:

1. **Atoms**: Individual data points (e.g., "type:agent", "name:Claude")
2. **Triples**: Subject-Predicate-Object relationships stored on-chain
3. **Multi-Vault**: Smart contract managing the registry data

### Network Details

- **Network**: Intuition Testnet
- **Chain ID**: 13579
- **RPC**: <https://testnet.rpc.intuition.systems/http>
- **Explorer**: <https://testnet.explorer.intuition.systems>
- **Currency**: tTRUST (Test Trust)

## Current State

### Working Features

✅ Blockchain client setup
✅ Agent data synchronization
✅ Agent search by capabilities
✅ Trust-based filtering

### Limitations

⚠️ Hardcoded private key in source code (security risk)
⚠️ Single-level key/value pairs only (no nested objects)
⚠️ No error handling or validation
⚠️ No CLI or API interface
⚠️ Limited documentation
⚠️ No tests

## Workflow

### 1. Register an Agent

```bash
# Edit src/sync.ts with your agent data
pnpm tsx src/sync.ts
```

### 2. Search for Agents

```bash
# Edit src/search.ts with search criteria
pnpm tsx src/search.ts
```

## Security Considerations

### Current Issues

1. **Private Key Exposure**: Private key is hardcoded in `src/setup.ts`
   - Should be moved to `.env` file
   - `.env` is already in `.gitignore` but not being used

2. **No Input Validation**: User data is not validated before sync

3. **No Rate Limiting**: No protection against spam registrations

## Potential Features to Implement

### High Priority

1. **Environment Variables**: Move private key to .env
2. **Input Validation**: Validate agent data structure
3. **Error Handling**: Proper try-catch and error messages
4. **CLI Interface**: Command-line tool for registration/search
5. **Batch Operations**: Register/update multiple agents

### Medium Priority

6. **REST API**: HTTP API for agent registration/discovery
7. **Agent Update**: Update existing agent records
8. **Agent Deletion/Deactivation**: Remove or disable agents
9. **Advanced Search**: Filter by multiple criteria, fuzzy search
10. **Trust Network**: Manage trust relationships

### Low Priority

11. **Web Dashboard**: Frontend for managing agents
12. **Agent Verification**: Verify agent ownership via signatures
13. **Capability Registry**: Standardized capability definitions
14. **Analytics**: Usage stats and metrics
15. **Multi-chain Support**: Deploy to multiple networks

## Dependencies

### Production

- `@0xintuition/graphql`: GraphQL client for Intuition API
- `@0xintuition/protocol`: Protocol definitions and types
- `@0xintuition/sdk`: Core SDK with sync/search functions
- `viem`: Modern Ethereum library
- `dotenv`: Environment variable management
- `tsx`: TypeScript execution
- `typescript`: TypeScript compiler

### Development

- `@types/node`: Node.js type definitions

## Development Commands

```bash
# Install dependencies
pnpm install

# Sync agents to registry
pnpm tsx src/sync.ts

# Search for agents
pnpm tsx src/search.ts
```

## Next Steps

Before implementing new features, recommended improvements:

1. ✅ Create this understanding document
2. Move private key to environment variables
3. Add proper error handling
4. Add input validation
5. Create a structured CLI
6. Add tests

---

*Document created: October 13, 2025*
*Last updated: October 13, 2025*
