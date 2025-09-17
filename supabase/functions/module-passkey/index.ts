// @ts-nocheck
/// <reference path='../_shared/deno-shim.d.ts' />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { timingSafeEqual } from "https://deno.land/std@0.168.0/crypto/timing_safe_equal.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? ""
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
const passkeySecret = Deno.env.get("MODULE_PASSKEY_SECRET") ?? ""
const allowedOrigin = Deno.env.get("MODULE_PASSKEY_ALLOWED_ORIGIN") ?? "*"

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is not configured")
}

if (!serviceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured")
}

if (!passkeySecret) {
  throw new Error("MODULE_PASSKEY_SECRET is not configured")
}

const supabase = createClient(supabaseUrl, serviceRoleKey)
const encoder = new TextEncoder()

const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

function hexToUint8Array(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new Error("Invalid hex string")
  }
  const out = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    out[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return out
}

async function deriveHash(passkey: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(passkeySecret),
    {
      name: "HMAC",
      hash: "SHA-256"
    },
    false,
    ["sign"]
  )

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(passkey.trim())
  )

  return bufferToHex(signature)
}

function jsonResponse(body: Record<string, unknown>, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    },
    ...init
  })
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, { status: 405 })
  }

  try {
    const { moduleId, passkey } = await req.json()

    if (typeof moduleId !== "string" || moduleId.trim().length === 0) {
      return jsonResponse({ error: "moduleId is required" }, { status: 400 })
    }

    if (typeof passkey !== "string" || passkey.trim().length === 0) {
      return jsonResponse({ error: "passkey is required" }, { status: 400 })
    }

    const normalizedModuleId = moduleId.trim()
    const normalizedPasskey = passkey.trim()

    const { data, error: selectError } = await supabase
      .from("module_passwords")
      .select("passkey_hash, hash_algorithm")
      .eq("module_id", normalizedModuleId)
      .maybeSingle()

    if (selectError) {
      console.error("[module-passkey] Failed to load module", selectError)
      return jsonResponse({ error: "Failed to validate passkey" }, { status: 500 })
    }

    if (!data) {
      return jsonResponse({ error: "Module not configured" }, { status: 404 })
    }

    if (data.hash_algorithm !== "HS256") {
      console.error("[module-passkey] Unsupported hash algorithm", data.hash_algorithm)
      return jsonResponse({ error: "Unsupported hash algorithm" }, { status: 500 })
    }

    const computed = await deriveHash(normalizedPasskey)
    const expected = data.passkey_hash

    const computedBytes = hexToUint8Array(computed)
    const expectedBytes = hexToUint8Array(expected)

    if (computedBytes.length !== expectedBytes.length || !timingSafeEqual(computedBytes, expectedBytes)) {
      return jsonResponse({ error: "Invalid passkey" }, { status: 401 })
    }

    return jsonResponse({ valid: true })
  } catch (error) {
    console.error("[module-passkey] Unexpected error", error)
    return jsonResponse({ error: "Internal server error" }, { status: 500 })
  }
})
