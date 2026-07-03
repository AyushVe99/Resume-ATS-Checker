import { ParserService } from '../parser.service';

jest.mock('pdf-parse', () => jest.fn().mockResolvedValue({ text: 'Mock PDF Text' }));
jest.mock('mammoth', () => ({
  extractRawText: jest.fn().mockResolvedValue({ value: 'Mock DOCX Text' })
}));

describe('ParserService', () => {
  let parserService: ParserService;

  beforeEach(() => {
    parserService = new ParserService();
  });

  describe('parseFile', () => {
    it('should throw an error for unsupported file types', async () => {
      await expect(
        parserService.parseFile(Buffer.from('test'), 'image/jpeg')
      ).rejects.toThrow('Unsupported file format');
    });

    it('should successfully parse a text file', async () => {
      const buffer = Buffer.from('John Doe\njohn@example.com\n555-123-4567\n\nExperience\nSoftware Engineer');
      const result = await parserService.parseFile(buffer, 'text/plain');
      
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
      expect(result.phone).toBe('555-123-4567');
      expect(result.experience.length).toBeGreaterThan(0);
    });
  });

  describe('Section Extraction & NLP Heuristics', () => {
    it('should accurately extract sections and handle different header cases', async () => {
      const resumeText = `
Jane Smith
jane.smith@email.com
linkedin.com/in/janesmith

PROFESSIONAL EXPERIENCE
Senior Developer
- Built a scalable app

TECHNICAL SKILLS
JavaScript, React, Node.js

EDUCATION
B.S. Computer Science
      `.trim();

      const result = await parserService.parseFile(Buffer.from(resumeText), 'text/plain');

      expect(result.email).toBe('jane.smith@email.com');
      expect(result.linkedin).toContain('linkedin.com/in/janesmith');
      expect(result.experience).toContain('Senior Developer');
      expect(result.skills).toContain('JavaScript, React, Node.js');
      expect(result.education).toContain('B.S. Computer Science');
      expect(result.confidenceScores?.['email']).toBe(100);
    });

    it('should stop extracting a section when a new header is encountered', async () => {
      const resumeText = `
Experience
Job 1
Job 2
Education
Degree 1
      `.trim();
      const result = await parserService.parseFile(Buffer.from(resumeText), 'text/plain');

      expect(result.experience).not.toContain('Degree 1');
      expect(result.education).toContain('Degree 1');
    });

    it('should extract portfolio URLs safely', async () => {
      const resumeText = `
Name
test@test.com
github.com/user
my-personal-website.com/portfolio
      `.trim();
      const result = await parserService.parseFile(Buffer.from(resumeText), 'text/plain');
      expect(result.portfolio).toBe('my-personal-website.com/portfolio');
    });
  });
});
