# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

**codyfiesel-site** is the public website for Cody Fiesel, a BAREIS agent in Sonoma/Marin/Napa. It is a stripped fork of `simonraya-engine`: the same Next.js 14 App Router listing engine (SimplyRETS → server rendered pages) without the identity database, admin panel, AVM, flip finder, deal machine, cron rails or n8n hooks.

Live site: https://codyfiesel.com

## The one rule

**All identity lives in `src/lib/brand.js`.** Name, DRE, phone, email, brokerage, bio, social links, headshot path, CPR class block, city lists. No other file may contain a person's name, phone number, DRE number or brokerage. If you find one, move it into brand.js and reference it.

## Stack

- Next.js 14.2 App Router, React 18, inline styles, Google Fonts via globals.css
- SimplyRETS (Cody's own app, BAREIS feed) with 5 minute ISR on fetches
- No database. No auth. Two API routes only.
- Docker standalone, deployed by Coolify on the Hostinger VPS

## Routes

| Route | What |
|---|---|
| `/` | Hero search, featured listings, CPR block, contact form |
| `/search` | Filterable listing search (query params) |
| `/[city]`, `/[city]/[slug]` | SEO landing pages generated from `SEO_CITIES` |
| `/listing/[mlsId]` | Listing detail + tour/disclosures/offer forms |
| `/areas`, `/about`, `/contact`, `/privacy`, `/do-not-sell` | Static |
| `/api/simplyrets` | Proxy to SimplyRETS (GET) |
| `/api/lead` | Lead intake (POST). See below. |

## Lead flow

Every form POSTs to `/api/lead`. The route validates, drops honeypot hits, then fans out to whatever is configured:

1. **Follow Up Boss** if `FUB_API_KEY` is set (Events API, so action plans fire)
2. **Webhook** if `LEAD_WEBHOOK_URL` is set (n8n, Zapier, Make). Add `LEAD_WEBHOOK_SECRET` and check the `X-Lead-Secret` header on the receiver.
3. **stdout** always, visible in `docker logs`

Sinks are independent; one failing never blocks the others or the visitor's success message.

## Consent and pixels

Consent is a first party cookie (`cf_consent`), no server state. `src/components/Pixels.js` injects Meta Pixel (`NEXT_PUBLIC_META_PIXEL_ID`) and GTM (`NEXT_PUBLIC_GTM_ID`) only after the visitor accepts. Global Privacy Control is honored as a reject. `/do-not-sell` writes a reject.

`src/lib/tracker.js` pushes events to `dataLayer` and `fbq` when loaded. Nothing is stored server side.

## Env

See `.env.example`. `NEXT_PUBLIC_*` are build time and must be passed as Docker build args (the Dockerfile declares them). Server secrets are runtime env.

## Commands

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run lint
docker build -t codyfiesel-site .
```

## Conventions carried from the parent

- Server components by default; `'use client'` only where there is interaction
- API client returns `[]`/`null` on failure, never throws into a page
- Pages have fallback query chains so they never render empty
- Inline styles, COLORS/FONTS from brand.js
- No tests. Manual verification: build, hit every route, submit a form, check `docker logs` for `[lead]`

## Security

- Never commit `.env`
- Secrets only via `process.env`, never in source
- SimplyRETS and FUB keys are Cody's; they do not go in any other project's config
