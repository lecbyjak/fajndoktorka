// Site pages that appear in the header, footer and bottom tab bar, defined once.
// `short` is the compact label used where space is tight (tab bar).

export interface NavPage {
    href: string;
    label: string;
    short?: string;
}

export const pages = {
    home: { href: "/", label: "Domů" },
    practice: { href: "/o-ordinaci/", label: "O ordinaci" },
    team: { href: "/o-nas/", label: "Náš tým" },
    hours: { href: "/ordinacni-hodiny/", label: "Ordinační hodiny", short: "Hodiny" },
    patients: { href: "/informace-pro-pacienty/", label: "Pro pacienty" },
    prices: { href: "/cenik/", label: "Ceník" },
    contact: { href: "/mapa/", label: "Kontakt" },
    equipment: { href: "/pristroje/", label: "Přístroje" },
    news: { href: "/blog/", label: "Aktuality" },
} satisfies Record<string, NavPage>;

/** Desktop header navigation (from 1024px). */
export const headerNav: NavPage[] = [pages.practice, pages.team, pages.hours, pages.patients, pages.prices, pages.contact];

/** Secondary pages that are not in the header. */
export const footerNav: NavPage[] = [pages.practice, pages.team, pages.equipment, pages.news];
/** Bottom tab bar order (below 1024px). */
export const tabNav: NavPage[] = [pages.home, pages.hours, pages.patients, pages.prices, pages.contact];
