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
        <h1 className="text-2xl font-semibold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-xs text-text-muted mb-8">Last updated: March 30, 2026</p>

        <div className="space-y-8 text-sm text-text-secondary leading-relaxed">
          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using Alyned (&quot;the Platform&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you may not use the Platform. These Terms constitute a legally binding agreement between you and Alyned.</p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">2. Eligibility</h2>
            <p className="mb-2">To use Alyned, you must:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Be at least 18 years of age</li>
              <li>Submit a truthful application and be accepted by our review team</li>
              <li>Provide accurate and complete information in your profile</li>
              <li>Not have been previously removed from the Platform for violations</li>
            </ul>
            <p className="mt-2">Alyned is an invite-only platform. Access is granted at our sole discretion and may be revoked at any time.</p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">3. Account Responsibilities</h2>
            <p>You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account. Alyned is not liable for any losses arising from unauthorized access to your account.</p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">4. Acceptable Use</h2>
            <p className="mb-2">You agree to use Alyned in a professional manner. You may not:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Harass, bully, threaten, or intimidate other members</li>
              <li>Post spam, unsolicited commercial messages, or promotional content</li>
              <li>Share confidential business information of other members without consent</li>
              <li>Use the Platform for illegal activities</li>
              <li>Attempt to scrape, harvest, or collect member data</li>
              <li>Impersonate another person or misrepresent your professional background</li>
              <li>Interfere with or disrupt the Platform&apos;s infrastructure</li>
              <li>Create multiple accounts or share your account credentials</li>
              <li>Use automated tools, bots, or scripts to access the Platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">5. Reputation and Tiers</h2>
            <p>Your tier (Explorer, Builder, Catalyst) is primarily determined by your contributions and engagement within the community. Reputation scores are calculated based on your activity, including posts, connections, and peer recognition. We reserve the right to adjust reputation scores and tier assignments at our discretion to maintain community quality and prevent gaming of the system.</p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">6. Content and Intellectual Property</h2>
            <p className="mb-2">You retain ownership of content you post on Alyned. By posting content, you grant Alyned a non-exclusive, worldwide, royalty-free license to display, distribute, and reproduce your content solely within the Platform and for promotional purposes related to Alyned.</p>
            <p>Alyned&apos;s name, logo, design, and all software are the intellectual property of Alyned and may not be used without prior written permission.</p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">7. Privacy</h2>
            <p>Your use of Alyned is also governed by our <Link href="/privacy" className="text-primary hover:text-primary-hover transition-colors">Privacy Policy</Link>, which describes how we collect, use, and protect your personal information.</p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">8. Termination</h2>
            <p className="mb-2">We may suspend or terminate your account at any time, with or without notice, for conduct that we believe violates these Terms, is harmful to other members, or is otherwise detrimental to the community.</p>
            <p>You may delete your account at any time through your account settings. Upon termination, your right to use the Platform ceases immediately. Provisions that by their nature should survive termination (including intellectual property, indemnification, and limitation of liability) will survive.</p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">9. Disclaimer of Warranties</h2>
            <p>Alyned is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. We do not guarantee that the Platform will be uninterrupted, error-free, or secure. We do not endorse or verify the accuracy of information provided by members.</p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">10. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Alyned and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising from your use of the Platform. Our total liability for any claim shall not exceed the amount you paid us in the twelve (12) months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">11. Indemnification</h2>
            <p>You agree to indemnify and hold harmless Alyned from any claims, damages, losses, or expenses (including reasonable attorney&apos;s fees) arising from your use of the Platform, your violation of these Terms, or your violation of any rights of a third party.</p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">12. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to conflict of law principles. Any disputes arising from these Terms shall be resolved in the courts of Delaware.</p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">13. Changes to Terms</h2>
            <p>We may modify these Terms at any time. We will notify members of material changes via email or in-app notification. Your continued use of Alyned after changes take effect constitutes acceptance of the revised Terms.</p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-2">14. Contact</h2>
            <p>Questions about these Terms? Email <a href="mailto:legal@alyned.app" className="text-primary hover:text-primary-hover transition-colors">legal@alyned.app</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
