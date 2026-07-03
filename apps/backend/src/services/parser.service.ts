import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { ParsedResume } from '../types';

export class ParserService {
  public async parseFile(buffer: Buffer, mimetype: string): Promise<ParsedResume> {
    let rawText = '';

    if (mimetype === 'application/pdf') {
      const data = await pdfParse(buffer);
      rawText = data.text;
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value;
    } else if (mimetype === 'text/plain') {
      rawText = buffer.toString('utf-8');
    } else {
      throw new Error('Unsupported file format');
    }

    return this.extractStructuredData(rawText);
  }

  private extractStructuredData(text: string): ParsedResume {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const confidenceScores: Record<string, number> = {};

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|pub)\/[A-Za-z0-9_-]+/;
    const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[A-Za-z0-9_-]+/;
    const portfolioRegex = /(?:https?:\/\/)?(?:www\.)?(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?/i;

    const emailMatch = text.match(emailRegex);
    const phoneMatch = text.match(phoneRegex);
    const linkedinMatch = text.match(linkedinRegex);
    const githubMatch = text.match(githubRegex);
    
    let portfolioMatch = null;
    const urls = text.match(new RegExp(portfolioRegex, 'g')) || [];
    for (const url of urls) {
      const isEmailDomain = emailMatch && emailMatch[0].includes(url);
      if (!url.includes('linkedin.com') && !url.includes('github.com') && !isEmailDomain) {
        portfolioMatch = url;
        break;
      }
    }

    confidenceScores['email'] = emailMatch ? 100 : 0;
    confidenceScores['phone'] = phoneMatch ? 100 : 0;
    confidenceScores['linkedin'] = linkedinMatch ? 100 : 0;
    confidenceScores['github'] = githubMatch ? 100 : 0;

    let name = 'Unknown';
    if (lines.length > 0) {
      const nameCandidate = lines.slice(0, 5).find(l => 
        l.split(' ').length >= 2 && l.split(' ').length <= 4 && !l.match(emailRegex) && !l.match(phoneRegex)
      );
      if (nameCandidate) {
        name = nameCandidate.replace(/[^a-zA-Z\s.-]/g, '').trim();
        confidenceScores['name'] = name ? 90 : 0;
      } else {
        confidenceScores['name'] = 0;
      }
    }

    const skills = this.extractSection(lines, [/^skills$/i, /^technical skills$/i, /^core competencies$/i, /^technologies$/i, /^expertise$/i]);
    const experience = this.extractSection(lines, [/^experience$/i, /^work experience$/i, /^professional experience$/i, /^employment history$/i, /^employment$/i]);
    const education = this.extractSection(lines, [/^education$/i, /^academic background$/i, /^academic history$/i]);
    const projects = this.extractSection(lines, [/^projects$/i, /^personal projects$/i, /^academic projects$/i]);
    const certifications = this.extractSection(lines, [/^certifications$/i, /^certificates$/i, /^licenses$/i]);
    const languages = this.extractSection(lines, [/^languages$/i]);
    const summary = this.extractSection(lines, [/^summary$/i, /^professional summary$/i, /^profile$/i]);

    confidenceScores['skills'] = skills.length > 0 ? 80 : 0;
    confidenceScores['experience'] = experience.length > 0 ? 80 : 0;
    confidenceScores['education'] = education.length > 0 ? 80 : 0;

    return {
      name,
      email: emailMatch ? emailMatch[0] : '',
      phone: phoneMatch ? phoneMatch[0] : '',
      linkedin: linkedinMatch ? linkedinMatch[0] : '',
      github: githubMatch ? githubMatch[0] : '',
      portfolio: portfolioMatch || '',
      skills,
      experience,
      education,
      projects,
      certifications,
      languages,
      summary: summary.join(' '),
      rawText: text,
      confidenceScores
    };
  }

  private extractSection(lines: string[], headerRegexes: RegExp[]): string[] {
    const result: string[] = [];
    let inSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const cleanLine = line.replace(/[^a-z\s]/gi, '').trim();
      
      const isHeader = headerRegexes.some(r => r.test(line) || (line.length < 30 && r.test(cleanLine)));

      if (isHeader) {
        inSection = true;
        continue;
      }

      if (inSection) {
        const commonHeaders = /^(experience|work experience|education|skills|projects|summary|profile|certifications|languages)$/i;
        const looksLikeHeader = line.length < 35 && 
          (line === line.toUpperCase() || commonHeaders.test(cleanLine));
        
        if (looksLikeHeader && !line.includes(',') && cleanLine.split(' ').length <= 3) {
          inSection = false;
          break;
        }

        result.push(line);
      }
    }

    return result;
  }
}
