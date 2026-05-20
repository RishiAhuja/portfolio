-- Optional clean storage for CAISc cluster progress.
-- The live implementation currently stores snapshots in upstream_overrides to
-- avoid requiring an immediate database migration. Use this table if you want
-- dedicated storage later.

CREATE TABLE IF NOT EXISTS cluster_progress_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL DEFAULT 'cluster',
  host TEXT,
  generated_at TIMESTAMPTZ,
  done INTEGER,
  total INTEGER,
  percent NUMERIC,
  running INTEGER,
  held INTEGER,
  queued INTEGER,
  eta_label TEXT,
  eta_note TEXT,
  progress_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE cluster_progress_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow cluster progress reads"
  ON cluster_progress_snapshots FOR SELECT
  USING (true);

CREATE POLICY "Allow cluster progress writes"
  ON cluster_progress_snapshots FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_cluster_progress_created_at
  ON cluster_progress_snapshots(created_at DESC);
