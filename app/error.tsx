'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an enterprise service like Sentry
    console.error('Enterprise Error Trap:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-12">
        <span className="text-[var(--maroon-royal)] uppercase tracking-[0.4em] font-bold text-[10px]">
          System Interruption
        </span>
        <h1 className="text-4xl font-serif font-bold text-[var(--text-heading)]">
          The Ritual was Interrupted
        </h1>
        <p className="text-[var(--text-body)]/60 font-serif italic text-lg leading-relaxed">
          The essence flow encountered a temporary disturbance. Rest assured, our archive masters are resolving the misalignment.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
          <button
            onClick={() => reset()}
            className="btn-primary"
          >
            Attempt Restoration
          </button>
          <Link href="/" className="px-8 py-4 rounded-full border border-[var(--border-color)] text-[var(--text-body)] uppercase tracking-widest text-[10px] font-bold hover:bg-[var(--text-body)] hover:text-[var(--bg-primary)] transition-all">
            Return Home
          </Link>
        </div>

        {error.digest && (
          <p className="pt-12 text-[8px] uppercase tracking-widest text-[var(--text-body)]/20 font-mono">
            Error Signature: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
