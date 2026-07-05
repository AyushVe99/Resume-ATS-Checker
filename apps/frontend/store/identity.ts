import { create } from 'zustand';

interface IdentityState {
  identityData: any | null;
  isAnalyzingIdentity: boolean;
  setIdentityData: (data: any) => void;
  setIsAnalyzingIdentity: (isAnalyzing: boolean) => void;
}

export const useIdentityStore = create<IdentityState>((set) => ({
  identityData: null,
  isAnalyzingIdentity: false,
  setIdentityData: (data) => set({ identityData: data }),
  setIsAnalyzingIdentity: (isAnalyzing) => set({ isAnalyzingIdentity: isAnalyzing }),
}));
