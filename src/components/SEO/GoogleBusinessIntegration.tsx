import React from 'react';
import { ExternalLink, Star, MapPin, Clock, Phone } from 'lucide-react';

interface GoogleBusinessIntegrationProps {
  businessName: string;
  googleBusinessUrl?: string;
  placeId?: string;
  reviews?: {
    rating: number;
    reviewCount: number;
    recentReviews?: Array<{
      author: string;
      rating: number;
      text: string;
      date: string;
    }>;
  };
  className?: string;
}

export function GoogleBusinessIntegration({
  businessName,
  googleBusinessUrl,
  placeId,
  reviews,
  className = ''
}: GoogleBusinessIntegrationProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
            ? 'text-yellow-400 fill-current opacity-50' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Find Us on Google</h3>
        {googleBusinessUrl && (
          <a
            href={googleBusinessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span className="text-sm font-medium mr-1">View Profile</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      {reviews && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {renderStars(reviews.rating)}
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {reviews.rating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-600">
              ({reviews.reviewCount} reviews)
            </span>
          </div>

          {reviews.recentReviews && reviews.recentReviews.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Recent Reviews</h4>
              {reviews.recentReviews.slice(0, 3).map((review, index) => (
                <div key={index} className="border-l-2 border-blue-100 pl-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm text-gray-900">
                      {review.author}
                    </span>
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Google Business Profile CTA */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">
          Leave us a review on Google!
        </h4>
        <p className="text-sm text-blue-700 mb-3">
          Your feedback helps us improve and helps others find us.
        </p>
        {googleBusinessUrl && (
          <a
            href={`${googleBusinessUrl}/reviews`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Write a Review
            <ExternalLink className="h-4 w-4 ml-2" />
          </a>
        )}
      </div>

      {/* Embedded Google Map */}
      {placeId && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-3">Location</h4>
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=place_id:${placeId}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${businessName} Location`}
            />
          </div>
        </div>
      )}
    </div>
  );
}