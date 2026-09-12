/**
 * Motion au defilement, sans bibliotheque.
 * - parallaxe douce sur le heros
 * - barre de navigation qui se condense
 * - revelation en cascade des blocs
 *
 * La cascade avait ete retiree le 11 septembre : sur un telephone lent, des
 * blocs restaient vides. La cause n'etait pas l'animation mais l'ordre des
 * choses — le CSS masquait des son chargement, et le JavaScript, arrive bien
 * plus tard, devait rendre visible. Entre les deux la page etait trouee, et si
 * le JS ne tournait jamais elle le restait.
 *
 * Elle revient avec la logique inversee : le CSS ne masque plus rien tout seul.
 * Il ne masque que sous « html.js-reveal », posee ici, apres verification
 * qu'IntersectionObserver existe. Pas de JS, pas de masquage : la page perd son
 * animation, jamais son contenu.
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

/** Delai au-dela duquel on cesse d'attendre l'observateur. Un bloc non revele
 *  n'est pas un bloc discret, c'est un bloc perdu. */
const FILET_MS = 1200;

export function startReveals(): () => void {
  // Deux raisons de ne rien faire, et dans les deux cas la page reste telle
  // quelle, entierement visible : l'utilisateur demande moins d'animation, ou
  // le navigateur n'a pas d'observateur.
  if (typeof window === 'undefined' || reduced() || !('IntersectionObserver' in window)) {
    return () => {};
  }

  const cibles = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
  if (!cibles.length) return () => {};

  // C'est cette ligne qui autorise le CSS a masquer. Elle n'est jamais atteinte
  // si quoi que ce soit en amont a echoue.
  document.documentElement.classList.add('js-reveal');

  const montrer = (el: HTMLElement) => el.setAttribute('data-revealed', 'true');

  const io = new IntersectionObserver(
    (entrees) => {
      for (const e of entrees) {
        if (!e.isIntersecting) continue;
        montrer(e.target as HTMLElement);
        io.unobserve(e.target);
      }
    },
    // Une marge basse declenche un peu avant l'entree a l'ecran : le bloc est
    // deja en place quand le regard y arrive.
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );

  for (const el of cibles) io.observe(el);

  // Ce qui est deja a l'ecran au chargement ne doit pas attendre un defilement.
  const filet = window.setTimeout(() => {
    for (const el of cibles) montrer(el);
    io.disconnect();
  }, FILET_MS);

  return () => {
    window.clearTimeout(filet);
    io.disconnect();
  };
}
