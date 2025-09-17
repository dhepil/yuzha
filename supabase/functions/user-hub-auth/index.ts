import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { jsonError, jsonSuccess, isOptions, okResponse } from '../_shared/http.ts'
import { getSupabaseWithAnonKey, getSupabaseWithServiceKey } from '../_shared/supabase.ts'
import { parseRequestId, requireUser } from '../_shared/auth.ts'

serve(async (req) => {
  if (isOptions(req)) {
    return okResponse()
  }

  const requestId = parseRequestId(req)

  try {
    const url = new URL(req.url)
    const segments = url.pathname.split('/').filter(Boolean)
    const fnIndex = segments.findIndex((segment) => segment === 'user-hub-auth')
    const route = fnIndex >= 0 ? segments.slice(fnIndex + 1).join('/') : ''
    const method = req.method.toUpperCase()

    switch (true) {
      case !route && method === 'GET':
        return jsonSuccess(
          {
            name: 'user-hub-auth',
            available_routes: [
              'GET /user-hub-auth/health',
              'GET /user-hub-auth/me',
              'POST /user-hub-auth/sign-in',
              'POST /user-hub-auth/sign-out',
              'POST /user-hub-auth/refresh'
            ]
          },
          { requestId }
        )

      case route === 'health' && method === 'GET':
        return jsonSuccess(
          {
            status: 'ok',
            service: 'user-hub-auth'
          },
          { requestId }
        )

      case route === 'me' && method === 'GET': {
        const authResult = await requireUser(req)
        if (authResult instanceof Response) return authResult
        const supabase = getSupabaseWithServiceKey(authResult.token)
        const { data, error } = await supabase.auth.getUser(authResult.token)
        if (error || !data?.user) {
          return jsonError('UNAUTHORIZED', 'Unable to fetch user profile', { status: 401, requestId })
        }
        const { user } = data
        return jsonSuccess(
          {
            id: user.id,
            email: user.email,
            phone: user.phone,
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at,
            app_metadata: user.app_metadata,
            user_metadata: user.user_metadata
          },
          { requestId }
        )
      }

      case route === 'sign-in' && method === 'POST': {
        const body = await req.json()
        const email = typeof body?.email === 'string' ? body.email.trim() : ''
        const password = typeof body?.password === 'string' ? body.password : ''

        if (!email || !password) {
          return jsonError('VALIDATION_ERROR', 'Email dan password wajib diisi', { status: 400, requestId })
        }

        const supabase = getSupabaseWithAnonKey()
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        if (error || !data?.session) {
          return jsonError('AUTH_FAILED', error?.message ?? 'Gagal masuk, periksa kredensial', { status: 401, requestId })
        }

        return jsonSuccess(
          {
            session: data.session,
            user: data.user
          },
          { requestId }
        )
      }

      case route === 'sign-out' && method === 'POST': {
        const authResult = await requireUser(req)
        if (authResult instanceof Response) return authResult

        const supabase = getSupabaseWithAnonKey(authResult.token)
        const { error } = await supabase.auth.signOut()
        if (error) {
          return jsonError('SIGN_OUT_FAILED', error.message, { status: 400, requestId })
        }
        return jsonSuccess({ signedOut: true }, { requestId })
      }

      case route === 'refresh' && method === 'POST': {
        const authResult = await requireUser(req)
        if (authResult instanceof Response) return authResult
        const supabase = getSupabaseWithAnonKey(authResult.token)
        const { data, error } = await supabase.auth.refreshSession()
        if (error || !data?.session) {
          return jsonError('REFRESH_FAILED', error?.message ?? 'Tidak dapat memperbarui sesi', { status: 401, requestId })
        }
        return jsonSuccess(
          {
            session: data.session,
            user: data.session.user
          },
          { requestId }
        )
      }

      default:
        return jsonError('NOT_FOUND', 'Endpoint tidak ditemukan', { status: 404, requestId })
    }
  } catch (error) {
    console.error('[user-hub-auth] Unhandled error', error)
    return jsonError('INTERNAL_ERROR', 'Terjadi kesalahan pada layanan', { status: 500, requestId })
  }
})
