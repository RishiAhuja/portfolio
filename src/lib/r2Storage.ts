// Cloudflare R2 configuration from environment variables
const R2_CACHE_CONTROL = 'public, max-age=31536000, immutable, no-transform';

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
    CacheControl: R2_CACHE_CONTROL,
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

export interface PresignedUploadResult {
  uploadUrl: string;
  key: string;
  publicUrl: string;
}

export interface ResumeFile {
  key: string;
  fileName: string;
  url: string;
  size: number;
  lastModified: string | null;
  version: number;
}

const RESUME_PREFIX = 'resume/';
const RESUME_FILE_PATTERN = /^rishi-resume-v(\d+)\.pdf$/i;

function parseResumeVersion(fileName: string): number | null {
  const match = fileName.match(RESUME_FILE_PATTERN);
  return match ? Number(match[1]) : null;
}

function sortResumeFiles(files: ResumeFile[]): ResumeFile[] {
  return files.sort((a, b) => {
    if (a.version !== b.version) return b.version - a.version;
    return new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime();
  });
}

/**
 * Generate a presigned PUT URL so the browser can upload directly to R2,
 * bypassing the Vercel function payload limit (4.5 MB).
 */
export async function generatePresignedUploadUrl(
  eventSlug: string,
  fileName: string,
  contentType: string,
  expiresIn: number = 300 // 5 minutes
): Promise<PresignedUploadResult> {
  const { PutObjectCommand } = await import('@aws-sdk/client-s3');
  const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
  const r2Client = await getR2Client();
  const config = getR2Config();

  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `events/${eventSlug}/${timestamp}_${sanitizedFileName}`;

  const command = new PutObjectCommand({
    Bucket: config.BUCKET,
    Key: key,
    ContentType: contentType,
    CacheControl: R2_CACHE_CONTROL,
  });

  const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn });
  const publicUrl = `${config.PUBLIC_URL}/${key}`;

  return { uploadUrl, key, publicUrl };
}

export async function listResumeFiles(): Promise<ResumeFile[]> {
  const { ListObjectsV2Command } = await import('@aws-sdk/client-s3');
  const r2Client = await getR2Client();
  const config = getR2Config();
  const files: ResumeFile[] = [];
  let continuationToken: string | undefined;

  do {
    const command = new ListObjectsV2Command({
      Bucket: config.BUCKET,
      Prefix: RESUME_PREFIX,
      ContinuationToken: continuationToken,
    });

    const response = await r2Client.send(command);

    for (const object of response.Contents || []) {
      if (!object.Key || object.Key.endsWith('/')) continue;

      const fileName = object.Key.slice(RESUME_PREFIX.length);
      const version = parseResumeVersion(fileName);
      if (version === null) continue;

      files.push({
        key: object.Key,
        fileName,
        url: `${config.PUBLIC_URL}/${object.Key}`,
        size: Number(object.Size || 0),
        lastModified: object.LastModified ? object.LastModified.toISOString() : null,
        version,
      });
    }

    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (continuationToken);

  return sortResumeFiles(files);
}

export async function getLatestResumeFile(): Promise<ResumeFile | null> {
  const files = await listResumeFiles();
  return files[0] || null;
}

export async function generatePresignedResumeUploadUrl(
  fileName: string,
  contentType: string = 'application/pdf',
  expiresIn: number = 300
): Promise<PresignedUploadResult> {
  const trimmedFileName = fileName.trim();
  const version = parseResumeVersion(trimmedFileName);

  if (version === null) {
    throw new Error('Resume filename must match rishi-resume-v<number>.pdf');
  }

  const { PutObjectCommand } = await import('@aws-sdk/client-s3');
  const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
  const r2Client = await getR2Client();
  const config = getR2Config();
  const key = `${RESUME_PREFIX}${trimmedFileName}`;

  const command = new PutObjectCommand({
    Bucket: config.BUCKET,
    Key: key,
    ContentType: contentType || 'application/pdf',
    CacheControl: R2_CACHE_CONTROL,
  });

  const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn });
  const publicUrl = `${config.PUBLIC_URL}/${key}`;

  return { uploadUrl, key, publicUrl };
}

/**
 * Get image dimensions from File object (browser-side only)
 */
export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  if (typeof window === 'undefined') {
    // Server-side: return default dimensions
    return { width: 0, height: 0 };
  }

  const isVideo = file.type.startsWith('video/');
  const url = URL.createObjectURL(file);

  if (isVideo) {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve({ width: video.videoWidth, height: video.videoHeight });
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ width: 0, height: 0 }); // non-fatal for videos
      };

      video.src = url;
    });
  }

  return new Promise((resolve, reject) => {
    const img = new Image();

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
 * Validate media file (image or video)
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxImageSize = 10 * 1024 * 1024; // 10MB for images
  const maxVideoSize = 100 * 1024 * 1024; // 100MB for videos
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
  
  const isImage = allowedImageTypes.includes(file.type);
  const isVideo = allowedVideoTypes.includes(file.type);
  
  if (!isImage && !isVideo) {
    return { valid: false, error: 'Only JPEG, PNG, WebP, GIF images or MP4, WebM, MOV videos are allowed' };
  }
  
  if (isImage && file.size > maxImageSize) {
    return { valid: false, error: 'Image size must be less than 10MB' };
  }
  
  if (isVideo && file.size > maxVideoSize) {
    return { valid: false, error: 'Video size must be less than 100MB' };
  }
  
  return { valid: true };
}
