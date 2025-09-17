# Phase 5 Edge APIs

This phase introduces authenticated helper endpoints so the modules (and Netlify build hooks) can call Supabase Edge Functions without re-implementing auth logic in every app.

## New Environment Variables

| Variable | Purpose |
| --- | --- |
| EDGE_ALLOWED_ORIGIN | Optional CORS override for all new Phase 5 functions (defaults to *). |

Every function reuses the shared helpers added in supabase/functions/_shared/ for consistent responses and Supabase client usage.

## Functions

### user-hub-auth
- GET /user-hub-auth/health – simple health check.
- GET /user-hub-auth – lists available routes.
- GET /user-hub-auth/me – returns the current authenticated profile (requires Authorization: Bearer <JWT>).
- POST /user-hub-auth/sign-in – accepts { email, password } and returns the Supabase session + user.
- POST /user-hub-auth/sign-out – revokes token for the current user.
- POST /user-hub-auth/refresh – refreshes the session for the current token.

### module-sync
- GET /module-sync – returns per-module submission counts scoped to the current user (Authorization required).
- GET /module-sync/<module> – lists submissions for a module, query params: limit, status, rom, 	o.
- POST /module-sync/<module> – upserts a new submission for the module, body accepts { submission_data, submission_status?, metadata? }.
- DELETE /module-sync/<module>/<id> – deletes a specific submission for the module.

### google-sheet-sync
- POST /google-sheet-sync/append (or simply POST /google-sheet-sync) – body accepts { spreadsheetId?, range?, values } where alues is an array of rows. Falls back to GOOGLE_SPREADSHEET_ID and Sheet1!A:Z if omitted.

## Usage Notes
- All authenticated endpoints expect a Supabase JWT in the Authorization header. Frontend apps should call supabase.auth.getSession() to retrieve the access token before invoking module-sync routes.
- Responses follow the standard { success, data/error, metadata } contract defined in _shared/http.ts.
- The shared helper modules (_shared/http.ts, _shared/auth.ts, _shared/supabase.ts, _shared/google.ts) centralise CORS headers, error handling, Supabase client instantiation, and Google API calls.

## Next Steps
- Deploy the functions once ready: supabase functions deploy user-hub-auth module-sync google-sheet-sync.
- Update Netlify (or other hosting) environment variables with EDGE_ALLOWED_ORIGIN if you want to lock CORS, plus the existing Supabase + Google secrets.
- Add client-side wrappers in each module as needed to consume these endpoints.
