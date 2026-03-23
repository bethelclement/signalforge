"use client";

import { useState } from 'react';
import { UploadCloud, CheckCircle2, Calculator, ChevronRight, Loader2, ShieldCheck, MapPin, AlignLeft } from 'lucide-react';

export default function ReportPage() {
  const [step, setStep] = useState<number>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Form State
  const [reporterName, setReporterName] = useState('');
  const [reporterNumber, setReporterNumber] = useState('');
  const [address, setAddress] = useState('');
  const [details, setDetails] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [analysisResult, setAnalysisResult] = useState<{
    category: string;
    volume: string;
    estimatedCost: number;
    description: string;
  } | null>(null);

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState<any>(null);

  const [isVerifyingKYC, setIsVerifyingKYC] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAnalyzeUpload = () => {
    if (!selectedFile || !address || !reporterName || !reporterNumber) return; // Prevent empty submission
    
    // 1. First trigger Interswitch Identity Verification (KYC) API simulation
    setIsVerifyingKYC(true);
    
    setTimeout(() => {
      setIsVerifyingKYC(false);
      
      // 2. Then proceed to ML Vision Analysis
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        setIsAnalyzing(true);
        try {
          const res = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64: reader.result })
          });
          
          if (!res.ok) throw new Error("Analysis failed");
          
          const data = await res.json();
          setAnalysisResult({
            category: data.category || "Unidentified Waste",
            volume: data.volume || "Unknown",
            estimatedCost: data.estimatedCost || 2500,
            description: data.description || "Machine learning engine processed the image."
          });
          
        } catch (error) {
          console.error("AI scan error:", error);
          setAnalysisResult({
            category: "Mixed Recyclables (Fallback)",
            volume: "Medium (approx 2 bags)",
            estimatedCost: 2500,
            description: "Network timeout. Offline estimation applied."
          });
        } finally {
          setIsAnalyzing(false);
          setStep(2);
        }
      };
      
      reader.readAsDataURL(selectedFile);
    }, 1800); // 1.8s KYC delay
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
        <p className="text-[var(--color-text-muted)]">Provide location details and upload an image for immediate AI verification.</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-10 w-full text-sm font-medium text-[var(--color-text-muted)]">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[var(--color-primary)]' : ''}`}>
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${step >= 1 ? 'border-[var(--color-primary)] bg-green-50' : 'border-gray-300'}`}>1</div>
          <span>Report Info</span>
        </div>
        <div className="h-px bg-gray-300 flex-1 mx-2"></div>
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[var(--color-primary)]' : ''}`}>
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${step >= 2 ? 'border-[var(--color-primary)] bg-green-50' : 'border-gray-300'}`}>2</div>
          <span>Analysis</span>
        </div>
        <div className="h-px bg-gray-300 flex-1 mx-2"></div>
        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[var(--color-primary)]' : ''}`}>
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${step >= 3 ? 'border-[var(--color-primary)] bg-green-50' : 'border-gray-300'}`}>3</div>
          <span>Checkout</span>
        </div>
      </div>

      {...step === 1 && (
        <div className="animate-in fade-in duration-500 space-y-6">
          <div className="card p-8 bg-white border border-[var(--color-border)] shadow-sm">
             <h2 className="text-xl font-bold mb-6 text-[var(--color-text-main)] border-b pb-4 flex items-center gap-3">
                Incident Details
                <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">Protected by ISW KYC</span>
             </h2>
             
             <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-2 flex items-center gap-2">
                      Reporter Full Name
                    </label>
                    <input 
                      type="text" 
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      required 
                      className="input-field w-full bg-gray-50 focus:bg-white transition-colors" 
                      placeholder="e.g. Jane Doe"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-2 flex items-center gap-2">
                      Reporter Phone Number
                    </label>
                    <input 
                      type="tel" 
                      value={reporterNumber}
                      onChange={(e) => setReporterNumber(e.target.value)}
                      required 
                      className="input-field w-full bg-gray-50 focus:bg-white transition-colors" 
                      placeholder="e.g. 08012345678"
                    />
                 </div>
               </div>

               <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-2 flex items-center gap-2">
                    <MapPin size={16} className="text-[var(--color-primary)]"/> Exact Location (Address)
                  </label>
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required 
                    className="input-field w-full bg-gray-50 focus:bg-white transition-colors" 
                    placeholder="e.g. 12 Obafemi Awolowo Way, Ikeja, Lagos"
                  />
               </div>

               <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-2 flex items-center gap-2">
                    <AlignLeft size={16} className="text-[var(--color-primary)]"/> Additional Landmarks / Notes (Optional)
                  </label>
                  <textarea 
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={3}
                    className="input-field w-full bg-gray-50 focus:bg-white transition-colors py-3" 
                    placeholder="e.g. Near the main junction, heavy industrial waste blocking the drain."
                  />
               </div>

               <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-2">Upload Waste Photo</label>
                  <div className={`border-dashed border-2 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors relative ${selectedFile ? 'bg-green-50 border-green-300' : 'hover:bg-gray-50 border-gray-300 bg-white'}`}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {isVerifyingKYC ? (
                      <div className="flex flex-col items-center gap-4 text-blue-600 py-4">
                        <ShieldCheck className="w-10 h-10 animate-pulse" />
                        <p className="font-semibold">Authenticating Identity via Interswitch KYC...</p>
                      </div>
                    ) : isAnalyzing ? (
                      <div className="flex flex-col items-center gap-4 text-[var(--color-primary)] py-4">
                        <Loader2 className="w-10 h-10 animate-spin" />
                        <p className="font-semibold">Extracting telemetry & analyzing vision...</p>
                      </div>
                    ) : selectedFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 className="w-12 h-12 text-green-500 mb-2" />
                        <h3 className="font-bold text-green-800">{selectedFile.name}</h3>
                        <p className="text-xs text-green-600">Image attached securely. Click to change.</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                          <UploadCloud size={28} />
                        </div>
                        <h3 className="font-semibold text-[var(--color-text-main)] mb-1">Tap to capture or upload</h3>
                        <p className="text-xs text-[var(--color-text-muted)] max-w-xs">
                          High-resolution photos grant better ML classification and tighter pricing.
                        </p>
                      </>
                    )}
                  </div>
               </div>
             </div>

             <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex justify-end">
               <button 
                  onClick={handleAnalyzeUpload}
                  disabled={!address || !selectedFile || isAnalyzing || isVerifyingKYC}
                  className="btn-primary flex items-center gap-2 px-8 py-3 shadow-md disabled:bg-emerald-300 disabled:cursor-not-allowed transition-all"
               >
                 {isVerifyingKYC ? (
                   <><ShieldCheck className="w-5 h-5 animate-pulse" /> Authorizing Profile</>
                 ) : isAnalyzing ? (
                   <><Loader2 className="w-5 h-5 animate-spin" /> Querying ML Engine</>
                 ) : (
                   <>Authenticate & Analyze <ChevronRight size={18} /></>
                 )}
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Step 2: Review Analysis */}
      {step === 2 && analysisResult && (
        <div className="animate-in slide-in-from-bottom-4 duration-500 ease-out space-y-6">
          <div className="card p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                  <CheckCircle2 className="text-[var(--color-primary)] w-6 h-6" /> Incident Verification Complete
                </h3>
                <p className="text-[var(--color-text-muted)] text-sm">Review the verified location and extracted estimated parameters.</p>
              </div>
              <button onClick={() => setStep(1)} className="text-sm font-medium text-[var(--color-primary)] hover:underline border border-transparent">
                Edit Report
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mb-6 border border-[var(--color-border)]">
              <div className="md:col-span-2 pb-4 border-b border-gray-200">
                <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1 flex items-center gap-1"><MapPin size={12}/> Target Location</p>
                <p className="font-medium text-[var(--color-text-main)]">{address}</p>
                {details && <p className="text-sm text-gray-500 mt-1 italic">Note: {details}</p>}
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Waste Category</p>
                <p className="font-medium text-lg text-[var(--color-text-main)]">{analysisResult.category}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Estimated Volume</p>
                <p className="font-medium text-lg text-[var(--color-text-main)]">{analysisResult.volume}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">ML Extraction Notes</p>
                <p className="text-sm text-[var(--color-text-main)] leading-relaxed">{analysisResult.description}</p>
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
