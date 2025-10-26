# Portfolio

A modern, performant portfolio website built with Astro and React, featuring a dark theme design and comprehensive content management.

## Tech Stack

- **Framework**: Astro 4.x with React integration
- **Styling**: Tailwind CSS with custom dark theme
- **Content**: Astro Content Collections for projects
- **Blog**: Hashnode API integration with local rendering
- **Analytics**: Supabase integration
- **Deployment**: Vercel

## Features

- Static site generation with selective hydration (Astro Islands)
- Blog posts fetched from Hashnode with full markdown rendering
- Code syntax highlighting with highlight.js
- LaTeX math rendering with KaTeX
- Comprehensive timeline with 40+ events
- 10 project showcases with Content Collections
- Journey posts with image carousels and embeds
- SEO optimized with sitemap and structured data
- Responsive design with dark theme

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

### Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
PUBLIC_HASHNODE_USERNAME=your_hashnode_username
```

## Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── components/      # React and Astro components
│   ├── content/         # Content Collections (projects)
│   ├── data/            # Timeline and journey data
│   ├── layouts/         # Page layouts
│   ├── lib/             # Utility functions and API clients
│   ├── pages/           # File-based routing
│   └── styles/          # Global styles
├── astro.config.mjs     # Astro configuration
└── tailwind.config.ts   # Tailwind configuration
```

## Content Management

### Projects

Projects are managed through Astro Content Collections in `src/content/projects/`. Each project is a markdown file with frontmatter:

```md
---
title: "Project Name"
description: "Project description"
tech_stack: ["React", "TypeScript"]
features: ["Feature 1", "Feature 2"]
github_url: "https://github.com/..."
live_url: "https://..."
category: "web"
is_featured: true
created_at: 2024-01-01
---
```

### Timeline

Timeline events are defined in `src/data/timeline.ts` as TypeScript objects.

### Journey Posts

Journey posts with rich content (carousels, embeds) are defined in `src/data/journey.ts`.

## Deployment

### Vercel

This project is configured for deployment on Vercel:

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

Build settings:
- Framework Preset: Astro
- Build Command: `npm run build`
- Output Directory: `dist`

See `DEPLOYMENT.md` for detailed deployment instructions.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run astro` - Run Astro CLI commands

## License

MIT
