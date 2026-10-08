'use client';

import { useState } from 'react';
import { COLORS, FONTS, AGENT } from '../../lib/brand';
import { trackLead } from '../../lib/tracker';

const SOURCE = 'Write an Offer';
const CONVERSION = 'offer';

const inputStyle = {
  fontFamily: FONTS.body, fontSize: '14px', padding: '12px 16px',
  border: `1px solid ${COLORS.border}`, borderRadius: '4px', width: '100%',
  boxSizing: 'border-box', color: COLORS.estateBlack,
};

const labelStyle = {
  fontFamily: FONTS.heading, fontSize: '12px', fontWeight: 600,
  color: COLORS.healdsburgSlate, letterSpacing: '0.3px', marginBottom: '4px', display: 'block',
};

export default function WriteOfferForm({ mlsId, listingAddress }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email.'); return; }
    if (!phone.trim() || !/^[\d\s()+-]+$/.test(phone)) { setError('Please enter a valid phone number.'); return; }
    if (!consent) { setError('Please agree to the privacy policy.'); return; }

    setStatus('submitting');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(), email, phone, message,
          source: SOURCE, conversion_type: CONVERSION,
          listing_id: mlsId, page_path: window.location.pathname,
        }),
      });
      if (res.ok) { setStatus('done'); trackLead(CONVERSION, SOURCE); }
      else { setError('Something went wrong. Please try again.'); setStatus('idle'); }
    } catch { setError('Network error. Please try again.'); setStatus('idle'); }
  }

  if (status === 'done') {
    return (
      <div style={{ padding: '24px 0', textAlign: 'center' }}>
        <p style={{ fontFamily: FONTS.heading, fontSize: '16px', fontWeight: 600, color: COLORS.accentBlue }}>
          Thanks — {AGENT.firstName} will contact you to discuss your offer strategy.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={labelStyle}>Property</label>
        <input type="text" value={listingAddress || mlsId} readOnly style={{ ...inputStyle, background: COLORS.sonomaFog, color: COLORS.healdsburgSlate }} />
      </div>
      <div>
        <label style={labelStyle}>Name *</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Email *</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Phone *</label>
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(707) 555-0100" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Message (optional)</label>
        <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} placeholder="Any details about your offer or questions for {AGENT.firstName}?" style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
      <label style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '12px', color: COLORS.healdsburgSlate, fontFamily: FONTS.body }}>
        <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} style={{ marginTop: '2px' }} />
        <span>I agree to {AGENT.fullName}&apos;s <a href="/privacy" style={{ color: COLORS.accentBlue, textDecoration: 'underline' }}>Privacy Policy</a> and consent to be contacted regarding this property.</span>
      </label>
      {error && <p style={{ color: '#c00', fontSize: '13px', margin: 0 }}>{error}</p>}
      <button type="submit" disabled={status === 'submitting'} style={{
        fontFamily: FONTS.heading, fontSize: '14px', fontWeight: 600, color: COLORS.white,
        background: COLORS.accentBlue, padding: '14px 32px', borderRadius: '6px', border: 'none',
        cursor: status === 'submitting' ? 'wait' : 'pointer', opacity: status === 'submitting' ? 0.7 : 1,
      }}>
        {status === 'submitting' ? 'Submitting...' : 'Write an Offer'}
      </button>
    </form>
  );
}
