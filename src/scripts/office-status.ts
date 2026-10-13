// Live "open now" state. BaseLayout embeds the schedule as JSON so the page
// stays static; this annotates it with the visitor's current Prague time.
import { officeStatus, pragueNow, type WeekDay } from "../lib/office-status";

const week: WeekDay[] = JSON.parse(document.querySelector("#office-hours-json")?.textContent ?? "[]");

function render() {
    const status = officeStatus(week, pragueNow());
    for (const element of document.querySelectorAll<HTMLElement>("[data-office-status]")) {
        element.dataset.open = String(status.open);
        element.querySelector("[data-office-label]")!.textContent = status.label;
        element.querySelector("[data-office-detail]")!.textContent = status.detail;
        element.hidden = false;
    }
    for (const row of document.querySelectorAll<HTMLElement>("[data-weekday]")) {
        row.classList.toggle("is-today", Number(row.dataset.weekday) === status.todayWeekday);
    }
}

if (week.length > 0) {
    render();
    setInterval(render, 60_000);
}
