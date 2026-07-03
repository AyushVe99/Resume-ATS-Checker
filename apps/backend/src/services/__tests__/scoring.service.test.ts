import { ScoringService } from '../scoring.service';
import { ParsedResume } from '../../types';

describe('ScoringService', () => {
  let scoringService: ScoringService;

  beforeEach(() => {
    scoringService = new ScoringService();
  });

  const getMockResume = (overrides?: Partial<ParsedResume>): ParsedResume => ({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    linkedin: 'linkedin.com/in/johndoe',
    github: '',
    portfolio: '',
    skills: ['JavaScript'],
    experience: ['Software Engineer at Tech', 'Increased revenue by 10%'],
    education: ['B.S. CS'],
    projects: ['Built a react app'],
    certifications: [],
    languages: [],
    summary: '',
    rawText: 'John Doe\njohn@example.com\n123-456-7890\nlinkedin.com/in/johndoe\n- Built app\n- Increased revenue by 10%\n- Managed team\n- Developed features\n- Optimized code',
    ...overrides
  });

  describe('calculateScore', () => {
    it('should return a high score for a well-formatted resume', () => {
      const resume = getMockResume();
      const result = scoringService.calculateScore(resume, 100);
      
      expect(result.deductions.length).toBe(0);
      expect(result.overallScore).toBeGreaterThan(80);
    });

    it('should deduct points for missing contact info', () => {
      const resume = getMockResume({ phone: '', linkedin: '' });
      const result = scoringService.calculateScore(resume, 100);
      
      const phoneDeduction = result.deductions.find(d => d.explanation.includes('Missing phone number'));
      const linkedinDeduction = result.deductions.find(d => d.explanation.includes('No LinkedIn'));
      
      expect(phoneDeduction).toBeDefined();
      expect(linkedinDeduction).toBeDefined();
    });

    it('should deduct points for missing sections', () => {
      const resume = getMockResume({ experience: [], projects: [] });
      const result = scoringService.calculateScore(resume, 100);
      
      const expDeduction = result.deductions.find(d => d.rule === 'Experience' && d.explanation.includes('No Work Experience'));
      const projDeduction = result.deductions.find(d => d.rule === 'Projects');
      
      expect(expDeduction).toBeDefined();
      expect(projDeduction).toBeDefined();
      expect(result.categoryScores.experience).toBe(0);
    });

    it('should deduct points if no measurable achievements found in experience', () => {
      const resume = getMockResume({ 
        experience: ['I worked here and did things.'],
        rawText: '- Built app\n- Worked here'
      });
      const result = scoringService.calculateScore(resume, 100);
      
      const achievementDeduction = result.deductions.find(d => d.explanation.includes('No measurable achievements'));
      expect(achievementDeduction).toBeDefined();
    });

    it('should deduct points for formatting issues like insufficient bullets', () => {
      const resume = getMockResume({ rawText: 'Just a paragraph without any bullets.' });
      const result = scoringService.calculateScore(resume, 100);
      
      const bulletDeduction = result.deductions.find(d => d.explanation.includes('bullet points detected'));
      expect(bulletDeduction).toBeDefined();
    });
  });
});
