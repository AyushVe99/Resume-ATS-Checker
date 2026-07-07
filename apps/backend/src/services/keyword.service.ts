import { ParsedResume, KeywordAnalysisResult, SkillCategoryResult } from '../types';
import natural from 'natural';

export class KeywordService {
  private tokenizer: natural.WordTokenizer;

  private dictionary: Record<string, string[]> = {
    // Languages
    'javascript': ['js', 'javascript', 'ecmascript', 'es6'],
    'typescript': ['ts', 'typescript'],
    'python': ['python', 'py'],
    'java': ['java', 'jvm'],
    'csharp': ['c#', 'csharp', '.net'],
    'cpp': ['c++', 'cpp'],
    'c': ['c'],
    'go': ['go', 'golang'],
    'rust': ['rust'],
    'ruby': ['ruby', 'ror'],
    'php': ['php'],
    'swift': ['swift'],
    'kotlin': ['kotlin'],
    'scala': ['scala'],
    'dart': ['dart'],
    'bash': ['bash', 'shell', 'sh', 'scripting'],
    
    // Frontend
    'react': ['react', 'reactjs', 'react.js'],
    'node.js': ['node', 'nodejs', 'node.js'],
    'next.js': ['next', 'nextjs', 'next.js'],
    'vue': ['vue', 'vuejs', 'vue.js'],
    'angular': ['angular', 'angularjs'],
    'svelte': ['svelte'],
    'html': ['html', 'html5'],
    'css': ['css', 'css3', 'sass', 'scss', 'less'],
    'tailwind': ['tailwind', 'tailwindcss'],
    'bootstrap': ['bootstrap'],
    'material ui': ['material ui', 'mui'],
    'redux': ['redux', 'redux toolkit'],
    'webpack': ['webpack'],
    'vite': ['vite'],
    'babel': ['babel'],
    
    // Backend & Frameworks
    'express': ['express', 'express.js', 'expressjs'],
    'nestjs': ['nest', 'nestjs', 'nest.js'],
    'spring': ['spring', 'spring boot'],
    'django': ['django'],
    'flask': ['flask'],
    'fastapi': ['fastapi'],
    'laravel': ['laravel'],
    'rails': ['rails', 'ruby on rails'],
    'asp.net': ['asp.net', 'aspnet', 'dotnet'],
    
    // Databases & ORMs
    'postgresql': ['postgresql', 'postgres'],
    'mysql': ['mysql'],
    'mongodb': ['mongodb', 'mongo'],
    'redis': ['redis'],
    'sqlite': ['sqlite'],
    'oracle': ['oracle', 'oracle db'],
    'dynamodb': ['dynamodb', 'dynamo'],
    'cassandra': ['cassandra'],
    'elasticsearch': ['elasticsearch', 'elk'],
    'prisma': ['prisma'],
    'typeorm': ['typeorm'],
    'mongoose': ['mongoose'],
    'sequelize': ['sequelize'],
    
    // Cloud & Infrastructure
    'aws': ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'cloudfront', 'rds', 'cloudwatch'],
    'gcp': ['gcp', 'google cloud platform', 'google cloud', 'bigquery'],
    'azure': ['azure', 'microsoft azure'],
    'docker': ['docker', 'containerization', 'containers'],
    'kubernetes': ['kubernetes', 'k8s', 'orchestration'],
    'helm': ['helm'],
    'terraform': ['terraform', 'infrastructure-as-code', 'iac', 'infrastructure as code'],
    'ansible': ['ansible'],
    'nginx': ['nginx'],
    'apache': ['apache'],
    'linux': ['linux', 'ubuntu', 'centos', 'debian'],
    'unix': ['unix'],
    
    // DevOps & CI/CD
    'ci/cd': ['ci/cd', 'cicd', 'continuous integration', 'continuous deployment', 'continuous delivery'],
    'gitops': ['gitops'],
    'github actions': ['github actions', 'actions'],
    'jenkins': ['jenkins'],
    'gitlab ci': ['gitlab ci', 'gitlab-ci'],
    'circleci': ['circleci'],
    'git': ['git', 'github', 'gitlab', 'bitbucket', 'version control'],
    
    // Architecture & Concepts
    'rest': ['rest', 'restful', 'api', 'rest api'],
    'graphql': ['graphql', 'gql'],
    'grpc': ['grpc'],
    'websockets': ['websockets', 'websocket', 'ws', 'socket.io'],
    'microservices': ['microservices', 'micro-services'],
    'serverless': ['serverless'],
    'event driven': ['event-driven', 'event driven', 'pub/sub', 'pub-sub'],
    'kafka': ['kafka', 'apache kafka'],
    'rabbitmq': ['rabbitmq'],
    'oop': ['oop', 'oops', 'object oriented', 'object-oriented'],
    'solid': ['solid', 'solid principles'],
    'system design': ['system design', 'architecture'],
    'tdd': ['tdd', 'test driven development'],
    'bdd': ['bdd', 'behavior driven development'],
    
