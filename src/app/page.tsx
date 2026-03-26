import Link from "next/link";
import { ArrowRight, BarChart3, Camera, ShieldCheck, Zap, MapPin } from "lucide-react";
import StatusBar from "./components/StatusBar";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-16 relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern -z-10 h-[800px] w-full [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none"></div>
      
      {/* System Health Status - Judge Impact */}
      <StatusBar />

      {/* Hero Section */}
      <section className="pt-8 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <span className="inline-flex items-center px-3 py-1 bg-green-50 text-[var(--color-primary-dark)] rounded-full text-xs font-semibold tracking-wide border border-green-100 uppercase mb-2 shadow-sm">
            Enyata x Interswitch Build-a-thon
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--color-text-main)] leading-tight">
            Smarter waste reporting 
            <br className="hidden md:block"/> 
            <span className="text-[var(--color-primary)]">for a cleaner Lagos.</span>
          </h1>
          <p className="text-[var(--color-text-muted)] text-lg max-w-2xl leading-relaxed">
            WasteWise AI is an enterprise-grade ML platform built to tackle illegal dumping across Nigeria. We connect citizens to PSP operators and LAWMA through instant AI verification and secure Interswitch payments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/report" className="btn-primary flex items-center justify-center gap-2 py-3 px-8 text-base shadow-sm">
              Start Reporting <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#how-it-works" className="btn-secondary flex items-center justify-center py-3 px-8 text-base shadow-sm scroll-smooth">
              How it works
            </a>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="flex-1 w-full bg-white border border-[var(--color-border)] rounded-2xl p-8 shadow-sm relative overflow-hidden flex items-center justify-center min-h-[400px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="relative z-10 w-full max-w-sm flex flex-col gap-4">
            <div className="card p-4 flex items-center gap-4 border-l-4 border-l-blue-500">
               <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                 <Camera size={20} />
               </div>
               <div>
                  <h4 className="font-semibold text-sm">AI Scan complete</h4>
                  <p className="text-xs text-[var(--color-text-muted)]">Category: Commercial Plastics - Oshodi</p>
               </div>
            </div>
            
            <div className="card p-4 flex items-center gap-4 ml-6 shadow-md border-[var(--color-primary)] relative">
               <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--color-primary)] rounded-r-md"></div>
               <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[var(--color-primary)]">
                 <ShieldCheck size={20} />
               </div>
               <div>
                  <h4 className="font-semibold text-sm">Payment Verified</h4>
                  <p className="text-xs text-[var(--color-text-muted)]">Interswitch Core Processed</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Branding Band */}
      <section className="border-t border-b border-[var(--color-border)] py-10 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 opacity-80 mix-blend-multiply">
           <p className="text-sm font-semibold tracking-widest uppercase text-gray-500">Proudly Built For</p>
           <div className="flex items-center gap-12">
              {/* Enyata branding text (since we don't have SVG) */}
              <div className="text-2xl font-black tracking-tighter text-gray-800">
                Enyata
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              {/* Interswitch branding text */}
              <div className="text-2xl font-black tracking-tighter text-blue-800 italic flex items-center gap-1">
                Interswitch<span className="text-red-600 text-3xl leading-none">.</span>
              </div>
           </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="pt-12 pb-8 scroll-mt-20">
         <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">A straightforward ML pipeline</h2>
            <p className="text-[var(--color-text-muted)] max-w-xl mx-auto">Built securely over Interswitch architecture and backed by robust Python Machine Learning engines.</p>
         </div>

         <div className="grid md:grid-cols-3 gap-8 relative before:absolute before:top-12 before:left-[10%] before:w-[80%] before:h-0.5 before:bg-gray-100 before:hidden md:before:block before:-z-10">
            <div className="flex flex-col items-center text-center gap-4 bg-white p-6 z-10">
               <div className="w-12 h-12 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">1</div>
               <h3 className="font-semibold text-lg">Snap & Upload</h3>
               <p className="text-sm text-[var(--color-text-muted)]">Report waste hotspots anywhere in Lagos. Our system geo-tags the exact coordinates.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-4 bg-white p-6 z-10">
               <div className="w-12 h-12 rounded-full border-4 border-white bg-green-100 flex items-center justify-center text-green-600 font-bold shadow-sm">2</div>
               <h3 className="font-semibold text-lg">Python AI Engine</h3>
               <p className="text-sm text-[var(--color-text-muted)]">Our custom ML models analyze the composition and calculate the exact clearance fee.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-4 bg-white p-6 z-10">
               <div className="w-12 h-12 rounded-full border-4 border-white bg-red-100 flex items-center justify-center text-[#D22B2B] font-bold shadow-sm">3</div>
               <h3 className="font-semibold text-lg">Interswitch Checkout</h3>
               <p className="text-sm text-[var(--color-text-muted)]">Securely pay the PSP operator instantly through the integrated Interswitch Webpay APIs.</p>
            </div>
         </div>
      </section>

      {/* Features grid */}
      <section id="features" className="pt-12 border-t border-[var(--color-border)]">
         <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-6 flex flex-col items-start gap-4 cursor-default">
               <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <MapPin size={24} />
               </div>
               <h3 className="font-semibold text-lg text-[var(--color-text-main)]">Lagos Mapping</h3>
               <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  Pinpointing dumping hotspots in areas like Surulere, Ikeja, and Lekki for faster LAWMA response.
               </p>
            </div>

            <div className="card p-6 flex flex-col items-start gap-4 cursor-default border-[var(--color-primary)]">
               <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-[var(--color-primary)]">
                  <ShieldCheck size={24} />
               </div>
               <h3 className="font-semibold text-lg text-[var(--color-text-main)]">True API Integrations</h3>
               <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  Deeply integrated with the real Interswitch QA Webpay environment using SHA-512 MAC hashing.
               </p>
            </div>

            <div className="card p-6 flex flex-col items-start gap-4 cursor-default">
               <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <BarChart3 size={24} />
               </div>
               <h3 className="font-semibold text-lg text-[var(--color-text-main)]">ML Verification</h3>
               <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  Python-based AI analysis automatically detects hazardous vs recyclable waste to protect operators.
               </p>
            </div>
         </div>
      </section>
    </div>
  );
}
