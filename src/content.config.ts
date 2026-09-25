import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { articleCategories, categoryPathPrefix } from './lib/articles';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      // Public URL (kept from the previous site); must sit under the category prefix.
      path: z.string().regex(/^\/(?:[^?#]*\/)?$/),
      category: z.enum(articleCategories),
      navigationOrder: z.number().int(),
      // News only: show the article as a notice on the homepage.
      pinned: z.boolean().default(false),
      sources: z.array(z.object({ label: z.string(), url: z.url() })).optional(),
    })
    .refine(({ path, category }) => path.startsWith(categoryPathPrefix(category)), {
      message: 'path must start with the category prefix (see src/lib/articles.ts)',
      path: ['path'],
    }),
});

const officeHours = defineCollection({
  loader: file('src/data/office-hours.json'),
  schema: z.object({
    day: z.string(),
    clinician: z.string(),
    order: z.number().int(),
    slots: z.array(z.object({
      // HH:MM, also used as the machine-readable <time datetime> value.
      from: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
      to: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
      purpose: z.enum(['acute', 'appointment', 'prebooked', 'vaccination-and-sampling']),
    })),
  }),
});

const pricing = defineCollection({
  loader: file('src/data/pricing.json'),
  schema: z.object({ category: z.string(), service: z.string(), price: z.string(), order: z.number().int() }),
});

const staff = defineCollection({
  loader: file('src/data/staff.json'),
  schema: ({ image }) => z.object({
    name: z.string(),
    role: z.string(),
    order: z.number().int(),
    // Path relative to src/data/staff.json.
    portrait: image(),
    education: z.array(z.string()),
    memberships: z.array(z.string()),
    experience: z.array(z.string()),
  }),
});

const equipment = defineCollection({
  loader: file('src/data/equipment.json'),
  schema: z.object({
    name: z.string(),
    order: z.number().int(),
    description: z.string(),
    purpose: z.string(),
    procedure: z.string(),
  }),
});

const site = defineCollection({
  loader: file('src/data/site.json'),
  schema: z.object({
    name: z.string(),
    // Production origin used for canonical and Open Graph URLs.
    baseUrl: z.url(),
    phone: z.string(),
    email: z.email(),
    ico: z.string(),
    address: z.object({ street: z.string(), postalCode: z.string(), locality: z.string(), country: z.literal('CZ') }),
    description: z.string(),
  }),
});

export const collections = { articles, officeHours, pricing, staff, equipment, site };
