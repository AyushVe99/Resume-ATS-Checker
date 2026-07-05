'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EngineeringDNA from '@/components/visualizations/EngineeringDNA';
import ComplexityMatrix from '@/components/visualizations/ComplexityMatrix';
import EvidenceTimeline from '@/components/visualizations/EvidenceTimeline';
import { useMatchStore } from '../../../store/match';
import { useIdentityStore } from '../../../store/identity';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

export default function IdentityPage() {
  const router = useRouter();
  const analysisResult = useMatchStore((state) => state.analysisResult);
  const { identityData, setIdentityData, isAnalyzingIdentity, setIsAnalyzingIdentity } = useIdentityStore();
  
  useEffect(() => {
    if (!analysisResult?.resume?.resumeId) {
      router.push('/match');
      return;
    }

    const fetchIdentity = async () => {
      if (identityData) return;
      setIsAnalyzingIdentity(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await axios.post(`${API_URL}/intelligence/identity`, {
          resumeId: analysisResult?.resume?.resumeId
        });
        setIdentityData(res.data.data);
      } catch (err) {
        console.error('Failed to fetch identity:', err);
      } finally {
        setIsAnalyzingIdentity(false);
      }
    };

    fetchIdentity();
  }, [analysisResult, identityData, router, setIdentityData, setIsAnalyzingIdentity]);

  if (!analysisResult?.resume?.resumeId) return null;

  if (isAnalyzingIdentity || !identityData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black text-white min-h-[80vh]">
        <Loader2 className="w-16 h-16 animate-spin text-[var(--accent-primary)] mb-6" />
        <h2 className="text-3xl font-bold mb-4">Extracting your Engineering DNA...</h2>
        <p className="text-gray-400 max-w-md text-center">
          Our Principal Engineer AI is analyzing your technical narrative, cross-referencing your projects, and building your archetype graph. This takes about 10-15 seconds.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-8 bg-black text-white max-w-7xl mx-auto w-full space-y-16">
      <div className="text-center mt-12 mb-8">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
          <span className="text-[var(--accent-primary)]">{identityData.level}</span> {identityData.archetype}
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          We extracted deep technical insights from your resume to build a living graph of your engineering capabilities and archetypes.
        </p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <EngineeringDNA data={identityData} />
        <ComplexityMatrix data={identityData.projects || []} />
      </div>

      <EvidenceTimeline data={identityData.timeline || []} />
    </div>
  );
}
