import { create } from 'zustand';

export interface IdentityData {
  level: string;
  archetype: string;
  coreDomains?: string[];
  evidence?: Array<{ skill: string; domain?: string }>;
  projects?: Array<{ name: string; domain: string; complexity: number; impact: number }>;
  timeline?: Array<{ role: string; company: string; year: string; domain: string; achievement: string }>;
  [key: string]: unknown;
}

interface IdentityState {
  identityData: IdentityData | null;
  isAnalyzingIdentity: boolean;
  setIdentityData: (data: IdentityData) => void;
  setIsAnalyzingIdentity: (isAnalyzing: boolean) => void;
}

export const useIdentityStore = create<IdentityState>((set) => ({
  identityData: null,
  isAnalyzingIdentity: false,
  setIdentityData: (data) => set({ identityData: data }),
  setIsAnalyzingIdentity: (isAnalyzing) => set({ isAnalyzingIdentity: isAnalyzing }),
}));
