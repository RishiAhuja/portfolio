-- Security lockdown: remove open write access for anon/publishable key
-- Run this in Supabase SQL Editor AFTER deploying the server-side API changes.
--
-- Order:
-- 1. Deploy code + set SUPABASE_SECRET_KEY on Vercel
-- 2. Run this SQL
-- 3. Test admin panel + public site

-- ─── Gallery ───────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Admins can manage collections" ON gallery_collections;
DROP POLICY IF EXISTS "Admins can manage images" ON gallery_images;

-- Keep public read (recreate if missing)
DROP POLICY IF EXISTS "Public can view collections" ON gallery_collections;
CREATE POLICY "Public can view collections"
  ON gallery_collections FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can view images" ON gallery_images;
CREATE POLICY "Public can view images"
  ON gallery_images FOR SELECT
  USING (true);

-- ─── Side quests ───────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Allow side quest management" ON side_quests;
DROP POLICY IF EXISTS "Allow side quest history creation" ON side_quests_history;

DROP POLICY IF EXISTS "Public can read side quests" ON side_quests;
CREATE POLICY "Public can read side quests"
  ON side_quests FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can read side quests history" ON side_quests_history;
CREATE POLICY "Public can read side quests history"
  ON side_quests_history FOR SELECT
  USING (true);

-- ─── Bootcamp lectures ─────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Allow bootcamp lecture management" ON bootcamp_lectures;

DROP POLICY IF EXISTS "Public can read published bootcamp lectures" ON bootcamp_lectures;
CREATE POLICY "Public can read published bootcamp lectures"
  ON bootcamp_lectures FOR SELECT
  USING (is_published = true);

-- ─── Bootcamp students ─────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Allow bootcamp student management" ON bootcamp_students;

DROP POLICY IF EXISTS "Public can read approved bootcamp students" ON bootcamp_students;
CREATE POLICY "Public can read approved bootcamp students"
  ON bootcamp_students FOR SELECT
  USING (status = 'approved');

-- Public form: insert pending requests only (server route /api/bootcamp-students/submit-request)
CREATE POLICY "Public can submit bootcamp requests"
  ON bootcamp_students FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');

-- ─── Upstream overrides ────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Allow insert upstream_overrides" ON upstream_overrides;
DROP POLICY IF EXISTS "Allow update upstream_overrides" ON upstream_overrides;
DROP POLICY IF EXISTS "Allow delete upstream_overrides" ON upstream_overrides;

DROP POLICY IF EXISTS "Public read upstream_overrides" ON upstream_overrides;
CREATE POLICY "Public read upstream_overrides"
  ON upstream_overrides FOR SELECT
  USING (true);

-- ─── Uncompiled / admin tables (should already be service_role only) ───────

-- uncompiled_entries: published read for public
DROP POLICY IF EXISTS "Public can read published entries" ON uncompiled_entries;
CREATE POLICY "Public can read published entries"
  ON uncompiled_entries FOR SELECT
  USING (published = true);

-- Writes stay service_role only (no anon write policies added)

-- admin_users / admin_sessions: service_role only (login now runs on server)

-- verify_admin_session() remains SECURITY DEFINER — anon can still validate tokens
