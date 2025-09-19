# Owner Runbook: Deployment & Settings

With Supabase removed, the stack is now static (Netlify-hosted) plus browser storage. Use this runbook to keep deployments reproducible.

## 1. Netlify Configuration

- **Site settings → Build & deploy → Continuous Deployment**
  - Build command: `npm run build:launcher`
  - Publish directory: `apps/Launcher/dist`
- **Environment variables**
  - No mandatory secrets remain. Remove old Supabase keys if they still exist.
  - Add new `VITE_*` variables only when a feature requires them.
- Trigger a deploy from the **Deploys** tab after editing settings.

## 2. Storage & Data Reset

- Application state is stored client-side under the key `yuzha:local-data`.
- To reset production data, publish a notice for users to clear their browser storage (or ship a new build that clears it programmatically).
- For development/testing, clear storage via DevTools → Application → Storage.

## 3. Secrets Inventory

- Current stack does not require remote secrets.
- If future features introduce external APIs, document the new keys here and in `.env.local` (kept out of git).

## 4. Operational Checklist

- After each deploy:
  1. Open the Launcher and load each module; ensure UI renders and mock logins work.
  2. Add a sample record in 1Meng or 4Extra; confirm 3Database reflects the change.
  3. Sign out and back in to verify session cleanup.
- Optional automated check: use Playwright or Cypress to script the flow above.

Keep this runbook updated whenever infrastructure or deployment steps change.
