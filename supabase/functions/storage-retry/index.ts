// @ts-nocheck
/// <reference path='../_shared/deno-shim.d.ts' />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2"
import { buildStoragePaths, inferAssetType, persistStorageObject, type StoragePaths } from "../_shared/storage.ts"
import { getGoogleAccessToken, setDriveFilePublic, uploadFileToDrive } from "../_shared/google.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = requireEnv('SUPABASE_URL')
    const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
    const action = new URL(req.url).searchParams.get('action') ?? 'retry'

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    switch (action) {
      case 'retry':
        return await handleRetryFailedUploads(supabase, new URL(req.url))
      case 'cleanup':
        return await handleCleanupTempObjects(supabase)
      case 'status':
        return await handleStatus(supabase)
      default:
        return jsonResponse({ error: 'Invalid action. Use retry, cleanup, or status.' }, 400)
    }
  } catch (error) {
    console.error('[storage-retry] unexpected error', error)
    return jsonResponse({ error: error instanceof Error ? error.message : 'Internal server error' }, 500)
  }
})

async function handleRetryFailedUploads(supabase: SupabaseClient, url: URL): Promise<Response> {
  const maxRetries = Number(url.searchParams.get('max_retries') ?? '3') || 3
  const driveFolderId = requireEnv('GOOGLE_DRIVE_FOLDER_ID')

  const { data: failed, error } = await supabase
    .from('upload_status')
    .select('id, user_id, file_name, file_path, retry_count, metadata')
    .eq('upload_status', 'drive_failed')
    .lt('retry_count', maxRetries)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch failed uploads: ${error.message}`)
  }

  if (!failed || failed.length === 0) {
    return jsonResponse({ success: true, retried: 0, message: 'No failed uploads to retry' })
  }

  const token = await getGoogleAccessToken(['https://www.googleapis.com/auth/drive.file'])
  let retried = 0
  let cleaned = 0

  for (const row of failed) {
    try {
      const metadata = row.metadata ?? {}
      const contentType = typeof metadata.contentType === 'string' ? metadata.contentType : 'application/octet-stream'
      const isPublic = Boolean(metadata.isPublic)
      const moduleId = typeof metadata.moduleId === 'string' ? metadata.moduleId : undefined

      const download = await supabase.storage.from('temp-uploads').download(row.file_path)
      if (download.error) {
        await logUploadError(supabase, row.id, 'File missing in temp-uploads during retry', download.error)
        await supabase
          .from('upload_status')
          .update({
            retry_count: row.retry_count + 1,
            error_message: 'File missing in temp storage',
            last_retry_at: new Date().toISOString()
          })
          .eq('id', row.id)
        continue
      }

      const bytes = new Uint8Array(await download.data.arrayBuffer())

      const drive = await uploadFileToDrive({
        token,
        file: bytes,
        fileName: row.file_name,
        contentType,
        folderId: driveFolderId
      })
      await setDriveFilePublic(token, drive.fileId)

      const paths = resolvePaths(row.user_id, row.file_name, row.file_path, metadata, moduleId, isPublic)
      const persistResult = await persistStorageObject({
        supabase,
        paths,
        bytes,
        contentType
      })

      if (persistResult.storageUploaded) {
        cleaned += 1
        await supabase
          .from('user_assets')
          .insert({
            user_id: row.user_id,
            asset_name: row.file_name,
            asset_type: inferAssetType(contentType),
            file_path: `${persistResult.bucket}/${persistResult.path}`,
            file_size: bytes.byteLength,
            mime_type: contentType,
            is_public: isPublic,
            metadata: {
              moduleId: moduleId ?? null,
              drive_file_id: drive.fileId,
              drive_url: drive.url
            }
          })
      } else {
        await logUploadWarning(supabase, row.id, 'Supabase storage persist failed during retry', persistResult.error ?? 'storage upload failed')
      }

      await supabase
        .from('upload_status')
        .update({
          drive_file_id: drive.fileId,
          drive_url: drive.url,
          upload_status: persistResult.storageUploaded ? 'cleanup_done' : 'drive_success',
          retry_count: row.retry_count + 1,
          error_message: persistResult.storageUploaded ? null : persistResult.error ?? 'Storage persist failed',
          last_retry_at: new Date().toISOString(),
          metadata: {
            ...metadata,
            finalBucket: paths.finalBucket,
            finalPath: paths.finalPath
          }
        })
        .eq('id', row.id)

      await logUploadInfo(supabase, row.id, 'Retry processed successfully')
      retried += 1
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      await supabase
        .from('upload_status')
        .update({
          retry_count: row.retry_count + 1,
          error_message: message,
          last_retry_at: new Date().toISOString()
        })
        .eq('id', row.id)
      await logUploadError(supabase, row.id, 'Retry failed with unexpected error', err)
    }
  }

  return jsonResponse({ success: true, retried, cleaned })
}

async function handleCleanupTempObjects(supabase: SupabaseClient): Promise<Response> {
  const { data, error } = await supabase
    .from('upload_status')
    .select('id, file_path, upload_status')
    .in('upload_status', ['drive_success', 'cleanup_done'])

  if (error) throw new Error(`Failed to load upload status for cleanup: ${error.message}`)

  if (!data || data.length === 0) {
    return jsonResponse({ success: true, cleaned: 0, message: 'No uploads pending cleanup' })
  }

  let cleaned = 0
  for (const row of data) {
    const removal = await supabase.storage.from('temp-uploads').remove([row.file_path])
    if (!removal.error) {
      cleaned += 1
      if (row.upload_status !== 'cleanup_done') {
        await supabase
          .from('upload_status')
          .update({ upload_status: 'cleanup_done' })
          .eq('id', row.id)
      }
    }
  }

  return jsonResponse({ success: true, cleaned })
}

async function handleStatus(supabase: SupabaseClient): Promise<Response> {
  const { data, error } = await supabase
    .from('upload_status')
    .select('upload_status')

  if (error) throw new Error(`Failed to read upload status summary: ${error.message}`)

  const summary: Record<string, number> = {}
  for (const row of data ?? []) {
    const status = row.upload_status as string
    summary[status] = (summary[status] ?? 0) + 1
  }

  return jsonResponse({ success: true, summary })
}

function resolvePaths(
  userId: string,
  fileName: string,
  tempPath: string,
  metadata: Record<string, unknown>,
  moduleId: string | undefined,
  isPublic: boolean
): StoragePaths {
  if (typeof metadata.finalBucket === 'string' && typeof metadata.finalPath === 'string') {
    return {
      sanitizedName: fileName,
      tempPath,
      finalBucket: metadata.finalBucket as StoragePaths['finalBucket'],
      finalPath: metadata.finalPath as string,
      assetKey: `${metadata.finalBucket}:${metadata.finalPath}`
    }
  }

  const generated = buildStoragePaths({
    userId,
    fileName,
    moduleId,
    isPublic
  })
  return {
    ...generated,
    tempPath
  }
}

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  })
}

function requireEnv(key: string): string {
  const value = Deno.env.get(key)
  if (!value) throw new Error(`${key} env var is required`)
  return value
}

async function logUploadInfo(supabase: SupabaseClient, uploadId: string, message: string): Promise<void> {
  await supabase
    .from('upload_logs')
    .insert({ upload_id: uploadId, log_level: 'info', message })
}

async function logUploadWarning(supabase: SupabaseClient, uploadId: string, message: string, details: unknown): Promise<void> {
  await supabase
    .from('upload_logs')
    .insert({
      upload_id: uploadId,
      log_level: 'warning',
      message,
      details: { details }
    })
}

async function logUploadError(supabase: SupabaseClient, uploadId: string, message: string, details: unknown): Promise<void> {
  await supabase
    .from('upload_logs')
    .insert({
      upload_id: uploadId,
      log_level: 'error',
      message,
      details: {
        error: details instanceof Error ? details.message : details
      }
    })
}
