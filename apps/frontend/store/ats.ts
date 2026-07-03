import { create } from 'zustand';

interface AtsState {
  analysisResult: any | null;
  isAnalyzing: boolean;
  setAnalysisResult: (result: any) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
}

export const useAtsStore = create<AtsState>((set) => ({
  analysisResult: null,
  isAnalyzing: false,
  setAnalysisResult: (result) => set({ analysisResult: result }),
  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
}));
