# Heroku Deployment Guide

## Two Environment Setup (QA + Production)

This guide will help you deploy your Agent Registry API to Heroku with two separate environments:

- **QA/Staging** - `develop` branch
- **Production** - `main` branch

## Prerequisites

1. [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
2. Heroku account
3. Git repository initialized
4. Environment variables ready (SIGNER, API_KEY)

## Initial Setup

### 1. Login to Heroku

```bash
heroku login
```

### 2. Create Two Heroku Apps

```bash
# Create QA/Staging app
heroku create agent-registry-qa --remote qa

# Create Production app
heroku create agent-registry-prod --remote production
```

> **Note:** Replace `agent-registry-qa` and `agent-registry-prod` with your preferred app names. They must be globally unique on Heroku.

### 3. Verify Remotes

```bash
git remote -v
```

You should see:

```
qa              https://git.heroku.com/agent-registry-qa.git (fetch)
qa              https://git.heroku.com/agent-registry-qa.git (push)
production      https://git.heroku.com/agent-registry-prod.git (fetch)
production      https://git.heroku.com/agent-registry-prod.git (push)
origin          <your-github-repo> (fetch)
origin          <your-github-repo> (push)
```

## Environment Variables Setup

### QA Environment

```bash
# Set QA environment variables
heroku config:set SIGNER=0x... --remote qa
heroku config:set API_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))") --remote qa
heroku config:set NODE_ENV=staging --remote qa

# Verify QA config
heroku config --remote qa
```

### Production Environment

```bash
# Set Production environment variables (use DIFFERENT keys!)
heroku config:set SIGNER=0x... --remote production
heroku config:set API_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))") --remote production
heroku config:set NODE_ENV=production --remote production

# Verify Production config
heroku config --remote production
```

> ⚠️ **Important:** Use different SIGNER and API_KEY values for QA and Production!

## Deployment

### Deploy to QA (from develop branch)

```bash
# Switch to develop branch
git checkout develop

# Commit your changes
git add .
git commit -m "Your commit message"

# Deploy to QA
git push qa develop:main

# View QA logs
heroku logs --tail --remote qa

# Open QA app
heroku open --remote qa
```

### Deploy to Production (from main branch)

```bash
# Switch to main branch
git checkout main

# Merge develop into main (after testing in QA)
git merge develop

# Deploy to Production
git push production main

# View Production logs
heroku logs --tail --remote production

# Open Production app
heroku open --remote production
```

## Quick Deployment Scripts

Use the provided deployment scripts for easier deployments:

### Deploy to QA

```bash
npm run deploy:qa
```

### Deploy to Production

```bash
npm run deploy:prod
```

## Health Check

After deployment, verify your app is running:

### QA Environment

```bash
curl https://agent-registry-qa.herokuapp.com/health
```

### Production Environment

```bash
curl https://agent-registry-prod.herokuapp.com/health
```

## Testing Webhook Endpoint

### QA

```bash
curl -X POST https://agent-registry-qa.herokuapp.com/v1/intuition/events \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_QA_API_KEY" \
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

### Production

```bash
# Same as above, but use production URL and API key
curl -X POST https://agent-registry-prod.herokuapp.com/v1/intuition/events \
  -H "x-api-key: YOUR_PROD_API_KEY" \
  ...
```

## Environment URLs

| Environment | URL |
|-------------|-----|
| QA | `https://agent-registry-qa.herokuapp.com` |
| Production | `https://agent-registry-prod.herokuapp.com` |

## Monitoring & Logs

### View Logs

```bash
# QA logs
heroku logs --tail --remote qa

# Production logs
heroku logs --tail --remote production
```

### View App Info

```bash
# QA info
heroku info --remote qa

# Production info
heroku info --remote production
```

### Restart App

```bash
# Restart QA
heroku restart --remote qa

# Restart Production
heroku restart --remote production
```

## Scaling (Optional)

### Scale Up

```bash
# QA
heroku ps:scale web=1 --remote qa

# Production (can use multiple dynos)
heroku ps:scale web=2 --remote production
```

### View Current Scale

```bash
heroku ps --remote qa
heroku ps --remote production
```

## Rollback (If Something Goes Wrong)

### Rollback QA

```bash
heroku rollback --remote qa
```

### Rollback Production

```bash
heroku rollback --remote production
```

## CI/CD with GitHub (Optional)

### Enable Automatic Deploys

1. Go to Heroku Dashboard
2. Select your app (QA or Production)
3. Click "Deploy" tab
4. Connect to GitHub
5. Enable Automatic Deploys
6. Choose branch:
   - QA app → `develop` branch
   - Production app → `main` branch
7. ✅ Enable "Wait for CI to pass before deploy" (recommended)

Now your apps will automatically deploy when you push to GitHub!

## Troubleshooting

### Check Build Logs

```bash
heroku logs --remote qa --tail
heroku logs --remote production --tail
```

### Check Environment Variables

```bash
heroku config --remote qa
heroku config --remote production
```

### Run Commands on Heroku

```bash
heroku run bash --remote qa
heroku run bash --remote production
```

### Check App Status

```bash
heroku ps --remote qa
heroku ps --remote production
```

## Workflow Summary

1. **Development** → Work on `develop` branch
2. **Testing** → Deploy to QA: `git push qa develop:main`
3. **Verification** → Test on QA environment
4. **Release** → Merge to `main`: `git merge develop`
5. **Deploy** → Deploy to Production: `git push production main`
6. **Monitor** → Check logs and health endpoints

## Security Checklist

- [ ] Different SIGNER keys for QA and Production
- [ ] Different API_KEY for QA and Production
- [ ] API keys are 32+ characters
- [ ] Never commit .env files
- [ ] HTTPS enabled (Heroku provides this automatically)
- [ ] Environment variables set correctly on both apps

## Cost Management

- Free tier: 550-1000 dyno hours/month
- Both apps can run on free tier during development
- Upgrade to paid tier for production if needed

## Support

If you encounter issues:

1. Check Heroku logs: `heroku logs --tail --remote <qa|production>`
2. Verify environment variables: `heroku config --remote <qa|production>`
3. Check app status: `heroku ps --remote <qa|production>`
4. Review [Heroku Dev Center](https://devcenter.heroku.com/)

---

*Last updated: October 13, 2025*
