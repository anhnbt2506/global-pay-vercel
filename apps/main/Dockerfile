# Install dependencies and build the source code #
FROM node:18-alpine AS builder

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /opt

COPY . .

# Import arguments
ARG NEXT_PUBLIC_STAGE
ARG NEXT_PUBLIC_VERSION
ARG NEXT_PUBLIC_TINYMCE_API_KEY
ARG NEXT_PUBLIC_GATEWAY_HOST
ARG NEXT_PUBLIC_PEOPLE_API_HOST
ARG NEXT_PUBLIC_FINTECH_API_HOST
ARG NEXT_PUBLIC_TABLEAU_HOST_URL
ARG NEXT_PUBLIC_TABLEAU_DASHBOARD_NAME
ARG NEXT_PUBLIC_GTM_ID
ARG NEXT_PUBLIC_HJID
ARG NEXT_PUBLIC_USER_PILOT_TOKEN

# Set environments
ENV NEXT_PUBLIC_STAGE ${NEXT_PUBLIC_STAGE}
ENV NEXT_PUBLIC_VERSION ${NEXT_PUBLIC_VERSION}
ENV NEXT_PUBLIC_TINYMCE_API_KEY ${NEXT_PUBLIC_TINYMCE_API_KEY}
ENV NEXT_PUBLIC_GATEWAY_HOST ${NEXT_PUBLIC_GATEWAY_HOST}
ENV NEXT_PUBLIC_PEOPLE_API_HOST ${NEXT_PUBLIC_PEOPLE_API_HOST}
ENV NEXT_PUBLIC_FINTECH_API_HOST ${NEXT_PUBLIC_FINTECH_API_HOST}
ENV NEXT_PUBLIC_TABLEAU_HOST_URL ${NEXT_PUBLIC_TABLEAU_HOST_URL}
ENV NEXT_PUBLIC_TABLEAU_DASHBOARD_NAME ${NEXT_PUBLIC_TABLEAU_DASHBOARD_NAME}
ENV NEXT_PUBLIC_GTM_ID ${NEXT_PUBLIC_GTM_ID}
ENV NEXT_PUBLIC_HJID ${NEXT_PUBLIC_HJID}
ENV NEXT_PUBLIC_USER_PILOT_TOKEN ${NEXT_PUBLIC_USER_PILOT_TOKEN}

# Install pnpm
RUN corepack enable
RUN corepack prepare pnpm@7.30.5 --activate

RUN pnpm install:ci && pnpm nx build @ayp/main

# Production image #
FROM node:18-alpine AS runner
WORKDIR /opt

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy the required assets
COPY --from=builder /opt/apps/main/public ./apps/main/public
COPY --from=builder /opt/apps/main/next.config.mjs ./apps/main/

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /opt/apps/main/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /opt/apps/main/.next/static ./apps/main/.next/static

WORKDIR /opt/apps/main

# Install pnpm
RUN corepack enable
RUN corepack prepare pnpm@7.30.5 --activate

# Install next-logger to be passed during preload
# TODO: Are there a better way to install next-logger without reading the existing package.json?
RUN mv package.json ../
RUN pnpm add next-logger@^3.0.0 sharp@^0.32.1
RUN mv ../package.json ./
ENV NEXT_SHARP_PATH=/opt/apps/main/node_modules/sharp

USER nextjs

EXPOSE 3000

CMD ["sh", "-c", "NODE_OPTIONS='-r next-logger' node server.js"]
