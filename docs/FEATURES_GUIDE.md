# Portfolio Features - Content Management Guide

Your portfolio now includes several new features that enhance user experience and showcase your journey as a developer. Here's how to manage and update content for each feature:

## 🖼️ Image Gallery

**Location**: `/src/data/gallery.ts`

### Adding New Images:
1. Add image files to `/public/gallery/`
2. Update the `galleryImages` array in `/src/data/gallery.ts`

**Example entry**:
```typescript
{
  id: 'unique-id-here',
  title: 'My Development Setup 2024',
  description: 'My current development environment with dual monitors and mechanical keyboard',
  imageUrl: '/gallery/setup-2024.jpg',
  category: 'tech', // tech, personal, work, travel, moments
  date: '2024-12-01',
  tags: ['workspace', 'coding', 'setup', 'productivity'],
  location: 'Home Office',
  camera: 'iPhone 15 Pro'
}
```

**Available Categories**: tech, personal, work, travel, moments

---

## 🎯 Bucket List

**Location**: `/src/data/bucket-list.ts`

### Adding New Goals:
Update the `bucketListItems` array with new goals and aspirations.

**Example entry**:
```typescript
{
  id: 'learn-rust-lang',
  title: 'Master Rust Programming Language',
  description: 'Learn Rust for systems programming and explore its unique memory management concepts',
  category: 'learning', // tech, travel, learning, creative, personal, fitness
  priority: 'high', // high, medium, low
  status: 'not-started', // not-started, in-progress, completed, paused
  dateAdded: '2024-12-01',
  targetDate: '2025-06-01',
  tags: ['Rust', 'Programming', 'Systems'],
  progress: 0,
  milestones: [
    { id: 'm1', title: 'Complete Rust Book', completed: false },
    { id: 'm2', title: 'Build CLI Tool', completed: false },
    { id: 'm3', title: 'Contribute to Open Source', completed: false }
  ],
  resources: [
    { title: 'The Rust Programming Language', url: 'https://doc.rust-lang.org/book/', type: 'book' }
  ]
}
```

**Available Categories**: tech, travel, learning, creative, personal, fitness
**Available Statuses**: not-started, in-progress, completed, paused
**Available Priorities**: high, medium, low

---

## 📖 Journey Blog Posts

**Location**: `/src/data/journey.ts`

### Creating Journey Posts:
Add detailed blog posts about your projects, experiences, and learnings.

**Example entry**:
```typescript
{
  id: 'building-my-first-ai-app',
  projectId: 'ai-project', // Optional: link to existing project
  title: 'Building My First AI Application',
  subtitle: 'From concept to production deployment',
  description: 'A detailed journey of building an AI-powered application, including challenges, solutions, and lessons learned.',
  slug: 'building-my-first-ai-app',
  publishedDate: '2024-12-01',
  readTime: 15,
  coverImage: '/journey/ai-app-cover.jpg',
  tags: ['AI', 'Development', 'Learning'],
  category: 'project', // project, learning, experience, achievement, reflection
  status: 'published', // draft, published
  featured: true,
  content: [
    {
      type: 'heading',
      content: 'The Beginning',
      level: 2
    },
    {
      type: 'paragraph',
      content: 'It all started with a simple idea...'
    },
    {
      type: 'image',
      content: '/journey/initial-sketch.jpg',
      alt: 'Initial sketches and wireframes'
    },
    {
      type: 'code',
      content: 'const example = "code snippet";',
      language: 'javascript'
    },
    {
      type: 'list',
      items: ['Item 1', 'Item 2', 'Item 3']
    },
    {
      type: 'quote',
      content: 'A meaningful quote that inspired the project'
    }
  ]
}
```

**Content Types**: heading, paragraph, image, code, quote, list
**Categories**: project, learning, experience, achievement, reflection

---

## 📅 Cal.com Integration

**Location**: `/src/components/ContactSocial.tsx`

### Updating Calendar Settings:
Update the `CalendarSchedule` component props:

```typescript
<CalendarSchedule 
  calcomUsername="your-username" // Your Cal.com username
  eventType="30min" // Your event type (30min, 60min, etc.)
  buttonText="Schedule a Meeting"
/>
```

---

## 🔗 Timeline Journey Integration

Journey posts are automatically linked to timeline events based on:
1. **Event ID**: Match `eventId` in journey post to timeline event
2. **Title similarity**: Automatic matching based on title keywords

To link a journey post to a timeline event:
```typescript
// In journey post
{
  eventId: 'timeline-5 July 2025', // Match with timeline event date
  // ... other properties
}
```

---

## 🎨 Design Language Consistency

Your portfolio maintains a consistent design language:

- **Colors**: Dark theme with teal accents (#64b2bc)
- **Typography**: PT Mono, Inter, Playfair Display
- **Spacing**: Consistent 8px grid system
- **Animations**: Subtle fade-ins and hover effects
- **Layout**: Clean, minimal with subtle borders and cards

---

## 📁 File Organization

```
src/
├── data/
│   ├── gallery.ts         # Gallery images data
│   ├── bucket-list.ts     # Bucket list items
│   └── journey.ts         # Journey blog posts
├── components/
│   ├── gallery/           # Gallery components
│   ├── journey/           # Journey blog components
│   └── ui/                # Reusable UI components
└── app/
    ├── gallery/           # Gallery page
    ├── bucket-list/       # Bucket list page
    └── timeline/          # Enhanced timeline with journey
```

---

## 🚀 Quick Start

1. **Add Images**: Drop images in `/public/gallery/` and `/public/journey/`
2. **Update Data**: Modify the respective TypeScript files in `/src/data/`
3. **Test Features**: Visit `/gallery`, `/bucket-list`, and `/timeline` routes
4. **Customize Cal.com**: Update your username in ContactSocial component

Your portfolio now includes rich features that showcase not just your work, but your journey, aspirations, and personality as a developer!

## 🎯 Next Steps

- Add your actual images to the gallery
- Populate your bucket list with real goals
- Write detailed journey posts about your projects
- Configure your Cal.com integration
- Customize the content to match your personal brand
