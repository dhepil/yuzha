# CI/CD & Deployment

This phase automates the checks that run when you push to main and captures the manual steps needed to ship to Netlify/Supabase.

## Netlify Build

- **Build command**: 
pm run build:launcher
- **Publish directory**: pps/Launcher/dist
- **Environment variables** (set via Netlify UI, never committed):
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
  - EDGE_ALLOWED_ORIGIN (optional CORS tightening)

Re-run 
pm run seed:module-passkeys and deploy Supabase functions whenever secrets change.

## GitHub Actions (CI)

The workflow in .github/workflows/ci.yml runs on pushes and pull requests to main:
1. 
pm ci
2. 
pm run ci:verify
   - 
pm run typecheck:all (currently the Launcher build)
   - 
pm run build:launcher

Extend ci:verify if you add more module builds or tests.

## Supabase Functions

Deployment remains manual to avoid pushing secrets into CI:
`ash
supabase functions deploy user-hub-auth module-sync google-sheet-sync storage-upload storage-retry
`
Apply database changes with supabase db push before deploying functions.

## Rollback Plan

1. **Frontend**: revert the offending commit (git revert <sha>), push to main, let Netlify rebuild.
2. **Functions**: redeploy the previous function version (supabase functions deploy <name> --project-ref <ref> with the last known good tag).
3. **Database**: use supabase db remote commit --rollback or manually apply the previous migration.

Keep the latest successful Netlify deploy bookmarked to make rollbacks quick.
