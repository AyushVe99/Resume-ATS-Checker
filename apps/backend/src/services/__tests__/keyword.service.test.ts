import { KeywordService } from '../keyword.service';
import { ParsedResume } from '../../types';

jest.mock('natural', () => {
  return {
    PorterStemmer: {
      stem: (word: string) => {
        const w = word.toLowerCase();
        if (w.endsWith('ing')) return w.slice(0, -3);
        if (w === 'javascript') return 'javascript'; // Special case so "JavaScript" works
        if (w.endsWith('s')) return w.slice(0, -1);
        if (w.endsWith('ed')) return w.slice(0, -2);
        return w;
      }
    },
    WordTokenizer: class {
      tokenize(text: string) {
        return text.split(/[\s,.-]+/);
      }
    }
  };
});

describe('KeywordService', () => {
  let keywordService: KeywordService;

  beforeEach(() => {
    keywordService = new KeywordService();
  });

  const getMockResume = (text: string): ParsedResume => ({
    name: 'Test',
    email: 'test@test.com',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    languages: [],
    summary: '',
    rawText: text
  });

  describe('analyzeKeywords', () => {
    it('should match technical skills using synonyms and stemming', () => {
      const resume = getMockResume('I develop in React.js and TS.');
      const jd = 'Looking for a developer with ReactJS and TypeScript experience.';
      
      const result = keywordService.analyzeKeywords(resume, jd);
      
      expect(result.technicalSkills.matched).toContain('react');
      expect(result.technicalSkills.matched).toContain('typescript');
    });

    it('should correctly categorize soft skills', () => {
      const resume = getMockResume('I mentored junior developers and have great communication.');
      const jd = 'Require leadership and communication skills.';
      
      const result = keywordService.analyzeKeywords(resume, jd);
      
      expect(result.softSkills.matched).toContain('leadership');
      expect(result.softSkills.matched).toContain('communication');
    });

    it('should correctly identify missing skills', () => {
      const resume = getMockResume('I know HTML and CSS.');
      const jd = 'Need experience in AWS and Python.';
      
      const result = keywordService.analyzeKeywords(resume, jd);
      
      expect(result.technicalSkills.missing).toContain('aws');
      expect(result.technicalSkills.missing).toContain('python');
    });

    it('should calculate keyword match percentage properly', () => {
      const resume = getMockResume('React Node HTML');
      const jd = 'React Node AWS Python';
      
      const result = keywordService.analyzeKeywords(resume, jd);
      
      expect(result.keywordPercentage).toBe(50);
    });
  });
});
