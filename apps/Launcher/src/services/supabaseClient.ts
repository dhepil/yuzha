import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { readSbEnvOrThrow } from '@shared/utils/sbEnv'

let supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!supabase) {
    const env = readSbEnvOrThrow('Launcher')
    supabase = createClient(env.url, env.anonKey)
  }
  return supabase!
}

export async function getAccessToken(): Promise<string | null> {
  try {
    const sb = getSupabase()
    const { data } = await sb.auth.getSession()
    return data.session?.access_token ?? null
  } catch {
    return null
  }
}
