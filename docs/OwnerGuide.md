# Owner Guide (Sandbox)

Follow these steps whenever you deploy or refresh the backend. The guide assumes no prior experience—just move down the checklist. Keep this file outside of git because it references secrets.

---

## 0. Prerequisites

1. **Install tools**
   - Node.js 20 or newer (`node -v` should show 20.x)
   - Supabase CLI: `npm install -g supabase`
2. **Open a terminal** inside the project folder (`c:\VSCODE\yuzha`).

---

## 1. Gather Secrets

You need the following values before touching dashboards:

| Category | Secrets |
| --- | --- |
| Supabase | Project URL, Anon Key, Service Role Key, JWT secret |
| Google Service Account | Full JSON file, Drive Folder ID, Spreadsheet ID |
| Passkeys | `MODULE_PASSKEY_SECRET`, `supabase/modulePasswords.json` |

Store everything in a password manager. Never commit secrets.

---

## 2. Set Local Environment

1. Copy or create `.env.local` at the project root.
2. Paste and customize:
   ```bash
   SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   MODULE_PASSKEY_SECRET=your-hmac-secret
   GOOGLE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"...","private_key":"-----BEGIN PRIVATE KEY-----..."}'
   GOOGLE_DRIVE_FOLDER_ID=your-drive-folder-id
   GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
   SUPABASE_FUNCTIONS_BASE=https://YOUR_PROJECT.supabase.co/functions/v1
   ```
3. Save the file (remember: `.env.local` stays out of git).

---

## 3. Push Database Migrations

1. In the terminal:
   ```bash
   supabase login                     # opens a browser; follow the prompts
   supabase link --project-ref YOUR_PROJECT_REF
   supabase db push
   ```
2. Confirm in the Supabase dashboard (app.supabase.com ? project):
   - `module_passwords`, `upload_status`, `upload_logs`, etc., exist.
   - Storage buckets `user-assets`, `public-assets`, `temp-uploads` exist under Storage.

---

## 4. Deploy Edge Functions

1. Run the deploy command:
   ```bash
   supabase functions deploy \
     user-hub-auth module-sync module-passkey \
     storage-upload storage-retry google-sheet-sync \
     test-submit user-hub
   ```
2. Check Supabase dashboard ? Edge Functions ? each function should show the latest deployment timestamp.

---

## 5. Seed Passkeys

1. Update `supabase/modulePasswords.json` (git-ignored) with the passkeys you want.
2. Run:
   ```bash
   npm run seed:module-passkeys
   ```
3. Verify data: Supabase dashboard ? Table editor ? `module_passwords` contains entries.

---

## 6. Configure Netlify

1. Netlify dashboard ? select your site.
2. **Site settings ? Build & deploy ? Continuous Deployment**
   - Build command: `npm run build:launcher`
   - Publish directory: `apps/Launcher/dist`
3. **Site settings ? Build & deploy ? Environment ? Edit variables**
   Add these variables (exact names):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_FUNCTIONS_BASE`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_ANON_KEY`
   - `MODULE_PASSKEY_SECRET`
   - `GOOGLE_SERVICE_ACCOUNT`
   - `GOOGLE_DRIVE_FOLDER_ID`
   - `GOOGLE_SPREADSHEET_ID`
   - `EDGE_ALLOWED_ORIGIN` (optional; e.g., `https://your-site.netlify.app`)
4. Go to **Deploys** ? click “Trigger deploy” to rebuild with new secrets.

---

## 7. Health Checks

1. Set the same environment variables in your terminal session (or use `.env.local`).
2. Run:
   ```bash
   npm run health:check
   ```
   - All targets should print “ok”.
3. Manual spot checks (replace URLs/tokens):
   ```bash
   curl "https://YOUR_PROJECT.supabase.co/functions/v1/user-hub-auth/health"
   curl -H "Authorization: Bearer YOUR_JWT" "https://YOUR_PROJECT.supabase.co/functions/v1/module-sync"
   ```

---

## 8. Monitoring & Alerts

- Schedule `npm run health:check` via cron, GitHub Actions, or Netlify Background Functions.
- Enable Netlify deploy failure emails/Slack notifications.
- In Supabase dashboard ? Settings ? Notifications, set alerts for function failures (if available).
- Google Cloud Console ? monitor Sheets/Drive API quotas.

Routine weekly checklist:
1. `npm run health:check`
2. Review Supabase `upload_status` for rows stuck in `drive_failed`.
3. Check Netlify deploy logs.
4. Confirm storage usage and quotas.

Alert triggers:
- More than one consecutive health check failure.
- `drive_failed` records > 5 for 3+ hours.
- Netlify deploy failure on main.

Incident response:
1. Re-run `npm run health:check` with `NODE_DEBUG=fetch` for verbose output.
2. Check Supabase function logs.
3. Roll back using the steps in the deployment section.
4. Document the issue and fix in your notes or issue tracker.

---

## 9. CI/CD

- GitHub Actions workflow `.github/workflows/ci.yml` runs on push/PR to `main`:
  1. `npm ci`
  2. `npm run ci:verify` (typecheck + production build)
- If you add more module builds or tests, extend `ci:verify` accordingly.

Rollback plan:
1. **Frontend** – `git revert <sha>` on main, push, wait for Netlify auto deploy.
2. **Functions** – redeploy the previous version (`supabase functions deploy <name> --project-ref <ref>`).
3. **Database** – run `supabase db remote commit --rollback` or apply the previous migration manually.

Bookmark the latest successful Netlify deploy so you can restore it quickly.

---

## 10. Reference Commands

```bash
# Supabase CLI
supabase login
supabase link --project-ref <project_ref>
supabase db push
supabase functions deploy <function>

# Seed passkeys
npm run seed:module-passkeys

# Health check
npm run health:check
```

Stay organized: after each deployment, update this guide if the process changes.
