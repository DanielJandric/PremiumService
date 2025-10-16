import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/server/supabaseAdmin';
import { env } from '@/server/env';

export async function POST() {
  const existing = await supabaseAdmin.storage.getBucket(env.SUPABASE_STORAGE_BUCKET);
  if (!existing.data) {
    await supabaseAdmin.storage.createBucket(env.SUPABASE_STORAGE_BUCKET, { public: true });
  }
  return NextResponse.json({ ok: true, bucket: env.SUPABASE_STORAGE_BUCKET });
}

export async function GET() {
  return POST();
}

