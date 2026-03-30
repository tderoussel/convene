import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/"><Logo size="sm" /></Link>
          <Link href="/" className="text-xs text-text-muted hover:text-text-secondary transition-colors">Back</Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-14">
        <h1 className="text-2xl font-semibold tracking-tight mb-6">Privacy Policy</h1>
        <p className="text-xs text-text-muted mb-6">Last updated: March 29, 2026</p>

        <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">1. Information We Collect</h2>
            <p>When you apply to or use Convene, we collect information you provide directly, including your name, email address, LinkedIn profile URL, professional background, and any other information you choose to share.</p>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">2. How We Use Your Information</h2>
            <p>We use your information to operate and improve Convene, including reviewing applications, facilitating connections, calculating reputation scores, and communicating about your account.</p>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">3. Information Sharing</h2>
            <p>Your profile is visible to other members. We do not sell your personal information. We may share information with service providers and as required by law.</p>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">4. Data Security</h2>
            <p>We implement industry-standard security measures. No method of transmission is completely secure, and we cannot guarantee absolute security.</p>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">5. Your Rights</h2>
            <p>You may access, update, or delete your personal information through account settings. Contact us at privacy@convene.app for data requests.</p>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">6. Contact</h2>
            <p>Questions? Email <a href="mailto:privacy@convene.app" className="text-primary hover:text-primary-hover transition-colors">privacy@convene.app</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
