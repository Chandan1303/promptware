import { GoogleGenAI } from '@google/genai';
import { calculateCarbonFootprint, EMISSION_FACTORS } from '../utils/carbonCalculations';

export async function askGemini(userMessage, answers, customApiKey) {
  const apiKey = customApiKey || import.meta.env.VITE_GEMINI_API_KEY;
  const breakdown = calculateCarbonFootprint(answers);
  
  const profileContext = `
[USER SUSTAINABILITY PROFILE]
- Daily Transportation: ${answers.transportType.toUpperCase()} (${answers.transportKm} km/day) -> Annual CO2: ${breakdown.transport} kg
- Diet: ${answers.diet.toUpperCase()} -> Annual CO2: ${breakdown.food} kg
- Electricity usage level: ${answers.electricity.toUpperCase()} -> Annual CO2: ${Math.round((EMISSION_FACTORS.electricity[answers.electricity] || 0) * 12)} kg
- Water usage level: ${answers.water.toUpperCase()} -> Annual CO2: ${Math.round((EMISSION_FACTORS.water[answers.water] || 0) * 12)} kg
- Shopping frequency: ${answers.shopping.toUpperCase()} -> Annual CO2: ${breakdown.shopping} kg
- Waste generation level: ${answers.waste.toUpperCase()} -> Annual CO2: ${breakdown.waste} kg
- TOTAL FOOTPRINT: ${breakdown.total} kg CO2/year
`;

  if (apiKey && apiKey.trim() !== '') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      
      // Try latest models first, fallback to older ones if needed
      const modelOptions = [
        'gemini-3.5-flash',      // Latest (May 2026)
        'gemini-2.5-flash',      // Stable (June 2025)
        'gemini-2.0-flash',      // Fallback
        'gemini-flash-latest'    // Auto-latest
      ];
      
      let lastError = null;
      
      // Try each model until one works
      for (const modelName of modelOptions) {
        try {
          const systemInstruction = `
You are EcoGuide AI, an elite carbon footprint analyst and supportive sustainability coach.
Here is the current carbon footprint and lifestyle breakdown of the user:
${profileContext}

Instructions:
1. Provide personalized, highly actionable advice.
2. Directly answer the user's message using their profile data.
3. Be encouraging and professional. Do not use generic carbon footprint boilerplate.
4. Format all responses in clean Markdown (bold text, lists, table structures if needed).
5. Limit responses to 2-3 short, highly impactful paragraphs.
`;
          
          const prompt = `${systemInstruction}\n\nUser Question: "${userMessage}"\n\nResponse:`;
          
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt
          });
          
          console.log(`✅ Successfully using Gemini model: ${modelName}`);
          return response.text;
        } catch (error) {
          lastError = error;
          console.warn(`Model ${modelName} failed, trying next...`, error.message);
          continue;
        }
      }
      
      // If all models failed, throw the last error
      throw lastError;
      
    } catch (error) {
      console.warn("Real Gemini API request failed, engaging local simulator. Error:", error);
    }
  }

  return simulateGeminiResponse(userMessage, answers, breakdown);
}

