'use client';

import { useAtsStore } from '../../store/ats';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Lightbulb, Zap, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalysisDashboard() {
  const analysisResult = useAtsStore((state) => state.analysisResult);
  const router = useRouter();

  useEffect(() => {
    if (!analysisResult) {
      router.push('/upload');
      return;
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Most modern browsers ignore the custom string but require e.returnValue to be set
      e.returnValue = 'You have unsaved analysis results. Are you sure you want to leave?';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [analysisResult, router]);

  if (!analysisResult) return null;

  const {
    overallScore,
    categoryScores,
    matchedKeywords,
    missingKeywords,
    technicalSkills,
    softSkills,
    warnings,
    strengths,
    aiSuggestions,
    deductions,
  } = analysisResult;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.push('/upload')} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold">Analysis Results</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Score & Categories */}
        <div className="lg:col-span-1 space-y-8">
          {/* Overall Score */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
            <h2 className="text-xl font-medium text-gray-400 mb-6">Overall ATS Score</h2>
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-800" />
                <motion.circle
                  initial={{ strokeDashoffset: 553 }}
                  animate={{ strokeDashoffset: 553 - (553 * overallScore) / 100 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent"
                  strokeDasharray="553"
                  className={getScoreColor(overallScore)}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className={`text-5xl font-black ${getScoreColor(overallScore)}`}>{overallScore}</span>
                <span className="text-sm text-gray-500 mt-1">/ 100</span>
              </div>
            </div>
            <p className="mt-6 text-gray-400">
              {overallScore >= 80 ? 'Excellent! Highly likely to pass ATS.' : overallScore >= 60 ? 'Good, but needs some optimization.' : 'Needs significant improvement.'}
            </p>
          </div>

          {/* Category Scores */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold mb-4">Category Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(categoryScores as Record<string, number>).map(([key, value]: [string, number]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-gray-300">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-medium">{value} pts</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(value / 25) * 100}%` }}
                      className="bg-blue-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Suggestions (Gemini) */}
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-blue-400" />
              <h3 className="font-bold text-xl">AI Suggestions</h3>
            </div>
            {aiSuggestions && aiSuggestions.length > 0 ? (
              <ul className="space-y-4">
                {aiSuggestions.map((sug: { section: string; suggestion: string; reason: string }, idx: number) => (
                  <li key={idx} className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1 block">{sug.section}</span>
                    <p className="text-gray-200 mb-2">{sug.suggestion}</p>
                    <p className="text-sm text-gray-500">Why: {sug.reason}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No specific AI suggestions generated.</p>
            )}
          </div>

          {/* Skills Breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-green-400">
                <CheckCircle2 className="w-5 h-5" /> Technical Skills (Found)
              </h3>
              <div className="flex flex-wrap gap-2">
                {technicalSkills?.matched?.length > 0 ? technicalSkills.matched.map((kw: string) => (
                  <span key={kw} className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm">
                    {kw}
                  </span>
                )) : <p className="text-gray-500 text-sm">No technical skills found.</p>}
              </div>

              <h3 className="font-bold mt-6 mb-4 flex items-center gap-2 text-green-400">
                <CheckCircle2 className="w-5 h-5" /> Soft Skills (Found)
              </h3>
              <div className="flex flex-wrap gap-2">
                {softSkills?.matched?.length > 0 ? softSkills.matched.map((kw: string) => (
                  <span key={kw} className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm">
                    {kw}
                  </span>
                )) : <p className="text-gray-500 text-sm">No soft skills found.</p>}
              </div>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" /> Technical Skills (Missing)
              </h3>
              <div className="flex flex-wrap gap-2">
                {technicalSkills?.missing?.length > 0 ? technicalSkills.missing.map((kw: string) => (
                  <span key={kw} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-sm">
                    {kw}
                  </span>
                )) : <p className="text-gray-500 text-sm">No missing technical skills!</p>}
              </div>

              <h3 className="font-bold mt-6 mb-4 flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" /> Soft Skills (Missing)
              </h3>
              <div className="flex flex-wrap gap-2">
                {softSkills?.missing?.length > 0 ? softSkills.missing.map((kw: string) => (
                  <span key={kw} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-sm">
                    {kw}
                  </span>
                )) : <p className="text-gray-500 text-sm">No missing soft skills!</p>}
              </div>
            </div>
          </div>

          {/* Rule Deductions (Explainability) */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-yellow-400">
              <Lightbulb className="w-5 h-5" /> Score Deductions & Rules Triggered
            </h3>
            {deductions && deductions.length > 0 ? (
              <div className="space-y-4">
                {deductions.map((deduction: { rule: string; explanation: string; recommendation: string }, i: number) => (
                  <div key={i} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider mb-2 block">{deduction.rule}</span>
                    <p className="text-gray-200 text-sm mb-1"><strong>Issue:</strong> {deduction.explanation}</p>
                    <p className="text-gray-400 text-sm"><strong>Recommendation:</strong> {deduction.recommendation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No score deductions! Perfect resume.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
