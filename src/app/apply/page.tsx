'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { seedProfiles } from '@/data/seedProfiles';
import Logo from '@/components/ui/Logo';

interface StepData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  photoUrl: string;
  location: string;
  companyUrl: string;
  linkedinUrl: string;
  oneLiner: string;
  lookingFor: string;
  offerStatement: string;
}

const STEPS = ['Account', 'Profile', 'About', 'Review'] as const;

export default function ApplyPage() {
  const router = useRouter();
  const { login } = useAppStore();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof StepData, string>>>({});

  const [data, setData] = useState<StepData>({
    email: '', password: '', confirmPassword: '', fullName: '', photoUrl: '',
    location: '', companyUrl: '', linkedinUrl: '', oneLiner: '', lookingFor: '', offerStatement: '',
  });

  function updateField(field: keyof StepData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
  }

  function validateStep(): boolean {
    const e: Partial<Record<keyof StepData, string>> = {};
    if (step === 0) {
      if (!data.email.trim()) e.email = 'Required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Invalid email';
      if (!data.password.trim()) e.password = 'Required';
      else if (data.password.length < 8) e.password = 'Min 8 characters';
      if (data.password !== data.confirmPassword) e.confirmPassword = 'Passwords do not match';
      if (!data.fullName.trim()) e.fullName = 'Required';
    } else if (step === 1) {
      if (!data.linkedinUrl.trim()) e.linkedinUrl = 'Required';
      else if (!data.linkedinUrl.includes('linkedin.com/')) e.linkedinUrl = 'Invalid LinkedIn URL';
    } else if (step === 2) {
      if (!data.oneLiner.trim()) e.oneLiner = 'Required';
      if (!data.lookingFor) e.lookingFor = 'Required';
      if (!data.offerStatement.trim()) e.offerStatement = 'Required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() { if (validateStep()) setStep((s) => Math.min(s + 1, STEPS.length - 1)); }
  function handleBack() { setStep((s) => Math.max(s - 1, 0)); }

  async function handleSubmit() {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const demoUser = {
      ...seedProfiles[0],
      id: 'demo-new-user', email: data.email, full_name: data.fullName,
      photo_url: data.photoUrl || null, linkedin_url: data.linkedinUrl || null,
      company_url: data.companyUrl || null, location: data.location || null,
      one_liner: data.oneLiner || null, what_looking_for: data.lookingFor || null,
      offer_statement: data.offerStatement || null,
      tier: 'explorer' as const, reputation_score: 0, total_room_posts: 0,
      application_status: 'accepted' as const, is_onboarded: true,
    };
    login(demoUser);
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="max-w-xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/"><Logo size="sm" /></Link>
          <Link href="/" className="text-xs text-text-muted hover:text-text-secondary transition-colors">Back</Link>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-6 py-10">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((name, i) => (
              <div key={name} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-medium transition-colors ${
                  i <= step ? 'bg-primary text-white' : 'bg-surface-light text-text-muted border border-border'
                }`}>
                  {i < step ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : i + 1}
                </div>
                <span className={`text-xs hidden sm:inline ${i <= step ? 'text-text-primary' : 'text-text-muted'}`}>{name}</span>
              </div>
            ))}
          </div>
          <div className="w-full h-1 bg-surface-lighter rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>

        {/* Steps */}
        <div className="animate-fade-in" key={step}>
          {step === 0 && (
            <div className="space-y-4">
              <div><h2 className="text-lg font-semibold mb-1">Create your account</h2><p className="text-xs text-text-muted">Choose your credentials.</p></div>
              <InputField label="Email" field="email" type="email" placeholder="you@company.com" data={data} errors={errors} onChange={updateField} />
              <InputField label="Full name" field="fullName" placeholder="Jane Smith" data={data} errors={errors} onChange={updateField} />
              <InputField label="Password" field="password" type="password" placeholder="Min 8 characters" data={data} errors={errors} onChange={updateField} />
              <InputField label="Confirm password" field="confirmPassword" type="password" placeholder="Repeat" data={data} errors={errors} onChange={updateField} />
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <div><h2 className="text-lg font-semibold mb-1">Build your profile</h2><p className="text-xs text-text-muted">Help others know who you are.</p></div>
              <InputField label="Photo URL" field="photoUrl" placeholder="https://..." data={data} errors={errors} onChange={updateField} />
              <InputField label="Location" field="location" placeholder="San Francisco, CA" data={data} errors={errors} onChange={updateField} />
              <InputField label="Company URL" field="companyUrl" placeholder="https://yourcompany.com" data={data} errors={errors} onChange={updateField} />
              <InputField label="LinkedIn URL" field="linkedinUrl" placeholder="https://linkedin.com/in/you" data={data} errors={errors} onChange={updateField} />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div><h2 className="text-lg font-semibold mb-1">Tell us about yourself</h2><p className="text-xs text-text-muted">This helps us match you.</p></div>
              <InputField label="One-liner" field="oneLiner" placeholder="CTO at Acme, building dev tools" maxLength={100} data={data} errors={errors} onChange={updateField} />
              <div>
                <label className="block text-xs text-text-muted mb-1">Looking for</label>
                <select value={data.lookingFor} onChange={(e) => updateField('lookingFor', e.target.value)} className="input appearance-none">
                  <option value="" disabled>Select one</option>
                  <option value="Cofounder">Cofounder</option><option value="Investment">Investment</option>
                  <option value="Advisor">Advisor</option><option value="Hires">Hires</option>
                  <option value="Community">Community</option><option value="Multiple">Multiple</option>
                </select>
                {errors.lookingFor && <p className="text-xs text-danger mt-0.5">{errors.lookingFor}</p>}
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">What could you offer another member?</label>
                <textarea value={data.offerStatement} onChange={(e) => updateField('offerStatement', e.target.value)} placeholder="I can help with..." maxLength={200} rows={3} className="input resize-none" />
                {errors.offerStatement && <p className="text-xs text-danger mt-0.5">{errors.offerStatement}</p>}
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <div><h2 className="text-lg font-semibold mb-1">Review your application</h2><p className="text-xs text-text-muted">Make sure everything looks good.</p></div>
              <div className="card p-5 space-y-3">
                {[
                  ['Name', data.fullName], ['Email', data.email], ['Location', data.location || 'Not specified'],
                  ['LinkedIn', data.linkedinUrl], ['One-liner', data.oneLiner], ['Looking for', data.lookingFor],
                  ['Offer', data.offerStatement],
                ].map(([label, value]) => (
                  <div key={label} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                    <span className="text-[11px] text-text-muted uppercase tracking-wider w-20 shrink-0">{label}</span>
                    <span className="text-sm text-text-primary break-all">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {step > 0 ? <button onClick={handleBack} className="btn-secondary text-sm px-5 py-2">Back</button> : <div />}
          {step < STEPS.length - 1 ? (
            <button onClick={handleNext} className="btn-primary text-sm px-6 py-2">Continue</button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary text-sm px-6 py-2 disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit application'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function InputField({ label, field, type = 'text', placeholder, maxLength, data, errors, onChange }: {
  label: string; field: keyof StepData; type?: string; placeholder?: string; maxLength?: number;
  data: StepData; errors: Partial<Record<keyof StepData, string>>; onChange: (field: keyof StepData, value: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-text-muted mb-1">{label}</label>
      <input type={type} value={data[field]} onChange={(e) => onChange(field, e.target.value)} placeholder={placeholder} maxLength={maxLength} className="input" />
      <div className="flex justify-between mt-0.5">
        {errors[field] ? <p className="text-xs text-danger">{errors[field]}</p> : <span />}
        {maxLength && <span className="text-[11px] text-text-muted">{data[field].length}/{maxLength}</span>}
      </div>
    </div>
  );
}
