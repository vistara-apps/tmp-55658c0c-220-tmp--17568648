'use server';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
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
  // Add more mocks as needed
];
