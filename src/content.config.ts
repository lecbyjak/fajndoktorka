import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const path = z.string().regex(/^\/(?:[^?#]*\/)?$/);

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    path,
    canonicalUrl: z.url(),
    category: z.enum(['medical', 'practical', 'prevention', 'news']),
    navigationOrder: z.number().int(),
    sources: z.array(z.object({ label: z.string(), url: z.url() })).optional(),
  }),
});

const officeHours = defineCollection({
  loader: file('src/data/office-hours.json'),
  schema: z.object({
    day: z.string(),
    clinician: z.string(),
    order: z.number().int(),
    slots: z.array(z.object({
      from: z.string(),
      to: z.string(),
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
  schema: z.object({
    name: z.string(),
    role: z.string(),
    order: z.number().int(),
    education: z.array(z.string()),
    memberships: z.array(z.string()),
    experience: z.array(z.string()),
    portraitAlt: z.string(),
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
    legalName: z.string(),
    language: z.literal('cs'),
    baseUrl: z.url(),
    path,
    phone: z.string(),
    email: z.email(),
    ico: z.string(),
    address: z.object({ street: z.string(), postalCode: z.string(), locality: z.string(), country: z.literal('CZ') }),
    description: z.string(),
  }),
});

export const collections = { articles, officeHours, pricing, staff, equipment, site };
