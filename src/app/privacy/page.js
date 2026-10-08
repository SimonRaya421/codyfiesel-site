import { COLORS, FONTS, SITE } from '../../lib/brand';

export const metadata = {
  title: `Privacy | ${SITE.name}`,
  description: 'California Privacy Rights (CCPA/CPRA) — your rights regarding personal information collected by ' + SITE.name + '.',
  openGraph: {
    title: `Privacy | ${SITE.name}`,
    url: `${SITE.url}/privacy`,
  },
  alternates: {
    canonical: '/privacy',
  },
};

export default async function PrivacyPage() {

  return (
    <main style={{ maxWidth: '820px', margin: '0 auto', padding: '60px 24px 80px', fontFamily: FONTS.body, color: COLORS.healdsburgSlate, lineHeight: '1.65' }}>
      <h1 style={{ fontFamily: FONTS.heading, fontSize: '34px', fontWeight: 700, marginBottom: '32px', color: COLORS.estateBlack }}>
        California Privacy Rights (CCPA/CPRA)
      </h1>

      <p style={{ marginBottom: '22px' }}>
        If you are a California resident, you have rights under the California
        Consumer Privacy Act (CCPA), as amended by the California Privacy Rights
        Act (CPRA), regarding your personal information.
      </p>

      <p style={{ marginBottom: '22px' }}>
        We may collect, use, disclose, and in certain cases share personal
        information (as defined under California law) for business and marketing
        purposes, including through the use of analytics, cookies, and similar
        tracking technologies on this website. This may include sharing
        information with service providers and third parties for cross-context
        behavioral advertising or performance measurement.
      </p>

      <p style={{ marginBottom: '12px' }}>California residents have the right to:</p>
      <ul style={{ paddingLeft: '22px', marginBottom: '22px' }}>
        <li>Request access to the personal information we collect about them</li>
        <li>Request deletion of their personal information</li>
        <li>Request correction of inaccurate personal information</li>
        <li>Opt out of the sale or sharing of personal information</li>
        <li>Limit the use of sensitive personal information (if applicable)</li>
      </ul>

      <p style={{ marginBottom: '22px' }}>
        To exercise your right to opt out of the sale or sharing of your personal
        information, please click the &ldquo;Do Not Sell or Share My Personal
        Information&rdquo; link in the footer of this website or contact us at:{' '}
        <a href={`mailto:${SITE.privacyEmail}`} style={{ color: COLORS.accentBlue, textDecoration: 'underline' }}>
          {SITE.privacyEmail}
        </a>.
      </p>

      <p>
        We do not discriminate against consumers for exercising their privacy
        rights.
      </p>
    </main>
  );
}
