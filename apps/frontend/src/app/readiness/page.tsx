'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RiskMap from '@/components/visualizations/RiskMap';
import ReadinessTree from '@/components/visualizations/ReadinessTree';
import { useMatchStore } from '../../../store/match';
import { useReadinessStore } from '../../../store/readiness';
import axios from 'axios';
import { Loader2, ArrowRight } from 'lucide-react';

export default function ReadinessPage() {
  const router = useRouter();
  const analysisResult = useMatchStore((state) => state.analysisResult);
  const { readinessData, setReadinessData, isAnalyzingReadiness, setIsAnalyzingReadiness } = useReadinessStore();
  const [roleInput, setRoleInput] = useState('');

  useEffect(() => {
    if (!analysisResult?.resume?.resumeId) {
      router.push('/match');
    }
  }, [analysisResult, router]);

  const handleGenerate = async () => {
    if (!roleInput.trim() || !analysisResult?.resume?.resumeId) return;
    
    setIsAnalyzingReadiness(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await axios.post(`${API_URL}/intelligence/readiness`, {
        resumeId: analysisResult?.resume?.resumeId,
        targetRoleTitle: roleInput
      });
      setReadinessData(res.data.data.readiness);
    } catch (err) {
      console.error('Failed to fetch readiness:', err);
    } finally {
      setIsAnalyzingReadiness(false);
    }
  };

  if (!analysisResult?.resume?.resumeId) return null;

  if (isAnalyzingReadiness) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black text-white min-h-[80vh]">
        <Loader2 className="w-16 h-16 animate-spin text-[var(--accent-secondary)] mb-6" />
        <h2 className="text-3xl font-bold mb-4">Generating your Learning Roadmap...</h2>
        <p className="text-gray-400 max-w-md text-center">
          We are analyzing the gap between your current technical DNA and the exact requirements for a {roleInput}. This process takes up to 15 seconds.
        </p>
      </div>
    );
  }

  if (!readinessData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black text-white min-h-[80vh]">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Target <span className="text-[var(--accent-secondary)]">Role</span></h1>
        <p className="text-gray-400 max-w-xl text-center mb-12 text-lg">
          Enter the aspirational role you are aiming for (e.g., &quot;Staff Machine Learning Engineer&quot;). We will map your exact skill gaps and build a roadmap.
        </p>
        
        <div className="flex w-full max-w-lg gap-4 bg-gray-900/50 p-2 rounded-2xl border border-gray-800">
          <input 
            type="text" 
            placeholder="e.g. Senior Frontend Engineer" 
            className="flex-1 bg-transparent border-none text-white px-4 py-3 outline-none"
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button 
            onClick={handleGenerate}
            disabled={!roleInput.trim()}
            className="bg-[var(--accent-secondary)] hover:bg-opacity-90 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
          >
            Analyze <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-8 bg-black text-white max-w-7xl mx-auto w-full space-y-16">
      <div className="text-center mt-12 mb-8">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Career <span className="text-[var(--accent-secondary)]">Readiness</span></h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Here is your personalized skill gap analysis and optimal learning path to become a <strong>{roleInput || readinessData.targetRole?.title}</strong>.
        </p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <RiskMap data={readinessData.riskMap || []} />
        <ReadinessTree data={readinessData} />
      </div>
    </div>
  );
}
