// Article categories: single source for URL prefixes, anchors on the patient
// index page, and labels. Kept free of `astro:content` imports so the content
// schema (src/content.config.ts) can use it for validation.

export const PATIENT_INFO_PATH = "/informace-pro-pacienty/";
export const NEWS_PATH = "/post/";

export const patientCategories = {
    medical: {
        title: "Léčba a domácí péče",
        slug: "lecba-a-domaci-pece",
        summary: "Srozumitelné informace k častým nemocem, léčbě a domácí péči.",
    },
    prevention: {
        title: "Prevence a očkování",
        slug: "prevence-a-ockovani",
        summary: "Přehled preventivní péče a očkování pro děti i dospělé.",
    },
    practical: {
        title: "Praktické informace",
        slug: "prakticke-informace",
        summary: "Odpovědi na administrativní a praktické otázky, které řešíme nejčastěji.",
    },
} as const;

export type PatientCategory = keyof typeof patientCategories;
export type ArticleCategory = PatientCategory | "news";

export const articleCategories = ["medical", "prevention", "practical", "news"] as const satisfies ArticleCategory[];

/** URL prefix every article of the category must live under; enforced by the content schema. */
export function categoryPathPrefix(category: ArticleCategory): string {
    return category === "news" ? NEWS_PATH : `${PATIENT_INFO_PATH}${patientCategories[category].slug}/`;
}

/** Link to the category section on the patient index page. */
export function categoryAnchor(category: PatientCategory): string {
    return `${PATIENT_INFO_PATH}#${patientCategories[category].slug}`;
}
