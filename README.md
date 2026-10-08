# codyfiesel.com

Agent website for Cody Fiesel. Next.js listing engine on Cody's own SimplyRETS/BAREIS feed, deployed with Coolify.

## Before first deploy

1. **Fill in `src/lib/brand.js`.** Every `TODO` is a placeholder. Name, DRE, brokerage, phone (both display and `tel:+1...`), email, bio paragraphs, social links, CPR class details.
2. **Drop Cody's headshot** at `public/images/headshot.jpg` (square, at least 600px). Optional broker logo at `public/images/broker-logo.png` and set `BROKER.logo` in brand.js.
3. **Replace `public/og-default.png`** (1200x630) once you have a real photo. The current one is a text placeholder.
4. Optional: swap `public/images/vineyard-hero.webp` for a photo Cody owns.

## Deploy on Coolify

1. Push this repo to GitHub (private).
2. Coolify → New Resource → Application → GitHub → pick the repo. Build pack: **Dockerfile**. Port **3000**.
3. **Build args** (public, baked into the bundle):
   - `NEXT_PUBLIC_SITE_URL=https://codyfiesel.com`
   - `NEXT_PUBLIC_META_PIXEL_ID=<Cody's pixel>`
   - `NEXT_PUBLIC_CALENDLY_URL=` (optional)
4. **Runtime env** (secret, server only):
   - `SIMPLYRETS_API_KEY` / `SIMPLYRETS_API_SECRET` (Cody's app)
   - `FUB_API_KEY` if he uses Follow Up Boss
   - `LEAD_WEBHOOK_URL` + `LEAD_WEBHOOK_SECRET` for n8n email/SMS delivery
5. Domain: `codyfiesel.com` with HTTPS. Coolify's Traefik issues the cert.
6. Cloudflare DNS: `A codyfiesel.com → <VPS IP>` proxied, `CNAME www → codyfiesel.com` proxied. SSL/TLS mode **Full (strict)**. Redirect rule `www.codyfiesel.com/* → https://codyfiesel.com/$1` (301).
7. Deploy. Verify: `/`, `/search`, a listing page, submit the contact form, check logs for `[lead]`.

## Local dev

```bash
cp .env.example .env.local   # fill in SimplyRETS keys
npm install
npm run dev
```

## Lead delivery options

Leads always print to the container log. To actually reach Cody, set at least one of:

- `FUB_API_KEY` — lead lands in Follow Up Boss with source and property.
- `LEAD_WEBHOOK_URL` — JSON POST to n8n/Zapier/Make. From there, email or text Cody. Payload fields: `name, email, phone, message, source, conversion_type, listing_id, page_path, received_at, referer`.
