'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Invalid email.'); return; }
    setStatus('loading');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus('success');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-10">
          <Link href="/"><Logo size="lg" /></Link>
        </div>

        <div className="card p-6">
          {status === 'success' ? (
            <div className="text-center">
              <div className="w-10 h-10 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-text-primary mb-1.5">Check your email</h2>
              <p className="text-sm text-text-muted mb-5">
                If an account exists for <span className="text-text-primary font-medium">{email}</span>, you&apos;ll receive a reset link.
              </p>
              <Link href="/login" className="text-sm text-primary hover:text-primary-hover font-medium transition-colors">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-lg font-semibold text-text-primary mb-1 text-center">Reset password</h1>
              <p className="text-sm text-text-muted text-center mb-6">Enter your email for a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-text-muted mb-1">Email</label>
                  <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} placeholder="you@company.com" className="input" />
                  {error && <p className="mt-1 text-xs text-danger">{error}</p>}
                </div>
                <button type="submit" disabled={status === 'loading'} className="btn-primary w-full py-2.5">
                  {status === 'loading' ? 'Sending...' : 'Send reset link'}
                </button>
              </form>
              <div className="mt-4 text-center">
                <Link href="/login" className="text-xs text-text-muted hover:text-primary transition-colors">Back to sign in</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
