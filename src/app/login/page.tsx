'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { seedProfiles } from '@/data/seedProfiles';
import { USE_SUPABASE } from '@/lib/feature-flags';
import Logo from '@/components/ui/Logo';
import type { MemberProfile } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);

    if (USE_SUPABASE) {
      // ── Supabase mode: real authentication ──
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (authError) {
          setError(authError.message);
          setLoading(false);
          return;
        }

        if (authData.user) {
          // Fetch the user's profile from the profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (profileError || !profile) {
            setError('Account found but profile not set up. Please contact support.');
            setLoading(false);
            return;
          }

          // Check if application has been accepted
          if (profile.application_status === 'pending') {
            await supabase.auth.signOut();
            setError('Your application is still under review. We\'ll email you when it\'s accepted.');
            setLoading(false);
            return;
          }

          if (profile.application_status === 'rejected') {
            await supabase.auth.signOut();
            setError('Your application was not accepted. You can reapply after 90 days.');
            setLoading(false);
            return;
          }

          login(profile as MemberProfile);
          router.push('/dashboard');
        }
      } catch {
        setError('Something went wrong. Please try again.');
        setLoading(false);
      }
      return;
    }

    // ── Demo mode: check seed profiles + locally registered users ──
    await new Promise((resolve) => setTimeout(resolve, 800));

    const normalizedEmail = email.trim().toLowerCase();

    // Check seed profiles first
    const matchedProfile = seedProfiles.find(
      (p) => p.email.toLowerCase() === normalizedEmail
    );

    if (matchedProfile) {
      login(matchedProfile);
      router.push('/dashboard');
      return;
    }

    // Check locally registered users (from apply page in demo mode)
    try {
      const stored = JSON.parse(localStorage.getItem('alyned-registered-users') || '[]');
      const matchedUser = stored.find(
        (u: { email: string; password: string; profile: MemberProfile }) =>
          u.email.toLowerCase() === normalizedEmail && u.password === password
      );

      if (matchedUser) {
        login(matchedUser.profile);
        router.push('/dashboard');
        return;
      }
    } catch { /* ignore parse errors */ }

    setError('Invalid credentials. Try demo mode or check your email.');
    setLoading(false);
  }

  function handleDemoLogin() {
    login(seedProfiles[0]);
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Link href="/">
            <Logo size="lg" />
          </Link>
        </div>

        {/* Form card */}
        <div className="card p-6">
          <h1 className="text-lg font-semibold text-text-primary mb-1 text-center">
            Welcome back
          </h1>
          <p className="text-sm text-text-muted text-center mb-6">
            Sign in to your Alyned account
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="input"
              />
            </div>

            {error && (
              <p className="text-sm text-danger text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-3 text-center">
            <Link href="/reset-password" className="text-xs text-text-muted hover:text-primary transition-colors">
              Forgot password?
            </Link>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-muted">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Demo login */}
          <button
            onClick={handleDemoLogin}
            className="btn-secondary w-full py-2.5"
          >
            Try Demo Mode
          </button>
        </div>

        {/* Bottom link */}
        <p className="text-center text-sm text-text-muted mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/waitlist" className="text-primary hover:text-primary-hover font-medium transition-colors">
            Apply for access
          </Link>
        </p>
      </div>
    </div>
  );
}
