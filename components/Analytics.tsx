import React, { useEffect } from 'react';

// Define types for window to avoid TypeScript errors
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const GA_MEASUREMENT_ID = 'G-YOUR-ACTUAL-ID'; // TODO: Replace with your actual GA4 Measurement ID

export const Analytics: React.FC = () => {
  useEffect(() => {
    // 1. Check for Production Environment
    // This ensures we don't track events during development or testing
    if (process.env.NODE_ENV !== 'production') {
      console.log('Analytics: Skipped (Not in Production)');
      return;
    }

    // 2. Load the Google Analytics Script Asynchronously
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // 3. Initialize dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    
    // Make gtag available globally
    window.gtag = gtag;

    // 4. Configure GA4
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: true, // Automatically send page view
      anonymize_ip: true    // Privacy compliance: Anonymize IP addresses
    });

    // Cleanup (Optional)
    return () => {
      // We generally don't remove the script to avoid issues with SPAs, 
      // but if you needed to clean up, you would do it here.
    };
  }, []);

  // This component renders nothing visually
  return null;
};