/**
 * Synthetic Queries System
 * Pre-defined strategic questions that pharma planners might ask
 */

export const SYNTHETIC_QUERIES = [
  {
    id: 1,
    category: 'Market Intelligence',
    query: 'Which respiratory diseases show low competition but high patient burden in India?',
    description: 'Identify whitespace opportunities in respiratory therapy area for Indian market'
  },
  {
    id: 2,
    category: 'Drug Repurposing',
    query: 'Find repurposing opportunities for Metformin beyond diabetes',
    description: 'Explore new indications for approved diabetes drug'
  },
  {
    id: 3,
    category: 'Patent Analysis',
    query: 'What patents are expiring in the next 3 years for cardiovascular drugs?',
    description: 'Identify patent expiry opportunities in cardiovascular therapy area'
  },
  {
    id: 4,
    category: 'Market Entry',
    query: 'Analyze market size and growth trends for oncology drugs in emerging markets',
    description: 'Assess market opportunity for oncology portfolio expansion'
  },
  {
    id: 5,
    category: 'Competitive Intelligence',
    query: 'What are the competitive dynamics for Sitagliptin in the diabetes market?',
    description: 'Understand competitive landscape for DPP-4 inhibitor'
  },
  {
    id: 6,
    category: 'Clinical Pipeline',
    query: 'What clinical trials are ongoing for Pembrolizumab in new indications?',
    description: 'Track clinical development pipeline for immuno-oncology drug'
  },
  {
    id: 7,
    category: 'Trade Intelligence',
    query: 'What are the import-export trends for Rivaroxaban API?',
    description: 'Analyze supply chain and sourcing opportunities'
  },
  {
    id: 8,
    category: 'Strategic Planning',
    query: 'Identify unmet medical needs in the cardiovascular therapy area with high market potential',
    description: 'Strategic planning for portfolio expansion'
  },
  {
    id: 9,
    category: 'Regulatory Intelligence',
    query: 'What are the regulatory approval trends for generic drugs in the US market?',
    description: 'Understand regulatory landscape for generic portfolio'
  },
  {
    id: 10,
    category: 'End-to-End Analysis',
    query: 'Provide comprehensive analysis of Metformin including market size, patents, clinical trials, and repurposing opportunities',
    description: 'Complete pharmaceutical intelligence analysis for strategic decision making'
  }
];

export function getSyntheticQueries(category = null) {
  if (category) {
    return SYNTHETIC_QUERIES.filter(q => q.category === category);
  }
  return SYNTHETIC_QUERIES;
}

export function getSyntheticQueryById(id) {
  return SYNTHETIC_QUERIES.find(q => q.id === id);
}

export function getQueryCategories() {
  return [...new Set(SYNTHETIC_QUERIES.map(q => q.category))];
}

