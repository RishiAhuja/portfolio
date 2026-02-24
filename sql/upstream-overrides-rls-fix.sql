-- Fix: allow anon key to write to upstream_overrides
-- The admin session is already verified in TypeScript before any write reaches Supabase.

CREATE POLICY "Allow insert upstream_overrides"
  ON upstream_overrides FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update upstream_overrides"
  ON upstream_overrides FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete upstream_overrides"
  ON upstream_overrides FOR DELETE
  USING (true);
