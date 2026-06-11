// Quick API Test Script
// Run with: node test-api.js

import { GoogleGenAI } from '@google/genai';

const API_KEY = process.env.VITE_GEMINI_API_KEY || '';

async function testGeminiAPI() {
  console.log('🧪 Testing Gemini API Connection...\n');
  
  if (!API_KEY || API_KEY.trim() === '') {
    console.log('❌ No API key found in environment variables');
    console.log('📝 To test with real API:');
    console.log('   1. Get API key from: https://aistudio.google.com/apikey');
    console.log('   2. Add to .env file: VITE_GEMINI_API_KEY=your_key_here');
    console.log('   3. Restart the dev server\n');
    console.log('✅ App works in SIMULATION MODE without API key');
    console.log('   - Visit http://localhost:5173/');
    console.log('   - Go to "AI Coach Chat" tab');
    console.log('   - Try asking questions - it uses intelligent fallback\n');
    return;
  }

  try {
    console.log('🔑 API Key found, testing connection...');
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    // Try latest 2026 models with the new SDK
    const modelOptions = [
      'gemini-3.5-flash',
      'gemini-2.5-flash', 
      'gemini-2.0-flash',
      'gemini-flash-latest'
    ];
    
    let success = false;
    
    for (const modelName of modelOptions) {
      try {
        console.log(`📡 Trying model: ${modelName}...`);
        const prompt = 'Say "Hello from EcoGuide AI!" in exactly 5 words.';
        
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt
        });
        
        console.log(`✅ SUCCESS! Gemini API is working with model: ${modelName}`);
        console.log(`📥 Response: ${response.text}\n`);
        console.log('🌱 Your EcoGuide AI Assistant is ready!');
        success = true;
        break;
      } catch (error) {
        console.log(`❌ Model ${modelName} failed: ${error.message}`);
        continue;
      }
    }
    
    if (!success) {
      throw new Error('All models failed');
    }
    
  } catch (error) {
    console.log('❌ API Test Failed');
    console.log(`Error: ${error.message}\n`);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('🔧 The API key is invalid. Please check:');
      console.log('   1. Key is correctly copied from Google AI Studio');
      console.log('   2. No extra spaces or characters');
      console.log('   3. Key has proper permissions enabled\n');
    } else if (error.message.includes('quota')) {
      console.log('🔧 API quota exceeded. Check your usage at:');
      console.log('   https://makersuite.google.com/app/apikey\n');
    }
    
    console.log('✅ Don\'t worry! App still works in SIMULATION MODE');
  }
}

testGeminiAPI();
