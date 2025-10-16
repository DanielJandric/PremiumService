import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/server/supabaseAdmin';
import { env } from '@/server/env';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
  const arrayBuffer = await file.arrayBuffer();
  const bytes = Buffer.from(arrayBuffer);
  const key = `logos/${Date.now()}-${file.name}`;
  const { error } = await supabaseAdmin.storage
    .from(env.SUPABASE_ASSETS_BUCKET)
    .upload(key, bytes, { contentType: file.type, upsert: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const publicUrl = supabaseAdmin.storage.from(env.SUPABASE_ASSETS_BUCKET).getPublicUrl(key).data.publicUrl;
  return NextResponse.json({ url: publicUrl, path: key });
}


