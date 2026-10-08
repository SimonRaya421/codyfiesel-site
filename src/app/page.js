import HeroSearch from '../components/HeroSearch';
import ListingGrid from '../components/ListingGrid';
import CprBlock from '../components/CprBlock';
import ContactForm from '../components/forms/ContactForm';
import JsonLd from '../components/JsonLd';
import { buildRealEstateAgentSchema, buildLocalBusinessSchema, buildWebSiteSchema, buildOrganizationSchema, buildServiceSchema } from '../lib/schema';
import { COLORS, FONTS, AGENT, FEATURED } from '../lib/brand';
import { fetchListings } from '../lib/simplyrets';

export const metadata = {
  alternates: { canonical: '/' },
};

export default async function HomePage() {
  let listings = [];

  // Featured storefront, with fallbacks so the page never renders empty.
  try {
    listings = await fetchListings({ status: 'active', type: 'residential', minprice: FEATURED.minPrice, cities: FEATURED.cities, limit: FEATURED.limit });
  } catch (err) { console.error('[HomePage] Primary fetch failed:', err); }

  if (listings.length === 0) {
    try {
      listings = await fetchListings({ status: 'active', type: 'residential', minprice: FEATURED.fallbackMinPrice, cities: FEATURED.cities, limit: FEATURED.limit });
    } catch (err) { console.error('[HomePage] Fallback 1 failed:', err); }
  }

  if (listings.length === 0) {
    try {
      listings = await fetchListings({ status: 'active', type: 'residential', limit: FEATURED.limit });
    } catch (err) { console.error('[HomePage] Fallback 2 failed:', err); }
  }

  return (
    <>
      <JsonLd schema={[buildRealEstateAgentSchema(), buildLocalBusinessSchema(), buildWebSiteSchema(), buildOrganizationSchema(), ...buildServiceSchema()]} />
      <HeroSearch />
      <ListingGrid listings={listings} title="Featured Properties" />
      <CprBlock />
      <section id="contact" style={{ background: COLORS.sonomaFog, padding: '64px 24px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: FONTS.accent, fontStyle: 'italic', fontSize: '28px', color: COLORS.estateBlack, marginBottom: '8px', lineHeight: 1.3 }}>
            Let&apos;s Talk
          </h2>
          <p style={{ fontFamily: FONTS.body, fontSize: '15px', color: COLORS.healdsburgSlate, marginBottom: '32px', lineHeight: 1.6 }}>
            Buying, selling, or just curious what your home is worth? Send {AGENT.firstName} a note and he&apos;ll get right back to you.
          </p>
          <ContactForm source="Home Page Contact" conversionType="contact" />
        </div>
      </section>
    </>
  );
}
