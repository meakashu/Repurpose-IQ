import Groq from 'groq-sdk';

// Lazy initialization to avoid errors on import if API key is missing
let groq = null;

function getGroqClient() {
  if (!groq) {
    const apiKey = process.env.GROQ_API_KEY;

    // In demo / Vercel environments we want the app to keep working
    // even if the key is not configured. Instead of throwing and
    // breaking the whole query flow, we log a warning and return null.
    if (!apiKey) {
      console.warn(
        '[Groq AI] GROQ_API_KEY is not set. Running in demo fallback mode with mock AI responses.'
      );
      return null;
    }

    groq = new Groq({ apiKey });
  }
  return groq;
}

export async function chatCompletion(messages, options = {}) {
  try {
    const client = getGroqClient();

    // If Groq is not configured, return a helpful mock response so the
    // rest of the pipeline (MasterAgent, UI, etc.) still works in demos.
    if (!client) {
      return `
Groq AI is not configured for this deployment, so you are seeing a **simulated demo response** instead of a live LLM call.

Here is how RepurposeIQ would normally handle your request:

- The Master Agent would orchestrate Clinical, Patent, Market and Web Intelligence agents
- Each agent would analyze its data source (mock IQVIA, USPTO, ClinicalTrials, Tavily, etc.)
- Groq AI (LLaMA 3.3 70B) would synthesize the findings into a strategic report

In a production environment, set the GROQ_API_KEY environment variable to enable real Groq-powered analysis.
`;
    }
    
    // Log that we're calling Groq API (for debugging)
    console.log('[Groq AI] Calling Groq API with model:', process.env.GROQ_MODEL || 'llama-3.3-70b-versatile');
    
    const response = await client.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages: messages,
      temperature: options.temperature || 0.3,
      // Use max_completion_tokens (new) or max_tokens (deprecated but still supported)
      max_completion_tokens: options.max_completion_tokens || options.max_tokens || 4096, // Increased for structured responses
      ...options
    });

    const content = response.choices[0].message.content;
    console.log('[Groq AI] Response received, length:', content?.length || 0);
    
    return content;
  } catch (error) {
    console.error('[Groq AI] API Error, falling back to demo response:', error);

    // On Vercel / production, never break the user flow because of Groq errors.
    // Instead, return a clear simulated response explaining the situation.
    return `
Groq AI is temporarily unavailable or not fully configured for this deployment, so you are seeing a **simulated demo response** instead of a live Groq answer.

Internal error details: ${error.message}

The rest of the RepurposeIQ pipeline (multi-agent orchestration, mock IQVIA/USPTO/ClinicalTrials data, dashboards, reports) continues to work normally.
`;
  }
}

export async function streamCompletion(messages, onChunk) {
  try {
    const client = getGroqClient();
    if (!client) {
      // For stream mode, just send a short mock explanation.
      onChunk(
        'Groq AI is not configured for this deployment. Set GROQ_API_KEY in your environment to enable live streaming responses.'
      );
      return;
    }
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

