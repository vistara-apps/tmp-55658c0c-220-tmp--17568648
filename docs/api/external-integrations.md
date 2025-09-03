# External API Integrations Documentation

VibeFinder integrates with several external APIs to provide its core functionality. This document outlines the APIs used, their purposes, and how they are integrated into the application.

## EnsembleData API

EnsembleData is used for social media content scraping and trending venue discovery.

### Base URL
```
https://ensembledata.com
```

### Authentication
EnsembleData requires an API token for authentication. The token is passed as a query parameter in each request.

### Endpoints

#### Search by Hashtag
```
GET /apis/tt/hashtag_search?hashtag={hashtag}&token={token}
```

**Description**: Searches for trending content by hashtag.

**Parameters**:
- `hashtag`: The hashtag to search for.
- `token`: Your API token.

**Example Usage**:
```typescript
const results = await searchByHashtag('nightlife', 10);
console.log(`Found ${results.length} results`);
```

#### Search by Location
```
GET /apis/tt/location_search?lat={latitude}&lng={longitude}&radius={radius}&limit={limit}&token={token}
```

**Description**: Searches for trending content by location.

**Parameters**:
- `lat`: The latitude coordinate.
- `lng`: The longitude coordinate.
- `radius`: The search radius in kilometers.
- `limit`: The maximum number of results to return.
- `token`: Your API token.

**Example Usage**:
```typescript
const results = await searchByLocation(37.7749, -122.4194, 5, 10);
console.log(`Found ${results.length} results`);
```

#### Get Trending Venues
```
GET /apis/tt/trending_venues?lat={latitude}&lng={longitude}&radius={radius}&limit={limit}&token={token}
```

**Description**: Gets trending venues in a location.

**Parameters**:
- `lat`: The latitude coordinate.
- `lng`: The longitude coordinate.
- `radius`: The search radius in kilometers.
- `limit`: The maximum number of results to return.
- `token`: Your API token.

**Example Usage**:
```typescript
const venues = await getTrendingVenues(37.7749, -122.4194, 5, 10);
console.log(`Found ${venues.length} venues`);
```

## SocialKit Video Analysis API

SocialKit is used for video content analysis, including sentiment analysis and keyword extraction.

### Base URL
```
https://www.socialkit.dev
```

### Authentication
SocialKit requires an API key for authentication. The key is passed in the Authorization header of each request.

### Endpoints

#### Get Video Summary
```
POST /video/summary
```

**Description**: Generates a summary of a video.

**Request Body**:
```json
{
  "video_url": "https://example.com/video.mp4"
}
```

**Example Usage**:
```typescript
const summary = await getVideoSummary('https://example.com/video.mp4');
console.log(`Summary: ${summary.summary}`);
```

#### Get Video Transcript
```
POST /video/transcript
```

**Description**: Gets the transcript of a video.

**Request Body**:
```json
{
  "video_url": "https://example.com/video.mp4"
}
```

**Example Usage**:
```typescript
const transcript = await getVideoTranscript('https://example.com/video.mp4');
console.log(`Transcript: ${transcript.text}`);
```

#### Analyze Video Sentiment
```
POST /video/sentiment
```

**Description**: Analyzes the sentiment of a video.

**Request Body**:
```json
{
  "video_url": "https://example.com/video.mp4"
}
```

**Example Usage**:
```typescript
const sentiment = await analyzeVideoSentiment('https://example.com/video.mp4');
console.log(`Positive: ${sentiment.positive}, Negative: ${sentiment.negative}, Neutral: ${sentiment.neutral}`);
```

## OpenAI API

OpenAI is used for natural language processing, including summarization and categorization.

### Base URL
```
https://api.openai.com/v1
```

### Authentication
OpenAI requires an API key for authentication. The key is passed in the Authorization header of each request.

### Endpoints

#### Chat Completions
```
POST /chat/completions
```

**Description**: Generates text based on a prompt.

**Request Body**:
```json
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "system",
      "content": "You are an AI assistant that summarizes video content."
    },
    {
      "role": "user",
      "content": "Summarize this transcript: ..."
    }
  ]
}
```

**Example Usage**:
```typescript
const summary = await generateVideoSummary('Transcript text here', 150);
console.log(`Summary: ${summary}`);
```

## Google Maps API

Google Maps is used for geocoding, location search, and venue details.

### Base URL
```
https://maps.googleapis.com/maps/api
```

### Authentication
Google Maps requires an API key for authentication. The key is passed as a query parameter in each request.

### Endpoints

#### Geocoding
```
GET /geocode/json?address={address}&key={apiKey}
```

**Description**: Converts an address to coordinates.

**Parameters**:
- `address`: The address to geocode.
- `key`: Your API key.

**Example Usage**:
```typescript
const result = await geocodeAddress('San Francisco, CA');
console.log(`Latitude: ${result.latitude}, Longitude: ${result.longitude}`);
```

#### Reverse Geocoding
```
GET /geocode/json?latlng={latitude},{longitude}&key={apiKey}
```

**Description**: Converts coordinates to an address.

**Parameters**:
- `latlng`: The latitude and longitude coordinates.
- `key`: Your API key.

**Example Usage**:
```typescript
const result = await reverseGeocode(37.7749, -122.4194);
console.log(`Address: ${result.address}`);
```

#### Place Details
```
GET /place/details/json?place_id={placeId}&fields={fields}&key={apiKey}
```

**Description**: Gets details about a place.

**Parameters**:
- `place_id`: The ID of the place.
- `fields`: Comma-separated list of fields to include.
- `key`: Your API key.

**Example Usage**:
```typescript
const details = await getPlaceDetails('ChIJIQBpAG2ahYAR_6128GcTUEo');
console.log(`Name: ${details.name}, Address: ${details.formatted_address}`);
```

## Rate Limiting and Error Handling

All API integrations include rate limiting to avoid exceeding API quotas. The application also includes error handling to gracefully handle API errors and provide fallback mechanisms when APIs are unavailable.

