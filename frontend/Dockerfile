FROM node:20-alpine AS base

# Install libc6-compat for Alpine compatibility
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Stage 1: Install dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build the Next.js application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p /app/public

# Build arguments for Next.js public environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_TURNSTILE_ENABLED
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    NEXT_PUBLIC_TURNSTILE_ENABLED=${NEXT_PUBLIC_TURNSTILE_ENABLED} \
    NEXT_PUBLIC_TURNSTILE_SITE_KEY=${NEXT_PUBLIC_TURNSTILE_SITE_KEY} \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

RUN npm run build

# Stage 3: Production Runner (Lean Standalone image)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# Run as non-root user for maximum security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public assets and static files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
