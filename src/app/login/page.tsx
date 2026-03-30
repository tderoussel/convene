'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { seedProfiles } from '@/data/seedProfiles';
import Logo from '@/components/ui/Logo';

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
    await new Promise((resolve) => setTimeout(resolve, 800));

    const matchedProfile = seedProfiles.find(
      (p) => p.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (matchedProfile) {
      login(matchedProfile);
      router.push('/dashboard');
    } else {
      setError('Invalid credentials. Try demo mode or check your email.');
      setLoading(false);
    }
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
            Sign in to your Convene account
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
