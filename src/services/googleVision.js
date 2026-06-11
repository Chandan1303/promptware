// Google Cloud Vision API Integration
// Analyzes receipts and documents for carbon footprint tracking

/**
 * Analyze image using Google Cloud Vision API
 * @param {File|string} image - Image file or base64 string
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzeImage(image) {
  const apiKey = import.meta.env.VITE_GOOGLE_VISION_API_KEY;
  
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_vision_api_key_here') {
    console.warn('Google Vision API key not configured');
    return { error: 'API key not configured', texts: [], labels: [] };
  }

  try {
    let base64Image;
    
    // Convert File to base64 if needed
    if (image instanceof File) {
      base64Image = await fileToBase64(image);
    } else {
      base64Image = image;
    }

    // Remove data URL prefix if present
    if (base64Image.includes('base64,')) {
      base64Image = base64Image.split('base64,')[1];
    }

    const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    
    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image
          },
          features: [
            { type: 'TEXT_DETECTION', maxResults: 10 },
            { type: 'LABEL_DETECTION', maxResults: 10 },
            { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 1 }
          ]
        }
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Vision API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.responses[0];

    return {
      texts: result.textAnnotations || [],
      labels: result.labelAnnotations || [],
      fullText: result.fullTextAnnotation?.text || '',
      success: true
    };

  } catch (error) {
    console.error('Vision API error:', error);
    return {
      error: error.message,
      texts: [],
      labels: [],
      fullText: ''
    };
  }
}

/**
 * Analyze receipt for carbon-relevant items
 * @param {File} receiptImage - Receipt image file
 * @returns {Promise<Object>} Extracted receipt data with carbon estimates
 */
export async function analyzeReceipt(receiptImage) {
  const apiKey = import.meta.env.VITE_GOOGLE_VISION_API_KEY;
  
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_vision_api_key_here') {
    console.warn('Vision API key not configured, using demo fallback');
    return getDemoReceiptAnalysis();
  }

  const analysis = await analyzeImage(receiptImage);
  
  if (analysis.error) {
    console.warn('Vision API error, using demo fallback');
    return getDemoReceiptAnalysis();
  }

  // Extract items and prices from text
  const items = extractReceiptItems(analysis.fullText);
  
  // Estimate carbon footprint based on detected items
  const carbonEstimates = items.map(item => ({
    ...item,
    carbonKg: estimateItemCarbon(item.description, item.price)
  }));

  const totalCarbon = carbonEstimates.reduce((sum, item) => sum + item.carbonKg, 0);

  return {
    items: carbonEstimates,
    totalCarbon: totalCarbon.toFixed(2),
    labels: analysis.labels.map(l => l.description),
    success: true
  };
}

/**
 * Extract items from receipt text
 * @param {string} text - Receipt text
 * @returns {Array} Array of items with description and price
 */
function extractReceiptItems(text) {
  if (!text) return [];

  const lines = text.split('\n');
  const items = [];

  // Simple pattern matching for item lines (text followed by price)
  const pricePattern = /\$?\d+\.\d{2}/;
  
  lines.forEach((line, index) => {
    const priceMatch = line.match(pricePattern);
    if (priceMatch && index > 0) {
      const description = lines[index - 1] || line.split(priceMatch[0])[0];
      const price = parseFloat(priceMatch[0].replace('$', ''));
      
      if (description.trim() && price > 0) {
        items.push({
          description: description.trim(),
          price: price
        });
      }
    }
  });

  return items;
}

/**
 * Estimate carbon footprint for a purchase item
 * @param {string} description - Item description
 * @param {number} price - Item price
 * @returns {number} Estimated carbon in kg
 */
function estimateItemCarbon(description, price) {
  const lowerDesc = description.toLowerCase();
  
  // Carbon intensity estimates (kg CO2 per dollar spent)
  const carbonFactors = {
    // Food categories
    beef: 0.027,
    meat: 0.022,
    chicken: 0.007,
    fish: 0.006,
    dairy: 0.009,
    cheese: 0.014,
    milk: 0.004,
    vegetables: 0.002,
    fruit: 0.003,
    
    // Product categories
    electronics: 0.015,
    clothing: 0.012,
    plastic: 0.006,
    paper: 0.003,
    
    // Default
    default: 0.008
  };

  // Check for keywords
  for (const [key, factor] of Object.entries(carbonFactors)) {
    if (lowerDesc.includes(key)) {
      return price * factor;
    }
  }

  // Default carbon factor if no match
  return price * carbonFactors.default;
}

/**
 * Convert File to base64 string
 * @param {File} file - File object
 * @returns {Promise<string>} Base64 string
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Detect text in image (OCR)
 * @param {File} image - Image file
 * @returns {Promise<string>} Extracted text
 */
export async function detectText(image) {
  const analysis = await analyzeImage(image);
  return analysis.fullText || '';
}

/**
 * Detect labels/objects in image
 * @param {File} image - Image file
 * @returns {Promise<Array>} Array of labels
 */
export async function detectLabels(image) {
  const analysis = await analyzeImage(image);
  return analysis.labels.map(label => ({
    name: label.description,
    confidence: label.score
  }));
}

function getDemoReceiptAnalysis() {
  const mockItems = [
    { description: 'Organic Almond Milk', price: 4.49, carbonKg: 4.49 * 0.004 },
    { description: 'Fresh Salad Tomatoes', price: 3.29, carbonKg: 3.29 * 0.002 },
    { description: 'Grass-fed Beef Steak', price: 18.99, carbonKg: 18.99 * 0.027 },
    { description: 'Whole Wheat Bread', price: 3.99, carbonKg: 3.99 * 0.003 },
    { description: 'Cotton T-Shirt', price: 22.00, carbonKg: 22.00 * 0.012 }
  ];
  
  const totalCarbon = mockItems.reduce((sum, item) => sum + item.carbonKg, 0);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        items: mockItems,
        totalCarbon: totalCarbon.toFixed(2),
        labels: ['Receipt', 'Paper', 'Shopping', 'Product', 'Invoice'],
        demo: true,
        success: true
      });
    }, 1500);
  });
}
