import { create } from 'zustand';

export interface AnalysisResult {
  resume?: {
    resumeId?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface MatchState {
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
}

export const useMatchStore = create<MatchState>((set) => ({
  analysisResult: null,
  isAnalyzing: false,
  setAnalysisResult: (result) => set({ analysisResult: result }),
  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
}));
