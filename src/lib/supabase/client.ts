import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser-side Supabase client (singleton per tab).
 * Call this from Client Components or browser-only code.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
