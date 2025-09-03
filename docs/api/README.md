# VibeFinder API Documentation

This documentation provides details about the VibeFinder API, including endpoints, request/response formats, authentication requirements, and example usage.

## Table of Contents

- [Authentication](#authentication)
- [Supabase Integration](#supabase-integration)
- [External API Integrations](#external-api-integrations)
- [Subscription Management](#subscription-management)

## Authentication

VibeFinder uses Supabase for authentication and user management. The application also supports wallet-based authentication through Coinbase's OnchainKit.

For more details, see [Authentication Documentation](./authentication.md).

## Supabase Integration

VibeFinder uses Supabase as its backend database and authentication provider. The application interacts with Supabase to store and retrieve user data, recommendations, venues, and saved recommendations.

For more details, see [Supabase Integration Documentation](./supabase.md).

## External API Integrations

VibeFinder integrates with several external APIs to provide its core functionality:

- **EnsembleData API**: Used for social media content scraping and trending venue discovery.
- **SocialKit API**: Used for video content analysis, including sentiment analysis and keyword extraction.
- **OpenAI API**: Used for natural language processing, including summarization and categorization.
- **Google Maps API**: Used for geocoding, location search, and venue details.

For more details, see [External API Integrations Documentation](./external-integrations.md).

## Subscription Management

VibeFinder offers a subscription-based model with free and premium tiers. The subscription management API handles subscription creation, cancellation, and status checking.

For more details, see [Subscription Management Documentation](./subscription.md).

