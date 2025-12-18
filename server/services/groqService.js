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
    
    // Log that we're calling Groq API (for debugging)
    console.log('[Groq AI] Calling Groq API with model:', process.env.GROQ_MODEL || 'llama-3.3-70b-versatile');
    
    const response = await client.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages: messages,
      temperature: options.temperature || 0.3,
      // Use max_completion_tokens (new) or max_tokens (deprecated but still supported)
      max_completion_tokens: options.max_completion_tokens || options.max_tokens || 1024,
      ...options
    });

    const content = response.choices[0].message.content;
    console.log('[Groq AI] Response received, length:', content?.length || 0);
    
    return content;
  } catch (error) {
    console.error('[Groq AI] API Error:', error);
    
    // Provide more specific error messages
    if (error.message && error.message.includes('GROQ_API_KEY')) {
      throw new Error(`GROQ_API_KEY environment variable is missing. Please set it in your .env file to use Groq AI.`);
    }
    
    if (error.response) {
      // Groq API returned an error response
      throw new Error(`Groq API error (${error.response.status}): ${error.response.data?.error?.message || error.message}`);
    }
    
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
      max_completion_tokens: 1024,  // Use new parameter name (max_tokens is deprecated)
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

