# VibeFinder API Documentation

This document provides comprehensive documentation for all external APIs used in the VibeFinder application.

## Table of Contents

1. [EnsembleData API](#ensembledata-api)
2. [SocialKit Video Analysis API](#socialkit-video-analysis-api)
3. [OpenAI API](#openai-api)
4. [Google Maps Geocoding/Places API](#google-maps-geocodingplaces-api)
5. [Supabase API](#supabase-api)

---

## EnsembleData API

### Overview

EnsembleData provides real-time scraping of TikTok and Instagram video content, including visual data and hashtags, to identify trending local spots.

### Base URL
```
https://ensembledata.com
```

### Authentication
API Token authentication is required for all endpoints.

### Endpoints

#### Search Hashtags
```
GET /apis/tt/hashtag_search?hashtag={hashtag}&token={token}
```

**Parameters:**
- `hashtag` (required): The hashtag to search for (e.g., "sanfrancisco")
- `token` (required): Your API authentication token

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "tt-12345",
      "platform": "tiktok",
      "url": "https://tiktok.com/video123",
      "hashtags": ["foodie", "sanfrancisco"],
      "engagement": 5000,
      "location": "San Francisco",
      "venue": "Tartine Bakery",
      "created_at": "2025-08-30T12:34:56Z"
    }
  ]
}
```

#### Get Video Details
```
GET /apis/video/{video_id}?token={token}
```

**Parameters:**
- `video_id` (required): The ID of the video to retrieve
- `token` (required): Your API authentication token

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "tt-12345",
    "platform": "tiktok",
    "url": "https://tiktok.com/video123",
    "hashtags": ["foodie", "sanfrancisco"],
    "engagement": 5000,
    "location": "San Francisco",
    "venue": "Tartine Bakery",
    "created_at": "2025-08-30T12:34:56Z",
    "video_url": "https://cdn.tiktok.com/video123.mp4",
    "thumbnail_url": "https://cdn.tiktok.com/thumb123.jpg",
    "description": "Best croissants in SF! #foodie #sanfrancisco",
    "author": {
      "id": "user123",
      "username": "foodieexplorer",
      "follower_count": 10000
    }
  }
}
```

### Rate Limits
- 100 requests per minute
- 5,000 requests per day

### Error Codes
- `401`: Unauthorized - Invalid or missing token
- `404`: Not found - Hashtag or video not found
- `429`: Too many requests - Rate limit exceeded

---

## SocialKit Video Analysis API

### Overview

SocialKit provides AI-powered analysis of video content to extract summaries, identify keywords, and gauge engagement/sentiment.

### Base URL
```
https://www.socialkit.dev
```

### Authentication
API Key authentication is required for all endpoints.

### Endpoints

#### Video Summary
```
POST /video/summary
```

**Headers:**
- `Authorization`: Bearer {your_api_key}
- `Content-Type`: application/json

**Request Body:**
```json
{
  "video_url": "https://tiktok.com/video123"
}
```

**Response:**
```json
{
  "summary": "Busy cafe with people enjoying artisanal coffee and pastries",
  "keywords": ["coffee", "pastry", "cozy", "artisanal"],
  "duration": 45
}
```

#### Video Transcript
```
POST /video/transcript
```

**Headers:**
- `Authorization`: Bearer {your_api_key}
- `Content-Type`: application/json

**Request Body:**
```json
{
  "video_url": "https://tiktok.com/video123"
}
```

**Response:**
```json
{
  "transcript": "Hey guys, I'm at Tartine Bakery in San Francisco and you have to try their croissants. They're so flaky and buttery. Look at this! The line is out the door but it's totally worth the wait.",
  "language": "en",
  "confidence": 0.95
}
```

#### Video Analytics
```
POST /video/analytics
```

**Headers:**
- `Authorization`: Bearer {your_api_key}
- `Content-Type`: application/json

**Request Body:**
```json
{
  "video_url": "https://tiktok.com/video123"
}
```

**Response:**
```json
{
  "engagement_score": 85,
  "sentiment": "positive",
  "vibe_categories": ["Chill", "Foodie", "Artsy"],
  "audience_demographics": {
    "age_groups": ["18-24", "25-34"],
    "interests": ["food", "travel", "lifestyle"]
  },
  "content_analysis": {
    "topics": ["bakery", "food", "local business"],
    "mood": "enthusiastic",
    "setting": "indoor, cafe"
  }
}
```

### Rate Limits
- 50 requests per minute
- 1,000 requests per day

### Error Codes
- `400`: Bad Request - Invalid parameters
- `401`: Unauthorized - Invalid API key
- `429`: Too many requests - Rate limit exceeded
- `500`: Internal Server Error - Processing failed

---

## OpenAI API

### Overview

OpenAI provides Natural Language Processing for summarizing video transcripts, categorizing venues by 'vibe', and generating concise recommendation descriptions.

### Base URL
```
https://api.openai.com/v1
```

### Authentication
API Key authentication is required for all endpoints.

### Endpoints

#### Chat Completions
```
POST /chat/completions
```

**Headers:**
- `Authorization`: Bearer {your_api_key}
- `Content-Type`: application/json

**Request Body:**
```json
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "system",
      "content": "Generate a concise, engaging description for a local venue based on keywords."
    },
    {
      "role": "user",
      "content": "Venue: Tartine Bakery, Keywords: coffee, pastry, cozy, artisanal"
    }
  ],
  "max_tokens": 100,
  "temperature": 0.7
}
```

**Response:**
```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677858242,
  "model": "gpt-4",
  "usage": {
    "prompt_tokens": 67,
    "completion_tokens": 50,
    "total_tokens": 117
  },
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "A cozy corner bakery serving artisanal pastries and rich coffee in a warm, inviting atmosphere that locals can't stop raving about."
      },
      "finish_reason": "stop",
      "index": 0
    }
  ]
}
```

### Rate Limits
Varies by model and account tier. Refer to OpenAI documentation for specific limits.

### Error Codes
- `400`: Bad Request - Invalid parameters
- `401`: Unauthorized - Invalid API key
- `429`: Too many requests - Rate limit exceeded
- `500`: Internal Server Error - Processing failed

---

## Google Maps Geocoding/Places API

### Overview

Google Maps APIs are used to convert venue names and addresses into precise geographical coordinates for the map view and to enrich venue data.

### Base URL
```
https://maps.googleapis.com/maps/api
```

### Authentication
API Key authentication is required for all endpoints.

### Endpoints

#### Geocoding API
```
GET /geocode/json?address={address}&key={your_api_key}
```

**Parameters:**
- `address` (required): The address to geocode
- `key` (required): Your API key

**Response:**
```json
{
  "results": [
    {
      "formatted_address": "600 Guerrero St, San Francisco, CA 94110, USA",
      "geometry": {
        "location": {
          "lat": 37.7614,
          "lng": -122.4256
        },
        "location_type": "ROOFTOP",
        "viewport": {
          "northeast": {
            "lat": 37.7627489802915,
            "lng": -122.4242510197085
          },
          "southwest": {
            "lat": 37.7600510197085,
            "lng": -122.4269489802915
          }
        }
      },
      "place_id": "ChIJfc-8YBZ-j4ARoOKQtHq2lVw",
      "types": ["establishment", "food", "point_of_interest", "store"]
    }
  ],
  "status": "OK"
}
```

#### Places API
```
GET /place/details/json?place_id={place_id}&fields=name,rating,formatted_phone_number,website,opening_hours,photos&key={your_api_key}
```

**Parameters:**
- `place_id` (required): The place ID to retrieve details for
- `fields` (optional): Comma-separated list of fields to include
- `key` (required): Your API key

**Response:**
```json
{
  "result": {
    "name": "Tartine Bakery",
    "rating": 4.6,
    "formatted_phone_number": "(415) 487-2600",
    "website": "https://tartinebakery.com/",
    "opening_hours": {
      "open_now": true,
      "periods": [
        {
          "open": {
            "day": 0,
            "time": "0800"
          },
          "close": {
            "day": 0,
            "time": "1700"
          }
        }
      ],
      "weekday_text": [
        "Monday: 8:00 AM – 5:00 PM",
        "Tuesday: 8:00 AM – 5:00 PM",
        "Wednesday: 8:00 AM – 5:00 PM",
        "Thursday: 8:00 AM – 5:00 PM",
        "Friday: 8:00 AM – 5:00 PM",
        "Saturday: 8:00 AM – 5:00 PM",
        "Sunday: 8:00 AM – 5:00 PM"
      ]
    },
    "photos": [
      {
        "height": 3024,
        "html_attributions": [
          "<a href=\"https://maps.google.com/maps/contrib/114156067109838343396\">John Doe</a>"
        ],
        "photo_reference": "Aap_uEDxzCOQHR12345",
        "width": 4032
      }
    ]
  },
  "status": "OK"
}
```

### Rate Limits
- Geocoding API: 50 requests per second
- Places API: 100 requests per second
- Daily limits vary by billing plan

### Error Codes
- `INVALID_REQUEST`: The request was invalid
- `OVER_QUERY_LIMIT`: The quota has been exceeded
- `REQUEST_DENIED`: The request was denied
- `UNKNOWN_ERROR`: An unknown error occurred

---

## Supabase API

### Overview

Supabase provides a Backend as a Service for storing user data, curated recommendations, favorites, and managing application state.

### Base URL
```
https://{your-project-id}.supabase.co/rest/v1
```

### Authentication
API Key and JWT authentication are required for all endpoints.

### Endpoints

#### Users Table

##### Get User Profile
```
GET /users?userId=eq.{userId}
```

**Headers:**
- `apikey`: {your_supabase_key}
- `Authorization`: Bearer {user_jwt_token}

**Response:**
```json
[
  {
    "userId": "0x1234567890abcdef",
    "preferences": ["Chill", "Foodie"],
    "saved_locations": ["rec-1", "rec-2"],
    "onboarding_complete": true
  }
]
```

##### Create/Update User Profile
```
POST /users
```

**Headers:**
- `apikey`: {your_supabase_key}
- `Authorization`: Bearer {user_jwt_token}
- `Content-Type`: application/json
- `Prefer`: return=minimal

**Request Body:**
```json
{
  "userId": "0x1234567890abcdef",
  "preferences": ["Chill", "Foodie"],
  "saved_locations": [],
  "onboarding_complete": false
}
```

**Response:**
```
204 No Content
```

#### Recommendations Table

##### Get Recommendations
```
GET /recommendations?select=*
```

**Headers:**
- `apikey`: {your_supabase_key}
- `Authorization`: Bearer {user_jwt_token}

**Response:**
```json
[
  {
    "recommendationId": "rec-1",
    "title": "Cozy Coffee Spot",
    "description": "Trending cafe with chill vibes and great lattes.",
    "venue_name": "Blue Bottle Coffee",
    "location": { "lat": 37.7749, "lng": -122.4194 },
    "social_media_url": "https://instagram.com/bluebottle",
    "trend_score": 85,
    "vibe_tags": ["Chill", "Coffee"],
    "image_url": "https://example.com/image.jpg",
    "video_url": "https://example.com/video.mp4",
    "timestamp": "2025-08-30T00:00:00Z"
  }
]
```

#### Venues Table

##### Get Venue Details
```
GET /venues?venueId=eq.{venueId}
```

**Headers:**
- `apikey`: {your_supabase_key}
- `Authorization`: Bearer {user_jwt_token}

**Response:**
```json
[
  {
    "venueId": "venue-1",
    "name": "Blue Bottle Coffee",
    "address": "66 Mint St, San Francisco, CA 94103",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "categories": ["Coffee", "Cafe"]
  }
]
```

### Rate Limits
- Determined by your Supabase plan
- Default: 1,000 requests per minute

### Error Codes
- `401`: Unauthorized - Invalid API key or JWT
- `404`: Not found - Resource not found
- `409`: Conflict - Unique constraint violation
- `429`: Too many requests - Rate limit exceeded

