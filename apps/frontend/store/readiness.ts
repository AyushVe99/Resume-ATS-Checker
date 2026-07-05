import { create } from 'zustand';

interface ReadinessState {
  readinessData: any | null;
  isAnalyzingReadiness: boolean;
  setReadinessData: (data: any) => void;
  setIsAnalyzingReadiness: (isAnalyzing: boolean) => void;
}

export const useReadinessStore = create<ReadinessState>((set) => ({
  readinessData: null,
  isAnalyzingReadiness: false,
  setReadinessData: (data) => set({ readinessData: data }),
  setIsAnalyzingReadiness: (isAnalyzing) => set({ isAnalyzingReadiness: isAnalyzing }),
}));
