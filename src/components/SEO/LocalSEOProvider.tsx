import React, { createContext, useContext, ReactNode } from 'react';

interface LocalSEOContextType {
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
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

const LocalSEOContext = createContext<LocalSEOContextType | undefined>(undefined);

interface LocalSEOProviderProps {
  children: ReactNode;
  config: LocalSEOContextType;
}

export function LocalSEOProvider({ children, config }: LocalSEOProviderProps) {
  return (
    <LocalSEOContext.Provider value={config}>
      {children}
    </LocalSEOContext.Provider>
  );
}

export function useLocalSEOContext() {
  const context = useContext(LocalSEOContext);
  if (context === undefined) {
    throw new Error('useLocalSEOContext must be used within a LocalSEOProvider');
  }
  return context;
}