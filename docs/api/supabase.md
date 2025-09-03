# Supabase Integration Documentation

VibeFinder uses Supabase as its backend database and authentication provider. This document outlines the database schema, API endpoints, and usage examples.

## Database Schema

### Users Table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |
| email | text | User's email address |
| preferences | text[] | Array of user preferences |
| saved_locations | text[] | Array of saved location IDs |
| onboarding_complete | boolean | Whether onboarding is complete |
| subscription_tier | text | 'free' or 'premium' |
| subscription_expires_at | timestamp | When premium subscription expires |

### Recommendations Table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |
| title | text | Recommendation title |
| description | text | Recommendation description |
| venue_id | uuid | Foreign key to venues table |
| social_media_url | text | URL to social media post |
| trend_score | integer | Trending score (0-100) |
| vibe_tags | text[] | Array of vibe tags |
| image_url | text | URL to image |
| video_url | text | URL to video |

### Venues Table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |
| name | text | Venue name |
| address | text | Venue address |
| latitude | float | Venue latitude |
| longitude | float | Venue longitude |
| categories | text[] | Array of venue categories |

### Saved Recommendations Table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| created_at | timestamp | Creation timestamp |
| user_id | uuid | Foreign key to users table |
| recommendation_id | uuid | Foreign key to recommendations table |

## API Endpoints

### User API

#### Get User by ID

```typescript
async function getUserById(userId: string): Promise<User | null>
```

**Description**: Gets a user by their ID.

**Parameters**:
- `userId`: The ID of the user to get.

**Returns**: The user object if found, null otherwise.

**Example Usage**:
```typescript
const user = await getUserById('123e4567-e89b-12d3-a456-426614174000');
if (user) {
  console.log(`User: ${user.email}`);
} else {
  console.log('User not found');
}
```

#### Update User Preferences

```typescript
async function updateUserPreferences(userId: string, preferences: string[]): Promise<User | null>
```

**Description**: Updates a user's preferences.

**Parameters**:
- `userId`: The ID of the user to update.
- `preferences`: Array of preference strings.

**Returns**: The updated user object if successful, null otherwise.

**Example Usage**:
```typescript
const preferences = ['Chill', 'Romantic', 'Trendy'];
const updatedUser = await updateUserPreferences('123e4567-e89b-12d3-a456-426614174000', preferences);
if (updatedUser) {
  console.log('User preferences updated');
} else {
  console.log('Failed to update user preferences');
}
```

### Recommendation API

#### Get Recommendations by Location

```typescript
async function getRecommendationsByLocation(
  latitude: number,
  longitude: number,
  radius: number = 10,
  limit: number = 20
): Promise<RecommendationWithVenue[]>
```

**Description**: Gets recommendations near a specific location.

**Parameters**:
- `latitude`: The latitude coordinate.
- `longitude`: The longitude coordinate.
- `radius`: The search radius in kilometers (default: 10).
- `limit`: The maximum number of recommendations to return (default: 20).

**Returns**: Array of recommendations with venue details.

**Example Usage**:
```typescript
const recommendations = await getRecommendationsByLocation(37.7749, -122.4194, 5, 10);
console.log(`Found ${recommendations.length} recommendations`);
```

#### Get Recommendations by Vibe Tags

```typescript
async function getRecommendationsByVibeTags(
  vibeTags: string[],
  limit: number = 20
): Promise<RecommendationWithVenue[]>
```

**Description**: Gets recommendations matching specific vibe tags.

**Parameters**:
- `vibeTags`: Array of vibe tag strings.
- `limit`: The maximum number of recommendations to return (default: 20).

**Returns**: Array of recommendations with venue details.

**Example Usage**:
```typescript
const vibeTags = ['Chill', 'Romantic'];
const recommendations = await getRecommendationsByVibeTags(vibeTags, 10);
console.log(`Found ${recommendations.length} recommendations`);
```

#### Save Recommendation

```typescript
async function saveRecommendation(userId: string, recommendationId: string): Promise<boolean>
```

**Description**: Saves a recommendation for a user.

**Parameters**:
- `userId`: The ID of the user.
- `recommendationId`: The ID of the recommendation to save.

**Returns**: Boolean indicating success or failure.

**Example Usage**:
```typescript
const success = await saveRecommendation('123e4567-e89b-12d3-a456-426614174000', '456e7890-e12b-34d5-a678-426614174000');
if (success) {
  console.log('Recommendation saved');
} else {
  console.log('Failed to save recommendation');
}
```

### Venue API

#### Get Venue by ID

```typescript
async function getVenueById(id: string): Promise<Venue | null>
```

**Description**: Gets a venue by its ID.

**Parameters**:
- `id`: The ID of the venue to get.

**Returns**: The venue object if found, null otherwise.

**Example Usage**:
```typescript
const venue = await getVenueById('789e0123-e45b-67d8-a901-426614174000');
if (venue) {
  console.log(`Venue: ${venue.name}`);
} else {
  console.log('Venue not found');
}
```

#### Get Venues Near Location

```typescript
async function getVenuesNearLocation(
  latitude: number,
  longitude: number,
  radius: number = 10,
  limit: number = 20
): Promise<Venue[]>
```

**Description**: Gets venues near a specific location.

**Parameters**:
- `latitude`: The latitude coordinate.
- `longitude`: The longitude coordinate.
- `radius`: The search radius in kilometers (default: 10).
- `limit`: The maximum number of venues to return (default: 20).

**Returns**: Array of venues.

**Example Usage**:
```typescript
const venues = await getVenuesNearLocation(37.7749, -122.4194, 5, 10);
console.log(`Found ${venues.length} venues`);
```

## Error Handling

All API functions include error handling to gracefully handle database errors. Errors are logged to the console and appropriate error messages are returned to the caller.

