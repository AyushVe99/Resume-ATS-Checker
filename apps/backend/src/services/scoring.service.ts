import { ParsedResume, RuleDeduction } from '../types';

export class ScoringService {
  public calculateScore(resume: ParsedResume, keywordPercentage: number) {
    let formattingScore = 20;
    let keywordScore = Math.min(25, Math.round((keywordPercentage / 100) * 25));
    let experienceScore = 15;
    let projectScore = 10;
    let skillScore = 10;
    let educationScore = 5;
    let grammarScore = 5;
    let atsCompatibilityScore = 10;

    const deductions: RuleDeduction[] = [];
    const strengths: string[] = [];

    const lines = resume.rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const words = resume.rawText.toLowerCase().split(/\s+/);

    // 1. Formatting & Length
    const estimatedPages = lines.length > 0 ? Math.ceil(lines.length / 50) : 0;
    if (estimatedPages > 2) {
      formattingScore -= 2;
      deductions.push({
        rule: 'Formatting',
        explanation: `Resume estimated at ${estimatedPages} pages. ATS systems and recruiters prefer 1-2 pages maximum.`,
        recommendation: 'Condense older experience and remove redundant bullet points to fit on 1 or 2 pages.'
      });
    }

    if (!resume.phone) {
      formattingScore -= 3;
      deductions.push({
        rule: 'Contact Info',
        explanation: 'Missing phone number.',
        recommendation: 'Always include a valid phone number at the top of your resume.'
      });
    }

    if (!resume.email) {
      formattingScore -= 3;
      deductions.push({
        rule: 'Contact Info',
        explanation: 'Missing email address.',
        recommendation: 'Include a professional email address.'
      });
    }

    if (!resume.linkedin) {
      formattingScore -= 2;
      deductions.push({
        rule: 'Contact Info',
        explanation: 'No LinkedIn profile URL detected.',
        recommendation: 'Include a link to your updated LinkedIn profile.'
      });
    }

    const bulletCount = (resume.rawText.match(/[-•*]/g) || []).length;
    if (bulletCount < 5) {
      formattingScore -= 3;
      deductions.push({
        rule: 'Formatting',
        explanation: `Only ${bulletCount} bullet points detected. Resumes should use bulleted lists rather than paragraphs.`,
        recommendation: 'Convert large blocks of text in your experience section into concise bullet points.'
      });
    }

    // 2. Experience & Achievements
    if (resume.experience.length === 0) {
      experienceScore -= 15;
      deductions.push({
        rule: 'Experience',
        explanation: 'No Work Experience section detected.',
        recommendation: 'Add a distinct "Experience" section detailing your past roles.'
      });
    } else {
      const expText = resume.experience.join(' ');
      const measurableAchievements = (expText.match(/\d+%|\$\d+|\d+x/g) || []).length;
      if (measurableAchievements === 0) {
        experienceScore -= 5;
        deductions.push({
          rule: 'Experience',
          explanation: 'No measurable achievements (%, $, multipliers) found in experience.',
          recommendation: 'Quantify your impact (e.g., "Increased revenue by 15%", "Led team of 5").'
        });
      } else {
        strengths.push(`Found ${measurableAchievements} quantified achievements.`);
      }
    }

    // 3. Projects
    if (resume.projects.length === 0) {
      projectScore -= 5;
      deductions.push({
        rule: 'Projects',
        explanation: 'No Projects section found.',
        recommendation: 'For technical roles, listing personal or academic projects is highly recommended.'
      });
    }

    // 4. Skills & Education
    if (resume.skills.length === 0) {
      skillScore -= 10;
      deductions.push({
        rule: 'Skills',
        explanation: 'No dedicated Skills section found.',
        recommendation: 'Add a "Technical Skills" section for ATS parsers to easily extract your stack.'
      });
    }
    if (resume.education.length === 0) {
      educationScore -= 5;
      deductions.push({
        rule: 'Education',
        explanation: 'No Education section found.',
        recommendation: 'Include your academic background or relevant certifications.'
      });
    }

    // 5. Grammar & Language
    const actionVerbs = ['developed', 'led', 'managed', 'created', 'designed', 'built', 'improved', 'increased', 'engineered', 'architected', 'optimized'];
    const usedVerbs = actionVerbs.filter(verb => words.includes(verb));
    if (usedVerbs.length < 3) {
      grammarScore -= 3;
      deductions.push({
        rule: 'Grammar',
        explanation: `Only ${usedVerbs.length} strong action verbs found.`,
        recommendation: 'Start your bullet points with strong action verbs (e.g., Developed, Optimized, Led).'
      });
    } else {
      strengths.push('Good use of action verbs.');
    }

    // 6. ATS Compatibility (Formatting issues)
    const hasMultipleConsecutiveSpaces = (resume.rawText.match(/ {5,}/g) || []).length;
    if (hasMultipleConsecutiveSpaces > 10) {
      atsCompatibilityScore -= 5;
      deductions.push({
        rule: 'ATS Compatibility',
        explanation: 'Detected heavy whitespace or multi-column layout.',
        recommendation: 'Ensure your resume uses a standard single-column layout without complex invisible tables. ATS systems parse top-to-bottom.'
      });
    }

    formattingScore = Math.max(0, formattingScore);
    atsCompatibilityScore = Math.max(0, atsCompatibilityScore);
    experienceScore = Math.max(0, experienceScore);
    projectScore = Math.max(0, projectScore);
    skillScore = Math.max(0, skillScore);
    educationScore = Math.max(0, educationScore);
    grammarScore = Math.max(0, grammarScore);

    const overallScore = formattingScore + keywordScore + experienceScore + projectScore + skillScore + educationScore + grammarScore + atsCompatibilityScore;

    return {
      overallScore,
      categoryScores: {
        formatting: formattingScore,
        keywordMatch: keywordScore,
        experience: experienceScore,
        projects: projectScore,
        skills: skillScore,
        education: educationScore,
        grammar: grammarScore,
        atsCompatibility: atsCompatibilityScore,
      },
      deductions,
      strengths,
      warnings: [] // Kept for backward compatibility if needed by frontend
    };
  }
}
