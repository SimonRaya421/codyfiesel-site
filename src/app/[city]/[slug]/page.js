import { notFound } from 'next/navigation';
import { COLORS, FONTS, COMPLIANCE, SEO_CITIES, SITE, AGENT, BROKER } from '../../../lib/brand';
import { fetchListings } from '../../../lib/simplyrets';
import ListingCard from '../../../components/ListingCard';
import Link from 'next/link';

/* ─── City slug → display name map ─── */
const CITY_MAP = {};
const VALID_CITY_SLUGS = [];
SEO_CITIES.forEach(city => {
  const slug = city.toLowerCase().replace(/[\s.]+/g, '-');
  CITY_MAP[slug] = city;
  VALID_CITY_SLUGS.push(slug);
});

/* ─── Slug definitions: each one maps to API params + SEO content ─── */
const SLUG_DEFS = {
  'luxury-homes': {
    label: 'Luxury Homes',
    heading: (city) => `Luxury Homes for Sale in ${city}`,
    description: (city) => `Browse luxury homes and estates for sale in ${city}. High-end properties starting at $1.5M in Wine Country. ${AGENT.fullName}, ${BROKER.name}.`,
    params: { minprice: 1500000 },
    blurb: (city) => `${city}'s luxury market features estate properties, vineyard homes, and architecturally significant residences. These premium listings start at $1.5 million and represent the finest real estate Wine Country has to offer.`,
  },
  '3-bedroom-homes': {
    label: '3+ Bedroom Homes',
    heading: (city) => `3 Bedroom Homes for Sale in ${city}`,
    description: (city) => `Find 3+ bedroom homes for sale in ${city}. Family-sized homes with live MLS data from BAREIS. ${AGENT.fullName}, ${BROKER.name}.`,
    params: { minbeds: 3, type: 'residential' },
    blurb: (city) => `Three-bedroom homes are among the most popular in ${city}, offering the right balance of space and value for families, remote workers, and buyers looking for a guest room or home office.`,
  },
  '4-bedroom-homes': {
    label: '4+ Bedroom Homes',
    heading: (city) => `4 Bedroom Homes for Sale in ${city}`,
    description: (city) => `Browse 4+ bedroom homes in ${city}. Spacious properties for growing families. Live BAREIS MLS data. ${AGENT.fullName}, ${BROKER.name}.`,
    params: { minbeds: 4, type: 'residential' },
    blurb: (city) => `Four-bedroom homes in ${city} provide generous living space for larger families or buyers who want dedicated office, gym, or guest quarters. These properties tend to sit on larger lots with room to grow.`,
  },
  'condos-and-townhomes': {
    label: 'Condos & Townhomes',
    heading: (city) => `Condos & Townhomes for Sale in ${city}`,
    description: (city) => `Find condos and townhomes for sale in ${city}. Low-maintenance living in Wine Country. Live MLS data. ${AGENT.fullName}, ${BROKER.name}.`,
    params: { type: 'condominium' },
    blurb: (city) => `Condos and townhomes in ${city} offer a lower-maintenance lifestyle with the benefits of homeownership. Ideal for first-time buyers, downsizers, or those looking for a Wine Country pied-à-terre.`,
  },
  'homes-under-1m': {
    label: 'Homes Under $1M',
    heading: (city) => `Homes Under $1M in ${city}`,
    description: (city) => `Browse homes under $1 million in ${city}. Affordable Wine Country real estate with live BAREIS MLS data. ${AGENT.fullName}, ${BROKER.name}.`,
    params: { maxprice: 999999 },
    blurb: (city) => `Finding a home under $1 million in ${city} is competitive but possible. These listings represent the most accessible entry points into Wine Country homeownership, from starter homes to fixer-uppers with potential.`,
  },
  'homes-over-1m': {
    label: 'Homes Over $1M',
    heading: (city) => `Homes Over $1M in ${city}`,
    description: (city) => `Browse homes over $1 million in ${city}. Premium properties in Wine Country with live BAREIS data. ${AGENT.fullName}, ${BROKER.name}.`,
    params: { minprice: 1000000 },
    blurb: (city) => `Homes above $1 million in ${city} offer premium features — larger lots, updated finishes, desirable neighborhoods, and in some cases, vineyard or mountain views that define the Wine Country lifestyle.`,
  },
  'land-and-lots': {
    label: 'Land & Lots',
    heading: (city) => `Land for Sale in ${city}`,
    description: (city) => `Find land and vacant lots for sale in ${city}. Build your dream home in Wine Country. Live BAREIS MLS data. ${AGENT.fullName}, ${BROKER.name}.`,
    params: { type: 'land' },
    blurb: (city) => `Vacant land in ${city} is the canvas for your dream build. Whether you're envisioning a vineyard estate, a modern farmhouse, or a sustainable retreat, these parcels offer the opportunity to create something uniquely yours.`,
  },
  'new-listings': {
    label: 'New Listings',
    heading: (city) => `New Listings in ${city}`,
    description: (city) => `See the newest homes listed for sale in ${city}. Fresh listings updated daily from BAREIS MLS. ${AGENT.fullName}, ${BROKER.name}.`,
    params: { sort: '-listdate' },
    blurb: (city) => `Stay ahead of the market with the most recently listed properties in ${city}. New listings move fast in Wine Country — the best homes often receive offers within days of hitting the MLS.`,
  },
};

