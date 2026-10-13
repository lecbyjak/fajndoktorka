// Site-wide client behaviour: mobile navigation, back-to-top, live office status.
import "./office-status";

const menuButton = document.querySelector<HTMLButtonElement>(".menu-toggle");
const navigation = document.querySelector<HTMLElement>("#site-navigation");

function setMenu(open: boolean) {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Zavřít menu" : "Otevřít menu");
    navigation.dataset.open = String(open);
    document.documentElement.classList.toggle("menu-open", open);
}

menuButton?.addEventListener("click", () => {
    setMenu(menuButton.getAttribute("aria-expanded") !== "true");
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton?.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        menuButton.focus();
    }
});

navigation?.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) setMenu(false);
});

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
