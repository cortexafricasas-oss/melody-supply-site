import facts from './facts.json';
import { formatNumber } from './lib/format';

/** Valeur d'un fait du registre. Aucun chiffre n'est écrit à la main (règle d'or n°7). */
export function fact(id: string): number {
  const found = facts.facts.find((f) => f.id === id);
  if (!found) throw new Error(`Fait manquant : ${id}`);
  return found.value;
}

/** Format anglais (en-US), le site s'adresse au marché américain. */
const n = (id: string) => new Intl.NumberFormat('en-US').format(fact(id));

export { formatNumber };

export const QUOTE_MAIL =
  'mailto:melodychina0505@gmail.com' +
  '?subject=' + encodeURIComponent('Quote request — Melody Supply') +
  '&body=' + encodeURIComponent(
    'Store type (dollar store, variety, supermarket):\n\n' +
    'Number of stores:\n\n' +
    'Destination country / port:\n\n' +
    'What you need (sourcing only, or full store setup):\n\n' +
    'Target opening date:\n',
  );

export const nav = {
  logoAlt: 'Melody Supply — easy sourcing from China',
  cta: 'Get a quote',
};

export const hero = {
  title: ['Open a dollar store.', 'We supply every shelf.'],
  lede:
    'Melody Supply sources direct from Chinese factories and sets up the whole ' +
    'store — assortment, fixtures, shelving, restock. Not just a container.',
  stats: [
    { value: `${n('catalog.items')}+`, label: 'SKUs in catalogue' },
    { value: `${n('years.experience')} years`, label: 'in Chinese supply chain' },
    { value: `${n('clients.count')}+`, label: 'retailers served' },
  ],
  cta: 'Get a quote',
  ctaGhost: 'See how it works',
};

export const route = {
  eyebrow: 'Factory to shelf',
  title: 'Five steps. One supplier.',
  lede:
    'Most sourcing agents stop at the port. We keep going until the shelves are ' +
    'full and the store is trading.',
  steps: [
    {
      n: '1', h: 'Source',
      p: 'Direct factory access, no middlemen. We negotiate, inspect and consolidate.',
      img: 'step-source.webp',
      alt: 'Rows of pallets wrapped in stretch film in a warehouse, receding in orderly lines',
    },
    {
      n: '2', h: 'Assort',
      p: 'A category plan built for your floor size, your price points and your local demand.',
      img: 'step-restock.webp',
      alt: 'Neat stacks of plain cardboard boxes squared off on a wooden pallet',
    },
    {
      n: '3', h: 'Fixture',
      p: 'Custom shelving and layout design, manufactured and shipped with the goods.',
      img: 'step-fixture.webp',
      alt: 'Newly installed empty steel shelving in a bare retail space with a yellow floor line',
    },
    {
      n: '4', h: 'Ship',
      p: 'Consolidated loading, export documents and delivery to your port or door.',
      img: 'step-ship.webp',
      alt: 'Concrete loading dock with a half-open roller door and a yellow safety line',
    },
    {
      n: '5', h: 'Restock',
      p: 'Reorder what sells through an online selection platform. Same catalogue, same prices.',
      img: 'step-source.webp',
      alt: 'Warehouse aisle stocked with cartons ready for reorder',
    },
  ],
};

export const services = {
  eyebrow: 'Beyond supply',
  title: 'What a sourcing agent will not do for you.',
  items: [
    { h: 'Store concept design', p: 'Floor plan, customer flow and category zoning, drawn before a single box ships.' },
    { h: 'Strategic assortment plan', p: 'Which SKUs, at which price points, in which quantities — matched to your market.' },
    { h: 'Custom shelving manufacture', p: 'Gondolas, end caps and display units built to your dimensions in our partner factories.' },
    { h: 'Full store equipment', p: 'Counters, signage frames, baskets, lighting — the store arrives complete.' },
    { h: 'Online selection platform', p: 'Browse the catalogue, build your order and reorder what sells, without a sales call.' },
    { h: 'Product development', p: 'Private label and packaging development when an off-the-shelf SKU is not enough.' },
  ],
};

export const figures = {
  eyebrow: 'Track record',
  title: 'The numbers behind the shelves.',
  items: [
    { value: `${n('catalog.items')}+`, label: 'first-necessity SKUs available to order' },
    { value: `${n('years.experience')}`, label: 'years operating inside the Chinese supply chain' },
    { value: `${n('clients.count')}+`, label: 'retailers supplied, from single stores to chains' },
  ],
  note:
    'Figures declared by Melody Supply. Client references and named testimonials ' +
    'are available on request.',
};

export const faq = {
  eyebrow: 'Before you ask',
  title: 'The questions buyers actually ask.',
  items: [
    { q: 'What is the minimum order?',
      a: 'It depends on the assortment and the destination. Tell us your store size and we will come back with a realistic first order.' },
    { q: 'Do you ship to the United States?',
      a: 'Yes, and internationally. We consolidate and handle export documents; you choose port or door delivery.' },
    { q: 'Can you supply shelving as well as goods?',
      a: 'Yes. Shelving and fixtures are manufactured to your layout and shipped with the goods, in the same consolidation.' },
    { q: 'Do you do private label?',
      a: 'Yes, including packaging development. It lengthens lead times, so we plan it from the first order.' },
    { q: 'How do I reorder?',
      a: 'Through the online selection platform. Same catalogue, same pricing, no sales call needed.' },
  ],
};

export const quote = {
  title: 'Tell us what you are opening.',
  lede:
    'Store type, floor size, destination port, opening date. We come back with an ' +
    'assortment plan and a landed cost.',
  cta: 'Get a quote',
};

export const foot = {
  company: 'Melody Supply',
  tagline: 'Easy sourcing from China',
  email: 'melodychina0505@gmail.com',
  socials: [
    { label: 'Facebook', href: 'https://www.facebook.com/share/15Li2a5L29V/?mibextid=wwXIfr' },
    { label: 'Instagram', href: 'https://www.instagram.com/melodie_fournisseur_chinois' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@mlodie.fournisseur' },
  ],
};
