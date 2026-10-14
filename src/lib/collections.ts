// Typed loaders over the content collections, so pages share one definition
// of "visible" and "in order".
import { getCollection, type CollectionEntry } from "astro:content";
import type { ArticleCategory } from "./articles";
import type { WeekDay } from "./office-status";

type ArticleEntry = CollectionEntry<"articles">;
export type NewsEntry = ArticleEntry & { data: Extract<ArticleEntry["data"], { category: "news" }> };

const isNews = (entry: ArticleEntry): entry is NewsEntry => entry.data.category === "news";

// News sorts by negated timestamp (newest first), patient articles by `navigationOrder`.
const sortKey = ({ data }: ArticleEntry): number => (data.category === "news" ? -data.published.getTime() : data.navigationOrder);

/** Articles with `visible: true` (optionally of one category). News is newest first, everything else by `navigationOrder`. */
export async function getArticles(category?: ArticleCategory): Promise<ArticleEntry[]> {
    const entries = await getCollection(
        "articles",
        ({ data }) => data.visible && (category === undefined || data.category === category),
    );
    return entries.sort((a, b) => sortKey(a) - sortKey(b));
}

/** Visible news, newest first. */
export async function getNews(): Promise<NewsEntry[]> {
    return (await getArticles("news")).filter(isNews);
}

/** Office hours from `src/data/office-hours.json`, Monday first, in the shape the client status script consumes. */
export async function getWeek(): Promise<WeekDay[]> {
    const entries = await getCollection("officeHours");
    return entries
        .map(({ data }) => ({ weekday: data.weekday, day: data.day, clinician: data.clinician, slots: data.slots }))
        .sort((a, b) => a.weekday - b.weekday);
}
