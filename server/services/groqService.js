import Groq from 'groq-sdk';

// Lazy initialization to avoid errors on import if API key is missing
let groq = null;

function getGroqClient() {
  if (!groq) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY environment variable is missing. Please set it in your .env file.');
    }
    groq = new Groq({
      apiKey: apiKey
    });
  }
  return groq;
}

export async function chatCompletion(messages, options = {}) {
  try {
    const client = getGroqClient();
    const response = await client.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages: messages,
      temperature: options.temperature || 0.3,
      max_tokens: options.max_tokens || 1024,  // Reduced from 2048 to fit Groq free tier
      ...options
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error(`Groq API error: ${error.message}`);
  }
}

export async function streamCompletion(messages, onChunk) {
  try {
    const client = getGroqClient();
    const stream = await client.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages: messages,
      temperature: 0.3,
      max_tokens: 1024,  // Reduced from 2048
      stream: true
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    console.error('Groq Stream Error:', error);
    throw new Error(`Groq stream error: ${error.message}`);
  }
}

