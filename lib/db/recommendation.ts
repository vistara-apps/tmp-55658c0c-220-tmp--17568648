/**
 * Recommendation Database Functions
 * 
 * This module provides functions for interacting with recommendation data in the database.
 */

import { Recommendation, RecommendationWithVenue } from './types';
import { mockRecommendations } from '@/lib/api/openai';

// Get recommendations by location
export async function getRecommendationsByLocation(
  latitude: number,
  longitude: number,
  radius: number = 10,
  limit: number = 20
): Promise<RecommendationWithVenue[]> {
  try {
    // In a real app, this would query the database
    // For now, we'll return mock data
    return mockRecommendations.slice(0, limit);
  } catch (error) {
    console.error('Error getting recommendations by location:', error);
    return [];
  }
}

// Get recommendations by vibe tags
export async function getRecommendationsByVibeTags(
  vibeTags: string[],
  limit: number = 20
): Promise<RecommendationWithVenue[]> {
  try {
    // In a real app, this would query the database
    // For now, we'll return mock data filtered by vibe tags
    const filtered = mockRecommendations.filter(rec => 
      rec.vibe_tags.some(tag => vibeTags.includes(tag))
    );
    
    return filtered.slice(0, limit);
  } catch (error) {
    console.error('Error getting recommendations by vibe tags:', error);
    return [];
  }
}

// Get recommendation by ID
export async function getRecommendationById(id: string): Promise<RecommendationWithVenue | null> {
  try {
    // In a real app, this would query the database
    // For now, we'll return mock data
    const recommendation = mockRecommendations.find(rec => rec.recommendationId === id);
    
    if (!recommendation) {
      return null;
    }
    
    return recommendation;
  } catch (error) {
    console.error('Error getting recommendation by ID:', error);
    return null;
  }
}

// Save recommendation for user
export async function saveRecommendation(userId: string, recommendationId: string): Promise<boolean> {
  try {
    // In a real app, this would update the database
    // For now, we'll return success
    return true;
  } catch (error) {
    console.error('Error saving recommendation:', error);
    return false;
  }
}

// Get saved recommendations for user
export async function getSavedRecommendations(userId: string): Promise<RecommendationWithVenue[]> {
  try {
    // In a real app, this would query the database
    // For now, we'll return mock data
    return mockRecommendations.slice(0, 3);
  } catch (error) {
    console.error('Error getting saved recommendations:', error);
    return [];
  }
}

// Create recommendation
export async function createRecommendation(recommendation: Partial<Recommendation>): Promise<string | null> {
  try {
    // In a real app, this would insert into the database
    // For now, we'll return a mock ID
    return 'rec_' + Math.random().toString(36).substring(2, 15);
  } catch (error) {
    console.error('Error creating recommendation:', error);
    return null;
  }
}

