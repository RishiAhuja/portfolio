-- Gallery system schema for Cloudflare R2 integration

-- Events table (hackathons, trips, delegations, etc.)
CREATE TABLE IF NOT EXISTS gallery_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  location TEXT,
  category TEXT NOT NULL, -- 'hackathon', 'trip', 'delegation', 'conference', 'casual', 'other'
  cover_image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES gallery_events(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  r2_key TEXT NOT NULL, -- Path in R2 bucket (e.g., 'events/hackathon-2025/image1.jpg')
  r2_url TEXT NOT NULL, -- Full public URL from R2
  thumbnail_url TEXT, -- Optional thumbnail URL
  file_size INTEGER, -- Size in bytes
  width INTEGER,
  height INTEGER,
  mime_type TEXT,
  sort_order INTEGER DEFAULT 0,
  is_cover BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timeline event linking (connect gallery events to timeline entries)
CREATE TABLE IF NOT EXISTS timeline_gallery_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timeline_event_id TEXT NOT NULL, -- References your timeline data (could be slug or ID)
  gallery_event_id UUID REFERENCES gallery_events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(timeline_event_id, gallery_event_id)
);

-- Enable Row Level Security
ALTER TABLE gallery_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_gallery_links ENABLE ROW LEVEL SECURITY;

-- Public can read all gallery content
CREATE POLICY "Public can read gallery events"
  ON gallery_events FOR SELECT
  USING (true);

CREATE POLICY "Public can read gallery images"
  ON gallery_images FOR SELECT
  USING (true);

CREATE POLICY "Public can read timeline links"
  ON timeline_gallery_links FOR SELECT
  USING (true);

-- Authenticated users can manage gallery (admin panel)
CREATE POLICY "Allow gallery event management"
  ON gallery_events FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow gallery image management"
  ON gallery_images FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow timeline link management"
  ON timeline_gallery_links FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_gallery_events_category ON gallery_events(category);
CREATE INDEX idx_gallery_events_date ON gallery_events(event_date DESC);
CREATE INDEX idx_gallery_events_slug ON gallery_events(slug);
CREATE INDEX idx_gallery_events_featured ON gallery_events(is_featured) WHERE is_featured = true;
CREATE INDEX idx_gallery_images_event ON gallery_images(event_id);
CREATE INDEX idx_gallery_images_sort ON gallery_images(event_id, sort_order);
CREATE INDEX idx_timeline_links_timeline ON timeline_gallery_links(timeline_event_id);
CREATE INDEX idx_timeline_links_gallery ON timeline_gallery_links(gallery_event_id);

-- Function to get all events with image counts
CREATE OR REPLACE FUNCTION get_gallery_events_with_counts()
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  description TEXT,
  event_date DATE,
  location TEXT,
  category TEXT,
  cover_image_url TEXT,
  is_featured BOOLEAN,
  image_count BIGINT,
  created_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ge.id,
    ge.title,
    ge.slug,
    ge.description,
    ge.event_date,
    ge.location,
    ge.category,
    ge.cover_image_url,
    ge.is_featured,
    COUNT(gi.id) as image_count,
    ge.created_at
  FROM gallery_events ge
  LEFT JOIN gallery_images gi ON gi.event_id = ge.id
  GROUP BY ge.id
  ORDER BY ge.event_date DESC, ge.created_at DESC;
END;
$$;

-- Function to get event with all images
CREATE OR REPLACE FUNCTION get_gallery_event_with_images(p_slug TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'event', row_to_json(ge.*),
    'images', COALESCE(
      (
        SELECT json_agg(row_to_json(gi.*) ORDER BY gi.sort_order ASC)
        FROM gallery_images gi
        WHERE gi.event_id = ge.id
      ),
      '[]'::json
    )
  ) INTO result
  FROM gallery_events ge
  WHERE ge.slug = p_slug;
  
  RETURN result;
END;
$$;

-- Function to get featured events
CREATE OR REPLACE FUNCTION get_featured_gallery_events()
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  description TEXT,
  event_date DATE,
  location TEXT,
  category TEXT,
  cover_image_url TEXT,
  image_count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ge.id,
    ge.title,
    ge.slug,
    ge.description,
    ge.event_date,
    ge.location,
    ge.category,
    ge.cover_image_url,
    COUNT(gi.id) as image_count
  FROM gallery_events ge
  LEFT JOIN gallery_images gi ON gi.event_id = ge.id
  WHERE ge.is_featured = true
  GROUP BY ge.id
  ORDER BY ge.event_date DESC
  LIMIT 6;
END;
$$;

-- Function to get events by category
CREATE OR REPLACE FUNCTION get_gallery_events_by_category(p_category TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  description TEXT,
  event_date DATE,
  location TEXT,
  category TEXT,
  cover_image_url TEXT,
  image_count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ge.id,
    ge.title,
    ge.slug,
    ge.description,
    ge.event_date,
    ge.location,
    ge.category,
    ge.cover_image_url,
    COUNT(gi.id) as image_count
  FROM gallery_events ge
  LEFT JOIN gallery_images gi ON gi.event_id = ge.id
  WHERE ge.category = p_category
  GROUP BY ge.id
  ORDER BY ge.event_date DESC;
END;
$$;
