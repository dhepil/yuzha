# Module Passkeys

This document explains how module passkeys are managed now that the credentials live inside Supabase instead of `modulePasswords.json`.

## Database state

- Table: `public.module_passwords`
  - `module_id` (text, primary key)
  - `passkey_hash` (hex HMAC digest)
  - `hash_algorithm` (currently `HS256` only)
  - `passkey_hint` (optional admin-only hint)
  - `created_at`, `updated_at`
- Row Level Security is enabled, so only the service role (or edge functions using it) can read/write.

## Secrets and environment

Set the following variables for any environment (local CLI, Netlify deploys, Supabase Edge Functions):

| Variable | Purpose |
| --- | --- |
| `MODULE_PASSKEY_SECRET` | Shared HMAC secret used to hash passkeys. Must be identical for the seed script and the edge function. |
| `SUPABASE_SERVICE_ROLE_KEY` | Required by the seed script and the edge function to upsert/query the table. Keep it private. |
| `SUPABASE_URL` | Your Supabase project URL. |
| `MODULE_PASSKEY_ALLOWED_ORIGIN` | Optional; override the CORS origin for the validation edge function (defaults to `*`). |

For local work, add the secrets to `.env.local`. For Netlify, add them as environment variables on the site along with the existing Supabase keys.

## Seeding / syncing passkeys

1. Maintain the desired passkeys in `supabase/modulePasswords.json` (git-ignored). You can keep strings or `{ "passkey": "...", "hint": "..." }` objects.
2. Ensure your shell exports `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `MODULE_PASSKEY_SECRET` (the script also auto-loads `.env` / `.env.local` if present).
3. Run `npm run seed:module-passkeys` to upsert each configured passkey into the database.
4. Optional: run the same command with `--prune` to remove database rows for modules that are no longer listed in the JSON file.

## Runtime validation flow

- The frontend calls the Supabase Edge Function `module-passkey` before attempting Supabase Auth login.
- The edge function hashes the submitted passkey with `MODULE_PASSKEY_SECRET` and compares it with the stored digest.
- On success, the existing passkey-based Supabase Auth flow continues; on failure the user receives a friendly error message without leaking the configured passkey.

## Netlify deploy checklist

- Make sure the Netlify environment defines: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `MODULE_PASSKEY_SECRET`, and (optionally) `MODULE_PASSKEY_ALLOWED_ORIGIN`.
- Re-run `npm run seed:module-passkeys` whenever passkeys change so the Supabase table stays in sync.
- No need to ship `modulePasswords.json` in the repository or the build output.
