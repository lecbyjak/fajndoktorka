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

export function phoneHref(phone: string): string {
    return `tel:${phone.replaceAll(" ", "")}`;
}

export function fullAddress({ address }: SiteData): string {
    return `${address.street}, ${address.postalCode} ${address.locality}`;
}

export function mapsSearchUrl(site: SiteData): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress(site))}`;
}

export function byOrder<T extends { data: { order: number } }>(a: T, b: T): number {
    return a.data.order - b.data.order;
}
