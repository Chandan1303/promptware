// Emission factors in kg CO2 per unit
export const EMISSION_FACTORS = {
  transport: {
    walk: 0,
    bike: 0,
    bus: 0.089,   // per km
    train: 0.041, // per km
    car: 0.180,   // per km
    flight: 0.254 // per km
  },
  food: {
    vegan: 1.5,        // per day
    vegetarian: 1.7,   // per day
    mixed: 2.5,        // per day
    meat: 3.3          // per day
  },
  electricity: {
    low: 40,       // per month
    medium: 120,   // per month
    high: 240      // per month
  },
  water: {
    low: 0.5,      // per month
    medium: 1.5,   // per month
    high: 3.0      // per month
  },
  shopping: {
    low: 50,       // per month
    medium: 150,   // per month
    high: 350      // per month
  },
  waste: {
    low: 10,       // per month
    medium: 30,    // per month
    high: 60       // per month
  }
};

/**
 * Calculates the user's annual carbon footprint breakdown in kg CO2/year.
 */
export function calculateCarbonFootprint(answers) {
  // Transport: daily km * 365 days * factor
  const transportFactor = EMISSION_FACTORS.transport[answers.transportType] || 0;
  const transport = Math.round(answers.transportKm * 365 * transportFactor);

  // Food: daily factor * 365 days
  const foodFactor = EMISSION_FACTORS.food[answers.diet] || 0;
  const food = Math.round(foodFactor * 365);

  // Utilities: (electricity/month + water/month) * 12 months
  const electricity = EMISSION_FACTORS.electricity[answers.electricity] || 0;
  const water = EMISSION_FACTORS.water[answers.water] || 0;
  const utilities = Math.round((electricity + water) * 12);

  // Shopping: monthly factor * 12 months
  const shoppingFactor = EMISSION_FACTORS.shopping[answers.shopping] || 0;
  const shopping = Math.round(shoppingFactor * 12);

  // Waste: monthly factor * 12 months
  const wasteFactor = EMISSION_FACTORS.waste[answers.waste] || 0;
  const waste = Math.round(wasteFactor * 12);

  const total = transport + food + utilities + shopping + waste;

  return {
    transport,
    food,
    utilities,
    shopping,
    waste,
    total
  };
}

/**
 * Get Leaf Rating (1 to 5 leaves) based on yearly carbon total
 */
export function getLeafRating(totalKg) {
  if (totalKg < 1500) {
    return { rating: 5, label: 'Eco Hero', color: '#2E7D32' }; // Deep green
  } else if (totalKg < 3500) {
    return { rating: 4, label: 'Eco Conscious', color: '#4CAF50' }; // Standard green
  } else if (totalKg < 6000) {
    return { rating: 3, label: 'Moderate Footprint', color: '#FFB300' }; // Amber
  } else if (totalKg < 9000) {
    return { rating: 2, label: 'High Footprint', color: '#FB8C00' }; // Orange
  } else {
    return { rating: 1, label: 'Critically High', color: '#D32F2F' }; // Red
  }
}

/**
 * Generates action items based on questionnaire answers
 */
