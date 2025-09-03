'use server';

import { generateMockRecommendations } from '@/lib/api/openai';
import { searchByLocation, getTrendingVenues } from '@/lib/api/ensembleData';
import { getVideoSummary, extractVenueInfo, analyzeVideoSentiment, extractKeywords } from '@/lib/api/socialKit';
import { geocodeAddress, searchNearbyPlaces, getPlaceDetails } from '@/lib/api/googleMaps';
import { getRecommendationsByLocation, getRecommendationsByVibeTags } from '@/lib/db/recommendation';
import { getCurrentUser } from '@/lib/supabase';
import { hasPremiumSubscription } from '@/lib/db/user';

export async function getRecommendations(location: string, preferences: string[] = []) {
  try {
    // Check if we're in development mode or missing API keys
    if (process.env.NODE_ENV === 'development' || !process.env.ENSEMBLE_DATA_API_KEY) {
      return generateMockRecommendations(location, preferences);
    }

    // Get user if authenticated
    const user = await getCurrentUser();
    const isPremium = user ? await hasPremiumSubscription(user.id) : false;
    
    // Geocode the location to get coordinates
    const geocoded = await geocodeAddress(location);
    
    if (!geocoded) {
      throw new Error(`Could not geocode location: ${location}`);
    }
    
    const { latitude, longitude } = geocoded;
    
    // Try to get recommendations from database first
    let recommendations = [];
    
    if (preferences && preferences.length > 0) {
      // If user has preferences, get recommendations by vibe tags
      recommendations = await getRecommendationsByVibeTags(preferences);
    } else {
      // Otherwise, get recommendations by location
      recommendations = await getRecommendationsByLocation(latitude, longitude);
    }
    
    // If we have enough recommendations from the database, return them
    if (recommendations.length >= 5) {
      return recommendations;
    }
    
    // Otherwise, fetch new recommendations from external APIs
    
    // Get trending venues from EnsembleData
    const trendingVenues = await getTrendingVenues(latitude, longitude);
    
    // If no trending venues, fall back to Google Places API
    if (!trendingVenues || trendingVenues.length === 0) {
      const nearbyPlaces = await searchNearbyPlaces(latitude, longitude, 5000);
      
      // Process and format the places as recommendations
      const placeRecommendations = await Promise.all(
        nearbyPlaces.slice(0, 5).map(async (place) => {
          const details = await getPlaceDetails(place.place_id);
          
          return {
            recommendationId: place.place_id,
            title: place.name,
            description: place.vicinity,
            venue_name: place.name,
            location: { 
              lat: place.geometry.location.lat, 
              lng: place.geometry.location.lng 
            },
            social_media_url: details?.website || '',
            trend_score: Math.floor(Math.random() * 30) + 70, // Mock trend score
            vibe_tags: preferences.length > 0 ? preferences : ['Trending'],
            image_url: place.photos && place.photos.length > 0 
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
              : 'https://via.placeholder.com/400x300?text=No+Image',
            video_url: '', // No video available from Places API
            timestamp: new Date().toISOString(),
          };
        })
      );
      
      return placeRecommendations;
    }
    
    // Process trending venues from EnsembleData
    const venueRecommendations = await Promise.all(
      trendingVenues.slice(0, 5).map(async (venue) => {
        // Get video content for analysis
        const videoSummary = await getVideoSummary(venue.video_url);
        const venueInfo = await extractVenueInfo(venue.video_url);
        const sentiment = await analyzeVideoSentiment(venue.video_url);
        const keywords = await extractKeywords(venue.video_url);
        
        // Determine vibe tags based on keywords and sentiment
        const vibeTags = keywords.slice(0, 3);
        
        // Add user preferences if they match
        if (preferences && preferences.length > 0) {
          preferences.forEach(pref => {
            if (!vibeTags.includes(pref) && Math.random() > 0.5) {
              vibeTags.push(pref);
            }
          });
        }
        
        return {
          recommendationId: venue.id,
          title: venue.title || venue.name,
          description: videoSummary.summary || venue.description,
          venue_name: venue.name,
          location: { 
            lat: venue.latitude, 
            lng: venue.longitude 
          },
          social_media_url: venue.social_url,
          trend_score: venue.trend_score || Math.floor(Math.random() * 30) + 70,
          vibe_tags: vibeTags.slice(0, 4),
          image_url: venue.image_url || venue.thumbnail_url,
          video_url: venue.video_url,
          timestamp: new Date().toISOString(),
        };
      })
    );
    
    return venueRecommendations;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return generateMockRecommendations(location, preferences);
  }
}

// Fallback mock recommendations if all else fails
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
