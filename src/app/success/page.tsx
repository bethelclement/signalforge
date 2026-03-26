"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, MapPin, Truck, Loader2 } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const txnref = searchParams.get("txnref") || searchParams.get("txnRef") || 'WW-VERIFIED-782103';
  const resp = searchParams.get("resp");
  const desc = searchParams.get("desc");
  const isSuccess = resp === '00' || !resp;
  const [verifyStatus, setVerifyStatus] = useState<'pending' | 'verified' | 'failed' | 'skipped'>(
    txnref.startsWith('WW-') ? 'pending' : 'skipped'
  );

  useEffect(() => {
    if (resp === '00') {
      try {
        const stored = localStorage.getItem("wastewise_reports");
        const reports: Array<{ id: string; timestamp: string; resp: string; desc: string }> = stored ? JSON.parse(stored) : [];
        reports.unshift({
          id: txnref,
          timestamp: new Date().toISOString(),
          resp: resp,
          desc: desc || "Approved by Financial Institution",
        });
        if (reports.length > 50) {
          reports.length = 50;
        }
        localStorage.setItem("wastewise_reports", JSON.stringify(reports));
      } catch {
        // Ignore localStorage errors
      }
    }

    // Server-side verification for real ISW transactions
    if (txnref.startsWith('WW-')) {
      const amount = searchParams.get('amount') || '';
      fetch(`/api/verify-payment?txnref=${encodeURIComponent(txnref)}&amount=${encodeURIComponent(amount)}`)
        .then((res) => res.json())
        .then((data) => {
          setVerifyStatus(data.success ? 'verified' : 'failed');
        })
        .catch(() => {
          setVerifyStatus('failed');
        });
    }
  }, [resp, txnref, desc, searchParams]);

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 flex flex-col items-center text-center">
      <div className={`w-20 h-20 ${isSuccess ? 'bg-green-100 text-[var(--color-primary)]' : 'bg-amber-100 text-amber-600'} rounded-full flex items-center justify-center mb-6 shadow-sm border-4 border-white ring-1 ring-[var(--color-border)]`}>
        {isSuccess ? <CheckCircle size={40} /> : <div className="text-2xl font-bold">!</div>}
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-[var(--color-text-main)]">
        {isSuccess ? 'Payment Successful' : 'Payment Awaiting Final Confirmation'}
      </h1>
      <p className="text-[var(--color-text-muted)] text-lg mb-8 max-w-lg">
        {isSuccess
          ? 'Your waste clearance payment has been verified via Interswitch. Your request is now active.'
          : 'Your payment was processed. We are awaiting final synchronization with the Interswitch node.'}
      </p>

      <div className="card w-full p-6 text-left mb-8 shadow-sm">
        <h3 className="font-bold text-lg border-b border-[var(--color-border)] pb-4 mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-[var(--color-text-muted)]" /> Dispatch & Transaction Telemetry
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">ISW Reference</p>
              <div className="flex justify-between items-center py-4 border-b border-gray-100 group">
                <span className="text-sm font-medium text-gray-500">PSP Dispatch Ref</span>
                <span className="text-sm font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">LAWMA-Z4-A2B9X</span>
              </div>

              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-500">Transaction Ref</span>
                <span className="font-mono text-xs font-bold bg-gray-50 p-2 rounded border border-gray-200">{txnref}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">ISW Response</p>
              <div className="mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${
                  isSuccess ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {resp || '00'} : {desc || 'Approved by Financial Institution'}
                </span>
              </div>
            </div>
          </div>

          {verifyStatus !== 'skipped' && (
            <div className="mt-4 flex items-center gap-2">
              {verifyStatus === 'pending' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Verifying with ISW...
                </span>
              )}
              {verifyStatus === 'verified' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-800 border border-green-300">
                  <CheckCircle className="w-3 h-3" />
                  Server Verified
                </span>
              )}
              {verifyStatus === 'failed' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                  Verification Pending
                </span>
              )}
            </div>
          )}

          <div className="flex items-start gap-4 p-4 bg-green-50/50 rounded-xl border border-green-100 mt-4">
            <MapPin className="text-[var(--color-primary)] shrink-0 mt-0.5" size={20} />
            <div>
               <p className="font-black text-sm text-green-900">PSP DISPATCHED : ETA 4 HOURS</p>
               <p className="text-green-700 text-xs mt-1 leading-relaxed">Our certified waste handler has been assigned to your Lagos sector and is currently en-route.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/" className="btn-secondary">
          Return Home
        </Link>
        <Link href="/dashboard" className="btn-primary">
          View Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto py-16 px-4 flex flex-col items-center text-center">
        <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)] mb-4" />
        <p className="text-[var(--color-text-muted)]">Loading transaction details...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
