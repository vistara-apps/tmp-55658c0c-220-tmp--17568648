import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface User {
  userId: string;
  preferences: string[];
  saved_locations: string[];
  onboarding_complete: boolean;
}

export interface Recommendation {
  recommendationId: string;
  title: string;
  description: string;
  venue_name: string;
  location: { lat: number; lng: number };
  social_media_url: string;
  trend_score: number;
  vibe_tags: string[];
  image_url: string;
  video_url: string;
  timestamp: string;
}

export interface Venue {
  venueId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  categories: string[];
}

// User related functions
export async function getUserProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('userId', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data as User;
}

export async function updateUserProfile(user: User): Promise<boolean> {
  const { error } = await supabase
    .from('users')
    .upsert(user);
  
  if (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
  
  return true;
}

export async function updateUserPreferences(userId: string, preferences: string[]): Promise<boolean> {
  const { error } = await supabase
    .from('users')
    .update({ preferences })
    .eq('userId', userId);
  
  if (error) {
    console.error('Error updating user preferences:', error);
    return false;
  }
  
  return true;
}

// Recommendation related functions
export async function saveRecommendation(userId: string, recommendationId: string): Promise<boolean> {
  const user = await getUserProfile(userId);
  
  if (!user) return false;
  
  const saved_locations = [...(user.saved_locations || []), recommendationId];
  
  const { error } = await supabase
    .from('users')
    .update({ saved_locations })
    .eq('userId', userId);
  
  if (error) {
    console.error('Error saving recommendation:', error);
    return false;
  }
  
  return true;
}

export async function getSavedRecommendations(userId: string): Promise<string[]> {
  const user = await getUserProfile(userId);
  
  if (!user) return [];
  
  return user.saved_locations || [];
}

// Venue related functions
export async function getVenueDetails(venueId: string): Promise<Venue | null> {
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .eq('venueId', venueId)
    .single();
  
  if (error) {
    console.error('Error fetching venue details:', error);
    return null;
  }
  
  return data as Venue;
}

