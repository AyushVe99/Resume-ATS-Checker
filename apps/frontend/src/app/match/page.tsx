'use client';

import FileUpload from '@/components/FileUpload';
import AnalysisDashboard from '@/components/AnalysisDashboard';
import { useMatchStore } from '../../../store/match';

export default function MatchPage() {
  const analysisResult = useMatchStore((state) => state.analysisResult);

  return (
    <div className="flex-1 flex flex-col p-8 bg-black text-white w-full max-w-7xl mx-auto">
      {analysisResult ? (
        <AnalysisDashboard />
      ) : (
        <div className="max-w-3xl mx-auto w-full mt-12 text-center">
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">ATS <span className="text-gradient">Match</span></h1>
          <p className="text-gray-400 mb-12 text-lg">
            Upload your resume and a job description to generate a deterministic, transparent ATS score and see how well you align with the requirements.
          </p>
          <FileUpload />
        </div>
      )}
    </div>
  );
}
