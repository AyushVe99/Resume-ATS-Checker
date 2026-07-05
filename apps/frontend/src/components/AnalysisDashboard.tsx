'use client';

import { useMatchStore } from '../../store/match';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, Lightbulb, Zap, ArrowLeft, ChevronDown, ChevronUp, Target, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
    case 'Major': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    case 'Minor': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
  }
};

const CategoryAccordion = ({ title, data }: { title: string, data: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900 mb-4 transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex flex-col items-start gap-1">
          <span className="font-bold capitalize text-lg">{title.replace(/([A-Z])/g, ' $1').trim()}</span>
          <div className="flex items-center gap-3 text-sm">
            <span className={data.percentage >= 80 ? 'text-green-400' : data.percentage >= 50 ? 'text-yellow-400' : 'text-red-400'}>
              {data.score} / {data.maxPoints} pts ({data.percentage}%)
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">{data.deductions.length} Deductions</span>
          </div>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-800"
          >
            <div className="p-4 space-y-4">
              {data.deductions.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Points Lost</h4>
                  {data.deductions.map((deduction: any, idx: number) => (
                    <div key={idx} className={`p-4 rounded-lg border ${getSeverityColor(deduction.severity)}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold">{deduction.rule}</span>
                        <span className="font-bold">-{deduction.points} pts</span>
                      </div>
                      <p className="text-sm mb-2 opacity-90">{deduction.explanation}</p>
                      <p className="text-sm font-medium opacity-100 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" /> {deduction.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Perfect score! No deductions found in this category.</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AnalysisDashboard() {
  const analysisResult = useMatchStore((state) => state.analysisResult);
  const router = useRouter();

  useEffect(() => {
    if (!analysisResult) {
      router.push('/match');
      return;
    }
  }, [analysisResult, router]);

  if (!analysisResult) return null;

  const {
    overallScore,
    matchBenchmark,
    recruiterConfidence,
    categories,
    keywordAnalysis,
    aiSuggestions,
  } = analysisResult;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getBenchmarkColor = (benchmark: string) => {
    if (benchmark.includes('Excellent')) return 'text-green-400 bg-green-400/10 border-green-400/20';
    if (benchmark.includes('Strong')) return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    if (benchmark.includes('Moderate')) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    return 'text-red-400 bg-red-400/10 border-red-400/20';
  };

  const topDeductions = Object.values(categories as Record<string, any>)
    .flatMap(cat => cat.deductions)
    .sort((a: any, b: any) => b.points - a.points)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => { useMatchStore.getState().setAnalysisResult(null); router.push('/match'); }} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold">Analysis Results</h1>
      </div>

      {topDeductions.length > 0 && (
        <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-400" />
            <h3 className="font-bold text-xl text-orange-100">Action Plan: Quick Fixes</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">Do these 3 things right now to immediately boost your ATS Match Score:</p>
          <ul className="space-y-4">
            {topDeductions.map((deduction: any, idx: number) => (
              <li key={idx} className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold flex-shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-200">{deduction.rule}</span>
                    <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-bold">
                      +{deduction.points} pts
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{deduction.explanation}</p>
                  <p className="text-sm text-blue-400 font-medium flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" /> {deduction.recommendation}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: High Level Scores */}
        <div className="lg:col-span-1 space-y-6">
          {/* Main ATS Score */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
            <h2 className="text-xl font-medium text-gray-400 mb-6 flex items-center gap-2">
              <Target className="w-5 h-5" /> ATS Match Score
            </h2>
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-800" />
                <motion.circle
                  initial={{ strokeDashoffset: 553 }}
                  animate={{ strokeDashoffset: 553 - (553 * overallScore) / 100 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent"
                  strokeDasharray="553"
                  strokeLinecap="round"
                  className={getScoreColor(overallScore)}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className={`text-6xl font-black ${getScoreColor(overallScore)}`}>{overallScore}</span>
                <span className="text-sm text-gray-500 mt-1">/ 100</span>
              </div>
            </div>
            
            <div className={`mt-6 px-4 py-2 rounded-full border text-sm font-bold ${getBenchmarkColor(matchBenchmark)}`}>
              {matchBenchmark}
            </div>
          </div>

          {/* Recruiter Confidence */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-medium text-gray-400 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> Recruiter Confidence
            </h2>
            <div className="flex items-end gap-3 mb-2">
              <span className={`text-4xl font-black ${getScoreColor(recruiterConfidence)}`}>{recruiterConfidence}</span>
              <span className="text-gray-500 mb-1">/ 100</span>
            </div>
            <p className="text-sm text-gray-400">
              This score isolates your raw technical experience and impact from formatting mechanics.
            </p>
          </div>
        </div>

        {/* Right Column: Detailed Breakdown */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Suggestions (Gemini) */}
          {aiSuggestions && aiSuggestions.length > 0 && (
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-blue-400" />
                <h3 className="font-bold text-xl text-blue-100">Gemini AI Polish</h3>
              </div>
              <ul className="space-y-4">
                {aiSuggestions.map((sug: { section: string; suggestion: string; reason: string }, idx: number) => (
                  <li key={idx} className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1 block">{sug.section}</span>
                    <p className="text-gray-200 mb-2">{sug.suggestion}</p>
                    <p className="text-sm text-gray-500">Why: {sug.reason}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* JD Intelligence: Keywords */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-xl mb-6">JD Intelligence: Keyword Analysis</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Required Skills */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Required Skills (70%)</h4>
                <div className="flex flex-wrap gap-2">
                  {keywordAnalysis.requiredSkills?.matched?.map((kw: string) => (
                    <span key={kw} className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-medium">
                      {kw}
                    </span>
                  ))}
                  {keywordAnalysis.requiredSkills?.missing?.map((kw: string) => (
                    <span key={kw} className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-medium">
                      {kw} (Missing)
                    </span>
                  ))}
                </div>
              </div>

              {/* Preferred / Bonus Skills */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Preferred / Bonus (30%)</h4>
                <div className="flex flex-wrap gap-2">
                  {[...(keywordAnalysis.preferredSkills?.matched || []), ...(keywordAnalysis.bonusSkills?.matched || [])].map((kw: string) => (
                    <span key={kw} className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-medium">
                      {kw}
                    </span>
                  ))}
                  {[...(keywordAnalysis.preferredSkills?.missing || []), ...(keywordAnalysis.bonusSkills?.missing || [])].map((kw: string) => (
                    <span key={kw} className="px-3 py-1 bg-gray-800 text-gray-400 border border-gray-700 rounded-full text-xs font-medium">
                      {kw} (Missing)
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Category Deductions */}
          <div>
            <h3 className="font-bold text-xl mb-4">Detailed Score Deductions</h3>
            <p className="text-gray-400 text-sm mb-6">Click on any category to view specific recruiter feedback and rules triggered.</p>
            
            {Object.entries(categories as Record<string, any>).map(([key, data]) => (
              <CategoryAccordion key={key} title={key} data={data} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
