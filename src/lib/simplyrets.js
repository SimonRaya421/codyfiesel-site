import { SIMPLYRETS } from './brand';

const hasCredentials = Boolean(SIMPLYRETS.apiKey && SIMPLYRETS.apiSecret);
const credentials = Buffer.from(`${SIMPLYRETS.apiKey}:${SIMPLYRETS.apiSecret}`).toString('base64');

// During `next build` the city pages are prerendered. We do NOT call the API
// then: hundreds of requests would run at build time (and hang the build when
// credentials are missing). Pages carry `export const revalidate = 300`, so
// they fill in on first request and refresh every five minutes after.
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

const TIMEOUT_MS = 10000;

function skip(reason) {
  if (!isBuildPhase) console.warn(`[SimplyRETS] skipped: ${reason}`);
  return true;
}

export async function fetchListings(params = {}) {
  if (isBuildPhase && skip('build phase')) return [];
  if (!hasCredentials && skip('no credentials configured')) return [];

  const url = new URL(`${SIMPLYRETS.baseUrl}/properties`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v));
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  });
  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Basic ${credentials}`, Accept: 'application/json' },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) { console.error(`[SimplyRETS] ${res.status} ${res.statusText}`); return []; }
    return res.json();
  } catch (err) {
    console.error(`[SimplyRETS] fetch failed: ${err.message}`);
    return [];
  }
}

export async function fetchListing(mlsId) {
  if (isBuildPhase && skip('build phase')) return null;
  if (!hasCredentials && skip('no credentials configured')) return null;
  try {
    const res = await fetch(`${SIMPLYRETS.baseUrl}/properties/${encodeURIComponent(mlsId)}`, {
      headers: { Authorization: `Basic ${credentials}`, Accept: 'application/json' },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) { console.error(`[SimplyRETS] Listing ${mlsId}: ${res.status}`); return null; }
    return res.json();
  } catch (err) {
    console.error(`[SimplyRETS] fetch failed: ${err.message}`);
    return null;
  }
}