const VALID_SUB_SLUGS = Object.keys(SLUG_DEFS);

/* ─── Service area whitelist ─── */
const SERVICE_AREA_CITIES = [
  'Santa Rosa','Petaluma','Healdsburg','Sonoma','Windsor','Rohnert Park',
  'Cotati','Sebastopol','Cloverdale','Glen Ellen','Kenwood','Guerneville',
  'Bodega Bay','Bodega','Occidental','Forestville','Graton','Penngrove',
  'Geyserville','Cazadero','Jenner','Monte Rio','Dillon Beach',
  'Sea Ranch','Annapolis','Camp Meeker','Fulton','Larkfield',
  'San Rafael','Novato','Mill Valley','Tiburon','Sausalito','Larkspur',
  'Corte Madera','San Anselmo','Fairfax','Ross','Belvedere','Stinson Beach',
  'Bolinas','Point Reyes Station','Inverness','Greenbrae','Kentfield',
  'Woodacre','Lagunitas','Nicasio','Tomales','Marshall',
  'Napa','St. Helena','Calistoga','Yountville','American Canyon',
  'Angwin','Deer Park','Rutherford','Oakville',
];

/* ─── Build-time: generate all city×slug combos ─── */
export async function generateStaticParams() {
  const params = [];
  VALID_CITY_SLUGS.forEach(citySlug => {
    VALID_SUB_SLUGS.forEach(subSlug => {
      params.push({ city: citySlug, slug: subSlug });
    });
  });
  return params;
}

/* ─── SEO metadata ─── */
export async function generateMetadata({ params }) {
  const cityName = CITY_MAP[params.city];
  const slugDef = SLUG_DEFS[params.slug];
  if (!cityName || !slugDef) return { title: 'Not Found' };

  return {
    title: `${slugDef.heading(cityName)} | ${SITE.name}`,
    description: slugDef.description(cityName),
    openGraph: {
      title: `${slugDef.heading(cityName)} | ${SITE.name}`,
      description: slugDef.description(cityName),
    },
  };
}

