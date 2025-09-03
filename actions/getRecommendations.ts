'use server';

import { fetchTrendingContent, processRecommendations } from '@/lib/api';
import { Recommendation } from '@/lib/supabase';

/**
 * Get trending recommendations based on location and user preferences
 * 
 * @param location - The user's location (city name)
 * @param preferences - Array of user preference tags
 * @returns Array of recommendation objects
 */
export async function getRecommendations(location: string, preferences: string[] = []): Promise<Recommendation[]> {
  try {
    // 1. Fetch trending content from social media
    const socialData = await fetchTrendingContent(location, preferences);
    
    if (!socialData || socialData.length === 0) {
      console.log('No trending content found, returning mock data');
      return mockRecommendations;
    }
    
    // 2. Process social data into recommendations
    const recommendations = await processRecommendations(socialData, preferences);
    
    if (recommendations.length === 0) {
      console.log('No recommendations generated, returning mock data');
      return mockRecommendations;
    }
    
    return recommendations;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return mockRecommendations;
  }
}

// Mock recommendations for fallback and testing
const mockRecommendations: Recommendation[] = [
  {
    recommendationId: '1',
    title: 'Cozy Coffee Spot',
    description: 'Trending cafe with chill vibes and great lattes.',
    venue_name: 'Blue Bottle Coffee',
    location: { lat: 37.7749, lng: -122.4194 },
    social_media_url: 'https://instagram.com/bluebottle',
    trend_score: 85,
    vibe_tags: ['Chill', 'Coffee'],
    image_url: 'https://via.placeholder.com/400x300?text=Coffee',
    video_url: 'https://example.com/video.mp4',
    timestamp: '2024-08-30'
  },
  {
    recommendationId: '2',
    title: 'Rooftop Cocktail Bar',
    description: 'Trendy rooftop bar with amazing city views and craft cocktails.',
    venue_name: 'Charmaine\'s',
    location: { lat: 37.7816, lng: -122.4090 },
    social_media_url: 'https://instagram.com/charmaines',
    trend_score: 92,
    vibe_tags: ['Energetic', 'Nightlife'],
    image_url: 'https://via.placeholder.com/400x300?text=Rooftop+Bar',
    video_url: 'https://example.com/video2.mp4',
    timestamp: '2024-08-30'
  },
  {
    recommendationId: '3',
    title: 'Hidden Garden Restaurant',
    description: 'Secret garden restaurant with farm-to-table cuisine.',
    venue_name: 'Stable Cafe',
    location: { lat: 37.7599, lng: -122.4148 },
    social_media_url: 'https://instagram.com/stablecafe',
    trend_score: 78,
    vibe_tags: ['Romantic', 'Foodie'],
    image_url: 'https://via.placeholder.com/400x300?text=Garden+Restaurant',
    video_url: 'https://example.com/video3.mp4',
    timestamp: '2024-08-30'
  },
  {
    recommendationId: '4',
    title: 'Urban Hiking Trail',
    description: 'Scenic urban hike with stunning views of the bay.',
    venue_name: 'Lands End Trail',
    location: { lat: 37.7825, lng: -122.5055 },
    social_media_url: 'https://instagram.com/landsend',
    trend_score: 88,
    vibe_tags: ['Adventurous', 'Outdoors'],
    image_url: 'https://via.placeholder.com/400x300?text=Hiking+Trail',
    video_url: 'https://example.com/video4.mp4',
    timestamp: '2024-08-30'
  },
  {
    recommendationId: '5',
    title: 'Artisanal Ice Cream Shop',
    description: 'Unique ice cream flavors made with local ingredients.',
    venue_name: 'Bi-Rite Creamery',
    location: { lat: 37.7614, lng: -122.4256 },
    social_media_url: 'https://instagram.com/biritecreamery',
    trend_score: 82,
    vibe_tags: ['Chill', 'Foodie'],
    image_url: 'https://via.placeholder.com/400x300?text=Ice+Cream',
    video_url: 'https://example.com/video5.mp4',
    timestamp: '2024-08-30'
  }
];
