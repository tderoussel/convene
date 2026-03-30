import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/"><Logo size="sm" /></Link>
          <Link href="/" className="text-xs text-text-muted hover:text-text-secondary transition-colors">Back</Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-14">
        <h1 className="text-2xl font-semibold tracking-tight mb-6">About Convene</h1>

        <div className="space-y-5 text-sm text-text-secondary leading-relaxed">
          <p className="text-base text-text-primary">
            Convene was built on a simple observation: the best opportunities come from the right people, not cold outreach or crowded networks.
          </p>
          <p>
            We created Convene as a vetted community for founders, investors, and operators who are serious about building. Every member is reviewed before they join. There are no ads, no premium tiers for sale, and no algorithm deciding what you see.
          </p>
          <p>
            Your tier in Convene is based on what you contribute — not what you pay. We believe that real meritocracy creates the strongest networks.
          </p>
          <p>
            Convene offers three core modes of connection: Rooms for topic-driven group conversations, a Daily Feed of curated matches, and Requests for specific asks that the community can rally around. Each is designed to be intentional, low-noise, and high-value.
          </p>
          <p>
            We are a small team passionate about building tools that help ambitious people find each other. If you share that vision, we would love to have you.
          </p>
        </div>

        <div className="mt-10">
          <Link href="/waitlist" className="btn-primary text-sm px-6 py-2.5">
            Apply for access
          </Link>
        </div>
      </div>
    </div>
  );
}
