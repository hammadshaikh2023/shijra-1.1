import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  structuredData?: object; // JSON-LD
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = "Build your family's digital legacy with Shijra.", 
  image = "https://shijra.app/og-image.jpg", 
  url = "https://shijra.app",
  structuredData 
}) => {
  
  // Update Meta Tags Dynamically
  useEffect(() => {
    // Update Title
    document.title = title;

    // Helper to update meta tags
    const updateMeta = (name: string, content: string, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', description);
    
    // OG Tags
    updateMeta('og:title', title, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:image', image, 'property');
    updateMeta('og:url', url, 'property');

    // Twitter Tags
    updateMeta('twitter:title', title, 'property');
    updateMeta('twitter:description', description, 'property');
    updateMeta('twitter:image', image, 'property');

    // Hreflang Tags (English & Urdu)
    // Removing existing to avoid duplicates before adding
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
    
    const linkEn = document.createElement('link');
    linkEn.rel = 'alternate';
    linkEn.hreflang = 'en';
    linkEn.href = url;
    document.head.appendChild(linkEn);

    const linkUr = document.createElement('link');
    linkUr.rel = 'alternate';
    linkUr.hreflang = 'ur';
    linkUr.href = `${url}/ur`;
    document.head.appendChild(linkUr);

  }, [title, description, image, url]);

  // Inject JSON-LD Schema
  useEffect(() => {
    if (!structuredData) return;

    const scriptId = 'shijra-json-ld';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(structuredData);

    return () => {
      // Optional: Cleanup if moving between very different pages
      // script.remove(); 
    };
  }, [structuredData]);

  return null; // This is a logic-only component
};
