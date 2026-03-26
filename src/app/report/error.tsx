"use client";

import Link from "next/link";

export default function ReportError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="card p-8 max-w-md w-full text-center space-y-6">
        <div
          className="mx-auto w-14 h-14 rounded-full flex items-center justify-center text-2xl"
          style={{ backgroundColor: "var(--color-primary-light)" }}
        >
          !
        </div>

        <h2 className="text-xl font-semibold text-[var(--color-text-main)]">
          Report generation failed
        </h2>

        <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
          We were unable to load or generate the report. This may be due to a
          network issue or an invalid request. Please try again.
        </p>

        {error.digest && (
          <p className="text-xs text-[var(--color-text-muted)] font-mono">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button onClick={reset} className="btn-primary">
            Try Again
          </button>
          <Link href="/" className="btn-secondary">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
