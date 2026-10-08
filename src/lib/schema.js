/**
 * src/lib/schema.js
 *
 * TD-041: JSON-LD schema.org builder functions.
 * Single source of truth for all structured data. Pages import the
 * JsonLd component and pass builder output as props.
 *
 * Future changes (DRE update, brokerage move, etc.) only touch this
 * file + brand.js.
 */

import { SITE, AGENT, BROKER, SEO_CITIES } from './brand';

const SITE_URL = SITE.url;
const TEL = AGENT.phoneTel.replace(/^tel:/, '');
const SAME_AS = Object.values(AGENT.social).filter(Boolean);

/**
 * RealEstateAgent — the site agent as canonical entity.
 * Used on homepage and /about. The @id is stable so Google links them.
 */
export function buildRealEstateAgentSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${SITE_URL}/#agent`,
    name: AGENT.fullName,
    url: SITE_URL,
    image: `${SITE_URL}${AGENT.headshot}`,
    telephone: TEL,
    email: AGENT.email,
    worksFor: {
      '@id': `${SITE_URL}/#brokerage`,
    },
    knowsAbout: [
      'Residential real estate',
      'Sonoma County real estate',
      'Marin County real estate',
      'Napa County real estate',
      'Wine country properties',
      'Investment properties',
      'Buyer representation',
      'Seller representation',
    ],
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Sonoma County, California' },
      { '@type': 'AdministrativeArea', name: 'Marin County, California' },
      { '@type': 'AdministrativeArea', name: 'Napa County, California' },
    ],
    identifier: [
      {
        '@type': 'PropertyValue',
        propertyID: 'CA DRE License',
        value: AGENT.dre,
      },
    ],
    ...(SAME_AS.length > 0 && { sameAs: SAME_AS }),
  };
}

/**
 * LocalBusiness — feeds Google knowledge panel.
 * Homepage only. Includes openingHours + geo so Google can show the map card.
 */
export function buildLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${SITE_URL}/#localbusiness`,
    name: `${AGENT.fullName} — ${BROKER.name}`,
    url: SITE_URL,
    image: `${SITE_URL}${AGENT.headshot}`,
    telephone: TEL,
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: BROKER.address.street,
      addressLocality: BROKER.address.city,
      addressRegion: BROKER.address.state,
      postalCode: BROKER.address.zip,
      addressCountry: 'US',
    },
    areaServed: 'Sonoma County, California',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '08:00',
        closes: '20:00',
      },
    ],
  };
}

/**
 * Residence schema for an MLS listing.
 * Maps SimplyRETS listing object → schema.org SingleFamilyResidence (or variant).
 * Returns null if required fields missing.
 */
export function buildResidenceSchema(listing) {
  if (!listing || !listing.address || !listing.address.full) return null;
  if (!listing.listPrice) return null;

  const addr = listing.address;
  const property = listing.property || {};
  const geo = listing.geo || {};

  const subType = (property.subType || '').toLowerCase();
  let schemaType = 'SingleFamilyResidence';
  if (subType.includes('condo')) schemaType = 'Apartment';
  else if (subType.includes('townhouse') || subType.includes('town home')) schemaType = 'House';
  else if (subType.includes('multi') || subType.includes('duplex') || subType.includes('triplex') || subType.includes('fourplex')) schemaType = 'Residence';
  else if (listing.type === 'LND' || subType.includes('land')) schemaType = 'Place';

  const schema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: addr.full,
    url: `${SITE_URL}/listing/${listing.mlsId}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: addr.full,
      addressLocality: addr.city || undefined,
      addressRegion: addr.state || 'CA',
      postalCode: addr.postalCode || undefined,
      addressCountry: 'US',
    },
    offers: {
      '@type': 'Offer',
      price: listing.listPrice,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/listing/${listing.mlsId}`,
    },
  };

  if (property.bedrooms != null) schema.numberOfRooms = property.bedrooms;
  if (property.bathsFull != null) schema.numberOfBathroomsTotal = property.bathsFull + (property.bathsHalf || 0) * 0.5;
  if (property.area) {
    schema.floorSize = {
      '@type': 'QuantitativeValue',
      value: property.area,
      unitCode: 'FTK',
    };
  }
  if (property.yearBuilt) schema.yearBuilt = property.yearBuilt;
  if (property.lotSize) {
    schema.lotSize = {
      '@type': 'QuantitativeValue',
      value: property.lotSize,
      unitCode: 'FTK',
    };
  }
  if (geo.lat && geo.lng) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: geo.lat,
      longitude: geo.lng,
    };
  }
  if (Array.isArray(listing.photos) && listing.photos.length > 0) {
    schema.image = listing.photos.slice(0, 5);
  }
  if (listing.remarks) {
    schema.description = listing.remarks.length > 500
      ? listing.remarks.slice(0, 497) + '...'
      : listing.remarks;
  }

  return schema;
}

/**
 * FAQPage schema for /[city] pages.
 * faqs: [{ question, answer }]
 * IMPORTANT: only emit when the visible page contains the same Q&A.
 */
export function buildFAQPageSchema(faqs) {
  if (!Array.isArray(faqs) || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * WebSite — enables sitelinks search box in Google.
 * Emit on homepage only.
 */
export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE.name,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: { '@id': `${SITE_URL}/#agent` },
  };
}

/**
 * Organization — brokerage relationship.
 * Emit on homepage.
 */
export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateOrganization',
    '@id': `${SITE_URL}/#brokerage`,
    name: BROKER.name,
    subOrganization: { '@id': `${SITE_URL}/#agent` },
    address: {
      '@type': 'PostalAddress',
      streetAddress: BROKER.address.street,
      addressLocality: BROKER.address.city,
      addressRegion: BROKER.address.state,
      postalCode: BROKER.address.zip,
      addressCountry: 'US',
    },
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'CA DRE License',
      value: BROKER.dre,
    },
  };
}

/**
 * Service — buyer/seller representation services.
 * Emit on homepage.
 */
export function buildServiceSchema() {
  const areaServed = SEO_CITIES.map((city) => ({ '@type': 'City', name: city, containedInPlace: { '@type': 'State', name: 'California' } }));

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Buyer Representation',
      description: 'Full-service buyer representation for residential real estate in Sonoma, Marin, and Napa counties.',
      provider: { '@id': `${SITE_URL}/#agent` },
      areaServed,
      serviceType: 'Real Estate Buyer Agent',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Seller Representation',
      description: 'Listing and seller representation for residential properties in Sonoma, Marin, and Napa counties.',
      provider: { '@id': `${SITE_URL}/#agent` },
      areaServed,
      serviceType: 'Real Estate Listing Agent',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Relocation Consulting',
      description: 'Relocation guidance for buyers moving to Northern California wine country.',
      provider: { '@id': `${SITE_URL}/#agent` },
      areaServed,
      serviceType: 'Relocation Consultant',
    },
  ];
}

/**
 * Place — city entity for /[city] pages.
 * Augments BreadcrumbList with geographic hierarchy.
 */
export function buildPlaceSchema(cityName) {
  if (!cityName) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'City',
    name: cityName,
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: 'Sonoma County',
      containedInPlace: {
        '@type': 'State',
        name: 'California',
        containedInPlace: {
          '@type': 'Country',
          name: 'United States',
        },
      },
    },
  };
}

/**
 * BreadcrumbList — for listing detail and city pages.
 * crumbs: [{ name, url }]
 */
export function buildBreadcrumbSchema(crumbs) {
  if (!Array.isArray(crumbs) || crumbs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${SITE_URL}${crumb.url}`,
    })),
  };
}
