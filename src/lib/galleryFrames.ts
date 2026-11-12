import type { GalleryCollection, GalleryImage } from './gallery';

// Gallery pages live on the archive host; rishia.in/gallery redirects here.
export const GALLERY_ORIGIN = 'https://archive.rishia.in';
export const PORTFOLIO_ORIGIN = 'https://rishia.in';

// Widths Vercel may resize gallery photos to. They must be listed in the
// adapter's imagesConfig.sizes, or /_vercel/image rejects the request.
export const FRAME_WIDTHS = [640, 1080, 1920] as const;
export const THUMB_WIDTH = 256;

// Originals are camera-sized (often 4–8 MB). Production serves resized copies;
// local dev has no /_vercel/image endpoint, so it uses the originals.
export const resized = (url: string, width: number, quality = 72) =>
  import.meta.env.DEV ? url : `/_vercel/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`;

export const frameSrcset = (url: string, originalWidth?: number | null) =>
  FRAME_WIDTHS.filter((width) => !originalWidth || width <= originalWidth || width === FRAME_WIDTHS[0])
    .map((width) => `${resized(url, width)} ${width}w`)
    .join(', ');

// Frames are addressed by their database ID, not their position, so shared
// links survive photos being added, removed, or reordered.
export const frameId = (image: GalleryImage) => image.id.replaceAll('-', '').slice(0, 8);
export const framePath = (slug: string, image: GalleryImage) => `/gallery/${slug}/${frameId(image)}`;
export const frameAnchor = (image: GalleryImage) => `f-${frameId(image)}`;

export const isVideo = (image: GalleryImage) => Boolean(image.mime_type?.startsWith('video/'));

// A roll's cover can be a video; collections only store its URL.
export const isVideoUrl = (url: string) => /\.(mp4|mov|m4v|webm)$/i.test(new URL(url).pathname);

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// captured_date is a calendar date (YYYY-MM-DD); parse it without a timezone
// so a photo never shifts to the previous day.
const parts = (date: string) => {
  const [year, month, day] = date.slice(0, 10).split('-').map(Number);
  return { year, month, day };
};

export const longDate = (date: string) => {
  const { year, month, day } = parts(date);
  return `${day} ${MONTHS[month - 1].slice(0, 3)} ${year}`;
};

// The orange date imprint film cameras burned into the corner: '26 8 15.
export const dateStamp = (date: string) => {
  const { year, month, day } = parts(date);
  return `'${String(year).slice(-2)} ${month} ${String(day).padStart(2, '0')}`;
};

export const rollStamp = (collection: GalleryCollection) =>
  `'${String(collection.year).slice(-2)}${collection.month ? ` ${collection.month}` : ''}`;

export const rollName = (collection: GalleryCollection) =>
  collection.month ? MONTHS[collection.month - 1] : 'The whole year';

// Link previews need a still image of reasonable size, never a video.
export const SHARE_WIDTH = 1200;
export const shareImage = (urls: (string | null | undefined)[]) => {
  const still = urls.find((url): url is string => Boolean(url) && !isVideoUrl(url!));
  return still ? new URL(resized(still, SHARE_WIDTH, 80), GALLERY_ORIGIN).href : undefined;
};

// The resized preview's size, when the original's dimensions are known.
export const shareImageSize = (image: GalleryImage) =>
  image.width && image.height
    ? { width: Math.min(SHARE_WIDTH, image.width), height: Math.round(image.height * Math.min(SHARE_WIDTH, image.width) / image.width) }
    : undefined;

export const frameCount = (count: number) => `${count} ${count === 1 ? 'frame' : 'frames'}`;

export const dateRange = (images: GalleryImage[]) => {
  const dates = images.map((image) => image.captured_date).filter(Boolean).sort();
  if (!dates.length) return '';
  const first = longDate(dates[0]);
  const last = longDate(dates[dates.length - 1]);
  return first === last ? first : `${first} – ${last}`;
};

// Newest roll first; a year-only roll follows that year's monthly rolls.
export const sortRolls = (collections: GalleryCollection[]) =>
  [...collections].sort((a, b) => b.year - a.year || (b.month ?? 0) - (a.month ?? 0));
