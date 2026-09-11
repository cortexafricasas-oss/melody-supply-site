import facts from './facts.json';

/** Valeur d'un fait du registre. Aucun chiffre ecrit a la main (regle d'or n7). */
export function fact(id: string): number {
  const found = facts.facts.find((f) => f.id === id);
  if (!found) throw new Error(`Fait manquant : ${id}`);
  return found.value;
}

const n = (id: string) => new Intl.NumberFormat('en-US').format(fact(id));
const usd = (id: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: fact(id) < 10 ? 2 : 0,
  }).format(fact(id));

/** Mention unique : les prix de reference sont en euros, l'USD est une conversion. */
export const FX_NOTE =
  `USD figures are converted from euro list prices at ${fact('fx.eur.usd')} ` +
  '(rate of 10 September 2026) and move with the exchange rate. ' +
  'Euro prices are the contractual reference.';

/** Le formulaire de devis reste celui du site d'origine (WPForms) : il collecte
 *  pays, objectif, budget, local et superficie. Un site statique ne peut pas
 *  recevoir de soumission ; on y renvoie plutot que d'en promettre un faux. */
export const QUOTE_FORM = 'https://melodychinasupply.com/?page_id=789';

/** WhatsApp : le numero annonce sur le site, multilingue. */
export const WHATSAPP_NUMBER = '+86 131 8895 9052';
export const WHATSAPP_LINK =
  'https://wa.me/8613188959052?text=' +
  encodeURIComponent('Hello Melody Supply, I would like a quote for my store.');

export const PHONE_NUMBER = '+86 175 5135 9860';
export const PHONE_LINK = 'tel:+8617551359860';
export const WECHAT_ID = 'Melody_3565';
export const CONTACT_EMAIL = 'melodychina0505@gmail.com';
export const CONTACT_MAIL = QUOTE_FORM;

export const nav = {
  logoAlt: 'Melody Supply - easy sourcing from China',
  links: [
    { label: 'Products', href: '#products' },
    { label: 'Sourcing', href: '#sourcing' },
    { label: 'Process', href: '#process' },
    { label: 'Services', href: '#services' },
    { label: 'Why us', href: '#why' },
    { label: 'FAQ', href: '#faq' },
  ],
  cta: 'Contact us',
};

export const hero = {
  title: ['Open a dollar store.', 'We supply every shelf.'],
  lede:
    `Direct from Chinese factories: ${n('catalog.items')}+ products across ` +
    `${n('categories.count')} categories, custom shelving, store layout and full ` +
    'equipment. One supplier, one container.',
  stats: [
    { v: `${n('catalog.items')}+`, l: 'products in catalogue' },
    { v: `${n('categories.count')}`, l: 'product categories' },
    { v: `${n('years.experience')} yrs`, l: 'in the Chinese supply chain' },
    { v: `${n('warehouse.sqm')} sqm`, l: 'of own warehousing' },
  ],
  cta: 'Start your store',
  ctaGhost: 'Discover the products',
};

export const products = {
  eyebrow: 'One-stop supply',
  title: `${n('categories.count')} categories. One container.`,
  lede:
    `Two product lines: a one-dollar line sourced between approx. ${usd('unit.cost.min.usd')} and ` +
    `${usd('unit.cost.max.usd')} per unit, and a wider line at mixed price points. Mix freely ` +
    `across categories - the only condition is a total order of approx. ${usd('order.minimum.usd')}, ` +
    'shipping excluded.',
  categories: [
    'Bathroom', 'Kitchen', 'Toys', 'Beauty', 'Stationery', 'Jewellery',
    'Electronics', 'Ceramics', 'Plastics', 'Glass', 'Enamel', 'Stainless steel',
    'Bamboo & wood', 'Knitted cotton', 'Household paper', 'Hardware',
    'Hygiene & cleaning', 'Everyday essentials', 'Handcraft', 'Pendants',
    'Headwear', 'Craft & party', 'New arrivals',
  ],
  points: [
    {
      h: 'Ultra-flexible MOQ',
      p: `Order any item in small quantities and build your own mix. One condition: ${usd('order.minimum.usd')} total order value, shipping excluded.`,
    },
    {
      h: 'Real stock, fast dispatch',
      p: `Our own ${n('warehouse.sqm')} sqm of warehousing keeps products available at stable prices and orders moving quickly.`,
    },
    {
      h: 'Factory pricing, checked quality',
      p: 'We buy at source and inspect in-house before anything is packed.',
    },
    {
      h: 'Everything in one container',
      p: 'Products, shelving and store equipment consolidated into a single shipment.',
    },
  ],
  included: [
    'Best-seller guidance',
    'In-house quality inspection',
    'Photos and video before shipping',
    'Barcode printing',
    'Multi-category consolidation',
    'Freight assistance',
  ],
};

