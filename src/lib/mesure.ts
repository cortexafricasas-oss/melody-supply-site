/**
 * Mesure d'audience, cote page.
 *
 * Ecrite le 13 septembre 2026 : une campagne publicitaire tournait, 6 clics
 * payes etaient arrives, et rien ne permettait de savoir ce qu'ils avaient fait.
 *
 * Aucun cookie, aucun identifiant, aucune adresse IP. On ne peut pas reconnaitre
 * quelqu'un d'une visite a l'autre, et c'est voulu : ce qu'on ne detient pas
 * n'est pas a proteger, et cela dispense de banniere de consentement.
 *
 * DEUX lignes sont envoyees par visite, et c'est deliberé :
 *
 *   1. a l'arrivee, sans duree. Elle garantit que la visite est comptee meme si
 *      le navigateur est ferme brutalement ;
 *   2. au depart, avec la profondeur atteinte et le temps passe.
 *
 * A la lecture : les lignes sans duree comptent les ARRIVEES, celles avec duree
 * racontent la LECTURE. Une arrivee sans depart correspondant est un rebond si
 * brutal qu'il n'a pas laisse le temps d'un evenement.
 */
const POINT = 'https://muflighiudxzeefozwtv.supabase.co/functions/v1/vue';

/** « text/plain » evite la requete preliminaire CORS : elle ne se termine pas
 *  toujours quand la page se ferme, et on perdrait la mesure de sortie. Le
 *  serveur lit le corps comme du JSON quel que soit l'en-tete. */
function envoyer(charge: Record<string, unknown>): void {
  try {
    fetch(POINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(charge),
      keepalive: true,            // survit a la fermeture de l'onglet
    }).catch(() => undefined);
  } catch {
    /* Une mesure ratee ne doit jamais se voir sur la page. */
  }
}

/** Les hotes ou la mesure n'a aucun sens : une previsualisation locale n'a pas
 *  de visiteurs, et la fonction refuse de toute facon une origine qu'elle ne
 *  connait pas. Sans ce garde-fou, chaque revue locale produit une erreur CORS
 *  en console — du bruit permanent, qui finit par faire ignorer les vraies. */
const HORS_PRODUCTION = /^(localhost|127\.0\.0\.1|\[::1\])$/;

export function mesurer(): () => void {
  if (typeof window === 'undefined') return () => {};
  if (HORS_PRODUCTION.test(window.location.hostname)) return () => {};

  const debut = Date.now();
  const chemin = window.location.pathname;
  let maximum = 0;

  envoyer({
    chemin,
    source: document.referrer || null,
    largeur: window.innerWidth,
  });

  const suivre = () => {
    const hauteur = document.documentElement.scrollHeight - window.innerHeight;
    const atteint = hauteur > 0
      ? Math.round(((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100)
      : 100;
    if (atteint > maximum) maximum = Math.min(100, atteint);
  };

  let envoye = false;
  const partir = () => {
    if (envoye) return;           // une seule ligne de sortie par visite
    envoye = true;
    envoyer({
      chemin,
      source: document.referrer || null,
      largeur: window.innerWidth,
      profondeur: maximum,
      duree: Math.round((Date.now() - debut) / 1000),
    });
  };

  const surVisibilite = () => {
    if (document.visibilityState === 'hidden') partir();
  };

  suivre();
  window.addEventListener('scroll', suivre, { passive: true });
  document.addEventListener('visibilitychange', surVisibilite);
  // « pagehide » attrape Safari iOS, qui ne declenche pas toujours l'autre.
  window.addEventListener('pagehide', partir);

  return () => {
    window.removeEventListener('scroll', suivre);
    document.removeEventListener('visibilitychange', surVisibilite);
    window.removeEventListener('pagehide', partir);
  };
}
