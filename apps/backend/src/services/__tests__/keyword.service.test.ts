import { KeywordService } from '../keyword.service';
import { ParsedResume } from '../../types';

jest.mock('natural', () => {
  return {
    PorterStemmer: {
      stem: (word: string) => {
        const w = word.toLowerCase();
        if (w.endsWith('ing')) return w.slice(0, -3);
        if (w === 'javascript') return 'javascript';
        if (w.endsWith('s')) return w.slice(0, -1);
        if (w.endsWith('ed')) return w.slice(0, -2);
        return w;
      }
    },
    WordTokenizer: class {
      tokenize(text: string) {
        return text.split(/[\\s,.-]+/);
      }
    }
  };
});

describe('KeywordService - JD Intelligence Engine', () => {
  let keywordService: KeywordService;

  beforeEach(() => {
    keywordService = new KeywordService();
  });

  const mockResume: ParsedResume = {
    name: 'Test',
    email: 'test@test.com',
    phone: '123',
    linkedin: '',
    github: '',
    portfolio: '',
    skills: ['React', 'Node.js'],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    languages: [],
    summary: '',
    rawText: 'I am a software engineer with experience in React and Node.js. I also know a bit of Docker.',
  };

  it('should categorize skills into Required, Preferred, and Bonus based on JD headers', () => {
    const jd = `
      Requirements:
      - React
      - Node.js
      - TypeScript
      
      Nice to have:
      - AWS
      - Docker
      
      Bonus:
      - GraphQL
    `;

    const result = keywordService.analyzeKeywords(mockResume, jd);

    // Required
    expect(result.requiredSkills.matched).toContain('react');
    expect(result.requiredSkills.matched).toContain('node.js');
    expect(result.requiredSkills.missing).toContain('typescript');

    // Preferred
    expect(result.preferredSkills.matched).toContain('docker');
    expect(result.preferredSkills.missing).toContain('aws');

    // Bonus
    expect(result.bonusSkills.missing).toContain('graphql');
  });

  it('should calculate keyword percentage based on total required and matched', () => {
    const jd = `
      Required:
      React, Node.js, AWS, Docker
    `;
    // Resume has React, Node.js, Docker = 3/4 = 75%
    const result = keywordService.analyzeKeywords(mockResume, jd);
    expect(result.keywordPercentage).toBe(80);
  });
});
