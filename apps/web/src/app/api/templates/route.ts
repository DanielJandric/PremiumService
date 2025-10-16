import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';

export async function GET() {
  const templates = await prisma.template.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(templates);
}

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  if (!json) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  const created = await prisma.template.create({ data: json });
  return NextResponse.json(created);
}

