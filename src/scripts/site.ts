export {};

const menuButton = document.querySelector<HTMLButtonElement>('.menu-toggle');
const navigation = document.querySelector<HTMLElement>('#site-navigation');

function closeMenu({ restoreFocus = false } = {}) {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Otevřít menu');
  navigation.dataset.open = 'false';
  if (restoreFocus) menuButton.focus();
}

menuButton?.addEventListener('click', () => {
  if (!navigation) return;
  const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(willOpen));
  menuButton.setAttribute('aria-label', willOpen ? 'Zavřít menu' : 'Otevřít menu');
  navigation.dataset.open = String(willOpen);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    closeMenu({ restoreFocus: true });
  }
});

navigation?.addEventListener('click', (event) => {
  if (event.target instanceof Element && event.target.closest('a')) closeMenu();
});

const backToTop = document.querySelector<HTMLButtonElement>('.back-to-top');
window.addEventListener('scroll', () => {
  backToTop?.classList.toggle('is-visible', window.scrollY > 700);
}, { passive: true });

backToTop?.addEventListener('click', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});
