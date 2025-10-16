import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createDocument } from '@/server/documents/create';
import { prisma } from '@/server/db';

const bodySchema = z.object({
  data: z.any(),
  validated: z.boolean(),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  if (!parsed.data.validated) {
    return NextResponse.json({ error: 'Validation gating not satisfied' }, { status: 400 });
  }

  try {
    const created = await createDocument(parsed.data.data, { validated: true });
    return NextResponse.json({ id: created.id, url: created.pdfPublicUrl, number: created.number });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const kind = searchParams.get('kind') as 'devis' | 'facture' | null;
  const number = searchParams.get('number');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const where: any = {};
  if (kind) where.kind = kind;
  if (number) where.number = { contains: number };
  if (from || to) where.issueDate = { gte: from ? new Date(from) : undefined, lte: to ? new Date(to) : undefined };
  const docs = await prisma.document.findMany({ where, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(docs);
}

