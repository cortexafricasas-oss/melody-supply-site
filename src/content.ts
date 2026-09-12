import facts from './facts.json';

/** Valeur d'un fait du registre. Aucun chiffre ecrit a la main (regle d'or n7). */
export function fact(id: string): number {
  const found = facts.facts.find((f) => f.id === id);
  if (!found) throw new Error(`Fait manquant : ${id}`);
  return found.value;
}

const n = (id: string) => new Intl.NumberFormat('en-US').format(fact(id));
const usd = (id: string) => {
  const v = fact(id);
  // Les centimes n'apparaissent que s'ils existent : « $12 », jamais « $12.00 »,
  // et « $0.25 » garde les siens.
  const decimals = Number.isInteger(v) ? 0 : 2;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(v);
};

/** Le formulaire de devis reste celui du site d'origine (WPForms) : il collecte
 *  pays, objectif, budget, local et superficie. Un site statique ne peut pas
 *  recevoir de soumission ; on y renvoie plutot que d'en promettre un faux. */
export const QUOTE_FORM = 'https://melodychinasupply.com/?page_id=789';

/** WhatsApp : le numero annonce sur le site, multilingue. */
export const WHATSAPP_NUMBER = '+86 193 1668 2193';
export const WHATSAPP_LINK =
  'https://wa.me/8619316682193?text=' +
  encodeURIComponent('Hello Melody Supply, I would like a quote for my store.');

export const CONTACT_EMAIL = 'contact@melodysupplyco.com';
export const CONTACT_MAIL = QUOTE_FORM;

export const nav = {
  logoAlt: 'Melody Supply, easy sourcing from China',
  links: [
    { label: 'Products', href: '#products' },
    { label: 'Catalog', href: '#catalogue' },
    { label: 'Sourcing', href: '#sourcing' },
    { label: 'Answers', href: '#objections' },
    { label: 'Process', href: '#process' },
    { label: 'The store', href: '#store' },
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
    { v: `${n('catalog.items')}+`, l: 'products in catalog' },
    { v: `${n('categories.count')}`, l: 'product categories' },
    { v: `${n('years.experience')} years`, l: 'in the Chinese supply chain' },
    { v: `${n('warehouse.sqft')} sq ft`, l: 'of own warehousing' },
    { v: `< ${n('process.weeks')} weeks`, l: 'concept to shipping' },
  ],
  cta: 'Start your store',
  ctaGhost: 'Discover the products',
};

