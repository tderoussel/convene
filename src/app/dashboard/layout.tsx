"use client";

import { useAppStore } from "@/lib/store";
import Sidebar from "@/components/dashboard/Sidebar";
import Logo from "@/components/ui/Logo";
import Toast from "@/components/ui/Toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useAppStore();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Logo variant="icon" size="lg" className="mx-auto" />
          <h1 className="text-lg font-semibold text-text-primary">
            Please log in
          </h1>
          <p className="text-text-muted text-sm">
            You need to be logged in to access the dashboard.
          </p>
          <a
            href="/login"
            className="btn-primary inline-block mt-4"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:ml-56 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>
      <Toast />
    </div>
  );
}
