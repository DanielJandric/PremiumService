## Premium Solutions – Devis/Factures (Conversation-first)

Monorepo pnpm contenant l'app Next.js (App Router) et le package `@premium/domain`.

### Prérequis
- Node 20+
- pnpm 9+

### Installation
```bash
pnpm install
```

### Lancer en local
```bash
pnpm -C packages/domain build
cp apps/web/.env.example apps/web/.env.local # puis compléter les variables
pnpm -C apps/web prisma:generate
pnpm -C apps/web prisma:migrate
pnpm -C apps/web seed
pnpm dev
```

Plus de détails seront ajoutés au fur et à mesure (Prisma, Supabase, Playwright, CI, etc.).

