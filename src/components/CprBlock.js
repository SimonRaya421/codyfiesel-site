import { COLORS, FONTS, CPR, AGENT } from '../lib/brand';
import ContactForm from './forms/ContactForm';

/**
 * Home page CPR class block. Renders nothing when CPR.enabled is false.
 * If CPR.signupUrl is set, shows a button to it; otherwise embeds the
 * lead form tagged "CPR Class".
 */
export default function CprBlock() {
  if (!CPR.enabled) return null;
  const detail = [CPR.nextDate, CPR.location].filter(Boolean).join(' · ');
  return (
    <section id="cpr" style={{ background: COLORS.estateBlack, padding: '64px 24px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <p style={{ fontFamily: FONTS.heading, fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>Community</p>
        <h2 style={{ fontFamily: FONTS.accent, fontStyle: 'italic', fontSize: '30px', color: COLORS.white, marginBottom: '12px', lineHeight: 1.3 }}>
          {CPR.heading}
        </h2>
        <p style={{ fontFamily: FONTS.body, fontSize: '15px', color: 'rgba(255,255,255,0.7)', marginBottom: detail ? '8px' : '28px', lineHeight: 1.6 }}>
          {CPR.blurb}
        </p>
        {detail && (
          <p style={{ fontFamily: FONTS.heading, fontSize: '14px', fontWeight: 600, color: COLORS.white, marginBottom: '28px' }}>{detail}</p>
        )}
        {CPR.signupUrl ? (
          <a href={CPR.signupUrl} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-block', fontFamily: FONTS.heading, fontSize: '14px', fontWeight: 600,
            color: COLORS.white, background: COLORS.accentBlue, padding: '14px 32px', borderRadius: '6px', textDecoration: 'none',
          }}>Reserve a Seat</a>
        ) : (
          <div style={{ background: COLORS.white, borderRadius: '10px', padding: '28px' }}>
            <ContactForm
              source="CPR Class"
              conversionType="cpr"
              buttonLabel="Reserve a Seat"
              messageLabel="Questions or preferred date (optional)"
              thanks={`You're on the list — ${AGENT.firstName} will confirm your seat.`}
            />
          </div>
        )}
      </div>
    </section>
  );
}