export function getRecommendedActions(answers) {
  const actions = [];

  // Transportation actions
  if (answers.transportType === 'car' && answers.transportKm > 10) {
    actions.push({
      id: 'transit_car_pool',
      title: 'Car pool or take public transit 2 days/week',
      category: 'transport',
      impact: 'Reduce transport emissions by ~25%',
      impactValue: Math.round(answers.transportKm * 365 * 0.180 * 0.25),
      difficulty: 'easy',
      priority: 'high',
      completed: false
    });
  }
  if (answers.transportType !== 'walk' && answers.transportType !== 'bike' && answers.transportKm < 5) {
    actions.push({
      id: 'transit_active',
      title: 'Walk or bike for short trips under 3km',
      category: 'transport',
      impact: 'Eliminate transport emissions for short trips',
      impactValue: Math.round(answers.transportKm * 365 * (EMISSION_FACTORS.transport[answers.transportType] || 0) * 0.4),
      difficulty: 'easy',
      priority: 'medium',
      completed: false
    });
  }
  if (answers.transportType === 'flight') {
    actions.push({
      id: 'transit_flights',
      title: 'Offset flights or choose rail alternative for regional travel',
      category: 'transport',
      impact: 'Reduce aviation footprint by up to 50%',
      impactValue: Math.round(answers.transportKm * 365 * 0.254 * 0.5),
      difficulty: 'medium',
      priority: 'high',
      completed: false
    });
  }

  // Food actions
  if (answers.diet === 'meat') {
    actions.push({
      id: 'food_vegetarian_days',
      title: 'Participate in Meatless Mondays (3 vegetarian/vegan days a week)',
      category: 'food',
      impact: 'Reduce diet carbon emissions by ~20%',
      impactValue: Math.round((EMISSION_FACTORS.food.meat - EMISSION_FACTORS.food.vegetarian) * 365 * 0.4),
      difficulty: 'easy',
      priority: 'high',
      completed: false
    });
    actions.push({
      id: 'food_switch_vegan',
      title: 'Incorporate 1 full plant-based day weekly',
      category: 'food',
      impact: 'Reduce diet footprint by 10%',
      impactValue: Math.round((EMISSION_FACTORS.food.meat - EMISSION_FACTORS.food.vegan) * 365 * (1/7)),
      difficulty: 'easy',
      priority: 'medium',
      completed: false
    });
  } else if (answers.diet === 'mixed') {
    actions.push({
      id: 'food_switch_veg',
      title: 'Transition from mixed diet to primarily vegetarian',
      category: 'food',
      impact: 'Reduce diet footprint by 15%',
      impactValue: Math.round((EMISSION_FACTORS.food.mixed - EMISSION_FACTORS.food.vegetarian) * 365),
      difficulty: 'medium',
      priority: 'medium',
      completed: false
    });
  }

  // Electricity actions
  if (answers.electricity === 'high' || answers.electricity === 'medium') {
    actions.push({
      id: 'utility_led',
      title: 'Upgrade home lighting to smart LEDs',
      category: 'utilities',
      impact: 'Save up to 10% on home electricity footprint',
      impactValue: Math.round((EMISSION_FACTORS.electricity[answers.electricity] || 0) * 12 * 0.1),
      difficulty: 'easy',
      priority: 'high',
      completed: false
    });
    actions.push({
      id: 'utility_vampire_draw',
      title: 'Unplug idle electronics or use smart power strips',
      category: 'utilities',
      impact: 'Save 5% on phantom electricity load',
      impactValue: Math.round((EMISSION_FACTORS.electricity[answers.electricity] || 0) * 12 * 0.05),
      difficulty: 'easy',
      priority: 'medium',
      completed: false
    });
  }

  // Water actions
  if (answers.water === 'high' || answers.water === 'medium') {
    actions.push({
      id: 'utility_shower_timer',
      title: 'Limit showers to 5 minutes',
      category: 'utilities',
      impact: 'Reduce water-heating emissions and usage by ~30%',
      impactValue: Math.round((EMISSION_FACTORS.water[answers.water] || 0) * 12 * 0.3),
      difficulty: 'easy',
      priority: 'medium',
      completed: false
    });
  }

  // Shopping actions
  if (answers.shopping === 'high' || answers.shopping === 'medium') {
    actions.push({
      id: 'shop_secondhand',
      title: 'Buy clothing and electronics secondhand first',
      category: 'shopping',
      impact: 'Reduce consumer goods footprint by 40%',
      impactValue: Math.round((EMISSION_FACTORS.shopping[answers.shopping] || 0) * 12 * 0.4),
      difficulty: 'medium',
      priority: 'high',
      completed: false
    });
    actions.push({
      id: 'shop_zero_waste',
      title: 'Bring reusable bags and buy items in bulk packaging',
      category: 'shopping',
      impact: 'Reduce packaging-related carbon by 15%',
      impactValue: Math.round((EMISSION_FACTORS.shopping[answers.shopping] || 0) * 12 * 0.15),
      difficulty: 'easy',
      priority: 'medium',
      completed: false
    });
  }

  // Waste actions
  if (answers.waste === 'high' || answers.waste === 'medium') {
    actions.push({
      id: 'waste_compost',
      title: 'Compost organic kitchen and yard waste',
      category: 'waste',
      impact: 'Divert methane emissions, saving 30% on waste footprint',
      impactValue: Math.round((EMISSION_FACTORS.waste[answers.waste] || 0) * 12 * 0.3),
      difficulty: 'medium',
      priority: 'high',
      completed: false
    });
    actions.push({
      id: 'waste_recycle',
      title: 'Follow local recycling guidelines thoroughly',
      category: 'waste',
      impact: 'Reduce landfill carbon output by 10%',
      impactValue: Math.round((EMISSION_FACTORS.waste[answers.waste] || 0) * 12 * 0.1),
      difficulty: 'easy',
      priority: 'medium',
      completed: false
    });
  }

  if (actions.length < 3) {
    actions.push({
      id: 'general_carbon_offset',
      title: 'Support certified carbon elimination initiatives',
      category: 'utilities',
      impact: 'Offset remaining emissions by 100%',
      impactValue: 500,
      difficulty: 'medium',
      priority: 'low',
      completed: false
    });
  }

  return actions;
}
