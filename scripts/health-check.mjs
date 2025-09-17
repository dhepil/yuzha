"#!/usr/bin/env node

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
    name: 'test-submit health',
    url: `${baseFunctionsUrl}/test-submit`,
    method: 'POST',
    init: {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true })
    }
  }
]

async function testEndpoint(target) {
  try {
    const response = await fetch(target.url, {
      method: target.method,
      ...target.init
    })
    
    const status = response.status
    const text = await response.text()
    
    if (response.ok) {
      console.log(`✅ ${target.name}: ${status} - ${text.slice(0, 100)}...`)
      return true
    } else {
      console.error(`❌ ${target.name}: ${status} - ${text.slice(0, 200)}...`)
      return false
    }
  } catch (error) {
    console.error(`❌ ${target.name}: Error - ${error.message}`)
    return false
  }
}

async function main() {
  console.log('[health-check] Testing endpoints...')
  
  let allPassed = true
  for (const target of targets) {
    const passed = await testEndpoint(target)
    if (!passed) allPassed = false
  }
  
  if (allPassed) {
    console.log('[health-check] ✅ All endpoints healthy')
  } else {
    console.log('[health-check] ❌ Some endpoints failed')
    process.exit(1)
  }
}

main().catch(console.error)"