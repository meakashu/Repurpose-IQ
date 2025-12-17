import axios from 'axios';

export class WebAgent {
  async search(query) {
    try {
      const apiKey = process.env.TAVILY_API_KEY;
      if (!apiKey) {
        return null; // Return null if no API key
      }

      // Enhance query to focus on pharmaceutical sources
      const pharmaQuery = this.enhancePharmaQuery(query);

      const response = await axios.post('https://api.tavily.com/search', {
        api_key: apiKey,
        query: pharmaQuery,
        search_depth: 'advanced',
        max_results: 5,
        include_domains: [
          'pubmed.ncbi.nlm.nih.gov',
          'clinicaltrials.gov',
          'fda.gov',
          'ema.europa.eu',
          'nature.com',
          'sciencedirect.com',
          'springer.com',
          'wiley.com',
          'pharmaceutical-technology.com',
          'pharmexec.com'
        ]
      });

      if (response.data.answer) {
        return response.data.answer;
      }

      // Return results summary if available
      if (response.data.results && response.data.results.length > 0) {
        let summary = '## Web Search Results (Pharmaceutical Sources)\n\n';
        response.data.results.slice(0, 3).forEach((result, idx) => {
          summary += `${idx + 1}. **${result.title}**\n`;
          summary += `${result.content.substring(0, 200)}...\n\n`;
        });
        return summary;
      }

      return null;
    } catch (error) {
      console.error('Web search error:', error);
      return null;
    }
  }

  enhancePharmaQuery(query) {
    // Enhance query to focus on pharmaceutical sources
    const queryLower = query.toLowerCase();
    
    // Add pharmaceutical context if not already present
    const pharmaTerms = ['pharmaceutical', 'drug', 'molecule', 'clinical trial', 'patent', 'fda'];
    const hasPharmaTerm = pharmaTerms.some(term => queryLower.includes(term));
    
    if (!hasPharmaTerm) {
      // Add pharmaceutical context
      return `${query} pharmaceutical drug development clinical trial`;
    }
    
    return query;
  }
}

