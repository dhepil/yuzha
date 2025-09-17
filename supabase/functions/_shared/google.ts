const encoder = new TextEncoder()

interface ServiceAccount {
  client_email: string
  private_key: string
}

interface DriveUploadParams {
  token: string
  file: Uint8Array
  fileName: string
  contentType: string
  folderId: string
}

export async function getGoogleAccessToken(scopes: string[]): Promise<string> {
  const serviceAccount = getServiceAccount()
  const assertion = await createSignedJwt(serviceAccount, scopes)

  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion
  })

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Google token request failed (${response.status}): ${text}`)
  }

  const data = await response.json()
  if (!data?.access_token) {
    throw new Error('Google token response missing access_token')
  }

  return data.access_token as string
}

export async function uploadFileToDrive(params: DriveUploadParams): Promise<{ fileId: string; url: string }> {
  const metadata = {
    name: params.fileName,
    parents: [params.folderId]
  }

  const form = new FormData()
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
  form.append('file', new Blob([params.file], { type: params.contentType || 'application/octet-stream' }))

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${params.token}`
    },
    body: form
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Drive upload failed (${response.status}): ${text}`)
  }

  const data = await response.json()
  const fileId = data.id as string
  const url = `https://drive.google.com/file/d/${fileId}/view`

  return { fileId, url }
}

export async function setDriveFilePublic(token: string, fileId: string): Promise<void> {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions?supportsAllDrives=true`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ role: 'reader', type: 'anyone' })
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Failed to set drive permissions (${response.status}): ${text}`)
  }
}

export async function appendRowToSheet(token: string, spreadsheetId: string, values: (string | number | null)[]): Promise<void> {
  const body = {
    values: [values.map((value) => (value ?? '').toString())]
  }

  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:Z:append?valueInputOption=RAW`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Google Sheets append failed (${response.status}): ${text}`)
  }
}

function getServiceAccount(): ServiceAccount {
  const raw = Deno.env.get('GOOGLE_SERVICE_ACCOUNT')
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT env var is required')
  let parsed: ServiceAccount
  try {
    parsed = JSON.parse(raw)
  } catch (error) {
    throw new Error(`GOOGLE_SERVICE_ACCOUNT must be valid JSON: ${error}`)
  }

  if (!parsed.client_email || !parsed.private_key) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT missing client_email or private_key')
  }

  return parsed
}

async function createSignedJwt(serviceAccount: ServiceAccount, scopes: string[]): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = base64UrlEncodeString(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = base64UrlEncodeString(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: scopes.join(' '),
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  }))

  const unsigned = `${header}.${payload}`
  const signature = await sign(unsigned, serviceAccount.private_key)
  return `${unsigned}.${signature}`
}

async function sign(unsignedToken: string, privateKeyPem: string): Promise<string> {
  const pem = privateKeyPem.replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\r?\n/g, '')
  const binary = atob(pem)
  const buffer = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    buffer[i] = binary.charCodeAt(i)
  }

  const key = await crypto.subtle.importKey(
    'pkcs8',
    buffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256'
    },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    encoder.encode(unsignedToken)
  )

  return base64UrlEncodeBytes(new Uint8Array(signature))
}

function base64UrlEncodeString(input: string): string {
  return base64UrlEncodeBytes(new TextEncoder().encode(input))
}

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  const base64 = btoa(binary)
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

