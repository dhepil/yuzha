import { useCallback, useEffect, useState } from 'react'
import type { SupabaseClient, Session } from '@supabase/supabase-js'
import { signOut as supabaseSignOut, signInWithPasskey } from '../auth/passkey'

type Status = 'checking' | 'authenticated' | 'unauthenticated'

type PasskeyState = {
  status: Status
  session: Session | null
  error: string | null
  signIn: (passkey: string) => Promise<void>
  signOut: () => Promise<void>
}

type Options = {
  moduleId?: string
}

function translateValidationError(message: string | null | undefined): string {
  if (!message) return 'Gagal memverifikasi passkey'
  const normalized = message.toLowerCase()
  if (normalized.includes('module not configured')) return 'Modul belum dikonfigurasi untuk passkey'
  if (normalized.includes('invalid passkey')) return 'Passkey tidak sesuai untuk modul ini'
  if (normalized.includes('passkey is required')) return 'Passkey tidak boleh kosong'
  return message
}

export function usePasskeySession(client: SupabaseClient, options: Options = {}): PasskeyState {
  const [status, setStatus] = useState<Status>('checking')
  const [session, setSession] = useState<Session | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    client.auth.getSession().then(({ data, error }) => {
      if (!active) return
      if (error) {
        console.error('[passkey] Failed to get session:', error)
        setStatus('unauthenticated')
        setSession(null)
        setError(error.message)
      } else {
        setSession(data.session ?? null)
        setStatus(data.session ? 'authenticated' : 'unauthenticated')
        setError(null)
      }
    })

    const { data: subscription } = client.auth.onAuthStateChange((event, currentSession) => {
      if (!active) return
      if (event === 'SIGNED_OUT') {
        setStatus('unauthenticated')
        setSession(null)
        setError(null)
      } else {
        setSession(currentSession ?? null)
        setStatus(currentSession ? 'authenticated' : 'unauthenticated')
        setError(null)
      }
    })

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [client])

  const signIn = useCallback(async (passkey: string) => {
    setStatus('checking')
    setError(null)
    const trimmed = passkey.trim()
    if (!trimmed) {
      setError('Passkey tidak boleh kosong')
      setStatus('unauthenticated')
      setSession(null)
      return
    }

    if (options.moduleId) {
      try {
        const { error: validationError, data: validationData } = await client.functions.invoke('module-passkey', {
          body: {
            moduleId: options.moduleId,
            passkey: trimmed
          }
        })

        if (validationError) {
          console.error('[passkey] Validation failed:', validationError)
          setError(translateValidationError(validationError.message))
          setStatus('unauthenticated')
          setSession(null)
          return
        }

        if (!validationData?.valid) {
          setError('Passkey tidak sesuai untuk modul ini')
          setStatus('unauthenticated')
          setSession(null)
          return
        }
      } catch (invokeError) {
        console.error('[passkey] Validation request failed:', invokeError)
        setError('Tidak dapat memverifikasi passkey, coba lagi')
        setStatus('unauthenticated')
        setSession(null)
        return
      }
    }

    const result = await signInWithPasskey(client, trimmed)
    if (result.error) {
      console.error('[passkey] Login failed:', result.error)
      setError(result.error)
      setStatus('unauthenticated')
      setSession(null)
      return
    }
    setSession(result.session ?? null)
    setStatus(result.session ? 'authenticated' : 'unauthenticated')
  }, [client, options.moduleId])

  const signOut = useCallback(async () => {
    await supabaseSignOut(client)
    setStatus('unauthenticated')
    setSession(null)
    setError(null)
  }, [client])

  return { status, session, error, signIn, signOut }
}
