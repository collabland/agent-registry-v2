# Agent Registry V2 - API Server

Reference implementation for a decentralized agent registry with HTTP API and webhook support.

## Features

✅ HTTP REST API for agent registration and search
✅ Webhook endpoint for external integrations
✅ Blockchain-based registry using Intuition Protocol
✅ Heroku-ready deployment configuration
✅ Health check endpoint
✅ Input validation and error handling

## Install

```bash
pnpm install
```

## Environment Variables

Create a `.env` file in the root directory:

```bash
# Required: Private key for blockchain transactions
SIGNER=0xyour_private_key_here

# Required: API key for webhook authentication
API_KEY=your_secure_api_key_here

# Optional: Server port (defaults to 3000)
PORT=3000
```

Generate a secure API key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Usage

### Start HTTP Server

```bash
# Development mode (with auto-reload)
pnpm run dev

# Production mode
pnpm start
```

### CLI Scripts (Original functionality)

```bash
# Register an agent directly
pnpm run sync

# Search for agents directly
pnpm run search
```

## API Endpoints

### Health Check

```bash
GET /health
```

### Register Agent(s)

```bash
POST /agents
Content-Type: application/json

{
  "did:example:123": {
    "type": "agent",
    "name": "My AI Agent",
    "description": "AI assistant",
    "url": "https://agent.example.com",
    "capabilities": ["web_search", "defi"]
  }
}
```

### Search Agents

```bash
POST /agents/search
Content-Type: application/json

{
  "criteria": [
    { "type": "agent" },
    { "capabilities": "web_search" }
  ],
  "trustedAccounts": ["0x..."]  # Optional
}
```

### Webhook (Protected with API Key)

```bash
POST /v1/intuition/events
Content-Type: application/json
x-api-key: your_api_key_here

{
  "type": "quiz_completed",
  "userAddress": "0x...",
  "guildId": "...",
  "metadata": {
    "quizId": "...",
    "completedAt": "..."
  },
  "version": "1.0.0"
}
```

## Example Response

```json
{
  "success": true,
  "count": 1,
  "results": {
    "did:example:123": {
      "name": "The Automator",
      "capabilities": ["file_search", "web_search", "defi"],
      "type": "agent",
      "description": "Your ultimate ai assistant",
      "url": "https://example.com/a2a"
    }
  }
}
```

## Heroku Deployment

### Two Environment Setup (QA + Production)

We maintain two separate Heroku environments:

- **QA** (develop branch) - For testing
- **Production** (main branch) - For live users

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete setup instructions.

### Quick Deploy

```bash
# Deploy to QA
npm run deploy:qa

# Deploy to Production
npm run deploy:prod

# Or use the script
./deploy.sh qa
./deploy.sh prod
```

### First Time Setup

```bash
# Create both apps
heroku create agent-registry-qa --remote qa
heroku create agent-registry-prod --remote production

# Set environment variables for QA
heroku config:set SIGNER=0x... --remote qa
heroku config:set API_KEY=... --remote qa

# Set environment variables for Production
heroku config:set SIGNER=0x... --remote production
heroku config:set API_KEY=... --remote production

# Deploy
git push qa develop:main     # Deploy develop to QA
git push production main      # Deploy main to Production
```

## Documentation

- **[Deployment Guide](./DEPLOYMENT.md)** - Heroku deployment with QA and Production environments
- **[API Documentation](./API_DOCUMENTATION.md)** - Complete API reference with examples
- **[Security Guide](./SECURITY.md)** - API key setup and security best practices
- **[Project Understanding](./PROJECT_UNDERSTANDING.md)** - Architecture and implementation details
- **[Environment Setup](./ENV_SETUP.md)** - Environment variables configuration

## Local Testing

```bash
# Terminal 1: Start server
pnpm run dev

# Terminal 2: Test endpoints
curl http://localhost:3000/health

curl -X POST http://localhost:3000/agents \
  -H "Content-Type: application/json" \
  -d '{"did:example:test": {"type": "agent", "name": "Test Agent"}}'
```

## Tech Stack

- **Express.js** - HTTP server
- **TypeScript** - Type safety
- **Viem** - Ethereum interactions
- **Intuition SDK** - Blockchain registry
- **Heroku** - Deployment platform
