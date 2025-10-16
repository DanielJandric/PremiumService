import { PrismaClient } from '@prisma/client';
import { defaultClassicCH } from '../src/server/templates/classicCH';
import { supabaseAdmin } from '../src/server/supabaseAdmin';
import { env } from '../src/server/env';

const prisma = new PrismaClient();

async function main() {
  const year = new Date().getFullYear();
  await prisma.sequence.upsert({
    where: { kind_prefix: { kind: 'devis', prefix: `DEV-${year}-` } },
    update: {},
    create: { kind: 'devis', prefix: `DEV-${year}-`, counter: 0 },
  });
  await prisma.sequence.upsert({
    where: { kind_prefix: { kind: 'facture', prefix: `FAC-${year}-` } },
    update: {},
    create: { kind: 'facture', prefix: `FAC-${year}-`, counter: 0 },
  });

  await prisma.template.upsert({
    where: { name: defaultClassicCH.name },
    update: {},
    create: {
      name: defaultClassicCH.name,
      htmlSource: defaultClassicCH.htmlSource,
      css: defaultClassicCH.css,
      brand: defaultClassicCH.brand as any,
    },
  });

  // Ensure storage bucket exists (public for MVP)
  const bucket = await supabaseAdmin.storage.getBucket(env.SUPABASE_STORAGE_BUCKET);
  if (!bucket.data) {
    await supabaseAdmin.storage.createBucket(env.SUPABASE_STORAGE_BUCKET, {
      public: true,
    });
  }

  console.log('Seed done');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

