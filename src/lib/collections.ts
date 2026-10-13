// Typed loaders over the content collections, so pages share one definition
// of "visible" and "in order".
import { getCollection, type CollectionEntry } from "astro:content";
import type { ArticleCategory } from "./articles";
import type { WeekDay } from "./office-status";

/** Articles with `visible: true` (optionally of one category), sorted by `navigationOrder`. */
export async function getArticles(category?: ArticleCategory): Promise<CollectionEntry<"articles">[]> {
    const entries = await getCollection(
        "articles",
        ({ data }) => data.visible && (category === undefined || data.category === category),
    );
    return entries.sort((a, b) => a.data.navigationOrder - b.data.navigationOrder);
}

/** Office hours from `src/data/office-hours.json`, Monday first, in the shape the client status script consumes. */
export async function getWeek(): Promise<WeekDay[]> {
    const entries = await getCollection("officeHours");
    return entries
        .map(({ data }) => ({ weekday: data.weekday, day: data.day, clinician: data.clinician, slots: data.slots }))
        .sort((a, b) => a.weekday - b.weekday);
}
