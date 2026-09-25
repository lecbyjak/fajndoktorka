# FajnDoktorka

Static [Astro](https://astro.build) website of the FajnDoktorka general practice (Praha 8 – Bohnice). No client framework; the only client script is the mobile menu and back-to-top button.

## Commands

Requires Node ≥ 22.12.

```sh
npm install
npm run dev       # dev server at http://localhost:4321/fajndoktorka/
npm run check     # astro check (TypeScript + templates)
npm test          # production build + internal link check of dist/
npm run build     # production build into dist/
npm run preview   # serve dist/
```

## Editing content

Almost everything a clinic would change lives in data files validated by schemas in `src/content.config.ts`; a typo in a field fails the build with a pointer to the file.

| What | Where |
| --- | --- |
| Phone, e-mail, address, IČO, canonical origin | `src/data/site.json` |
| Office hours (the evening-hours note is derived from `prebooked` slots) | `src/data/office-hours.json` |
| Price list (grouped by `category`, sorted by `order`) | `src/data/pricing.json` |
| Team profiles and portraits (`portrait` is relative to the JSON file) | `src/data/staff.json`, `src/assets/` |
| Equipment | `src/data/equipment.json` |
| Articles and news | `src/content/articles/<category>/*.md` |
| Static PDFs | `public/assets/` |

### Articles

Front matter:

```yaml
title: "Chřipka"
description: "Shown on cards and as the meta description."
path: "/informace-pro-pacienty/prevence-a-ockovani/chripka/"  # public URL
category: "prevention"        # medical | prevention | practical | news
navigationOrder: 50           # order in listings and side navigation
pinned: true                  # news only: show as a notice on the homepage
sources:                      # optional external links rendered under the article
  - label: "SVL: Chřipka"
    url: "https://…"
```

`path` must start with the category prefix defined in `src/lib/articles.ts` (`/post/` for news, `/informace-pro-pacienty/<category-slug>/` otherwise); the schema enforces it. Category titles, slugs, and summaries shown on the homepage and the patient index also live in `src/lib/articles.ts`.

## Structure

```
src/
  components/      navigation, footer, page building blocks, data-driven sections
  content/         Markdown articles
  data/            JSON collections (see table above)
  layouts/         BaseLayout (head, header, footer) → LandingLayout | ArticleLayout
  lib/             site.ts (site data, base-path and contact helpers), articles.ts (categories)
  pages/           routes; article routes are generated from `path`
  scripts/site.ts  client behaviour
  styles/          global.css imports base → layout → components → pages → print
tests/             node:test checks run against dist/
```

Internal links must go through `components/navigation/Link.astro` (or `withBase()` from `src/lib/site.ts`) so they get the deployment base path; `npm test` fails on any unprefixed or broken internal link.

## Deployment

Pushing to `main` runs `.github/workflows/astro.yml`: type-check, build, link test, then deploy to GitHub Pages at <https://lecbyjak.github.io/fajndoktorka/>. Switching to the production domain is described at the top of `astro.config.mjs`.
