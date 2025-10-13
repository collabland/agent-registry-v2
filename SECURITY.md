# Security Guide

## API Key Authentication

All webhook endpoints are protected with API key authentication to prevent unauthorized access.

## Setup

### 1. Generate a Secure API Key

Generate a strong, random API key (at least 32 characters):

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32

# Using Python
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### 2. Add to Environment Variables

Add the generated API key to your `.env` file:

```bash
API_KEY=your_generated_api_key_here
```

### 3. Using the API Key

Include the API key in the `x-api-key` header for all webhook requests:

```bash
curl -X POST http://localhost:3000/v1/intuition/events \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key_here" \
  -d '{"type": "quiz_completed", ...}'
```

## Protected Endpoints

The following endpoints require API key authentication:

- `POST /v1/intuition/events` - Webhook endpoint

## Public Endpoints

These endpoints do NOT require authentication:

- `GET /` - API information
- `GET /health` - Health check

## Error Responses

### Missing API Key (401 Unauthorized)

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "API key is required. Please provide 'x-api-key' header"
}
```

### Invalid API Key (403 Forbidden)

```json
{
  "success": false,
  "error": "Forbidden",
  "message": "Invalid API key"
}
```

## Heroku Deployment

Set the API key as an environment variable:

```bash
# Via CLI
heroku config:set API_KEY=your_generated_api_key_here

# View configured keys
heroku config
```

## Best Practices

### ✅ DO

- Generate strong, random API keys (32+ characters)
- Use different API keys for development and production
- Rotate API keys periodically
- Store API keys in environment variables only
- Use HTTPS in production (Heroku provides this automatically)
- Monitor failed authentication attempts

### ❌ DON'T

- Commit API keys to version control
- Share API keys publicly
- Use simple or predictable API keys
- Reuse API keys across different projects
- Include API keys in client-side code

## Multiple API Keys (Optional)

If you need to support multiple API keys (for different clients), you can modify the middleware:

```typescript
// In your route file
import { validateApiKeyMultiple } from "../middleware/auth.js";

const validKeys = [
  process.env.API_KEY_CLIENT_A,
  process.env.API_KEY_CLIENT_B,
];

router.post("/v1/intuition/events", validateApiKeyMultiple(validKeys), handler);
```

## Monitoring

Check your logs for authentication attempts:

```bash
# Local
npm run dev

# Heroku
heroku logs --tail
```

Failed authentication attempts are logged with warnings:

- `Request received without API key`
- `Invalid API key attempt: abc12345...`

## Testing Authentication

### Valid Request

```bash
curl -X POST http://localhost:3000/v1/intuition/events \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -d '{"type": "quiz_completed", "userAddress": "0x123", ...}'

# Expected: 200 OK
```

### Missing API Key

```bash
curl -X POST http://localhost:3000/v1/intuition/events \
  -H "Content-Type: application/json" \
  -d '{"type": "quiz_completed", ...}'

# Expected: 401 Unauthorized
```

### Invalid API Key

```bash
curl -X POST http://localhost:3000/v1/intuition/events \
  -H "Content-Type: application/json" \
  -H "x-api-key: wrong_key" \
  -d '{"type": "quiz_completed", ...}'

# Expected: 403 Forbidden
```

## Security Audit Checklist

- [ ] API_KEY is set in environment variables
- [ ] API_KEY is at least 32 characters
- [ ] API_KEY is randomly generated
- [ ] .env file is in .gitignore
- [ ] Different keys for dev/prod
- [ ] HTTPS enabled in production
- [ ] Monitoring failed auth attempts
- [ ] API keys rotated periodically

---

*Last updated: October 13, 2025*
