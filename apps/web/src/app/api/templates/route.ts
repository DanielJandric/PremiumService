import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';

export async function GET() {
  try {
    const templates = await prisma.template.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(templates);
  } catch (e) {
    // En dev sans DB, renvoyer une liste vide pour ne pas bloquer l'UI
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => null);
    if (!json) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    const created = await prisma.template.create({ data: json });
    return NextResponse.json(created);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'DB error' }, { status: 500 });
  }
}

