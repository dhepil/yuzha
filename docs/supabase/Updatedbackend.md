# Updated Backend Integration Plan

This plan consolidates everything from `Backend.md` and `SUPABASE_SECRET.md` into an actionable roadmap. Each phase lists the goal, detailed steps, mandatory contracts (what must be true before moving on), and success criteria. All credentials from the sandbox project are included for convenience while you learn�rotate them if you reuse the structure for a production system.

---

## Phase 0 � Quick Reference
- **Supabase URL**: `https://xaluaekioqwxtzhnmygg.supabase.co`
- **Project Ref**: `xaluaekioqwxtzhnmygg`
- **Region**: `ap-southeast-1`
- **JWT Secret**: `Jf9Lc703++zJxFsargVFrrP/5QJZLY09ZJMNUfLGMu/UX4833s8UrMeFTH8+6qOyJeElPkJYm2WHZNf4GtCZzQ==`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbHVhZWtpb3F3eHR6aG5teWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxODQ1OTEsImV4cCI6MjA3Mjc2MDU5MX0.1-SFKaJtbuovb7vhy1cartgZveJOsMl__luyf9I3M9I`
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbHVhZWtpb3F3eHR6aG5teWdnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE4NDU5MSwiZXhwIjoyMDcyNzYwNTkxfQ.c_ZJGzWRP2FhS08_Kl-pqDTy9KO7HOKDDOUfgd_zqMY`
- **Storage (S3)**
  - Bucket: `public`
  - Access Key: `270bd43e0a08583f0af6e6d93f2c7bab`
  - Secret Key: `182186923e8b6644cb9280ab2389fe0b272f808d1ab4f7c49f42f957e4fd6f0b`
  - Endpoint: `https://xaluaekioqwxtzhnmygg.storage.supabase.co/storage/v1/s3`
- **Google Service Account**: see JSON blob in Phase 4
- **Netlify Env Vars**
  - `VITE_SUPABASE_URL=https://xaluaekioqwxtzhnmygg.supabase.co`
  - `VITE_SUPABASE_ANON_KEY=<anon key above>`
  - `VITE_SUPABASE_FUNCTIONS_BASE=https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1`

Mandatory contracts for every phase:
1. Secrets live in environment variables or `.env.local` only.
2. Service role key and Google JSON are never bundled in frontend builds.
3. Every module documents its dependency on Supabase services before coding.

---

## Phase 1 � Environment Provisioning
**Goal:** Recreate the Supabase project locally and in cloud environments.

### Steps
1. Install Supabase CLI (`npm i -g supabase`).
2. Log in: `supabase login`.
3. Set project ref: `supabase link --project-ref xaluaekioqwxtzhnmygg`.
4. Configure secrets locally:
   ```bash
   supabase secrets set \
     SUPABASE_URL='https://xaluaekioqwxtzhnmygg.supabase.co' \
     SUPABASE_SERVICE_ROLE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbHVhZWtpb3F3eHR6aG5teWdnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE4NDU5MSwiZXhwIjoyMDcyNzYwNTkxfQ.c_ZJGzWRP2FhS08_Kl-pqDTy9KO7HOKDDOUfgd_zqMY'
   ```
5. Clone repo and copy `.env.example` ? `.env.local`; populate with anon key, URL, and module-specific vars.

### Mandatory Contract
- `supabase status` returns healthy; CLI can connect.
- All secrets added to `.env.local` and `.env.example` with placeholders.

### Success Criteria
- Running `npm run dev:launcher` uses env values without manual edits.
- `createClient` in shared Supabase lib resolves URL & key from env.

---

## Phase 2 � Database & Auth Schema
**Goal:** Apply SQL schema, RLS policies, and role-based access across modules.

### Steps
1. Create SQL migration scripts (e.g., `supabase/migrations/20250917_user_hub.sql`).
2. Tables to seed (from docs):
   - `user_profiles`
   - `module_permissions`
   - `module_submissions`
   - `user_assets`
3. Apply migrations: `supabase db push` (local) then `supabase db deploy`.
4. Configure RLS policies (`USING auth.uid() = user_id` etc.) per module.
5. Seed initial data with `supabase db reset --seed` while testing.

### Mandatory Contract
- Every table has explicit RLS; no table left with default `allow all`.
- Service role key is the only credential that bypasses RLS.

### Success Criteria
- Authenticated anon key can only access its own rows.
- Service role function can list all rows (e.g., admin dashboard).

---

## Phase 3 � Application Integration (6 React Apps)
**Goal:** Wire each module to Supabase auth + its scoped APIs.

### Steps
1. Create shared Supabase client in `shared/supabase/client.ts` using `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`.
2. Implement login/session refresh in Launcher app; propagate session via context or `@supabase/auth-helpers-react`.
3. Module-specific tasks:
   - **0Setting**: CRUD on system configs (`module_permissions`).
   - **1Meng**: Submit receipts ? `module_submissions`.
   - **3Database**: Read-only analytics (service role via Edge function).
   - **4Extra** & **5Rara**: personal/time tracking tables.
