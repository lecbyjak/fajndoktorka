// Generated so the sitemap URL follows `site`/`base` from astro.config.mjs.
// Only effective once served from the domain root (custom domain), not from
// the /fajndoktorka/ project path on GitHub Pages.
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
    const sitemap = new URL(`${import.meta.env.BASE_URL.replace(/\/$/, "")}/sitemap-index.xml`, site);
    return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
};
