import Link from "next/link";
import { CheckCircle, MapPin, Truck } from "lucide-react";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { txnref?: string; resp?: string; desc?: string };
}) {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 flex flex-col items-center text-center">
      <div className="w-20 h-20 bg-green-100 text-[var(--color-primary)] rounded-full flex items-center justify-center mb-6 shadow-sm border-4 border-white ring-1 ring-[var(--color-border)]">
        <CheckCircle size={40} />
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-[var(--color-text-main)]">Payment Successful</h1>
      <p className="text-[var(--color-text-muted)] text-lg mb-8 max-w-lg">
        Your waste clearance payment has been verified via Interswitch. Your request is now active.
      </p>

      <div className="card w-full p-6 text-left mb-8 shadow-sm">
        <h3 className="font-semibold text-lg border-b border-[var(--color-border)] pb-4 mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-[var(--color-text-muted)]" /> Collection Details
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-[var(--color-text-muted)]">Transaction Reference</p>
              <p className="font-mono text-sm mt-1">{searchParams.txnref || 'WW-VERIFIED-782103'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-[var(--color-text-muted)]">Status</p>
              <p className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">Paid</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-[var(--color-border)] mt-4">
            <MapPin className="text-[var(--color-primary)] shrink-0 mt-0.5" size={20} />
            <div>
               <p className="font-semibold text-sm">ETA: Within 4 Hours</p>
               <p className="text-[var(--color-text-muted)] text-sm mt-1">Our certified waste handler has been dispatched and will arrive shortly.</p>
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
