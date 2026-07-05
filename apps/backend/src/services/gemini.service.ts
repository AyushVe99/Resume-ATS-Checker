import { AISuggestion, ParsedResume } from '../types';
interface GoogleGenAI {
  models: {
    generateContent(params: { model: string; contents: string }): Promise<{ text?: string }>;
  };
}

export class GeminiService {
  private apiKeys: string[] = [];

  constructor() {
    this.apiKeys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
    ].filter(Boolean) as string[];
  }

  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async getAIInstance(apiKey: string): Promise<GoogleGenAI> {
    const { GoogleGenAI } = await import('@google/genai');
    return new GoogleGenAI({ apiKey });
  }

  private async fetchWithTimeoutAndRetry(prompt: string, maxRetries = 3, baseDelay = 1000, timeoutMs = 10000): Promise<string> {
    if (this.apiKeys.length === 0) {
      console.warn('No GEMINI_API_KEYs provided. Skipping AI.');
      return '';
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const apiKey = this.apiKeys[(attempt - 1) % this.apiKeys.length];
        const ai = await this.getAIInstance(apiKey);

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
        console.warn(`Gemini API attempt ${attempt} failed: ${errMessage}. Retrying with next key...`);
        await this.delay(baseDelay * Math.pow(2, attempt - 1));
      }
    }
    throw new Error('Max retries reached');
  }

  public async getSuggestions(resume: ParsedResume): Promise<AISuggestion[]> {
    const prompt = `
      You are an expert ATS Resume Reviewer.
      Review the following resume data strictly for grammar, readability, and bullet improvements.
      Provide 3-5 suggestions for improvement.
      Format the output as a valid JSON array of objects with this schema:
      [{ "section": "Experience", "suggestion": "Rewrite this bullet...", "reason": "Weak action verb" }]
      
      Resume Text:
      ${resume.rawText.substring(0, 3000)}
    `;

    try {
      const text = await this.fetchWithTimeoutAndRetry(prompt, 3, 1000, 15000);
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]) as AISuggestion[];
      return [];
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      return [];
    }
  }

  public async inferEngineeringIdentity(resumeContent: string): Promise<any> {
    const prompt = `
      You are a Principal Engineering Manager. Analyze this resume text and extract the engineer's technical identity.
      Do not hallucinate. All evidence must be exact substrings found in the resume.
      Output ONLY valid JSON matching this schema:
      {
        "archetype": "string (e.g. Product-Minded Full Stack, Infrastructure Specialist)",
        "level": "string (e.g. Junior, Mid-Level, Senior, Staff)",
        "coreDomains": ["string", "string"],
        "evidenceNodes": [
          { "domain": "string", "skill": "string", "snippet": "EXACT substring from resume proving this skill" }
        ],
        "projects": [
          { "name": "string", "impact": 85, "complexity": 90, "domain": "string" }
        ],
        "timeline": [
          { "year": "string", "role": "string", "company": "string", "achievement": "string", "domain": "string" }
        ]
      }
      Limit to top 10 most important evidence nodes, top 5 projects, and top 5 timeline events.
      Resume Text:
      ${resumeContent.substring(0, 5000)}
    `;

    const text = await this.fetchWithTimeoutAndRetry(prompt, 3, 1000, 20000);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Failed to parse identity JSON");
    return JSON.parse(jsonMatch[0]);
  }

  public async inferSkillGaps(resumeContent: string, targetRole: string): Promise<any> {
    const prompt = `
      You are a Staff Engineer mentoring someone. Compare their resume to the target role: "${targetRole}".
      Identify critical technical skill gaps and generate a learning roadmap.
      Output ONLY valid JSON matching this exact schema:
      {
        "riskMap": [
          { "skill": "string", "required": true, "proficiency": 80, "risk": "Low" | "Medium" | "High" }
        ],
        "treeNodes": [
          { "id": "1", "label": "Current Level", "type": "current" },
          { "id": "2", "label": "Learn X", "type": "gap" },
          { "id": "3", "label": "Target Role", "type": "target" }
        ],
        "treeEdges": [
          { "source": "1", "target": "2" },
          { "source": "2", "target": "3" }
        ]
      }
      Resume Text:
      ${resumeContent.substring(0, 5000)}
    `;

    const text = await this.fetchWithTimeoutAndRetry(prompt, 3, 1000, 20000);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Failed to parse skill gap JSON");
    return JSON.parse(jsonMatch[0]);
  }
}
