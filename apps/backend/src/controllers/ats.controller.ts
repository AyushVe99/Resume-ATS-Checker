import { Request, Response } from 'express';
import { ParserService } from '../services/parser.service';
import { ScoringService } from '../services/scoring.service';
import { KeywordService } from '../services/keyword.service';
import { GeminiService } from '../services/gemini.service';
import { analyzeRequestSchema } from '../validators/ats.validator';

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

      res.status(200).json({
        success: true,
        data: parsedResume,
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
      const scoringResult = scoringService.calculateScore(parsedResume, keywordAnalysis.keywordPercentage);

      // AI Suggestions
      const aiSuggestions = await geminiService.getSuggestions(parsedResume);

      const response = {
        success: true,
        data: {
          overallScore: scoringResult.overallScore,
          categoryScores: scoringResult.categoryScores,
          resume: parsedResume,
          matchedKeywords: keywordAnalysis.matchedKeywords,
          missingKeywords: keywordAnalysis.missingKeywords,
          technicalSkills: keywordAnalysis.technicalSkills,
          softSkills: keywordAnalysis.softSkills,
          warnings: scoringResult.warnings || [],
          strengths: scoringResult.strengths,
          improvements: [],
          aiSuggestions,
          deductions: scoringResult.deductions,
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
