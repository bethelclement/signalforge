"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, ChevronRight, Calculator, Loader2, ShieldCheck } from "lucide-react";

export default function ReportWastePage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    category: string;
    volume: string;
    estimatedCost: number;
    description: string;
  } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Simulate AI Analysis
      setIsAnalyzing(true);
      setTimeout(() => {
        setAnalysisResult({
          category: "Mixed Recyclables",
          volume: "Medium (approx 2 bags)",
          estimatedCost: 2500, // NGN
          description: "Contains mostly cardboard, plastic bottles, and some organic waste."
        });
        setIsAnalyzing(false);
        setStep(2);
      }, 2000);
    }
  };

  const handleProceedToPayment = () => {
    setStep(3);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Report & Request Pickup</h1>
        <p className="text-[var(--color-text-muted)]">Upload an image of the waste for instant AI analysis and pricing.</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-10 w-full text-sm font-medium text-[var(--color-text-muted)]">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[var(--color-primary)]' : ''}`}>
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 1 ? 'border-[var(--color-primary)] bg-green-50' : 'border-gray-300'}`}>1</div>
          <span>Upload</span>
        </div>
        <div className="h-px bg-gray-300 flex-1 mx-2"></div>
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[var(--color-primary)]' : ''}`}>
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 2 ? 'border-[var(--color-primary)] bg-green-50' : 'border-gray-300'}`}>2</div>
          <span>Analysis</span>
        </div>
        <div className="h-px bg-gray-300 flex-1 mx-2"></div>
        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[var(--color-primary)]' : ''}`}>
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 3 ? 'border-[var(--color-primary)] bg-green-50' : 'border-gray-300'}`}>3</div>
          <span>Payment</span>
        </div>
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="card border-dashed border-2 p-12 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileUpload} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          {isAnalyzing ? (
            <div className="flex flex-col items-center gap-4 text-[var(--color-primary)]">
              <Loader2 className="w-12 h-12 animate-spin" />
              <p className="font-semibold text-lg">AI Engine analyzing waste...</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <UploadCloud size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[var(--color-text-main)]">Upload Waste Photo</h3>
              <p className="text-[var(--color-text-muted)] max-w-sm">
                Tap to select a photo from your device. Our AI will automatically classify the waste type.
              </p>
            </>
          )}
        </div>
      )}

      {/* Step 2: Review Analysis */}
      {step === 2 && analysisResult && (
        <div className="animate-in slide-in-from-bottom-4 duration-500 ease-out space-y-6">
          <div className="card p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                  <CheckCircle2 className="text-[var(--color-primary)] w-6 h-6" /> Analysis Complete
                </h3>
                <p className="text-[var(--color-text-muted)] text-sm">Review the estimated parameters before requesting pickup.</p>
              </div>
              <button onClick={() => setStep(1)} className="text-sm font-medium text-[var(--color-primary)] hover:underline">
                Re-upload
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mb-6 border border-[var(--color-border)]">
              <div>
                <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Category</p>
                <p className="font-medium text-lg text-[var(--color-text-main)]">{analysisResult.category}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Estimated Volume</p>
                <p className="font-medium text-lg text-[var(--color-text-main)]">{analysisResult.volume}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">AI Notes</p>
                <p className="text-sm text-[var(--color-text-main)]">{analysisResult.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 text-[var(--color-primary)] p-3 rounded-lg">
                  <Calculator size={24} />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-muted)] font-medium">Clearance Cost</p>
                  <p className="text-2xl font-bold tracking-tight">₦{analysisResult.estimatedCost.toLocaleString()}</p>
                </div>
              </div>
              
              <button onClick={handleProceedToPayment} className="btn-primary flex items-center gap-2">
                Proceed to Pay <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Payment (Interswitch) */}
      {step === 3 && analysisResult && (
        <div className="animate-in fade-in duration-500 space-y-6">
          <div className="card p-8 bg-white border-t-4 border-t-red-600 shadow-lg">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-red-50 text-red-600 rounded flex items-center justify-center font-bold text-xl italic tracking-tighter">
                 Interswitch
               </div>
               <div>
                  <h3 className="text-xl font-bold">Secure Checkout</h3>
                  <p className="text-[var(--color-text-muted)] text-sm">Complete your payment via Interswitch Webpay</p>
               </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-[var(--color-text-muted)]">Service Reference</span>
                <span className="font-mono text-sm font-medium">WW-2026-00109A</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-[var(--color-text-muted)]">Total Amount</span>
                <span className="font-bold text-lg">₦{analysisResult.estimatedCost.toLocaleString()}</span>
              </div>
            </div>

            {/* This is simply an MVP mock to show Interswitch UI/integration direction */}
            <form action="/api/pay" method="GET" className="space-y-6">
              <input type="hidden" name="amount" value={analysisResult.estimatedCost * 100} />
              
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Email Address</label>
                    <input type="email" name="email" required className="input-field max-w-sm bg-gray-50 focus:bg-white" placeholder="your@email.com" defaultValue="user@signalforge.io"/>
                 </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button type="button" onClick={() => setStep(2)} className="text-sm font-medium text-[var(--color-text-muted)] hover:text-gray-900">
                  Cancel
                </button>
                <button type="submit" className="w-full max-w-xs bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded shadow-md transition-colors flex items-center justify-center gap-2">
                  Pay Now
                </button>
              </div>
            </form>
          </div>
          
          <p className="text-center text-xs text-[var(--color-text-muted)] mt-6 flex items-center justify-center gap-1">
            <ShieldCheck size={14} className="text-green-600" />
            Payments are secured by Interswitch infrastructure
          </p>
        </div>
      )}
    </div>
  );
}
