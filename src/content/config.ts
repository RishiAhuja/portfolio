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

export const collections = {
  projects: projectsCollection,
};
