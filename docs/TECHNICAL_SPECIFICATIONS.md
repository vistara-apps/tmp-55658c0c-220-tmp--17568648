# VibeFinder Technical Specifications

## Overview

VibeFinder is an AI-powered web application that curates and displays trending local experiences and events based on real-time social media video analysis, presented visually on a map. This document outlines the technical specifications for the application.

## Table of Contents

1. [Architecture](#architecture)
2. [Data Model](#data-model)
3. [API Integration](#api-integration)
4. [User Flows](#user-flows)
5. [Design System](#design-system)
6. [Performance Considerations](#performance-considerations)
7. [Security Considerations](#security-considerations)
8. [Deployment Strategy](#deployment-strategy)

---

## Architecture

### Frontend

- **Framework**: Next.js 15 (React 18)
- **Styling**: Tailwind CSS
- **State Management**: React Query for server state, React Context for global UI state
- **Authentication**: Web3 authentication via Coinbase OnchainKit
- **Map Visualization**: Leaflet.js with React-Leaflet

### Backend

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Web3 integration
- **Storage**: Supabase Storage for user-generated content
- **Serverless Functions**: Next.js API routes and server actions
- **Caching**: Upstash Redis for API response caching

### External Services

- **AI Processing**: OpenAI API for natural language processing
- **Social Media Data**: EnsembleData API for TikTok and Instagram content
- **Video Analysis**: SocialKit API for video content analysis
- **Geocoding**: Google Maps API for location data

### System Architecture Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Client Browser │────▶│  Next.js App    │────▶│  Supabase       │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │                 │
                        │  External APIs  │
                        │                 │
                        └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │                 │
                        │  Redis Cache    │
                        │                 │
                        └─────────────────┘
```

---

## Data Model

### User

| Field              | Type       | Description                                |
|--------------------|------------|--------------------------------------------|
| userId             | string     | Unique identifier (wallet address)         |
| preferences        | string[]   | Array of user preference tags              |
| saved_locations    | string[]   | Array of saved recommendation IDs          |
| onboarding_complete| boolean    | Whether user has completed onboarding      |

### Recommendation

| Field              | Type       | Description                                |
|--------------------|------------|--------------------------------------------|
| recommendationId   | string     | Unique identifier                          |
| title              | string     | Title of the recommendation                |
| description        | string     | Description of the venue/experience        |
| venue_name         | string     | Name of the venue                          |
| location           | object     | Object with lat and lng coordinates        |
| social_media_url   | string     | URL to the source social media post        |
| trend_score        | number     | Popularity score (0-100)                   |
| vibe_tags          | string[]   | Array of vibe categories                   |
| image_url          | string     | URL to the venue image                     |
| video_url          | string     | URL to the social media video              |
| timestamp          | string     | ISO timestamp of when it was trending      |

### Venue

| Field              | Type       | Description                                |
|--------------------|------------|--------------------------------------------|
| venueId            | string     | Unique identifier                          |
| name               | string     | Name of the venue                          |
| address            | string     | Physical address                           |
| latitude           | number     | Latitude coordinate                        |
| longitude          | number     | Longitude coordinate                       |
| categories         | string[]   | Array of venue categories                  |

---

## API Integration

### EnsembleData API

Used for real-time scraping of TikTok and Instagram video content to identify trending local spots.

**Key Endpoints:**
- `/apis/tt/hashtag_search` - Search for trending content by hashtag
- `/apis/ig/location_search` - Search for trending content by location

### SocialKit Video Analysis API

Used for AI-powered analysis of video content to extract summaries, identify keywords, and gauge engagement/sentiment.

**Key Endpoints:**
- `/video/summary` - Generate summary of video content
- `/video/transcript` - Extract transcript from video
- `/video/analytics` - Analyze video engagement and sentiment

### OpenAI API

Used for natural language processing to summarize video transcripts, categorize venues by 'vibe', and generate recommendation descriptions.

**Key Endpoints:**
- `/v1/chat/completions` - Generate text based on prompts

### Google Maps Geocoding/Places API

Used to convert venue names and addresses into geographical coordinates and enrich venue data.

**Key Endpoints:**
- Geocoding API - Convert addresses to coordinates
- Places API - Get venue details

### Supabase API

Used for data persistence and user management.

**Key Endpoints:**
- `/rest/v1/users` - User profile management
- `/rest/v1/recommendations` - Recommendation data
- `/rest/v1/venues` - Venue information

---

## User Flows

### User Discovery Flow

1. User opens app and sees map with nearby trending recommendations based on general popularity
2. User taps a recommendation card to view details (description, social video snippet, vibe tags)
3. User can 'like' or 'save' a recommendation
4. User can filter recommendations by vibe, category, or distance

**Implementation Details:**
- Map view uses Leaflet.js with custom markers
- Recommendation cards use expandable/collapsible design
- Filtering is implemented client-side for immediate response
- Saved recommendations are persisted to Supabase

### User Onboarding & Personalization Flow

1. First-time users are prompted to connect social accounts (or answer preference questions) for personalized 'vibe' matching
2. App analyzes social activity to build an initial user profile
3. Recommendations dynamically update based on learned preferences

**Implementation Details:**
- Multi-step onboarding process with progress tracking
- Preference selection using interactive UI elements
- Profile data stored in Supabase
- Personalization algorithm uses weighted scoring based on preferences

---

## Design System

### Colors

| Token     | Value                | Usage                           |
|-----------|----------------------|---------------------------------|
| primary   | hsl(234, 82%, 57%)   | Primary actions, branding       |
| accent    | hsl(158, 75%, 50%)   | Secondary actions, highlights   |
| bg        | hsl(0, 0%, 98%)      | Background color                |
| surface   | hsl(0, 0%, 100%)     | Card and component backgrounds  |

### Typography

| Token     | Value                           | Usage                           |
|-----------|--------------------------------|---------------------------------|
| display   | text-6xl font-extrabold        | Hero text, main headings        |
| heading   | text-2xl font-bold             | Section headings                |
| body      | text-base font-normal leading-7 | Body text                       |

### Spacing

| Token     | Value                | Usage                           |
|-----------|----------------------|---------------------------------|
| sm        | 8px                  | Tight spacing                   |
| md        | 16px                 | Standard spacing                |
| lg        | 32px                 | Generous spacing                |

### Border Radius

| Token     | Value                | Usage                           |
|-----------|----------------------|---------------------------------|
| sm        | 4px                  | Small elements                  |
| md        | 8px                  | Buttons, inputs                 |
| lg        | 12px                 | Cards, modals                   |

### Shadows

| Token     | Value                                  | Usage                           |
|-----------|----------------------------------------|---------------------------------|
| card      | 0 4px 12px hsla(0, 0%, 0%, 0.08)      | Cards, interactive elements     |
| modal     | 0 16px 48px hsla(0, 0%, 0%, 0.16)     | Modals, popovers                |

### Components

1. **AppHeader**
   - Main navigation component
   - Contains logo, user profile, and wallet connection

2. **RecommendationCard**
   - Displays venue information
   - Expandable to show more details
   - Variants: expanded, collapsed

3. **MapPin**
   - Custom map marker for recommendations
   - Variants: active, inactive

4. **VibeTag**
   - Displays vibe category
   - Used for filtering and in recommendation cards

---

## Performance Considerations

### Caching Strategy

- API responses cached in Redis with TTL of 5 minutes
- Static assets served from CDN with long cache times
- Recommendation data refreshed on demand or every 30 minutes

### Lazy Loading

- Images and videos lazy-loaded as user scrolls
- Map markers clustered for performance with large datasets
- Dynamic imports for non-critical components

### Optimization Techniques

- Server-side rendering for initial page load
- Client-side rendering for interactive elements
- Debounced search and filter operations
- Pagination for large result sets
- Image optimization with Next.js Image component

---

## Security Considerations

### Authentication

- Web3 wallet-based authentication
- JWT tokens for API authorization
- Session management with secure cookies

### Data Protection

- HTTPS for all communications
- API keys stored as environment variables
- No sensitive user data stored (minimal data collection)

### API Security

- Rate limiting on all endpoints
- CORS restrictions for API access
- Input validation and sanitization

---

## Deployment Strategy

### Environment Setup

- Development: Local development environment
- Staging: Vercel preview deployments
- Production: Vercel production deployment

### CI/CD Pipeline

- GitHub Actions for automated testing
- Vercel integration for preview deployments
- Automated database migrations

### Monitoring

- Vercel Analytics for performance monitoring
- Sentry for error tracking
- Custom logging for API interactions

### Scaling Strategy

- Serverless architecture for automatic scaling
- Database connection pooling
- CDN for static assets
- Redis caching for high-traffic endpoints

