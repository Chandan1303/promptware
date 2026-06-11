// Minimal Express server to proxy Gemini API requests
// This allows using AQ. authorization keys from the backend

import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Gemini API configuration
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Proxy endpoint for Gemini API
app.post('/api/gemini/generate', async (req, res) => {
  const { message, profileContext, model = 'gemini-2.5-flash' } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
    return res.status(500).json({ 
      error: 'API key not configured',
      simulationMode: true 
    });
  }

  try {
    console.log(`[Gemini API] Request received for model: ${model}`);
    
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    const systemInstruction = `
You are EcoGuide AI, an elite carbon footprint analyst and supportive sustainability coach.
${profileContext ? `Here is the current carbon footprint and lifestyle breakdown of the user:\n${profileContext}` : ''}

Instructions:
1. Provide personalized, highly actionable advice.
2. Directly answer the user's message using their profile data.
3. Be encouraging and professional. Do not use generic carbon footprint boilerplate.
4. Format all responses in clean Markdown (bold text, lists, table structures if needed).
5. Limit responses to 2-3 short, highly impactful paragraphs.
`;

    const prompt = `${systemInstruction}\n\nUser Question: "${message}"\n\nResponse:`;
    
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt
    });

    console.log(`[Gemini API] Success with model: ${model}`);
    
    res.json({
      text: response.text,
      model: model,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Gemini API] Error:', error.message);
    
    // Return error with fallback flag
    res.status(500).json({
      error: error.message,
      simulationMode: true,
      details: error.toString()
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 EcoGuide AI Backend Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Server running on: http://localhost:${PORT}
✅ Health check:      http://localhost:${PORT}/health
✅ API endpoint:      http://localhost:${PORT}/api/gemini/generate
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${GEMINI_API_KEY ? '🔑 Gemini API Key: Configured (AQ. format supported)' : '⚠️  Gemini API Key: Not configured'}
  `);
});

export default app;
