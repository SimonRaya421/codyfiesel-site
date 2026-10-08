import { COLORS, FONTS, SITE } from '../../lib/brand';
import OptOutButton from './OptOutButton';

export const metadata = {
  title: `Do Not Sell or Share | ${SITE.name}`,
  description: 'Exercise your right to opt out of the sale or sharing of your personal information under California law.',
  openGraph: {
    title: `Do Not Sell or Share | ${SITE.name}`,
    url: `${SITE.url}/do-not-sell`,
  },
  alternates: {
    canonical: '/do-not-sell',
  },
};

export default async function DoNotSellPage() {

  return (
    <main style={{ maxWidth: '820px', margin: '0 auto', padding: '60px 24px 80px', fontFamily: FONTS.body, color: COLORS.healdsburgSlate, lineHeight: '1.65' }}>
      <h1 style={{ fontFamily: FONTS.heading, fontSize: '34px', fontWeight: 700, marginBottom: '32px', color: COLORS.estateBlack }}>
        Do Not Sell or Share My Personal Information
      </h1>

      <p style={{ marginBottom: '22px' }}>
        Under California law, you have the right to opt out of the sale or
        sharing of your personal information.
      </p>

      <p style={{ marginBottom: '22px' }}>
        We may use cookies, analytics tools, and similar technologies that could
        be considered &ldquo;sharing&rdquo; under the California Privacy Rights Act (CPRA),
        particularly for advertising and performance tracking purposes.
      </p>

      <p style={{ marginBottom: '12px' }}>You can opt out by:</p>
      <ul style={{ paddingLeft: '22px', marginBottom: '22px' }}>
        <li>Adjusting your cookie preferences using our cookie banner or settings tool</li>
        <li>Enabling Global Privacy Control (GPC) signals in your browser (if supported)</li>
        <li>Contacting us directly at:{' '}
          <a href={`mailto:${SITE.privacyEmail}`} style={{ color: COLORS.accentBlue, textDecoration: 'underline' }}>
            {SITE.privacyEmail}
          </a>
        </li>
      </ul>

      <p style={{ marginBottom: '22px' }}>
        Once your request is received, we will process it in accordance with
        applicable California privacy laws.
      </p>

      <p style={{ marginBottom: '32px' }}>
        For more details, please review our{' '}
        <a href="/privacy" style={{ color: COLORS.accentBlue, textDecoration: 'underline' }}>Privacy Policy</a>.
      </p>

      <OptOutButton />
    </main>
  );
}
