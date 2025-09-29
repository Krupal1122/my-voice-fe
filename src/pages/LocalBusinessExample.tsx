import React from 'react';
import { LocalBusinessSchema } from '../components/SEO/LocalBusinessSchema';
import { NAP } from '../components/SEO/NAP';
import { LocalSEOHead } from '../components/SEO/LocalSEOHead';
import { GoogleBusinessIntegration } from '../components/SEO/GoogleBusinessIntegration';
import { LocationSpecificContent } from '../components/SEO/LocationSpecificContent';
import { Clock, Award, Users, Shield } from 'lucide-react';

// Example business data - replace with your actual business information
const businessData = {
  businessName: "MyVoice974 Survey Solutions",
  description: "Professional survey and market research services in Réunion. We help businesses understand their customers through comprehensive polling and data analysis.",
  address: {
    streetAddress: "123 Rue de la République",
    addressLocality: "Saint-Denis",
    addressRegion: "Réunion",
    postalCode: "97400",
    addressCountry: "FR"
  },
  phone: "+262-262-12-34-56",
  email: "contact@myvoice974.com",
  website: "https://myvoice974.com",
  businessType: "Market Research Service",
  openingHours: [
    "Monday 08:00 18:00",
    "Tuesday 08:00 18:00", 
    "Wednesday 08:00 18:00",
    "Thursday 08:00 18:00",
    "Friday 08:00 18:00",
    "Saturday 09:00 17:00",
    "Sunday Closed"
  ],
  geoCoordinates: {
    latitude: -20.8823,
    longitude: 55.4504
  },
  socialProfiles: [
    "https://facebook.com/myvoice974",
    "https://linkedin.com/company/myvoice974",
    "https://twitter.com/myvoice974"
  ],
  aggregateRating: {
    ratingValue: 4.8,
    reviewCount: 127
  }
};

const serviceAreas = [
  "Saint-Denis",
  "Saint-Paul", 
  "Saint-Pierre",
  "Le Tampon",
  "Saint-André",
  "Saint-Louis",
  "Sainte-Marie",
  "Sainte-Suzanne"
];

const localFeatures = [
  {
    title: "Local Expertise",
    description: "Deep understanding of Réunion's unique market dynamics and cultural nuances.",
    icon: <Award className="h-6 w-6 text-blue-600" />
  },
  {
    title: "Bilingual Services", 
    description: "Surveys available in French and Creole to reach all segments of the population.",
    icon: <Users className="h-6 w-6 text-blue-600" />
  },
  {
    title: "Fast Turnaround",
    description: "Quick results delivery with same-day analysis for urgent research needs.",
    icon: <Clock className="h-6 w-6 text-blue-600" />
  },
  {
    title: "Data Security",
    description: "GDPR compliant data handling with secure local servers in Réunion.",
    icon: <Shield className="h-6 w-6 text-blue-600" />
  }
];

const testimonials = [
  {
    name: "Marie Dubois",
    location: "Saint-Denis",
    text: "MyVoice974 helped us understand our customers better. Their local knowledge made all the difference in our market research.",
    rating: 5
  },
  {
    name: "Jean-Paul Martin",
    location: "Saint-Paul", 
    text: "Professional service with quick results. They really understand the Réunion market.",
    rating: 5
  },
  {
    name: "Sophie Leroy",
    location: "Saint-Pierre",
    text: "Excellent bilingual surveys that reached our entire target audience. Highly recommended!",
    rating: 4
  }
];

