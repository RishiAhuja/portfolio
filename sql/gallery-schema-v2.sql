-- Gallery Schema V2 - Simplified month/year based collections
-- Migration from event-based to time-based collections

-- IMPORTANT: Back up your data before running this!
-- Step 1: Drop old tables and start fresh
DROP TABLE IF EXISTS timeline_gallery_links CASCADE;
DROP TABLE IF EXISTS gallery_images CASCADE;
DROP TABLE IF EXISTS gallery_events CASCADE;

-- Step 2: Drop old functions if they exist
DROP FUNCTION IF EXISTS get_gallery_events_with_counts() CASCADE;
DROP FUNCTION IF EXISTS get_gallery_event_with_images(TEXT) CASCADE;
DROP FUNCTION IF EXISTS get_featured_gallery_events() CASCADE;
DROP FUNCTION IF EXISTS get_gallery_events_by_category(TEXT) CASCADE;

-- Collections table (replaces gallery_events)
-- Collections are identified by slug: "2023", "2024", "jan-2025", "feb-2025", etc.
CREATE TABLE gallery_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, -- "2023", "2024", "jan-2025", "feb-2025", etc.
  year INTEGER NOT NULL, -- 2023, 2024, 2025
  month INTEGER, -- NULL for year-only collections, 1-12 for monthly
  display_name TEXT NOT NULL, -- "2023", "January 2025", etc.
  image_count INTEGER DEFAULT 0, -- Cached count for performance
  cover_image_url TEXT, -- First or featured image from collection
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Images table (simplified)
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES gallery_collections(id) ON DELETE CASCADE,
  captured_date DATE NOT NULL, -- Actual date photo was taken
  description TEXT, -- Optional caption
  r2_key TEXT NOT NULL, -- Path in R2 bucket
  r2_url TEXT NOT NULL, -- Full public URL from R2
  thumbnail_url TEXT,
  file_size INTEGER,
  width INTEGER,
  height INTEGER,
  mime_type TEXT,
  is_cover BOOLEAN DEFAULT false, -- Featured image for the collection
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_collections_year_month ON gallery_collections(year DESC, month DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_images_collection ON gallery_images(collection_id);
CREATE INDEX IF NOT EXISTS idx_images_captured_date ON gallery_images(captured_date DESC);
CREATE INDEX IF NOT EXISTS idx_images_collection_date ON gallery_images(collection_id, captured_date DESC);

-- Enable Row Level Security
ALTER TABLE gallery_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can view collections"
  ON gallery_collections FOR SELECT
  USING (true);

CREATE POLICY "Public can view images"
  ON gallery_images FOR SELECT
  USING (true);

-- Admin write policies (adjust auth condition as needed)
CREATE POLICY "Admins can manage collections"
  ON gallery_collections FOR ALL
  USING (true); -- Replace with your auth check

CREATE POLICY "Admins can manage images"
  ON gallery_images FOR ALL
  USING (true); -- Replace with your auth check

-- Function to get all collections with image counts
CREATE OR REPLACE FUNCTION get_gallery_collections()
RETURNS TABLE (
  id UUID,
  slug TEXT,
  year INTEGER,
  month INTEGER,
  display_name TEXT,
  image_count BIGINT,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.slug,
    c.year,
    c.month,
    c.display_name,
    COUNT(i.id) as image_count,
    COALESCE(c.cover_image_url, (
      SELECT i2.r2_url 
      FROM gallery_images i2 
      WHERE i2.collection_id = c.id 
      ORDER BY i2.captured_date DESC 
      LIMIT 1
    )) as cover_image_url,
    c.created_at,
    c.updated_at
  FROM gallery_collections c
  LEFT JOIN gallery_images i ON i.collection_id = c.id
  GROUP BY c.id, c.slug, c.year, c.month, c.display_name, c.cover_image_url, c.created_at, c.updated_at
  ORDER BY c.year DESC, c.month DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;

-- Function to get collection with images by slug
CREATE OR REPLACE FUNCTION get_gallery_collection_by_slug(p_slug TEXT)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'collection', (
      SELECT row_to_json(c)
      FROM (
        SELECT id, slug, year, month, display_name, created_at, updated_at
        FROM gallery_collections
        WHERE slug = p_slug
      ) c
    ),
    'images', (
      SELECT COALESCE(json_agg(i ORDER BY i.captured_date ASC), '[]'::json)
      FROM (
        SELECT 
          gi.id,
          gi.collection_id,
          gi.captured_date,
          gi.description,
          gi.r2_key,
          gi.r2_url,
          gi.thumbnail_url,
          gi.file_size,
          gi.width,
          gi.height,
          gi.mime_type,
          gi.is_cover,
          gi.created_at,
          gi.updated_at
        FROM gallery_images gi
        JOIN gallery_collections gc ON gi.collection_id = gc.id
        WHERE gc.slug = p_slug
      ) i
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to update collection image count cache
CREATE OR REPLACE FUNCTION update_collection_image_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE gallery_collections
    SET image_count = (
      SELECT COUNT(*) FROM gallery_images WHERE collection_id = OLD.collection_id
    )
    WHERE id = OLD.collection_id;
    RETURN OLD;
  ELSE
    UPDATE gallery_collections
    SET image_count = (
      SELECT COUNT(*) FROM gallery_images WHERE collection_id = NEW.collection_id
    )
    WHERE id = NEW.collection_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update image count
CREATE TRIGGER trigger_update_collection_image_count
  AFTER INSERT OR DELETE ON gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION update_collection_image_count();