/* ─── Page component ─── */
export default async function CitySlugPage({ params }) {
  const citySlug = params.city;
  const subSlug = params.slug;
  const cityName = CITY_MAP[citySlug];
  const slugDef = SLUG_DEFS[subSlug];

  /* 404 if invalid city or slug */
  if (!cityName || !slugDef) notFound();

  /* Build API params from slug definition */
  const apiParams = {
    status: 'active',
    cities: [cityName],
    limit: 48,
    ...slugDef.params,
  };

  let listings = [];
  try {
    listings = await fetchListings(apiParams);
    listings = listings.filter(l => {
      const c = (l?.address?.city || '').toLowerCase();
      return SERVICE_AREA_CITIES.some(s => s.toLowerCase() === c);
    });
  } catch (err) {
    console.error(`[CitySlugPage] fetch error for ${cityName}/${subSlug}:`, err);
  }

  
  

  /* Sibling slugs for cross-linking (exclude current) */
  const siblingLinks = VALID_SUB_SLUGS.filter(s => s !== subSlug);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      {/* Hero header */}
      <div style={{ backgroundColor: '#1A1A1B', padding: '100px 24px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 400,
            color: '#FFFFFF',
            margin: '0 0 8px 0',
          }}>
            {slugDef.heading(cityName)}
          </h1>
          <p style={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: '0.95rem',
            color: 'rgba(255,255,255,0.6)',
            margin: '0 0 20px 0',
          }}>
            Sonoma &middot; Marin &middot; Napa
          </p>
          {/* Breadcrumb */}
          <div style={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.4)',
          }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</Link>
            {' / '}
            <Link href="/search" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Search</Link>
            {' / '}
            <Link href={`/${citySlug}`} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{cityName}</Link>
            {' / '}
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>{slugDef.label}</span>
          </div>
        </div>
      </div>

      {/* Sibling navigation — SEO cross-links between sub-pages */}
      <div style={{
        backgroundColor: '#F5F5F3',
        borderBottom: '1px solid #E0E0E0',
        padding: '16px 24px',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          alignItems: 'center',
        }}>
          <Link
            href={`/${citySlug}`}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: '0.8rem',
              fontFamily: "'Open Sans', sans-serif",
              textDecoration: 'none',
              backgroundColor: 'rgba(47,74,99,0.08)',
              color: '#2F4A63',
              border: '1px solid rgba(47,74,99,0.15)',
            }}
          >
            All {cityName}
          </Link>
          {siblingLinks.map(s => (
            <Link
              key={s}
              href={`/${citySlug}/${s}`}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: '0.8rem',
                fontFamily: "'Open Sans', sans-serif",
                textDecoration: 'none',
                backgroundColor: 'rgba(47,74,99,0.08)',
                color: '#2F4A63',
                border: '1px solid rgba(47,74,99,0.15)',
              }}
            >
              {SLUG_DEFS[s].label}
            </Link>
          ))}
          <Link
            href={`/search?city=${encodeURIComponent(cityName)}`}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: '0.8rem',
              fontFamily: "'Open Sans', sans-serif",
              textDecoration: 'none',
              backgroundColor: '#2F4A63',
              color: '#FFFFFF',
              border: '1px solid #2F4A63',
            }}
          >
            Advanced Search
          </Link>
        </div>
      </div>

      {/* Listings grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 40px' }}>
        {listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', fontFamily: "'Open Sans', sans-serif", color: '#4A4E51' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: 12 }}>No {slugDef.label.toLowerCase()} in {cityName} right now.</p>
            <p style={{ fontSize: '0.95rem', color: '#777', marginBottom: 24 }}>Check back soon or try a different category.</p>
            <Link href={`/${citySlug}`} style={{ display: 'inline-block', padding: '10px 24px', backgroundColor: '#2F4A63', color: '#FFFFFF', borderRadius: 6, fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none' }}>
              VIEW ALL {cityName.toUpperCase()} LISTINGS
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {listings.map(listing => (
              <ListingCard key={listing.mlsId} listing={listing} />
            ))}
          </div>
        )}
      </div>

      {/* SEO content block */}
      <div style={{
        backgroundColor: '#F5F5F3',
        padding: '40px 24px',
        borderTop: '1px solid #E0E0E0',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.5rem',
            fontWeight: 400,
            color: '#1A1A1B',
            margin: '0 0 16px 0',
          }}>
            {slugDef.heading(cityName)}
          </h2>
          <p style={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: '0.95rem',
            color: '#4A4E51',
            lineHeight: 1.7,
            margin: '0 0 16px 0',
          }}>
            {slugDef.blurb(cityName)}
          </p>
          <p style={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: '0.95rem',
            color: '#4A4E51',
            lineHeight: 1.7,
            margin: '0 0 16px 0',
          }}>
            As an agent with {BROKER.name}, {AGENT.fullName} provides strategic buyer representation across Sonoma, Marin, and Napa counties. All data is sourced directly from the BAREIS MLS.
          </p>
          <Link href="/about" style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#2F4A63',
            textDecoration: 'underline',
            textUnderlineOffset: '4px',
          }}>
            Learn more about {AGENT.fullName} &rarr;
          </Link>
        </div>
      </div>

      {/* MLS compliance */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px 32px', textAlign: 'center' }}>
        <p style={{
          fontFamily: "'Open Sans', sans-serif",
          fontSize: '0.7rem',
          color: '#999',
          lineHeight: 1.5,
        }}>
          Information is deemed reliable but not guaranteed. Data provided by BAREIS MLS.
          IDX information is provided exclusively for personal, non-commercial use.
          DRE# {COMPLIANCE.agentDRE} &middot; Broker DRE# {COMPLIANCE.brokerDRE}
        </p>
      </div>
    </div>
  );
}
