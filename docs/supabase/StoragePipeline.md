# Storage & Google Drive Pipeline

This phase replaces the local upload stubs with a Supabase-first ingest flow that mirrors Netlify production.

## Database & Storage
- Migration `supabase/migrations/005_storage_buckets.sql` creates three buckets:
  - `temp-uploads` (private, service-role only)
  - `user-assets` (private per user)
  - `public-assets` (public read, service-role writes)
- Policies restrict per-user access and reserve `temp-uploads` for Edge Functions.
- Upload status tables (`upload_status`, `upload_logs`) already track retry metadata.

## Edge Functions
### `storage-upload`
- Endpoint: `https://<project>.supabase.co/functions/v1/storage-upload`
- Requires `Authorization: Bearer <Supabase session JWT>`.
- Body:
  ```json
  {
    "fileName": "report.jpg",
    "contentType": "image/jpeg",
    "data": "<base64>",
    "moduleId": "m1_meng",
    "isPublic": false
  }
  ```
- Flow:
  1. Writes the file to `temp-uploads` under `user_id/<uuid>/file`.
  2. Inserts `upload_status` row with hashed metadata.
  3. Uploads to Google Drive using the service account.
  4. Copies the object into `user-assets` or `public-assets` (and removes the temp copy) when the Drive sync succeeds.
  5. Creates a `user_assets` record and returns the Drive + bucket references.
  6. On Drive failure, leaves the blob in `temp-uploads`, marks status `drive_failed`, and logs for retries.

### `storage-retry`
- Endpoint: `.../storage-retry?action=retry|max_retries=5` (GET or POST).
- Uses the service role key only; no end-user token.
- Features:
  - Retries Google Drive sync for rows in `upload_status` with `drive_failed`.
  - Reuses `persistStorageObject` helper to promote files to the final bucket.
  - Updates `upload_status` and `upload_logs` with success/failure details.
  - `action=cleanup` removes leftover temp blobs and marks rows `cleanup_done`.
  - `action=status` returns a JSON summary of queued states.

## Environment Variables
Set these in `.env.local`, Supabase secrets, and Netlify:
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (existing)
- `GOOGLE_SERVICE_ACCOUNT` – JSON blob from Phase 4 doc
- `GOOGLE_DRIVE_FOLDER_ID`
- `GOOGLE_SPREADSHEET_ID` (optional; the function logs a warning if omitted)

## Deploy Steps
1. Apply migrations: `supabase db push` (local) and `supabase db deploy` (remote).
2. Deploy functions: `supabase functions deploy storage-upload storage-retry`.
3. After updating secrets, run a test upload via `storage-upload`; confirm `upload_status` row moves to `cleanup_done` and the file appears in Drive.
4. Schedule `storage-retry?action=retry` (Cron / manual) to sweep failures and `storage-retry?action=cleanup` to prune temp blobs.

## Frontend Consumption
- Modules call `storage-upload` with user JWT; the function enforces passkey/session auth.
- For public assets, clients can read directly from Supabase public URL or the returned Drive link.
- For private assets, use Supabase signed URLs or the Drive URL restricted to those with the link.
