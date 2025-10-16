# Playwright-ready Node image
FROM mcr.microsoft.com/playwright:v1.47.1-jammy

WORKDIR /app

COPY pnpm-workspace.yaml package.json .eslintrc.cjs tsconfig.base.json .prettierrc ./
COPY packages ./packages
COPY apps/web ./apps/web

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
RUN pnpm install --no-frozen-lockfile
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

