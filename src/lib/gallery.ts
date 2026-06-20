import { supabase } from './supabase';
import { validateImageFile, getImageDimensions } from './r2Storage';

export { validateImageFile };

export interface GalleryCollection {
  id: string;
  slug: string; // "2023", "2024", "jan-2025", "feb-2025"
  year: number;
  month: number | null; // null for year-only collections
  display_name: string; // "2023", "January 2025"
  image_count?: number;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  collection_id: string;
  captured_date: string; // Date the photo was actually taken
  description: string | null;
  r2_key: string;
  r2_url: string;
  thumbnail_url: string | null;
  file_size: number | null;
  width: number | null;
  height: number | null;
  mime_type: string | null;
  is_cover: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryCollectionWithImages extends GalleryCollection {
  images: GalleryImage[];
}

// ============ Gallery Collections ============

export const getAllGalleryCollections = async (): Promise<GalleryCollection[]> => {
  const { data, error } = await supabase.rpc('get_gallery_collections');

  if (error) {
    console.error('Error fetching gallery collections:', error);
    return [];
  }

  return data as GalleryCollection[];
};

export const getGalleryCollectionBySlug = async (slug: string): Promise<GalleryCollectionWithImages | null> => {
  const { data, error } = await supabase.rpc('get_gallery_collection_by_slug', {
    p_slug: slug
  });

  if (error) {
    console.error('Error fetching gallery collection:', error);
    return null;
  }

  if (!data || !data.collection) {
    return null;
  }

  return {
    ...data.collection,
    images: data.images || []
  } as GalleryCollectionWithImages;
};

export const createGalleryCollection = async (
  token: string,
  collection: {
    slug: string;
    year: number;
    month?: number;
    display_name: string;
  }
): Promise<GalleryCollection | null> => {
  try {
    const response = await fetch('/api/gallery/create-collection', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(collection),
    });

    if (!response.ok) {
      console.error('Create collection API error:', await response.text());
      return null;
    }

    const { data } = await response.json();
    return data as GalleryCollection;
  } catch (error) {
    console.error('Error creating gallery collection:', error);
    return null;
  }
};

export const deleteGalleryCollection = async (token: string, id: string): Promise<boolean> => {
  try {
    // Delete via API endpoint
    const response = await fetch('/api/gallery/delete-collection', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ collectionId: id }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Delete collection API error:', error);
      return false;
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error deleting collection:', error);
    return false;
  }
};

// ============ Gallery Images ============

export const uploadGalleryImage = async (
  token: string,
  collectionId: string,
  collectionSlug: string,
  file: File,
  metadata: {
    capturedDate: string; // YYYY-MM-DD format
    description?: string;
    isCover?: boolean;
  }
): Promise<GalleryImage | null> => {
  try {
    // 1. Get image dimensions client-side before upload
    const dimensions = await getImageDimensions(file);

    // 2. Request a presigned PUT URL from the server (sends no file — tiny payload)
    const presignRes = await fetch('/api/gallery/presign', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
        collectionSlug,
      }),
    });

    if (!presignRes.ok) {
      const body = await presignRes.text();
      console.error('Presign API error:', { status: presignRes.status, body });
      return null;
    }

    const { uploadUrl, key, publicUrl } = await presignRes.json() as {
      uploadUrl: string;
      key: string;
      publicUrl: string;
    };

    // 3. Upload the file directly to R2 — bypasses Vercel entirely
    const r2Res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    if (!r2Res.ok) {
      const body = await r2Res.text();
      console.error('R2 direct upload error:', { status: r2Res.status, body });
      return null;
    }

    // 4. Confirm the upload and save metadata to the database
    const confirmRes = await fetch('/api/gallery/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        r2Key: key,
        r2Url: publicUrl,
        collectionId,
        capturedDate: metadata.capturedDate,
        description: metadata.description,
        isCover: metadata.isCover ?? false,
        width: dimensions.width,
        height: dimensions.height,
        fileSize: file.size,
        mimeType: file.type,
      }),
    });

    const contentType = confirmRes.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const responseBody = isJson ? await confirmRes.json() : await confirmRes.text();

    if (!confirmRes.ok) {
      console.error('Upload API error:', {
        status: confirmRes.status,
        statusText: confirmRes.statusText,
        body: responseBody,
      });
      return null;
    }

    if (!isJson || typeof responseBody !== 'object' || !('data' in responseBody)) {
      console.error('Confirm API returned unexpected response:', responseBody);
      return null;
    }

    return (responseBody as { data: GalleryImage }).data;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

export const updateGalleryImage = async (
  token: string,
  imageId: string,
  updates: Partial<Pick<GalleryImage, 'description' | 'captured_date' | 'is_cover'>>
): Promise<GalleryImage | null> => {
  try {
    const response = await fetch('/api/gallery/update-image', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageId, updates }),
    });

    if (!response.ok) {
      console.error('Update image API error:', await response.text());
      return null;
    }

    const { data } = await response.json();
    return data as GalleryImage;
  } catch (error) {
    console.error('Error updating image:', error);
    return null;
  }
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

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const responseBody = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      console.error('Delete API error:', {
        status: response.status,
        statusText: response.statusText,
        body: responseBody,
      });
      return false;
    }

    if (!isJson || typeof responseBody !== 'object' || !('success' in responseBody)) {
      console.error('Delete API returned unexpected response:', responseBody);
      return false;
    }

    return Boolean((responseBody as { success: boolean }).success);
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

// Helper: Generate collection slug from year/month
export function generateCollectionSlug(year: number, month?: number): string {
  if (!month) {
    return String(year); // "2023", "2024"
  }
  const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  return `${monthNames[month - 1]}-${year}`; // "jan-2025", "feb-2025"
}

// Helper: Generate display name from year/month
export function generateCollectionDisplayName(year: number, month?: number): string {
  if (!month) {
    return String(year); // "2023"
  }
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  return `${monthNames[month - 1]} ${year}`; // "January 2025"
}

// Helper: Format date for display
export function formatCapturedDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
