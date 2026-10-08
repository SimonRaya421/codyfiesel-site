'use client';

import { useState } from 'react';
import { COLORS, FONTS } from '../lib/brand';

export default function CookiePreferencesModal({ onSave, onClose }) {
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  function handleSave() {
    onSave({ strictly_necessary: true, analytics, marketing });
  }

  const toggleStyle = (on) => ({
    width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
    background: on ? COLORS.accentBlue : '#555', position: 'relative', transition: 'background 0.2s',
  });

  const dotStyle = (on) => ({
    width: '18px', height: '18px', borderRadius: '50%', background: COLORS.white,
    position: 'absolute', top: '3px', left: on ? '22px' : '4px', transition: 'left 0.2s',
  });

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: COLORS.white, borderRadius: '8px', padding: '32px', maxWidth: '440px', width: '90%',
        fontFamily: FONTS.body, color: COLORS.healdsburgSlate,
      }}>
        <h2 style={{ fontFamily: FONTS.heading, fontSize: '20px', fontWeight: 600, marginBottom: '24px', color: COLORS.estateBlack }}>
          Cookie Preferences
        </h2>

        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: '14px', color: COLORS.estateBlack }}>Strictly Necessary</p>
            <p style={{ fontSize: '12px', color: COLORS.healdsburgSlate }}>Required</p>
          </div>
          <button disabled style={{ ...toggleStyle(true), cursor: 'not-allowed', opacity: 0.6 }}>
            <div style={dotStyle(true)} />
          </button>
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: '14px', color: COLORS.estateBlack }}>Analytics</p>
            <p style={{ fontSize: '12px', color: COLORS.healdsburgSlate }}>Site usage measurement</p>
          </div>
          <button onClick={() => setAnalytics(!analytics)} style={toggleStyle(analytics)}>
            <div style={dotStyle(analytics)} />
          </button>
        </div>

        <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: '14px', color: COLORS.estateBlack }}>Marketing</p>
            <p style={{ fontSize: '12px', color: COLORS.healdsburgSlate }}>Advertising and retargeting</p>
          </div>
          <button onClick={() => setMarketing(!marketing)} style={toggleStyle(marketing)}>
            <div style={dotStyle(marketing)} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleSave} style={{
            fontFamily: FONTS.heading, fontSize: '13px', fontWeight: 600,
            padding: '10px 24px', borderRadius: '4px', border: 'none', cursor: 'pointer',
            background: COLORS.accentBlue, color: COLORS.white,
          }}>Save Preferences</button>
          <button onClick={onClose} style={{
            fontFamily: FONTS.heading, fontSize: '13px', fontWeight: 600,
            padding: '10px 24px', borderRadius: '4px', cursor: 'pointer',
            background: 'transparent', color: COLORS.healdsburgSlate, border: `1px solid ${COLORS.border}`,
          }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
