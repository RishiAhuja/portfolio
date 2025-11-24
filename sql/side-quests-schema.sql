-- Create side_quests table for gym stats
CREATE TABLE IF NOT EXISTS side_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value INTEGER NOT NULL,
  max_value INTEGER NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create side_quests_history table for tracking changes
CREATE TABLE IF NOT EXISTS side_quests_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  side_quest_id UUID REFERENCES side_quests(id) ON DELETE CASCADE,
  value INTEGER NOT NULL,
  max_value INTEGER NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE side_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE side_quests_history ENABLE ROW LEVEL SECURITY;

-- Public can read side quests
CREATE POLICY "Public can read side quests"
  ON side_quests FOR SELECT
  USING (true);

-- Public can read history
CREATE POLICY "Public can read side quests history"
  ON side_quests_history FOR SELECT
  USING (true);

-- Allow authenticated users to manage side quests
CREATE POLICY "Allow side quest management"
  ON side_quests FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to create history entries
CREATE POLICY "Allow side quest history creation"
  ON side_quests_history FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Insert initial data
INSERT INTO side_quests (label, value, max_value, sort_order) VALUES
  ('Bench', 45, 100, 1),
  ('Squat', 45, 100, 2),
  ('Leg Press', 130, 200, 3),
  ('Shoulder', 30, 80, 4),
  ('Curl', 25, 60, 5)
ON CONFLICT DO NOTHING;

-- Create index for ordering
CREATE INDEX idx_side_quests_sort ON side_quests(sort_order);
CREATE INDEX idx_side_quests_history_quest_id ON side_quests_history(side_quest_id);
CREATE INDEX idx_side_quests_history_recorded_at ON side_quests_history(recorded_at);

-- Function to get all side quests
CREATE OR REPLACE FUNCTION get_side_quests()
RETURNS TABLE (
  id UUID,
  label TEXT,
  value INTEGER,
  max_value INTEGER,
  sort_order INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sq.id,
    sq.label,
    sq.value,
    sq.max_value,
    sq.sort_order
  FROM side_quests sq
  ORDER BY sq.sort_order ASC;
END;
$$;

-- Function to get side quest history for a specific quest
CREATE OR REPLACE FUNCTION get_side_quest_history(p_side_quest_id UUID)
RETURNS TABLE (
  value INTEGER,
  max_value INTEGER,
  recorded_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sqh.value,
    sqh.max_value,
    sqh.recorded_at
  FROM side_quests_history sqh
  WHERE sqh.side_quest_id = p_side_quest_id
  ORDER BY sqh.recorded_at ASC;
END;
$$;

-- Function to get all side quests with their latest history
CREATE OR REPLACE FUNCTION get_side_quests_with_history()
RETURNS TABLE (
  id UUID,
  label TEXT,
  value INTEGER,
  max_value INTEGER,
  sort_order INTEGER,
  history JSON
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sq.id,
    sq.label,
    sq.value,
    sq.max_value,
    sq.sort_order,
    COALESCE(
      (
        SELECT json_agg(
          json_build_object(
            'value', sqh.value,
            'max_value', sqh.max_value,
            'recorded_at', sqh.recorded_at
          )
          ORDER BY sqh.recorded_at ASC
        )
        FROM side_quests_history sqh
        WHERE sqh.side_quest_id = sq.id
      ),
      '[]'::json
    ) as history
  FROM side_quests sq
  ORDER BY sq.sort_order ASC;
END;
$$;

