import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="px-6 lg:px-8 h-16 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
            ATS
          </div>
          <span className="font-bold text-xl tracking-tight">ResumePro</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>
        </nav>
        <Link 
          href="/upload"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Get Started
        </Link>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-8">
          Beat the ATS and land your dream job
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mb-10">
          Upload your resume and paste the job description. Our advanced deterministic engine and AI will score your resume and tell you exactly how to improve it.
        </p>
        <Link 
          href="/upload"
          className="group flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-200 transition-all"
        >
          Scan My Resume <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>

        <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-5xl text-left">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
            <CheckCircle2 className="text-blue-500 mb-4 w-8 h-8" />
            <h3 className="text-xl font-bold mb-2">Deterministic Scoring</h3>
            <p className="text-gray-400">Get a transparent, rule-based score based on formatting, keywords, and experience.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
            <CheckCircle2 className="text-purple-500 mb-4 w-8 h-8" />
            <h3 className="text-xl font-bold mb-2">Keyword Matching</h3>
            <p className="text-gray-400">Identify exact missing and matched keywords against your target job description.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
            <CheckCircle2 className="text-indigo-500 mb-4 w-8 h-8" />
            <h3 className="text-xl font-bold mb-2">AI Suggestions</h3>
            <p className="text-gray-400">Receive smart suggestions to rewrite bullets, fix grammar, and improve action verbs.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
