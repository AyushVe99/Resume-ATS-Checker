import Link from 'next/link';
import { ArrowRight, Dna, Map, Target } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 relative overflow-hidden">
        {/* Subtle background glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent-primary)] opacity-[0.04] blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-[var(--accent-secondary)] opacity-[0.04] blur-[100px] rounded-full pointer-events-none" />

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight max-w-5xl mb-6 relative z-10 leading-tight">
          Uncover your <br/><span className="text-gradient">Engineering DNA</span>
        </h1>
        <p className="text-xl md:text-2xl text-[var(--foreground)] opacity-70 max-w-3xl mb-12 relative z-10 font-light">
          A premium, evidence-driven career intelligence platform. Move beyond arbitrary ATS scores and explore your true technical identity.
        </p>
        <Link 
          href="/identity"
          className="group relative z-10 flex items-center gap-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white px-10 py-5 rounded-full text-xl font-bold shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_60px_rgba(6,182,212,0.5)] hover:scale-105 transition-all duration-300"
        >
          Discover Your Identity <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Feature Cards */}
        <div className="mt-32 grid md:grid-cols-3 gap-8 max-w-6xl text-left relative z-10">
          <div className="glass-panel p-8 rounded-3xl transition-transform hover:-translate-y-2 duration-300">
            <div className="w-14 h-14 rounded-2xl bg-[var(--accent-primary)]/20 flex items-center justify-center mb-6">
              <Dna className="text-[var(--accent-primary)] w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Identity Extraction</h3>
            <p className="text-[var(--foreground)] opacity-70 leading-relaxed text-lg">
              We extract deep technical insights from your resume to build a living graph of your engineering capabilities and archetypes.
            </p>
          </div>
          <div className="glass-panel p-8 rounded-3xl transition-transform hover:-translate-y-2 duration-300 delay-100">
            <div className="w-14 h-14 rounded-2xl bg-[var(--accent-secondary)]/20 flex items-center justify-center mb-6">
              <Map className="text-[var(--accent-secondary)] w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Career Readiness</h3>
            <p className="text-[var(--foreground)] opacity-70 leading-relaxed text-lg">
              Map your extracted evidence against target aspirational roles to uncover critical skill gaps and generate a learning roadmap.
            </p>
          </div>
          <div className="glass-panel p-8 rounded-3xl transition-transform hover:-translate-y-2 duration-300 delay-200">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
              <Target className="text-white w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Deterministic Match</h3>
            <p className="text-[var(--foreground)] opacity-70 leading-relaxed text-lg">
              Evaluate specific job descriptions with strict rule-based formatting checks and transparent keyword alignment analysis.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
