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
RUN pnpm -C apps/web build

ENV PORT=3000
EXPOSE 3000
CMD ["pnpm", "-C", "apps/web", "start"]

