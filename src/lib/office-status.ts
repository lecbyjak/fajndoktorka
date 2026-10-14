// "Is the practice open right now", evaluated in Europe/Prague time.
// Shared by the build (payload shape, timeline positions) and the client script.

export type Purpose = "acute" | "appointment" | "prebooked" | "vaccination-and-sampling";

export interface Slot {
    /** HH:MM */
    from: string;
    to: string;
    purpose: Purpose;
}

export interface WeekDay {
    /** ISO weekday: 1 = Monday … 7 = Sunday. */
    weekday: number;
    day: string;
    clinician: string;
    slots: Slot[];
}

export interface OfficeStatus {
    open: boolean;
    /** "Otevřeno" / "Zavřeno". */
    label: string;
    /** "do 14:30" while open, "zítra od 07:30" while closed; empty without any upcoming slot. */
    detail: string;
    /** Schedule row to highlight as "today" (undefined on weekends). */
    todayWeekday?: number;
}

export const purposeLabels: Record<Purpose, string> = {
    acute: "Akutní pacienti",
    appointment: "Objednaní pacienti",
    prebooked: "Pouze předem objednaní",
    "vaccination-and-sampling": "Očkování a odběry",
};

/** Compact legend labels for the homepage "today" bar. */
export const purposeShortLabels: Record<Purpose, string> = {
    acute: "Akutní",
    appointment: "Objednaní",
    prebooked: "Předem objednaní",
    "vaccination-and-sampling": "Očkování a odběry",
};

const WEEKDAY_INDEX: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
const DAY_LOCATIVE: Record<number, string> = {
    1: "v pondělí", 2: "v úterý", 3: "ve středu", 4: "ve čtvrtek", 5: "v pátek", 6: "v sobotu", 7: "v neděli",
};

/** "13:30" → 13.5; used both for comparisons and for timeline bar positions. */
export function toHours(time: string): number {
    const [h, m] = time.split(":").map(Number);
    return h + m / 60;
}

/** Current Prague weekday and decimal hour, regardless of the visitor's zone. */
export function pragueNow(date = new Date()): { weekday: number; hour: number } {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Europe/Prague", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(date);
    const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
    return { weekday: WEEKDAY_INDEX[get("weekday")], hour: Number(get("hour")) + Number(get("minute")) / 60 };
}

export function officeStatus(week: WeekDay[], now: { weekday: number; hour: number }): OfficeStatus {
    const today = week.find((day) => day.weekday === now.weekday);
    const slots = today?.slots ?? [];
    const currentIndex = slots.findIndex((slot) => toHours(slot.from) <= now.hour && now.hour < toHours(slot.to));
    if (currentIndex !== -1) {
        // Back-to-back slots read as one opening: report when the whole run ends.
        let closes = slots[currentIndex].to;
        for (const slot of slots.slice(currentIndex + 1)) {
            if (slot.from !== closes) break;
            closes = slot.to;
        }
        return { open: true, label: "Otevřeno", detail: `do ${closes}`, todayWeekday: now.weekday };
    }
    // Next opening: later today, or the first slot of the next scheduled day.
    for (let ahead = 0; ahead <= 7; ahead++) {
        const weekday = ((now.weekday - 1 + ahead) % 7) + 1;
        const slot = week.find((day) => day.weekday === weekday)?.slots.find((s) => ahead > 0 || toHours(s.from) > now.hour);
        if (slot) {
            const when = ahead === 0 ? "dnes" : ahead === 1 ? "zítra" : DAY_LOCATIVE[weekday];
            return { open: false, label: "Zavřeno", detail: `${when} od ${slot.from}`, todayWeekday: today?.weekday };
        }
    }
    return { open: false, label: "Zavřeno", detail: "", todayWeekday: today?.weekday };
}
