import { ScoringService } from '../scoring.service';
import { ParsedResume, KeywordAnalysisResult } from '../../types';

describe('ScoringService - Advanced 8-Category Engine', () => {
  let scoringService: ScoringService;

  beforeEach(() => {
    scoringService = new ScoringService();
  });

  const baseResume: ParsedResume = {
    name: 'John Doe',
    email: 'john@doe.com',
    phone: '1234567890',
    linkedin: 'linkedin.com/in/johndoe',
    github: '',
    portfolio: '',
    skills: ['React', 'Node.js', 'AWS'],
    experience: ['Software Engineer at TechCorp. I developed a new API that increased performance by 20%.'],
    education: ['B.S. Computer Science'],
    projects: ['Built a personal portfolio website with 100 users.'],
    certifications: [],
    languages: [],
    summary: '',
    rawText: 'John Doe john@doe.com 1234567890 linkedin.com/in/johndoe\nSkills: React, Node.js, AWS\nExperience: Software Engineer at TechCorp. I developed a new API that increased performance by 20%.\nProjects: Built a personal portfolio website with 100 users.\nEducation: B.S. Computer Science. - - - - -',
  };

  const baseKeywordAnalysis: KeywordAnalysisResult = {
    matchedKeywords: ['react', 'node.js'],
    missingKeywords: [],
    requiredSkills: { matched: ['react', 'node.js'], missing: [] },
    preferredSkills: { matched: [], missing: [] },
    bonusSkills: { matched: [], missing: [] },
    keywordPercentage: 100,
  };

  it('should calculate recruiter confidence independently', () => {
    const result = scoringService.calculateScore(baseResume, baseKeywordAnalysis);
    // Experience (35) + Projects w/ Metrics (20) + 0 Achievements (needs 3 for 15, has 1 for 7) + Tech (15) + Career (0) + Lead/Comm (0)
    // 35 + 20 + 7 + 15 = 77
    expect(result.recruiterConfidence).toBeGreaterThanOrEqual(70);
  });

  it('should clamp scores at 0', () => {
    const badResume: ParsedResume = {
      ...baseResume,
      email: '',
      phone: '',
      linkedin: '',
      rawText: 'No contact info at all. Paragraph paragraph.',
    };
    
    const result = scoringService.calculateScore(badResume, baseKeywordAnalysis);
    expect(result.categories.formatting.score).toBeGreaterThanOrEqual(0);
  });

  it('should identify missing JD skills and penalize accordingly', () => {
    const keywordAnalysis: KeywordAnalysisResult = {
      ...baseKeywordAnalysis,
      requiredSkills: { matched: ['react'], missing: ['node.js'] }, // missing 1 out of 2 required
      preferredSkills: { matched: [], missing: ['aws'] },
      bonusSkills: { matched: [], missing: [] },
    };

    const result = scoringService.calculateScore(baseResume, keywordAnalysis);
    // Required missing penalty: 17.5 / 2 = 8.75 points lost
    // Preferred missing penalty: 5 / 1 = 5 points lost
    // Total deductions = ~13.75 -> score = 25 - 13.75 = 11.25 -> 11
    expect(result.categories.keywordMatch.score).toBeLessThan(25);
    expect(result.categories.keywordMatch.deductions.some(d => d.rule === 'Missing Required Skill')).toBeTruthy();
  });
});
