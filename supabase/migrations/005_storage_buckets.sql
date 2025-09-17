-- Phase 4 storage buckets and policies
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('user-assets', 'user-assets', false),
  ('public-assets', 'public-assets', true),
  ('temp-uploads', 'temp-uploads', false)
ON CONFLICT (id) DO NOTHING;

-- User assets policies: users manage objects under their user-id folder
DROP POLICY IF EXISTS "storage_user_assets_select" ON storage.objects;
DROP POLICY IF EXISTS "storage_user_assets_insert" ON storage.objects;
DROP POLICY IF EXISTS "storage_user_assets_update" ON storage.objects;
DROP POLICY IF EXISTS "storage_user_assets_delete" ON storage.objects;

CREATE POLICY "storage_user_assets_select"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'user-assets'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR auth.jwt() ->> 'role' = 'service_role'
    )
  );

CREATE POLICY "storage_user_assets_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-assets'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR auth.jwt() ->> 'role' = 'service_role'
    )
  );

CREATE POLICY "storage_user_assets_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'user-assets'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR auth.jwt() ->> 'role' = 'service_role'
    )
  )
  WITH CHECK (
    bucket_id = 'user-assets'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR auth.jwt() ->> 'role' = 'service_role'
    )
  );

CREATE POLICY "storage_user_assets_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'user-assets'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR auth.jwt() ->> 'role' = 'service_role'
    )
  );

-- Temp uploads: only service role may access
DROP POLICY IF EXISTS "storage_temp_uploads_service" ON storage.objects;
CREATE POLICY "storage_temp_uploads_service"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'temp-uploads'
    AND auth.jwt() ->> 'role' = 'service_role'
  )
  WITH CHECK (
    bucket_id = 'temp-uploads'
    AND auth.jwt() ->> 'role' = 'service_role'
  );

-- Public assets: anyone can read, service role manages writes
DROP POLICY IF EXISTS "storage_public_assets_select" ON storage.objects;
DROP POLICY IF EXISTS "storage_public_assets_write" ON storage.objects;

CREATE POLICY "storage_public_assets_select"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'public-assets');

CREATE POLICY "storage_public_assets_write"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'public-assets'
    AND auth.jwt() ->> 'role' = 'service_role'
  )
  WITH CHECK (
    bucket_id = 'public-assets'
    AND auth.jwt() ->> 'role' = 'service_role'
  );
