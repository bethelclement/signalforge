"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface StoredReport {
  id: string;
  timestamp: string;
  resp: string;
  desc: string;
}

function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryPage() {
  const [reports, setReports] = useState<StoredReport[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("wastewise_reports");
      if (raw) {
        const parsed: StoredReport[] = JSON.parse(raw);
        setReports(parsed);
      }
    } catch {
      // Ignore malformed data
    }
    setLoaded(true);
  }, []);

  function clearHistory() {
    localStorage.removeItem("wastewise_reports");
    setReports([]);
  }

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--color-secondary)]">
            Report History
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            All previously submitted waste reports stored locally on this device.
          </p>
        </div>
        {reports.length > 0 && (
          <button
            onClick={clearHistory}
            className="btn-secondary text-xs py-2.5 px-6 uppercase tracking-widest text-red-600 border-red-200 hover:border-red-400 hover:bg-red-50 shrink-0"
          >
            Clear History
          </button>
        )}
      </div>

      {/* Content */}
      {reports.length === 0 ? (
        <div className="card p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-light)] flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--color-primary)]"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--color-secondary)] mb-2">
            No reports yet
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-8 max-w-md">
            You haven&apos;t submitted any waste reports from this device. Deploy
            your first report to start building your history.
          </p>
          <Link href="/report" className="btn-primary text-xs py-2.5 px-6 uppercase tracking-widest">
            Deploy Report
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-background-alt)]/50">
                  <th className="px-6 py-4 text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">
                    Report ID
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">
                    Timestamp
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">
                    Response Code
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <tr
                    key={report.id || index}
                    className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-background-alt)]/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-xs font-mono font-bold text-[var(--color-secondary)]">
                      {report.id}
                    </td>
                    <td className="px-6 py-4 text-xs text-[var(--color-text-muted)]">
                      {formatDate(report.timestamp)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]">
                        {report.resp}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[var(--color-text-muted)] max-w-xs truncate">
                      {report.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-background-alt)]/30">
            <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">
              {reports.length} report{reports.length !== 1 ? "s" : ""} on file
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
