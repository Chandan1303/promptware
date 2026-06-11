import { describe, test, expect, vi, beforeAll } from 'vitest';
import { translateText } from '../services/googleTranslate';
import { calculateRouteCarbonFootprint } from '../services/googleMaps';
import { analyzeReceipt } from '../services/googleVision';

// Mock fetch globally for testing API integrations
beforeAll(() => {
  global.fetch = vi.fn().mockImplementation((url) => {
    if (url.includes('translation.googleapis.com')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          data: {
            translations: [{ translatedText: 'Mock Translation', detectedSourceLanguage: 'en' }]
          }
        })
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({})
    });
  });
});

describe('Google Translate Service', () => {
  test('should use local fallback dictionary when API key is missing', async () => {
    const origKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
    import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY = 'your_translate_api_key_here';
    
    const result = await translateText('Sustainability Dashboard', 'es');
    expect(result.success).toBe(true);
    expect(result.translatedText).toBe('Tablero de Sostenibilidad');
    
    import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY = origKey;
  });

  test('should return original text if translation not found in local dictionary', async () => {
    const origKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
    import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY = 'your_translate_api_key_here';

    const result = await translateText('Some unmapped text', 'es');
    expect(result.translatedText).toBe('Some unmapped text');

    import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY = origKey;
  });
});

describe('Google Maps Service', () => {
  test('should use demo route fallback when Google Maps API is not loaded', async () => {
    const origKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY = 'your_maps_api_key_here';

    const result = await calculateRouteCarbonFootprint('San Francisco', 'Los Angeles', 'driving');
    expect(result.demo).toBe(true);
    expect(result.distance).toBe('559 km');
    expect(parseFloat(result.carbonKg)).toBeGreaterThan(0);

    import.meta.env.VITE_GOOGLE_MAPS_API_KEY = origKey;
  });

  test('should calculate 0 carbon for biking/walking in demo fallback', async () => {
    const origKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY = 'your_maps_api_key_here';

    const bikingResult = await calculateRouteCarbonFootprint('San Francisco', 'Los Angeles', 'bicycling');
    expect(parseFloat(bikingResult.carbonKg)).toBe(0);
    
    const walkingResult = await calculateRouteCarbonFootprint('San Francisco', 'Los Angeles', 'walking');
    expect(parseFloat(walkingResult.carbonKg)).toBe(0);

    import.meta.env.VITE_GOOGLE_MAPS_API_KEY = origKey;
  });
});

describe('Google Vision Service', () => {
  test('should use mock demo receipt analyzer when API key is missing', async () => {
    const origKey = import.meta.env.VITE_GOOGLE_VISION_API_KEY;
    import.meta.env.VITE_GOOGLE_VISION_API_KEY = 'your_vision_api_key_here';

    const result = await analyzeReceipt(null);
    expect(result.success).toBe(true);
    expect(result.demo).toBe(true);
    expect(result.items.length).toBeGreaterThan(0);
    expect(parseFloat(result.totalCarbon)).toBeGreaterThan(0);

    import.meta.env.VITE_GOOGLE_VISION_API_KEY = origKey;
  });
});
