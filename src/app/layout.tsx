import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WasteWise AI | SignalForge',
  description: 'AI-powered waste reporting and service payment platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-[var(--color-background-alt)] text-[var(--color-text-main)] font-sans">
        <header className="bg-white border-b border-[var(--color-border)] shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[var(--color-primary)] rounded flex items-center justify-center text-white font-bold text-lg">
                W
              </div>
              <span className="font-bold text-xl tracking-tight text-[var(--color-text-main)]">
                WasteWise <span className="text-[var(--color-primary)]">AI</span>
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-[var(--color-primary)] transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-[var(--color-primary)] transition-colors">How it Works</a>
            </nav>
            <div className="flex items-center gap-4">
              <a href="/report" className="btn-primary text-sm py-2 px-4 shadow-sm">
                Report Waste
              </a>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {children}
        </main>

        <footer className="bg-white border-t border-[var(--color-border)] mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:flex md:items-center md:justify-between text-sm text-gray-500">
            <p>&copy; 2026 SignalForge - Enyata & Interswitch Build-a-thon</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="hover:text-gray-900">Privacy</a>
              <a href="#" className="hover:text-gray-900">Terms</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
