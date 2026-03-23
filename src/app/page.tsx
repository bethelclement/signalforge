import Link from "next/link";
import { ArrowRight, BarChart3, Camera, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="pt-12 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <span className="inline-flex items-center px-3 py-1 bg-green-50 text-[var(--color-primary-dark)] rounded-full text-xs font-semibold tracking-wide border border-green-100 uppercase mb-2 shadow-sm">
            Enyata x Interswitch Build-a-thon
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--color-text-main)] leading-tight">
            Smarter waste reporting 
            <br className="hidden md:block"/> 
            <span className="text-[var(--color-primary)]">powered by AI.</span>
          </h1>
          <p className="text-[var(--color-text-muted)] text-lg max-w-2xl leading-relaxed">
            WasteWise AI is the enterprise-grade solution for municipal and private waste management. Report issues, get AI verification, and cleanly process collection payments in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/report" className="btn-primary flex items-center justify-center gap-2 py-3 px-8 text-base shadow-sm">
              Start Reporting <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#how-it-works" className="btn-secondary flex items-center justify-center py-3 px-8 text-base shadow-sm">
              Learn more
            </a>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="flex-1 w-full bg-white border border-[var(--color-border)] rounded-2xl p-8 shadow-sm relative overflow-hidden flex items-center justify-center min-h-[400px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="relative z-10 w-full max-w-sm flex flex-col gap-4">
            <div className="card p-4 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                 <Camera size={20} />
               </div>
               <div>
                  <h4 className="font-semibold text-sm">AI Scan complete</h4>
                  <p className="text-xs text-[var(--color-text-muted)]">Category: Recyclable Plastics</p>
               </div>
            </div>
            
            <div className="card p-4 flex items-center gap-4 ml-6 shadow-md border-[var(--color-primary)] relative">
               <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--color-primary)] rounded-r-md"></div>
               <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[var(--color-primary)]">
                 <ShieldCheck size={20} />
               </div>
               <div>
                  <h4 className="font-semibold text-sm">Payment Verified</h4>
                  <p className="text-xs text-[var(--color-text-muted)]">Interswitch Webpay Processed</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section id="features" className="pt-12 border-t border-[var(--color-border)]">
         <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Fintech-grade reliability</h2>
            <p className="text-[var(--color-text-muted)] max-w-xl mx-auto">Our infrastructure is built to scale, ensuring your reports are accurately classified and payments are securely processed.</p>
         </div>

         <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-6 flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform cursor-default">
               <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Zap size={24} />
               </div>
               <h3 className="font-semibold text-lg text-[var(--color-text-main)]">Instant Reporting</h3>
               <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  Snap a photo and our AI instantly identifies the type of waste, estimating volume and assigning right handlers.
               </p>
            </div>

            <div className="card p-6 flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform cursor-default border-[var(--color-primary)]">
               <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-[var(--color-primary)]">
                  <ShieldCheck size={24} />
               </div>
               <h3 className="font-semibold text-lg text-[var(--color-text-main)]">Secure Payments</h3>
               <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  Powered by Interswitch. Request specialized pickups and pay seamlessly directly from the dashboard.
               </p>
            </div>

            <div className="card p-6 flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform cursor-default">
               <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <BarChart3 size={24} />
               </div>
               <h3 className="font-semibold text-lg text-[var(--color-text-main)]">Data Intelligence</h3>
               <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  Agencies access a command center with real-time mapping of waste hotspots and collection efficiency.
               </p>
            </div>
         </div>
      </section>
    </div>
  );
}
