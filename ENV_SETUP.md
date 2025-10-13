# Environment Variables Setup

## Required Environment Variables

Create a `.env` file in the root directory of the project with the following variables:

```bash
# Private key for signing transactions
# Get this from your wallet (MetaMask, etc.)
# IMPORTANT: Never commit your actual .env file to git!
SIGNER=0xyour_private_key_here

# API Key for webhook authentication
# Generate a secure random string (at least 32 characters)
API_KEY=your_secure_api_key_here

# Optional: Server port (defaults to 3000)
PORT=3000
```

## How to Get Your Private Key

### From MetaMask

1. Open MetaMask
2. Click the three dots menu
3. Go to Account Details
4. Click "Export Private Key"
5. Enter your password
6. Copy the private key

### Security Warning ⚠️

- **NEVER** commit your `.env` file to git
- **NEVER** share your private key with anyone
- The `.env` file is already in `.gitignore` to prevent accidental commits
- Use different keys for development and production

## Example .env file

```bash
SIGNER=0x6c25488133b8ca4ba754ea64886b1bfa4c4b05e7fea057c61f9951fe76f1d657
PORT=3000
```

## For Heroku Deployment

Instead of using a `.env` file, set environment variables in Heroku:

```bash
heroku config:set SIGNER=0xyour_private_key_here
```

Or via the Heroku Dashboard:

1. Go to your app dashboard
2. Click "Settings"
3. Click "Reveal Config Vars"
4. Add `SIGNER` as key and your private key as value

## Verifying Your Setup

After setting up your `.env` file, run:

```bash
pnpm run dev
```

You should see:

```
Using account: 0x1234... (your actual address)
🚀 Agent Registry API server running on port 3000
```

If you see an error about `SIGNER environment variable is required`, double-check:

1. Your `.env` file exists in the project root
2. The variable is named `SIGNER` (all caps)
3. The private key starts with `0x`
4. There are no extra spaces or quotes

## Troubleshooting

### Error: "SIGNER environment variable is required"

- Make sure `.env` file exists in the root directory
- Make sure the variable is named exactly `SIGNER`

### Error: "SIGNER must be a valid hex private key starting with 0x"

- Your private key must start with `0x`
- Add `0x` prefix if missing: `SIGNER=0x123abc...`

### Changes to .env not taking effect

- Restart your development server
- The `.env` file is only loaded when the application starts
