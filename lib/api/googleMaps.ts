/**
 * Google Maps API Client
 * 
 * This module provides functions for interacting with the Google Maps API,
 * which is used for geocoding, location search, and venue details.
 */

// Base URL for Google Maps API
const BASE_URL = 'https://maps.googleapis.com/maps/api';

// API key
const API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

// Geocode an address to coordinates
export async function geocodeAddress(address: string) {
  try {
    // In a real app, this would make an API request to Google Maps
    // For now, we'll return mock data based on the address
    
    // Mock geocoding for common cities
    const mockGeocoding: Record<string, { latitude: number; longitude: number }> = {
      'san francisco': { latitude: 37.7749, longitude: -122.4194 },
      'new york': { latitude: 40.7128, longitude: -74.0060 },
      'los angeles': { latitude: 34.0522, longitude: -118.2437 },
      'chicago': { latitude: 41.8781, longitude: -87.6298 },
      'miami': { latitude: 25.7617, longitude: -80.1918 },
      'seattle': { latitude: 47.6062, longitude: -122.3321 },
      'austin': { latitude: 30.2672, longitude: -97.7431 },
      'denver': { latitude: 39.7392, longitude: -104.9903 },
      'boston': { latitude: 42.3601, longitude: -71.0589 },
      'portland': { latitude: 45.5152, longitude: -122.6784 },
    };
    
    // Check if address matches any of our mock cities
    const lowerAddress = address.toLowerCase();
    for (const [city, coords] of Object.entries(mockGeocoding)) {
      if (lowerAddress.includes(city)) {
        return coords;
      }
    }
    
    // Default to San Francisco if no match
    return { latitude: 37.7749, longitude: -122.4194 };
  } catch (error) {
    console.error('Error geocoding address:', error);
    // Default to San Francisco if error
    return { latitude: 37.7749, longitude: -122.4194 };
  }
}

// Reverse geocode coordinates to an address
export async function reverseGeocode(latitude: number, longitude: number) {
  try {
    // In a real app, this would make an API request to Google Maps
    // For now, we'll return mock data based on the coordinates
    
    // Mock reverse geocoding for common coordinates
    const mockReverseGeocoding: Record<string, { address: string }> = {
      '37.7749,-122.4194': { address: 'San Francisco, CA' },
      '40.7128,-74.0060': { address: 'New York, NY' },
      '34.0522,-118.2437': { address: 'Los Angeles, CA' },
      '41.8781,-87.6298': { address: 'Chicago, IL' },
      '25.7617,-80.1918': { address: 'Miami, FL' },
    };
    
    // Check if coordinates match any of our mock locations
    const coordKey = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    for (const [key, data] of Object.entries(mockReverseGeocoding)) {
      if (coordKey.startsWith(key.split(',')[0]) && coordKey.includes(key.split(',')[1])) {
        return data;
      }
    }
    
    // Default to San Francisco if no match
    return { address: 'Unknown Location' };
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return { address: 'Unknown Location' };
  }
}

// Search for places near a location
export async function searchNearbyPlaces(
  latitude: number,
  longitude: number,
  radius: number = 5000,
  type: string = 'restaurant',
  keyword: string = ''
) {
  try {
    // In a real app, this would make an API request to Google Maps
    // For now, we'll return mock data
    return mockPlaces;
  } catch (error) {
    console.error('Error searching nearby places:', error);
    return [];
  }
}

// Get details for a place
export async function getPlaceDetails(placeId: string) {
  try {
    // In a real app, this would make an API request to Google Maps
    // For now, we'll return mock data
    const place = mockPlaces.find(p => p.place_id === placeId);
    
    if (!place) {
      throw new Error(`Place not found: ${placeId}`);
    }
    
    return {
      ...place,
      website: 'https://example.com',
      phone_number: '+1 (555) 123-4567',
      opening_hours: {
        open_now: true,
        weekday_text: [
          'Monday: 9:00 AM – 10:00 PM',
          'Tuesday: 9:00 AM – 10:00 PM',
          'Wednesday: 9:00 AM – 10:00 PM',
          'Thursday: 9:00 AM – 10:00 PM',
          'Friday: 9:00 AM – 11:00 PM',
          'Saturday: 9:00 AM – 11:00 PM',
          'Sunday: 9:00 AM – 10:00 PM',
        ],
      },
      price_level: 2,
      rating: 4.5,
      user_ratings_total: 1234,
    };
  } catch (error) {
    console.error('Error getting place details:', error);
    return null;
  }
}

// Mock places data
const mockPlaces = [
  {
    place_id: 'place1',
    name: 'Blue Bottle Coffee',
    vicinity: '123 Main St, San Francisco, CA',
    geometry: {
      location: {
        lat: 37.7749,
        lng: -122.4194,
      },
    },
    types: ['cafe', 'food', 'point_of_interest', 'establishment'],
    photos: [
      {
        photo_reference: 'photo_ref_1',
        width: 400,
        height: 300,
      },
    ],
  },
  {
    place_id: 'place2',
    name: 'Skyline Lounge',
    vicinity: '456 Market St, San Francisco, CA',
    geometry: {
      location: {
        lat: 37.7833,
        lng: -122.4167,
      },
    },
    types: ['bar', 'restaurant', 'food', 'point_of_interest', 'establishment'],
    photos: [
      {
        photo_reference: 'photo_ref_2',
        width: 400,
        height: 300,
      },
    ],
  },
  {
    place_id: 'place3',
    name: 'Blue Note SF',
    vicinity: '789 Mission St, San Francisco, CA',
    geometry: {
      location: {
        lat: 37.7694,
        lng: -122.4248,
      },
    },
    types: ['night_club', 'bar', 'music_venue', 'point_of_interest', 'establishment'],
    photos: [
      {
        photo_reference: 'photo_ref_3',
        width: 400,
        height: 300,
      },
    ],
  },
  {
    place_id: 'place4',
    name: 'Ferry Building Marketplace',
    vicinity: '1 Ferry Building, San Francisco, CA',
    geometry: {
      location: {
        lat: 37.7955,
        lng: -122.3937,
      },
    },
    types: ['shopping_mall', 'food', 'point_of_interest', 'establishment'],
    photos: [
      {
        photo_reference: 'photo_ref_4',
        width: 400,
        height: 300,
      },
    ],
  },
  {
    place_id: 'place5',
    name: 'Coin-Op Game Room',
    vicinity: '508 4th St, San Francisco, CA',
    geometry: {
      location: {
        lat: 37.7765,
        lng: -122.4130,
      },
    },
    types: ['bar', 'entertainment', 'point_of_interest', 'establishment'],
    photos: [
      {
        photo_reference: 'photo_ref_5',
        width: 400,
        height: 300,
      },
    ],
  },
];

