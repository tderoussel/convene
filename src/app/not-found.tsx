import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <Logo variant="icon" size="lg" className="mx-auto mb-6" />
        <p className="text-6xl font-semibold text-text-primary mb-2">404</p>
        <h1 className="text-lg font-medium text-text-secondary mb-4">
          Page not found
        </h1>
        <p className="text-sm text-text-muted mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="btn-primary text-sm px-5 py-2">
            Go home
          </Link>
          <Link href="/dashboard" className="btn-secondary text-sm px-5 py-2">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
