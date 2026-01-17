-- Update gallery function to sort images by captured_date ASC (oldest first)

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
