'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between glass-panel border-b-0 border-b border-[var(--border)] rounded-none relative">
      <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
        <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-[var(--accent-primary)]/20">
          EC
        </div>
        <span className="font-bold text-xl sm:text-2xl tracking-tight text-white hidden min-[400px]:block">Intelligence</span>
      </Link>
      
      {/* Desktop Navigation */}
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
      
      <div className="flex items-center gap-3 sm:gap-4">
        <Link 
          href="/upload"
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-sm font-medium transition-all border border-white/10 backdrop-blur-md whitespace-nowrap"
        >
          Connect Profile
        </Link>

        {/* Mobile Menu Toggle Button */}
        <button 
          className="md:hidden text-gray-300 hover:text-white p-1"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-black/95 border-b border-gray-800 p-6 flex flex-col gap-6 md:hidden shadow-2xl backdrop-blur-xl">
          <Link 
            href="/identity" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`text-lg font-medium ${pathname === '/identity' ? 'text-[var(--accent-secondary)]' : 'text-gray-300 hover:text-white'}`}
          >
            Identity
          </Link>
          <Link 
            href="/readiness" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`text-lg font-medium ${pathname === '/readiness' ? 'text-[var(--accent-primary)]' : 'text-gray-300 hover:text-white'}`}
          >
            Readiness
          </Link>
          <Link 
            href="/match" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`text-lg font-medium ${pathname === '/match' || pathname === '/analysis' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
          >
            Match
          </Link>
        </div>
      )}
    </header>
  );
}
