import { createClient } from '@supabase/supabase-js';

/**
 * Admin / service-role Supabase client.
 *
 * This client bypasses Row Level Security so it should ONLY be used
 * in trusted server-side contexts (Server Actions, Route Handlers,
 * cron jobs, etc.) — never in client code.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
