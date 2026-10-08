# ===========================================================================================================
# codyfiesel.com — Dockerfile
# Next.js Standalone | Coolify on Hostinger KVM2
# ===========================================================================================================

# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else npm install; \
  fi

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_SITE_URL=https://codyfiesel.com
ARG NEXT_PUBLIC_META_PIXEL_ID=
ARG NEXT_PUBLIC_GTM_ID=
ARG NEXT_PUBLIC_CALENDLY_URL=
ARG NEXT_PUBLIC_PRIVACY_EMAIL=
ARG NEXT_PUBLIC_CONSENT_BANNER_ENABLED=true
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_META_PIXEL_ID=${NEXT_PUBLIC_META_PIXEL_ID}
ENV NEXT_PUBLIC_GTM_ID=${NEXT_PUBLIC_GTM_ID}
ENV NEXT_PUBLIC_CALENDLY_URL=${NEXT_PUBLIC_CALENDLY_URL}
ENV NEXT_PUBLIC_PRIVACY_EMAIL=${NEXT_PUBLIC_PRIVACY_EMAIL}
ENV NEXT_PUBLIC_CONSENT_BANNER_ENABLED=${NEXT_PUBLIC_CONSENT_BANNER_ENABLED}
ENV NEXT_TELEMETRY_DISABLED=1

RUN if ! grep -q "standalone" next.config.mjs 2>/dev/null && \
       ! grep -q "standalone" next.config.js 2>/dev/null && \
       ! grep -q "standalone" next.config.ts 2>/dev/null; then \
      echo "ERROR: next.config must contain output: standalone"; exit 1; \
    fi

RUN npm run build

# Stage 3: Production runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_OPTIONS="--max-old-space-size=512"

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
