# Agent Registry API Documentation

## Base URL

**Local Development**: `http://localhost:3000`
**Heroku**: `https://your-app-name.herokuapp.com`

## Endpoints

### 1. Health Check

Check if the API is running and healthy.

**Endpoint**: `GET /health`

**Response**:

```json
{
  "status": "healthy",
  "timestamp": "2025-10-13T12:00:00.000Z",
  "account": "0x1234567890abcdef..."
}
```

---

### 2. API Info

Get information about available endpoints.

**Endpoint**: `GET /`

**Response**:

```json
{
  "name": "Agent Registry API",
  "version": "1.0.0",
  "endpoints": {
    "health": "GET /health",
    "registerAgent": "POST /agents",
    "searchAgents": "POST /agents/search"
  }
}
```

---

### 3. Register Agent(s)

Register one or more agents to the blockchain registry.

**Endpoint**: `POST /agents`

**Request Body**:

```json
{
  "did:example:123": {
    "type": "agent",
    "name": "My AI Agent",
    "description": "An AI assistant specialized in DeFi",
    "url": "https://myagent.example.com/a2a",
    "capabilities": ["web_search", "defi", "file_search"]
  },
  "did:example:456": {
    "type": "agent",
    "name": "Another Agent",
    "description": "Web search specialist",
    "url": "https://anotheragent.example.com/a2a",
    "capabilities": ["web_search"]
  }
}
```

**Validation Rules**:

- DID must start with `did:`
- Each agent must have at least `type` and `name` fields
- Keys can only be one level deep (no nested objects in values)

**Success Response** (201 Created):

```json
{
  "success": true,
  "message": "Agent(s) registered successfully",
  "count": 2,
  "dids": ["did:example:123", "did:example:456"]
}
```

**Error Response** (400 Bad Request):

```json
{
  "error": "Invalid DID format",
  "message": "DID must start with \"did:\" - got \"example:123\""
}
```

**Error Response** (500 Internal Server Error):

```json
{
  "error": "Failed to register agent",
  "message": "Transaction failed: insufficient funds"
}
```

---

### 4. Search Agents

Search for agents based on criteria and trusted accounts.

**Endpoint**: `POST /agents/search`

**Request Body**:

```json
{
  "criteria": [
    { "type": "agent" },
    { "capabilities": "web_search" }
  ],
  "trustedAccounts": ["0x1234567890abcdef..."]
}
```

**Parameters**:

- `criteria` (required): Array of key-value pairs to match. All criteria must be satisfied (AND logic).
- `trustedAccounts` (optional): Array of blockchain addresses to filter by. Defaults to the server's account if not provided.

**Success Response** (200 OK):

```json
{
  "success": true,
  "count": 1,
  "results": {
    "did:example:123": {
      "name": "My AI Agent",
      "capabilities": ["file_search", "web_search", "defi"],
      "type": "agent",
      "description": "An AI assistant specialized in DeFi",
      "url": "https://myagent.example.com/a2a"
    }
  }
}
```

**Error Response** (400 Bad Request):

```json
{
  "error": "Invalid request body",
  "message": "Expected \"criteria\" as an array of key-value pairs"
}
```

---

### 5. Webhook Endpoint

Generic webhook endpoint for external integrations (Zapier, Make, etc.).

**Endpoint**: `POST /v1/intuition/events`

**Request Body**:

```json
{
  "action": "register",
  "data": {
    "did:example:789": {
      "type": "agent",
      "name": "Webhook Agent",
      "description": "Registered via webhook",
      "url": "https://webhook-agent.example.com",
      "capabilities": ["automation"]
    }
  }
}
```

**Supported Actions**:

#### Register Action

```json
{
  "action": "register",
  "data": {
    "did:example:123": { /* agent data */ }
  }
}
```

#### Search Action

```json
{
  "action": "search",
  "data": {
    "criteria": [{ "type": "agent" }],
    "trustedAccounts": ["0x..."]
  }
}
```

**Success Response** (200 OK):

```json
{
  "success": true,
  "message": "Agent registered via webhook"
}
```

**Error Response** (400 Bad Request):

```json
{
  "error": "Unknown action",
  "message": "Action \"delete\" is not supported",
  "supportedActions": ["register", "search"]
}
```

---

## Example Usage

### cURL Examples

#### Register an Agent

```bash
curl -X POST http://localhost:3000/agents \
  -H "Content-Type: application/json" \
  -d '{
    "did:example:mycoolbot": {
      "type": "agent",
      "name": "My Cool Bot",
      "description": "A helpful AI assistant",
      "url": "https://mycoolbot.com/a2a",
      "capabilities": ["web_search", "coding"]
    }
  }'
```

#### Search for Agents

```bash
curl -X POST http://localhost:3000/agents/search \
  -H "Content-Type: application/json" \
  -d '{
    "criteria": [
      { "type": "agent" },
      { "capabilities": "web_search" }
    ]
  }'
```

#### Webhook Call

```bash
curl -X POST http://localhost:3000/v1/intuition/events \
  -H "Content-Type: application/json" \
  -d '{
    "action": "register",
    "data": {
      "did:example:webhookbot": {
        "type": "agent",
        "name": "Webhook Bot",
        "capabilities": ["automation"]
      }
    }
  }'
```

---

## JavaScript/Node.js Examples

### Register an Agent

```javascript
const response = await fetch('http://localhost:3000/agents', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    'did:example:myagent': {
      type: 'agent',
      name: 'My Agent',
      description: 'AI assistant',
      url: 'https://myagent.com',
      capabilities: ['web_search']
    }
  })
})

const result = await response.json()
console.log(result)
```

### Search for Agents

```javascript
const response = await fetch('http://localhost:3000/agents/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    criteria: [
      { type: 'agent' },
      { capabilities: 'defi' }
    ],
    trustedAccounts: ['0x1234...']
  })
})

const result = await response.json()
console.log(result.results)
```

---

## Heroku Deployment

### Prerequisites

1. Heroku CLI installed
2. Git initialized in your project
3. Environment variables configured

### Deployment Steps

```bash
# Login to Heroku
heroku login

# Create a new Heroku app
heroku create your-agent-registry-api

# Set environment variables (important!)
heroku config:set PRIVATE_KEY=0xyour_private_key_here

# Deploy
git push heroku main

# Check logs
heroku logs --tail

# Open your app
heroku open
```

### Environment Variables

Set these in Heroku dashboard or via CLI:

```bash
heroku config:set SIGNER=0x...
heroku config:set PORT=3000  # Optional, Heroku sets this automatically
```

### Health Check

Heroku will monitor `GET /health` to ensure your app is running correctly.

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created (agent registered) |
| 400 | Bad Request (invalid input) |
| 404 | Not Found (invalid endpoint) |
| 500 | Internal Server Error (blockchain or system error) |

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production use, consider adding:

- Express rate limiter middleware
- IP-based throttling
- API key authentication

---

## Security Considerations

⚠️ **Important**:

1. Never commit your private key to git
2. Always use environment variables for sensitive data
3. Use HTTPS in production (Heroku provides this automatically)
4. Consider adding authentication for production deployments

---

## Local Development

```bash
# Install dependencies
pnpm install

# Run in development mode (with auto-reload)
pnpm run dev

# Run in production mode
pnpm start
```

---

## Support

For issues or questions:

- Check the logs: `heroku logs --tail`
- Review the PROJECT_UNDERSTANDING.md document
- Verify your environment variables are set correctly

---

*Last updated: October 13, 2025*
