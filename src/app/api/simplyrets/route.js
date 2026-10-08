import { NextResponse } from 'next/server';
import { fetchListings } from '../../../lib/simplyrets';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const params = {};
  searchParams.forEach((value, key) => {
    if (params[key]) {
      if (Array.isArray(params[key])) params[key].push(value);
      else params[key] = [params[key], value];
    } else params[key] = value;
  });
  try {
    const listings = await fetchListings(params);
    return NextResponse.json(listings);
  } catch (err) { console.error('[SimplyRETS Proxy] Error:',err); return NextResponse.json({error:'Failed to fetch listings'},{status:500}); }
}
