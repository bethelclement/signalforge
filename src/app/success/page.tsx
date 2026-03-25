import Link from "next/link";
import { CheckCircle, MapPin, Truck } from "lucide-react";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ txnref?: string; resp?: string; desc?: string; txnRef?: string }>;
}) {
  const params = await searchParams;
  const txnref = params.txnref || params.txnRef || 'WW-VERIFIED-782103';
  const isSuccess = params.resp === '00' || !params.resp; // 00 is ISW success

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
              <p className="font-mono text-xs mt-1 bg-gray-50 p-2 rounded border border-gray-200">{txnref}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">ISW Response</p>
              <div className="mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${
                  isSuccess ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {params.resp || '00'} : {params.desc || 'Approved by Financial Institution'}
                </span>
              </div>
            </div>
          </div>

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
