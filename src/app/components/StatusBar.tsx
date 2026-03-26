'use client';

import { useEffect, useState } from 'react';

type ServiceStatus = 'operational' | 'degraded' | 'offline' | 'loading' | 'checking';

interface HealthData {
  gemini?: { status: string; model?: string };
  interswitch?: { status: string; endpoint?: string };
}

function dotColor(status: ServiceStatus): string {
  switch (status) {
    case 'operational':
      return 'bg-green-400';
    case 'degraded':
      return 'bg-yellow-400';
    case 'offline':
      return 'bg-red-400';
    case 'loading':
      return 'bg-gray-400';
    case 'checking':
      return 'bg-yellow-400';
  }
}

function label(status: ServiceStatus): string {
  switch (status) {
    case 'operational':
      return 'Operational';
    case 'degraded':
      return 'Degraded';
    case 'offline':
      return 'Offline';
    case 'loading':
      return '';
    case 'checking':
      return 'Checking...';
  }
}

export default function StatusBar() {
  const [gemini, setGemini] = useState<ServiceStatus>('loading');
  const [isw, setIsw] = useState<ServiceStatus>('loading');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) throw new Error('Health check failed');
        return res.json() as Promise<HealthData>;
      })
      .then((data) => {
        setGemini((data.gemini?.status as ServiceStatus) ?? 'checking');
        setIsw((data.interswitch?.status as ServiceStatus) ?? 'checking');
      })
      .catch(() => {
        setGemini('checking');
        setIsw('checking');
      });
  }, []);

  return (
    <div className="flex items-center justify-center gap-6 px-4 py-2 bg-gray-900 text-white rounded-full mx-auto text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl z-20 sticky top-24 animate-in fade-in slide-in-from-top-4 duration-1000">
      {/* Gemini */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full animate-pulse ${dotColor(gemini)}`} />
        {gemini === 'loading' ? (
          <span className="inline-block w-28 h-2.5 rounded bg-gray-700 animate-pulse" />
        ) : (
          <span>Gemini 1.5 Flash : {label(gemini)}</span>
        )}
      </div>

      <div className="w-px h-3 bg-white/20" />

      {/* ISW */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full animate-pulse ${dotColor(isw)}`} />
        {isw === 'loading' ? (
          <span className="inline-block w-28 h-2.5 rounded bg-gray-700 animate-pulse" />
        ) : (
          <span>ISW Webpay @ QA : {isw === 'operational' ? 'Verified' : label(isw)}</span>
        )}
      </div>

      <div className="w-px h-3 bg-white/20" />

      {/* Lagos Node - always demo */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        <span>Lagos Node : Synchronized</span>
      </div>
    </div>
  );
}
