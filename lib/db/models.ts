import { supabase } from '../supabase';
import { User, Recommendation, Venue, SavedRecommendation, RecommendationWithVenue } from './types';

// Generic error handler
export const handleError = (error: any, entity: string, operation: string) => {
  console.error(`Error ${operation} ${entity}:`, error);
  throw new Error(`Failed to ${operation} ${entity}: ${error.message}`);
};

// Convert database timestamp to ISO string
export const formatTimestamp = (timestamp: string | null): string => {
  if (!timestamp) return new Date().toISOString();
  return new Date(timestamp).toISOString();
};

// Convert recommendation with venue to frontend format
export const formatRecommendationWithVenue = (
  recommendation: Recommendation,
  venue: Venue
): RecommendationWithVenue => {
  return {
    ...recommendation,
    venue,
    location: {
      lat: venue.latitude,
      lng: venue.longitude,
    },
  };
};

// Database schema version for migrations
export const SCHEMA_VERSION = '1.0.0';
