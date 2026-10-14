import { getCollection, type CollectionEntry } from "astro:content";

export type SiteData = CollectionEntry<"site">["data"];

/** Clinic contact data from `src/data/site.json`. Every page depends on it, so a missing entry fails the build. */
export async function getSite(): Promise<SiteData> {
    const [entry] = await getCollection("site");
    if (!entry) throw new Error("src/data/site.json must contain one clinic entry");
    return entry.data;
}

/** Prefixes a root-relative path with the configured `base` (GitHub Pages serves the site from a subdirectory). */
export function withBase(path: string): string {
    if (!path.startsWith("/")) return path;
    return `${import.meta.env.BASE_URL.replace(/\/$/, "")}${path}`;
}

/** Phone number without spaces, as used in `tel:` links and structured data. */
export function phoneDigits(phone: string): string {
    return phone.replaceAll(" ", "");
}

export function phoneHref(phone: string): string {
    return `tel:${phoneDigits(phone)}`;
}

export function fullAddress({ address }: SiteData): string {
    return `${address.street}, ${address.postalCode} ${address.locality}`;
}

function mapsQuery(site: SiteData): string {
    return encodeURIComponent(fullAddress(site));
}

export function mapsSearchUrl(site: SiteData): string {
    return `https://www.google.com/maps/search/?api=1&query=${mapsQuery(site)}`;
}

export function mapsDirectionsUrl(site: SiteData): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery(site)}`;
}

export function mapsEmbedUrl(site: SiteData): string {
    return `https://www.google.com/maps?q=${mapsQuery(site)}&output=embed`;
}

export function byOrder<T extends { data: { order: number } }>(a: T, b: T): number {
    return a.data.order - b.data.order;
}

/** Whether `currentPath` (without the base) is `href` or a page beneath it; drives `aria-current` in the navigation. */
export function isCurrentSection(currentPath: string, href: string): boolean {
    const path = decodeURI(currentPath).replace(/\/+$/, "");
    const target = href.replace(/\/+$/, "");
    return target === "" ? path === "" : path === target || path.startsWith(`${target}/`);
}
