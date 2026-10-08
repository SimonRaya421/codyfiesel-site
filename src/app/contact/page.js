import { COLORS, FONTS, SITE, AGENT, BROKER } from '../../lib/brand';
import ContactForm from '../../components/forms/ContactForm';

export const metadata = {
  title: 'Contact',
  description: `Get in touch with ${AGENT.fullName}, ${BROKER.name}. Call, email, or send a message.`,
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '56px 24px 80px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'start' }}>
        <div>
          <h1 style={{ fontFamily: FONTS.heading, fontSize: '36px', fontWeight: 700, color: COLORS.estateBlack, marginBottom: '12px', lineHeight: 1.15 }}>Contact {AGENT.firstName}</h1>
          <p style={{ fontFamily: FONTS.body, fontSize: '16px', color: COLORS.healdsburgSlate, lineHeight: 1.7, marginBottom: '28px' }}>{AGENT.bio[0]}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
            <img src={AGENT.headshot} alt={AGENT.fullName} style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover' }} />
            <div style={{ fontFamily: FONTS.body, fontSize: '15px', lineHeight: 1.8, color: COLORS.estateBlack }}>
              <a href={SITE.phoneTel} style={{ color: COLORS.accentBlue, textDecoration: 'none', fontWeight: 600, display: 'block' }}>{SITE.phone}</a>
              <a href={`mailto:${SITE.email}`} style={{ color: COLORS.accentBlue, textDecoration: 'none', display: 'block' }}>{SITE.email}</a>
              <span style={{ color: COLORS.textMuted, fontSize: '13px' }}>DRE# {AGENT.dre} · {BROKER.name}</span>
            </div>
          </div>
          {SITE.calendlyUrl && (
            <a href={SITE.calendlyUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', fontFamily: FONTS.heading, fontSize: '14px', fontWeight: 600, color: COLORS.white, background: COLORS.accentBlue, padding: '14px 28px', borderRadius: '6px', textDecoration: 'none' }}>Book a Call</a>
          )}
        </div>
        <div style={{ background: COLORS.sonomaFog, borderRadius: '10px', padding: '32px' }}>
          <ContactForm source="Contact Page" conversionType="contact" />
        </div>
      </div>
    </div>
  );
}
