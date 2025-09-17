# Owner Runbook: Deployment & Secrets

Some steps require access to external dashboards or secrets stores. Keep this document outside source control if you add credentials.

## 1. Netlify Configuration

- **Site dashboard** ? *Site settings ? Build & deploy ? Continuous Deployment*.
  - Build command: 
pm run build:launcher
  - Publish directory: pps/Launcher/dist
- **Environment variables** (Site settings ? Build & deploy ? Environment ? Edit variables):
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY
  - VITE_SUPABASE_FUNCTIONS_BASE
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
  - SUPABASE_ANON_KEY
  - MODULE_PASSKEY_SECRET
  - GOOGLE_SERVICE_ACCOUNT
  - GOOGLE_DRIVE_FOLDER_ID
  - GOOGLE_SPREADSHEET_ID
  - EDGE_ALLOWED_ORIGIN *(optional for tighter CORS)*
- Trigger manual deploys from the Deploys tab when creds change.

## 2. Supabase Dashboard Tasks

- Visit **app.supabase.com** ? project xaluaekioqwxtzhnmygg.
- **Database ? Migrations**: run supabase db push locally, then confirm schema matches.
- **Edge Functions**: run supabase functions deploy <name> or use the dashboard deploy tab for:
  - user-hub-auth, module-sync, storage-upload, storage-retry, google-sheet-sync, module-passkey.
- **Storage ? Buckets**: verify user-assets, public-assets, 	emp-uploads exist with proper policies.
- **Logs**: bookmark Function logs for quick debugging; set log retention alerts if needed.

## 3. Secrets & Secure Storage

- Maintain production secrets in a password manager or vault (1Password, Bitwarden, etc.). Minimum list:
  - Supabase URL, anon key, service role key, JWT secret.
  - Netlify deploy tokens (if any).
  - Google service account JSON, Drive folder ID, Sheets ID.
  - Module passkey source (JSON) + HMAC secret.
- Update .env.local for local testing but never commit it.

## 4. Monitoring & Alerts

- Schedule 
pm run health:check via cron or external scheduler (GitHub Actions, Netlify background) with required env vars.
- Integrate alerts:
  - Netlify deploy failure emails / Slack.
  - Supabase function error webhooks (Settings ? Notifications).
  - Google Sheets API quotas (Cloud Console) if limits approached.
- Document incidents and fixes after any outage.

Keep this runbook updated as infrastructure changes.
