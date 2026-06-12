// Google Maps API Integration
// Provides carbon footprint calculation for transportation routes

let mapsLoaded = false;

export async function initGoogleMaps() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_maps_api_key_here') {
    console.warn('Google Maps API key not configured');
    return null;
  }

  if (mapsLoaded && window.google && window.google.maps) {
    return window.google;
  }

  try {
    // Load Google Maps script dynamically
    await new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        mapsLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        mapsLoaded = true;
        resolve();
      };
      script.onerror = (error) => reject(error);
      document.head.appendChild(script);
    });

    console.log('✅ Google Maps API loaded successfully');
    return window.google;
  } catch (error) {
    console.error('Failed to load Google Maps API:', error);
    return null;
  }
}

/**
 * Calculate carbon footprint for a route
 * @param {string} origin - Starting location
 * @param {string} destination - Ending location
 * @param {string} mode - Transportation mode (driving, transit, bicycling, walking)
 * @returns {Promise<Object>} Route info with carbon estimate
 */
export async function calculateRouteCarbonFootprint(origin, destination, mode = 'driving') {
  await initGoogleMaps();

  if (!window.google || !window.google.maps) {
    // Fallback demo mode when API is not available
    console.warn('Maps API not available, using demo mode');
    return getDemoRoute(origin, destination, mode);
  }

  try {
    const directionsService = new google.maps.DirectionsService();
    
    const request = {
      origin: origin,
      destination: destination,
      travelMode: mode.toUpperCase()
    };

    const result = await new Promise((resolve, reject) => {
      directionsService.route(request, (result, status) => {
        if (status === 'OK') {
          resolve(result);
        } else {
          reject(new Error(`Directions request failed: ${status}`));
        }
      });
    });

    const route = result.routes[0];
    const leg = route.legs[0];
    const distanceKm = leg.distance.value / 1000; // Convert meters to km

    // Carbon emission factors (kg CO2 per km)
    const emissionFactors = {
      DRIVING: 0.171,    // Average car
      TRANSIT: 0.089,    // Public transport
      BICYCLING: 0,      // Zero emissions
      WALKING: 0         // Zero emissions
    };

    const carbonKg = distanceKm * (emissionFactors[mode.toUpperCase()] || 0);

    return {
      distance: leg.distance.text,
      distanceKm: distanceKm.toFixed(2),
      duration: leg.duration.text,
      carbonKg: carbonKg.toFixed(2),
      mode: mode,
      route: route
    };

  } catch (error) {
    console.error('Route calculation error:', error);
    return getDemoRoute(origin, destination, mode);
  }
}

/**
 * Demo mode fallback when API key has issues
 */
function getDemoRoute(origin, destination, mode) {
  // Estimate distance based on typical routes
  const estimates = {
    'san francisco': { lat: 37.7749, lng: -122.4194 },
    'los angeles': { lat: 34.0522, lng: -118.2437 },
    'new york': { lat: 40.7128, lng: -74.0060 },
    'boston': { lat: 42.3601, lng: -71.0589 },
    'chicago': { lat: 41.8781, lng: -87.6298 },
    'seattle': { lat: 47.6062, lng: -122.3321 }
  };

  const originKey = origin.toLowerCase().split(',')[0].trim();
  const destKey = destination.toLowerCase().split(',')[0].trim();

  // Calculate rough distance (if cities are in our database)
  let distanceKm = 100; // default
  if (estimates[originKey] && estimates[destKey]) {
    const o = estimates[originKey];
    const d = estimates[destKey];
    // Haversine distance approximation
    const R = 6371; // Earth's radius in km
    const dLat = (d.lat - o.lat) * Math.PI / 180;
    const dLng = (d.lng - o.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(o.lat * Math.PI / 180) * Math.cos(d.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    distanceKm = Math.round(R * c);
  }

  // Carbon emission factors (kg CO2 per km)
  const emissionFactors = {
    driving: 0.171,
    transit: 0.089,
    bicycling: 0,
    walking: 0
  };

  const carbonKg = (distanceKm * (emissionFactors[mode.toLowerCase()] || 0)).toFixed(2);
  const hours = Math.round(distanceKm / (mode === 'driving' ? 80 : mode === 'transit' ? 60 : mode === 'bicycling' ? 20 : 5));
  const minutes = Math.round((distanceKm / (mode === 'driving' ? 80 : mode === 'transit' ? 60 : mode === 'bicycling' ? 20 : 5) - hours) * 60);

  return {
    distance: `${distanceKm} km`,
    distanceKm: distanceKm.toFixed(2),
    duration: hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ${minutes} min` : `${minutes} minutes`,
    carbonKg: carbonKg,
    mode: mode,
    demo: true
  };
}

/**
 * Get autocomplete suggestions for locations
 * @param {string} input - User input
 * @returns {Promise<Array>} Array of place predictions
 */
export async function getPlaceAutocomplete(input) {
  await initGoogleMaps();

  if (!window.google || !window.google.maps || !input || input.trim() === '') {
    return [];
  }

  try {
    const autocompleteService = new google.maps.places.AutocompleteService();
    
    const predictions = await new Promise((resolve, _reject) => {
      autocompleteService.getPlacePredictions(
        { input: input },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve(predictions || []);
          } else {
            resolve([]);
          }
        }
      );
    });

    return predictions.map(p => ({
      description: p.description,
      placeId: p.place_id
    }));

  } catch (error) {
    console.error('Autocomplete error:', error);
    return [];
  }
}
