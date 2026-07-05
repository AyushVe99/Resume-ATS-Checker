export const mockEngineeringDNA = {
  nodes: [
    { id: 'Frontend', group: 1, radius: 30, color: 'var(--accent-primary)' },
    { id: 'React', group: 1, radius: 20, color: 'var(--accent-primary)' },
    { id: 'Next.js', group: 1, radius: 15, color: 'var(--accent-primary)' },
    { id: 'Tailwind', group: 1, radius: 15, color: 'var(--accent-primary)' },
    
    { id: 'Backend', group: 2, radius: 30, color: 'var(--accent-secondary)' },
    { id: 'Node.js', group: 2, radius: 25, color: 'var(--accent-secondary)' },
    { id: 'PostgreSQL', group: 2, radius: 20, color: 'var(--accent-secondary)' },
    { id: 'Express', group: 2, radius: 15, color: 'var(--accent-secondary)' },
    
    { id: 'Architecture', group: 3, radius: 25, color: '#3b82f6' },
    { id: 'Microservices', group: 3, radius: 15, color: '#3b82f6' },
    { id: 'System Design', group: 3, radius: 20, color: '#3b82f6' },
  ],
  links: [
    { source: 'Frontend', target: 'React', value: 2 },
    { source: 'React', target: 'Next.js', value: 2 },
    { source: 'Frontend', target: 'Tailwind', value: 1 },
    
    { source: 'Backend', target: 'Node.js', value: 2 },
    { source: 'Node.js', target: 'Express', value: 1 },
    { source: 'Node.js', target: 'PostgreSQL', value: 2 },
    
    { source: 'Architecture', target: 'Backend', value: 3 },
    { source: 'Architecture', target: 'Microservices', value: 2 },
    { source: 'Architecture', target: 'System Design', value: 2 },
    { source: 'Frontend', target: 'Backend', value: 1 }, // Fullstack link
  ]
};

export const mockComplexityData = [
  { name: 'E-commerce Replatform', impact: 85, complexity: 90, domain: 'Fullstack' },
  { name: 'Analytics Dashboard', impact: 60, complexity: 55, domain: 'Frontend' },
  { name: 'Payment Gateway Integration', impact: 95, complexity: 80, domain: 'Backend' },
  { name: 'Legacy Migration', impact: 75, complexity: 85, domain: 'Architecture' },
  { name: 'CI/CD Pipeline', impact: 70, complexity: 65, domain: 'Infrastructure' },
];

export const mockEvidenceTimeline = [
  {
    year: '2023',
    role: 'Senior Software Engineer',
    company: 'TechCorp',
    achievement: 'Led the migration to microservices, reducing latency by 40%.',
    domain: 'Architecture',
  },
  {
    year: '2021',
    role: 'Software Engineer',
    company: 'FinTech Startup',
    achievement: 'Built the core payment processing engine handling $1M/day.',
    domain: 'Backend',
  },
  {
    year: '2019',
    role: 'Frontend Developer',
    company: 'Agency XYZ',
    achievement: 'Developed 15+ high-performance React applications.',
    domain: 'Frontend',
  }
];

export const mockRiskMapData = [
  { skill: 'React', required: true, proficiency: 90, risk: 'Low' },
  { skill: 'TypeScript', required: true, proficiency: 85, risk: 'Low' },
  { skill: 'Node.js', required: true, proficiency: 70, risk: 'Medium' },
  { skill: 'GraphQL', required: false, proficiency: 20, risk: 'High' },
  { skill: 'AWS', required: true, proficiency: 40, risk: 'High' },
  { skill: 'System Design', required: true, proficiency: 60, risk: 'Medium' },
];