4. For any service-role interaction, call Edge Functions, *not* direct JS client.

### Mandatory Contract
- No module imports the service role key.
- Frontend builds only include anon key.

### Success Criteria
- Each module loads without 401.
- Launcher hub login persists session and refreshes on page reload.

---

## Phase 4 � Storage & Google Drive Sync
**Goal:** Use Supabase Storage as ingest, sync to Google Drive via Edge Function.

### Steps
1. Buckets:
   - `user-assets` (private)
   - `public-assets` (public)
   - `temp-uploads` (private)
   Create via CLI or dashboard.
2. Configure S3 credentials for fallback access (values in Phase 0).
3. Store Google service account secret (from `SUPABASE_SECRET.md`):
   ```bash
   supabase secrets set GOOGLE_SERVICE_ACCOUNT='{
     "type":"service_account",
     "project_id":"yuzhayo",
     "private_key_id":"ebbd46a05b2d022271b9d8d8840f8e25e6967156",
     "private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCCKmqVNli8VbHI\nFPk7JUScWhhdB/2VLsTzwBMFPGsEbbQVq+BPrRXpuV7DvFC27b06UULjyUjjGuPp\nmaSQ9JTRRSRovGCqUSoJhCzNpkCM3LygyH6Q48HoGaQgR5wwgCMNwEATomokybjR\nK/B1ejAiRsC5twAmXkZERJjXlIRi5J4DU1oQN4F1bci//44wjnxBQqww3cd2wQES\niOnr9HTYcNN52mvqLqe4ZpjnRNhQIsCAL1Bylnuc0gPYAz7qBJh23eNosjUr7biC\ntmqbj6f+EamPHcdlZRSZMyre1XgKDACOellWRbsEDj82l4oFKd316DPwPwxNjf0L\nyLfGtGQZAgMBAAECggEACSxpmg38N3u3nZEC1p0EBpvf4zCUuc6TwVT8Ui5loWiE\n3FEibCMX7AKtL9DGBHphT2qaMvkE2sKSpOw32aJvGYeMrxf1nRM+yfBngu/QVU0a\nOx+eMeJnUE78Tu0VECL7tXSi329fGSwhSxaUagccPNItM3l2+H1E6PtHpUvZf6mg\n0VDSjwjEIZCWPl8vG4oZUfwI56LQzP9z7sya2ZQ6hgmuP6irtziZMQOPtVmeJU+X\nLqbAc1SCj+B1NQp8Dwe+HS/lse3nwsC2b66jou1vLq8kFhg107/NELKDWSDdJrBe\nUrcddERbeafsshPwWpIHFzt9KNMg7HJz1jq65P7ArQKBgQC2kkW1bpT4ao0MAoBr\nxJO6oqmvw21AYWpIPPa676l4Nt7Rpgc++PlRvRLjnjZseu0GS+rnTjoAQhOYfKxT\n1lzTbpUDxY/5SBwcwYZC/H0zoOk6R/kfJv626R5Xa0wDnGxFnhkHe2Uy2peMxjI9\n//65tpqUWOj4cZhuHrTTbxEiRQKBgQC2hGc0e/uDVEAKGowlnDsAzQLiT/DJmu3/\neZNBjpYOVsLkHS+eoKD+CrGaDFxA9vAAY1sBT239GYijK80GraBq7VG07VR+uaec\n0EYSceHFNdtO055SeU+VC30fLvaBGqLKt4tBET8vvhSyogW+8i2Ai5fRQ27Blq7q\naS/uR2PBxQKBgGL8qbj2LOUHeFPzo0dK/MHrYc8/SSPn7WUfULMIMD1SmrrWpwUY\nnq0Xs38gD+f/OjX4wXMJ8d6j9NXvesu15Pxp73dtDWOeGkfpEW+OUB/G9c04qrSe\nQupPOLkzHrKyg+23C2EIIVVSOWsFJsaA3s44WFVoY2AYzwmdsnMUvBh1AoGABeu5\npVw4RoRfJ3TBAx9UUqxT4Z+SQhgCjH0XJ9NGTuTFobzIpK61SkhyhnrMK1dXZcvT\nUfGPsdw4MILlPcg4If/c3K+uRAYlx9KB02taVZlvqdj3k9lXmZAr2O0fFgUVLtpR\nbCTxFc1mwny7DvywOTFOFX3IhAMtXXFYGrS6KbkCgYA1woO1HIDamIeqfPEqHx/e\nIscyxLsf7gix/xJeNh3Hn7f1AG7RK8crVB8Y0cO3/LxSR08bCeTFEmBQaUVs2tIr\ngNpU/Xs6T3ypj5yhoF1vWFVh377c7KmgQf/EV9bwvGbYfFFwe4N8812mXo52dqdX\nYp35uw6pojgfI0NFwBunsw==\n-----END PRIVATE KEY-----\n",
     "client_email":"yuzha-967@yuzhayo.iam.gserviceaccount.com",
     "client_id":"117388252118981647923",
     "auth_uri":"https://accounts.google.com/o/oauth2/auth",
     "token_uri":"https://oauth2.googleapis.com/token",
     "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
     "client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/yuzha-967%40yuzhayo.iam.gserviceaccount.com",
     "universe_domain":"googleapis.com"
   }'
   supabase secrets set GOOGLE_DRIVE_FOLDER_ID='12T5SpHRfmrDjom9HcH3LDl0J9P0oe3b5'
   supabase secrets set GOOGLE_SPREADSHEET_ID='1YBhC5jsyStO3METamY2b-JOGgU-_wd-Q_7XPUBNDZ2E'
   ```