export function LocalBusinessExample() {
  return (
    <>
      {/* SEO Head Elements */}
      <LocalSEOHead
        title="Professional Survey Services in Réunion | MyVoice974"
        description="Leading market research and survey services in Saint-Denis, Réunion. Professional polling, data analysis, and customer insights for businesses across the island."
        businessName={businessData.businessName}
        location="Saint-Denis, Réunion"
        keywords={[
          "survey services",
          "market research", 
          "polling",
          "data analysis",
          "customer insights",
          "business research"
        ]}
        canonicalUrl="https://myvoice974.com"
        ogImage="https://myvoice974.com/og-image.jpg"
        businessType="Market Research Service"
      />

      {/* Structured Data */}
      <LocalBusinessSchema
        businessName={businessData.businessName}
        description={businessData.description}
        address={businessData.address}
        phone={businessData.phone}
        email={businessData.email}
        website={businessData.website}
        businessType={businessData.businessType}
        openingHours={businessData.openingHours}
        geoCoordinates={businessData.geoCoordinates}
        socialProfiles={businessData.socialProfiles}
        aggregateRating={businessData.aggregateRating}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header with NAP */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-blue-600">
                  {businessData.businessName}
                </h1>
              </div>
              <NAP
                businessName={businessData.businessName}
                address={businessData.address}
                phone={businessData.phone}
                email={businessData.email}
                variant="compact"
                className="hidden md:block"
              />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Location-Specific Content */}
          <LocationSpecificContent
            location="Saint-Denis, Réunion"
            businessName={businessData.businessName}
            serviceAreas={serviceAreas}
            localFeatures={localFeatures}
            testimonials={testimonials}
            className="mb-12"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Services Section */}
              <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Our Services in Réunion
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Market Research
                    </h3>
                    <p className="text-gray-600">
                      Comprehensive market analysis tailored to the Réunion market, 
                      helping businesses understand local consumer behavior and preferences.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Customer Surveys
                    </h3>
                    <p className="text-gray-600">
                      Professional survey design and implementation with bilingual 
                      support to reach all segments of the Réunion population.
                    </p>
                  </div>
                </div>
              </section>

              {/* About Section */}
              <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  About MyVoice974
                </h2>
                <div className="prose prose-lg text-gray-600">
                  <p>
                    Based in Saint-Denis, Réunion, MyVoice974 is the island's 
                    leading provider of professional survey and market research 
                    services. We specialize in helping local businesses understand 
                    their customers through comprehensive data collection and analysis.
                  </p>
                  <p>
                    Our team of experienced researchers understands the unique 
                    cultural and economic landscape of Réunion, ensuring that 
                    your surveys capture accurate insights from the local population.
                  </p>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Contact Information */}
              <NAP
                businessName={businessData.businessName}
                address={businessData.address}
                phone={businessData.phone}
                email={businessData.email}
                openingHours={businessData.openingHours}
              />

              {/* Google Business Integration */}
              <GoogleBusinessIntegration
                businessName={businessData.businessName}
                googleBusinessUrl="https://business.google.com/your-business"
                placeId="ChIJYour_Place_ID_Here"
                reviews={{
                  rating: businessData.aggregateRating!.ratingValue,
                  reviewCount: businessData.aggregateRating!.reviewCount,
                  recentReviews: [
                    {
                      author: "Marie L.",
                      rating: 5,
                      text: "Excellent service and very professional team. They helped us understand our market better.",
                      date: "2 weeks ago"
                    },
                    {
                      author: "Jean-Paul M.",
                      rating: 5, 
                      text: "Quick turnaround and detailed analysis. Highly recommend for any business in Réunion.",
                      date: "1 month ago"
                    }
                  ]
                }}
              />
            </div>
          </div>
        </main>

        {/* Footer with NAP */}
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <NAP
                businessName={businessData.businessName}
                address={businessData.address}
                phone={businessData.phone}
                email={businessData.email}
                variant="footer"
                className="text-white"
              />
              
              <div>
                <h3 className="font-semibold text-lg mb-3">Services</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Market Research</li>
                  <li>Customer Surveys</li>
                  <li>Data Analysis</li>
                  <li>Business Consulting</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3">Service Areas</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  {serviceAreas.slice(0, 4).map((area, index) => (
                    <li key={index}>{area}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2024 {businessData.businessName}. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}