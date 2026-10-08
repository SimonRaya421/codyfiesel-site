import '../styles/globals.css';
import LayoutFrame from '../components/LayoutFrame';
import Pixels from '../components/Pixels';
import ConsentBanner from '../components/ConsentBanner';
import { SITE, AGENT } from '../lib/brand';

const TITLE = `${SITE.name} | ${AGENT.tagline.replace(/ · /g, ', ')} Homes`;

export const metadata = {
  title: {
    default: TITLE,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: TITLE,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: TITLE }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: SITE.description,
    images: ['/og-default.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Pixels />
        <LayoutFrame>{children}</LayoutFrame>
        {process.env.NEXT_PUBLIC_CONSENT_BANNER_ENABLED !== 'false' && <ConsentBanner />}
      </body>
    </html>
  );
}
