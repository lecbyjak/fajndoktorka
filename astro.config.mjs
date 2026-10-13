import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Deployed to GitHub Pages under /fajndoktorka/. When moving to the production
// domain, set `site` to 'https://www.fajndoktorka.com' and drop `base`; the
// sitemap, robots.txt and JSON-LD then point at the right origin automatically.
// Canonical URLs always use `baseUrl` from src/data/site.json.
export default defineConfig({
    site: 'https://lecbyjak.github.io',
    base: '/fajndoktorka',
    trailingSlash: 'always',
    integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') })],
    // Static weights on purpose: the variable builds on fontsource carry extra
    // axes (wdth) and weigh several times more than the three weights we use.
    fonts: [
        {
            provider: fontProviders.fontsource(),
            name: 'Instrument Serif',
            cssVariable: '--font-display',
            weights: [400],
            styles: ['normal', 'italic'],
            subsets: ['latin', 'latin-ext'],
            fallbacks: ['Georgia', 'serif'],
        },
        {
            provider: fontProviders.fontsource(),
            name: 'Instrument Sans',
            cssVariable: '--font-sans',
            weights: [400, 500, 600],
            styles: ['normal'],
            subsets: ['latin', 'latin-ext'],
            fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
        },
    ],
});
