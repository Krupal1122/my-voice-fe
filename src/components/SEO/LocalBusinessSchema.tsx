import React from 'react';

interface LocalBusinessSchemaProps {
  businessName: string;
  description: string;
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
  priceRange?: string;
  image?: string;
  logo?: string;
  socialProfiles?: string[];
  geoCoordinates?: {
    latitude: number;
    longitude: number;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

export function LocalBusinessSchema({
  businessName,
  description,
  address,
  phone,
  email,
  website,
  businessType,
  openingHours,
  priceRange,
  image,
  logo,
  socialProfiles,
  geoCoordinates,
  aggregateRating
}: LocalBusinessSchemaProps) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": website,
    "name": businessName,
    "description": description,
    "url": website,
    "telephone": phone,
    "email": email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.streetAddress,
      "addressLocality": address.addressLocality,
      "addressRegion": address.addressRegion,
      "postalCode": address.postalCode,
      "addressCountry": address.addressCountry
    },
    "geo": geoCoordinates ? {
      "@type": "GeoCoordinates",
      "latitude": geoCoordinates.latitude,
      "longitude": geoCoordinates.longitude
    } : undefined,
    "openingHoursSpecification": openingHours.map(hours => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": hours.split(' ')[0],
      "opens": hours.split(' ')[1],
      "closes": hours.split(' ')[2]
    })),
    "priceRange": priceRange,
    "image": image,
    "logo": logo,
    "sameAs": socialProfiles,
    "aggregateRating": aggregateRating ? {
      "@type": "AggregateRating",
      "ratingValue": aggregateRating.ratingValue,
      "reviewCount": aggregateRating.reviewCount
    } : undefined,
    "additionalType": businessType
  };

  // Remove undefined values
  const cleanedSchema = JSON.parse(JSON.stringify(schemaData));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(cleanedSchema, null, 2)
      }}
    />
  );
}