'use client';

import { useState } from 'react';
import { COLORS, FONTS, AGENT } from '../../lib/brand';
import { trackLead } from '../../lib/tracker';

const inputStyle = {
  fontFamily: FONTS.body, fontSize: '14px', padding: '12px 16px',
  border: `1px solid ${COLORS.border}`, borderRadius: '4px', width: '100%',
  boxSizing: 'border-box', color: COLORS.estateBlack, background: COLORS.white,
};
const labelStyle = {
  fontFamily: FONTS.heading, fontSize: '12px', fontWeight: 600,
  color: COLORS.healdsburgSlate, letterSpacing: '0.3px', marginBottom: '4px', display: 'block',
};

/**
 * Generic lead form. Props:
 *   source          — label stored with the lead ("Contact", "CPR Class", ...)
 *   conversionType  — 'contact' | 'cpr' | 'consultation' ...
 *   buttonLabel     — submit text
 *   messageLabel    — label for the free text field; pass null to hide it
 *   thanks          — success copy
 */
export default function ContactForm({
  source = 'Contact',
  conversionType = 'contact',
  buttonLabel = 'Send Message',
  messageLabel = 'Message (optional)',
  thanks = `Thanks — ${AGENT.firstName} will be in touch shortly.`,
}) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', website: '' });
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Please enter your name.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Please enter a valid email.'); return; }
    if (form.phone && !/^[\d\s()+-]+$/.test(form.phone)) { setError('Please enter a valid phone number.'); return; }
    if (!consent) { setError('Please agree to the privacy policy.'); return; }
    setStatus('submitting');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          source,
          conversion_type: conversionType,
          page_path: window.location.pathname,
        }),
      });
      if (res.ok) { setStatus('done'); trackLead(conversionType, source); }
      else { setError('Something went wrong. Please try again.'); setStatus('idle'); }
    } catch { setError('Network error. Please try again.'); setStatus('idle'); }
  }

  if (status === 'done') {
    return (
      <div style={{ padding: '24px 0', textAlign: 'center' }}>
        <p style={{ fontFamily: FONTS.heading, fontSize: '16px', fontWeight: 600, color: COLORS.accentBlue }}>{thanks}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* honeypot */}
      <input type="text" name="website" value={form.website} onChange={set('website')} tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }} aria-hidden="true" />
      <div>
        <label style={labelStyle}>Name *</label>
        <input type="text" value={form.name} onChange={set('name')} placeholder="Your name" style={inputStyle} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Email *</label>
          <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Phone</label>
          <input type="tel" value={form.phone} onChange={set('phone')} placeholder="(707) 555-0100" style={inputStyle} />
        </div>
      </div>
      {messageLabel && (
        <div>
          <label style={labelStyle}>{messageLabel}</label>
          <textarea value={form.message} onChange={set('message')} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
        </div>
      )}
      <label style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '12px', color: COLORS.healdsburgSlate, fontFamily: FONTS.body }}>
        <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} style={{ marginTop: '2px' }} />
        <span>I agree to the <a href="/privacy" style={{ color: COLORS.accentBlue, textDecoration: 'underline' }}>Privacy Policy</a> and consent to be contacted by {AGENT.fullName}.</span>
      </label>
      {error && <p style={{ color: '#c00', fontSize: '13px', margin: 0 }}>{error}</p>}
      <button type="submit" disabled={status === 'submitting'} style={{
        fontFamily: FONTS.heading, fontSize: '14px', fontWeight: 600, color: COLORS.white,
        background: COLORS.accentBlue, padding: '14px 32px', borderRadius: '6px', border: 'none',
        cursor: status === 'submitting' ? 'wait' : 'pointer', opacity: status === 'submitting' ? 0.7 : 1, alignSelf: 'flex-start',
      }}>
        {status === 'submitting' ? 'Sending...' : buttonLabel}
      </button>
    </form>
  );
}
