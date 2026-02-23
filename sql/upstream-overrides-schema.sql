-- Upstream PR/Issue overrides
-- Allows manually controlling visibility, state label, and title for each GitHub item

CREATE TABLE IF NOT EXISTS upstream_overrides (
  id             uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  pr_url         text        UNIQUE NOT NULL,          -- html_url from GitHub, used as stable key
  item_type      text        NOT NULL CHECK (item_type IN ('pr', 'issue')),
  visible        boolean     NOT NULL DEFAULT true,    -- hide from public portfolio when false
  state_override text        CHECK (state_override IN ('open', 'closed', 'merged')),
  title_override text,                                 -- replaces the GitHub title when set
  notes          text,                                 -- internal admin notes, never shown publicly
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_upstream_overrides_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_upstream_overrides_updated_at ON upstream_overrides;
CREATE TRIGGER trg_upstream_overrides_updated_at
  BEFORE UPDATE ON upstream_overrides
  FOR EACH ROW EXECUTE FUNCTION update_upstream_overrides_updated_at();

-- RLS: public read-only (portfolio frontend reads without auth)
ALTER TABLE upstream_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read upstream_overrides"
  ON upstream_overrides FOR SELECT
  USING (true);

-- No public insert/update/delete — admin writes directly through service role via supabase client
