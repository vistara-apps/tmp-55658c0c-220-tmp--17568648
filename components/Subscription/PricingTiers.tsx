'use client';

import { SUBSCRIPTION_FEATURES, SUBSCRIPTION_PRICING, SubscriptionTier } from '@/lib/subscription/manager';

interface PricingTiersProps {
  currentTier: SubscriptionTier;
  onSelectTier: (tier: SubscriptionTier) => void;
}

export default function PricingTiers({ currentTier, onSelectTier }: PricingTiersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Free Tier */}
      <div className={`
        bg-surface p-6 rounded-lg shadow-card border-2
        ${currentTier === SubscriptionTier.FREE ? 'border-primary' : 'border-transparent'}
      `}>
        <div className="mb-4">
          <h3 className="text-xl font-bold">Free</h3>
          <p className="text-3xl font-bold mt-2">$0<span className="text-sm font-normal text-gray-600">/month</span></p>
        </div>
        
        <ul className="space-y-3 mb-6">
          {SUBSCRIPTION_FEATURES[SubscriptionTier.FREE].map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        
        <button
          onClick={() => onSelectTier(SubscriptionTier.FREE)}
          className={`w-full py-2 rounded-md ${
            currentTier === SubscriptionTier.FREE
              ? 'bg-gray-200 text-gray-700 cursor-default'
              : 'bg-primary text-white'
          }`}
          disabled={currentTier === SubscriptionTier.FREE}
        >
          {currentTier === SubscriptionTier.FREE ? 'Current Plan' : 'Downgrade'}
        </button>
      </div>
      
      {/* Premium Tier */}
      <div className={`
        bg-surface p-6 rounded-lg shadow-card border-2
        ${currentTier === SubscriptionTier.PREMIUM ? 'border-primary' : 'border-transparent'}
        relative
      `}>
        {/* Recommended badge */}
        <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
          Recommended
        </div>
        
        <div className="mb-4">
          <h3 className="text-xl font-bold">Premium</h3>
          <p className="text-3xl font-bold mt-2">${SUBSCRIPTION_PRICING[SubscriptionTier.PREMIUM]}<span className="text-sm font-normal text-gray-600">/month</span></p>
        </div>
        
        <ul className="space-y-3 mb-6">
          {SUBSCRIPTION_FEATURES[SubscriptionTier.PREMIUM].map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        
        <button
          onClick={() => onSelectTier(SubscriptionTier.PREMIUM)}
          className={`w-full py-2 rounded-md ${
            currentTier === SubscriptionTier.PREMIUM
              ? 'bg-gray-200 text-gray-700 cursor-default'
              : 'bg-accent text-white'
          }`}
          disabled={currentTier === SubscriptionTier.PREMIUM}
        >
          {currentTier === SubscriptionTier.PREMIUM ? 'Current Plan' : 'Upgrade'}
        </button>
      </div>
    </div>
  );
}

