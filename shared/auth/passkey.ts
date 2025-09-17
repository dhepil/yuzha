import type { SupabaseClient, Session } from '@supabase/supabase-js'

export function deriveEmailFromPasskey(passkey: string): string {
  const normalized = passkey.trim().toLowerCase()
  if (!normalized) throw new Error('Passkey tidak boleh kosong')
  return `${normalized}@passkey.yuzha`
}

export async function signInWithPasskey(
  client: SupabaseClient,
  passkey: string
): Promise<{ session: Session | null; error?: string }> {
  try {
    const trimmed = passkey.trim()
    if (!trimmed) {
      return { session: null, error: 'Passkey tidak boleh kosong' }
    }

    const email = deriveEmailFromPasskey(trimmed)
    let { data, error } = await client.auth.signInWithPassword({ email, password: trimmed })
    if (error && error.message.toLowerCase().includes('invalid login')) {
      const signUp = await client.auth.signUp({ email, password: trimmed, options: { data: { passkey: trimmed } } })
      if (signUp.error && !signUp.error.message.toLowerCase().includes('already registered')) {
        return { session: null, error: signUp.error.message }
      }
      const retry = await client.auth.signInWithPassword({ email, password: trimmed })
      data = retry.data
      error = retry.error
      if (error) return { session: null, error: error.message }
      return { session: data.session ?? null }
    }
    if (error) return { session: null, error: error.message }
    return { session: data.session ?? null }
  } catch (err) {
    return { session: null, error: err instanceof Error ? err.message : String(err) }
  }
}

export async function signOut(client: SupabaseClient): Promise<void> {
  await client.auth.signOut()
}
