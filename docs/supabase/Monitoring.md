# Monitoring & Troubleshooting

Phase 7 focuses on quick validation and recovery.

## Health Checks

- 
pm run health:check – verifies core edge endpoints respond (requires SUPABASE_URL, SUPABASE_ANON_KEY, optionally SUPABASE_SERVICE_ROLE_KEY, SUPABASE_FUNCTIONS_BASE).
- Manual quick checks:
  - curl "/functions/v1/user-hub-auth/health"
  - curl -H "Authorization: Bearer <token>" "/module-sync".

## Logs & Dashboards

- Supabase Dashboard ? **Logs** ? filter by function (module-sync, user-hub-auth, etc.).
- Netlify Deploys ? check latest deploy logs for build failures.
- Google Cloud Console (if Sheets/Drive errors) via service-account project.

## Routine Checklist (suggested weekly)
1. 
pm run health:check
2. Review Supabase upload_status for stuck retries (drive_failed).
3. Inspect Netlify analytics for build times and deploy failures.
4. Confirm Supabase storage usage and quotas.
5. Export recent logs (supabase logs functions) if anomalies detected.

## Alert Triggers
- Multiple consecutive health-check failures.
- drive_failed records > 5 for three hours.
- Netlify deploy failure on main branch.

## Incident Response
1. Re-run 
pm run health:check with NODE_DEBUG=fetch to gather details.
2. Check Supabase function logs.
3. Roll back frontend/function per .docs/supabase/Deployment.md if necessary.
4. Document incident summary and fix in repo notes or issue tracker.
