'use client';

import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Logo size="sm" />
        <nav className="hidden sm:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-text-muted hover:text-text-primary transition-colors">How it works</a>
          <a href="#tiers" className="text-sm text-text-muted hover:text-text-primary transition-colors">Tiers</a>
          <a href="#why" className="text-sm text-text-muted hover:text-text-primary transition-colors">Why Alyned</a>
        </nav>
        <Link
          href="/waitlist"
          className="btn-primary text-sm px-5 py-2"
        >
          Apply
        </Link>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="pt-28 pb-16 lg:pt-40 lg:pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl">
          <p className="hero-animate hero-delay-1 text-sm font-medium text-primary mb-4 tracking-wide">
            Accepting &lt;30% of applicants
          </p>
          <h1 className="hero-animate hero-delay-2 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-text-primary mb-6">
            Stop networking.
            <br />
            Start building together.
          </h1>
          <p className="hero-animate hero-delay-3 text-lg text-text-secondary leading-relaxed max-w-lg mb-8">
            Alyned is the vetted network for founders, investors, and operators.
            Five curated matches a day. Focused rooms. Zero noise.
          </p>
          <div className="hero-animate hero-delay-4 flex items-center gap-4">
            <Link
              href="/waitlist"
              className="btn-primary px-6 py-2.5 text-sm font-medium"
            >
              Apply for access
            </Link>
            <Link
              href="/login"
              className="btn-secondary px-5 py-2.5 text-sm"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Product preview — real UI mockup, not abstract illustration */}
        <div className="hero-animate hero-delay-4 mt-16 lg:mt-20">
          <div className="card p-1 max-w-4xl">
            <div className="bg-surface-light rounded-[5px] p-4 sm:p-6">
              {/* Mock room header */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span className="text-sm font-medium text-text-primary">#ai-founders</span>
                <span className="text-xs text-text-muted ml-auto">22 members</span>
              </div>
              {/* Mock messages */}
              <div className="space-y-4">
                {[
                  { initials: 'RP', name: 'Raj P.', tier: 'catalyst', msg: 'Anyone else pivoting from B2C to B2B this quarter? The unit economics finally make sense for us.', time: '2m' },
                  { initials: 'SZ', name: 'Sophie Z.', tier: 'catalyst', msg: 'We did that exact transition. Happy to share our playbook — the key was focusing on 3 design partners, not 30 leads.', time: '1m' },
                  { initials: 'MJ', name: 'Marcus T.', tier: 'builder', msg: 'Would love to sit in on that convo. Our Series A hinged on the B2B pivot.', time: '30s' },
                ].map((m, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-7 h-7 rounded-md bg-surface-lighter flex items-center justify-center text-[10px] font-medium text-text-muted shrink-0 mt-0.5">
                      {m.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-text-primary">{m.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          m.tier === 'catalyst' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {m.tier === 'catalyst' ? 'Catalyst' : 'Builder'}
                        </span>
                        <span className="text-[10px] text-text-muted">{m.time}</span>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed mt-0.5">{m.msg}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Mock input */}
              <div className="mt-5 pt-4 border-t border-border">
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-surface border border-border text-text-muted text-xs">
                  Type a message...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProofSection() {
  const stats = [
    { value: '387', label: 'Founders accepted' },
    { value: '2,400+', label: 'Applications received' },
    { value: '27%', label: 'Acceptance rate' },
    { value: '12', label: 'Countries represented' },
  ];

  return (
    <section className="py-16 border-y border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={stat.label} className={`animate-on-scroll counter stagger-${i + 1} text-center`}>
              <p className="text-2xl sm:text-3xl font-semibold text-text-primary tracking-tight">{stat.value}</p>
              <p className="text-sm text-text-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const modes = [
    {
      number: '01',
      title: 'Rooms',
      description: 'Topic-based conversations with founders who are building, not just browsing. From AI infrastructure to bootstrapping to $1M ARR.',
      detail: '10 active rooms, 30-member cap, contribution required to join.',
    },
    {
      number: '02',
      title: 'Daily Feed',
      description: 'Five curated founder profiles every morning. Matched on stage, intent, and complementary skills. Not a random scroll — a daily ritual.',
      detail: '3 algorithmic matches, 1 serendipitous, 1 featured member.',
    },
    {
      number: '03',
      title: 'Requests',
      description: 'Post what you need — a warm intro, technical review, co-founder, first check — and let the right person find you.',
      detail: 'Structured asks. Targeted responses. No cold outreach.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="animate-on-scroll mb-14">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary mb-3">
            Three ways to connect
          </h2>
          <p className="text-text-secondary max-w-lg">
            Each mode is designed for a different kind of interaction. Less searching, more building.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {modes.map((mode, i) => (
            <div
              key={mode.title}
              className={`animate-on-scroll scale-in stagger-${i + 1} card p-6 group hover:border-border-light transition-colors duration-200`}
            >
              <span className="text-xs font-mono text-text-muted">{mode.number}</span>
              <h3 className="text-lg font-semibold text-text-primary mt-3 mb-2">
                {mode.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                {mode.description}
              </p>
              <p className="text-xs text-text-muted leading-relaxed">
                {mode.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TierSection() {
  const tiers = [
    {
      name: 'Explorer',
      color: 'text-text-muted',
      borderColor: 'border-zinc-700/50',
      bgAccent: 'bg-zinc-500/5',
      rep: '0+',
      features: [
        'Access public rooms',
        'Browse the member directory',
        'Daily curated matches',
        'Post and respond to requests',
      ],
    },
    {
      name: 'Builder',
      color: 'text-blue-400',
      borderColor: 'border-blue-500/20',
      bgAccent: 'bg-blue-500/5',
      rep: '100+',
      features: [
        'Everything in Explorer',
        'Private rooms access',
        'Direct messaging (15/day)',
        'Create and host rooms',
      ],
    },
    {
      name: 'Catalyst',
      color: 'text-amber-400',
      borderColor: 'border-amber-500/20',
      bgAccent: 'bg-amber-500/5',
      rep: '500+',
      features: [
        'Everything in Builder',
        'Unlimited messaging',
        'Elevate other members',
        'Catalyst-only lounge',
      ],
    },
  ];

  return (
    <section id="tiers" className="py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="animate-on-scroll mb-14">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary mb-3">
            Earn your tier
          </h2>
          <p className="text-text-secondary max-w-lg">
            Your tier reflects your contribution, not your wallet. Rise through the ranks by adding value to the community.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <div
              key={tier.name}
              className={`animate-on-scroll scale-in stagger-${i + 1} rounded-lg border ${tier.borderColor} ${tier.bgAccent} p-6 hover:border-opacity-50 transition-colors duration-200`}
            >
              <div className="flex items-baseline justify-between mb-4">
                <h3 className={`text-lg font-semibold ${tier.color}`}>
                  {tier.name}
                </h3>
                <span className="text-xs text-text-muted font-mono">{tier.rep} rep</span>
              </div>
              <ul className="space-y-2.5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
                    <svg className="w-4 h-4 text-text-muted shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  const reasons = [
    {
      title: 'Vetted, not viral',
      description: 'Every member is reviewed. We accept fewer than 30% of applicants. The people in the room have been building, not just talking.',
    },
    {
      title: 'Signal over noise',
      description: 'No content farms. No engagement bait. No "thoughts?" posts from people you\'ve never met. Just substantive conversations between operators.',
    },
    {
      title: 'Free to join, earned to unlock',
      description: 'We don\'t charge for access — credentials and contribution are the barrier. Premium features unlock through reputation, not subscription.',
    },
    {
      title: 'Built for async builders',
      description: 'Five matches a day, not fifty. Rooms with 30-member caps, not 30,000. Designed for people who have companies to run.',
    },
  ];

  return (
    <section id="why" className="py-20 lg:py-28 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="animate-on-scroll mb-14">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary mb-3">
            Why Alyned exists
          </h2>
          <p className="text-text-secondary max-w-lg">
            LinkedIn is a content farm. Twitter is a performance. Hampton costs $8.5K.
            We built the network we wanted to join.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
          {reasons.map((reason, i) => (
            <div key={reason.title} className={`animate-on-scroll slide-left stagger-${i + 1}`}>
              <h3 className="text-base font-semibold text-text-primary mb-2">{reason.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MemberTypesSection() {
  const types = [
    { role: 'YC founders', detail: 'Building AI, fintech, and dev tools' },
    { role: 'Angel investors', detail: 'Writing $25K–$2M first checks' },
    { role: 'Series A operators', detail: 'Scaling from 10 to 100' },
    { role: 'Technical co-founders', detail: 'Looking for their other half' },
    { role: 'Bootstrapped founders', detail: '$500K–$5M ARR, profitable' },
    { role: 'Ex-FAANG builders', detail: 'Shipping nights and weekends' },
  ];

  return (
    <section className="py-20 lg:py-28 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="animate-on-scroll max-w-2xl mx-auto text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary mb-3">
            The founders you need to know are already here
          </h2>
          <p className="text-text-secondary">
            Alyned members are building real companies, investing real capital, and shipping real products.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {types.map((type, i) => (
            <div key={type.role} className={`animate-on-scroll scale-in stagger-${i + 1} card p-4 hover:border-border-light transition-colors duration-200`}>
              <p className="text-sm font-medium text-text-primary">{type.role}</p>
              <p className="text-xs text-text-muted mt-0.5">{type.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-20 lg:py-28 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="animate-on-scroll max-w-xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary mb-4">
            Ready to stop scrolling and start building?
          </h2>
          <p className="text-text-secondary mb-8">
            Applications take 2 minutes. We review weekly. If you&apos;re building something real, you&apos;ll hear from us.
          </p>
          <Link
            href="/waitlist"
            className="btn-primary px-8 py-3 text-sm font-medium"
          >
            Apply for access
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-text-muted">&copy; 2026 Alyned. All rights reserved.</span>
        <div className="flex items-center gap-6 text-xs text-text-muted">
          <Link href="/about" className="hover:text-text-secondary transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-text-secondary transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-text-secondary transition-colors">Terms</Link>
          <a href="mailto:hello@alyned.app" className="hover:text-text-secondary transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  useScrollAnimation();

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <SocialProofSection />
        <HowItWorksSection />
        <TierSection />
        <WhySection />
        <MemberTypesSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