function simulateGeminiResponse(message, answers, breakdown) {
  const query = message.toLowerCase();
  
  const categories = [
    { name: 'Transportation', value: breakdown.transport, tip: 'shifting to public transport, biking, or choosing a hybrid/electric car' },
    { name: 'Dietary Habits', value: breakdown.food, tip: 'reducing meat intake, incorporating meatless days, and buying local ingredients' },
    { name: 'Home Utilities (Electricity & Water)', value: breakdown.utilities, tip: 'switching to LEDs, unplugging standby devices, and setting short shower timers' },
    { name: 'Consumer Shopping', value: breakdown.shopping, tip: 'buying high-quality items secondhand, avoiding single-use items, and purchasing in bulk' },
    { name: 'Waste Management', value: breakdown.waste, tip: 'composting organic scraps and recycling strictly according to guidelines' }
  ];
  
  categories.sort((a, b) => b.value - a.value);
  const highest = categories[0];
  const lowest = categories[categories.length - 1];

  let reply = '';

  if (query.includes('why') && (query.includes('high') || query.includes('footprint') || query.includes('score'))) {
    reply = `### Understanding Your Carbon Footprint

Your annual carbon footprint is **${breakdown.total.toLocaleString()} kg CO2/year**. 

The main contributor to your score is **${highest.name}** at **${highest.value.toLocaleString()} kg CO2/year**. This is primarily driven by your choice of a **${answers.transportType}** for daily transport (${answers.transportKm} km/day) and your **${answers.diet}** diet.

Here are the key areas pushing your footprint up:
1. **${highest.name}** (${highest.value.toLocaleString()} kg CO2/year): High carbon output relative to sustainable standards.
2. **Electricity & Water** (${breakdown.utilities.toLocaleString()} kg CO2/year): Electricity set to *${answers.electricity}* and water set to *${answers.water}*.
3. **Shopping Goods** (${breakdown.shopping.toLocaleString()} kg CO2/year): Rated *${answers.shopping}*, indicating frequent brand-new purchases.

To make an immediate impact, I recommend focusing on **${highest.name}** by ${highest.tip}.`;
  }
  
  else if (query.includes('improve') || query.includes('reduce') || query.includes('next month') || query.includes('what should i do')) {
    const savings = Math.round(breakdown.total * 0.15);
    reply = `### Your Customized Footprint Reduction Blueprint

Based on your lifestyle questionnaire, we can target a **15% reduction next month** (saving approximately **${savings} kg CO2/year**). Here are your priority action steps:

1. **Optimize Your Commute (Save ~${Math.round(breakdown.transport * 0.25)} kg/yr):**
   Since you travel by *${answers.transportType}* for *${answers.transportKm} km* daily, swapping to walking, cycling, or transit just 2 days a week will cut your transport footprint significantly.
   
2. **Transition Your Plate (Save ~${answers.diet === 'meat' ? '240' : '100'} kg/yr):**
   Your diet is currently classified as *${answers.diet}*. By committing to a *Meatless Monday* (or eating vegetarian 2-3 days a week), you drastically lower agriculture-related methane emissions.
   
3. **Home Utility Check (Save ~${Math.round(breakdown.utilities * 0.1)} kg/yr):**
   Upgrading your bulbs to LEDs and unplugging phantom electronics during standby will easily shave 10% off your household utility bill.

*Would you like me to walk you through the details of implementing any of these steps?*`;
  }
  
  else if (query.includes('contributor') || query.includes('biggest') || query.includes('highest')) {
    reply = `### Primary Carbon Emission Contributor

Your biggest source of carbon emissions is **${highest.name}**, which accounts for **${highest.value.toLocaleString()} kg CO2/year** (approximately **${Math.round((highest.value / breakdown.total) * 100)}%** of your total footprint).

By contrast, your lowest contributor is **${lowest.name}** at **${lowest.value.toLocaleString()} kg CO2/year**. 

**Focus Target:** To achieve the fastest emission cuts, address **${highest.name}**. For instance, you can try:
- Biking or walking for trips under 5km rather than using your **${answers.transportType}**.
- Integrating more plant-based meals into your **${answers.diet}** diet.
- Selecting energy-saving modes for high-draw household appliances.`;
  }
  
  else {
    reply = `### Hello! I am your AI Sustainability Coach.

I have analyzed your lifestyle data:
- **Annual Emissions:** ${breakdown.total.toLocaleString()} kg CO2/year
- **Primary Source:** ${highest.name} (${highest.value.toLocaleString()} kg)
- **Sustainability Rank:** ${answers.diet === 'vegan' && answers.transportType === 'bike' ? 'Eco Hero' : 'Active Improver'}

You can ask me questions like:
* *"Why is my carbon footprint high?"*
* *"What is my biggest contributor?"*
* *"How can I reduce my emissions next month?"*

**Coaching Tip:** Try setting a weekly goal in the dashboard to bike to local shops. This targets your **${answers.transportType}** emissions directly and boosts daily energy!`;
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(reply);
    }, 600);
  });
}
