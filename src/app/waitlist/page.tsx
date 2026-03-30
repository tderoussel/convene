'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

type LookingFor = '' | 'Cofounder' | 'Investment' | 'Advisor' | 'Hires' | 'Community' | 'Multiple';

interface FormData {
  fullName: string;
  email: string;
  oneLiner: string;
  linkedinUrl: string;
  lookingFor: LookingFor;
  offerStatement: string;
  referralCode: string;
}

function WaitlistForm() {
  const searchParams = useSearchParams();

  const [form, setForm] = useState<FormData>({
    fullName: '',
    email: '',
    oneLiner: '',
    linkedinUrl: '',
    lookingFor: '',
    offerStatement: '',
    referralCode: searchParams.get('ref') ?? '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Required';
    if (!form.email.trim()) newErrors.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.oneLiner.trim()) newErrors.oneLiner = 'Required';
    else if (form.oneLiner.length > 100) newErrors.oneLiner = 'Max 100 characters';
    if (!form.linkedinUrl.trim()) newErrors.linkedinUrl = 'Required';
    else if (!form.linkedinUrl.includes('linkedin.com/')) newErrors.linkedinUrl = 'Invalid LinkedIn URL';
    if (!form.lookingFor) newErrors.lookingFor = 'Required';
    if (!form.offerStatement.trim()) newErrors.offerStatement = 'Required';
    else if (form.offerStatement.length > 200) newErrors.offerStatement = 'Max 200 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStatus('success');
  }

  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="card p-10 max-w-md w-full text-center animate-fade-in">
          <div className="w-12 h-12 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-5">
            <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2 text-text-primary">You&apos;re on the list</h2>
          <p className="text-sm text-text-muted mb-6">
            We review applications weekly. If you&apos;re a fit, you&apos;ll receive an invite to join.
          </p>
          <Link href="/" className="text-sm text-primary hover:text-primary-hover font-medium transition-colors">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="max-w-xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/"><Logo size="sm" /></Link>
          <Link href="/" className="text-xs text-text-muted hover:text-text-secondary transition-colors">Back</Link>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary mb-2">Apply for access</h1>
          <p className="text-sm text-text-muted">Alyned is invite-only. Tell us about yourself and we&apos;ll review your application.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Full name" error={errors.fullName}>
            <input type="text" value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)} placeholder="Jane Smith" className="input" />
          </Field>

          <Field label="Email" error={errors.email}>
            <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="jane@company.com" className="input" />
          </Field>

          <Field label="What do you do?" error={errors.oneLiner} counter={`${form.oneLiner.length}/100`}>
            <input type="text" value={form.oneLiner} onChange={(e) => updateField('oneLiner', e.target.value)} placeholder="CTO at Acme, building dev tools" maxLength={100} className="input" />
          </Field>

          <Field label="LinkedIn URL" note="Proof of work" error={errors.linkedinUrl}>
            <input type="url" value={form.linkedinUrl} onChange={(e) => updateField('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/in/janesmith" className="input" />
          </Field>

          <Field label="What are you looking for?" error={errors.lookingFor}>
            <select value={form.lookingFor} onChange={(e) => updateField('lookingFor', e.target.value)} className="input appearance-none">
              <option value="" disabled>Select one</option>
              <option value="Cofounder">Cofounder</option>
              <option value="Investment">Investment</option>
              <option value="Advisor">Advisor</option>
              <option value="Hires">Hires</option>
              <option value="Community">Community</option>
              <option value="Multiple">Multiple</option>
            </select>
          </Field>

          <Field label="What could you offer another member?" error={errors.offerStatement} counter={`${form.offerStatement.length}/200`}>
            <textarea value={form.offerStatement} onChange={(e) => updateField('offerStatement', e.target.value)} placeholder="I can help with..." maxLength={200} rows={3} className="input resize-none" />
          </Field>

          <Field label="Referral code" note="optional">
            <input type="text" value={form.referralCode} onChange={(e) => updateField('referralCode', e.target.value)} placeholder="e.g. raj-patel-x7k2" className="input" />
          </Field>

          <div className="pt-2">
            <button type="submit" disabled={status === 'loading'} className="btn-primary w-full py-2.5">
              {status === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </span>
              ) : 'Submit application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, note, error, counter, children }: {
  label: string;
  note?: string;
  error?: string;
  counter?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-1.5">
        {label}
        {note && <span className="text-text-muted font-normal ml-1">({note})</span>}
      </label>
      {children}
      <div className="flex justify-between mt-1">
        {error ? <p className="text-xs text-danger">{error}</p> : <span />}
        {counter && <span className="text-xs text-text-muted">{counter}</span>}
      </div>
    </div>
  );
}

export default function WaitlistPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <WaitlistForm />
    </Suspense>
  );
}
