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

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
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

  const initInterswitchPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    try {
      const res = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: (analysisResult?.estimatedCost || 2500) * 100 })
      });
      
      const config = await res.json();
      setPaymentConfig(config);
      
      // We need to wait for state to update, then submit the hidden form
      setTimeout(() => {
        const form = document.getElementById('interswitch-checkout-form') as HTMLFormElement;
        if (form) form.submit();
      }, 500);

    } catch (error) {
      console.error('Payment initialization failed', error);
      setIsProcessingPayment(false);
    }
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
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${step >= 1 ? 'border-[var(--color-primary)] bg-green-50' : 'border-gray-300'}`}>1</div>
          <span>Upload</span>
        </div>
        <div className="h-px bg-gray-300 flex-1 mx-2"></div>
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[var(--color-primary)]' : ''}`}>
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${step >= 2 ? 'border-[var(--color-primary)] bg-green-50' : 'border-gray-300'}`}>2</div>
          <span>Analysis</span>
        </div>
        <div className="h-px bg-gray-300 flex-1 mx-2"></div>
        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[var(--color-primary)]' : ''}`}>
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${step >= 3 ? 'border-[var(--color-primary)] bg-green-50' : 'border-gray-300'}`}>3</div>
          <span>Payment</span>
        </div>
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="card border-dashed border-2 p-12 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative min-h-[300px]">
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
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
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

            <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-6 mt-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 text-[var(--color-primary)] p-3 rounded-lg">
                  <Calculator size={24} />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-muted)] font-medium">Clearance Cost</p>
                  <p className="text-2xl font-bold tracking-tight">₦{analysisResult.estimatedCost.toLocaleString()}</p>
                </div>
              </div>
              
              <button onClick={handleProceedToPayment} className="btn-primary flex items-center gap-2 px-6 py-3">
                Proceed to Pay <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Payment (Interswitch) */}
      {step === 3 && analysisResult && (
        <div className="animate-in fade-in duration-500 space-y-6">
          <div className="card p-8 bg-white border-t-4 border-t-[#D22B2B] shadow-md relative overflow-hidden">
            
            <div className="flex items-center gap-4 mb-8">
               <div className="w-14 h-14 bg-red-50 text-[#D22B2B] rounded-lg flex items-center justify-center font-bold text-xl tracking-tighter shadow-sm border border-red-100">
                 ISW
               </div>
               <div>
                  <h3 className="text-xl font-bold text-[#D22B2B]">Interswitch Webpay</h3>
                  <p className="text-[var(--color-text-muted)] text-sm">Secure digital checkout portal</p>
               </div>
            </div>
            
            <div className="space-y-4 mb-8 bg-gray-50 p-6 rounded-lg border border-[var(--color-border)]">
              <div className="flex justify-between items-center pb-4 border-b border-[var(--color-border)]">
                <span className="text-[var(--color-text-muted)] font-medium">Service Reference</span>
                <span className="font-mono text-sm font-semibold bg-white px-2 py-1 rounded border border-[var(--color-border)]">WW-2026-00109A</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[var(--color-text-muted)] font-medium">Total Amount Due</span>
                <span className="font-bold text-2xl tracking-tight">₦{analysisResult.estimatedCost.toLocaleString()}</span>
              </div>
            </div>

            <form onSubmit={initInterswitchPayment} className="space-y-6">
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-2">Email Address</label>
                    <input type="email" name="email" required className="input-field max-w-sm bg-white" placeholder="your@email.com" defaultValue="user@signalforge.io"/>
                    <p className="text-xs text-[var(--color-text-muted)] mt-2">Payment receipt will be sent to this email.</p>
                 </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[var(--color-border)] flex items-center justify-between">
                <button type="button" onClick={() => setStep(2)} className="text-sm font-medium text-[var(--color-text-muted)] border border-transparent hover:border-gray-300 px-4 py-2 rounded transition-all" disabled={isProcessingPayment}>
                  Cancel
                </button>
                <button type="submit" disabled={isProcessingPayment} className="w-full max-w-xs bg-[#D22B2B] hover:bg-red-800 disabled:bg-red-400 text-white font-semibold py-3 px-6 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2">
                  {isProcessingPayment ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Identifying node...</>
                  ) : (
                    'Pay via Interswitch'
                  )}
                </button>
              </div>
            </form>

            {/* Hidden Interswitch Checkout Form */}
            {paymentConfig && (
              <form id="interswitch-checkout-form" action={paymentConfig.action_url} method="POST" style={{ display: 'none' }}>
                <input type="hidden" name="product_id" value={paymentConfig.product_id} />
                <input type="hidden" name="pay_item_id" value={paymentConfig.pay_item_id} />
                <input type="hidden" name="amount" value={paymentConfig.amount} />
                <input type="hidden" name="currency" value={paymentConfig.currency} />
                <input type="hidden" name="site_redirect_url" value={paymentConfig.site_redirect_url} />
                <input type="hidden" name="txn_ref" value={paymentConfig.txn_ref} />
                <input type="hidden" name="hash" value={paymentConfig.hash} />
              </form>
            )}
            
          </div>
          
          <p className="text-center text-xs text-[var(--color-text-muted)] mt-6 flex items-center justify-center gap-1.5 opacity-80">
            <ShieldCheck size={14} className="text-green-600" />
            End-to-end encryption. Processing powered by Interswitch infrastructure.
          </p>
        </div>
      )}
    </div>
  );
}
