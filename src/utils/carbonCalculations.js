/**
 * Carbon Footprint Calculation Utilities
 * Provides functions to calculate carbon emissions from various lifestyle factors
 * All emission factors are based on scientific research and environmental data
 * 
 * @module utils/carbonCalculations
 */

/**
 * Emission factors in kg CO2 per unit
 * Sources: EPA, DEFRA, and peer-reviewed carbon footprint studies
 * @constant
 */
export const EMISSION_FACTORS = {
  transport: {
    walk: 0,
    bike: 0,
    bus: 0.089,   // per km - Public bus average
    train: 0.041, // per km - Commuter rail
    car: 0.180,   // per km - Average gasoline car
    flight: 0.254 // per km - Commercial aviation
  },
  food: {
    vegan: 1.5,        // per day - Plant-based diet
    vegetarian: 1.7,   // per day - Lacto-ovo vegetarian
    mixed: 2.5,        // per day - Balanced omnivore
    meat: 3.3          // per day - High meat consumption
  },
  electricity: {
    low: 40,       // per month - Energy-efficient household
    medium: 120,   // per month - Average household
    high: 240      // per month - High-usage household
  },
  water: {
    low: 0.5,      // per month - Low water usage
    medium: 1.5,   // per month - Average usage
    high: 3.0      // per month - High usage
  },
  shopping: {
    low: 50,       // per month - Minimal consumer goods
    medium: 150,   // per month - Average consumption
    high: 350      // per month - High consumption
  },
  waste: {
    low: 10,       // per month - Low waste, high recycling
    medium: 30,    // per month - Average waste
    high: 60       // per month - High waste generation
  }
};

/**
 * Leaf rating thresholds in kg CO2/year
 * @constant
 */
const LEAF_THRESHOLDS = {
  HERO: 1500,
  CONSCIOUS: 3500,
  MODERATE: 6000,
  HIGH: 9000
};

/**
 * Validates carbon calculation input data
 * @param {Object} answers - User's lifestyle answers
 * @returns {Object} Validation result
 * @private
 */
