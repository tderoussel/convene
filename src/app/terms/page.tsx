import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/"><Logo size="sm" /></Link>
          <Link href="/" className="text-xs text-text-muted hover:text-text-secondary transition-colors">Back</Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-14">
        <h1 className="text-2xl font-semibold tracking-tight mb-6">Terms of Service</h1>
        <p className="text-xs text-text-muted mb-6">Last updated: March 29, 2026</p>

        <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using Convene, you agree to be bound by these Terms of Service. If you do not agree, you may not use the platform.</p>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">2. Eligibility</h2>
            <p>Convene is an invite-only platform. Access is granted at our sole discretion. You must be at least 18 years old and provide accurate information.</p>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">3. Conduct</h2>
            <p>Members must engage respectfully. Harassment, spam, solicitation, and sharing confidential information are prohibited and may result in removal.</p>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">4. Reputation and Tiers</h2>
            <p>Your tier is determined by contributions and conduct. We reserve the right to adjust reputation scores to maintain community quality.</p>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">5. Content</h2>
            <p>You retain ownership of content you post. By posting, you grant Convene a non-exclusive license to display it within the platform.</p>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">6. Termination</h2>
            <p>We may suspend or terminate your account at any time. You may delete your account through settings.</p>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">7. Limitation of Liability</h2>
            <p>Convene is provided &quot;as is&quot; without warranties. We are not liable for damages arising from your use of the platform.</p>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">8. Contact</h2>
            <p>Questions? Email <a href="mailto:legal@convene.app" className="text-primary hover:text-primary-hover transition-colors">legal@convene.app</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
