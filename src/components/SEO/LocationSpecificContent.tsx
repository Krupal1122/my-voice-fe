import React from 'react';
import { MapPin, Users, Award, Clock } from 'lucide-react';

interface LocationSpecificContentProps {
  location: string;
  businessName: string;
  serviceAreas: string[];
  localFeatures: Array<{
    title: string;
    description: string;
    icon?: React.ReactNode;
  }>;
  testimonials?: Array<{
    name: string;
    location: string;
    text: string;
    rating: number;
  }>;
  className?: string;
}

export function LocationSpecificContent({
  location,
  businessName,
  serviceAreas,
  localFeatures,
  testimonials,
  className = ''
}: LocationSpecificContentProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Location Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-8">
        <div className="flex items-center space-x-3 mb-4">
          <MapPin className="h-8 w-8" />
          <h1 className="text-3xl font-bold">
            Serving {location} and Surrounding Areas
          </h1>
        </div>
        <p className="text-blue-100 text-lg leading-relaxed">
          {businessName} is proud to serve the {location} community with 
          exceptional service and local expertise. We understand the unique 
          needs of our neighbors and are committed to providing personalized 
          solutions for every customer.
        </p>
      </section>

      {/* Service Areas */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Areas We Serve
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {serviceAreas.map((area, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center hover:shadow-md transition-shadow"
            >
              <MapPin className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">{area}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Local Features */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Why Choose Us in {location}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                {feature.icon || <Award className="h-6 w-6 text-blue-600" />}
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Local Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            What Our {location} Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center space-x-1 mb-3">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <blockquote className="text-gray-600 mb-4 italic">
                  "{testimonial.text}"
                </blockquote>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <cite className="text-sm font-medium text-gray-900 not-italic">
                    {testimonial.name}
                  </cite>
                  <span className="text-sm text-gray-500">
                    • {testimonial.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Local SEO Content */}
      <section className="bg-gray-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Your Trusted Local Partner in {location}
        </h2>
        <div className="prose prose-lg text-gray-600">
          <p>
            As a locally-owned business in {location}, we understand the unique 
            challenges and opportunities that come with serving our community. 
            Our team of experienced professionals is dedicated to providing 
            personalized service that meets the specific needs of {location} 
            residents and businesses.
          </p>
          <p>
            We've been serving the {location} area for years, building lasting 
            relationships with our customers and contributing to the local economy. 
            Our commitment to excellence and community involvement sets us apart 
            from larger, impersonal corporations.
          </p>
        </div>
      </section>
    </div>
  );
}