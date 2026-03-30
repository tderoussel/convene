import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { ADMIN_EMAILS } from '@/lib/constants';

/**
 * Public routes that never require authentication.
 */
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/waitlist',
  '/apply',
  '/reset-password',
  '/about',
  '/privacy',
  '/terms',
  '/auth/callback',
];

function isPublic(pathname: string): boolean {
  // Exact match on known public pages
  if (PUBLIC_PATHS.includes(pathname)) return true;
  // All API routes are public (auth is handled per-route)
  if (pathname.startsWith('/api/')) return true;
  return false;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes through without any auth checks
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // ── Demo mode: allow all routes when Supabase is not configured ──
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || process.env.NEXT_PUBLIC_USE_SUPABASE !== 'true') {
    // In demo mode, let all routes through — auth is handled client-side via Zustand
    return NextResponse.next();
  }

  // ── Create a Supabase client that can read/write cookies ──
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh the session (important for token rotation)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Protected routes ──

  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Admin routes require an admin email ──

  if (pathname.startsWith('/admin')) {
    const email = user.email ?? '';
    if (!ADMIN_EMAILS.includes(email)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on all paths except static assets and Next.js internals.
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
