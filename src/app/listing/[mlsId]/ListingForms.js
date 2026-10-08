'use client';

import { useState, useEffect } from 'react';
import { COLORS, FONTS } from '../../../lib/brand';
import DisclosuresForm from '../../../components/forms/DisclosuresForm';
import TourRequestForm from '../../../components/forms/TourRequestForm';
import WriteOfferForm from '../../../components/forms/WriteOfferForm';

export default function ListingForms({ mlsId, listingAddress }) {
  const [activeForm, setActiveForm] = useState(null);

  // Listen for sidebar "Schedule a Tour" button click
  useEffect(() => {
    function handleTourRequest() {
      setActiveForm('tour');
      document.getElementById('listing-forms')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.addEventListener('sr-open-tour-form', handleTourRequest);
    return () => window.removeEventListener('sr-open-tour-form', handleTourRequest);
  });

  const btnStyle = (active) => ({
    fontFamily: FONTS.heading, fontSize: '14px', fontWeight: 600,
    padding: '14px 28px', borderRadius: '6px', cursor: 'pointer', border: 'none',
    color: active ? COLORS.white : COLORS.accentBlue,
    background: active ? COLORS.accentBlue : 'transparent',
    outline: active ? 'none' : `1px solid ${COLORS.accentBlue}`,
  });

  return (
    <section id="listing-forms" style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 24px 64px' }}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveForm(activeForm === 'tour' ? null : 'tour')} style={btnStyle(activeForm === 'tour')}>
          Schedule a Tour
        </button>
        <button onClick={() => setActiveForm(activeForm === 'disclosures' ? null : 'disclosures')} style={btnStyle(activeForm === 'disclosures')}>
          Request Disclosures
        </button>
        <button onClick={() => setActiveForm(activeForm === 'offer' ? null : 'offer')} style={btnStyle(activeForm === 'offer')}>
          Write an Offer
        </button>
      </div>
      {activeForm === 'tour' && <TourRequestForm mlsId={mlsId} listingAddress={listingAddress} />}
      {activeForm === 'disclosures' && <DisclosuresForm mlsId={mlsId} listingAddress={listingAddress} />}
      {activeForm === 'offer' && <WriteOfferForm mlsId={mlsId} listingAddress={listingAddress} />}
    </section>
  );
}
