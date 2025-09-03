'use server';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: "https://openrouter.ai/api/v1",
});

export async function getRecommendations(location: string, preferences: string[]) {
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
    console.error('Error generating recommendations:', error);
    return mockRecommendations;
  }
}

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
    title: 'Energetic Dance Club',
    description: 'Popular nightclub with amazing DJs and dance floor.',
    venue_name: 'Monarch',
    location: { lat: 37.7816, lng: -122.4090 },
    social_media_url: 'https://instagram.com/monarchsf',
    trend_score: 92,
    vibe_tags: ['Energetic', 'Nightlife'],
    image_url: 'https://via.placeholder.com/400x300?text=Club',
    video_url: 'https://example.com/video2.mp4',
    timestamp: '2024-08-29'
  },
  {
    recommendationId: '3',
    title: 'Romantic Dinner Spot',
    description: 'Elegant restaurant with intimate atmosphere and excellent cuisine.',
    venue_name: 'Foreign Cinema',
    location: { lat: 37.7561, lng: -122.4186 },
    social_media_url: 'https://instagram.com/foreigncinemasf',
    trend_score: 78,
    vibe_tags: ['Romantic', 'Dining'],
    image_url: 'https://via.placeholder.com/400x300?text=Restaurant',
    video_url: 'https://example.com/video3.mp4',
    timestamp: '2024-08-28'
  },
  {
    recommendationId: '4',
    title: 'Adventurous Hiking Trail',
    description: 'Scenic trail with breathtaking views of the city and bay.',
    venue_name: 'Lands End Trail',
    location: { lat: 37.7825, lng: -122.5097 },
    social_media_url: 'https://instagram.com/goldengatenps',
    trend_score: 88,
    vibe_tags: ['Adventurous', 'Outdoors'],
    image_url: 'https://via.placeholder.com/400x300?text=Hiking',
    video_url: 'https://example.com/video4.mp4',
    timestamp: '2024-08-27'
  },
  {
    recommendationId: '5',
    title: 'Chill Rooftop Bar',
    description: 'Relaxed rooftop venue with craft cocktails and city views.',
    venue_name: 'Charmaine\'s',
    location: { lat: 37.7821, lng: -122.4090 },
    social_media_url: 'https://instagram.com/charmainessf',
    trend_score: 90,
    vibe_tags: ['Chill', 'Nightlife'],
    image_url: 'https://via.placeholder.com/400x300?text=Rooftop',
    video_url: 'https://example.com/video5.mp4',
    timestamp: '2024-08-26'
  }
];
