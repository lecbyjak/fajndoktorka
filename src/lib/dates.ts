// Front-matter dates are YAML dates (UTC midnight); format them in UTC so the day never shifts.

const czech = new Intl.DateTimeFormat("cs-CZ", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** "29. září 2026" */
export const czechDate = (date: Date): string => czech.format(date);

/** "2026-09-29", for `<time datetime>`. */
export const isoDate = (date: Date): string => date.toISOString().slice(0, 10);
