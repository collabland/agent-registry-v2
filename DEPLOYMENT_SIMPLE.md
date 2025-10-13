# Simple Heroku Deployment - Production Only

## Quick Start

Test locally, then deploy to production.

## Prerequisites

1. [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
2. Heroku account
3. Git repository initialized

## Steps

### 1. Install Heroku CLI (if not already installed)

```bash
# Mac (using Homebrew)
brew tap heroku/brew && brew install heroku

# Or download from: https://devcenter.heroku.com/articles/heroku-cli
```

### 2. Login to Heroku

```bash
heroku login
```

### 3. Create Heroku App

```bash
# Create app (Heroku will generate a name)
heroku create

# Or with custom name
heroku create your-app-name
```

### 4. Set Environment Variables

```bash
# Generate API key
API_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Set variables
heroku config:set SIGNER=0xyour_private_key_here
heroku config:set API_KEY=$API_KEY
heroku config:set NODE_ENV=production

# Verify
heroku config
```

### 5. Deploy

```bash
# Make sure you're on main branch
git checkout main

# Deploy
git push heroku main

# Or use npm script
npm run deploy
```

### 6. Verify Deployment

```bash
# Open app
heroku open

# Check health
curl https://your-app-name.herokuapp.com/health

# View logs
npm run logs
```

## Workflow

```
1. Develop on 'develop' branch
2. Test locally: npm run dev
3. Merge to 'main': git checkout main && git merge develop
4. Deploy: npm run deploy
5. Monitor: npm run logs
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run deploy` | Deploy to Heroku |
| `npm run logs` | View logs |
| `heroku open` | Open app in browser |
| `heroku restart` | Restart app |
| `heroku config` | View environment variables |
| `heroku ps` | Check app status |

## Testing Webhook

```bash
# Get your API key
API_KEY=$(heroku config:get API_KEY)

# Test webhook
curl -X POST https://your-app-name.herokuapp.com/v1/intuition/events \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "type": "quiz_completed",
    "userAddress": "0x4917e853DC273da5F84362aB9f13eE49775B263c",
    "guildId": "391378559945670667",
    "metadata": {
      "quizId": "3e961b41-e62d-4d8c-93ec-a18cb8a948ab",
      "completedAt": "2025-10-12T20:49:17.000Z"
    },
    "version": "1.0.0"
  }'
```

## Troubleshooting

```bash
# View logs
heroku logs --tail

# Check status
heroku ps

# Restart
heroku restart

# Check environment
heroku config
```

---

*For detailed documentation, see [DEPLOYMENT.md](./DEPLOYMENT.md)*

