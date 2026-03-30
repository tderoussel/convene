"use client";

import ApplicationReview from "@/components/admin/ApplicationReview";

export default function ApplicationsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-semibold text-text-primary mb-6">Application Review</h1>
      <ApplicationReview />
    </div>
  );
}
