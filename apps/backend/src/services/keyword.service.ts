import { ParsedResume, KeywordAnalysisResult, SkillCategoryResult } from '../types';
import natural from 'natural';

export class KeywordService {
  private tokenizer: natural.WordTokenizer;

  private dictionary: Record<string, string[]> = {
    'javascript': ['js', 'javascript', 'ecmascript'],
    'typescript': ['ts', 'typescript'],
    'react': ['react', 'reactjs', 'react.js'],
    'node.js': ['node', 'nodejs', 'node.js'],
    'next.js': ['next', 'nextjs', 'next.js'],
    'aws': ['aws', 'amazon web services', 'ec2', 's3'],
    'python': ['python', 'py'],
    'java': ['java'],
    'docker': ['docker', 'containerization'],
    'kubernetes': ['kubernetes', 'k8s'],
    'postgresql': ['postgresql', 'postgres'],
    'mysql': ['mysql'],
    'mongodb': ['mongodb', 'mongo'],
    'redis': ['redis'],
    'graphql': ['graphql', 'gql'],
    'kafka': ['kafka'],
    'cloudwatch': ['cloudwatch'],
    'rds': ['rds'],
    'html': ['html', 'html5'],
    'css': ['css', 'css3', 'tailwind', 'sass', 'scss'],
    'git': ['git', 'github', 'gitlab', 'bitbucket'],
    'agile': ['agile', 'scrum', 'kanban'],
    'rest': ['rest', 'restful', 'api'],
    'leadership': ['lead', 'leadership', 'manager', 'manage', 'mentored', 'mentor'],
    'communication': ['communication', 'communicate', 'presentation', 'present'],
    'problem solving': ['problem solving', 'troubleshoot', 'analytical'],
    'teamwork': ['team', 'collaborate', 'collaboration', 'teamwork'],
  };

  constructor() {
    this.tokenizer = new natural.WordTokenizer();
  }

  public analyzeKeywords(resume: ParsedResume, jobDescription: string): KeywordAnalysisResult {
    const resumeTokens = this.tokenizeAndStem(resume.rawText);
    
    const requiredSkillsSet = new Set<string>();
    const preferredSkillsSet = new Set<string>();
    const bonusSkillsSet = new Set<string>();
    
    let currentMode: 'required' | 'preferred' | 'bonus' = 'required';
    
    const lines = jobDescription.split('\n').map(l => l.trim().toLowerCase());
    
    for (const line of lines) {
      if (/(requirements|qualifications|must have|required)/i.test(line)) {
        currentMode = 'required';
      } else if (/(preferred|nice to have|plus|bonus)/i.test(line)) {
        currentMode = /bonus/i.test(line) ? 'bonus' : 'preferred';
      }
      
      for (const [key, aliases] of Object.entries(this.dictionary)) {
        for (const alias of aliases) {
          const regex = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\b`, 'i');
          if (regex.test(line)) {
            if (currentMode === 'required') requiredSkillsSet.add(key);
            else if (currentMode === 'preferred') preferredSkillsSet.add(key);
            else bonusSkillsSet.add(key);
            break;
          }
        }
      }
    }

    preferredSkillsSet.forEach(s => { if (requiredSkillsSet.has(s)) preferredSkillsSet.delete(s); });
    bonusSkillsSet.forEach(s => { if (requiredSkillsSet.has(s) || preferredSkillsSet.has(s)) bonusSkillsSet.delete(s); });

    if (requiredSkillsSet.size === 0) {
      const generic = this.extractGenericKeywords(jobDescription);
      generic.forEach(g => requiredSkillsSet.add(g));
    }

    const checkMatch = (skills: Set<string>): SkillCategoryResult => {
      const matched: string[] = [];
      const missing: string[] = [];
      skills.forEach(skillKey => {
        const aliases = this.dictionary[skillKey] || [skillKey];
        const stemmedAliases = aliases.map(a => natural.PorterStemmer.stem(a.toLowerCase()));
        
        const hasMatch = stemmedAliases.some(alias => resumeTokens.includes(alias)) || 
                         resume.rawText.toLowerCase().includes(skillKey.toLowerCase());
        
        if (hasMatch) {
          matched.push(skillKey);
        } else {
          missing.push(skillKey);
        }
      });
      return { matched, missing };
    };

    const requiredSkills = checkMatch(requiredSkillsSet);
    const preferredSkills = checkMatch(preferredSkillsSet);
    const bonusSkills = checkMatch(bonusSkillsSet);

    const matchedKeywords = [...requiredSkills.matched, ...preferredSkills.matched, ...bonusSkills.matched];
    const missingKeywords = [...requiredSkills.missing, ...preferredSkills.missing, ...bonusSkills.missing];

    const totalRequired = matchedKeywords.length + missingKeywords.length;
    const keywordPercentage = totalRequired > 0 ? Math.round((matchedKeywords.length / totalRequired) * 100) : 0;

    return {
      matchedKeywords,
      missingKeywords,
      requiredSkills,
      preferredSkills,
      bonusSkills,
      keywordPercentage
    };
  }

  private tokenizeAndStem(text: string): string[] {
    const tokens = this.tokenizer.tokenize(text.toLowerCase()) || [];
    return tokens.map(token => natural.PorterStemmer.stem(token));
  }

  private extractGenericKeywords(text: string): string[] {
    const tokens = text.split(/\s+/);
    const generic = new Set<string>();
    tokens.forEach(token => {
      const clean = token.replace(/[^a-zA-Z]/g, '');
      if (clean.length > 4 && (clean === clean.toUpperCase() || /^[A-Z][a-z]+$/.test(clean))) {
        generic.add(clean.toLowerCase());
      }
    });
    return Array.from(generic);
  }
}
