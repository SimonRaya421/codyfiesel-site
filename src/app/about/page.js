import { COLORS, FONTS, AGENT, BROKER, COMPLIANCE } from '../../lib/brand';
import ConsultationCTA from '../../components/ConsultationCTA';
import JsonLd from '../../components/JsonLd';
import { buildRealEstateAgentSchema } from '../../lib/schema';

export const metadata = {
  title: `About ${AGENT.fullName}`,
  description: `${AGENT.fullName}, ${BROKER.name}. ${AGENT.bio[0]}`,
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd schema={buildRealEstateAgentSchema()} />
      <section style={{ background: COLORS.sonomaFog, padding: '72px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <img src={AGENT.headshot} alt={AGENT.fullName} style={{ width: 'min(100%, 360px)', aspectRatio: '1', borderRadius: '12px', objectFit: 'cover', boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }} />
          </div>
          <div>
            <p style={{ fontFamily: FONTS.heading, fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: COLORS.textMuted, marginBottom: '12px' }}>{AGENT.title} · {BROKER.name}</p>
            <h1 style={{ fontFamily: FONTS.heading, fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, color: COLORS.estateBlack, lineHeight: 1.1, marginBottom: '8px' }}>{AGENT.fullName}</h1>
            <p style={{ fontFamily: FONTS.accent, fontStyle: 'italic', fontSize: '20px', color: COLORS.healdsburgSlate, marginBottom: '28px' }}>{AGENT.tagline}</p>
            {AGENT.bio.map((para, i) => (
              <p key={i} style={{ fontFamily: FONTS.body, fontSize: '16px', lineHeight: 1.75, color: COLORS.healdsburgSlate, marginBottom: '16px' }}>{para}</p>
            ))}
            <p style={{ fontFamily: FONTS.body, fontSize: '13px', color: COLORS.textMuted, marginTop: '24px' }}>
              DRE# {COMPLIANCE.agentDRE} · {BROKER.name} · Broker DRE# {COMPLIANCE.brokerDRE}
            </p>
          </div>
        </div>
      </section>
      <ConsultationCTA />
    </>
  );
}
