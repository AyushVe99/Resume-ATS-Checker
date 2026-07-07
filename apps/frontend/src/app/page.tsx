import Link from 'next/link';
import { 
  ArrowRight, 
  FileCheck, 
  Target, 
  Sparkles,
  Briefcase,
  FileText,
  MessageSquare,
  TrendingUp,
  Bot
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 relative overflow-hidden">
        {/* Subtle background glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent-primary)] opacity-[0.04] blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-[var(--accent-secondary)] opacity-[0.04] blur-[100px] rounded-full pointer-events-none" />

        {/* Hero Section */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight max-w-5xl mb-6 relative z-10 leading-tight">
          Beat the <span className="text-gradient">ATS Parser</span>
        </h1>
        <p className="text-xl md:text-2xl text-[var(--foreground)] opacity-70 max-w-3xl mb-12 relative z-10 font-light">
          A premium, evidence-driven career intelligence platform. Optimize your resume to bypass algorithms and impress human recruiters.
        </p>
        <Link 
          href="/upload"
          className="group relative z-10 flex items-center gap-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white px-10 py-5 rounded-full text-xl font-bold shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_60px_rgba(6,182,212,0.5)] hover:scale-105 transition-all duration-300"
        >
          Check Your Resume <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* What We Do Section */}
        <div className="mt-32 w-full max-w-6xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="glass-panel p-8 rounded-3xl transition-transform hover:-translate-y-2 duration-300">
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent-primary)]/20 flex items-center justify-center mb-6">
                <FileCheck className="text-[var(--accent-primary)] w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Resume Validation</h3>
              <p className="text-[var(--foreground)] opacity-70 leading-relaxed text-lg">
                Strict rule-based formatting checks to ensure your resume passes ATS parsers without getting mangled.
              </p>
            </div>
            
            <div className="glass-panel p-8 rounded-3xl transition-transform hover:-translate-y-2 duration-300 delay-100">
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent-secondary)]/20 flex items-center justify-center mb-6">
                <Target className="text-[var(--accent-secondary)] w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">ATS Keyword Match</h3>
              <p className="text-[var(--foreground)] opacity-70 leading-relaxed text-lg">
                Transparent keyword alignment analysis against targeted Job Descriptions to maximize your match score.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl transition-transform hover:-translate-y-2 duration-300 delay-200">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <Sparkles className="text-white w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">AI Polish</h3>
              <p className="text-[var(--foreground)] opacity-70 leading-relaxed text-lg">
                Deep technical insights, grammar fixes, and bullet point enhancements powered by Gemini AI.
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-40 w-full max-w-6xl relative z-10">
          <div className="flex flex-col items-center mb-16">
            <span className="px-4 py-1.5 rounded-full bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-sm font-bold tracking-wide uppercase mb-4 border border-[var(--accent-primary)]/30">
              Roadmap
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">The Future of Hiring</h2>
            <p className="text-xl text-[var(--foreground)] opacity-70 max-w-2xl text-center font-light">
              We are building the ultimate automated career copilot. Here&apos;s what&apos;s coming next to our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {[
              {
                title: "Smart Job Hunting",
                desc: "Automatically find and recommend job listings that perfectly match the skills extracted from your resume.",
                icon: Briefcase,
                color: "text-blue-400",
                bg: "bg-blue-400/10",
              },
              {
                title: "AI Cover Letters",
                desc: "Generate highly personalized, impressive cover letters tailored to specific Job Descriptions with one click.",
                icon: FileText,
                color: "text-green-400",
                bg: "bg-green-400/10",
              },
              {
                title: "Technical Mock Interviews",
                desc: "Interactive AI-driven interview prep that grills you on the specific technical gaps identified in your resume.",
                icon: MessageSquare,
                color: "text-purple-400",
                bg: "bg-purple-400/10",
              },
              {
                title: "Salary Estimator",
                desc: "Estimate your true market worth based on your extracted engineering identity and current industry trends.",
                icon: TrendingUp,
                color: "text-emerald-400",
                bg: "bg-emerald-400/10",
              },
              {
                title: "1-Click Auto-Apply Bot",
                desc: "Streamline your job hunt by automatically submitting your tailored resume to matched roles.",
                icon: Bot,
                color: "text-rose-400",
                bg: "bg-rose-400/10",
              },
            ].map((feature, i) => (
              <div 
                key={i}
                className="group relative bg-[#0a0a0a]/40 border border-white/5 p-6 rounded-2xl hover:bg-white/[0.02] hover:border-white/10 transition-all duration-300 overflow-hidden"
              >
                {/* Subtle hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`${feature.color} w-6 h-6`} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white/90 group-hover:text-white transition-colors">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed text-sm group-hover:text-white/70 transition-colors">
                  {feature.desc}
                </p>
                
                {/* Small 'Upcoming' badge */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-white/30 bg-white/5 px-2 py-1 rounded">Soon</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
