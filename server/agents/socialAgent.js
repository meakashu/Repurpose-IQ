import sentimentAnalysisService from '../services/sentimentAnalysisService.js';

export class SocialAgent {
  async process(query) {
    const molecule = this.extractMolecule(query);
    
    if (molecule) {
      try {
        // Use real sentiment analysis service
        const sentimentData = await sentimentAnalysisService.analyzeSentiment(molecule, ['news', 'social']);
        
        let result = `## Patient Sentiment Analysis: ${molecule}\n\n`;
        result += `**Overall Sentiment:** ${sentimentData.overallSentiment || 'Neutral'}\n`;
        result += `**Sentiment Score:** ${(sentimentData.sentimentScore || 0).toFixed(2)} (-1 to +1 scale)\n\n`;
        
        if (sentimentData.sources?.news) {
          result += `**News Analysis:**\n`;
          result += `- Sentiment: ${sentimentData.sources.news.sentiment || 'Neutral'}\n`;
          result += `- Score: ${(sentimentData.sources.news.score || 0).toFixed(2)}\n`;
          if (sentimentData.sources.news.keyPoints?.length > 0) {
            result += `- Key Points:\n`;
            sentimentData.sources.news.keyPoints.forEach(point => {
              result += `  • ${point}\n`;
            });
          }
          result += `\n`;
        }
        
        if (sentimentData.sources?.social) {
          result += `**Social Media Analysis:**\n`;
          result += `- Sentiment: ${sentimentData.sources.social.sentiment || 'Neutral'}\n`;
          result += `- Mentions: ${sentimentData.sources.social.mentions || 0}\n`;
          if (sentimentData.sources.social.platforms?.length > 0) {
            result += `- Platforms: ${sentimentData.sources.social.platforms.join(', ')}\n`;
          }
          result += `\n`;
        }
        
        if (sentimentData.keyTopics?.length > 0) {
          result += `**Key Topics:** ${sentimentData.keyTopics.join(', ')}\n\n`;
        }
        
        // Generate recommendation based on sentiment
        if (sentimentData.sentimentScore > 0.3) {
          result += `**Recommendation:** Positive sentiment detected. Consider capitalizing on market momentum.`;
        } else if (sentimentData.sentimentScore < -0.3) {
          result += `**Recommendation:** Negative sentiment detected. Focus on patient education and addressing concerns.`;
        } else {
          result += `**Recommendation:** Neutral sentiment. Monitor trends and focus on differentiation.`;
        }
        
        return result;
      } catch (error) {
        console.error('Social Agent error:', error);
        // Fallback to structured response
        return this.getFallbackSentiment(molecule);
      }
    }
    
    return this.getGeneralSentimentInfo();
  }
  
  extractMolecule(query) {
    const molecules = [
      'metformin', 'sitagliptin', 'pembrolizumab', 'rivaroxaban',
      'atorvastatin', 'lisinopril', 'amlodipine', 'omeprazole',
      'semaglutide', 'adalimumab'
    ];
    for (const mol of molecules) {
      if (query.toLowerCase().includes(mol.toLowerCase())) {
        return mol;
      }
    }
    return null;
  }
  
  getFallbackSentiment(molecule) {
    return `## Patient Sentiment Analysis: ${molecule}\n\n` +
           `**Status:** Analysis in progress\n\n` +
           `**Note:** Sentiment analysis service is currently unavailable. ` +
           `This analysis would typically include:\n` +
           `- Social media sentiment from patient forums\n` +
           `- News article analysis\n` +
           `- Treatment satisfaction metrics\n` +
           `- Patient-reported outcomes\n\n` +
           `**Recommendation:** Monitor patient feedback channels for ${molecule}.`;
  }
  
  getGeneralSentimentInfo() {
    return `## Patient Sentiment Analysis\n\n` +
           `Patient sentiment analysis provides insights into:\n` +
           `- Treatment satisfaction\n` +
           `- Side effect concerns\n` +
           `- Cost and access issues\n` +
           `- Real-world effectiveness\n\n` +
           `**Usage:** Ask about sentiment for a specific molecule, e.g., "What is patient sentiment for Metformin?"`;
  }
}

