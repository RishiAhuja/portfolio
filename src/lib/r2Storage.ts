// Cloudflare R2 configuration from environment variables
// Only call this function server-side when actually needed
function getR2Config() {
  // Prevent access in browser
  if (typeof window !== 'undefined') {
    throw new Error('R2 configuration can only be accessed server-side');
  }
  
  // Use import.meta.env for Astro (works in both dev and build)
  const env = import.meta.env || process.env;
  
  return {
    ACCOUNT_ID: env.R2_ACCOUNT_ID,
    ACCESS_KEY: env.R2_ACCESS_KEY_ID,
    SECRET_KEY: env.R2_SECRET_ACCESS_KEY,
    ENDPOINT: env.R2_ENDPOINT,
    BUCKET: env.R2_BUCKET_NAME || 'portfolio',
    PUBLIC_URL: env.PUBLIC_R2_PUBLIC_URL || 'https://gallery.rishia.in',
  };
}

// DO NOT call getR2Config() at module level - only when actually needed
// export const R2_CONFIG = getR2Config(); // REMOVED - causes issues

// Initialize S3 client lazily to avoid bundling issues
let r2ClientInstance: any = null;

async function getR2Client() {
  if (r2ClientInstance) return r2ClientInstance;
  
  const { S3Client } = await import('@aws-sdk/client-s3');
  const config = getR2Config(); // Only call when actually uploading
  
  // Validate credentials
  if (!config.ACCESS_KEY || !config.SECRET_KEY || !config.ENDPOINT) {
    throw new Error('R2 credentials not configured. Check your .env file.');
  }
  
  r2ClientInstance = new S3Client({
    region: 'auto',
    endpoint: config.ENDPOINT,
    credentials: {
      accessKeyId: config.ACCESS_KEY,
      secretAccessKey: config.SECRET_KEY,
    },
  });
  
  return r2ClientInstance;
}

export interface UploadOptions {
  file: File;
  eventSlug: string;
  fileName?: string;
}

export interface UploadResult {
  key: string;
  url: string;
  size: number;
  mimeType: string;
}

/**
 * Upload an image to Cloudflare R2
 */
export async function uploadImageToR2(options: UploadOptions): Promise<UploadResult> {
  const { file, eventSlug, fileName } = options;
  
  // Dynamic import to avoid bundling issues
  const { PutObjectCommand } = await import('@aws-sdk/client-s3');
  const r2Client = await getR2Client();
  const config = getR2Config();
  
  // Generate unique filename
  const timestamp = Date.now();
  const sanitizedFileName = fileName || file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `events/${eventSlug}/${timestamp}_${sanitizedFileName}`;
  
  // Convert File to ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  
  // Upload to R2
  const command = new PutObjectCommand({
    Bucket: config.BUCKET,
    Key: key,
    Body: buffer,
    ContentType: file.type,
    CacheControl: 'public, max-age=31536000', // 1 year cache
  });
  
  await r2Client.send(command);
  
  // Construct public URL
  const url = `${config.PUBLIC_URL}/${key}`;
  
  return {
    key,
    url,
    size: file.size,
    mimeType: file.type,
  };
}

/**
 * Delete an image from R2
 */
export async function deleteImageFromR2(key: string): Promise<void> {
  const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
  const r2Client = await getR2Client();
  const config = getR2Config();
  
  const command = new DeleteObjectCommand({
    Bucket: config.BUCKET,
    Key: key,
  });
  
  await r2Client.send(command);
}

/**
 * List all images in an event folder
 */
export async function listEventImages(eventSlug: string): Promise<string[]> {
  const { ListObjectsV2Command } = await import('@aws-sdk/client-s3');
  const r2Client = await getR2Client();
  const config = getR2Config();
  
  const command = new ListObjectsV2Command({
    Bucket: config.BUCKET,
    Prefix: `events/${eventSlug}/`,
  });
  
  const response = await r2Client.send(command);
  return response.Contents?.map((obj: any) => obj.Key!) || [];
}

/**
 * Generate a presigned URL for temporary access (useful for admin previews)
 */
export async function getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const { PutObjectCommand } = await import('@aws-sdk/client-s3');
  const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
  const r2Client = await getR2Client();
  const config = getR2Config();
  
  const command = new PutObjectCommand({
    Bucket: config.BUCKET,
    Key: key,
  });
  
  return await getSignedUrl(r2Client, command, { expiresIn });
}

/**
 * Get image dimensions from File object (browser-side only)
 */
export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  if (typeof window === 'undefined') {
    // Server-side: return default dimensions
    return { width: 0, height: 0 };
  }
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, WebP, and GIF images are allowed' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 10MB' };
  }
  
  return { valid: true };
}
