import { useEffect } from 'react';

interface LocalSEOConfig {
  businessName: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  phone: string;
  email?: string;
  website: string;
  businessType: string;
  openingHours: string[];
  geoCoordinates?: {
    latitude: number;
    longitude: number;
  };
  socialProfiles?: string[];
}

export function useLocalSEO(config: LocalSEOConfig) {
  useEffect(() => {
    // Add structured data to the page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": config.businessName,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": config.address.streetAddress,
        "addressLocality": config.address.addressLocality,
        "addressRegion": config.address.addressRegion,
        "postalCode": config.address.postalCode,
        "addressCountry": config.address.addressCountry
      },
      "geo": config.geoCoordinates ? {
        "@type": "GeoCoordinates",
        "latitude": config.geoCoordinates.latitude,
        "longitude": config.geoCoordinates.longitude
      } : undefined,
      "url": config.website,
      "telephone": config.phone,
      "email": config.email,
      "openingHoursSpecification": config.openingHours.map(hours => {
        const [day, opens, closes] = hours.split(' ');
        return {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": day,
          "opens": opens,
          "closes": closes
        };
      }),
      "sameAs": config.socialProfiles,
      "additionalType": config.businessType
    }, null, 2);

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [config]);

  // Utility functions for local SEO
  const formatNAP = () => ({
    name: config.businessName,
    address: `${config.address.streetAddress}, ${config.address.addressLocality}, ${config.address.addressRegion} ${config.address.postalCode}`,
    phone: config.phone
  });

  const generateLocalKeywords = (baseKeywords: string[]) => {
    const locationKeywords = [
      config.address.addressLocality,
      config.address.addressRegion,
      `${config.address.addressLocality} ${config.address.addressRegion}`,
      'near me',
      `in ${config.address.addressLocality}`,
      `${config.address.addressLocality} area`
    ];

    return [
      ...baseKeywords,
      ...baseKeywords.flatMap(keyword => 
        locationKeywords.map(location => `${keyword} ${location}`)
      )
    ];
  };

  const generateLocalTitle = (baseTitle: string) => {
    return `${baseTitle} | ${config.address.addressLocality}, ${config.address.addressRegion}`;
  };

  const generateLocalDescription = (baseDescription: string) => {
    return `${baseDescription} Serving ${config.address.addressLocality}, ${config.address.addressRegion} and surrounding areas.`;
  };

  return {
    formatNAP,
    generateLocalKeywords,
    generateLocalTitle,
    generateLocalDescription,
    config
  };
}