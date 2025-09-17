// @ts-nocheck
#!/usr/bin/env node

const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY']
const missing = required.filter((key) => !process.env[key])
if (missing.length) {
  console.error('[health-check] Missing env vars:', missing.join(', '))
  console.error('Set them before running this script. Exiting with code 1.')
  process.exit(1)
}

const baseFunctionsUrl = process.env.SUPABASE_FUNCTIONS_BASE || `${process.env.SUPABASE_URL}/functions/v1`

const targets = [
  {
    name: 'user-hub-auth health',
    url: `${baseFunctionsUrl}/user-hub-auth/health`,
    method: 'GET'
  },
  {
    name: 'module-passkey health',
    url: `${baseFunctionsUrl}/module-passkey`,
    method: 'POST',
    init: {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moduleId: 'health', passkey: 'dummy' })
    }
  },
  {
    name: 'module-sync summary',
    url: `${baseFunctionsUrl}/module-sync`,
    method: 'GET',
    requiresAuth: true
  }
]

async function getAuthHeader() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return undefined
  return `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
}

async function main() {
  const authHeader = await getAuthHeader()
  let failures = 0

  for (const target of targets) {
    const init = { method: target.method, ...(target.init || {}) }
    init.headers = {
      Accept: 'application/json',
      ...(init.headers || {})
    }
    if (target.requiresAuth && authHeader) {
      init.headers.Authorization = authHeader
    }

    process.stdout.write(`Checking ${target.name} (${target.url}) ... `)
    try {
      const response = await fetch(target.url, init)
      const text = await response.text()
      if (!response.ok) {
        failures++
        console.error(`FAILED [${response.status}]`)
        const preview = text.length > 300 ? `${text.slice(0, 300)}...` : text
        console.error(preview)
      } else {
        console.log('ok')
      }
    } catch (error) {
      failures++
      console.error('error')
      console.error(error)
    }
  }

  if (failures > 0) {
    console.error(`[health-check] ${failures} target(s) failed`)
    process.exitCode = 1
  } else {
    console.log('[health-check] All targets responded successfully')
  }
}

main()


