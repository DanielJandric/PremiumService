import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/server/env';
import { z } from 'zod';

const schema = z.object({
  messages: z.array(
    z.object({ role: z.enum(['system', 'user', 'assistant']), content: z.string() }),
  ),
  mode: z.enum(['text', 'json']).default('text'),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  const { messages, mode } = parsed.data;

  const payload = {
    model: 'gpt-4o-mini',
    messages,
    temperature: 0.1,
    top_p: 0.1,
    max_tokens: 800,
    response_format: mode === 'json' ? { type: 'json_object' } : undefined,
  } as any;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text }, { status: 500 });
  }
  const data = await res.json();
  return NextResponse.json(data);
}

