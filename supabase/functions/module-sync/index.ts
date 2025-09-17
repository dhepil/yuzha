/// <reference path='../_shared/deno-shim.d.ts' />
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { jsonError, jsonSuccess, isOptions, okResponse } from '../_shared/http.ts'
import { getServiceSupabase } from '../_shared/supabase.ts'
import { parseRequestId, requireUser } from '../_shared/auth.ts'

const MODULE_TABLE = 'module_submissions'

serve(async (req) => {
  if (isOptions(req)) {
    return okResponse()
  }

  const requestId = parseRequestId(req)

  try {
    const authResult = await requireUser(req)
    if (authResult instanceof Response) return authResult

    const url = new URL(req.url)
    const segments = url.pathname.split('/').filter(Boolean)
    const fnIndex = segments.findIndex((segment) => segment === 'module-sync')
    const routeSegments = fnIndex >= 0 ? segments.slice(fnIndex + 1) : []
    const method = req.method.toUpperCase()

    if (routeSegments.length === 0) {
      if (method === 'GET') {
        return await handleSummary(authResult.user.id, url.searchParams, requestId)
      }
      return jsonError('NOT_FOUND', 'Module tidak ditentukan', { status: 404, requestId })
    }

    const moduleSlug = routeSegments[0]
    const resource = routeSegments[1]

    switch (true) {
      case method === 'GET' && routeSegments.length === 1:
        return await handleList(moduleSlug, authResult.user.id, url.searchParams, requestId)

      case method === 'POST' && routeSegments.length === 1:
        return await handleCreate(req, moduleSlug, authResult.user.id, requestId)

      case method === 'DELETE' && routeSegments.length === 2:
        return await handleDelete(moduleSlug, resource, authResult.user.id, requestId)

      default:
        return jsonError('NOT_FOUND', 'Endpoint tidak ditemukan', { status: 404, requestId })
    }
  } catch (error) {
    console.error('[module-sync] Unhandled error', error)
    return jsonError('INTERNAL_ERROR', 'Terjadi kesalahan pada layanan', { status: 500, requestId })
  }
})

async function handleSummary(userId: string, searchParams: URLSearchParams, requestId?: string) {
  const limit = Number(searchParams.get('limit') ?? '5')
  const supabase = getServiceSupabase()

  const { data, error } = await supabase
    .from(MODULE_TABLE)
    .select('module_name, created_at')
    .eq('user_id', userId)

  if (error) {
    console.error('[module-sync] summary error', error)
    return jsonError('DB_ERROR', 'Gagal memuat ringkasan modul', { status: 500, requestId })
  }

  const counts = new Map<string, number>()
  const sortedModules = new Map<string, number>()

  for (const row of data ?? []) {
    counts.set(row.module_name, (counts.get(row.module_name) ?? 0) + 1)
    const currentScore = sortedModules.get(row.module_name) ?? Number.MIN_SAFE_INTEGER
    const timestamp = new Date(row.created_at).getTime()
    if (timestamp > currentScore) {
      sortedModules.set(row.module_name, timestamp)
    }
  }

  const summary = Array.from(counts.entries())
    .map(([module, total]) => ({ module, total, last_activity: sortedModules.get(module) }))
    .sort((a, b) => (b.last_activity ?? 0) - (a.last_activity ?? 0))
    .slice(0, limit)

  return jsonSuccess({ summary }, { requestId })
}

async function handleList(
  moduleSlug: string,
  userId: string,
  searchParams: URLSearchParams,
  requestId?: string
) {
  const limit = Number(searchParams.get('limit') ?? '25')
  const status = searchParams.get('status')
  const fromDate = searchParams.get('from')
  const toDate = searchParams.get('to')

  const supabase = getServiceSupabase()
  let query = supabase
    .from(MODULE_TABLE)
    .select('id, submission_data, submission_status, created_at, metadata')
    .eq('user_id', userId)
    .eq('module_name', moduleSlug)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (status) {
    query = query.eq('submission_status', status)
  }
  if (fromDate) {
    query = query.gte('created_at', fromDate)
  }
  if (toDate) {
    query = query.lte('created_at', toDate)
  }

  const { data, error } = await query

  if (error) {
    console.error('[module-sync] list error', error)
    return jsonError('DB_ERROR', 'Gagal memuat data modul', { status: 500, requestId })
  }

  return jsonSuccess({ module: moduleSlug, rows: data ?? [] }, { requestId })
}

async function handleCreate(req: Request, moduleSlug: string, userId: string, requestId?: string) {
  const body = await req.json()
  const submissionData = body?.submission_data ?? body?.data ?? null
  const submissionStatus = typeof body?.submission_status === 'string' ? body.submission_status : 'pending'
  const metadata = typeof body?.metadata === 'object' ? body.metadata : null

  if (!submissionData || typeof submissionData !== 'object') {
    return jsonError('VALIDATION_ERROR', 'submission_data harus berupa objek', { status: 400, requestId })
  }

  const supabase = getServiceSupabase()
  const payload = {
    user_id: userId,
    module_name: moduleSlug,
    submission_data: submissionData,
    submission_status: submissionStatus,
    metadata
  }

  const { data, error } = await supabase
    .from(MODULE_TABLE)
    .insert(payload)
    .select('id, created_at, submission_status, submission_data')
    .single()

  if (error) {
    console.error('[module-sync] insert error', error)
    return jsonError('DB_ERROR', 'Gagal menyimpan data modul', { status: 500, requestId })
  }

  return jsonSuccess({ module: moduleSlug, record: data }, { status: 201, requestId })
}

async function handleDelete(moduleSlug: string, recordId: string, userId: string, requestId?: string) {
  const supabase = getServiceSupabase()
  const { error } = await supabase
    .from(MODULE_TABLE)
    .delete()
    .eq('user_id', userId)
    .eq('module_name', moduleSlug)
    .eq('id', recordId)

  if (error) {
    console.error('[module-sync] delete error', error)
    return jsonError('DB_ERROR', 'Gagal menghapus data modul', { status: 500, requestId })
  }

  return jsonSuccess({ module: moduleSlug, deleted: recordId }, { requestId })
}
