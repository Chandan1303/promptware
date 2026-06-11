// Google Analytics Integration
// Note: This is a simplified implementation. 
// For production, consider using react-ga4 or gtag.js directly

let analyticsInitialized = false;

export const initializeAnalytics = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  
  if (!measurementId || analyticsInitialized) {
    return;
  }

  // Load Google Analytics gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', measurementId, {
    send_page_view: true
  });

  analyticsInitialized = true;
  console.log('Google Analytics initialized:', measurementId);
};

// Track custom events
export const trackEvent = (eventName, eventParams = {}) => {
  if (window.gtag && analyticsInitialized) {
    window.gtag('event', eventName, eventParams);
  }
};

// Track page views
export const trackPageView = (pagePath) => {
  if (window.gtag && analyticsInitialized) {
    window.gtag('event', 'page_view', {
      page_path: pagePath
    });
  }
};

export const analytics = {
  logEvent: trackEvent,
  logPageView: trackPageView
};
