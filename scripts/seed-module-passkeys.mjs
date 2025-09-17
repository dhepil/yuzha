#!/usr/bin/env node

import { readFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import crypto from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')

async function fileExists(targetPath) {
  try {
    await access(targetPath)
    return true
  } catch {
    return false
  }
}

async function loadEnvIfPresent(envPath) {
  if (!(await fileExists(envPath))) return
  const raw = await readFile(envPath, 'utf8')
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    let value = trimmed.slice(idx + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

function requireEnv(key) {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required env var ${key}`)
  }
  return value
}

function hashPasskey(passkey, secret) {
  return crypto.createHmac('sha256', secret).update(passkey.trim()).digest('hex')
}

function normalizeEntries(rawMap, secret) {
  const result = []
  for (const [moduleId, rawValue] of Object.entries(rawMap)) {
    if (!moduleId || typeof moduleId !== 'string') continue
    let passkey
    let hint

    if (typeof rawValue === 'string') {
      passkey = rawValue
    } else if (rawValue && typeof rawValue === 'object') {
      if (typeof rawValue.passkey !== 'string') {
        throw new Error(`Invalid passkey for module ${moduleId} (expected string passkey)`)
      }
      passkey = rawValue.passkey
      if (typeof rawValue.hint === 'string' && rawValue.hint.trim().length > 0) {
        hint = rawValue.hint.trim()
      }
    } else {
      throw new Error(`Unsupported value for module ${moduleId}`)
    }

    if (!passkey || passkey.trim().length === 0) {
      console.warn(`[seed-module-passkeys] Skip module ${moduleId} because passkey is empty`)
      continue
    }

    result.push({
      module_id: moduleId,
      passkey_hash: hashPasskey(passkey, secret),
      hash_algorithm: 'HS256',
      passkey_hint: hint ?? null
    })
  }
  return result
}

async function main() {
  const prune = process.argv.includes('--prune')

  await loadEnvIfPresent(path.resolve(ROOT_DIR, '.env'))
  await loadEnvIfPresent(path.resolve(ROOT_DIR, '.env.local'))

  const supabaseUrl = requireEnv('SUPABASE_URL')
  const serviceKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
  const secret = requireEnv('MODULE_PASSKEY_SECRET')

  const sourcePath = path.resolve(ROOT_DIR, 'supabase', 'modulePasswords.json')
  if (!(await fileExists(sourcePath))) {
    throw new Error(`Passkey source file not found at ${sourcePath}`)
  }

  const raw = JSON.parse(await readFile(sourcePath, 'utf8'))
  const entries = normalizeEntries(raw, secret)
  if (entries.length === 0) {
    console.warn('[seed-module-passkeys] No module passkeys found to sync')
    return
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  })

  const timestamp = new Date().toISOString()
  const payload = entries.map((entry) => ({
    ...entry,
    updated_at: timestamp
  }))

  console.log(`[seed-module-passkeys] Syncing ${payload.length} module passkey(s) ...`)
  const { error: upsertError } = await supabase
    .from('module_passwords')
    .upsert(payload, { onConflict: 'module_id' })

  if (upsertError) {
    throw upsertError
  }

  if (prune) {
    const { data: existing, error: selectError } = await supabase
      .from('module_passwords')
      .select('module_id')

    if (selectError) {
      throw selectError
    }

    const keep = new Set(entries.map((entry) => entry.module_id))
    const toDelete = (existing ?? [])
      .map((row) => row.module_id)
      .filter((moduleId) => !keep.has(moduleId))

    if (toDelete.length > 0) {
      console.log(`[seed-module-passkeys] Pruning ${toDelete.length} module(s): ${toDelete.join(', ')}`)
      const { error: deleteError } = await supabase
        .from('module_passwords')
        .delete()
        .in('module_id', toDelete)
      if (deleteError) {
        throw deleteError
      }
    }
  }

  console.log('[seed-module-passkeys] Done')
}

main().catch((err) => {
  console.error('[seed-module-passkeys] Failed:', err.message)
  process.exitCode = 1
})
