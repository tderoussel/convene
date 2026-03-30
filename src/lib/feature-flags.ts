/**
 * Feature flags derived from environment variables.
 *
 * When USE_SUPABASE is false the app operates in demo mode with
 * mock data — no real database calls are made.
 */

export const USE_SUPABASE: boolean =
  process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';

export const IS_DEMO_MODE: boolean = !USE_SUPABASE;
