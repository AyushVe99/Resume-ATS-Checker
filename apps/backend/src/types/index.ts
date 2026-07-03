export interface ParsedResume {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  skills: string[];
  experience: string[];
  education: string[];
  projects: string[];
  certifications: string[];
  languages: string[];
  summary: string;
  rawText: string;
  confidenceScores?: Record<string, number>;
}

export interface ATSAnalysisRequest {
  jobDescription: string;
}

export interface RuleDeduction {
  rule: string;
  explanation: string;
  recommendation: string;
}

export interface ATSAnalysisResponse {
  overallScore: number;
  categoryScores: {
    formatting: number;
    keywordMatch: number;
    experience: number;
    projects: number;
    skills: number;
    education: number;
    grammar: number;
    atsCompatibility: number;
  };
  resume: ParsedResume;
  matchedKeywords: string[];
  missingKeywords: string[];
  technicalSkills: {
    matched: string[];
    missing: string[];
  };
  softSkills: {
    matched: string[];
    missing: string[];
  };
  warnings: string[];
  strengths: string[];
  improvements: string[];
  aiSuggestions: AISuggestion[];
  deductions: RuleDeduction[];
}

export interface AISuggestion {
  section: string;
  suggestion: string;
  reason: string;
}
