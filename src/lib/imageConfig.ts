// Image configuration for blurb system
// This allows easy switching between local and CDN images

const IMAGE_CONFIG = {
  // Set to 'local' for development, 'cdn' for production
  mode: process.env.NODE_ENV === 'production' ? 'cdn' : 'local',
  
  // CDN base URL (update with your chosen service)
  cdnBase: 'https://cdn.jsdelivr.net/gh/yourusername/portfolio-images@main',
  
  // Local base URL
  localBase: '',
  
  // Quality settings
  quality: 85,
  formats: ['webp', 'jpg']
};

/**
 * Get optimized image URL
 * @param imagePath - Relative image path (e.g., '/blurb/demo.jpg')
 * @returns Optimized image URL
 */
export function getImageUrl(imagePath: string): string {
  if (IMAGE_CONFIG.mode === 'cdn') {
    return `${IMAGE_CONFIG.cdnBase}${imagePath}`;
  }
  return `${IMAGE_CONFIG.localBase}${imagePath}`;
}

/**
 * Get multiple image sizes for responsive loading
 * @param imagePath - Relative image path
 * @returns Object with different sizes
 */
export function getResponsiveImageUrls(imagePath: string) {
  const base = getImageUrl(imagePath);
  
  if (IMAGE_CONFIG.mode === 'cdn') {
    // If using Cloudinary, you can add transformations
    // return {
    //   small: `${base.replace('/upload/', '/upload/w_400,q_auto,f_auto/')},
    //   medium: `${base.replace('/upload/', '/upload/w_800,q_auto,f_auto/')},
    //   large: `${base.replace('/upload/', '/upload/w_1200,q_auto,f_auto/')},
    //   original: base
    // };
  }
  
  return {
    small: base,
    medium: base,
    large: base,
    original: base
  };
}

export default IMAGE_CONFIG;