    // Testing
    'jest': ['jest'],
    'mocha': ['mocha'],
    'chai': ['chai'],
    'cypress': ['cypress'],
    'selenium': ['selenium'],
    'playwright': ['playwright'],
    
    // Methodologies & Soft Skills
    'agile': ['agile', 'scrum', 'kanban'],
    'jira': ['jira', 'confluence'],
    'leadership': ['leadership', 'mentored', 'mentor', 'mentorship'],
    'communication': ['communication', 'communicate', 'presentation', 'present', 'verbal', 'written'],
    'problem solving': ['problem solving', 'troubleshooting', 'analytical', 'analytical skills'],
    'teamwork': ['teamwork', 'collaborate', 'collaboration', 'team player', 'cross-functional']
  };

  constructor() {
    this.tokenizer = new natural.WordTokenizer();
  }

  public analyzeKeywords(resume: ParsedResume, jobDescription: string): KeywordAnalysisResult {
    const resumeTokens = this.tokenizeAndStem(resume.rawText);
    
    const requiredSkillsSet = new Set<string>();
    const preferredSkillsSet = new Set<string>();
    const bonusSkillsSet = new Set<string>();
    
    let currentMode: 'required' | 'preferred' | 'bonus' = 'required';
    
    const lines = jobDescription.split('\n').map(l => l.trim().toLowerCase());
    
    for (const line of lines) {
      if (/(requirements|qualifications|must have|required)/i.test(line)) {
        currentMode = 'required';
      } else if (/(preferred|nice to have|plus|bonus)/i.test(line)) {
        currentMode = /bonus/i.test(line) ? 'bonus' : 'preferred';
      }
      
      for (const [key, aliases] of Object.entries(this.dictionary)) {
        for (const alias of aliases) {
          const escapedAlias = alias.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
          const regex = new RegExp(`(^|[^a-zA-Z0-9_])${escapedAlias}([^a-zA-Z0-9_]|$)`, 'i');
          if (regex.test(line)) {
            if (currentMode === 'required') requiredSkillsSet.add(key);
            else if (currentMode === 'preferred') preferredSkillsSet.add(key);
            else bonusSkillsSet.add(key);
            break;
          }
        }
      }
    }

    preferredSkillsSet.forEach(s => { if (requiredSkillsSet.has(s)) preferredSkillsSet.delete(s); });
    bonusSkillsSet.forEach(s => { if (requiredSkillsSet.has(s) || preferredSkillsSet.has(s)) bonusSkillsSet.delete(s); });

    if (requiredSkillsSet.size === 0) {
      const generic = this.extractGenericKeywords(jobDescription);
      generic.forEach(g => requiredSkillsSet.add(g));
    }

    const checkMatch = (skills: Set<string>): SkillCategoryResult => {
      const matched: string[] = [];
      const missing: string[] = [];
      skills.forEach(skillKey => {
        const aliases = this.dictionary[skillKey] || [skillKey];
        const stemmedAliases = aliases.map(a => natural.PorterStemmer.stem(a.toLowerCase()));
        
        const hasMatch = stemmedAliases.some(alias => resumeTokens.includes(alias)) || 
                         resume.rawText.toLowerCase().includes(skillKey.toLowerCase());
        
        if (hasMatch) {
          matched.push(skillKey);
        } else {
          missing.push(skillKey);
        }
      });
      return { matched, missing };
    };

    const requiredSkills = checkMatch(requiredSkillsSet);
    const preferredSkills = checkMatch(preferredSkillsSet);
    const bonusSkills = checkMatch(bonusSkillsSet);

    const matchedKeywords = [...requiredSkills.matched, ...preferredSkills.matched, ...bonusSkills.matched];
    const missingKeywords = [...requiredSkills.missing, ...preferredSkills.missing, ...bonusSkills.missing];

    const totalRequired = matchedKeywords.length + missingKeywords.length;
    const keywordPercentage = totalRequired > 0 ? Math.round((matchedKeywords.length / totalRequired) * 100) : 0;

    return {
      matchedKeywords,
      missingKeywords,
      requiredSkills,
      preferredSkills,
      bonusSkills,
      keywordPercentage
    };
  }

  private tokenizeAndStem(text: string): string[] {
    const tokens = this.tokenizer.tokenize(text.toLowerCase()) || [];
    return tokens.map(token => natural.PorterStemmer.stem(token));
  }

  private extractGenericKeywords(text: string): string[] {
    const tokens = text.split(/\s+/);
    const generic = new Set<string>();
    tokens.forEach(token => {
      const clean = token.replace(/[^a-zA-Z]/g, '');
      if (clean.length > 4 && (clean === clean.toUpperCase() || /^[A-Z][a-z]+$/.test(clean))) {
        generic.add(clean.toLowerCase());
      }
    });
    return Array.from(generic);
  }
}
