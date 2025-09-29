// Utility functions for local SEO implementation

export interface BusinessInfo {
  name: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  phone: string;
  email?: string;
}

// Format phone number consistently across all pages
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone; // Return original if can't format
}

// Ensure consistent NAP formatting across all pages
export function formatNAP(business: BusinessInfo) {
  return {
    name: business.name,
    address: `${business.address.streetAddress}, ${business.address.addressLocality}, ${business.address.addressRegion} ${business.address.postalCode}`,
    phone: formatPhoneNumber(business.phone)
  };
}

// Generate location-based keywords
export function generateLocalKeywords(
  baseKeywords: string[], 
  location: string,
  businessType: string
): string[] {
  const locationVariations = [
    location,
    `${location} area`,
    `near ${location}`,
    `in ${location}`,
    'near me'
  ];

  const localKeywords: string[] = [];

  // Add base keywords with location modifiers
  baseKeywords.forEach(keyword => {
    locationVariations.forEach(loc => {
      localKeywords.push(`${keyword} ${loc}`);
      localKeywords.push(`${keyword} ${loc.toLowerCase()}`);
    });
  });

  // Add business type with location
  locationVariations.forEach(loc => {
    localKeywords.push(`${businessType} ${loc}`);
    localKeywords.push(`${businessType} ${loc.toLowerCase()}`);
  });

  // Remove duplicates and return
  return [...new Set(localKeywords)];
}

// Generate local business structured data
export function generateLocalBusinessStructuredData(
  businessInfo: BusinessInfo & {
    website: string;
    businessType: string;
    description: string;
    openingHours?: string[];
    geoCoordinates?: { latitude: number; longitude: number };
    socialProfiles?: string[];
    aggregateRating?: { ratingValue: number; reviewCount: number };
    image?: string;
    logo?: string;
  }
) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": businessInfo.website,
    "name": businessInfo.name,
    "description": businessInfo.description,
    "url": businessInfo.website,
    "telephone": businessInfo.phone,
    "email": businessInfo.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": businessInfo.address.streetAddress,
      "addressLocality": businessInfo.address.addressLocality,
      "addressRegion": businessInfo.address.addressRegion,
      "postalCode": businessInfo.address.postalCode,
      "addressCountry": businessInfo.address.addressCountry
    },
    "geo": businessInfo.geoCoordinates ? {
      "@type": "GeoCoordinates",
      "latitude": businessInfo.geoCoordinates.latitude,
      "longitude": businessInfo.geoCoordinates.longitude
    } : undefined,
    "openingHoursSpecification": businessInfo.openingHours?.map(hours => {
      const [day, opens, closes] = hours.split(' ');
      return {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": day,
        "opens": opens,
        "closes": closes
      };
    }),
    "image": businessInfo.image,
    "logo": businessInfo.logo,
    "sameAs": businessInfo.socialProfiles,
    "aggregateRating": businessInfo.aggregateRating ? {
      "@type": "AggregateRating",
      "ratingValue": businessInfo.aggregateRating.ratingValue,
      "reviewCount": businessInfo.aggregateRating.reviewCount
    } : undefined,
    "additionalType": businessInfo.businessType
  };

  // Remove undefined values
  return JSON.parse(JSON.stringify(structuredData));
}

// Validate NAP consistency
export function validateNAPConsistency(napInstances: BusinessInfo[]): {
  isConsistent: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  if (napInstances.length < 2) {
    return { isConsistent: true, issues: [] };
  }

  const reference = napInstances[0];
  
  for (let i = 1; i < napInstances.length; i++) {
    const current = napInstances[i];
    
    if (current.name !== reference.name) {
      issues.push(`Business name inconsistency: "${current.name}" vs "${reference.name}"`);
    }
    
    if (current.phone !== reference.phone) {
      issues.push(`Phone number inconsistency: "${current.phone}" vs "${reference.phone}"`);
    }
    
    if (JSON.stringify(current.address) !== JSON.stringify(reference.address)) {
      issues.push(`Address inconsistency detected`);
    }
    
    if (current.email !== reference.email) {
      issues.push(`Email inconsistency: "${current.email}" vs "${reference.email}"`);
    }
  }
  
  return {
    isConsistent: issues.length === 0,
    issues
  };
}

// Generate local SEO meta tags
export function generateLocalSEOMetaTags(
  title: string,
  description: string,
  location: string,
  businessName: string,
  keywords: string[],
  canonicalUrl: string
) {
  const localKeywords = generateLocalKeywords(keywords, location, businessName);
  
  return {
    title: `${title} | ${location}`,
    description: `${description} Serving ${location} and surrounding areas.`,
    keywords: localKeywords.join(', '),
    canonical: canonicalUrl,
    openGraph: {
      title: `${title} | ${location}`,
      description: `${description} Serving ${location} and surrounding areas.`,
      type: 'business.business',
      url: canonicalUrl,
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${location}`,
      description: `${description} Serving ${location} and surrounding areas.`
    }
  };
}

// Google Business Profile optimization suggestions
export const googleBusinessProfileTips = {
  profile: [
    "Complete all business information fields",
    "Add high-quality photos of your business, products, and services",
    "Verify your business address and phone number",
    "Choose the most accurate business categories",
    "Write a compelling business description with local keywords"
  ],
  posts: [
    "Post regular updates about your business",
    "Share photos of recent work or products",
    "Announce special offers and events",
    "Respond to customer questions in posts",
    "Use local hashtags and location tags"
  ],
  reviews: [
    "Encourage satisfied customers to leave reviews",
    "Respond to all reviews professionally and promptly",
    "Address negative reviews constructively",
    "Thank customers for positive feedback",
    "Use review responses to showcase your customer service"
  ],
  optimization: [
    "Keep business hours updated, especially during holidays",
    "Add special hours for events or seasonal changes",
    "Upload new photos regularly to keep profile fresh",
    "Use Google Posts to share timely updates",
    "Monitor and respond to customer questions quickly"
  ]
};