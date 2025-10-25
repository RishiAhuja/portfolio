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

const journeyCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    publishedDate: z.date(),
    readTime: z.number().optional(),
    coverImage: z.string().optional(),
    tags: z.array(z.string()),
    category: z.enum(['project', 'learning', 'experience', 'achievement', 'reflection']),
    projectId: z.string().optional(),
    eventId: z.string().optional(),
    relatedPosts: z.array(z.string()).optional(),
  }),
});

export const collections = {
  projects: projectsCollection,
  journey: journeyCollection,
};
