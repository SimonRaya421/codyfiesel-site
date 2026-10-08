import { SIMPLYRETS } from './brand';

const credentials = Buffer.from(
  `${SIMPLYRETS.apiKey}:${SIMPLYRETS.apiSecret}`
).toString('base64');

export async function fetchListings(params = {}) {
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
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Basic ${credentials}`, Accept: 'application/json' },
    next: { revalidate: 300 },
  });
  if (!res.ok) { console.error(`[SimplyRETS] ${res.status} ${res.statusText}`); return []; }
  return res.json();
}

export async function fetchListing(mlsId) {
  const res = await fetch(`${SIMPLYRETS.baseUrl}/properties/${mlsId}`, {
    headers: { Authorization: `Basic ${credentials}`, Accept: 'application/json' },
    next: { revalidate: 300 },
  });
  if (!res.ok) { console.error(`[SimplyRETS] Listing ${mlsId}: ${res.status}`); return null; }
  return res.json();
}
