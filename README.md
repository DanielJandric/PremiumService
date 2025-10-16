## Premium Solution — Devis & Factures (Conversation-first)

Monorepo pnpm: `apps/web` (Next.js 15, App Router) + `packages/domain` (Zod, calculs, formatage).

### Stack
- Front: Next.js 15, TypeScript, Tailwind, App Router
- UI: glassmorphism, pages: Accueil, Chat, Documents, Templates
- PDF: Playwright (Chromium) HTML+CSS → PDF, templates handlebars-like
- Données: Supabase (Postgres, Storage), Prisma ORM
- AI: endpoint proxy `/api/openai`

### Prérequis
- Node 20+
- pnpm 9+

### Variables d’environnement (apps/web/.env.local)
```
DATABASE_URL=postgresql://<user>:<password>@<project>.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connection_limit=1
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_STORAGE_BUCKET=documents
SUPABASE_ASSETS_BUCKET=assets
OPENAI_API_KEY=...
NEXT_PUBLIC_APP_NAME=Premium Solution
NEXT_PUBLIC_BASE_URL=http://localhost:3004
PRISMA_DISABLE_PREPARED_STATEMENTS=true
```

### Démarrage local
```bash
pnpm install
pnpm -C packages/domain build
pnpm -C apps/web dev -p 3004
```

### Base de données & Storage
1) Supabase → SQL Editor → exécuter `apps/web/prisma/migrations/0001_init.sql` si tables manquantes
2) Assurer le bucket documents: ouvrir `/api/admin/ensure-bucket`
3) (Optionnel) Bucket `assets` public pour logos; en dev, `apps/web/public/template/logo.png` est servi en local

### Génération de PDF
- Aperçu: `/templates` → HTML/CSS → Aperçu PDF
- Document final: `/chat` (collecte) → “Valider et générer le PDF”
- Stockage: PDF uploadés dans Supabase Storage (`documents/…`) avec URL publique

### Numérotation
- Auto via `nextNumber(kind)`, format `DEV-YYYY-###` ou `FAC-YYYY-###` (configurable)

### Déploiement Render (Docker)
1) Pousser le repo (lockfile présent)
2) Créer Web Service Docker (branche `main`), auto-deploy ON
3) Renseigner les variables d’environnement (cf. ci-dessus)
4) Clear build cache si nécessaire et Deploy

### Débogage courant
- “prepared statement exists” → utiliser pooler `pgbouncer=true`, `PRISMA_DISABLE_PREPARED_STATEMENTS=true`
- “signature verification failed” → URL/keys Supabase incohérentes
- Playwright: installer navigateur côté CI si non Dockerisé; ici le Dockerfile inclut Playwright

### Scripts utiles
```bash
# dev
pnpm -C apps/web dev -p 3004

# e2e (si configurés)
pnpm -C apps/web test:e2e
```

### Licence
Privé (usage interne Premium Solution).

