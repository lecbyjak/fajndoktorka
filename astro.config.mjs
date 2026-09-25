import { defineConfig, fontProviders } from 'astro/config';

// Deployed to GitHub Pages under /fajndoktorka/. When moving to the production
// domain, set `site` to 'https://www.fajndoktorka.com' and drop `base`.
// Canonical URLs always use `baseUrl` from src/data/site.json.
export default defineConfig({
    site: 'https://lecbyjak.github.io',
    base: '/fajndoktorka',
    trailingSlash: 'always',
    fonts: [{
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [400, 500, 600, 800],
      subsets: ['latin', 'latin-ext'],
    }],
});
