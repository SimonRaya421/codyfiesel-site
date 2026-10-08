/**
 * src/app/robots.js
 *
 * Next.js App Router robots.txt route.
 * Welcomes AI crawlers to indexable surfaces, blocks private/admin/data paths.
 */

import { SITE } from '../lib/brand';

export default function robots() {
  return {
    rules: [
      // Default crawlers — standard allow with private disallows
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api/admin',
          '/api/',
          '/do-not-sell',
          '/privacy/opt-out',
          '/_next/',
          '/static/',
        ],
      },
      // AI crawlers we explicitly welcome
      ...[
        'GPTBot',
        'ClaudeBot',
        'PerplexityBot',
        'Perplexity-User',
        'Google-Extended',
        'CCBot',
        'Applebot-Extended',
        'anthropic-ai',
        'OAI-SearchBot',
        'cohere-ai',
      ].map((bot) => ({
        userAgent: bot,
        allow: '/',
        disallow: [
          '/admin',
          '/api/admin',
          '/api/',
          '/do-not-sell',
          '/privacy/opt-out',
          '/_next/',
          '/static/',
        ],
      })),
      // Commercial scrapers — block entirely
      ...[
        'Bytespider',
        'Diffbot',
        'Omgilibot',
        'Amazonbot',
      ].map((bot) => ({
        userAgent: bot,
        disallow: '/',
      })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
