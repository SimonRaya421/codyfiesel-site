import { fetchListing } from '../../../lib/simplyrets';
import { COLORS, FONTS, COMPLIANCE, SITE, AGENT, BROKER } from '../../../lib/brand';
import ListingDetail from '../../../components/ListingDetail';
import ListingForms from './ListingForms';
import JsonLd from '../../../components/JsonLd';
import { buildResidenceSchema, buildBreadcrumbSchema } from '../../../lib/schema';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { mlsId } = params;
  const listing = await fetchListing(mlsId);
  if (!listing) return { title: 'Listing Not Found' };

  const address = listing.address?.full || 'Property';
  const city = listing.address?.city || '';
  const price = listing.listPrice ? `$${listing.listPrice.toLocaleString()}` : '';
  const beds = listing.property?.bedrooms || '';
  const baths = listing.property?.bathrooms || '';
  const sqft = listing.property?.area ? listing.property.area.toLocaleString() : '';
  const photo = listing.photos?.[0] || '/og-default.png';

  const title = `${address}${city ? `, ${city}` : ''} ${price ? `— ${price}` : ''}`;
  const description = `${beds ? beds + ' bed' : ''}${baths ? ' · ' + baths + ' bath' : ''}${sqft ? ' · ' + sqft + ' sqft' : ''}. ${address}${city ? ` in ${city}` : ''}. ${AGENT.fullName}, ${BROKER.name}. DRE# ${AGENT.dre}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE.url}/listing/${mlsId}`,
      siteName: SITE.name,
      images: [
        {
          url: photo,
          width: 1200,
          height: 630,
          alt: `${address}${city ? `, ${city}` : ''} — ${price}`,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [photo],
    },
    alternates: {
      canonical: `/listing/${mlsId}`,
    },
  };
}

export default async function ListingPage({ params }) {
  const { mlsId } = params;

  const listing = await fetchListing(mlsId);
  if (!listing) notFound();

  const address = listing.address?.full || `MLS# ${mlsId}`;
  const residenceSchema = buildResidenceSchema(listing);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Search', url: '/search' },
    { name: listing?.address?.city || 'Listings', url: `/${(listing?.address?.city || '').toLowerCase().replace(/\s+/g, '-')}` },
    { name: address, url: `/listing/${mlsId}` },
  ]);

  return (
    <>
      <JsonLd schema={[residenceSchema, breadcrumbSchema]} />
      <ListingDetail listing={listing} />
      <ListingForms mlsId={mlsId} listingAddress={address} />
    </>
  );
}
