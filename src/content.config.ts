import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    sidebar: z.object({
      hidden: z.boolean().default(false),
    }).default({}),
    layout: z.literal('docs').default('docs'),
  }),
});

export const collections = { docs };
