import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { jsonError } from './http.ts'
import { getSupabaseWithServiceKey } from './supabase.ts'

export type AuthenticatedUser = {
  id: string
  email?: string
  role?: string
  [key: string]: unknown
}

export async function requireUser(request: Request, client?: SupabaseClient): Promise<{ user: AuthenticatedUser; token: string } | Response> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    return jsonError('UNAUTHORIZED', 'Missing or invalid Authorization header', { status: 401 })
  }

  const token = authHeader.split(' ')[1]
  try {
    const supabase = client ?? getSupabaseWithServiceKey(token)
    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data?.user) {
      return jsonError('UNAUTHORIZED', 'Invalid or expired token', { status: 401 })
    }
    return { user: data.user as AuthenticatedUser, token }
  } catch (error) {
    console.error('[auth] requireUser failed', error)
    return jsonError('UNAUTHORIZED', 'Unable to validate token', { status: 401 })
  }
}

export function parseRequestId(request: Request): string | undefined {
  return request.headers.get('X-Request-ID') ?? undefined
}
