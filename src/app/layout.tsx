import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WasteWise AI | SignalForge',
  description: 'AI-powered waste reporting and service payment platform.',
  openGraph: {
    title: 'WasteWise AI | SignalForge',
    description: 'AI-powered waste reporting and service payment platform.',
    type: 'website',
    url: 'https://signalforge-rosy.vercel.app',
    siteName: 'WasteWise AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WasteWise AI | SignalForge',
    description: 'AI-powered waste reporting and service payment platform.',
  },
  keywords: ['waste management', 'Lagos', 'AI', 'recycling', 'Interswitch'],
  authors: [{ name: 'SignalForge' }],
  icons: { icon: '/icon.svg' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#10b981" />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-grid-pattern text-[var(--color-text-main)] overflow-x-hidden">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-[var(--color-primary)] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-bold">Skip to main content</a>
        <header className="bg-white/90 backdrop-blur-md border-b border-[var(--color-border)] sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-green-500/20">
                W
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="font-black text-2xl tracking-tighter text-[var(--color-secondary)] uppercase">
                  WasteWise <span className="text-[var(--color-primary)]">AI</span>
                </span>
                <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.3em] ml-0.5">SignalForge Pro</span>
              </div>
            </div>
            <nav aria-label="Main navigation" className="hidden lg:flex items-center space-x-10">
              <a href="/dashboard" className="text-sm font-bold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors uppercase tracking-widest">Telemetry</a>
              <a href="/history" className="text-sm font-bold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors uppercase tracking-widest">History</a>
              <a href="/#how-it-works" className="text-sm font-bold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors uppercase tracking-widest">System</a>
              <a href="/report" className="btn-primary text-xs py-2.5 px-6 shadow-xl uppercase tracking-widest">
                Deploy Report
              </a>
            </nav>
            {/* Mobile hamburger menu (CSS-only, no client JS needed) */}
            <details aria-label="Mobile navigation menu" className="lg:hidden relative group">
              <summary className="list-none cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-secondary)] group-open:hidden">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-secondary)] hidden group-open:block">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </summary>
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-[var(--color-border)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <a href="/dashboard" className="block px-5 py-3 text-sm font-bold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-gray-50 transition-colors uppercase tracking-widest">Telemetry</a>
                <a href="/history" className="block px-5 py-3 text-sm font-bold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-gray-50 transition-colors uppercase tracking-widest">History</a>
                <a href="/#how-it-works" className="block px-5 py-3 text-sm font-bold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-gray-50 transition-colors uppercase tracking-widest">System</a>
                <div className="mx-4 my-2 h-px bg-gray-100"></div>
                <a href="/report" className="block mx-4 my-2 btn-primary text-xs py-2.5 px-6 shadow-xl uppercase tracking-widest text-center">
                  Deploy Report
                </a>
              </div>
            </details>
          </div>
        </header>

        <main id="main-content" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          {children}
        </main>

        <footer className="bg-white border-t border-[var(--color-border)] mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center text-center">
             <div className="flex items-center gap-3 mb-6">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">Engineered for Excellence</span>
             </div>
             <div className="flex items-center gap-8 mb-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               <p className="text-2xl font-black text-gray-800 flex items-center gap-3">
                 Enyata <span className="font-light text-gray-300">/</span> <span className="italic text-blue-900">Interswitch<span className="text-red-500">.</span></span>
               </p>
             </div>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">Official Build-a-thon 2026 Submission</p>
             <div className="h-px w-32 bg-linear-to-r from-transparent via-gray-200 to-transparent mb-8"></div>
             <div className="text-xs text-gray-400 flex flex-col md:flex-row gap-6 items-center font-medium">
                <p>&copy; 2026 SIGNALFORGE. ALL RIGHTS RESERVED.</p>
                <div className="hidden md:block w-1.5 h-1.5 bg-[var(--color-primary)]/30 rounded-full"></div>
                <p className="uppercase tracking-widest">Lagos Commercial Waste Intelligence</p>
             </div>
          </div>
        </footer>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
