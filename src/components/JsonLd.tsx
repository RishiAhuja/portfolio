// components/JsonLd.tsx
'use client';

import { useEffect } from 'react';

interface JsonLdProps {
  data: Record<string, unknown>; // More specific than 'any'
}

const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  useEffect(() => {
    // Remove any existing schema script
    const existingScript = document.getElementById('json-ld-schema');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new schema script
    const script = document.createElement('script');
    script.id = 'json-ld-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      const scriptToRemove = document.getElementById('json-ld-schema');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [data]);

  return null;
};

export default JsonLd;