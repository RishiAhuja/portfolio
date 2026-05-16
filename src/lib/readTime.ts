import type { BlurbContent } from '../data/blurb';

// Reading speed constants (words per minute)
const AVERAGE_READING_SPEED = 200; // Average adult reading speed
const TIME_PER_IMAGE = 0.5; // 30 seconds per image
const TIME_PER_CODE_BLOCK = 1; // 1 minute per code block
const TIME_PER_VIDEO = 2; // 2 minutes per video (average watch time)
const TIME_PER_CAROUSEL = 1; // 1 minute per carousel
const TIME_PER_LINK = 0.25; // 15 seconds per link embed

/**
 * Calculate reading time based on content
 * @param content Array of blurb content blocks
 * @returns Reading time in minutes (rounded up)
 */
export function calculateReadTime(content: BlurbContent[]): number {
  let totalWords = 0;
  let additionalTime = 0;

  content.forEach(item => {
    switch (item.type) {
      case 'paragraph':
      case 'heading':
      case 'quote':
        if (item.content) {
          totalWords += countWords(item.content);
        }
        break;

      case 'list':
        if (item.items) {
          item.items.forEach(listItem => {
            totalWords += countWords(listItem);
          });
        }
        break;

      case 'code':
        additionalTime += TIME_PER_CODE_BLOCK;
        // Also count words in code for context
        if (item.content) {
          totalWords += countWords(item.content) * 0.5; // Code is read slower
        }
        break;

      case 'image':
      case 'tweetImage':
        additionalTime += TIME_PER_IMAGE;
        break;

      case 'video':
        additionalTime += TIME_PER_VIDEO;
        break;

      case 'carousel':
        additionalTime += TIME_PER_CAROUSEL;
        // Add time for each image in carousel
        if (item.images) {
          additionalTime += (item.images.length - 1) * 0.25; // 15 seconds per additional image
        }
        break;

      case 'linkEmbed':
        additionalTime += TIME_PER_LINK;
        // Count words in title and description
        if (item.title) totalWords += countWords(item.title);
        if (item.description) totalWords += countWords(item.description);
        break;

      case 'twitter':
        additionalTime += 0.5; // 30 seconds to read a tweet
        break;
    }
  });

  // Calculate base reading time from words
  const baseReadingTime = totalWords / AVERAGE_READING_SPEED;
  
  // Total time is base reading time plus additional time for media
  const totalTime = baseReadingTime + additionalTime;
  
  // Round up to nearest minute, minimum 1 minute
  return Math.max(1, Math.ceil(totalTime));
}

/**
 * Count words in a text string
 * @param text The text to count words in
 * @returns Number of words
 */
function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0)
    .length;
}

/**
 * Get reading time breakdown for debugging
 * @param content Array of blurb content blocks
 * @returns Detailed breakdown of reading time calculation
 */
export function getReadTimeBreakdown(content: BlurbContent[]): {
  totalWords: number;
  readingTime: number;
  mediaTime: number;
  totalTime: number;
  breakdown: Record<string, number>;
} {
  let totalWords = 0;
  let mediaTime = 0;
  const breakdown: Record<string, number> = {};

  content.forEach(item => {
    const type = item.type;
    if (!breakdown[type]) breakdown[type] = 0;

    switch (item.type) {
      case 'paragraph':
      case 'heading':
      case 'quote':
        if (item.content) {
          const words = countWords(item.content);
          totalWords += words;
          breakdown[type] += words;
        }
        break;

      case 'list':
        if (item.items) {
          item.items.forEach(listItem => {
            const words = countWords(listItem);
            totalWords += words;
            breakdown[type] += words;
          });
        }
        break;

      case 'code':
        mediaTime += TIME_PER_CODE_BLOCK;
        breakdown[type] += TIME_PER_CODE_BLOCK;
        if (item.content) {
          const words = countWords(item.content) * 0.5;
          totalWords += words;
        }
        break;

      case 'image':
      case 'tweetImage':
        mediaTime += TIME_PER_IMAGE;
        breakdown[type] += TIME_PER_IMAGE;
        break;

      case 'video':
        mediaTime += TIME_PER_VIDEO;
        breakdown[type] += TIME_PER_VIDEO;
        break;

      case 'carousel':
        const carouselTime = TIME_PER_CAROUSEL + (item.images ? (item.images.length - 1) * 0.25 : 0);
        mediaTime += carouselTime;
        breakdown[type] += carouselTime;
        break;

      case 'linkEmbed':
        mediaTime += TIME_PER_LINK;
        breakdown[type] += TIME_PER_LINK;
        if (item.title) totalWords += countWords(item.title);
        if (item.description) totalWords += countWords(item.description);
        break;

      case 'twitter':
        mediaTime += 0.5;
        breakdown[type] += 0.5;
        break;
    }
  });

  const readingTime = totalWords / AVERAGE_READING_SPEED;
  const totalTime = Math.max(1, Math.ceil(readingTime + mediaTime));

  return {
    totalWords,
    readingTime,
    mediaTime,
    totalTime,
    breakdown
  };
}
