/**
 * Motion au defilement, sans bibliotheque.
 * - revelation en cascade des elements marques [data-reveal]
 * - parallaxe douce sur le heros
 * - barre de progression de lecture
 * - barre de navigation qui se condense
 * Tout est desactive si l'utilisateur demande moins d'animation.
 */
const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function startMotion(): () => void {
  if (typeof window === 'undefined') return () => {};

  const cleanups: Array<() => void> = [];

  if (reduced()) {
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      el.dataset.revealed = 'true';
    });
    return () => {};
  }

  // 1. Revelation en cascade
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const group = el.parentElement;
        const index = group ? [...group.children].indexOf(el) : 0;
        el.style.transitionDelay = `${Math.min(index * 70, 420)}ms`;
        el.dataset.revealed = 'true';
        io.unobserve(el);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
  );
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => io.observe(el));
  cleanups.push(() => io.disconnect());

  // 2. Parallaxe du heros + 3. progression de lecture + 4. nav condensee
  const media = document.querySelector<HTMLElement>('.hero__media');
  const bar = document.querySelector<HTMLElement>('.progress');
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
      if (bar) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${h > 0 ? Math.min(y / h, 1) : 0})`;
      }
      if (nav) nav.classList.toggle('is-stuck', y > 40);
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  cleanups.push(() => window.removeEventListener('scroll', onScroll));

  return () => cleanups.forEach((fn) => fn());
}
