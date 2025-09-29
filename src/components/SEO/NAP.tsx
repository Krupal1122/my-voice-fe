import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

interface NAPProps {
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
  openingHours?: string[];
  className?: string;
  showIcons?: boolean;
  variant?: 'full' | 'compact' | 'footer';
}

export function NAP({
  businessName,
  address,
  phone,
  email,
  openingHours,
  className = '',
  showIcons = true,
  variant = 'full'
}: NAPProps) {
  const formatAddress = () => {
    return `${address.streetAddress}, ${address.addressLocality}, ${address.addressRegion} ${address.postalCode}, ${address.addressCountry}`;
  };

  const formatPhone = (phoneNumber: string) => {
    // Remove all non-digits and format for display
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phoneNumber;
  };

  if (variant === 'compact') {
    return (
      <div className={`text-sm ${className}`}>
        <div className="flex items-center space-x-2 mb-1">
          {showIcons && <MapPin className="h-4 w-4 text-gray-500" />}
          <span>{formatAddress()}</span>
        </div>
        <div className="flex items-center space-x-2">
          {showIcons && <Phone className="h-4 w-4 text-gray-500" />}
          <a href={`tel:${phone}`} className="hover:text-blue-600 transition-colors">
            {formatPhone(phone)}
          </a>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`${className}`}>
        <h3 className="font-semibold text-lg mb-3">{businessName}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-start space-x-2">
            {showIcons && <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />}
            <address className="not-italic">
              {address.streetAddress}<br />
              {address.addressLocality}, {address.addressRegion} {address.postalCode}<br />
              {address.addressCountry}
            </address>
          </div>
          <div className="flex items-center space-x-2">
            {showIcons && <Phone className="h-4 w-4 text-gray-400" />}
            <a href={`tel:${phone}`} className="hover:text-blue-400 transition-colors">
              {formatPhone(phone)}
            </a>
          </div>
          {email && (
            <div className="flex items-center space-x-2">
              {showIcons && <Mail className="h-4 w-4 text-gray-400" />}
              <a href={`mailto:${email}`} className="hover:text-blue-400 transition-colors">
                {email}
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="font-semibold text-xl mb-4">{businessName}</h3>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          {showIcons && <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />}
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Address</h4>
            <address className="not-italic text-gray-600">
              {address.streetAddress}<br />
              {address.addressLocality}, {address.addressRegion} {address.postalCode}<br />
              {address.addressCountry}
            </address>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {showIcons && <Phone className="h-5 w-5 text-blue-600" />}
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Phone</h4>
            <a 
              href={`tel:${phone}`} 
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              {formatPhone(phone)}
            </a>
          </div>
        </div>

        {email && (
          <div className="flex items-center space-x-3">
            {showIcons && <Mail className="h-5 w-5 text-blue-600" />}
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Email</h4>
              <a 
                href={`mailto:${email}`} 
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                {email}
              </a>
            </div>
          </div>
        )}

        {openingHours && openingHours.length > 0 && (
          <div className="flex items-start space-x-3">
            {showIcons && <Clock className="h-5 w-5 text-blue-600 mt-1" />}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Hours</h4>
              <div className="space-y-1 text-sm text-gray-600">
                {openingHours.map((hours, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="font-medium">{hours.split(' ')[0]}:</span>
                    <span>{hours.split(' ').slice(1).join(' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}