4. Implement upload Edge Function (`storage-upload`) to push files to Drive, then clean up Supabase storage.
5. Add retry Edge Function (`storage-retry`) per docs.

### Mandatory Contract
- Edge functions only run with service role key.
- `user-assets` bucket RLS ensures only owner can read/write.

### Success Criteria
- Upload from any module appears in Google Drive folder.
- Retry endpoint clears failed uploads and logs success.

---

## Phase 5 � Edge Functions & API Gateway
**Goal:** Expose secure APIs aligned with module responsibilities.

### Steps
1. Functions required (from docs):
   - `user-hub-auth` (sign-in, profile helpers)
   - `module-sync` (per-module CRUD)
   - `storage-upload`
   - `storage-retry`
   - `google-sheet-sync` (batch append)

   Implementation details live in `.docs/supabase/EdgeAPIs.md`.
2. Deploy: `supabase functions deploy <name>`.
3. Set route guards using Supabase JWT verification.
4. Provide typed clients in `shared/services/<module>.ts`.

### Mandatory Contract
- Each function validates `Authorization` header.
- Service role key only used in server-side contexts (edge functions or Netlify serverless).

### Success Criteria
- Curl tests using anon token succeed/deny as expected.
- Netlify builds have required env vars (`SUPABASE_SERVICE_ROLE_KEY`, Google IDs) configured via dashboard.

---

## Phase 6 � CI/CD & Deployment
**Goal:** Automate build/test/deploy for all apps + Supabase functions.

### Steps
1. Netlify configuration:
   - Set env vars listed above.
   - Build command `npm run build:launcher` (and others via monorepo pipeline).
2. Configure GitHub Actions or Netlify build hook to run:
   ```bash
   npm ci
   npm run typecheck:launcher
   npm run lint # if available
   npm run build:launcher
   ```
3. Use Supabase GitHub action (optional) to deploy migrations/functions.\n\nRefer to .docs/supabase/Deployment.md for build setup, secrets, and rollback procedures.

### Mandatory Contract
- Build fails if typecheck or tests fail.
- Secrets are injected through Netlify UI, not committed.

### Success Criteria
- Push to main triggers build and deploy automatically.
- Rollback plan documented (revert release, redeploy previous migration).

---

## Phase 7 � Monitoring & Troubleshooting
**Goal:** Ensure ongoing visibility and quick recovery.

### Steps
1. Set up Supabase logs exploration; bookmark dashboard links.
2. Implement periodic `curl` health checks for each Edge function.
3. Add debug scripts:
   ```bash
   npm run dev:launcher -- --debug
   curl -H "Authorization: Bearer <token>" https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1/test-submit
   npx supabase status
   ```
4. Create weekly checklist: review `upload-status`, `module_submissions`, Supabase storage usage.\n  Additional runbooks live in .docs/supabase/Monitoring.md.

### Mandatory Contract
- On-call runbook points to this plan.
- All modules have a documented fallback if backend unreachable.

### Success Criteria
- 95%+ of uploads succeed (`summary.drive_success` metric).
- Alert triggers when `retry_count >= 3` for more than 5 files.
- Downtime drill: simulate Supabase outage, confirm launcher shows maintenance mode.

---

## Phase 8 � Future Enhancements
- v1.1: central analytics module reading aggregated Supabase views.
- v1.2: real-time collaboration using Supabase Realtime channels.
- v1.3: Audit logging + advanced RLS roles.
- v2.0: Multi-tenant schema (separate logical tenants per client).

---

## Quick Checklist
- [ ] Phase 1 � Env ready
- [ ] Phase 2 � Schema deployed
- [ ] Phase 3 � Modules wired
- [ ] Phase 4 � Storage & Drive sync working
- [ ] Phase 5 � Edge functions deployed
- [ ] Phase 6 � CI/CD live
- [ ] Phase 7 � Monitoring configured

Keep this file in sync as you implement. When moving to a real project, rotate every credential above and replace them with new ones before cloning this repo.


