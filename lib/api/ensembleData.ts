/**
 * EnsembleData API Client
 * 
 * This module provides functions for interacting with the EnsembleData API,
 * which is used for social media content scraping and trending venue discovery.
 */

// Base URL for EnsembleData API
const BASE_URL = 'https://ensembledata.com';

// API token
const API_TOKEN = process.env.ENSEMBLE_DATA_API_KEY || '';

// Search for content by hashtag
export async function searchByHashtag(hashtag: string, limit: number = 10) {
  try {
    // In a real app, this would make an API request to EnsembleData
    // For now, we'll return mock data
    return mockSearchResults.slice(0, limit);
  } catch (error) {
    console.error('Error searching by hashtag:', error);
    return [];
  }
}

// Search for content by location
export async function searchByLocation(
  latitude: number,
  longitude: number,
  radius: number = 10,
  limit: number = 10
) {
  try {
    // In a real app, this would make an API request to EnsembleData
    // For now, we'll return mock data
    return mockSearchResults.slice(0, limit);
  } catch (error) {
    console.error('Error searching by location:', error);
    return [];
  }
}

// Get trending venues in a location
export async function getTrendingVenues(
  latitude: number,
  longitude: number,
  radius: number = 10,
  limit: number = 10
) {
  try {
    // In a real app, this would make an API request to EnsembleData
    // For now, we'll return mock data
    return mockVenues.slice(0, limit);
  } catch (error) {
    console.error('Error getting trending venues:', error);
    return [];
  }
}

// Mock search results
const mockSearchResults = [
  {
    id: '1',
    title: 'Amazing coffee at Blue Bottle',
    description: 'Just had the best latte ever at Blue Bottle Coffee!',
    social_url: 'https://instagram.com/p/123456',
    video_url: 'https://example.com/video1.mp4',
    thumbnail_url: 'https://via.placeholder.com/400x300?text=Coffee',
    likes: 1200,
    comments: 45,
    views: 8500,
    timestamp: '2024-08-30T12:34:56Z',
    location: {
      name: 'Blue Bottle Coffee',
      address: '123 Main St, San Francisco, CA',
      latitude: 37.7749,
      longitude: -122.4194,
    },
  },
  {
    id: '2',
    title: 'Rooftop vibes at Skyline Lounge',
    description: 'Enjoying the sunset and cocktails at this amazing rooftop bar!',
    social_url: 'https://instagram.com/p/234567',
    video_url: 'https://example.com/video2.mp4',
    thumbnail_url: 'https://via.placeholder.com/400x300?text=Cocktails',
    likes: 2300,
    comments: 78,
    views: 15000,
    timestamp: '2024-08-30T18:45:23Z',
    location: {
      name: 'Skyline Lounge',
      address: '456 Market St, San Francisco, CA',
      latitude: 37.7833,
      longitude: -122.4167,
    },
  },
  // Add more mock results as needed
];

// Mock venues
const mockVenues = [
  {
    id: '1',
    name: 'Blue Bottle Coffee',
    title: 'Cozy Coffee Spot',
    description: 'Trending cafe with chill vibes and great lattes.',
    address: '123 Main St, San Francisco, CA',
    latitude: 37.7749,
    longitude: -122.4194,
    social_url: 'https://instagram.com/bluebottle',
    video_url: 'https://example.com/video1.mp4',
    image_url: 'https://via.placeholder.com/400x300?text=Coffee',
    thumbnail_url: 'https://via.placeholder.com/400x300?text=Coffee',
    trend_score: 85,
    categories: ['Coffee', 'Cafe', 'Breakfast'],
  },
  {
    id: '2',
    name: 'Skyline Lounge',
    title: 'Rooftop Cocktail Bar',
    description: 'Elegant rooftop bar with stunning city views and craft cocktails.',
    address: '456 Market St, San Francisco, CA',
    latitude: 37.7833,
    longitude: -122.4167,
    social_url: 'https://instagram.com/skylinelounge',
    video_url: 'https://example.com/video2.mp4',
    image_url: 'https://via.placeholder.com/400x300?text=Cocktails',
    thumbnail_url: 'https://via.placeholder.com/400x300?text=Cocktails',
    trend_score: 92,
    categories: ['Bar', 'Nightlife', 'Cocktails'],
  },
  // Add more mock venues as needed
];

