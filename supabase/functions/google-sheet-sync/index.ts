// @ts-nocheck
/// <reference path='../_shared/deno-shim.d.ts' />
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { isOptions, jsonError, jsonSuccess, okResponse } from '../_shared/http.ts'
import { parseRequestId, requireUser } from '../_shared/auth.ts'
import { getGoogleAccessToken } from '../_shared/google.ts'

const DEFAULT_RANGE = 'Sheet1!A:Z'
const DEFAULT_VALUE_INPUT: ValueInputOption = 'RAW'
const DEFAULT_INSERT_OPTION: InsertDataOption = 'INSERT_ROWS'

type ValueInputOption = 'RAW' | 'USER_ENTERED'
type InsertDataOption = 'OVERWRITE' | 'INSERT_ROWS'

type AppendRequestBody = {
  spreadsheetId?: string
  range?: string
  values?: unknown[]
  valueInputOption?: ValueInputOption
  insertDataOption?: InsertDataOption
  includeUserContext?: boolean
}

serve(async (req) => {
  if (isOptions(req)) {
    return okResponse()
  }

  const requestId = parseRequestId(req)

  if (req.method !== 'POST') {
    return jsonError('METHOD_NOT_ALLOWED', 'Use POST', { status: 405, requestId })
  }

  const authResult = await requireUser(req)
  if (authResult instanceof Response) {
    return authResult
  }

  let body: AppendRequestBody
  try {
    body = await req.json()
  } catch {
    return jsonError('INVALID_JSON', 'Request body must be valid JSON', { status: 400, requestId })
  }

  const spreadsheetId = normalizeSpreadsheetId(body.spreadsheetId)
  if (!spreadsheetId) {
    return jsonError('MISSING_SPREADSHEET_ID', 'Provide spreadsheetId in payload or set GOOGLE_SPREADSHEET_ID', {
      status: 400,
      requestId
    })
  }

  if (!Array.isArray(body.values) || body.values.length === 0) {
    return jsonError('INVALID_VALUES', 'values must be a non-empty array of row arrays', { status: 400, requestId })
  }

  const includeUserContext = Boolean(body.includeUserContext)
  const range = normalizeRange(body.range)
  const valueInput = normalizeValueInput(body.valueInputOption)
  const insertOption = normalizeInsertOption(body.insertDataOption)
  const rowsResult = normalizeRows(body.values, includeUserContext, authResult.user)
  if (rowsResult instanceof Response) {
    return rowsResult
  }

  try {
    const token = await getGoogleAccessToken(['https://www.googleapis.com/auth/spreadsheets'])
    await appendRows({
      token,
      spreadsheetId,
      range,
      valueInputOption: valueInput,
      insertDataOption: insertOption,
      values: rowsResult.rows
    })

    return jsonSuccess({
      appended: rowsResult.rows.length,
      spreadsheetId,
      range,
      valueInputOption: valueInput,
      insertDataOption: insertOption,
      includeUserContext
    }, { requestId })
  } catch (error) {
    console.error('[google-sheet-sync] append failed', error)
    const message = error instanceof Error ? error.message : 'Failed to append rows'
    return jsonError('APPEND_FAILED', message, { status: 502, requestId })
  }
})

type AppendParams = {
  token: string
  spreadsheetId: string
  range: string
  valueInputOption: ValueInputOption
  insertDataOption: InsertDataOption
  values: (string | number)[][]
}

type NormalizeRowsResult = { rows: (string | number)[][] }

type AuthedUser = {
  id?: string
  email?: string
  [key: string]: unknown
}

function normalizeSpreadsheetId(candidate?: string): string | null {
  const explicit = typeof candidate === 'string' ? candidate.trim() : ''
  if (explicit) return explicit
  const envValue = Deno.env.get('GOOGLE_SPREADSHEET_ID')?.trim()
  return envValue && envValue.length > 0 ? envValue : null
}

function normalizeRange(candidate?: string): string {
  if (typeof candidate === 'string' && candidate.trim().length > 0) {
    return candidate.trim()
  }
  return DEFAULT_RANGE
}

function normalizeValueInput(candidate?: ValueInputOption): ValueInputOption {
  return candidate === 'USER_ENTERED' ? 'USER_ENTERED' : DEFAULT_VALUE_INPUT
}

function normalizeInsertOption(candidate?: InsertDataOption): InsertDataOption {
  return candidate === 'OVERWRITE' ? 'OVERWRITE' : DEFAULT_INSERT_OPTION
}

function normalizeRows(
  rawRows: unknown[],
  includeUserContext: boolean,
  user: AuthedUser
): NormalizeRowsResult | Response {
  const rows: (string | number)[][] = []
  const timestamp = new Date().toISOString()

  for (let index = 0; index < rawRows.length; index++) {
    const rawRow = rawRows[index]
    if (!Array.isArray(rawRow)) {
      return jsonError(
        'INVALID_ROW',
        `Row at index ${index} must be an array of values`,
        { status: 400 }
      )
    }

    const normalized = rawRow.map(normalizeCell)
    if (includeUserContext) {
      normalized.push(user?.id ? String(user.id) : '')
      normalized.push(user?.email ? String(user.email) : '')
      normalized.push(timestamp)
    }
    rows.push(normalized)
  }

  return { rows }
}

function normalizeCell(value: unknown): string | number {
  if (value === null || value === undefined) {
    return ''
  }
  if (typeof value === 'string') {
    return value
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : String(value)
  }
  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE'
  }
  if (value instanceof Date) {
    return value.toISOString()
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch {
      return '[object]'
    }
  }
  return String(value)
}

async function appendRows(params: AppendParams): Promise<void> {
  const { token, spreadsheetId, range, valueInputOption, insertDataOption, values } = params
  const endpoint = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append`)
  endpoint.searchParams.set('valueInputOption', valueInputOption)
  endpoint.searchParams.set('insertDataOption', insertDataOption)
  endpoint.searchParams.set('includeValuesInResponse', 'false')

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ values })
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Google Sheets API returned ${response.status}: ${text}`)
  }
}
