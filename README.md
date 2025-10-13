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

Test locally, then deploy to production.

See **[DEPLOYMENT_SIMPLE.md](./DEPLOYMENT_SIMPLE.md)** for step-by-step guide.

### Quick Start

```bash
# Install Heroku CLI (Mac)
brew tap heroku/brew && brew install heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set SIGNER=0x...
heroku config:set API_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Deploy
git checkout main
git push heroku main
```

### Quick Commands

```bash
# Deploy
npm run deploy

# View logs
npm run logs

# Open app
heroku open
```

## Documentation

- **[Simple Deployment](./DEPLOYMENT_SIMPLE.md)** - Quick Heroku deployment guide (recommended)
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
