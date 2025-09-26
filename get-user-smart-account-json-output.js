#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

// Quiet .env loader (no logs)
function loadDotEnv() {
  const envPath = path.resolve(process.cwd(), '.env')
  if (!fs.existsSync(envPath)) return
  const content = fs.readFileSync(envPath, 'utf8')
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1)
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = value
  }
}

loadDotEnv()

const API_BASE = process.env.ACCOUNT_KIT_BASE_URL || 'https://api-qa.collab.land'

function parseArgs() {
  const n = Number(process.argv[2] || '')
  if (!Number.isFinite(n) || n <= 0) {
    console.error('Usage: node get-user-smart-account-json-output.js <count>')
    process.exit(1)
  }
  return { count: Math.floor(n) }
}

async function resolveSmartAccountAddress(userId, platform = 'github') {
  const API_KEY = process.env.COLLABLAND_ACCOUNTKIT_API_KEY
    || process.env.ACCOUNTKIT_API_KEY
    || process.env.ACCOUNT_KIT_API_KEY
    || process.env.COLLABLAND_API_KEY

  if (!API_KEY) {
    throw new Error('Missing API key: set COLLABLAND_ACCOUNTKIT_API_KEY (or ACCOUNTKIT_API_KEY / ACCOUNT_KIT_API_KEY / COLLABLAND_API_KEY)')
  }

  const url = `${API_BASE}/accountkit/v2/evm/calculateAccountAddress`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'X-API-KEY': API_KEY },
    body: JSON.stringify({ platform, userId })
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${text}`)
  }
  const text = await res.text()
  let json
  try { json = JSON.parse(text) } catch { throw new Error('Invalid JSON response') }
  const evm = Array.isArray(json?.data?.evm) ? json.data.evm : (Array.isArray(json?.evm) ? json.evm : [])
  const address = evm?.[0]?.address
  if (!address) throw new Error('No EVM address in response')
  return address
}

async function readFirstUserIds(csvPath, count) {
  const content = fs.readFileSync(csvPath, 'utf8')
  const lines = content.split(/\r?\n/)
  const out = []
  for (let i = 1; i < lines.length && out.length < count; i++) { // skip header
    const line = lines[i]
    if (!line) continue
    const [userId] = line.split(',')
    if (userId) out.push(userId.trim())
  }
  return out
}

async function main() {
  const { count } = parseArgs()
  const csvPath = path.resolve(process.cwd(), 'quiz-completions-edited.csv')
  if (!fs.existsSync(csvPath)) {
    console.error('Missing csv at', csvPath)
    process.exit(1)
  }
  const userIds = await readFirstUserIds(csvPath, count)

  const result = {}
  for (const userId of userIds) {
    try {
      const addr = await resolveSmartAccountAddress(userId, 'github')
      result[addr] = { "is a member of": "discord:1215232680942374912" }
    } catch (e) {
      // skip on failure for a userId
    }
  }

  process.stdout.write(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(err?.message || String(err))
  process.exit(1)
})


