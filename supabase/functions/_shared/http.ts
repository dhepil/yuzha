// @ts-nocheck
/// <reference path='./deno-shim.d.ts' />
const ALLOWED_ORIGIN = Deno.env.get('EDGE_ALLOWED_ORIGIN') ?? '*'

export const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-request-id',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
}

export type SuccessResponse<T> = {
  success: true
  data: T
  metadata: ResponseMetadata
}

export type ErrorResponse = {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, unknown> | string | null
    retryable?: boolean
  }
  metadata: ResponseMetadata
}

export type ResponseMetadata = {
  timestamp: string
  request_id?: string
  processing_time_ms?: number
}

function buildMetadata(meta?: Partial<ResponseMetadata>): ResponseMetadata {
  return {
    timestamp: new Date().toISOString(),
    ...meta
  }
}

export function jsonSuccess<T>(data: T, init: { status?: number; requestId?: string; processingTimeMs?: number; headers?: HeadersInit } = {}): Response {
  const body: SuccessResponse<T> = {
    success: true,
    data,
    metadata: buildMetadata({
      request_id: init.requestId,
      processing_time_ms: init.processingTimeMs
    })
  }

  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: mergeHeaders(init.headers)
  })
}

export function jsonError(code: string, message: string, init: { status?: number; requestId?: string; details?: Record<string, unknown> | string | null; retryable?: boolean; headers?: HeadersInit } = {}): Response {
  const body: ErrorResponse = {
    success: false,
    error: {
      code,
      message,
      details: init.details,
      retryable: init.retryable
    },
    metadata: buildMetadata({ request_id: init.requestId })
  }

  return new Response(JSON.stringify(body), {
    status: init.status ?? 400,
    headers: mergeHeaders(init.headers)
  })
}

export function isOptions(request: Request): boolean {
  return request.method === 'OPTIONS'
}

export function okResponse(): Response {
  return new Response('ok', { headers: corsHeaders })
}

function mergeHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers(corsHeaders)
  if (extra) {
    const extraHeaders = new Headers(extra)
    extraHeaders.forEach((value, key) => {
      headers.set(key, value)
    })
  }
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  return headers
}
