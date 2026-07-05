import { create } from 'zustand';

export interface ReadinessData {
  targetRole?: { title: string };
  riskMap?: Array<{ skill: string; risk: string; proficiency: number; required?: boolean }>;
  treeNodes?: Array<{ id: string; label: string; type: string }>;
  treeEdges?: Array<{ source: string; target: string }>;
  [key: string]: unknown;
}

interface ReadinessState {
  readinessData: ReadinessData | null;
  isAnalyzingReadiness: boolean;
  setReadinessData: (data: ReadinessData | null) => void;
  setIsAnalyzingReadiness: (isAnalyzing: boolean) => void;
}

export const useReadinessStore = create<ReadinessState>((set) => ({
  readinessData: null,
  isAnalyzingReadiness: false,
  setReadinessData: (data) => set({ readinessData: data }),
  setIsAnalyzingReadiness: (isAnalyzing) => set({ isAnalyzingReadiness: isAnalyzing }),
}));
