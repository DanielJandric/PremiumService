import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_STORAGE_BUCKET: z.string().default('documents'),
  SUPABASE_ASSETS_BUCKET: z.string().default('assets'),
  OPENAI_API_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_NAME: z.string().default('Premium Solutions'),
  NEXT_PUBLIC_BASE_URL: z.string().url().optional(),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  // During build, use defaults; only throw at runtime if critical vars are missing
  if (process.env.NODE_ENV === 'production' && typeof window === 'undefined' && !process.env.BUILDING) {
    console.error('Invalid environment variables', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }
}

export const env = parsed.success ? parsed.data : {
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://localhost',
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder',
  SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET || 'documents',
  SUPABASE_ASSETS_BUCKET: process.env.SUPABASE_ASSETS_BUCKET || 'assets',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'placeholder',
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Premium Solution',
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
} as z.infer<typeof envSchema>;

