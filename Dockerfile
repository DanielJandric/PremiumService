# Use Node 20 base image
FROM node:20-slim

# Install dependencies for Playwright
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY pnpm-workspace.yaml package.json .eslintrc.cjs tsconfig.base.json .prettierrc ./
COPY packages ./packages
COPY apps/web ./apps/web

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
RUN pnpm install --no-frozen-lockfile

# Install Playwright browsers
RUN pnpm -C apps/web exec playwright install chromium

RUN pnpm -C packages/domain build
RUN pnpm -C apps/web exec prisma generate

# Set placeholder env vars for build only
ENV DATABASE_URL=postgresql://placeholder
ENV NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
ENV SUPABASE_SERVICE_ROLE_KEY=placeholder
ENV OPENAI_API_KEY=placeholder

RUN pnpm -C apps/web build

ENV PORT=3000
EXPOSE 3000
CMD ["pnpm", "-C", "apps/web", "start"]

