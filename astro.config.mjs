import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
    // site: 'https://www.fajndoktorka.com',
    site: 'https://lecbyjak.github.io',
    trailingSlash: 'always',
    fonts: [{
      provider: fontProviders.fontsource(),
      name: "Inter",
      cssVariable: "--font-inter",
      weights: [400, 500, 600, 800],
      subsets: ["latin", "latin-ext"]
    }]
});
