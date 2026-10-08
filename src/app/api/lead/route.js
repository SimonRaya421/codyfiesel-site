// src/app/api/lead/route.js
//
// Lead intake. Every form on the site POSTs here.
//
// Body: { name, email, phone, message?, source, conversion_type?, listing_id?, page_path?, website? }
//   `website` is a honeypot. Real browsers leave it empty; bots fill it.
//
// Fan out, in order, each one optional and independent:
//   1. Follow Up Boss  — if FUB_API_KEY is set. Uses the Events API so the
//                        lead lands with source + property context and
//                        triggers FUB action plans.
//   2. Webhook         — if LEAD_WEBHOOK_URL is set (n8n, Zapier, Make).
//                        Use this to email or text Cody the lead.
//   3. Console         — always. Visible in `docker logs`.
//
// A failure in any sink is logged and does not fail the request; the
// visitor sees success as long as the payload validated.

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FUB_BASE = 'https://api.followupboss.com/v1';
const MAX_LEN = { name: 120, email: 254, phone: 40, message: 2000, source: 80, listing_id: 64, page_path: 500 };

function clean(v, key) {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, MAX_LEN[key] || 200);
}

function validEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function splitName(full) {
  const parts = full.split(/\s+/);
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') || undefined };
}

async function sendToFub(lead) {
  const key = process.env.FUB_API_KEY;
  if (!key) return 'skipped';
  const { firstName, lastName } = splitName(lead.name);
  const body = {
    source: process.env.FUB_SOURCE || 'codyfiesel.com',
    system: process.env.FUB_SYSTEM || 'codyfiesel-engine',
    type: lead.conversion_type === 'tour' ? 'Property Inquiry' : 'Inquiry',
    message: [lead.source, lead.message].filter(Boolean).join(' — '),
    person: {
      firstName,
      lastName,
      emails: [{ value: lead.email, type: 'home' }],
      ...(lead.phone && { phones: [{ value: lead.phone, type: 'mobile' }] }),
      tags: [lead.source].filter(Boolean),
    },
    ...(lead.listing_id && { property: { mlsNumber: lead.listing_id, url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/listing/${lead.listing_id}` } }),
    ...(lead.page_path && { pageUrl: `${process.env.NEXT_PUBLIC_SITE_URL || ''}${lead.page_path}` }),
  };
  const auth = Buffer.from(`${key}:`).toString('base64');
  const res = await fetch(`${FUB_BASE}/events`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
      ...(process.env.FUB_SYSTEM && { 'X-System': process.env.FUB_SYSTEM }),
      ...(process.env.FUB_SYSTEM_KEY && { 'X-System-Key': process.env.FUB_SYSTEM_KEY }),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`FUB ${res.status} ${(await res.text().catch(() => '')).slice(0, 200)}`);
  return 'ok';
}

async function sendToWebhook(lead) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return 'skipped';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.LEAD_WEBHOOK_SECRET && { 'X-Lead-Secret': process.env.LEAD_WEBHOOK_SECRET }),
    },
    body: JSON.stringify(lead),
  });
  if (!res.ok) throw new Error(`webhook ${res.status}`);
  return 'ok';
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  // Honeypot: silently accept and drop.
  if (body?.website) return NextResponse.json({ ok: true });

  const lead = {
    name: clean(body.name, 'name'),
    email: clean(body.email, 'email').toLowerCase(),
    phone: clean(body.phone, 'phone'),
    message: clean(body.message, 'message'),
    source: clean(body.source, 'source') || 'Website',
    conversion_type: clean(body.conversion_type, 'source') || null,
    listing_id: clean(body.listing_id, 'listing_id') || null,
    page_path: clean(body.page_path, 'page_path') || null,
    received_at: new Date().toISOString(),
    user_agent: req.headers.get('user-agent') || null,
    referer: req.headers.get('referer') || null,
  };

  if (!lead.name) return NextResponse.json({ error: 'name_required' }, { status: 400 });
  if (!validEmail(lead.email)) return NextResponse.json({ error: 'invalid_email' }, { status: 400 });

  const results = {};
  for (const [name, fn] of [['fub', sendToFub], ['webhook', sendToWebhook]]) {
    try {
      results[name] = await fn(lead);
    } catch (err) {
      results[name] = 'error';
      console.error(`[lead] ${name} failed:`, err.message);
    }
  }

  console.log('[lead]', JSON.stringify({ ...lead, user_agent: undefined, sinks: results }));

  return NextResponse.json({ ok: true, sinks: results });
}
