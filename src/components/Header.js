'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { COLORS, FONTS, SITE, AGENT, BROKER } from '../lib/brand';

const NAV = [
  { label: 'Search', href: '/search' },
  { label: 'Areas', href: '/areas' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{`
        @media(max-width:768px){
          .cf-nav-links{display:none !important;}
          .cf-header{padding:0 16px !important;}
          .cf-broker-line{display:none !important;}
          .cf-menu-btn{display:inline-flex !important;}
          .cf-phone{display:none !important;}
        }
        @media(min-width:769px){ .cf-mobile-menu{display:none !important;} }
      `}</style>
      <header className="cf-header" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: '96px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px',
        background: scrolled ? COLORS.white : 'rgba(255,255,255,0.97)',
        borderBottom: scrolled ? `1px solid ${COLORS.border}` : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
            <span style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: '22px', letterSpacing: '1.5px', textTransform: 'uppercase', color: COLORS.black }}>
              {AGENT.firstName} {AGENT.lastName}
            </span>
            <span style={{ fontFamily: FONTS.accent, fontStyle: 'italic', fontSize: '13px', color: COLORS.slate, letterSpacing: '0.5px' }}>
              {AGENT.tagline}
            </span>
          </Link>
          <span className="cf-broker-line" style={{ fontFamily: FONTS.heading, fontSize: '11px', fontWeight: 400, color: COLORS.slate, letterSpacing: '0.2px', whiteSpace: 'nowrap', borderLeft: `1px solid ${COLORS.border}`, paddingLeft: '16px' }}>
            {BROKER.logo
              ? <img src={BROKER.logo} alt={BROKER.name} style={{ height: '40px', width: 'auto', objectFit: 'contain', verticalAlign: 'middle' }} />
              : <>Brokered by {BROKER.name}<br />DRE #{BROKER.dre}</>}
          </span>
        </div>
        <nav aria-label="Main navigation" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div className="cf-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            {NAV.map(({ label, href }) => (
              <Link key={href} href={href} style={{
                fontFamily: FONTS.heading, fontSize: '13px', fontWeight: 500,
                letterSpacing: '0.5px', textTransform: 'uppercase', color: COLORS.black,
                textDecoration: 'none', padding: '4px 0',
              }}
              onMouseEnter={e => e.currentTarget.style.color = COLORS.accentBlue}
              onMouseLeave={e => e.currentTarget.style.color = COLORS.black}>
                {label}
              </Link>
            ))}
          </div>
          <a className="cf-phone" href={SITE.phoneTel} aria-label={`Call ${AGENT.fullName} at ${SITE.phone}`} style={{
            fontFamily: FONTS.heading, fontSize: '13px', fontWeight: 600,
            letterSpacing: '0.5px', color: COLORS.white, background: COLORS.accentBlue,
            padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', transition: 'background 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = COLORS.black}
          onMouseLeave={e => e.currentTarget.style.background = COLORS.accentBlue}>
            {SITE.phone}
          </a>
          <button className="cf-menu-btn" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(o => !o)} style={{
            display: 'none', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px',
            background: 'transparent', border: `1px solid ${COLORS.border}`, borderRadius: '6px', cursor: 'pointer',
          }}>
            <span style={{ display: 'block', width: '18px', height: '2px', background: COLORS.black, boxShadow: `0 -6px 0 ${COLORS.black}, 0 6px 0 ${COLORS.black}` }} />
          </button>
        </nav>
      </header>
      {open && (
        <div className="cf-mobile-menu" style={{
          position: 'fixed', top: '96px', left: 0, right: 0, zIndex: 999, background: COLORS.white,
          borderBottom: `1px solid ${COLORS.border}`, padding: '8px 16px 16px', display: 'flex', flexDirection: 'column',
        }}>
          {NAV.map(({ label, href }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} style={{
              fontFamily: FONTS.heading, fontSize: '15px', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase',
              color: COLORS.black, textDecoration: 'none', padding: '14px 0', borderBottom: `1px solid ${COLORS.border}`,
            }}>{label}</Link>
          ))}
          <a href={SITE.phoneTel} style={{
            marginTop: '16px', textAlign: 'center', fontFamily: FONTS.heading, fontSize: '14px', fontWeight: 600,
            color: COLORS.white, background: COLORS.accentBlue, padding: '14px', borderRadius: '6px', textDecoration: 'none',
          }}>Call {SITE.phone}</a>
        </div>
      )}
    </>
  );
}
