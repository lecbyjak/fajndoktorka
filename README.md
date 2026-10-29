# FajnDoktorka

Static [Astro](https://astro.build) website of the FajnDoktorka general practice (Praha 8 – Bohnice). No client framework; the only client script handles the back-to-top button and the live "open now" status.

## Commands

Requires Node ≥ 22.12.

```sh
npm install
npm run dev       # dev server at http://localhost:4321/
npm run check     # astro check (TypeScript + templates)
npm test          # production build + internal link check of dist/
npm run build     # production build into dist/
npm run preview   # serve dist/
```

## Editing content

Almost everything a clinic would change lives in data files validated by schemas in `src/content.config.ts`; a typo in a field fails the build with a pointer to the file.

| What | Where |
| --- | --- |
| Phone, e-mail, address, GPS, IČO, canonical origin, meta description | `src/data/site.json` |
| Office hours (`weekday` 1–7 = Mon–Sun; the evening-hours note is derived from `prebooked` slots) | `src/data/office-hours.json` |
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
navigationOrder: 50           # medical | prevention | practical only: order in listings and side navigation
pinned: true                  # news only: show in the "Aktuálně" panel on the homepage
visible: false                # optional; hides the article everywhere and skips building its page
published: 2026-09-29         # news only, required; orders news newest first, shown in the byline, "Nové" badge for 30 days
author: "MUDr. Krýšová"       # news only, optional; byline
sources:                      # optional external links rendered under the article
  - label: "SVL: Chřipka"
    url: "https://…"
```

`path` must start with the category prefix defined in `src/lib/articles.ts` (`/post/` for news, `/informace-pro-pacienty/<category-slug>/` otherwise); the schema enforces it. Category titles, slugs, and summaries shown on the homepage and the patient index also live in `src/lib/articles.ts`.

## Design

Type: Instrument Serif for headings, Instrument Sans for everything else (fontsource via Astro's fonts API, static weights, latin + latin-ext for Czech). Palette: pastel lime for emphasis and actions, blue-violet for ink and surfaces; all tokens live at the top of `src/styles/base.css`. Visit types on the schedule are coloured through `[data-purpose]` → `--slot`.

Every page has a lavender hero (`--hero-surface`) with a white `.sheet` rising over it; the homepage ends with the ink contact card (`ContactCard.astro`). From 1024px the header carries the navigation and call button; below it the bottom tab bar (`TabBar.astro`) takes over; both read their links from `src/lib/nav.ts`. Below 720px card grids, the homepage news and the clinic cards turn into inset grouped lists; copy that differs between the two layouts uses `.only-wide` / `.only-narrow`.

The schedule is rendered three ways from the same data: the homepage "Dnes je …" card (`TodayCard.astro`; one pre-rendered panel per weekday, the script shows today's and places the "now" marker), a timeline (`OfficeHours.astro`; one row per day, bars positioned with CSS custom properties, list layout below 1024px), and the live status pill (`OfficeStatus.astro`). `BaseLayout` embeds the week as JSON; `src/scripts/office-status.ts` evaluates it in Europe/Prague time (`src/lib/office-status.ts`), fills the pills, the today card and marks today's row. Without JavaScript the pill and today's panel stay hidden and the static schedule remains.

## Structure

```
src/
  components/      Icon, navigation (header, tab bar, logo), footer, page building blocks (PageHero, TopicCard, …), data-driven sections
  content/         Markdown articles
  data/            JSON collections (see table above)
  layouts/         BaseLayout (head, header, footer) → LandingLayout | ArticleLayout
  lib/             site.ts (site data, base-path, contact and map-URL helpers), nav.ts (header/footer/tab-bar links),
                   articles.ts (categories), collections.ts (visible articles, office hours), office-status.ts (open/closed logic)
  pages/           routes; article routes are generated from `path`
  scripts/         client behaviour (site.ts imports office-status.ts)
  styles/          global.css imports base → layout → components → pages → print
tests/             node:test checks run against dist/
```

Internal links must go through `components/navigation/Link.astro` (or `withBase()` from `src/lib/site.ts`) so they get the deployment base path; `npm test` fails on any unprefixed or broken internal link.

## Deployment

Production runs on Cloudflare (Workers static assets) at <https://fajndoktorka.com/>, built with `npm run check && npm test` and deployed with `npx wrangler deploy` (Workers Builds on the GitHub repo does both). Config lives in:

- `wrangler.jsonc`: serves `dist/`, trailing-slash handling matching `trailingSlash: 'always'`, `404.html` for unknown URLs.
- `public/_redirects`: 301s from the old Wix URLs. Sources are percent-encoded.
- `public/_headers`: security headers, a strict CSP (`script-src 'self'`; the build never inlines scripts via `assetsInlineLimit: 0`), and immutable caching for `/_astro/*`. A new third-party embed needs its origin added to the CSP.

`astro.config.mjs` defaults to the production origin at the domain root. The GitHub Pages preview (push to `main` runs `.github/workflows/astro.yml`) sets `SITE_URL` and `SITE_BASE` to build for <https://lecbyjak.github.io/fajndoktorka/>; delete the workflow after the cutover. To preview locally under a subpath: `SITE_URL=https://lecbyjak.github.io SITE_BASE=/fajndoktorka npm run build`.

## SEO

- Every page: title `Page | FajnDoktorka`, meta description, canonical on `baseUrl`, Open Graph + `public/og.png` (1200×630), and a `Physician` JSON-LD block with address, `geo`, phone, e-mail, IČO and `openingHoursSpecification` derived from `office-hours.json`.
- `sitemap-index.xml` (`@astrojs/sitemap`) and `robots.txt` (generated by `src/pages/robots.txt.ts`) follow `site`/`base` from `astro.config.mjs`.
