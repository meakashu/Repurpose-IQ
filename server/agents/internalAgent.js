import db from '../database/db.js';

export class InternalAgent {
  async process(query) {
    // RAG-based search for internal documents
    // In production, this would use ChromaDB or similar vector DB
    
    // Mock internal document search
    const mockDocs = [
      {
        title: 'Oncology Strategy 2024',
        summary: 'Strategic plan for oncology portfolio expansion',
        content: 'Focus on immuno-oncology and targeted therapies...',
        tags: ['Oncology', 'Strategy']
      },
      {
        title: 'Market Analysis - Respiratory',
        summary: 'Market opportunity analysis for respiratory diseases',
        content: 'COPD and asthma markets show high growth potential...',
        tags: ['Respiratory', 'Market Analysis']
      }
    ];

    const queryLower = query.toLowerCase();
    const results = mockDocs.filter(doc => 
      doc.title.toLowerCase().includes(queryLower) ||
      doc.summary.toLowerCase().includes(queryLower) ||
      doc.content.toLowerCase().includes(queryLower)
    );

    if (results.length === 0) {
      return `No internal documents found matching: ${query}`;
    }

    let output = `## Internal Document Search Results\n\n`;
    output += "| Title | Summary | Tags |\n";
    output += "|-------|---------|------|\n";
    
    results.forEach((doc) => {
      output += `| ${doc.title} | ${doc.summary} | ${doc.tags.join(', ')} |\n`;
    });
    
    output += `\n**Document Details:**\n\n`;
    results.forEach((doc, idx) => {
      output += `${idx + 1}. **${doc.title}**\n`;
      output += `   Content: ${doc.content.substring(0, 200)}...\n\n`;
    });

    return output;
  }
}

