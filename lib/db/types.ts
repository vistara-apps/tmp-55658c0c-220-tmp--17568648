/**
 * Database Types
 * 
 * This module defines TypeScript types for database entities.
 */

// User entity
export interface User {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  preferences: string[];
  saved_locations: string[];
  onboarding_complete: boolean;
  subscription_tier: string;
  subscription_expires_at: string | null;
}

// Recommendation entity
export interface Recommendation {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  venue_id: string;
  social_media_url: string;
  trend_score: number;
  vibe_tags: string[];
  image_url: string;
  video_url: string;
}

// Venue entity
export interface Venue {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  categories: string[];
}

// Saved recommendation entity
export interface SavedRecommendation {
  id: string;
  created_at: string;
  user_id: string;
  recommendation_id: string;
}

// Recommendation with venue details
export interface RecommendationWithVenue extends Recommendation {
  venue_name: string;
  location: {
    lat: number;
    lng: number;
  };
  timestamp: string;
}

