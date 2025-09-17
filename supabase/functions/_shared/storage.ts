// @ts-nocheck
/// <reference path='./deno-shim.d.ts' />
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2"
export interface PathOptions {
  userId: string
  fileName: string
  moduleId?: string
  isPublic?: boolean
}

export interface StoragePaths {
  sanitizedName: string
  tempPath: string
  finalBucket: 'user-assets' | 'public-assets'
  finalPath: string
  assetKey: string
}

export function sanitizeFileName(name: string): string {
  const trimmed = name.trim()
  const fallback = `upload-${crypto.randomUUID()}`
  if (!trimmed) return `${fallback}.dat`
  const parts = trimmed.split('.')
  const extension = parts.length > 1 ? parts.pop() as string : ''
  const base = parts.join('.') || 'file'
  const safeBase = base.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'file'
  const safeExt = extension.replace(/[^a-zA-Z0-9]/g, '')
  return safeExt ? `${safeBase}.${safeExt}` : safeBase
}

export function base64ToUint8Array(base64: string): Uint8Array {
  const cleaned = base64.includes(',') ? base64.split(',').pop() as string : base64
  const binaryStr = atob(cleaned)
  const len = binaryStr.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i)
  }
  return bytes
}

export function buildStoragePaths(options: PathOptions): StoragePaths {
  const sanitizedName = sanitizeFileName(options.fileName)
  const unique = crypto.randomUUID()
  const moduleSegment = (options.moduleId || 'general').replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase()
  const tempPath = `${options.userId}/${unique}/${sanitizedName}`
  const finalBucket = options.isPublic ? 'public-assets' : 'user-assets'
  const finalPath = options.isPublic
    ? `${moduleSegment}/${unique}-${sanitizedName}`
    : `${options.userId}/${unique}/${sanitizedName}`

  return {
    sanitizedName,
    tempPath,
    finalBucket,
    finalPath,
    assetKey: `${finalBucket}:${finalPath}`
  }
}

export function inferAssetType(contentType?: string | null): string {
  if (!contentType) return 'document'
  if (contentType.startsWith('image/')) return 'image'
  if (contentType.startsWith('video/')) return 'video'
  if (contentType.includes('pdf')) return 'document'
  if (contentType.startsWith('audio/')) return 'audio'
  return 'document'
}
export interface PersistObjectArgs {
  supabase: SupabaseClient<any, any, any>
  paths: StoragePaths
  bytes: Uint8Array
  contentType: string
}

export interface PersistObjectResult {
  bucket: StoragePaths['finalBucket']
  path: string
  publicUrl?: string
  storageUploaded: boolean
  error?: string
}

export async function persistStorageObject({ supabase, paths, bytes, contentType }: PersistObjectArgs): Promise<PersistObjectResult> {
  const { error } = await supabase.storage
    .from(paths.finalBucket)
    .upload(paths.finalPath, bytes, {
      contentType,
      upsert: false
    })

  if (error) {
    return {
      bucket: paths.finalBucket,
      path: paths.finalPath,
      storageUploaded: false,
      error: error.message
    }
  }

  let publicUrl: string | undefined
  if (paths.finalBucket === 'public-assets') {
    const { data } = supabase.storage
      .from('public-assets')
      .getPublicUrl(paths.finalPath)
    publicUrl = data?.publicUrl ?? undefined
  }

  await supabase.storage
    .from('temp-uploads')
    .remove([paths.tempPath])

  return {
    bucket: paths.finalBucket,
    path: paths.finalPath,
    publicUrl,
    storageUploaded: true
  }
}
