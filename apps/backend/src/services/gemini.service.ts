import { AISuggestion, ParsedResume } from '../types';
interface GoogleGenAI {
  models: {
    generateContent(params: { model: string; contents: string }): Promise<{ text?: string }>;
  };
}

export class GeminiService {
  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async fetchWithTimeoutAndRetry(ai: GoogleGenAI, prompt: string, maxRetries = 3, baseDelay = 1000, timeoutMs = 10000): Promise<string> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const requestPromise = ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Gemini API timeout')), timeoutMs);
        });

        const response = await Promise.race([requestPromise, timeoutPromise]);
        
        return (response as { text?: string }).text || '';
      } catch (error: unknown) {
        if (attempt === maxRetries) {
          throw error;
        }
        const errMessage = error instanceof Error ? error.message : 'Unknown error';
        console.warn(`Gemini API attempt ${attempt} failed: ${errMessage}. Retrying...`);
        // Exponential backoff
        await this.delay(baseDelay * Math.pow(2, attempt - 1));
      }
    }
    throw new Error('Max retries reached');
  }

  public async getSuggestions(resume: ParsedResume): Promise<AISuggestion[]> {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY not provided. Skipping AI suggestions.');
      return [];
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

    const prompt = `
      You are an expert ATS Resume Reviewer.
      Review the following resume data strictly for grammar, readability, and bullet improvements.
      Do not hallucinate. Do not change the facts.
      Provide 3-5 suggestions for improvement.
      Format the output as a valid JSON array of objects with this schema:
      [{ "section": "Experience", "suggestion": "Rewrite this bullet...", "reason": "Weak action verb" }]
      
      Resume Text:
      ${resume.rawText.substring(0, 3000)} // Limiting size to avoid token overflow
    `;

    try {
      const text = await this.fetchWithTimeoutAndRetry(ai, prompt, 3, 1000, parseInt(process.env.GEMINI_TIMEOUT_MS || '10000', 10));

      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as AISuggestion[];
      }
      return [];
    } catch (error) {
      console.error('Error generating AI suggestions or timed out. Falling back to empty suggestions.', error);
      return [];
    }
  }
}
