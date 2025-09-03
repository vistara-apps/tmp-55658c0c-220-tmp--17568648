/**
 * API Service for VibeFinder
 * 
 * This service handles all external API interactions including:
 * - EnsembleData for social media scraping
 * - SocialKit for video analysis
 * - OpenAI for NLP processing
 * - Google Maps for geocoding
 */

import OpenAI from 'openai';
import { Recommendation, Venue } from './supabase';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

// EnsembleData API for social media scraping
export async function fetchTrendingContent(location: string, hashtags: string[] = []): Promise<any[]> {
  try {
    // In a real implementation, this would call the EnsembleData API
    // For now, we'll simulate the response
    console.log(`Fetching trending content for ${location} with hashtags: ${hashtags.join(', ')}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data
    return [
      {
        id: 'tt-1',
        platform: 'tiktok',
        url: 'https://tiktok.com/video1',
        hashtags: ['foodie', 'sanfrancisco'],
        engagement: 5000,
        location: 'San Francisco',
        venue: 'Tartine Bakery'
      },
      {
        id: 'ig-1',
        platform: 'instagram',
        url: 'https://instagram.com/p/123456',
        hashtags: ['nightlife', 'sanfrancisco'],
        engagement: 3500,
        location: 'San Francisco',
        venue: 'Emporium Arcade Bar'
      }
    ];
  } catch (error) {
    console.error('Error fetching trending content:', error);
    return [];
  }
}

// SocialKit API for video analysis
export async function analyzeVideoContent(videoUrl: string): Promise<any> {
  try {
    // In a real implementation, this would call the SocialKit API
    // For now, we'll simulate the response
    console.log(`Analyzing video content: ${videoUrl}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Return mock data
    return {
      summary: 'Busy cafe with people enjoying artisanal coffee and pastries',
      sentiment: 'positive',
      keywords: ['coffee', 'pastry', 'cozy', 'artisanal'],
      engagement_score: 85,
      vibe_categories: ['Chill', 'Foodie', 'Artsy']
    };
  } catch (error) {
    console.error('Error analyzing video content:', error);
    return null;
  }
}

// OpenAI for NLP processing
export async function generateRecommendationDescription(venue: string, keywords: string[]): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'google/gemini-flash-1.5',
      messages: [
        {
          role: 'system',
          content: 'Generate a concise, engaging description for a local venue based on keywords. Keep it under 100 characters.'
        },
        {
          role: 'user',
          content: `Venue: ${venue}, Keywords: ${keywords.join(', ')}`
        }
      ],
    });

    return completion.choices[0].message.content || 'A trending local spot worth checking out!';
  } catch (error) {
    console.error('Error generating description:', error);
    return 'A trending local spot worth checking out!';
  }
}

// Google Maps Geocoding API
export async function geocodeVenue(venueName: string, address: string): Promise<{lat: number, lng: number} | null> {
  try {
    // In a real implementation, this would call the Google Maps Geocoding API
    // For now, we'll simulate the response with random coordinates near San Francisco
    console.log(`Geocoding venue: ${venueName}, ${address}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Generate random coordinates near San Francisco
    const sfLat = 37.7749;
    const sfLng = -122.4194;
    const randomLat = sfLat + (Math.random() - 0.5) * 0.05;
    const randomLng = sfLng + (Math.random() - 0.5) * 0.05;
    
    return {
      lat: randomLat,
      lng: randomLng
    };
  } catch (error) {
    console.error('Error geocoding venue:', error);
    return null;
  }
}

// Process social media data into recommendations
export async function processRecommendations(
  socialData: any[], 
  userPreferences: string[] = []
): Promise<Recommendation[]> {
  const recommendations: Recommendation[] = [];
  
  for (const item of socialData) {
    try {
      // 1. Analyze video content
      const analysis = await analyzeVideoContent(item.url);
      
      if (!analysis) continue;
      
      // 2. Filter by user preferences if any are specified
      if (userPreferences.length > 0) {
        const matchingVibes = analysis.vibe_categories.filter(
          (vibe: string) => userPreferences.includes(vibe)
        );
        
        if (matchingVibes.length === 0) continue;
      }
      
      // 3. Geocode the venue
      const location = await geocodeVenue(item.venue, item.location);
      
      if (!location) continue;
      
      // 4. Generate description
      const description = await generateRecommendationDescription(
        item.venue, 
        analysis.keywords
      );
      
      // 5. Create recommendation object
      const recommendation: Recommendation = {
        recommendationId: `rec-${item.id}`,
        title: item.venue,
        description,
        venue_name: item.venue,
        location,
        social_media_url: item.url,
        trend_score: analysis.engagement_score,
        vibe_tags: analysis.vibe_categories,
        image_url: `https://via.placeholder.com/400x300?text=${encodeURIComponent(item.venue)}`,
        video_url: item.url,
        timestamp: new Date().toISOString()
      };
      
      recommendations.push(recommendation);
    } catch (error) {
      console.error('Error processing recommendation:', error);
    }
  }
  
  return recommendations;
}

