export class SocialAgent {
  async process(query) {
    // Mock patient sentiment analysis
    return `## Patient Sentiment Analysis\n\n` +
           `Based on social media and patient forums:\n\n` +
           `**Key Findings:**\n` +
           `- Overall Sentiment: Mixed\n` +
           `- Key Complaints: Injection site reactions, cost concerns\n` +
           `- Positive Feedback: Efficacy, convenience\n\n` +
           `**Recommendation:** Focus on patient education and support programs`;
  }
}

