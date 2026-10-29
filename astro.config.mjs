import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Defaults target production (Cloudflare, domain root). The GitHub Pages preview
// sets SITE_URL and SITE_BASE in .github/workflows/astro.yml. The sitemap,
// robots.txt and JSON-LD follow `site`/`base`; canonical URLs always use
// `baseUrl` from src/data/site.json.
export default defineConfig({
    site: process.env.SITE_URL ?? 'https://fajndoktorka.com',
    base: process.env.SITE_BASE,
    trailingSlash: 'always',
    // Never inline scripts into the HTML, so the CSP in public/_headers can stay `script-src 'self'`.
    vite: { build: { assetsInlineLimit: 0 } },
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
