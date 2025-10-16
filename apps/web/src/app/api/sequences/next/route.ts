import { NextRequest, NextResponse } from 'next/server';
import { nextNumber } from '@/server/numbering';
import { z } from 'zod';

const bodySchema = z.object({ kind: z.enum(['devis', 'facture']) });

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
  const num = await nextNumber(parsed.data.kind);
  return NextResponse.json({ number: num });
}

