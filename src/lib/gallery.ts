import { supabase } from './supabase';
import { validateImageFile } from './r2Storage';

export { validateImageFile };

export interface GalleryEvent {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  event_date: string;
  location: string | null;
  category: string;
  cover_image_url: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  event_id: string;
  title: string | null;
  description: string | null;
  r2_key: string;
  r2_url: string;
  thumbnail_url: string | null;
  file_size: number | null;
  width: number | null;
  height: number | null;
  mime_type: string | null;
  sort_order: number;
  is_cover: boolean;
  created_at: string;
}

export interface GalleryEventWithCount extends GalleryEvent {
  image_count: number;
}

export interface GalleryEventWithImages extends GalleryEvent {
  images: GalleryImage[];
}

// ============ Gallery Events ============

export const getAllGalleryEvents = async (token: string): Promise<GalleryEventWithCount[]> => {
  const { data, error } = await supabase.rpc('get_gallery_events_with_counts');

  if (error) {
    console.error('Error fetching gallery events:', error);
    return [];
  }

  return data as GalleryEventWithCount[];
};

export const getGalleryEventBySlug = async (slug: string): Promise<GalleryEventWithImages | null> => {
  const { data, error } = await supabase.rpc('get_gallery_event_with_images', {
    p_slug: slug
  });

  if (error) {
    console.error('Error fetching gallery event:', error);
    return null;
  }

  if (!data || !data.event) {
    return null;
  }

  return {
    ...data.event,
    images: data.images || []
  } as GalleryEventWithImages;
};

export const getFeaturedGalleryEvents = async (): Promise<GalleryEventWithCount[]> => {
  const { data, error } = await supabase.rpc('get_featured_gallery_events');

  if (error) {
    console.error('Error fetching featured events:', error);
    return [];
  }

  return data as GalleryEventWithCount[];
};

export const getGalleryEventsByCategory = async (category: string): Promise<GalleryEventWithCount[]> => {
  const { data, error } = await supabase.rpc('get_gallery_events_by_category', {
    p_category: category
  });

  if (error) {
    console.error('Error fetching events by category:', error);
    return [];
  }

  return data as GalleryEventWithCount[];
};

export const createGalleryEvent = async (
  token: string,
  event: Omit<GalleryEvent, 'id' | 'created_at' | 'updated_at'>
): Promise<GalleryEvent | null> => {
  const { data, error } = await supabase
    .from('gallery_events')
    .insert(event)
    .select()
    .single();

  if (error) {
    console.error('Error creating gallery event:', error);
    return null;
  }

  return data as GalleryEvent;
};

export const updateGalleryEvent = async (
  token: string,
  id: string,
  updates: Partial<Omit<GalleryEvent, 'id' | 'created_at'>>
): Promise<GalleryEvent | null> => {
  const { data, error } = await supabase
    .from('gallery_events')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating gallery event:', error);
    return null;
  }

  return data as GalleryEvent;
};

export const deleteGalleryEvent = async (token: string, id: string): Promise<boolean> => {
  try {
    // Delete via API endpoint
    const response = await fetch('/api/gallery/delete-event', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventId: id }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Delete event API error:', error);
      return false;
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error deleting event:', error);
    return false;
  }
};

// ============ Gallery Images ============

export const uploadGalleryImage = async (
  token: string,
  eventId: string,
  eventSlug: string,
  file: File,
  metadata: {
    title?: string;
    description?: string;
    sortOrder?: number;
    isCover?: boolean;
  }
): Promise<GalleryImage | null> => {
  try {
    // Create form data for API request
    const formData = new FormData();
    formData.append('file', file);
    formData.append('eventId', eventId);
    formData.append('eventSlug', eventSlug);
    formData.append('sortOrder', String(metadata.sortOrder || 0));
    formData.append('isCover', String(metadata.isCover || false));
    
    if (metadata.title) formData.append('title', metadata.title);
    if (metadata.description) formData.append('description', metadata.description);

    // Upload via API endpoint
    const response = await fetch('/api/gallery/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type - let browser set it with boundary for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Upload API error:', error);
      return null;
    }

    const result = await response.json();
    return result.data as GalleryImage;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

export const updateGalleryImage = async (
  token: string,
  imageId: string,
  updates: Partial<Pick<GalleryImage, 'title' | 'description' | 'sort_order' | 'is_cover'>>
): Promise<GalleryImage | null> => {
  const { data, error } = await supabase
    .from('gallery_images')
    .update(updates)
    .eq('id', imageId)
    .select()
    .single();

  if (error) {
    console.error('Error updating image:', error);
    return null;
  }

  // If this is now the cover image, update event
  if (updates.is_cover && data) {
    const image = data as GalleryImage;
    await supabase
      .from('gallery_events')
      .update({ cover_image_url: image.r2_url })
      .eq('id', image.event_id);
  }

  return data as GalleryImage;
};

export const deleteGalleryImage = async (token: string, imageId: string): Promise<boolean> => {
  try {
    // Delete via API endpoint
    const response = await fetch('/api/gallery/delete-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageId }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Delete API error:', error);
      return false;
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

// Helper: Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Helper: Format date for display
export function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
