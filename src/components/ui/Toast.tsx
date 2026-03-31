"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

export default function Toast() {
  const { toastMessage, clearToast } = useAppStore();

  useEffect(() => {
    if (toastMessage) {
      const timeout = setTimeout(() => clearToast(), 5000);
      return () => clearTimeout(timeout);
    }
  }, [toastMessage, clearToast]);

  if (!toastMessage) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] animate-fade-in">
      <div className="card px-4 py-3 shadow-lg border-primary/20 flex items-center gap-3 max-w-sm">
        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
          </svg>
        </div>
        <p className="text-sm text-text-primary flex-1">{toastMessage}</p>
        <button
          onClick={clearToast}
          className="text-text-muted hover:text-text-primary transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
