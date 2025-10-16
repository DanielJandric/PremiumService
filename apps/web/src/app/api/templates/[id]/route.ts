import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const json = await req.json().catch(() => null);
  if (!json) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  const { name, htmlSource, css, brand } = json as {
    name?: string;
    htmlSource?: string;
    css?: string;
    brand?: unknown;
  };
  try {
    const updated = await prisma.template.update({
      where: { id },
      data: { name, htmlSource, css, brand } as any,
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Update failed' }, { status: 500 });
  }
}


