# Gallery Images

Add your images to this directory and update the gallery data structure in `/src/data/gallery.ts`

## Recommended Structure:

```
/public/gallery/
├── setup-1.jpg          # Development setup photos
├── launch-1.jpg         # Project launch celebrations
├── workspace-1.jpg      # Workspace and coding environment
├── event-1.jpg          # Community events and meetups
├── travel-1.jpg         # Travel and exploration photos
└── moments-1.jpg        # Personal and special moments
```

## Image Guidelines:

- **Format**: JPG or PNG
- **Size**: Recommended 1200x800px or similar aspect ratio
- **Optimization**: Compress images for web use
- **Naming**: Use descriptive names that match your data structure

## Adding New Images:

1. Add image files to `/public/gallery/`
2. Update `/src/data/gallery.ts` with image metadata
3. Include proper alt text, tags, and categories

## Example Entry:

```typescript
{
  id: 'unique-id',
  title: 'Your Image Title',
  description: 'Description of the image',
  imageUrl: '/gallery/your-image.jpg',
  category: 'tech', // tech, personal, work, travel, moments
  date: '2024-12-01',
  tags: ['coding', 'workspace', 'development'],
  location: 'Your Location',
  camera: 'Camera Used'
}
```
