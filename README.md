## Premium Solution — Devis & Factures (Conversation-first)

Monorepo pnpm: `apps/web` (Next.js 15, App Router) + `packages/domain` (Zod, calculs, formatage).

### Fonctionnalités
- Assistant conversationnel (fr-CH) pour créer des devis/factures
  - Flux minimal: nom client, adresse client, désignation(s) de service
  - Par défaut: devise CHF, TVA 8.1%, quantité 1, prix 0, date = aujourd’hui (Europe/Zurich), numéro auto
  - Deux chips fixes contextuelles: « Créer un devis » / « Créer une facture »
  - Saisie assistée (typeahead) des services normalisés (ex: Nettoyage de maison, Blanchisserie / literie, etc.)
- Génération PDF server-side (HTML/CSS → PDF via Playwright)
  - Templates éditables (HTML + CSS), brand/logo, couleurs
  - Attente réseau “networkidle” et base URL pour charger les assets
- Archive des documents (liste, lien vers PDF)
- Numérotation automatique par type (DEV-YYYY-###, FAC-YYYY-###)
- Stockage Supabase (Postgres + Storage)
- UI glassmorphism, responsive et optimisée iPhone (safe-areas, input sticky, pop-up iOS gérée)

### Stack
- Front: Next.js 15, TypeScript, Tailwind, App Router
- UI: glassmorphism, pages: Accueil, Chat, Documents, Templates
- PDF: Playwright (Chromium) HTML+CSS → PDF, templates handlebars-like
- Données: Supabase (Postgres, Storage), Prisma ORM
- AI: endpoint proxy `/api/openai`

### Flux Fonctionnel
1) Chat collecte les infos minimales (type, client, services)
2) Récapitulatif live (totaux calculés côté client)
3) Validation explicite → appel serveur `/api/documents`
4) Génération PDF + Upload Supabase + URL publique
5) Document visible dans la page Archive

### Comportement Chat (LLM)
- Ne demande PAS la TVA, la devise, le vendeur, le numéro, ni la date (valeurs par défaut)
- Comprend plusieurs services saisis naturellement (« nettoyage maison 1 x 3500 CHF »)
- Saisie assistée: suggestions de services quand on tape ≥ 2 lettres
- Deux chips fixes seulement: « Créer un devis » et « Créer une facture »

### Templates & PDF
- Page `/templates`: éditeur HTML/CSS + aperçu PDF
- Données merge: `company`, `buyer`, `items`, `totals`, `titleKind` (Devis/Facture)
- Renderer Playwright:
  - `<base href>` injecté (assets relatifs comme `/template/logo.png`)
  - `waitUntil: 'networkidle'` + attente best-effort des images
  - PDF A4 avec `printBackground`

### Numérotation
- Par modèle `Sequence` (Prisma) par `kind` (`devis`|`facture`)
- Format par défaut: `DEV-YYYY-###` / `FAC-YYYY-###`

### Modèle de Données (Prisma)
- `Template`: nom, htmlSource, css, brand (JSON)
- `Sequence`: kind, value
- `Document`: kind, number, customer (JSON), items (JSON), montants, URLs PDF

### Endpoints (principaux)
- `POST /api/documents` → crée PDF + enregistre Document (body: `{ validated: true, data }`)
- `GET  /api/documents` → liste filtrable
- `POST /api/preview`   → preview PDF depuis HTML/CSS + data
- `GET  /api/sequences/next` → prochain numéro
- `GET/POST /api/templates`, `PATCH /api/templates/:id`
- `POST /api/openai` → proxy OpenAI (usage interne au chat)

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

### Optimisations iPhone
- Input « sticky » avec `env(safe-area-inset-*)`
- Pré-ouverture d’un onglet avant génération PDF (contourne le bloqueur de pop-ups iOS)
- Viewport `maximumScale=1` pour limiter les reflows
- Défilement fluide (WebKit touch)

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
- PDF timeout / image manquante → vérifier `NEXT_PUBLIC_BASE_URL` et accès à `/template/logo.png`
- iPhone: autoriser pop-ups ; sinon l’onglet pré-ouvert reste vide
- Date incorrecte par le LLM → côté serveur on force la date jour (Europe/Zurich)

### Scripts utiles
```bash
# dev
pnpm -C apps/web dev -p 3004

# e2e (si configurés)
pnpm -C apps/web test:e2e
```

### Licence
Privé (usage interne Premium Solution).

