/**
 * OpenAI API Client
 * 
 * This module provides functions for interacting with the OpenAI API,
 * which is used for natural language processing, including summarization and categorization.
 */

import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

// Generate mock recommendations
export async function generateMockRecommendations(location: string, preferences: string[] = []) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'google/gemini-flash-1.5',
      messages: [
        {
          role: 'system',
          content: 'Generate 5 mock trending local recommendations based on location and preferences. Output as JSON array of objects with keys: recommendationId, title, description, venue_name, location (object with lat and lng), social_media_url, trend_score, vibe_tags (array), image_url, video_url, timestamp.'
        },
        {
          role: 'user',
          content: `Location: ${location}, Preferences: ${preferences.join(', ')}`
        }
      ],
    });

    const generated = JSON.parse(completion.choices[0].message.content || '[]');
    return generated;
  } catch (error) {
    console.error('Error generating mock recommendations:', error);
    return mockRecommendations;
  }
}

// Match user preferences to venues
export async function matchUserPreferencesToVenues(
  userPreferences: string[],
  venueVibes: string[][]
): Promise<number[]> {
  try {
    // In a real app, this would use OpenAI to match preferences to venues
    // For now, we'll use a simple algorithm
    
    // If no preferences, return equal scores
    if (userPreferences.length === 0) {
      return venueVibes.map(() => 0.5);
    }
    
    // Calculate match scores
    return venueVibes.map(vibes => {
      // Count how many user preferences match venue vibes
      const matchCount = userPreferences.filter(pref => 
        vibes.some(vibe => vibe.toLowerCase() === pref.toLowerCase())
      ).length;
      
      // Calculate match score (0-1)
      const matchScore = matchCount / Math.max(userPreferences.length, 1);
      
      // Add some randomness to avoid identical scores
      return matchScore + (Math.random() * 0.2 - 0.1);
    });
  } catch (error) {
    console.error('Error matching preferences to venues:', error);
    return venueVibes.map(() => 0.5);
  }
}

// Generate video summary
export async function generateVideoSummary(transcript: string, maxLength: number = 100): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'google/gemini-flash-1.5',
      messages: [
        {
          role: 'system',
          content: `Summarize the following video transcript in ${maxLength} characters or less.`
        },
        {
          role: 'user',
          content: transcript
        }
      ],
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating video summary:', error);
    return 'No summary available';
  }
}

// Categorize venue by vibe
export async function categorizeVenueByVibe(description: string): Promise<string[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'google/gemini-flash-1.5',
      messages: [
        {
          role: 'system',
          content: 'Analyze the following venue description and extract 3-5 vibe categories that best describe it. Output as a JSON array of strings.'
        },
        {
          role: 'user',
          content: description
        }
      ],
    });

    const vibes = JSON.parse(completion.choices[0].message.content || '[]');
    return vibes;
  } catch (error) {
    console.error('Error categorizing venue by vibe:', error);
    return ['Trendy', 'Popular'];
  }
}

// Mock recommendations
const mockRecommendations = [
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
    description: 'Elegant rooftop bar with stunning city views and craft cocktails.',
    venue_name: 'Skyline Lounge',
    location: { lat: 37.7833, lng: -122.4167 },
    social_media_url: 'https://instagram.com/skylinelounge',
    trend_score: 92,
    vibe_tags: ['Elegant', 'Romantic', 'Trendy'],
    image_url: 'https://via.placeholder.com/400x300?text=Cocktails',
    video_url: 'https://example.com/video2.mp4',
    timestamp: '2024-08-30'
  },
  {
    recommendationId: '3',
    title: 'Underground Jazz Club',
    description: 'Hidden jazz venue with live music and intimate atmosphere.',
    venue_name: 'Blue Note SF',
    location: { lat: 37.7694, lng: -122.4248 },
    social_media_url: 'https://instagram.com/bluenotesf',
    trend_score: 78,
    vibe_tags: ['Intimate', 'Chill', 'Artsy'],
    image_url: 'https://via.placeholder.com/400x300?text=Jazz',
    video_url: 'https://example.com/video3.mp4',
    timestamp: '2024-08-29'
  },
  {
    recommendationId: '4',
    title: 'Artisanal Food Market',
    description: 'Bustling market with local vendors and gourmet food stalls.',
    venue_name: 'Ferry Building Marketplace',
    location: { lat: 37.7955, lng: -122.3937 },
    social_media_url: 'https://instagram.com/ferrybuilding',
    trend_score: 88,
    vibe_tags: ['Energetic', 'Foodie', 'Vibrant'],
    image_url: 'https://via.placeholder.com/400x300?text=Market',
    video_url: 'https://example.com/video4.mp4',
    timestamp: '2024-08-30'
  },
  {
    recommendationId: '5',
    title: 'Vintage Arcade Bar',
    description: 'Retro gaming bar with classic arcade machines and themed drinks.',
    venue_name: 'Coin-Op Game Room',
    location: { lat: 37.7765, lng: -122.4130 },
    social_media_url: 'https://instagram.com/coinopgameroom',
    trend_score: 82,
    vibe_tags: ['Retro', 'Energetic', 'Quirky'],
    image_url: 'https://via.placeholder.com/400x300?text=Arcade',
    video_url: 'https://example.com/video5.mp4',
    timestamp: '2024-08-28'
  }
];

