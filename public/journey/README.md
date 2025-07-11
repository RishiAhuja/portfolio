# Journey Images

Add your journey blog images to this directory and reference them in your journey posts.

## Recommended Structure:

```
/public/journey/
├── project-covers/      # Cover images for project journey posts
│   ├── fern-cover.jpg
│   └── nexus-cover.jpg
├── project-details/     # Detailed project images
│   ├── fern-initial-sketch.jpg
│   ├── fern-final-ui.jpg
│   └── development-process.jpg
├── learning/           # Learning and education related images
│   ├── typescript-learning.jpg
│   └── coding-setup.jpg
└── experiences/        # Experience and achievement images
    ├── internship-first-day.jpg
    └── project-launch.jpg
```

## Image Guidelines:

- **Format**: JPG or PNG
- **Size**: Cover images: 1200x600px, Content images: 800x400px
- **Optimization**: Compress for web performance
- **Alt Text**: Always provide descriptive alt text

## Usage in Journey Posts:

```typescript
{
  type: 'image',
  content: '/journey/project-covers/fern-cover.jpg',
  alt: 'Fern project initial design sketches and wireframes'
}
```
