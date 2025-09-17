import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2"
import { base64ToUint8Array, buildStoragePaths, inferAssetType, persistStorageObject } from "../_shared/storage.ts"
import { appendRowToSheet, getGoogleAccessToken, setDriveFilePublic, uploadFileToDrive } from "../_shared/google.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
}

interface UploadRequestBody {
  fileName: string
  contentType?: string
  data: string
  moduleId?: string
  isPublic?: boolean
  metadata?: Record<string, unknown>
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  try {
    const supabaseUrl = requireEnv('SUPABASE_URL')
    const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
    const driveFolderId = requireEnv('GOOGLE_DRIVE_FOLDER_ID')
    const spreadsheetId = Deno.env.get('GOOGLE_SPREADSHEET_ID') || null

    const authorization = req.headers.get('Authorization')
    if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
      return jsonResponse({ error: 'Missing or invalid Authorization header' }, 401)
    }

    const accessToken = authorization.split(' ')[1]
    const supabase = createClient(supabaseUrl, serviceRoleKey)
    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken)

    if (userError || !userData?.user) {
      return jsonResponse({ error: 'Unauthorized' }, 401)
    }

    const user = userData.user
    const body = (await req.json()) as UploadRequestBody
    const validationError = validateBody(body)
    if (validationError) {
      return jsonResponse({ error: validationError }, 400)
    }

    const fileBytes = base64ToUint8Array(body.data)
    const contentType = body.contentType || 'application/octet-stream'
    const paths = buildStoragePaths({
      userId: user.id,
      fileName: body.fileName,
      moduleId: body.moduleId,
      isPublic: body.isPublic
    })

    const { error: uploadError } = await supabase.storage
      .from('temp-uploads')
      .upload(paths.tempPath, fileBytes, {
        contentType,
        upsert: false
      })

    if (uploadError) {
      throw new Error(`Failed to upload to temp storage: ${uploadError.message}`)
    }

    const metadata = {
      ...(body.metadata ?? {}),
      moduleId: body.moduleId ?? null,
      contentType,
      isPublic: Boolean(body.isPublic),
      finalBucket: paths.finalBucket,
      finalPath: paths.finalPath
    }

    const { data: statusRow, error: statusError } = await supabase
      .from('upload_status')
      .insert({
        user_id: user.id,
        file_name: paths.sanitizedName,
        file_path: paths.tempPath,
        upload_status: 'pending',
        metadata
      })
      .select()
      .single()

    if (statusError) {
      throw new Error(`Failed to create upload status: ${statusError.message}`)
    }

    try {
      const token = await getGoogleAccessToken([
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/spreadsheets'
      ])

      const drive = await uploadFileToDrive({
        token,
        file: fileBytes,
        fileName: paths.sanitizedName,
        contentType,
        folderId: driveFolderId
      })

      await setDriveFilePublic(token, drive.fileId)

      if (spreadsheetId) {
        const values: (string | number | null)[] = [
          new Date().toISOString(),
          user.id,
          user.email ?? '',
          body.moduleId ?? '',
          paths.sanitizedName,
          drive.url
        ]
        try {
          await appendRowToSheet(token, spreadsheetId, values)
        } catch (sheetError) {
          await logUploadWarning(supabase, statusRow.id, 'Failed to append to Google Sheet', sheetError)
        }
      }

      const assetInfo = await persistStorageObject({
        supabase,
        paths,
        bytes: fileBytes,
        contentType
      })

      if (assetInfo.storageUploaded) {
        await supabase
          .from('user_assets')
          .insert({
            user_id: user.id,
            asset_name: paths.sanitizedName,
            asset_type: inferAssetType(contentType),
            file_path: `${paths.finalBucket}/${paths.finalPath}`,
            file_size: fileBytes.byteLength,
            mime_type: contentType,
            is_public: Boolean(body.isPublic),
            metadata: {
              moduleId: body.moduleId ?? null,
              drive_file_id: drive.fileId,
              drive_url: drive.url
            }
          })
      } else {
        await logUploadWarning(supabase, statusRow.id, 'Failed to persist copy in final bucket', assetInfo.error ?? 'storage upload failed')
      }

      await supabase
        .from('upload_status')
        .update({
          drive_file_id: drive.fileId,
          drive_url: drive.url,
          upload_status: 'cleanup_done',
          metadata
        })
        .eq('id', statusRow.id)

      await logUploadInfo(supabase, statusRow.id, 'Upload completed and synced to Google Drive')

      return jsonResponse({
        success: true,
        uploadId: statusRow.id,
        driveUrl: drive.url,
        driveFileId: drive.fileId,
        asset: {
          bucket: assetInfo.bucket,
          path: assetInfo.path,
          publicUrl: assetInfo.publicUrl,
          isPublic: Boolean(body.isPublic)
        }
      })
    } catch (error) {
      await supabase
        .from('upload_status')
        .update({
          upload_status: 'drive_failed',
          error_message: error instanceof Error ? error.message : String(error),
          retry_count: (statusRow.retry_count ?? 0) + 1,
          last_retry_at: new Date().toISOString(),
          metadata
        })
        .eq('id', statusRow.id)

      await logUploadError(supabase, statusRow.id, 'Upload failed, queued for retry', error)

      return jsonResponse({
        success: false,
        uploadId: statusRow.id,
        error: 'Upload stored but Google Drive sync failed. Retry scheduled.'
      }, 202)
    }
  } catch (error) {
    console.error('[storage-upload] Unexpected error', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return jsonResponse({ error: message }, 500)
  }
})

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  })
}

function validateBody(body: UploadRequestBody): string | null {
  if (!body) return 'Request body is required'
  if (!body.fileName || typeof body.fileName !== 'string') return 'fileName is required'
  if (!body.data || typeof body.data !== 'string') return 'data (base64) is required'
  if (body.data.length > 20 * 1024 * 1024) return 'File size exceeds 20MB limit'
  return null
}

function requireEnv(key: string): string {
  const value = Deno.env.get(key)
  if (!value) throw new Error(`${key} env var is required`)
  return value
}

async function logUploadInfo(supabase: SupabaseClient, uploadId: string, message: string): Promise<void> {
  await supabase
    .from('upload_logs')
    .insert({
      upload_id: uploadId,
      log_level: 'info',
      message
    })
}

async function logUploadWarning(supabase: SupabaseClient, uploadId: string | null, message: string, details: unknown): Promise<void> {
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


