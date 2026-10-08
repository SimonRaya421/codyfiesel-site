import Link from 'next/link';
import { COLORS, FONTS, SITE, AGENT, BROKER, COMPLIANCE, SEO_CITIES } from '../lib/brand';

const SOCIAL_LABELS = { instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube', linkedin: 'LinkedIn', zillow: 'Zillow', googleReviews: 'Google Reviews' };

export default function Footer() {
  const footerCities = SEO_CITIES.slice(0, 12);
  const socials = Object.entries(AGENT.social).filter(([, url]) => url);
  return (
    <footer role="contentinfo" style={{ background: COLORS.charcoal, color: COLORS.white, padding: '64px 0 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px', paddingBottom: '48px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <img src={AGENT.headshot} alt={AGENT.fullName} width={80} height={80} style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0, width: 80, height: 80 }} />
            <div>
              <h3 style={{ fontFamily: FONTS.heading, fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: COLORS.white }}>{AGENT.fullName}</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>{AGENT.bio[0]}</p>
              <a href={SITE.phoneTel} style={{ fontSize: '14px', fontWeight: 600, color: COLORS.white, textDecoration: 'none', display: 'block' }}>{SITE.phone}</a>
              <a href={`mailto:${SITE.email}`} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>{SITE.email}</a>
            </div>
          </div>
          <div>
            <h3 style={{ fontFamily: FONTS.heading, fontSize: '13px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px', color: 'rgba(255,255,255,0.5)' }}>Areas</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px' }}>
              {footerCities.map(city => (<Link key={city} href={`/${city.toLowerCase().replace(/[\s.]+/g, '-')}`} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '2px 0' }}>{city}</Link>))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontFamily: FONTS.heading, fontSize: '13px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Connect</h3>
            {socials.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px' }}>
                {socials.map(([key, url]) => (
                  <a key={key} href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>{SOCIAL_LABELS[key] || key}</a>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {BROKER.logo && (
                <div style={{ width: '64px', height: '64px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}>
                  <img src={BROKER.logo} alt={BROKER.name} width={48} height={48} style={{ borderRadius: '4px', objectFit: 'contain' }} />
                </div>
              )}
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5', margin: 0, maxWidth: '260px' }}>
                {BROKER.name}<br />
                {BROKER.address.street}, {BROKER.address.city}, {BROKER.address.state} {BROKER.address.zip}
              </p>
            </div>
          </div>
        </div>
        <div style={{ padding: '24px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ fontFamily: FONTS.heading, fontSize: '13px', fontWeight: 500, color: COLORS.white, textAlign: 'center', lineHeight: '1.8' }}>
            {AGENT.fullName} | {BROKER.name}<br />DRE# {COMPLIANCE.agentDRE} | Broker DRE# {COMPLIANCE.brokerDRE}
          </p>
        </div>
        <div style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <Link href="/privacy" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Privacy</Link>
          <Link href="/do-not-sell" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Do Not Sell or Share My Personal Information</Link>
        </div>
        <div style={{ padding: '20px 0', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6', maxWidth: '680px', margin: '0 auto' }}>
            {COMPLIANCE.mlsDisclosure} Equal Housing Opportunity. &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
