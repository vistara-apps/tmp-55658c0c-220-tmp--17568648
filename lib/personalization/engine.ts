/**
 * Personalization Engine
 * 
 * This module handles user preference processing and recommendation personalization.
 * It provides functions to match user preferences to recommendations and learn from user behavior.
 */

import { matchUserPreferencesToVenues } from '@/lib/api/openai';
import { updateUserPreferences } from '@/lib/db/user';
import { RecommendationWithVenue } from '@/lib/db/types';

// Available vibe categories
export const VIBE_CATEGORIES = [
  'Chill', 'Energetic', 'Romantic', 'Adventurous', 'Cozy', 'Elegant', 
  'Hipster', 'Trendy', 'Family-friendly', 'Artsy', 'Luxurious', 'Casual', 
  'Retro', 'Modern', 'Intimate', 'Lively', 'Quirky', 'Sophisticated', 
  'Rustic', 'Vibrant'
];

// Personalize recommendations based on user preferences
export async function personalizeRecommendations(
  recommendations: RecommendationWithVenue[],
  userPreferences: string[]
): Promise<RecommendationWithVenue[]> {
  if (!userPreferences || userPreferences.length === 0 || recommendations.length === 0) {
    return recommendations;
  }
  
  try {
    // Extract vibe tags from recommendations
    const venueVibes = recommendations.map(rec => rec.vibe_tags);
    
    // Get match scores from OpenAI
    const matchScores = await matchUserPreferencesToVenues(userPreferences, venueVibes);
    
    // Sort recommendations by match score
    const scoredRecommendations = recommendations.map((rec, index) => ({
      recommendation: rec,
      score: matchScores[index] || 0,
    }));
    
    scoredRecommendations.sort((a, b) => b.score - a.score);
    
    // Return sorted recommendations
    return scoredRecommendations.map(item => item.recommendation);
  } catch (error) {
    console.error('Error personalizing recommendations:', error);
    return recommendations;
  }
}

// Learn from user interactions
export async function learnFromInteraction(
  userId: string,
  recommendationId: string,
  interactionType: 'view' | 'save' | 'click',
  recommendation: RecommendationWithVenue
): Promise<void> {
  try {
    // Get current user preferences
    const currentPreferences = await getUserPreferences(userId);
    
    // Update preferences based on interaction
    let updatedPreferences = [...currentPreferences];
    
    if (interactionType === 'save') {
      // Strongly reinforce these preferences
      recommendation.vibe_tags.forEach(tag => {
        if (!updatedPreferences.includes(tag)) {
          updatedPreferences.push(tag);
        }
      });
    } else if (interactionType === 'click') {
      // Moderately reinforce these preferences
      recommendation.vibe_tags.forEach(tag => {
        if (!updatedPreferences.includes(tag) && Math.random() > 0.3) {
          updatedPreferences.push(tag);
        }
      });
    }
    
    // Limit to top 10 preferences
    if (updatedPreferences.length > 10) {
      updatedPreferences = updatedPreferences.slice(0, 10);
    }
    
    // Update user preferences in database
    await updateUserPreferences(userId, updatedPreferences);
  } catch (error) {
    console.error('Error learning from interaction:', error);
  }
}

// Get user preferences from database
async function getUserPreferences(userId: string): Promise<string[]> {
  // This would typically fetch from the database
  // For now, we'll return a mock implementation
  return ['Trendy', 'Chill'];
}

// Generate initial preferences from social media
export async function generateInitialPreferences(
  socialMediaData: any
): Promise<string[]> {
  // This would typically analyze social media data to infer preferences
  // For now, we'll return a mock implementation
  const randomPreferences = [];
  const numPreferences = Math.floor(Math.random() * 3) + 2; // 2-4 preferences
  
  for (let i = 0; i < numPreferences; i++) {
    const randomIndex = Math.floor(Math.random() * VIBE_CATEGORIES.length);
    const preference = VIBE_CATEGORIES[randomIndex];
    
    if (!randomPreferences.includes(preference)) {
      randomPreferences.push(preference);
    }
  }
  
  return randomPreferences;
}

