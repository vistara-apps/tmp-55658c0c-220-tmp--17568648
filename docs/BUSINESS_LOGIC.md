# VibeFinder Business Logic

## Overview

This document outlines the core business logic for the VibeFinder application, including recommendation algorithms, subscription model implementation, and key business processes.

## Table of Contents

1. [Recommendation Engine](#recommendation-engine)
2. [Subscription Model](#subscription-model)
3. [User Personalization](#user-personalization)
4. [Trend Analysis](#trend-analysis)
5. [Location-Based Logic](#location-based-logic)
6. [Business Rules](#business-rules)
7. [Metrics and KPIs](#metrics-and-kpis)

---

## Recommendation Engine

### Core Algorithm

The recommendation engine uses a multi-factor scoring system to rank and present venues to users:

1. **Trend Score Calculation**
   ```
   TrendScore = (0.4 * RecentEngagement) + (0.3 * EngagementGrowth) + (0.2 * ContentQuality) + (0.1 * SourceReliability)
   ```

   Where:
   - `RecentEngagement`: Normalized engagement metrics from the last 24 hours
   - `EngagementGrowth`: Rate of change in engagement over the past week
   - `ContentQuality`: Score based on video analysis (clarity, relevance)
   - `SourceReliability`: Score based on content creator's history and influence

2. **Personalization Factor**
   ```
   PersonalizationScore = (VibeMatchScore * 0.6) + (UserHistoryScore * 0.4)
   ```

   Where:
   - `VibeMatchScore`: Similarity between venue vibes and user preferences
   - `UserHistoryScore`: Based on user's past interactions with similar venues

3. **Final Recommendation Score**
   ```
   RecommendationScore = (TrendScore * 0.7) + (PersonalizationScore * 0.3)
   ```

### Data Sources

1. **Social Media Data**
   - TikTok trending videos by location and hashtags
   - Instagram location tags and trending posts
   - Engagement metrics (likes, comments, shares)

2. **Video Content Analysis**
   - Visual scene recognition
   - Audio transcription and sentiment analysis
   - Crowd density and atmosphere assessment

3. **User Behavior Data**
   - Saved recommendations
   - Click-through patterns
   - Time spent viewing specific recommendations

### Filtering Logic

1. **Vibe Filtering**
   - Primary filter based on user-selected vibe categories
   - Fuzzy matching for related vibes (e.g., "Chill" also matches "Relaxed")
   - Weighting system for multi-vibe venues

2. **Location Filtering**
   - Default radius: 5 miles from user location
   - Adjustable radius: 1-25 miles
   - Prioritization of venues within walking distance (0.5 miles)

3. **Freshness Filtering**
   - Default: Content from the past 48 hours
   - Premium tier: Real-time updates (past 6 hours)
   - Historical option: Past week's trending spots

---

## Subscription Model

### Tier Structure

1. **Free Tier**
   - Access to basic recommendations
   - Limited to 10 recommendations per day
   - Standard filters only
   - Ads displayed between recommendations
   - 48-hour trend delay

2. **Premium Tier ($5/month)**
   - Unlimited recommendations
   - Advanced filtering options
   - Ad-free experience
   - Real-time trend data
   - Personalized vibe matching
   - Exclusive "hidden gem" recommendations

### Upgrade Triggers

1. **Feature-Based Triggers**
   - User attempts to access premium feature
   - User reaches daily recommendation limit
   - User attempts to save more than 5 recommendations

2. **Value Demonstration Triggers**
   - After user visits a recommended venue (tracked via check-in)
   - When highly relevant new trending venue is detected
   - After 5 successful recommendation views

### Subscription Processing

1. **Payment Processing**
   - Integration with Coinbase Commerce
   - Support for credit card and cryptocurrency payments
   - Automatic renewal with 3-day reminder

2. **Subscription Management**
   - Self-service upgrade/downgrade
   - Prorated refunds for downgrades
   - Grace period of 3 days after failed payment

---

## User Personalization

### Preference Learning

1. **Explicit Preferences**
   - Initial onboarding questionnaire
   - Manual vibe tag selection
   - Saved venue categories

2. **Implicit Preferences**
   - Click patterns on recommendations
   - Time spent viewing specific venues
   - Social media account analysis (with permission)

3. **Preference Weighting**
   ```
   PreferenceWeight = (ExplicitScore * 0.7) + (ImplicitScore * 0.3)
   ```

### Personalization Algorithm

1. **Initial Recommendation Set**
   - Based on location and explicit preferences only
   - Broad range of trending venues

2. **Refinement Phase**
   - Analyze user interactions with initial set
   - Adjust weights for different vibe categories
   - Incorporate similar users' preferences

3. **Continuous Learning**
   - Weekly preference recalculation
   - Gradual shift based on changing behavior
   - Periodic preference confirmation prompts

---

## Trend Analysis

### Trend Detection

1. **Engagement Spike Detection**
   - Monitor sudden increases in social media engagement
   - Compare to historical baseline for the venue
   - Threshold: 200% increase over 24-hour period

2. **Hashtag Monitoring**
   - Track location-specific hashtags
   - Monitor emerging hashtags related to venues
   - Cross-reference with venue database

3. **Content Clustering**
   - Group similar content about the same venue
   - Identify common themes and descriptions
   - Determine primary "vibe" categories

### Trend Scoring

1. **Base Trend Score**
   ```
   BaseTrendScore = (NewPosts * 0.4) + (Engagement * 0.4) + (InfluencerMention * 0.2)
   ```

2. **Temporal Adjustment**
   ```
   TemporalFactor = exp(-0.1 * HoursSinceFirstDetection)
   ```

3. **Final Trend Score**
   ```
   FinalTrendScore = BaseTrendScore * TemporalFactor
   ```

### Trend Lifecycle Management

1. **Emerging Trend**
   - Initial detection phase
   - Limited confidence score
   - Shown to subset of users

2. **Active Trend**
   - Confirmed by multiple data points
   - High confidence score
   - Widely recommended

3. **Declining Trend**
   - Engagement dropping below threshold
   - Reduced prominence in recommendations
   - Archived after 72 hours below threshold

---

## Location-Based Logic

### Geolocation Processing

1. **User Location Determination**
   - Browser geolocation API (primary)
   - IP-based geolocation (fallback)
   - Manual location entry (override)

2. **Venue Geocoding**
   - Address to coordinates conversion
   - Reverse geocoding for area identification
   - Neighborhood and district tagging

3. **Distance Calculation**
   - Haversine formula for straight-line distance
   - Walking/driving time estimation via Google Maps API
   - Public transit accessibility scoring

### Location Relevance

1. **Proximity Scoring**
   ```
   ProximityScore = 1 - (Distance / MaxDistance)
   ```

2. **Area Popularity Adjustment**
   ```
   AreaFactor = 1 + (AreaPopularityScore * 0.2)
   ```

3. **Final Location Score**
   ```
   LocationScore = ProximityScore * AreaFactor
   ```

### Geographic Clustering

1. **Hotspot Identification**
   - Cluster analysis of trending venues
   - Minimum 3 venues within 0.5 miles
   - Combined trend score above threshold

2. **Route Optimization**
   - Suggest logical sequence of venues
   - Walking-friendly groupings
   - Complementary venue types (e.g., dinner then dessert)

---

## Business Rules

### Content Moderation

1. **Automated Filtering**
   - NSFW content detection and removal
   - Spam venue detection
   - Duplicate recommendation prevention

2. **Quality Thresholds**
   - Minimum video quality requirements
   - Minimum engagement thresholds
   - Venue verification requirements

3. **Fairness Mechanisms**
   - Anti-gaming measures to prevent manipulation
   - Diversity requirements in recommendations
   - Small business promotion rules

### Venue Relationships

1. **Venue Verification**
   - Optional verification process for venues
   - Verified badge display
   - Additional venue information access

2. **Promotional Opportunities**
   - Sponsored recommendations (clearly labeled)
   - Featured venue program
   - Special event promotion

3. **Feedback Integration**
   - Venue owner response capability
   - User report handling
   - Information correction process

### User Governance

1. **Account Limitations**
   - Maximum 3 devices per account
   - Rate limiting for API access
   - Abuse prevention measures

2. **Content Contribution**
   - User-submitted venue information
   - Correction suggestion process
   - Community curation capabilities

3. **Reward Mechanisms**
   - Streak rewards for daily app usage
   - Badge system for exploration
   - Referral program for premium tier

---

## Metrics and KPIs

### User Engagement Metrics

1. **Core Engagement**
   - Daily Active Users (DAU)
   - Monthly Active Users (MAU)
   - Session duration
   - Sessions per user per day

2. **Feature Engagement**
   - Map view time
   - Recommendation click-through rate
   - Filter usage frequency
   - Save action frequency

3. **Retention Metrics**
   - Day 1/7/30 retention rates
   - Churn rate by user segment
   - Reactivation rate

### Business Performance Metrics

1. **Revenue Metrics**
   - Monthly Recurring Revenue (MRR)
   - Average Revenue Per User (ARPU)
   - Conversion rate (free to premium)
   - Lifetime Value (LTV)

2. **Cost Metrics**
   - Customer Acquisition Cost (CAC)
   - API usage costs
   - Infrastructure costs per user
   - LTV:CAC ratio

3. **Growth Metrics**
   - User growth rate
   - Revenue growth rate
   - Viral coefficient
   - Word-of-mouth attribution

### Product Quality Metrics

1. **Recommendation Quality**
   - Recommendation acceptance rate
   - False positive rate
   - User satisfaction rating
   - Venue visit conversion rate

2. **Technical Performance**
   - App load time
   - Recommendation generation time
   - Error rate
   - API response time

3. **User Satisfaction**
   - Net Promoter Score (NPS)
   - Feature satisfaction ratings
   - Support ticket volume
   - App store ratings

