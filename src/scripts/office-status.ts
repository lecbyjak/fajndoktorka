// Live "open now" state. BaseLayout embeds the schedule as JSON so the page
// stays static; this annotates it with the visitor's current Prague time:
// status pills, today's row in the week timeline, and the homepage "today" card.
import { officeStatus, pragueNow, type WeekDay } from "../lib/office-status";

const week: WeekDay[] = JSON.parse(document.querySelector("#office-hours-json")?.textContent ?? "[]");
const weekdayName = new Intl.DateTimeFormat("cs", { timeZone: "Europe/Prague", weekday: "long" });
const longDate = new Intl.DateTimeFormat("cs", { timeZone: "Europe/Prague", day: "numeric", month: "long", year: "numeric" });

function renderTodayCard(card: HTMLElement, date: Date, now: { weekday: number; hour: number }) {
    card.querySelector("[data-today-title]")!.textContent = `Dnes je ${weekdayName.format(date)}`;
    card.querySelector("[data-today-date]")!.textContent = longDate.format(date);
    const panels = card.querySelectorAll<HTMLElement>("[data-today-day]");
    const match = [...panels].find((panel) => panel.dataset.todayDay === String(now.weekday));
    for (const panel of panels) panel.hidden = panel !== (match ?? card.querySelector("[data-today-day='closed']"));

    const marker = match?.querySelector<HTMLElement>("[data-today-now]");
    if (!marker) return;
    const start = Number(marker.dataset.start);
    const end = Number(marker.dataset.end);
    marker.hidden = now.hour < start || now.hour > end;
    marker.style.left = `${((now.hour - start) / (end - start)) * 100}%`;
}

function render() {
    const date = new Date();
    const now = pragueNow(date);
    const status = officeStatus(week, now);
    for (const element of document.querySelectorAll<HTMLElement>("[data-office-status]")) {
        element.dataset.open = String(status.open);
        element.querySelector("[data-office-label]")!.textContent = status.label;
        element.querySelector("[data-office-detail]")!.textContent = status.detail;
        element.querySelector<HTMLElement>(".office-status-detail")!.hidden = status.detail === "";
        element.hidden = false;
    }
    for (const row of document.querySelectorAll<HTMLElement>("[data-weekday]")) {
        row.classList.toggle("is-today", Number(row.dataset.weekday) === status.todayWeekday);
    }
    const card = document.querySelector<HTMLElement>("[data-today]");
    if (card) renderTodayCard(card, date, now);
}

if (week.length > 0) {
    render();
    setInterval(render, 60_000);
}
