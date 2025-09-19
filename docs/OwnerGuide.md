# Owner Guide (Sandbox)

Supabase integration has been fully removed. All module data now lives inside the browser (Local Storage + Session Storage). Use this quick reference to run, reset, and deploy the sandbox apps.

---

## 1. Prerequisites

1. Install **Node.js 20+** (`node -v` should show `20.x`).
2. Optional: install **pnpm** or **npm** (already included with Node). No Supabase CLI is required anymore.

---

## 2. Local Environment

1. Copy `.env.local.example` (or reuse `.env.local`). The file may stay empty unless you add custom variables.
2. Start any app with the workspace scripts, for example:
   ```bash
   npm run dev:launcher
   npm run dev:0setting
   ```
3. Data is persisted per browser profile. To reset everything, clear the **Local Storage** and **Session Storage** for the app origin (see DevTools → Application → Storage).

---

## 3. Authentication & Passkeys

- Passkey prompts still exist, but they are now local only:
  - The first passkey you enter during a browser session unlocks the module.
  - The passkey is stored in `sessionStorage` and cleared on sign-out or tab close.
  - No remote validation happens.
- To revoke local sessions globally, clear the browser storage (or use the “Keluar” button inside each module).

---

## 4. Data Model (Local Storage)

- The store lives under the key `yuzha:local-data`.
- Structure:
  - `module_submissions`: entries written by 1Meng, 4Extra, 5Rara, and read by 3Database.
  - `user_configs`: entries written by 0Setting.
- A manual backup/restore can be done by exporting/importing that key through the browser DevTools.

---

## 5. Deployment

Nothing changes for Netlify except the secrets list:

| Setting | Value |
| --- | --- |
| Build command | `npm run build:launcher` |
| Publish directory | `apps/Launcher/dist` |
| Environment variables | No Supabase keys required. Add your own `VITE_*` variables if needed. |

If you previously stored Supabase keys in Netlify, they can now be removed for safety.

---

## 6. Health Checks & Monitoring

- Because the backend is now purely local, there are no server health checks.
- Recommended checks after deploying:
  1. Open each module and ensure the UI loads without errors.
  2. Add a dummy record (e.g., in 1Meng or 4Extra) and switch modules to confirm the database overview updates.
  3. Sign out and sign in again to verify session clearing.

---

## 7. Troubleshooting

| Issue | Fix |
| --- | --- |
| Data not syncing between modules | Refresh the page or clear browser storage to reset the local cache. |
| Passkey rejected unexpectedly | Clear session storage and try again; remember passkeys are per-browser-session now. |
| Build failing on CI | Run `npm install` and `npm run build:launcher` locally to capture errors. |

---

## 8. Reference Commands

```bash
# Install dependencies
yarn install   # or: npm install

# Development
npm run dev:launcher
npm run dev:0setting

# Production build
npm run build:launcher
```

Update this guide whenever you introduce new shared data or environment variables.
