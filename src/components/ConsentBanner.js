'use client';

import { useState, useEffect } from 'react';
import { COLORS, FONTS } from '../lib/brand';
import CookiePreferencesModal from './CookiePreferencesModal';
import { readConsent, writeConsent } from '../lib/consent';

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (readConsent().state === 'pending') setVisible(true);
  }, []);

  function handleChoice(state, categories) {
    writeConsent(state, categories);
    setVisible(false);
  }

  function handleAcceptAll() {
    handleChoice('granted', { strictly_necessary: true, analytics: true, marketing: true });
  }

  function handleRejectNonEssential() {
    handleChoice('rejected', { strictly_necessary: true, analytics: false, marketing: false });
  }

  function handleCustomized(categories) {
    handleChoice('customized', categories);
    setShowModal(false);
  }

  if (!visible) return null;

  return (
    <>
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
        background: COLORS.estateBlack, color: COLORS.sonomaFog,
        padding: '24px 32px', fontFamily: FONTS.body, fontSize: '14px', lineHeight: '1.6',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontFamily: FONTS.heading, fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: COLORS.white }}>
            We value your privacy
          </p>
          <p style={{ marginBottom: '16px', color: 'rgba(245,245,243,0.8)' }}>
            We use cookies and similar technologies to improve your experience,
            analyze site usage, and support marketing efforts. Some of these
            activities may be considered &ldquo;sharing&rdquo; of personal information under
            California law.
          </p>
          <p style={{ marginBottom: '16px', color: 'rgba(245,245,243,0.8)' }}>
            You may also opt out at any time via the &ldquo;<a href="/do-not-sell" style={{ color: COLORS.sonomaFog, textDecoration: 'underline' }}>Do Not Sell or Share My Personal Information</a>&rdquo; link in our footer.
          </p>
          <p style={{ marginBottom: '20px', color: 'rgba(245,245,243,0.6)', fontSize: '13px' }}>
            For more details, see our <a href="/privacy" style={{ color: COLORS.sonomaFog, textDecoration: 'underline' }}>Privacy Policy</a>.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={handleAcceptAll} style={{
              fontFamily: FONTS.heading, fontSize: '13px', fontWeight: 600,
              padding: '10px 24px', borderRadius: '4px', border: 'none', cursor: 'pointer',
              background: COLORS.accentBlue, color: COLORS.white,
            }}>Accept All</button>
            <button onClick={handleRejectNonEssential} style={{
              fontFamily: FONTS.heading, fontSize: '13px', fontWeight: 600,
              padding: '10px 24px', borderRadius: '4px', cursor: 'pointer',
              background: 'transparent', color: COLORS.sonomaFog, border: '1px solid rgba(245,245,243,0.3)',
            }}>Reject Non-Essential</button>
            <button onClick={() => setShowModal(true)} style={{
              fontFamily: FONTS.heading, fontSize: '13px', fontWeight: 600,
              padding: '10px 24px', borderRadius: '4px', cursor: 'pointer',
              background: 'transparent', color: COLORS.sonomaFog, border: '1px solid rgba(245,245,243,0.3)',
            }}>Customize Settings</button>
          </div>
        </div>
      </div>
      {showModal && <CookiePreferencesModal onSave={handleCustomized} onClose={() => setShowModal(false)} />}
    </>
  );
}
