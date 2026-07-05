'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 px-6 lg:px-8 h-20 flex items-center justify-between glass-panel border-b-0 border-b border-[var(--border)] rounded-none">
      <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
        <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-[var(--accent-primary)]/20">
          EC
        </div>
        <span className="font-bold text-2xl tracking-tight text-white">Intelligence</span>
      </Link>
      
      <nav className="hidden md:flex gap-8 text-sm font-medium text-[var(--foreground)] opacity-80">
        <Link 
          href="/identity" 
          className={`hover:opacity-100 hover:text-[var(--accent-secondary)] transition-all ${pathname === '/identity' ? 'text-[var(--accent-secondary)] opacity-100 font-bold' : ''}`}
        >
          Identity
        </Link>
        <Link 
          href="/readiness" 
          className={`hover:opacity-100 hover:text-[var(--accent-primary)] transition-all ${pathname === '/readiness' ? 'text-[var(--accent-primary)] opacity-100 font-bold' : ''}`}
        >
          Readiness
        </Link>
        <Link 
          href="/match" 
          className={`hover:opacity-100 hover:text-white transition-all ${pathname === '/match' || pathname === '/analysis' ? 'text-white opacity-100 font-bold' : ''}`}
        >
          Match
        </Link>
      </nav>
      
      <Link 
        href="/upload"
        className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all border border-white/10 backdrop-blur-md"
      >
        Connect Profile
      </Link>
    </header>
  );
}
