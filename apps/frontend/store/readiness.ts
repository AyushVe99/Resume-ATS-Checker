import { create } from 'zustand';

interface ReadinessState {
  readinessData: Record<string, unknown> | null;
  isAnalyzingReadiness: boolean;
  setReadinessData: (data: Record<string, unknown> | null) => void;
  setIsAnalyzingReadiness: (isAnalyzing: boolean) => void;
}

export const useReadinessStore = create<ReadinessState>((set) => ({
  readinessData: null,
  isAnalyzingReadiness: false,
  setReadinessData: (data) => set({ readinessData: data }),
  setIsAnalyzingReadiness: (isAnalyzing) => set({ isAnalyzingReadiness: isAnalyzing }),
}));
