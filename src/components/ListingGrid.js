'use client';
import { useState } from 'react';
import Link from 'next/link';
import ListingCard from './ListingCard';
import { COLORS } from '../lib/brand';

const FILTER_PILLS = [
  { label: 'All', value: 'all', href: null },
];

const NAV_PILLS = [
  { label: 'Condo',        href: '/search?type=condominium' },
  { label: 'Multi-Family', href: '/search?type=multifamily' },
  { label: 'Land',         href: '/search?type=land' },
];

const BED_OPTIONS = [
  { label: 'Any Beds', value: 0 },
  { label: '1+', value: 1 },
  { label: '2+', value: 2 },
  { label: '3+', value: 3 },
  { label: '4+', value: 4 },
];

function matchesType(listing, category) {
  if (!category || category === 'all') return true;

  const t  = (listing.property?.type    || '').toLowerCase();
  const st = (listing.property?.subType || '').toLowerCase();
  const units = listing.property?.numUnits || listing.property?.unitCount || 0;

  switch (category) {
    case 'sfr':
      return t !== 'lnd'
          && t !== 'mlf'
          && t !== 'cre'
          && (st === 'singlefamilyresidence'
              || st === 'manufacturedhome'
              || (t === 'res' && (!st || st === 'none' || st === '')));
    case 'condo':
      return st === 'condominium' || st === 'townhouse';
    case 'multi':
      return t === 'mlf'
          || st === 'apartment'
          || st.includes('multi')
          || st.includes('duplex')
          || st.includes('triplex')
          || st.includes('fourplex')
          || units >= 2;
    case 'land':
      return t === 'lnd'
          || st.includes('land')
          || st.includes('lot');
    case 'commercial':
      return t === 'cre';
    default:
      return true;
  }
}

export default function ListingGrid({ listings = [], title = 'Featured Properties' }) {
  const [activeType, setActiveType] = useState('all');
  const [minBeds, setMinBeds] = useState(0);

  const filtered = listings.filter(l => {
    if (!matchesType(l, activeType)) return false;
    if (minBeds > 0 && (l.property?.bedrooms || 0) < minBeds) return false;
    return true;
  });

  const pillStyle = (active) => ({
    padding: '8px 18px',
    borderRadius: '4px',
    border: active ? `1px solid ${COLORS.accentBlue}` : `1px solid ${COLORS.border}`,
    background: active ? COLORS.accentBlue : COLORS.white,
    color: active ? COLORS.white : COLORS.slate,
    fontFamily: "'Montserrat',sans-serif",
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    textDecoration: 'none',
    display: 'inline-block',
  });

  return (
    <section style={{ padding: '64px 32px', maxWidth: '1280px', margin: '0 auto' }}>
      <h2 style={{
        fontFamily: "'Montserrat',sans-serif",
        fontSize: '24px',
        fontWeight: 600,
        color: COLORS.black,
        marginBottom: '24px',
      }}>{title}</h2>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '32px',
        paddingBottom: '24px',
        borderBottom: `1px solid ${COLORS.border}`,
      }}>
        {FILTER_PILLS.map(pill => (
          <button
            key={pill.value}
            onClick={() => setActiveType(pill.value)}
            style={pillStyle(activeType === pill.value)}
          >{pill.label}</button>
        ))}

        {NAV_PILLS.map(pill => (
          <Link
            key={pill.href}
            href={pill.href}
            style={pillStyle(false)}
          >{pill.label}</Link>
        ))}

        <div style={{ width: '1px', background: COLORS.border, margin: '0 8px' }} />

        {BED_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setMinBeds(opt.value)}
            style={pillStyle(minBeds === opt.value)}
          >{opt.label}</button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
        }}>
          {filtered.map((listing, i) => (
            <ListingCard
              key={listing.mlsId || listing.listingId || i}
              listing={listing}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '64px 0', color: COLORS.textMuted }}>
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>No listings match these filters.</p>
          <p style={{ fontSize: '14px' }}>Try adjusting your criteria.</p>
        </div>
      )}
    </section>
  );
}
