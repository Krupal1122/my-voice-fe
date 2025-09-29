import React from 'react';

interface LocalSEOHeadProps {
  title: string;
  description: string;
  businessName: string;
  location: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage?: string;
  businessType?: string;
}

export function LocalSEOHead({
  title,
  description,
  businessName,
  location,
  keywords,
  canonicalUrl,
  ogImage,
  businessType = 'Local Business'
}: LocalSEOHeadProps) {
  const localKeywords = [
    ...keywords,
    `${businessName} ${location}`,
    `${businessType} ${location}`,
    `${businessType} near me`,
    location
  ];

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={localKeywords.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="business.business" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content="en_US" />
      <meta property="business:contact_data:locality" content={location} />
      <meta property="business:contact_data:region" content={location} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Local Business Specific Meta Tags */}
      <meta name="geo.region" content={location} />
      <meta name="geo.placename" content={location} />
      <meta name="ICBM" content="40.7128,-74.0060" /> {/* Replace with actual coordinates */}

      {/* Additional Local SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="googlebot" content="index, follow" />
    </>
  );
}