#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const ENV = {
  url: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://xaluaekioqwxtzhnmygg.supabase.co',
  anon: process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbHVhZWtpb3F3eHR6aG5teWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxODQ1OTEsImV4cCI6MjA3Mjc2MDU5MX0.1-SFKaJtbuovb7vhy1cartgZveJOsMl__luyf9I3M9I',
}

const modules = [
  { name: 'Launcher', schema: 'public' },
  { name: '0Setting', schema: 'public' },
  { name: '1Meng', schema: 'public' },
  { name: '3Database', schema: 'public' },
  { name: '4Extra', schema: 'public' },
  { name: '5Rara', schema: 'public' },
]

console.log('Phase 3 module check')
console.log(`Using Supabase URL: ${ENV.url}`)

const baseClient = createClient(ENV.url, ENV.anon)

async function checkSession() {
  const { data, error } = await baseClient.auth.getSession()
  if (error) {
    console.log('[ERROR] auth.getSession:', error.message)
    return false
  }
  console.log('[OK   ] auth.getSession responded (session:', data.session ? 'present' : 'null', ')')
  return true
}

function clientForSchema(schema) {
  return createClient(ENV.url, ENV.anon, { db: { schema }, auth: { persistSession: false } })
}

async function probeModule(mod) {
  const client = clientForSchema(mod.schema)
  try {
    const { data, error } = await client.from('module_submissions').select('id').limit(1)
    if (error) return { ok: false, message: error.message }
    return { ok: true, message: `module_submissions accessible (${data?.length || 0} rows)` }
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : String(err) }
  }
}

(async () => {
  const authOk = await checkSession()
  let allOk = authOk
  for (const mod of modules) {
    const result = await probeModule(mod)
    console.log(`[${result.ok ? 'OK   ' : 'WARN '}] ${mod.name} [schema=${mod.schema}]: ${result.message}`)
    if (!result.ok) allOk = false
  }
  if (!allOk) {
    console.log('\nPhase 3 integration incomplete. See warnings above.')
    process.exitCode = 1
  } else {
    console.log('\nPhase 3 basic probes passed.')
  }
})()
