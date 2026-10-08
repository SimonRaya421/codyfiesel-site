import { notFound } from 'next/navigation';
import { COLORS, FONTS, COMPLIANCE, SEO_CITIES, SITE, AGENT, BROKER } from '../../lib/brand';
import { fetchListings } from '../../lib/simplyrets';
import ListingCard from '../../components/ListingCard';
import JsonLd from '../../components/JsonLd';
import { buildBreadcrumbSchema, buildPlaceSchema } from '../../lib/schema';
import Link from 'next/link';

// ISR: prerendered empty at build, filled on first request, refreshed every 5 min.
export const revalidate = 300;

/* ─── City slug → display name map ─── */
const CITY_MAP = {};
const VALID_SLUGS = [];
SEO_CITIES.forEach(city => {
  const slug = city.toLowerCase().replace(/[\s.]+/g, '-');
  CITY_MAP[slug] = city;
  VALID_SLUGS.push(slug);
});

/* ─── Sub-page definitions (for internal linking) ─── */
const SUB_PAGES = [
  { slug: 'luxury-homes',         label: 'Luxury Homes' },
  { slug: '3-bedroom-homes',      label: '3+ Bedroom Homes' },
  { slug: '4-bedroom-homes',      label: '4+ Bedroom Homes' },
  { slug: 'condos-and-townhomes', label: 'Condos & Townhomes' },
  { slug: 'homes-under-1m',       label: 'Homes Under $1M' },
  { slug: 'homes-over-1m',        label: 'Homes Over $1M' },
  { slug: 'land-and-lots',        label: 'Land & Lots' },
  { slug: 'new-listings',         label: 'New Listings' },
];

/* ─── Service area whitelist (same as /search) ─── */
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

/* ─── Build-time: generate all city pages ─── */
export async function generateStaticParams() {
  return VALID_SLUGS.map(slug => ({ city: slug }));
}

/* ─── SEO metadata ─── */
export async function generateMetadata({ params }) {
  const cityName = CITY_MAP[params.city];
  if (!cityName) return { title: 'Not Found' };

  return {
    title: `${cityName} Homes for Sale | ${SITE.name}`,
    description: `Browse all active homes for sale in ${cityName}. Live MLS data from BAREIS. Search by price, bedrooms, and property type. ${AGENT.fullName}, ${BROKER.name} — Sonoma, Marin & Napa counties.`,
    openGraph: {
      title: `${cityName} Homes for Sale | ${SITE.name}`,
      description: `Find your next home in ${cityName}. Wine Country real estate powered by live BAREIS MLS data.`,
    },
    alternates: {
      canonical: `/${params.city}`,
    },
  };
}

/* ─── Page component ─── */
export default async function CityPage({ params }) {
  const citySlug = params.city;

  const cityName = CITY_MAP[citySlug];

  /* 404 if not a valid city — prevents junk URLs from indexing */
  if (!cityName) notFound();

  /* Fetch active listings for this city */
  let listings = [];
  try {
    listings = await fetchListings({
      status: 'active',
      cities: [cityName],
      limit: 48,
    });
    /* Filter to service area (safety net) */
    listings = listings.filter(l => {
      const c = (l?.address?.city || '').toLowerCase();
      return SERVICE_AREA_CITIES.some(s => s.toLowerCase() === c);
    });
  } catch (err) {
    console.error(`[CityPage] fetch error for ${cityName}:`, err);
  }

  
  

  // TD-042 follow-up: when visible Q&A is added to this page, also emit:
  //   buildFAQPageSchema(faqs)
  // alongside the breadcrumb.

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <JsonLd schema={[
        buildBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Areas', url: '/areas' },
          { name: cityName, url: `/${citySlug}` },
        ]),
        buildPlaceSchema(cityName),
      ]} />
      {/* Hero header */}
      <div style={{
        backgroundColor: '#1A1A1B',
        padding: '100px 24px 40px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 400,
            color: '#FFFFFF',
            margin: '0 0 8px 0',
          }}>
            Homes for Sale in {cityName}
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
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>{cityName}</span>
          </div>
        </div>
      </div>

      {/* Sub-page links — SEO internal linking + user navigation */}
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
          <span style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#4A4E51',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginRight: 8,
          }}>
            Browse:
          </span>
          {SUB_PAGES.map(sub => (
            <Link
              key={sub.slug}
              href={`/${citySlug}/${sub.slug}`}
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
              {sub.label}
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
            <p style={{ fontSize: '1.2rem', marginBottom: 12 }}>No active listings in {cityName} right now.</p>
            <p style={{ fontSize: '0.95rem', color: '#777', marginBottom: 24 }}>Check back soon or broaden your search.</p>
            <Link href="/search" style={{ display: 'inline-block', padding: '10px 24px', backgroundColor: '#2F4A63', color: '#FFFFFF', borderRadius: 6, fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none' }}>
              SEARCH ALL AREAS
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

      {/* SEO content block — unique per city, helps Google understand the page */}
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
            About {cityName} Real Estate
          </h2>
          <p style={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: '0.95rem',
            color: '#4A4E51',
            lineHeight: 1.7,
            margin: '0 0 16px 0',
          }}>
            {cityName} is one of the most sought-after communities in Northern California wine country. Whether you&apos;re looking for a family home, a vineyard estate, or a weekend retreat, the {cityName} real estate market offers a range of options across different price points and styles.
          </p>
          <p style={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: '0.95rem',
            color: '#4A4E51',
            lineHeight: 1.7,
            margin: '0 0 16px 0',
          }}>
            As an agent with {BROKER.name} covering Sonoma, Marin, and Napa counties, {AGENT.fullName} provides strategic buyer representation and deep local market knowledge. All listing data is sourced directly from the BAREIS MLS and updated regularly.
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
