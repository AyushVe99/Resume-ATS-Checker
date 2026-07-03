import { ParsedResume, KeywordAnalysisResult, RuleDeduction, CategoryResult, ATSAnalysisResponse } from '../types';

export class ScoringService {
  public calculateScore(resume: ParsedResume, keywordAnalysis: KeywordAnalysisResult): Omit<ATSAnalysisResponse, 'resume' | 'aiSuggestions' | 'keywordAnalysis'> {
    const MAX = {
      formatting: 20,
      keywordMatch: 25,
      experience: 15,
      projects: 10,
      skills: 10,
      education: 5,
      grammar: 5,
      atsCompatibility: 10
    };

    const categories = {
      formatting: this.createEmptyCategory(MAX.formatting),
      keywordMatch: this.createEmptyCategory(MAX.keywordMatch),
      experience: this.createEmptyCategory(MAX.experience),
      projects: this.createEmptyCategory(MAX.projects),
      skills: this.createEmptyCategory(MAX.skills),
      education: this.createEmptyCategory(MAX.education),
      grammar: this.createEmptyCategory(MAX.grammar),
      atsCompatibility: this.createEmptyCategory(MAX.atsCompatibility),
    };

    const lines = resume.rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const words = resume.rawText.toLowerCase().split(/\\s+/);

    // 1. Formatting
    const estimatedPages = lines.length > 0 ? Math.ceil(lines.length / 50) : 0;
    if (estimatedPages > 2) {
      this.addDeduction(categories.formatting, {
        rule: 'Formatting', item: 'Length', points: 3, severity: 'Major',
        explanation: `Resume estimated at ${estimatedPages} pages. ATS systems and recruiters prefer 1-2 pages.`,
        recommendation: 'Condense older experience to fit on 1 or 2 pages.'
      });
    }

    if (!resume.phone) {
      this.addDeduction(categories.formatting, {
        rule: 'Contact Info', item: 'Phone', points: 3, severity: 'Critical',
        explanation: 'Missing phone number.', recommendation: 'Always include a valid phone number.'
      });
    }

    if (!resume.email) {
      this.addDeduction(categories.formatting, {
        rule: 'Contact Info', item: 'Email', points: 3, severity: 'Critical',
        explanation: 'Missing email address.', recommendation: 'Include a professional email address.'
      });
    }

    if (!resume.linkedin) {
      this.addDeduction(categories.formatting, {
        rule: 'Contact Info', item: 'LinkedIn', points: 2, severity: 'Minor',
        explanation: 'No LinkedIn profile URL detected.', recommendation: 'Include a link to your updated LinkedIn profile.'
      });
    }

    const bulletCount = (resume.rawText.match(/[-•*]/g) || []).length;
    if (bulletCount < 5) {
      this.addDeduction(categories.formatting, {
        rule: 'Formatting', item: 'Bullets', points: 4, severity: 'Major',
        explanation: `Only ${bulletCount} bullet points detected.`, recommendation: 'Use bulleted lists rather than paragraphs.'
      });
    }

    // 2. Keyword Match
    const { requiredSkills, preferredSkills, bonusSkills } = keywordAnalysis;
    
    if (requiredSkills.missing.length > 0) {
      const totalReq = requiredSkills.matched.length + requiredSkills.missing.length;
      const penaltyPerReq = 17.5 / totalReq;
      requiredSkills.missing.forEach(miss => {
        this.addDeduction(categories.keywordMatch, {
          rule: 'Missing Required Skill', item: miss, points: penaltyPerReq, severity: 'Critical',
          explanation: `${miss} is listed as a required skill in the JD.`, recommendation: `Add ${miss} experience if applicable.`
        });
      });
    }

    if (preferredSkills.missing.length > 0) {
      const totalPref = preferredSkills.matched.length + preferredSkills.missing.length;
      const penaltyPerPref = 5 / totalPref;
      preferredSkills.missing.forEach(miss => {
        this.addDeduction(categories.keywordMatch, {
          rule: 'Missing Preferred Skill', item: miss, points: penaltyPerPref, severity: 'Major',
          explanation: `${miss} is listed as a preferred skill.`, recommendation: `Add ${miss} if you have experience with it.`
        });
      });
    }

    if (bonusSkills.missing.length > 0) {
      const totalBon = bonusSkills.matched.length + bonusSkills.missing.length;
      const penaltyPerBon = 2.5 / totalBon;
      bonusSkills.missing.forEach(miss => {
        this.addDeduction(categories.keywordMatch, {
          rule: 'Missing Bonus Skill', item: miss, points: penaltyPerBon, severity: 'Minor',
          explanation: `${miss} is listed as a nice-to-have.`, recommendation: `Include ${miss} if possible to stand out.`
        });
      });
    }

    // 3. Experience
    let achievementsCount = 0;
    if (resume.experience.length === 0) {
      this.addDeduction(categories.experience, {
        rule: 'Experience Section', item: 'Missing Section', points: 15, severity: 'Critical',
        explanation: 'No Work Experience section detected.', recommendation: 'Add an Experience section.'
      });
    } else {
      const expText = resume.experience.join(' ').toLowerCase();
      achievementsCount = (expText.match(/\d+%|\$\d+|\d+x/g) || []).length;
      if (achievementsCount === 0) {
        this.addDeduction(categories.experience, {
          rule: 'Achievements', item: 'Metrics', points: 8, severity: 'Major',
          explanation: 'No measurable achievements (%, $, multipliers) found.', recommendation: 'Quantify your impact.'
        });
      } else if (achievementsCount < 3) {
        this.addDeduction(categories.experience, {
          rule: 'Achievements', item: 'Metrics', points: 4, severity: 'Minor',
          explanation: 'Few measurable achievements found.', recommendation: 'Try to add more metrics (%, $) to your bullets.'
        });
      }

      if (expText.includes('responsible for') || expText.includes('duties included')) {
        this.addDeduction(categories.experience, {
          rule: 'Passive Language', item: 'Wording', points: 3, severity: 'Minor',
          explanation: 'Used passive phrases like "responsible for".', recommendation: 'Start bullets with strong action verbs.'
        });
      }
    }

    // 4. Projects
    let projMetricsCount = 0;
    if (resume.projects.length === 0) {
      this.addDeduction(categories.projects, {
        rule: 'Projects Section', item: 'Missing Section', points: 10, severity: 'Major',
        explanation: 'No Projects section found.', recommendation: 'List technical projects.'
      });
    } else {
      const projText = resume.projects.join(' ').toLowerCase();
      projMetricsCount = (projText.match(/\d+%|\d+ users/g) || []).length;
      if (projMetricsCount === 0) {
        this.addDeduction(categories.projects, {
          rule: 'Project Metrics', item: 'Impact', points: 5, severity: 'Minor',
          explanation: 'No metrics found in project descriptions.', recommendation: 'Add scale or performance metrics to projects.'
        });
      }
    }

    // 5. Skills
    if (resume.skills.length === 0) {
      this.addDeduction(categories.skills, {
        rule: 'Skills Section', item: 'Missing Section', points: 10, severity: 'Critical',
        explanation: 'No dedicated Skills section found.', recommendation: 'Add a "Technical Skills" section.'
      });
    } else {
      const skillsText = resume.skills.join(' ').toLowerCase();
      const skillsList = skillsText.split(/[,|]/).map(s => s.trim()).filter(s => s.length > 0);
      const uniqueSkills = new Set(skillsList);
      
      if (skillsList.length > 0 && uniqueSkills.size < skillsList.length) {
        this.addDeduction(categories.skills, {
          rule: 'Skill Stuffing', item: 'Duplicates', points: 3, severity: 'Minor',
          explanation: 'Detected duplicate skills in the skills section.', recommendation: 'Remove redundant skill listings.'
        });
      }
    }

    // 6. Education
    if (resume.education.length === 0) {
      this.addDeduction(categories.education, {
        rule: 'Education Section', item: 'Missing Section', points: 5, severity: 'Major',
        explanation: 'No Education section found.', recommendation: 'Include your academic background.'
      });
    }

    // 7. Grammar
    const actionVerbs = ['developed', 'led', 'managed', 'created', 'designed', 'built', 'improved', 'increased', 'optimized'];
    const usedVerbs = actionVerbs.filter(verb => words.includes(verb));
    if (usedVerbs.length < 3) {
      this.addDeduction(categories.grammar, {
        rule: 'Grammar & Tone', item: 'Action Verbs', points: 3, severity: 'Major',
        explanation: `Only ${usedVerbs.length} strong action verbs found.`, recommendation: 'Use strong action verbs.'
      });
    }
    const hasRepeatedPunctuation = (resume.rawText.match(/[!.?]{2,}/g) || []).length;
    if (hasRepeatedPunctuation > 0) {
      this.addDeduction(categories.grammar, {
        rule: 'Punctuation', item: 'Repeated', points: 2, severity: 'Minor',
        explanation: 'Found repeated punctuation (e.g., !! or ..).', recommendation: 'Ensure professional punctuation.'
      });
    }

    // 8. ATS Compatibility
    const hasMultipleConsecutiveSpaces = (resume.rawText.match(/ {5,}/g) || []).length;
    if (hasMultipleConsecutiveSpaces > 10) {
      this.addDeduction(categories.atsCompatibility, {
        rule: 'ATS Parsing Risk', item: 'Whitespace/Columns', points: 5, severity: 'Major',
        explanation: 'Detected heavy whitespace which often indicates hidden tables or columns.', recommendation: 'Use a standard single-column layout.'
      });
    }

    // Calculate final scores with zero clamping
    let overallScore = 0;
    const finalCategories = {} as any;
    
    for (const [key, cat] of Object.entries(categories)) {
      cat.score = Math.max(0, Math.round(cat.maxPoints - cat.deductions.reduce((sum, d) => sum + d.points, 0)));
      cat.percentage = Math.round((cat.score / cat.maxPoints) * 100);
      overallScore += cat.score;
      finalCategories[key] = cat;
    }

    // Benchmark calculation
    let matchBenchmark: 'Excellent Match' | 'Strong Match' | 'Moderate Match' | 'Weak Match' | 'Poor Match' = 'Poor Match';
    if (overallScore >= 85) matchBenchmark = 'Excellent Match';
    else if (overallScore >= 75) matchBenchmark = 'Strong Match';
    else if (overallScore >= 60) matchBenchmark = 'Moderate Match';
    else if (overallScore >= 40) matchBenchmark = 'Weak Match';

    // Recruiter Confidence
    let rExp = resume.experience.length > 0 ? 35 : 0;
    let rProj = resume.projects.length > 0 ? (projMetricsCount > 0 ? 20 : 10) : 0;
    let rAchieve = achievementsCount >= 3 ? 15 : (achievementsCount > 0 ? 7 : 0);
    let rTech = Math.round((keywordAnalysis.keywordPercentage / 100) * 15);
    let rCareer = resume.experience.length > 1 ? 5 : 0;
    let rLead = words.includes('led') || words.includes('managed') ? 5 : 0;
    let rComm = words.includes('presented') || words.includes('collaborated') ? 5 : 0;
    
    const recruiterConfidence = Math.max(0, Math.min(100, rExp + rProj + rAchieve + rTech + rCareer + rLead + rComm));

    return {
      overallScore,
      matchBenchmark,
      recruiterConfidence,
      categories: finalCategories
    };
  }

  private createEmptyCategory(maxPoints: number): CategoryResult {
    return {
      maxPoints,
      score: maxPoints,
      percentage: 100,
      deductions: [],
      recommendations: []
    };
  }

  private addDeduction(category: CategoryResult, deduction: RuleDeduction) {
    deduction.points = Math.abs(deduction.points);
    category.deductions.push(deduction);
    if (deduction.recommendation && !category.recommendations.includes(deduction.recommendation)) {
      category.recommendations.push(deduction.recommendation);
    }
  }
}
