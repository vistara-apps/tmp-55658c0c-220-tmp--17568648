# Subscription Management Documentation

VibeFinder offers a subscription-based model with free and premium tiers. This document outlines the subscription management API, including subscription creation, cancellation, and status checking.

## Subscription Tiers

VibeFinder offers two subscription tiers:

1. **Free Tier**: Basic features available to all users.
2. **Premium Tier**: Advanced features available to paying subscribers.

### Free Tier Features

- Basic recommendations
- Interactive map view
- Up to 3 vibe filters
- Save favorite spots

### Premium Tier Features

- All free features
- Unlimited vibe filters
- Personalized recommendations
- Detailed trend insights
- Social media analytics
- Advanced search options

## Subscription Pricing

- **Free Tier**: $0/month
- **Premium Tier**: $5/month

## API Endpoints

### Subscribe to Premium

```typescript
async function subscribeToPremium(userId: string, paymentMethod: string): Promise<boolean>
```

**Description**: Subscribes a user to the premium tier.

**Parameters**:
- `userId`: The ID of the user to subscribe.
- `paymentMethod`: The payment method to use.

**Returns**: Boolean indicating success or failure.

**Example Usage**:
```typescript
const success = await subscribeToPremium('123e4567-e89b-12d3-a456-426614174000', 'payment_method_id');
if (success) {
  console.log('User subscribed to premium');
} else {
  console.log('Failed to subscribe user to premium');
}
```

### Cancel Premium Subscription

```typescript
async function cancelPremiumSubscription(userId: string): Promise<boolean>
```

**Description**: Cancels a user's premium subscription.

**Parameters**:
- `userId`: The ID of the user whose subscription to cancel.

**Returns**: Boolean indicating success or failure.

**Example Usage**:
```typescript
const success = await cancelPremiumSubscription('123e4567-e89b-12d3-a456-426614174000');
if (success) {
  console.log('Subscription canceled');
} else {
  console.log('Failed to cancel subscription');
}
```

### Check Premium Subscription

```typescript
async function hasPremiumSubscription(userId: string): Promise<boolean>
```

**Description**: Checks if a user has an active premium subscription.

**Parameters**:
- `userId`: The ID of the user to check.

**Returns**: Boolean indicating whether the user has an active premium subscription.

**Example Usage**:
```typescript
const isPremium = await hasPremiumSubscription('123e4567-e89b-12d3-a456-426614174000');
if (isPremium) {
  console.log('User has premium subscription');
} else {
  console.log('User does not have premium subscription');
}
```

### Check Feature Availability

```typescript
async function isFeatureAvailable(userId: string, feature: string): Promise<boolean>
```

**Description**: Checks if a specific feature is available to a user based on their subscription tier.

**Parameters**:
- `userId`: The ID of the user to check.
- `feature`: The feature to check availability for.

**Returns**: Boolean indicating whether the feature is available to the user.

**Example Usage**:
```typescript
const isAvailable = await isFeatureAvailable('123e4567-e89b-12d3-a456-426614174000', 'Detailed trend insights');
if (isAvailable) {
  console.log('Feature is available');
} else {
  console.log('Feature is not available');
}
```

## Payment Processing

In a production environment, VibeFinder would integrate with a payment processor like Stripe to handle subscription payments. The current implementation simulates payment processing for demonstration purposes.

### Payment Flow

1. **User selects premium tier**: The user selects the premium tier on the subscription page.
2. **User enters payment details**: The user enters their payment details in the payment form.
3. **Payment is processed**: The application processes the payment through the payment processor.
4. **Subscription is updated**: If the payment is successful, the user's subscription is updated to premium.

## Subscription Status Management

VibeFinder tracks subscription status in the users table in the Supabase database. The subscription_tier column indicates the user's current tier, and the subscription_expires_at column indicates when a premium subscription expires.

When a user subscribes to premium, their subscription_tier is set to 'premium' and subscription_expires_at is set to one month from the current date. When a premium subscription expires, the user is automatically downgraded to the free tier.

## Error Handling

All subscription management functions include error handling to gracefully handle payment processing errors and database errors. Errors are logged to the console and appropriate error messages are displayed to the user.

