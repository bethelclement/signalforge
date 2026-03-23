"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  BarChart3, 
  Activity, 
  ShieldCheck, 
  MapPin, 
  Search, 
  Bell, 
  ArrowUpRight, 
  Camera, 
  Database,
  ArrowRight,
  TrendingUp,
  Cpu
} from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const recentTransactions = [
    { id: "WW-VERIFIED-89102", type: "Commercial Plastics", location: "Oshodi Market", amount: 4500, time: "2 mins ago", status: "Paid", mlConfidence: 98.4 },
    { id: "WW-VERIFIED-77192", type: "Mixed Recyclables", location: "Lekki Phase 1", amount: 2500, time: "14 mins ago", status: "Paid", mlConfidence: 85.1 },
    { id: "WW-VERIFIED-63811", type: "Scrap Metal / E-Waste", location: "Computer Village", amount: 12500, time: "1 hour ago", status: "Paid", mlConfidence: 99.2 },
    { id: "WW-VERIFIED-55290", type: "Cardboard & Paper", location: "Yaba Hub", amount: 1800, time: "3 hours ago", status: "Pending", mlConfidence: 91.0 },
    { id: "WW-VERIFIED-44102", type: "Biodegradable Organic", location: "Agege", amount: 3200, time: "5 hours ago", status: "Paid", mlConfidence: 88.5 },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-[var(--color-border)] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center text-[var(--color-primary)]">
                <Database size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight text-[var(--color-text-main)]">
                WasteWise <span className="text-[var(--color-text-muted)] font-normal">Command Center</span>
              </span>
            </div>
            <div className="flex items-center gap-6 text-[var(--color-text-muted)]">
              <button className="hover:text-[var(--color-primary)] transition-colors"><Search size={20} /></button>
              <button className="hover:text-[var(--color-primary)] transition-colors relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="w-px h-6 bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">LAW</div>
                <span className="font-medium text-sm hidden md:block">LAWMA Admin</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header & Interswitch Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Lagos PSP Telemetry</h1>
            <p className="text-sm text-[var(--color-text-muted)]">Real-time ML reporting and Interswitch gateway flow.</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-[var(--color-border)] px-4 py-2 rounded-lg shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs font-semibold text-[var(--color-text-main)]">ISW Gateway Active</span>
          </div>
        </div>

        {/* Global Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 bg-white border border-[var(--color-border)] shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-[var(--color-primary)]">
                <Activity size={20} />
              </div>
              <span className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                +12% <TrendingUp size={12} className="ml-1"/>
              </span>
            </div>
            <p className="text-sm font-medium text-[var(--color-text-muted)]">Total Cleared Tonnage</p>
            <h3 className="text-3xl font-bold text-[var(--color-text-main)] mt-1">1,248t</h3>
          </div>

          <div className="card p-6 bg-white border-b-4 border-b-[#D22B2B] shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-[#D22B2B]">
                <ShieldCheck size={20} />
              </div>
            </div>
            <p className="text-sm font-medium text-[var(--color-text-muted)]">ISW Processed Revenue</p>
            <h3 className="text-3xl font-bold text-[#D22B2B] mt-1">₦4.2M</h3>
          </div>

          <div className="card p-6 bg-white border border-[var(--color-border)] shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Cpu size={20} />
              </div>
              <span className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                98.4% Acc.
              </span>
            </div>
            <p className="text-sm font-medium text-[var(--color-text-muted)]">AI Vision Extractions</p>
            <h3 className="text-3xl font-bold text-[var(--color-text-main)] mt-1">8,409</h3>
          </div>

          <div className="card p-6 bg-white border border-[var(--color-border)] shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
                <MapPin size={20} />
              </div>
            </div>
            <p className="text-sm font-medium text-[var(--color-text-muted)]">Active Hotspots</p>
            <h3 className="text-3xl font-bold text-[var(--color-text-main)] mt-1">12</h3>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Col: Transactions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card bg-white border border-[var(--color-border)] shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-[var(--color-border)] flex justify-between items-center">
                <h3 className="font-bold text-lg text-[var(--color-text-main)]">Recent Interswitch Dispatches</h3>
                <Link href="/report" className="text-sm text-[var(--color-primary)] font-medium hover:underline flex items-center gap-1">
                  New Report <ArrowRight size={16} />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-[var(--color-border)] text-[var(--color-text-muted)]">
                    <tr>
                      <th className="px-6 py-3 font-semibold">ISW Ref</th>
                      <th className="px-6 py-3 font-semibold">AI Classification</th>
                      <th className="px-6 py-3 font-semibold">Location</th>
                      <th className="px-6 py-3 font-semibold text-right">Fee (₦)</th>
                      <th className="px-6 py-3 font-semibold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {recentTransactions.map((tx, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-mono font-medium text-xs text-gray-600">
                          {tx.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[var(--color-text-main)]">{tx.type}</span>
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-full font-mono" title="ML Confidence Score">
                              {tx.mlConfidence}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[var(--color-text-muted)] flex items-center gap-1.5">
                          <MapPin size={14} /> {tx.location}
                        </td>
                        <td className="px-6 py-4 font-bold text-right text-[var(--color-text-main)]">
                          {tx.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                            tx.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Col: ML Status & Map */}
          <div className="space-y-6">
            <div className="card p-6 bg-white border border-[var(--color-border)] shadow-sm">
              <h3 className="font-bold text-lg text-[var(--color-text-main)] mb-4 flex items-center gap-2">
                <Camera size={20} className="text-[var(--color-primary)]"/>
                ML Engine Diagnostics
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-50 border border-[var(--color-border)]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Vision Model</span>
                    <span className="text-xs font-mono bg-green-100 text-green-700 px-2 py-0.5 rounded">ONLINE</span>
                  </div>
                  <p className="font-medium text-sm text-[var(--color-text-main)]">HuggingFace ViT-Base (Patch16/224)</p>
                </div>
                
                <div className="p-4 rounded-lg bg-gray-50 border border-[var(--color-border)]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Payment Gateway</span>
                    <span className="text-xs font-mono bg-[#D22B2B]/10 text-[#D22B2B] px-2 py-0.5 rounded">ISW-QA</span>
                  </div>
                  <p className="font-medium text-sm text-[var(--color-text-main)]">Interswitch Webpay (SHA-512 MAC)</p>
                </div>
              </div>
            </div>

            <div className="card p-6 bg-white border border-[var(--color-border)] shadow-sm">
               <h3 className="font-bold text-sm text-[var(--color-text-muted)] uppercase tracking-widest mb-4">
                 Top Hotspots (7 Days)
               </h3>
               <div className="space-y-3">
                 <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                   <span className="text-sm font-medium">Oshodi Interchange</span>
                   <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">42 Reports</span>
                 </div>
                 <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                   <span className="text-sm font-medium">Mushin Market</span>
                   <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">28 Reports</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-sm font-medium">Lekki Toll</span>
                   <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">16 Reports</span>
                 </div>
               </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
