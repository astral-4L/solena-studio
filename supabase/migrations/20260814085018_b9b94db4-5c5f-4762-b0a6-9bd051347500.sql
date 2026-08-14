-- 1. Validate analytics inserts
ALTER TABLE public.page_views
  ADD CONSTRAINT page_views_path_valid CHECK (path LIKE '/%' AND char_length(path) <= 300),
  ADD CONSTRAINT page_views_referrer_len CHECK (referrer IS NULL OR char_length(referrer) <= 500),
  ADD CONSTRAINT page_views_user_agent_len CHECK (user_agent IS NULL OR char_length(user_agent) <= 500),
  ADD CONSTRAINT page_views_session_len CHECK (session_id IS NULL OR char_length(session_id) <= 64),
  ADD CONSTRAINT page_views_country_len CHECK (country IS NULL OR char_length(country) <= 64),
  ADD CONSTRAINT page_views_device_valid CHECK (device IS NULL OR device IN ('mobile','tablet','desktop','unknown'));

DROP POLICY IF EXISTS "Anyone can log pageview" ON public.page_views;

CREATE POLICY "Anyone can log a valid pageview"
ON public.page_views
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(path) BETWEEN 1 AND 300
  AND path LIKE '/%'
  AND (referrer IS NULL OR char_length(referrer) <= 500)
  AND (user_agent IS NULL OR char_length(user_agent) <= 500)
  AND (session_id IS NULL OR char_length(session_id) <= 64)
  AND (device IS NULL OR device IN ('mobile','tablet','desktop','unknown'))
  AND created_at IS NOT NULL
);

-- 2. Lock down storage objects for the media bucket
DROP POLICY IF EXISTS "Public read solena media" ON storage.objects;
DROP POLICY IF EXISTS "Staff upload solena media" ON storage.objects;
DROP POLICY IF EXISTS "Staff update solena media" ON storage.objects;
DROP POLICY IF EXISTS "Staff delete solena media" ON storage.objects;

CREATE POLICY "Public read solena media"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'solena-media');

CREATE POLICY "Staff upload solena media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'solena-media'
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
);

CREATE POLICY "Staff update solena media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'solena-media'
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
)
WITH CHECK (
  bucket_id = 'solena-media'
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
);

CREATE POLICY "Staff delete solena media"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'solena-media'
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
);