'use client';

import { useState } from 'react';
import { COLORS, FONTS } from '../../lib/brand';
import { writeConsent, DEFAULT_CATEGORIES } from '../../lib/consent';

export default function OptOutButton() {
  const [status, setStatus] = useState('idle');

  function handleOptOut() {
    setStatus('submitting');
    try {
      writeConsent('rejected', DEFAULT_CATEGORIES);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <p style={{ fontFamily: FONTS.heading, fontSize: '14px', fontWeight: 600, color: COLORS.accentBlue, padding: '14px 0' }}>
        Your opt-out has been recorded.
      </p>
    );
  }

  return (
    <button
      onClick={handleOptOut}
      disabled={status === 'submitting'}
      style={{
        fontFamily: FONTS.heading,
        fontSize: '14px',
        fontWeight: 600,
        color: COLORS.white,
        background: COLORS.accentBlue,
        padding: '14px 32px',
        borderRadius: '6px',
        border: 'none',
        cursor: status === 'submitting' ? 'wait' : 'pointer',
        opacity: status === 'submitting' ? 0.7 : 1,
      }}
    >
      {status === 'submitting' ? 'Processing...' : 'Opt Out Now'}
    </button>
  );
}
