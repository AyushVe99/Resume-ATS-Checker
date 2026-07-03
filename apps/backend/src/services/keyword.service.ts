import { ParsedResume } from '../types';
import natural from 'natural';

export class KeywordService {
  private tokenizer: natural.WordTokenizer;

  private technicalDictionary: Record<string, string[]> = {
    'javascript': ['js', 'javascript', 'ecmascript'],
    'typescript': ['ts', 'typescript'],
    'react': ['react', 'reactjs', 'react.js'],
    'node': ['node', 'nodejs', 'node.js'],
    'aws': ['aws', 'amazon web services'],
    'python': ['python', 'py'],
    'java': ['java'],
    'docker': ['docker', 'containerization'],
    'sql': ['sql', 'mysql', 'postgresql', 'postgres'],
    'nosql': ['nosql', 'mongodb', 'mongo'],
    'html': ['html', 'html5'],
    'css': ['css', 'css3', 'tailwind', 'sass', 'scss'],
    'git': ['git', 'github', 'gitlab', 'bitbucket'],
    'agile': ['agile', 'scrum', 'kanban']
  };

  private softDictionary: Record<string, string[]> = {
    'leadership': ['lead', 'leadership', 'manager', 'manage', 'mentored', 'mentor'],
    'communication': ['communication', 'communicate', 'presentation', 'present'],
    'problem solving': ['problem solving', 'troubleshoot', 'analytical'],
    'teamwork': ['team', 'collaborate', 'collaboration', 'teamwork'],
    'time management': ['time management', 'organize', 'punctual']
  };

  constructor() {
    this.tokenizer = new natural.WordTokenizer();
  }

  public analyzeKeywords(resume: ParsedResume, jobDescription: string) {
    const jdTokens = this.tokenizeAndStem(jobDescription);
    const resumeTokens = this.tokenizeAndStem(resume.rawText);

    const matchedTechnical: Set<string> = new Set();
    const missingTechnical: Set<string> = new Set();
    const matchedSoft: Set<string> = new Set();
    const missingSoft: Set<string> = new Set();

    const requiredTech = this.extractRequiredSkills(jobDescription, this.technicalDictionary);
    const requiredSoft = this.extractRequiredSkills(jobDescription, this.softDictionary);
    const genericJdKeywords = this.extractGenericKeywords(jobDescription);
    
    const checkSkills = (required: string[], dictionary: Record<string, string[]>, matchedSet: Set<string>, missingSet: Set<string>) => {
      required.forEach(skillKey => {
        const aliases = dictionary[skillKey] || [skillKey];
        const stemmedAliases = aliases.map(a => natural.PorterStemmer.stem(a.toLowerCase()));
        
        const hasMatch = stemmedAliases.some(alias => resumeTokens.includes(alias));
        if (hasMatch) {
          matchedSet.add(skillKey);
        } else {
          missingSet.add(skillKey);
        }
      });
    };

    checkSkills(requiredTech, this.technicalDictionary, matchedTechnical, missingTechnical);
    checkSkills(requiredSoft, this.softDictionary, matchedSoft, missingSoft);

    genericJdKeywords.forEach(kw => {
      if (matchedTechnical.has(kw) || missingTechnical.has(kw) || matchedSoft.has(kw) || missingSoft.has(kw)) return;

      const stemmed = natural.PorterStemmer.stem(kw.toLowerCase());
      if (resumeTokens.includes(stemmed)) {
        matchedTechnical.add(kw);
      } else {
        missingTechnical.add(kw);
      }
    });

    const totalRequired = matchedTechnical.size + missingTechnical.size + matchedSoft.size + missingSoft.size;
    const totalMatched = matchedTechnical.size + matchedSoft.size;

    const keywordPercentage = totalRequired > 0 
      ? Math.round((totalMatched / totalRequired) * 100) 
      : 0;

    return {
      matchedKeywords: [...matchedTechnical, ...matchedSoft],
      missingKeywords: [...missingTechnical, ...missingSoft],
      keywordPercentage,
      technicalSkills: {
        matched: Array.from(matchedTechnical),
        missing: Array.from(missingTechnical)
      },
      softSkills: {
        matched: Array.from(matchedSoft),
        missing: Array.from(missingSoft)
      }
    };
  }

  private tokenizeAndStem(text: string): string[] {
    const tokens = this.tokenizer.tokenize(text.toLowerCase()) || [];
    return tokens.map(token => natural.PorterStemmer.stem(token));
  }

  private extractRequiredSkills(text: string, dictionary: Record<string, string[]>): string[] {
    const required: string[] = [];
    const lowerText = text.toLowerCase();
    
    for (const [key, aliases] of Object.entries(dictionary)) {
      for (const alias of aliases) {
        const regex = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\b`, 'i');
        if (regex.test(lowerText)) {
          required.push(key);
          break;
        }
      }
    }
    return required;
  }

  private extractGenericKeywords(text: string): string[] {
    const tokens = text.split(/\\s+/);
    const generic: Set<string> = new Set();
    
    tokens.forEach(token => {
      const clean = token.replace(/[^a-zA-Z]/g, '');
      if (clean.length > 4 && (clean === clean.toUpperCase() || /^[A-Z][a-z]+$/.test(clean))) {
        generic.add(clean.toLowerCase());
      }
    });
    
    return Array.from(generic);
  }
}
