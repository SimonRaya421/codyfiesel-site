import { COLORS, FONTS, SITE, AGENT } from '../lib/brand';
import Link from 'next/link';

export default function ConsultationCTA() {
  return (
    <section style={{ background: COLORS.estateBlack, padding: '64px 24px', textAlign: 'center' }}>
      <h2 style={{ fontFamily: FONTS.accent, fontStyle: 'italic', fontSize: '28px', color: COLORS.white, marginBottom: '12px', lineHeight: 1.3 }}>
        Let&apos;s Talk About Your Move
      </h2>
      <p style={{ fontFamily: FONTS.body, fontSize: '15px', color: 'rgba(255,255,255,0.6)', maxWidth: '480px', margin: '0 auto 32px' }}>
        Whether you&apos;re buying, selling, or just curious about the market, {AGENT.firstName} is a call away.
      </p>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {SITE.calendlyUrl ? (
          <a href={SITE.calendlyUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: FONTS.heading, fontSize: '14px', fontWeight: 600, color: COLORS.white, background: COLORS.accentBlue, padding: '14px 32px', borderRadius: '6px', textDecoration: 'none' }}>
            Book a Call
          </a>
        ) : (
          <Link href="/contact" style={{ fontFamily: FONTS.heading, fontSize: '14px', fontWeight: 600, color: COLORS.white, background: COLORS.accentBlue, padding: '14px 32px', borderRadius: '6px', textDecoration: 'none' }}>
            Send a Message
          </Link>
        )}
        <a href={SITE.phoneTel} style={{ fontFamily: FONTS.heading, fontSize: '14px', fontWeight: 600, color: COLORS.white, background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', padding: '14px 32px', borderRadius: '6px', textDecoration: 'none' }}>
          Call {AGENT.firstName} Directly
        </a>
      </div>
    </section>
  );
}
