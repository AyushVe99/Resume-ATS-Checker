import { Request, Response } from 'express';
import { ParserService } from '../services/parser.service';
import { ScoringService } from '../services/scoring.service';
import { KeywordService } from '../services/keyword.service';
import { GeminiService } from '../services/gemini.service';
import { analyzeRequestSchema } from '../validators/ats.validator';
import { prisma } from '../lib/prisma';

const parserService = new ParserService();
const scoringService = new ScoringService();
const keywordService = new KeywordService();
const geminiService = new GeminiService();

export class AtsController {
  public uploadResume = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }

      const { buffer, mimetype } = req.file;
      const parsedResume = await parserService.parseFile(buffer, mimetype);

      // Fetch or create a dummy user since there's no auth yet
      let user = await prisma.user.findFirst();
      if (!user) {
        user = await prisma.user.create({
          data: { email: 'test@example.com', name: 'Test User' }
        });
      }

      const savedResume = await prisma.resume.create({
        data: {
          userId: user.id,
          content: parsedResume.rawText,
        }
      });

      res.status(200).json({
        success: true,
        data: {
          ...parsedResume,
          resumeId: savedResume.id
        },
      });
    } catch (error: unknown) {
      console.error('Upload Error:', error);
      res.status(500).json({ success: false, message: 'Failed to process resume', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  public analyzeResume = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate request body
      const validatedData = analyzeRequestSchema.parse(req.body);
      const { jobDescription } = validatedData;
      
      // In a real scenario with no DB, the frontend would send back the parsed resume,
      // but to strictly follow the prompt "analyze them against a pasted job description",
      // we assume the frontend sends the parsedResume as part of the request.
      const parsedResume = req.body.parsedResume;

      if (!parsedResume) {
        res.status(400).json({ success: false, message: 'Parsed resume data is required' });
        return;
      }

      // Keyword Analysis
      const keywordAnalysis = keywordService.analyzeKeywords(parsedResume, jobDescription);

      // Deterministic Scoring
      const scoringResult = scoringService.calculateScore(parsedResume, keywordAnalysis);

      // AI Suggestions
      const aiSuggestions = await geminiService.getSuggestions(parsedResume);

      const response = {
        success: true,
        data: {
          overallScore: scoringResult.overallScore,
          matchBenchmark: scoringResult.matchBenchmark,
          recruiterConfidence: scoringResult.recruiterConfidence,
          categories: scoringResult.categories,
          keywordAnalysis,
          resume: parsedResume,
          aiSuggestions,
        }
      };

      res.status(200).json(response);
    } catch (error: unknown) {
      console.error('Analyze Error:', error);
      const errorMessage = error && typeof error === 'object' && 'errors' in error ? (error as { errors: unknown }).errors : (error instanceof Error ? error.message : 'Unknown error');
      res.status(400).json({ success: false, message: 'Failed to analyze resume', error: errorMessage });
    }
  };
}
