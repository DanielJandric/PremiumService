import { NextRequest, NextResponse } from 'next/server';
import { renderHtmlToPdf } from '@/server/pdf/renderer';
import { renderTemplate } from '@/server/templates/merge';
import { z } from 'zod';

const schema = z.object({
  html: z.string().min(1),
  css: z.string().optional(),
  data: z.record(z.any()),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  const { html, css, data } = parsed.data;
  const merged = renderTemplate(html, data);
  const pdf = await renderHtmlToPdf({ html: merged, css });
  return new NextResponse(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="preview.pdf"',
    },
  });
}

