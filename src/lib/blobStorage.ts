// Vercel Blob Storage utilities for blurb images
// Install with: npm install @vercel/blob

/**
 * Upload an image to Vercel Blob Storage
 * Usage example:
 * 
 * import { put } from '@vercel/blob';
 * 
 * const uploadImage = async (file: File) => {
 *   const blob = await put(`blurb/${file.name}`, file, {
 *     access: 'public',
 *   });
 *   return blob.url;
 * };
 */

/**
 * Common Vercel Blob patterns for blurb images
 */
export const BLOB_PATTERNS = {
  // Base URL for your Vercel Blob Storage
  BASE: 'https://a5nvwd1dlbbduhtr.public.blob.vercel-storage.com',
  
  // Blurb content images
  BLURB: 'https://a5nvwd1dlbbduhtr.public.blob.vercel-storage.com/blurb/',
  
  // Tweet screenshots
  TWEETS: 'https://a5nvwd1dlbbduhtr.public.blob.vercel-storage.com/blurb/tweets/',
  
  // Video thumbnails
  VIDEO_POSTERS: 'https://a5nvwd1dlbbduhtr.public.blob.vercel-storage.com/blurb/video-posters/',
  
  // Carousel images
  CAROUSEL: 'https://a5nvwd1dlbbduhtr.public.blob.vercel-storage.com/blurb/carousel/',
  
  // Project specific folders (like your fern example)
  FERN: 'https://a5nvwd1dlbbduhtr.public.blob.vercel-storage.com/fern/',
};

/**
 * Generate optimized Vercel Blob URL with parameters
 * @param baseUrl - The blob storage URL
 * @param options - Optional optimization parameters
 */
export function getOptimizedBlobUrl(baseUrl: string, options?: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}): string {
  if (!options) return baseUrl;
  
  const params = new URLSearchParams();
  if (options.width) params.set('w', options.width.toString());
  if (options.height) params.set('h', options.height.toString());
  if (options.quality) params.set('q', options.quality.toString());
  if (options.format) params.set('f', options.format);
  
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}${params.toString()}`;
}

/**
 * Helper function to construct blurb image URLs
 */
export const blurbImage = {
  // Regular blurb image
  content: (filename: string) => `${BLOB_PATTERNS.BLURB}${filename}`,
  
  // Tweet screenshot
  tweet: (filename: string) => `${BLOB_PATTERNS.TWEETS}${filename}`,
  
  // Video poster/thumbnail
  videoPoster: (filename: string) => `${BLOB_PATTERNS.VIDEO_POSTERS}${filename}`,
  
  // Carousel image
  carousel: (filename: string) => `${BLOB_PATTERNS.CAROUSEL}${filename}`,
  
  // Project specific images (like fern)
  fern: (filename: string) => `${BLOB_PATTERNS.FERN}${filename}`,
  
  // Generic project folder
  project: (projectName: string, filename: string) => `${BLOB_PATTERNS.BASE}/${projectName}/${filename}`,
};

/**
 * Example usage in blurb.ts:
 * 
 * {
 *   type: 'image',
 *   content: blurbImage.content('demo-screenshot.jpg'),
 *   alt: 'Application demo screenshot'
 * },
 * 
 * {
 *   type: 'tweetImage',
 *   content: blurbImage.tweet('tweet-announcement.jpg'),
 *   alt: 'Tweet about project launch',
 *   tweetUrl: 'https://twitter.com/username/status/123456789'
 * },
 * 
 * {
 *   type: 'image',
 *   content: blurbImage.fern('cyberpunk.png'), // For fern project images
 *   alt: 'Cyberpunk themed graphics'
 * },
 * 
 * {
 *   type: 'image',
 *   content: blurbImage.project('openlearn', 'dashboard.jpg'), // For other projects
 *   alt: 'OpenLearn dashboard screenshot'
 * },
 * 
 * {
 *   type: 'carousel',
 *   images: [
 *     { src: blurbImage.carousel('step1.jpg'), alt: 'First step' },
 *     { src: blurbImage.carousel('step2.jpg'), alt: 'Second step' },
 *   ]
 * }
 */
