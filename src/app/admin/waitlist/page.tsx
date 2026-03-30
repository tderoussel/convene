"use client";

import WaitlistTable from "@/components/admin/WaitlistTable";

export default function WaitlistPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-semibold text-text-primary mb-6">Waitlist Management</h1>
      <div className="card p-5">
        <WaitlistTable />
      </div>
    </div>
  );
}
