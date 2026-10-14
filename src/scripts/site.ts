// Site-wide client behaviour: back-to-top, live office status, "Nové" news badges.
import "./office-status";

// Badges are pre-rendered hidden with their expiry, so they lapse without a rebuild.
for (const badge of document.querySelectorAll<HTMLElement>("[data-new-until]")) {
    badge.hidden = Date.now() >= Date.parse(badge.dataset.newUntil!);
}

const backToTop = document.querySelector<HTMLButtonElement>(".back-to-top");
window.addEventListener(
    "scroll",
    () => {
        backToTop?.classList.toggle("is-visible", window.scrollY > 700);
    },
    { passive: true },
);

backToTop?.addEventListener("click", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
});
