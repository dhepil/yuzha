import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const MODULE = 'm3_database'
const APP_NAME = '3Database'
const DEFAULT_SCHEMA = 'public'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const schema = (import.meta.env.VITE_SUPABASE_SCHEMA as string | undefined) ?? DEFAULT_SCHEMA

type AnySupabaseClient = SupabaseClient<any, any, any, any, any>

function assertEnv() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[supabase] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY for ' + APP_NAME)
    throw new Error('Supabase env missing')
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __sb__: Record<string, AnySupabaseClient | undefined> | undefined
}

function getCache(): Record<string, AnySupabaseClient | undefined> {
  if (!globalThis.__sb__) {
    globalThis.__sb__ = {} as Record<string, AnySupabaseClient | undefined>
  }
  return globalThis.__sb__
}

export function getSupabase(): AnySupabaseClient {
  assertEnv()
  const key = `${MODULE}:${schema}:${supabaseUrl}`
  const cache = getCache()

  if (!cache[key]) {
    const client = createClient(supabaseUrl!, supabaseAnonKey!, {
      db: { schema },
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    }) as AnySupabaseClient

    cache[key] = client
    if (import.meta.env.DEV) {
      console.info(`[supabase] client ready (${APP_NAME}) schema=${schema}`)
    }
  }

  return cache[key]!
}

export const supabase = getSupabase()
export const SCHEMA = schema