export const sourcing = {
  eyebrow: 'Sourcing service',
  title: 'Your buying team in China.',
  lede:
    'For businesses that want to buy in China without the language barrier, the ' +
    'local practices or the travel. We act as your purchasing office.',
  items: [
    { h: 'Reliable supplier search', p: 'We select factories on capability, quality and stability - not on a marketplace listing.' },
    { h: 'Price negotiation', p: 'We negotiate directly with the factory, at source prices, with no middleman margin.' },
    { h: 'Full project management', p: 'Follow-up, inspection, consolidation and a single shipment for the whole order.' },
  ],
  forWhom: {
    h: 'Built for',
    list: [
      'Physical stores - discount, bazaar, dollar store',
      'Online sellers - Amazon FBA, Shopify, Jumia, Shopee, MercadoLibre',
      'Businesses looking for new reliable suppliers',
      'Private label and own-brand development',
    ],
  },
};

export const process = {
  eyebrow: 'Opening a store',
  title: `${n('process.steps')} steps, from location to opening.`,
  lede:
    'A standardised process: clear, fast and transparent. One dedicated team ' +
    'follows you from the site plan to the goods arriving at your warehouse.',
  steps: [
    { h: 'Site validation', p: 'You pick a location in your country and send us the floor plan and photos of the surroundings.' },
    { h: 'Client account', p: 'After a deposit - fully deductible from the final order - we open your platform access and assign your team.' },
    { h: 'Store design', p: 'Shelf layout and dimensions, promotional space, assortment planning, trolleys, checkouts and stock system.' },
    { h: 'Final validation', p: 'You confirm the product list, the custom shelving, the total weight and the overall volume.' },
    { h: 'Production & packing', p: 'On payment, product preparation and custom shelf manufacturing start immediately.' },
    { h: 'Freight coordination', p: 'Partner freight forwarders for export, sea freight and optional import customs. We assist throughout.' },
    { h: 'Shipping & receipt', p: 'Handover to your carrier. On arrival you collect locally and start fitting out the store.' },
  ],
};

export const services = {
  eyebrow: 'Beyond supply',
  title: 'From layout to a fully working store.',
  lede:
    'What a sourcing agent will not do for you: we design and equip the sales ' +
    'floor, not just fill a container.',
  items: [
    {
      h: 'Product selection & assortment plan',
      p: `Access ${n('catalog.items')}+ products on our platform, with expert guidance to build a balanced, profitable mix for your market. Merchandising advice and recommendations based on international best-sellers.`,
    },
    {
      h: 'Custom layout & floor plan',
      p: `A 2D plan optimised for customer flow and key zones - free from ${n('layout.minimum.sqm')} sqm. Detailed drawings for wall and centre shelving.`,
    },
    {
      h: 'Custom shelf manufacturing',
      p: 'Gondolas, end caps and display units built to your dimensions in our partner factories, shipped with the goods.',
    },
    {
      h: 'Full store equipment',
      p: 'Counters, signage frames, baskets, trolleys, checkout and stock systems - the store arrives complete.',
    },
  ],
};

export const why = {
  eyebrow: 'Why Melody',
  title: `${n('advantages.count')} reasons buyers stay.`,
  items: [
    { h: 'Source pricing', p: 'Factory prices, no marketplace margin stacked on top.' },
    { h: 'Flexible orders', p: 'Small quantities per item, mixed freely across categories.' },
    { h: 'Online selection', p: 'Browse the catalogue and build your order without a sales call.' },
    { h: 'Renewed best-sellers', p: 'New arrivals rotate constantly, so the shelves stay worth revisiting.' },
    { h: 'Complete support', p: 'From assortment planning to freight, one team follows the whole order.' },
    { h: 'Smart systems', p: 'Stock and checkout systems designed for a small retail team.' },
    { h: 'Visual support', p: 'Photos and video of the goods before they ship.' },
    { h: 'Grouped freight', p: 'Multi-category consolidation into a single container.' },
  ],
};

