/**
 * src/lib/brand.js
 *
 * SINGLE SOURCE OF TRUTH for who this site belongs to.
 *
 * Every page, form, footer, schema block and meta tag reads from here.
 * To stand this engine up for a different agent, edit this file and the
 * env vars in .env.example. Nothing else should contain a name, phone,
 * DRE number or brokerage.
 *
 * Fields marked TODO are placeholders waiting on Cody's content.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://codyfiesel.com';

export const AGENT = {
  firstName: 'Cody',
  lastName: 'Fiesel',
  fullName: 'Cody Fiesel',
  dre: '02103713',
  title: 'REALTOR®',
  phone: '707-479-3119',
  phoneTel: 'tel:+17074793119',
  email: 'cody@codyfiesel.com',
  headshot: '/images/headshot.jpg',    // drop Cody's photo at public/images/headshot.jpg
  bio: [
    // PLACEHOLDER BIO. Replace with Cody's own words before launch. Each array item renders as a paragraph.
    'Cody Fiesel is a real estate agent with W Real Estate serving Sonoma, Marin and Napa counties. He works with buyers and sellers across Wine Country, from first homes in Santa Rosa and Petaluma to vineyard properties in Healdsburg and Sonoma.',
    'Cody built his business on relationships, not ads. Most of his clients come from people he already knows, and he treats every transaction like it will be talked about at a dinner table for years, because it will be.',
    'Outside of real estate, Cody teaches a free community CPR class every month. If you want a seat, the signup is right here on the site.',
  ],
  tagline: 'Sonoma · Marin · Napa',
  heroHeadline: 'Find Your Place in Wine Country',
  social: {
    instagram: '',                     // full URL or empty string to hide
    facebook: '',
    youtube: '',
    linkedin: '',
    zillow: '',
    googleReviews: '',                 // Google review link
  },
};

export const BROKER = {
  name: 'W Real Estate',
  dre: '01795950',
  address: {
    street: '825 Gravenstein Hwy N',
    city: 'Sebastopol',
    state: 'CA',
    zip: '95472',
  },
  logo: '',                            // optional: /images/broker-logo.png
};

export const CPR = {
  // Cody teaches monthly CPR classes. Shown as a CTA block on the home page
  // when `enabled` is true.
  enabled: true,
  heading: 'Free Monthly CPR Class',
  blurb: 'Cody hosts a free community CPR certification class every month. Seats are limited.',
  signupUrl: '',                       // external signup link; if empty the contact form is used
  nextDate: '',                        // e.g. 'Saturday, November 15' (free text, optional)
  location: '',                        // optional
};

export const COLORS = {
  black: '#0B0B0B',
  charcoal: '#1F1F1F',
  white: '#FFFFFF',
  accentBlue: '#2F4A63',
  slate: '#4A4E51',
  fog: '#F5F5F3',
  border: '#E0E0E0',
  textMuted: '#71717A',
  // legacy aliases used throughout components
  estateBlack: '#0B0B0B',
  galleryWhite: '#FFFFFF',
  healdsburgSlate: '#4A4E51',
  vineyardGold: '#2F4A63',
  sonomaFog: '#F5F5F3',
};

export const FONTS = {
  heading: "'Montserrat', sans-serif",
  body: "'Open Sans', 'Lato', sans-serif",
  accent: "'Playfair Display', serif",
};

export const SITE = {
  name: `${AGENT.fullName} Real Estate`,
  shortName: AGENT.fullName,
  tagline: AGENT.tagline,
  url: SITE_URL,
  hubUrl: SITE_URL,
  engineUrl: SITE_URL,
  phone: AGENT.phone,
  phoneTel: AGENT.phoneTel,
  email: AGENT.email,
  privacyEmail: process.env.NEXT_PUBLIC_PRIVACY_EMAIL || AGENT.email,
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || '',
  description: `Search Sonoma, Marin and Napa County homes for sale with ${AGENT.fullName}, ${BROKER.name}. Live BAREIS MLS listings updated every five minutes.`,
};

export const COMPLIANCE = {
  agentName: AGENT.fullName,
  agentDRE: AGENT.dre,
  brokerName: BROKER.name,
  brokerDRE: BROKER.dre,
  mlsDisclosure: 'Information is deemed reliable but not guaranteed. Posted under reciprocity agreement, BAREIS MLS.',
  footerLine: `${AGENT.fullName} | ${BROKER.name}\nDRE# ${AGENT.dre} | Broker DRE# ${BROKER.dre}`,
};

export const SIMPLYRETS = {
  apiBase: 'https://api.simplyrets.com',
  baseUrl: 'https://api.simplyrets.com',
  apiKey: process.env.SIMPLYRETS_API_KEY || process.env.SIMPLYRETS_USERNAME || '',
  apiSecret: process.env.SIMPLYRETS_API_SECRET || process.env.SIMPLYRETS_PASSWORD || '',
};

// Cities that get their own SEO landing page (/healdsburg, /petaluma ...)
export const SEO_CITIES = [
  'Healdsburg','Sonoma','Petaluma','Santa Rosa','Sebastopol',
  'Windsor','Cloverdale','Cotati','Rohnert Park','Glen Ellen',
  'Kenwood','Guerneville','Forestville','Occidental','Bodega Bay',
  'Geyserville','Penngrove','Graton','Monte Rio','Jenner',
  'Novato','San Rafael','Mill Valley','Tiburon','Napa',
  'St. Helena','Calistoga','Yountville','American Canyon',
];

// Chips under the hero search box
export const HERO_CITIES = [
  'Healdsburg','Sonoma','Glen Ellen','Kenwood','Sebastopol',
  'Santa Rosa','Petaluma','Windsor','Mill Valley','Novato','Napa',
];

// Home page featured listings query
export const FEATURED = {
  cities: ['Healdsburg','Sonoma','Glen Ellen','Kenwood','Sebastopol','Santa Rosa','Petaluma','Windsor','Bodega Bay','Mill Valley','Tiburon','Novato','Napa','St. Helena'],
  minPrice: 1000000,
  fallbackMinPrice: 600000,
  limit: 24,
};

export const BRAND = { agent: AGENT, broker: BROKER, colors: COLORS, fonts: FONTS, site: SITE, compliance: COMPLIANCE };
export default BRAND;