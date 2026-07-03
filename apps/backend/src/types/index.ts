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
  parsedResume: ParsedResume;
}

export type SeverityLevel = 'Critical' | 'Major' | 'Minor' | 'Info';
export type JDSkillWeight = 'Required' | 'Preferred' | 'Bonus';

export interface RuleDeduction {
  rule: string;
  item?: string;
  points: number;
  severity: SeverityLevel;
  explanation: string;
  recommendation: string;
}

export interface CategoryResult {
  maxPoints: number;
  score: number;
  percentage: number;
  deductions: RuleDeduction[];
  recommendations: string[];
}

export interface SkillCategoryResult {
  matched: string[];
  missing: string[];
}

export interface KeywordAnalysisResult {
  matchedKeywords: string[];
  missingKeywords: string[];
  requiredSkills: SkillCategoryResult;
  preferredSkills: SkillCategoryResult;
  bonusSkills: SkillCategoryResult;
  keywordPercentage: number;
}

export interface ATSAnalysisResponse {
  overallScore: number;
  matchBenchmark: 'Excellent Match' | 'Strong Match' | 'Moderate Match' | 'Weak Match' | 'Poor Match';
  recruiterConfidence: number;
  
  categories: {
    formatting: CategoryResult;
    keywordMatch: CategoryResult;
    experience: CategoryResult;
    projects: CategoryResult;
    skills: CategoryResult;
    education: CategoryResult;
    grammar: CategoryResult;
    atsCompatibility: CategoryResult;
  };

  keywordAnalysis: KeywordAnalysisResult;
  
  resume: ParsedResume;
  aiSuggestions: AISuggestion[];
}

export interface AISuggestion {
  section: string;
  suggestion: string;
  reason: string;
}