export const model = {
  eyebrow: 'The format',
  title: 'Why dollar stores keep winning.',
  lede:
    'In an uncertain economy, low-price retail wins on a simple promise: small ' +
    'prices, useful products, a pleasant store.',
  items: [
    { h: 'Modern, attractive design', p: 'Bright, clear stores that encourage impulse buying and a pleasant visit.' },
    { h: 'Unbeatable prices', p: `Everything between ${usd('retail.price.min.usd')} and ${usd('retail.price.max.usd')}, which keeps buying simple and margins high.` },
    { h: 'Everyday products', p: 'Essentials selected to meet daily needs, which is what brings customers back.' },
    { h: 'Frequent renewal', p: 'Regular new arrivals keep variety and footfall steady through the year.' },
  ],
};

export const faq = {
  eyebrow: 'Before you ask',
  title: 'The questions buyers actually ask.',
  items: [
    {
      q: 'What is the minimum order?',
      a: `Approx. ${usd('order.minimum.usd')} in goods, shipping excluded. Within that, mix any items and any categories freely - there is no per-item minimum.`,
    },
    {
      q: 'How does shipping work?',
      a: 'We consolidate your whole order into one shipment and propose partner freight forwarders for export, sea freight and optional import customs. You choose the carrier; we assist with the paperwork.',
    },
    {
      q: 'How does ordering work?',
      a: `Select products on our online platform, we confirm the list and the volume, you pay, and production and packing start immediately. See the ${n('process.steps')}-step process above.`,
    },
    {
      q: 'Are you on Alibaba?',
      a: 'We work directly, not through marketplaces. That is what removes the intermediate margin and lets us inspect and consolidate in-house.',
    },
    {
      q: `Are the ${usd('unit.cost.min.usd')} product prices real?`,
      a: `Yes, for the one-euro product line, sourced between ${usd('unit.cost.min.usd')} and ${usd('unit.cost.max.usd')} per unit. The wider line sits at mixed price points.`,
    },
    {
      q: 'Do you supply shelving as well as goods?',
      a: `Yes. Shelving and fixtures are manufactured to your layout and shipped with the goods. The 2D layout plan is free from ${n('layout.minimum.sqm')} sqm.`,
    },
  ],
};

export const contact = {
  eyebrow: 'Get started',
  title: 'Tell us what you are opening.',
  lede:
    'Store type, floor area, destination port, opening date. We reply by email ' +
    `within ${n('reply.days.min')} to ${n('reply.days.max')} working days with an assortment plan and a landed cost.`,
  offers: [
    'Full service for opening your store',
    'Direct, grouped supply across product categories',
    'Product search beyond the catalogue',
    'Your own store brand or product brand',
  ],
  cta: 'Become our client',
  ctaWhatsapp: 'Chat on WhatsApp',
  channels: [
    { label: 'WhatsApp', value: WHATSAPP_NUMBER, note: 'French, English, Spanish, Arabic' },
    { label: 'Phone', value: PHONE_NUMBER, note: '' },
    { label: 'WeChat', value: WECHAT_ID, note: '' },
    { label: 'Email', value: CONTACT_EMAIL, note: '' },
  ],
  reassurance: `A multilingual team, ${n('years.experience')} years of experience, clients across ${n('continents')} continents.`,
};

export const ctaRow = {
  title: 'Three ways to start.',
  items: [
    { h: 'Open your store', p: 'Full setup: assortment, layout, custom shelving and equipment, shipped together.' },
    { h: 'Order our products', p: `Buy from the catalogue across ${n('categories.count')} categories, mixed freely in one container.` },
    { h: 'Product sourcing', p: 'Looking for something outside the catalogue? We find the factory and negotiate for you.' },
  ],
};

export const foot = {
  company: 'Melody Supply',
  tagline: 'Easy sourcing from China',
  email: CONTACT_EMAIL,
  whatsapp: WHATSAPP_NUMBER,
  wechat: WECHAT_ID,
  socials: [
    { label: 'Facebook', href: 'https://www.facebook.com/share/15Li2a5L29V/?mibextid=wwXIfr' },
    { label: 'Instagram', href: 'https://www.instagram.com/melodie_fournisseur_chinois' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@mlodie.fournisseur' },
  ],
};
