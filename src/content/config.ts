import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tech_stack: z.array(z.string()),
    features: z.array(z.string()),
    github_url: z.string().url().optional(),
    live_url: z.string().url().optional(),
    image_url: z.string().optional(),
    category: z.enum(['mobile', 'web', 'cli', 'other']),
    is_featured: z.boolean().default(false),
    created_at: z.date(),
  }),
});

const researchCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tldr: z.string(),
    abstract: z.string(),
    venue: z.string(),
    proceedings: z.string(),
    status: z.enum(['accepted', 'published']),
    sort_date: z.date(),
    published_date: z.date().optional(),
    authors: z.array(z.object({
      name: z.string(),
      is_me: z.boolean().default(false),
      is_corresponding: z.boolean().default(false),
      profile: z.string().url().optional(),
    })),
    affiliation_note: z.string().optional(),
    award: z.string().optional(),
    event: z.object({
      announcement: z.string(),
      label: z.string(),
      venue: z.string(),
      location: z.string(),
      start_date: z.string().optional(),
      end_date: z.string().optional(),
      url: z.string().url(),
      verified_links: z.array(z.object({
        label: z.string(),
        url: z.string().url(),
      })).default([]),
    }).optional(),
    links: z.array(z.object({
      label: z.string(),
      url: z.string().url(),
      primary: z.boolean().optional(),
    })).default([]),
    bibtex: z.string().optional(),
    primary_url: z.string().url().optional(),
    same_as: z.array(z.string().url()).default([]),
  }),
});

const blogsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    brief: z.string(),
    dateAdded: z.coerce.date(),
    hashnodeUrl: z.string().url(),
    readTimeInMinutes: z.number().int().positive(),
    author: z.string().default('Rishi Ahuja'),
    coverImage: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  projects: projectsCollection,
  research: researchCollection,
  blogs: blogsCollection,
};
