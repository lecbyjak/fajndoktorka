import { getCollection, type CollectionEntry } from "astro:content";

type SiteData = CollectionEntry<"site">["data"];

export async function getSite(): Promise<SiteData | undefined> {
    return (await getCollection("site"))[0]?.data;
}

export function phoneHref(phone: string): string {
    return `tel:${phone.replaceAll(" ", "")}`;
}

export function siteUrl(path: string, baseUrl: string | URL): URL {
    return new URL(path, baseUrl);
}
