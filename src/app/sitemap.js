/**
 * src/app/sitemap.js
 *
 * Next.js App Router sitemap route.
 * Static pages + dynamic city routes from SEO_CITIES.
 * Does NOT enumerate /listing/[mlsId] — listings turn over too fast
 * and BAREIS requires display context.
 */

import { SEO_CITIES, SITE } from '../lib/brand';

const BASE_URL = SITE.url;

export default function sitemap() {
  // Static routes
  const staticRoutes = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/areas`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/do-not-sell`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ];

  // Dynamic city routes from brand.js SEO_CITIES (29 cities)
  const cityRoutes = SEO_CITIES.map((city) => {
    const slug = city.toLowerCase().replace(/[\s.]+/g, '-');
    return {
      url: `${BASE_URL}/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    };
  });

  return [...staticRoutes, ...cityRoutes];
}
