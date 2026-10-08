/**
 * src/lib/tracker.js
 *
 * Client side behavioral events. No database, no identity stitching.
 * Pushes to the GTM dataLayer and the Meta Pixel (when loaded after consent).
 * Safe to call anywhere; every call is a no-op on the server.
 */

function push(event, payload = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
  if (typeof window.fbq === 'function') {
    try { window.fbq('trackCustom', event, payload); } catch {}
  }
}

export function trackEvent(eventType, payload = {}) {
  push(eventType, payload);
}

export function trackListingView(listing) {
  if (!listing) return;
  push('listing_view', {
    mls_id: listing.mlsId || listing.listingId || null,
    city: listing.address?.city || null,
    price: listing.listPrice || null,
  });
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    try {
      window.fbq('track', 'ViewContent', {
        content_type: 'home_listing',
        content_ids: [String(listing.mlsId || listing.listingId || '')],
        value: listing.listPrice || undefined,
        currency: 'USD',
      });
    } catch {}
  }
}

export function trackSearch(params) {
  push('search_performed', { params });
}

export function trackLead(conversionType, source) {
  push('lead', { conversion_type: conversionType, source });
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    try { window.fbq('track', 'Lead', { content_name: source }); } catch {}
  }
}
