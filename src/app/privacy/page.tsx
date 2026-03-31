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
        <h1 className="text-2xl font-semibold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-xs text-text-muted mb-8">Last updated: March 30, 2026</p>

        <div className="space-y-8 text-sm text-text-secondary leading-relaxed">
          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">1. Information We Collect</h2>
            <p className="mb-3"><strong className="text-text-primary">Account Information:</strong> When you apply to or register for Alyned, we collect your name, email address, password, LinkedIn profile URL, company URL, location, professional background, and any other information you choose to provide in your application or profile.</p>
            <p className="mb-3"><strong className="text-text-primary">Profile Information:</strong> Information you add to your profile, including your photo, one-liner, what you&apos;re looking for, and what you offer other members.</p>
            <p className="mb-3"><strong className="text-text-primary">Usage Data:</strong> We collect information about how you interact with Alyned, including pages visited, rooms joined, messages sent, connections made, and feature usage patterns.</p>
            <p className="mb-3"><strong className="text-text-primary">Device Information:</strong> Browser type, operating system, IP address, and device identifiers collected automatically when you access Alyned.</p>
            <p><strong className="text-text-primary">Communications:</strong> Messages you send through the platform, including room messages and direct messages to other members.</p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">2. How We Use Your Information</h2>
            <p className="mb-2">We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Operate, maintain, and improve Alyned</li>
              <li>Review and process membership applications</li>
              <li>Facilitate connections and communications between members</li>
              <li>Calculate reputation scores and tier assignments</li>
              <li>Generate personalized member recommendations and daily feeds</li>
              <li>Send transactional emails (application status, connection notifications, tier upgrades)</li>
              <li>Detect and prevent fraud, abuse, and security incidents</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">3. Information Sharing</h2>
            <p className="mb-3">Your profile information is visible to other accepted Alyned members. We do not sell your personal information to third parties.</p>
            <p className="mb-2">We may share information with:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-text-primary">Service Providers:</strong> We use Supabase (database and authentication), Resend (transactional email), and Vercel (hosting) to operate the platform. These providers process data on our behalf under strict data processing agreements.</li>
              <li><strong className="text-text-primary">Legal Requirements:</strong> We may disclose information if required by law, regulation, legal process, or governmental request.</li>
              <li><strong className="text-text-primary">Safety:</strong> We may share information to protect the rights, safety, and property of Alyned, our members, or the public.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">4. Data Retention</h2>
            <p>We retain your personal information for as long as your account is active or as needed to provide services. If you delete your account, we will delete your personal data within 30 days, except where retention is required by law or for legitimate business purposes (e.g., fraud prevention, resolving disputes).</p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">5. Data Security</h2>
            <p>We implement industry-standard security measures including encryption in transit (TLS), encryption at rest, row-level security policies, and regular security audits. No method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">6. Your Rights (GDPR / CCPA)</h2>
            <p className="mb-2">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-text-primary">Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong className="text-text-primary">Rectification:</strong> Request correction of inaccurate personal data</li>
              <li><strong className="text-text-primary">Erasure:</strong> Request deletion of your personal data (&quot;right to be forgotten&quot;)</li>
              <li><strong className="text-text-primary">Portability:</strong> Request your data in a structured, machine-readable format</li>
              <li><strong className="text-text-primary">Restriction:</strong> Request restriction of processing of your personal data</li>
              <li><strong className="text-text-primary">Objection:</strong> Object to processing of your personal data</li>
              <li><strong className="text-text-primary">Non-Discrimination (CCPA):</strong> We will not discriminate against you for exercising your rights</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, email <a href="mailto:privacy@alyned.app" className="text-primary hover:text-primary-hover transition-colors">privacy@alyned.app</a>. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">7. Cookies and Tracking</h2>
            <p>Alyned uses essential cookies for authentication and session management. We do not use advertising cookies or third-party tracking pixels. We use localStorage to persist your session preferences.</p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">8. International Data Transfers</h2>
            <p>Your data may be processed in the United States where our service providers operate. We ensure appropriate safeguards are in place for international transfers, including standard contractual clauses where required by GDPR.</p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">9. Children&apos;s Privacy</h2>
            <p>Alyned is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child, we will promptly delete it.</p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">10. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of material changes by posting the updated policy on this page and updating the &quot;Last updated&quot; date. Your continued use of Alyned after changes constitutes acceptance of the revised policy.</p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">11. Contact Us</h2>
            <p>For privacy inquiries, data requests, or complaints, contact us at:</p>
            <p className="mt-2">
              Email: <a href="mailto:privacy@alyned.app" className="text-primary hover:text-primary-hover transition-colors">privacy@alyned.app</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
