# Gallery System Setup Guide

## Overview
Complete centralized gallery system with Cloudflare R2 storage, Supabase database, admin panel management, and beautiful public gallery pages.

## Prerequisites
- Cloudflare R2 bucket created
- Supabase project configured
- Admin user created (from previous admin setup)

## ⚠️ IMPORTANT: Security Update

**Environment Variables**: All R2 credentials are now loaded from `.env` file instead of being hardcoded. Never commit `.env` to git!

The `.env` file now contains:
```env
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_ENDPOINT=...
R2_BUCKET_NAME=portfolio
PUBLIC_R2_PUBLIC_URL=https://gallery.rishia.in
```

## 1. Cloudflare R2 Setup

### Create R2 Bucket
1. Go to Cloudflare Dashboard → R2
2. Create new bucket: `portfolio`
3. **Enable public access** for the bucket

### ⚠️ Configure CORS Policy (CRITICAL!)

**This is required to fix upload errors!**

1. Go to R2 bucket → Settings → CORS Policy
2. Add this configuration:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:4321",
      "https://rishia.in",
      "https://*.vercel.app"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

### Configure Custom Domain (Optional but Recommended)
1. In R2 bucket settings → Custom Domains
2. Add domain: `gallery.rishia.in` (or your preferred subdomain)
3. Update DNS records as instructed
4. Wait for DNS propagation

## 2. Database Setup

### Run Schema Migration
Execute `/sql/gallery-schema.sql` in Supabase SQL Editor:

```sql
-- Creates 3 tables:
-- 1. gallery_events: Event metadata (hackathons, trips, etc.)
-- 2. gallery_images: Image records with R2 URLs
-- 3. timeline_gallery_links: Links gallery events to timeline entries

-- RLS policies enabled for public read, authenticated write
-- Functions for fetching events with image counts, filtering by category
```

### Verify Tables Created
Check Supabase dashboard:
- ✅ `gallery_events`
- ✅ `gallery_images`
- ✅ `timeline_gallery_links`

## 3. Admin Panel Usage

### Access Gallery Manager
1. Navigate to `/admin`
2. Login with your credentials
3. Click "Gallery" tab

### Create Event
1. Click "+ New Event"
2. Fill in details:
   - **Title**: Event name (e.g., "Tech Hackathon 2025")
   - **Slug**: Auto-generated URL-safe slug
   - **Date**: Event date
   - **Location**: Optional location
   - **Category**: hackathon | trip | delegation | conference | casual | other
   - **Description**: Brief description
   - **Featured**: Toggle to show on main gallery page

3. Click "Create Event"

### Upload Images
1. Select an event from the grid
2. Click "+ Upload Images"
3. Select multiple images (JPEG, PNG, WebP, GIF)
4. Max size: 10MB per image
5. First image automatically becomes cover image
6. Images are uploaded to R2: `events/{event-slug}/{timestamp}_{filename}`

### Manage Images
- **Set as Cover**: Click image → "Set as Cover"
- **Delete Image**: Click image → "Delete" (removes from R2 too)
- Images stored with metadata: dimensions, file size, MIME type

### Delete Event
- Click "Delete Event" on event card
- Deletes ALL images from R2 and database (irreversible)

## 4. Public Gallery Features

### Main Gallery Page (`/gallery`)
- **Category filters**: All | Hackathons | Trips | Delegations | Conferences | Casual
- **Featured events**: Shows up to 6 featured events
- **Card view**: Cover image, title, date, location, photo count
- **Hover effects**: Smooth animations revealing event details

### Individual Event Page (`/gallery/{slug}`)
- **Event header**: Title, date, location, category badge, description
- **Image grid**: Responsive 3-column grid (mobile-adaptive)
- **Lightbox viewer**:
  - Click any image to open full-screen
  - Keyboard navigation: ← → arrows, Escape to close
  - Touch/click navigation buttons
  - Image counter

## 5. R2 Storage Structure

```
portfolio-gallery/
  events/
    tech-hackathon-2025/
      1732924800123_team-photo.jpg
      1732924801234_prize-ceremony.jpg
      1732924802345_code-session.jpg
    goa-trip-2025/
      1733097600123_beach-sunset.jpg
      1733097601234_group-photo.jpg
```

## 6. Integration with Timeline (Future)

### Link Gallery to Timeline Events
Use `timeline_gallery_links` table:

```typescript
// Example: Link gallery event to timeline entry
await supabase
  .from('timeline_gallery_links')
  .insert({
    timeline_event_id: 'hackathon-won',
    gallery_event_id: 'uuid-of-gallery-event'
  });
```

### Display in Timeline
In timeline component, fetch linked gallery events:

```typescript
const { data } = await supabase
  .from('timeline_gallery_links')
  .select(`
    *,
    gallery_events (
      title,
      slug,
      cover_image_url,
      image_count
    )
  `)
  .eq('timeline_event_id', eventId);
```

## 7. Performance Optimizations

### Image Loading
- ✅ Lazy loading enabled (`loading="lazy"`)
- ✅ R2 CDN caching (1 year: `max-age=31536000`)
- ✅ Responsive images with CSS object-fit

### Database Queries
- ✅ Indexed on: category, event_date, slug, featured status
- ✅ Efficient joins with `get_gallery_events_with_counts()`
- ✅ Single query for event + images using PostgreSQL functions

## 8. Security

### Row Level Security (RLS)
- ✅ Public can READ all gallery content
- ✅ Only authenticated admins can CREATE/UPDATE/DELETE
- ✅ Session verification for all admin operations

### R2 Access
- ✅ Public read on bucket (images visible to all)
- ✅ Write operations only through authenticated API
- ✅ Credentials never exposed to client

## 9. Troubleshooting

### Images not uploading
- Check R2 bucket exists and is named `portfolio-gallery`
- Verify R2 credentials in `/src/lib/r2Storage.ts`
- Check browser console for upload errors
- Ensure images are under 10MB and valid format

### Events not showing
- Verify RLS policies are enabled in Supabase
- Check `get_gallery_events_with_counts()` function exists
- Run `SELECT * FROM gallery_events` to check data

### Lightbox not working
- Check browser console for JavaScript errors
- Ensure `define:vars` in Astro is passing images correctly
- Verify event has images in database

## 10. Future Enhancements

### Potential Features
- [ ] Image captions/descriptions editable in admin
- [ ] Bulk image upload with drag-and-drop
- [ ] Image reordering (drag to reorder sort_order)
- [ ] Search functionality across all events
- [ ] Tags system for images
- [ ] Social sharing for individual images
- [ ] Download original image option
- [ ] Image compression/optimization on upload
- [ ] Multiple image sizes (thumbnail, medium, full)
- [ ] Video support (extend to multimedia gallery)

## Summary

**What's Built:**
1. ✅ Complete R2 integration with AWS SDK
2. ✅ Supabase schema with 3 tables + functions
3. ✅ Admin panel with create/upload/manage functionality
4. ✅ Public gallery with category filtering
5. ✅ Individual event pages with lightbox viewer
6. ✅ Footer navigation links
7. ✅ Mobile-responsive throughout

**What You Need to Do:**
1. Run SQL schema in Supabase
2. Create/verify R2 bucket name is `portfolio-gallery`
3. Start creating events and uploading photos!

**Access:**
- Admin: `/admin` → Gallery tab
- Public: `/gallery`
- Individual events: `/gallery/{event-slug}`