export const products = {
  title: `${n('categories.count')} categories. One container.`,
  lede:
    `Two product lines: a one-dollar line sourced between ${usd('unit.cost.min.usd')} and ` +
    `${usd('unit.cost.max.usd')} per unit, and a wider line at mixed price points. Mix freely ` +
    `across categories — the only condition is a total order of ${usd('order.minimum.usd')}, ` +
    'shipping excluded.',
  categories: [
    'Bathroom', 'Kitchen', 'Toys', 'Beauty', 'Stationery', 'Jewelry',
    'Electronics', 'Ceramics', 'Plastics', 'Glass', 'Enamel', 'Stainless steel',
    'Bamboo & wood', 'Knitted cotton', 'Household paper', 'Hardware',
    'Hygiene & cleaning', 'Everyday essentials', 'Handcraft', 'Pendants',
    'Headwear', 'Craft & party', 'New arrivals',
  ],
  points: [
    {
      h: 'Real stock, fast dispatch',
      p: `Our own ${n('warehouse.sqft')} sq ft (${n('warehouse.sqm')} sqm) of warehousing keeps products available at stable prices and orders moving quickly.`,
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

export const catalogue = {
  title: 'Two live catalogs. Open access.',
  lede:
    'Look through the actual products before contacting us. No account needed — ' +
    'and none can be created yet, so browsing is open to everyone.',
  lines: [
    {
      h: 'One-dollar store line',
      price: `${usd('unit.cost.min.usd')} – ${usd('unit.cost.max.usd')} per item`,
      p: 'Everyday items for one-price and variety stores.',
      href: 'https://ww.zfxh688.com',
      cta: 'Open the catalog',
    },
    {
      h: 'Supermarket line',
      price: `${usd('super.price.min.usd')} – ${usd('super.price.max.usd')} per item`,
      p: 'A wider range at mixed price points, for supermarkets and larger formats.',
      href: 'https://hwmy.taohuo999.com',
      cta: 'Open the catalog',
    },
  ],
  tips: [
    'Pick a category and keep going down the tree to reach the products.',
    'The minimum quantity per item is shown at the bottom of each product, under its specification.',
    `Total order minimum: ${usd('order.minimum.usd')}, shipping excluded. Mix items freely in small quantities.`,
  ],
  note:
    'Accounts are not open yet — browse the catalogs, then send us your list ' +
    'or ask us anything.',
};

export const sourcing = {
  title: 'Your buying team in China.',
  lede:
    'Name the product you need — a photo, a sample, a reference — and we find ' +
    'the factory, negotiate at source, inspect and ship it, whether or not it ' +
    'is in our catalogs. Your purchasing office in China, without the travel.',
  items: [
    { h: 'Reliable supplier search', p: 'We select factories on capability, quality and stability — not on a marketplace listing.' },
    { h: 'Price negotiation', p: 'We negotiate directly with the factory, at source prices, with no middleman margin.' },
    { h: 'Full project management', p: 'Follow-up, inspection, consolidation and a single shipment for the whole order.' },
  ],
  video: {
    title: 'A minute with our team in China.',
    line: 'Guangzhou, Shenzhen, Qingdao, Yiwu — the four cities the sourcing runs through.',
    cta: 'Watch',
    poster: 'images/sourcing-cities-poster.webp',
    src: 'video/sourcing-cities-3.mp4',
  },
  forWhom: {
    h: 'Built for',
    list: [
      'Physical stores — discount, bazaar, dollar store',
      'Online sellers — Amazon FBA, Shopify, Jumia, Shopee, MercadoLibre',
      'Businesses looking for new reliable suppliers',
      'Private label and own-brand development',
    ],
  },
};

export const doubts = {
  eyebrow: 'What stops most buyers',
  title: `${n('objections.count')} doubts. Answered one by one.`,
  lede:
    'These come up before every first order. None of them is a reason not to start.',
  items: [
    {
      q: 'I cannot check a supplier from here.',
      a: `We work with thousands of Chinese factories across ${n('categories.count')} categories and ${n('catalog.items')}+ consumer products, inspected in-house before packing. You get photos and video of the goods before they ship.`,
    },
    {
      q: 'Sourcing will eat my time.',
      a: 'You pick your products directly in our online catalogs. No back-and-forth with a dozen suppliers, no sales call to sit through.',
    },
    {
      q: 'I have never run a store.',
      a: 'We handle the organization, the shelf layout, the promotional zones and the assortment. First-time owners are most of our clients.',
    },
    {
      q: 'I will be stuck with dead stock.',
      a: 'Small quantities per item, mixed freely across categories. Test your market, then reorder what sells. You are never locked into a pallet of one item.',
    },
    {
      q: 'Shipping is complicated.',
      a: `We group and pack your whole multi-category order for optimized container loading, into a single shipment, and assist with the export paperwork. One team follows it from the assortment plan to the freight.`,
    },
    {
      q: 'Where is my margin?',
      a: `Factory prices, with no marketplace margin stacked on top: you buy from ${usd('unit.cost.min.usd')} and the suggested retail is ${usd('retail.price.min.usd')} to ${usd('retail.price.max.usd')}.`,
    },
  ],
};


export const process = {
  title: `${n('process.steps')} steps, from location to opening.`,
  lede:
    `A standardized process: clear, fast and transparent. From concept to ` +
    `shipping in under ${n('process.weeks')} weeks, with one dedicated team from the ` +
    'site plan to the goods arriving at your warehouse.',
  steps: [
    { h: 'Site validation', p: 'You pick a location in your country and send us the floor plan and photos of the surroundings.' },
    { h: 'Client account', p: 'After a deposit — fully deductible from the final order — we open your platform access and assign your team.' },
    { h: 'Store design', p: 'Shelf layout and dimensions, promotional space, assortment planning, trolleys, checkouts and stock system.' },
    { h: 'Final validation', p: 'You confirm the product list, the custom shelving, the total weight and the overall volume.' },
    { h: 'Production & packing', p: 'On payment, product preparation and custom shelf manufacturing start immediately.' },
    { h: 'Freight coordination', p: 'Partner freight forwarders for export, sea freight and optional import customs. We assist throughout.' },
    { h: 'Shipping & receipt', p: 'Handover to your carrier. On arrival you collect locally and start fitting out the store.' },
  ],
};

export const store = {
  title: 'The store arrives complete.',
  lede:
    'Bright, clear aisles that invite an impulse buy, everyday essentials that ' +
    'bring people back, and the fixtures to hold them. We design and equip the ' +
    'sales floor, not just fill a container.',
  shots: [
    {
      src: 'images/store-aisle.webp',
      alt: 'Dollar store aisle: shelving stocked with plastic basins, buckets, food storage boxes, tableware, kitchen utensils and cleaning tools',
    },
    {
      src: 'images/store-endcap.webp',
      alt: 'Promotional end display stacked with basins, sponge packs, household paper and storage crates',
    },
    {
      src: 'images/store-checkout.webp',
      alt: 'Checkout counter with till, stacked shopping baskets and trolleys in a newly fitted dollar store',
    },
  ],
  caption: 'Illustrations of the store format we build.',
  items: [
    {
      h: 'Product selection & assortment plan',
      p: `Access ${n('catalog.items')}+ products on our platform, with guidance to build a balanced, profitable mix for your market, based on international best-sellers.`,
    },
    {
      h: 'Custom layout & floor plan',
      p: `A 2D plan optimized for customer flow and key zones — free from ${n('layout.minimum.sqft')} sq ft (${n('layout.minimum.sqm')} sqm). Detailed drawings for wall and center shelving.`,
    },
    {
      h: 'Custom shelf manufacturing',
      p: 'Gondolas, end caps and display units built to your dimensions in our partner factories, shipped with the goods.',
    },
    {
      h: 'Full store equipment',
      p: 'Counters, signage frames, baskets, trolleys, checkout and stock systems — the store arrives complete.',
    },
  ],
};




export const faq = {
  title: 'The questions buyers actually ask.',
  items: [
    {
      q: 'What is the minimum order?',
      a: `${usd('order.minimum.usd')} in goods, shipping excluded. Within that, mix any items and any categories freely. Each product carries its own minimum quantity, shown under its specification in the catalog.`,
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
      q: 'Can you find a product that is not in your catalogs?',
      a: 'Yes, and it is what we have always done. Send a photo, a sample or a ' +
         'reference with the quantity you need: we find the factory, negotiate at ' +
         'source, inspect the goods and ship them, on their own or consolidated ' +
         'with the rest of your order. We come back with the factory price, the ' +
         'minimum quantity and the lead time.',
    },
    {
      q: 'Do you add new products?',
      a: 'Constantly. New arrivals rotate through the catalogs all year, which is ' +
         'what keeps the shelves worth revisiting and footfall steady.',
    },
    {
      q: 'Are you on Alibaba?',
      a: 'We work directly, not through marketplaces. That is what removes the intermediate margin and lets us inspect and consolidate in-house.',
    },
    {
      q: `Are the ${usd('unit.cost.min.usd')} product prices real?`,
      a: `Yes, for the one-dollar product line, sourced between ${usd('unit.cost.min.usd')} and ${usd('unit.cost.max.usd')} per unit. The supermarket line sits at mixed price points.`,
    },
    {
      q: 'Do you supply shelving as well as goods?',
      a: `Yes. Shelving and fixtures are manufactured to your layout and shipped with the goods. The 2D layout plan is free from ${n('layout.minimum.sqft')} sq ft (${n('layout.minimum.sqm')} sqm).`,
    },
  ],
};

export const contact = {
  eyebrow: 'Get started',
  title: 'Tell us what you are opening.',
  lede:
    'Five fields to start. We reply by email within ' +
    `${n('reply.days.min')} to ${n('reply.days.max')} working days with an assortment plan and a landed cost.`,
  cta: 'Become our client',
  reassurance: `A multilingual team, ${n('years.experience')} years of experience, clients across ${n('continents')} continents.`,
};

export const foot = {
  company: 'Melody Supply',
  tagline: 'Easy sourcing from China',
  legal: `© ${new Date().getFullYear()} Melody Supply. All rights reserved.`,
  terms:
    'Unit prices are factory prices, shipping excluded. Freight, duties and ' +
    'taxes depend on your destination and are quoted separately. Every order ' +
    'is confirmed in writing before production. Details you send us are used ' +
    'only to answer your request.',
  reach: [
    { icon: 'whatsapp', label: 'WhatsApp', value: WHATSAPP_NUMBER, href: WHATSAPP_LINK, note: 'English, Spanish, French, Arabic' },
    { icon: 'mail', label: 'Email', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, note: '' },
  ],
  // Sans href, l'icone reste affichee mais n'ouvre rien : les comptes Instagram
  // et TikTok s'adressent a un public francophone, le site a des detaillants
  // americains. Y envoyer un prospect affaiblirait le positionnement.
  socials: [
    { icon: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/share/1DRravHfoA/?mibextid=wwXIfr' },
    { icon: 'instagram', label: 'Instagram', href: '' },
    { icon: 'tiktok', label: 'TikTok', href: '' },
    { icon: 'whatsapp', label: 'WhatsApp', href: WHATSAPP_LINK },
  ],
};
