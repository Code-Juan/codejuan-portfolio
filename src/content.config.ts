import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// case studies live as markdown in src/content/work; the [slug] route + home cards read from here
const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    blurb: z.string(),
    tags: z.array(z.string()),
    live: z.string().optional(),
    repo: z.string().optional(),
    stack: z.string(),
    year: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    og: z.string().optional(),
    order: z.number(),
    status: z.string(),
  }),
});

export const collections = { work };
