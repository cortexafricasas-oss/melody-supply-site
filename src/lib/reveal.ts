/**
 * Motion au defilement, sans bibliotheque.
 * - parallaxe douce sur le heros
 * - barre de navigation qui se condense
 *
 * La revelation en cascade a ete retiree : sur un telephone lent, elle laissait
 * des zones vides tant que l'observateur ne s'etait pas declenche. Le contenu
 * doit etre lisible des la premiere image affichee, sans exception.
 * Tout est desactive si l'utilisateur demande moins d'animation.
 */
const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function startMotion(): () => void {
  if (typeof window === 'undefined' || reduced()) return () => {};

  const media = document.querySelector<HTMLElement>('.hero__media');
  const nav = document.querySelector<HTMLElement>('.nav');
  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (media && y < window.innerHeight * 1.2) {
        media.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(1.06)`;
      }
      if (nav) nav.classList.toggle('is-stuck', y > 40);
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  return () => window.removeEventListener('scroll', onScroll);
}
