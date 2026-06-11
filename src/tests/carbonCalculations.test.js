import { describe, test, expect } from 'vitest';
import {
  calculateCarbonFootprint,
  getLeafRating,
  getRecommendedActions
} from '../utils/carbonCalculations';

describe('Carbon Footprint Calculator Logic', () => {
  test('should calculate correct emissions for a high carbon lifestyle', () => {
    const highAnswers = {
      transportType: 'car',
      transportKm: 50,
      diet: 'meat',
      electricity: 'high',
      water: 'high',
      shopping: 'high',
      waste: 'high'
    };

    const result = calculateCarbonFootprint(highAnswers);
    expect(result.transport).toBe(3285);
    expect(result.food).toBe(1205);
    expect(result.utilities).toBe(2916);
    expect(result.shopping).toBe(4200);
    expect(result.waste).toBe(720);
    expect(result.total).toBe(3285 + 1205 + 2916 + 4200 + 720);
  });

  test('should calculate zero transport emissions for walk/bike options', () => {
    const ecoAnswers = {
      transportType: 'walk',
      transportKm: 15,
      diet: 'vegan',
      electricity: 'low',
      water: 'low',
      shopping: 'low',
      waste: 'low'
    };

    const result = calculateCarbonFootprint(ecoAnswers);
    expect(result.transport).toBe(0);
  });

  test('should return correct leaf ratings based on totals', () => {
    const r5 = getLeafRating(1200);
    expect(r5.rating).toBe(5);
    expect(r5.label).toBe('Eco Hero');

    const r4 = getLeafRating(2500);
    expect(r4.rating).toBe(4);
    
    const r3 = getLeafRating(4500);
    expect(r3.rating).toBe(3);

    const r2 = getLeafRating(8000);
    expect(r2.rating).toBe(2);

    const r1 = getLeafRating(10500);
    expect(r1.rating).toBe(1);
    expect(r1.label).toBe('Critically High');
  });

  test('should generate action items suited to answers', () => {
    const meatAnswers = {
      transportType: 'car',
      transportKm: 20,
      diet: 'meat',
      electricity: 'high',
      water: 'high',
      shopping: 'medium',
      waste: 'medium'
    };

    const actions = getRecommendedActions(meatAnswers);
    const hasDietAction = actions.some(a => a.id === 'food_vegetarian_days');
    expect(hasDietAction).toBe(true);

    const hasTransitAction = actions.some(a => a.id === 'transit_car_pool');
    expect(hasTransitAction).toBe(true);

    const hasElectricityAction = actions.some(a => a.id === 'utility_led');
    expect(hasElectricityAction).toBe(true);
  });
});
