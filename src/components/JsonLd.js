/**
 * src/components/JsonLd.js
 *
 * Emits one or more schema.org objects as a single <script> tag.
 * Server component. No 'use client' directive.
 *
 * Accepts a single schema object OR an array. Filters out null/undefined.
 * Multiple schemas are wrapped in @graph to keep them as one script.
 */
export default function JsonLd({ schema }) {
  const schemas = Array.isArray(schema) ? schema.filter(Boolean) : [schema].filter(Boolean);
  if (schemas.length === 0) return null;

  const payload = schemas.length === 1
    ? schemas[0]
    : { '@context': 'https://schema.org', '@graph': schemas };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
