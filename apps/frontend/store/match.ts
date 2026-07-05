import { create } from 'zustand';

interface MatchState {
  analysisResult: any | null;
  isAnalyzing: boolean;
  setAnalysisResult: (result: any) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
}

export const useMatchStore = create<MatchState>((set) => ({
  analysisResult: null,
  isAnalyzing: false,
  setAnalysisResult: (result) => set({ analysisResult: result }),
  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
}));