function validateAnswers(answers) {
  const errors = [];
  
  if (!answers || typeof answers !== 'object') {
    errors.push('Invalid answers object');
    return { isValid: false, errors };
  }
  
  if (!EMISSION_FACTORS.transport[answers.transportType]) {
    errors.push('Invalid transport type');
  }
  
  if (typeof answers.transportKm !== 'number' || answers.transportKm < 0) {
    errors.push('Invalid transport distance');
  }
  
  if (!EMISSION_FACTORS.food[answers.diet]) {
    errors.push('Invalid diet type');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Calculates the user's annual carbon footprint breakdown in kg CO2/year
 * @param {Object} answers - User's lifestyle answers
 * @param {string} answers.transportType - Type of transportation (walk|bike|bus|train|car|flight)
 * @param {number} answers.transportKm - Daily kilometers traveled
 * @param {string} answers.diet - Diet type (vegan|vegetarian|mixed|meat)
 * @param {string} answers.electricity - Electricity usage (low|medium|high)
 * @param {string} answers.water - Water usage (low|medium|high)
 * @param {string} answers.shopping - Shopping frequency (low|medium|high)
 * @param {string} answers.waste - Waste generation (low|medium|high)
 * @returns {Object} Carbon footprint breakdown by category
 * @example
 * const footprint = calculateCarbonFootprint({
 *   transportType: 'car',
 *   transportKm: 20,
 *   diet: 'mixed',
 *   electricity: 'medium',
 *   water: 'medium',
 *   shopping: 'medium',
 *   waste: 'medium'
 * });
 * // Returns: { transport: 1314, food: 913, utilities: 1458, shopping: 1800, waste: 360, total: 5845 }
 */
export function calculateCarbonFootprint(answers) {
  // Validate input
  const validation = validateAnswers(answers);
  if (!validation.isValid) {
    console.error('Invalid carbon calculation input:', validation.errors);
    return {
      transport: 0,
      food: 0,
      utilities: 0,
      shopping: 0,
      waste: 0,
      total: 0,
      error: 'Invalid input data'
    };
  }
  
  // Transport: daily km * 365 days * emission factor
  const transportFactor = EMISSION_FACTORS.transport[answers.transportType] || 0;
  const transport = Math.round(answers.transportKm * 365 * transportFactor);

  // Food: daily emissions * 365 days
  const foodFactor = EMISSION_FACTORS.food[answers.diet] || 0;
  const food = Math.round(foodFactor * 365);

  // Utilities: (electricity + water) per month * 12 months
  const electricity = EMISSION_FACTORS.electricity[answers.electricity] || 0;
  const water = EMISSION_FACTORS.water[answers.water] || 0;
  const utilities = Math.round((electricity + water) * 12);

  // Shopping: monthly emissions * 12 months
  const shoppingFactor = EMISSION_FACTORS.shopping[answers.shopping] || 0;
  const shopping = Math.round(shoppingFactor * 12);

  // Waste: monthly emissions * 12 months
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
 * Get sustainability rating (1 to 5 leaves) based on yearly carbon total
 * @param {number} totalKg - Total annual carbon emissions in kg CO2
 * @returns {Object} Rating object with rating level, label, and color
 * @example
 * const rating = getLeafRating(2500);
 * // Returns: { rating: 4, label: 'Eco Conscious', color: '#4CAF50' }
 */
export function getLeafRating(totalKg) {
  if (typeof totalKg !== 'number' || totalKg < 0) {
    console.warn('Invalid totalKg value:', totalKg);
    return { rating: 0, label: 'Unknown', color: '#999999' };
  }
  
  if (totalKg < LEAF_THRESHOLDS.HERO) {
    return {
      rating: 5,
      label: 'Eco Hero',
      color: '#2E7D32',
      description: 'Outstanding! You\'re a sustainability leader.'
    };
  }
  
  if (totalKg < LEAF_THRESHOLDS.CONSCIOUS) {
    return {
      rating: 4,
      label: 'Eco Conscious',
      color: '#4CAF50',
      description: 'Great work! You\'re making a positive impact.'
    };
  }
  
  if (totalKg < LEAF_THRESHOLDS.MODERATE) {
    return {
      rating: 3,
      label: 'Moderate Footprint',
      color: '#FFB300',
      description: 'Good progress with room for improvement.'
    };
  }
  
  if (totalKg < LEAF_THRESHOLDS.HIGH) {
    return {
      rating: 2,
      label: 'High Footprint',
      color: '#FB8C00',
      description: 'Significant changes will make a difference.'
    };
  }
  
  return {
    rating: 1,
    label: 'Critically High',
    color: '#D32F2F',
    description: 'Urgent action needed. Start with small steps!'
  };
}

/**
 * Generates personalized action items based on questionnaire answers
 * @param {Object} answers - User's lifestyle answers
 * @returns {Array<Object>} Array of recommended action objects
 * @example
 * const actions = getRecommendedActions(answers);
 * // Returns array of { id, title, category, impact, impactValue, difficulty, priority, completed }
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

  // Add general offset action if few actions available
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

/**
 * Calculates potential carbon savings from implementing recommended actions
 * @param {Array<Object>} actions - Array of action objects
 * @returns {number} Total potential savings in kg CO2/year
 */
export function calculatePotentialSavings(actions) {
  if (!Array.isArray(actions)) {
    return 0;
  }
  
  return actions.reduce((total, action) => {
    return total + (action.impactValue || 0);
  }, 0);
}

/**
 * Compares user's footprint to global averages
 * @param {number} totalKg - User's total annual emissions
 * @returns {Object} Comparison data
 */
export function compareToGlobalAverage(totalKg) {
  const GLOBAL_AVERAGE = 4700; // kg CO2/year
  const GLOBAL_TARGET = 2000;  // kg CO2/year (Paris Agreement target)
  
  return {
    userTotal: totalKg,
    globalAverage: GLOBAL_AVERAGE,
    globalTarget: GLOBAL_TARGET,
    percentageVsAverage: Math.round(((totalKg - GLOBAL_AVERAGE) / GLOBAL_AVERAGE) * 100),
    percentageVsTarget: Math.round(((totalKg - GLOBAL_TARGET) / GLOBAL_TARGET) * 100),
    isBelowAverage: totalKg < GLOBAL_AVERAGE,
    isBelowTarget: totalKg < GLOBAL_TARGET
  };
}
