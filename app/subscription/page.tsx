'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import AppHeader from '@/components/AppHeader';
import PricingTiers from '@/components/Subscription/PricingTiers';
import PaymentForm from '@/components/Subscription/PaymentForm';
import { SubscriptionTier, subscribeToPremium, cancelPremiumSubscription } from '@/lib/subscription/manager';
import { getCurrentUser } from '@/lib/supabase';
import { hasPremiumSubscription } from '@/lib/db/user';

export default function SubscriptionPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const [userId, setUserId] = useState<string | null>(null);
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>(SubscriptionTier.FREE);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function checkUser() {
      if (isConnected) {
        try {
          const user = await getCurrentUser();
          if (user) {
            setUserId(user.id);
            
            // Check premium status
            const isPremium = await hasPremiumSubscription(user.id);
            setCurrentTier(isPremium ? SubscriptionTier.PREMIUM : SubscriptionTier.FREE);
          }
        } catch (error) {
          console.error('Error checking user:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    checkUser();
  }, [isConnected]);

  const handleSelectTier = (tier: SubscriptionTier) => {
    setSelectedTier(tier);
    setSuccess(false);
  };

  const handlePaymentSubmit = async (paymentMethod: string) => {
    if (!userId || !selectedTier) return false;
    
    try {
      let success = false;
      
      if (selectedTier === SubscriptionTier.PREMIUM) {
        success = await subscribeToPremium(userId, paymentMethod);
      } else {
        success = await cancelPremiumSubscription(userId);
      }
      
      if (success) {
        setCurrentTier(selectedTier);
        setSelectedTier(null);
        setSuccess(true);
      }
      
      return success;
    } catch (error) {
      console.error('Error processing subscription:', error);
      return false;
    }
  };

  const handleCancel = () => {
    setSelectedTier(null);
  };

  return (
    <div className="container mx-auto flex flex-col min-h-screen px-4">
      <AppHeader />
      
      <div className="my-6">
        <h1 className="text-heading mb-2">Subscription Plans</h1>
        <p className="text-body text-gray-600">
          Choose the plan that works best for you.
        </p>
      </div>
      
      {!isConnected ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-surface p-8 rounded-lg shadow-card max-w-md text-center">
            <h2 className="text-heading mb-4">Connect Your Wallet</h2>
            <p className="mb-6">Connect your wallet to manage your subscription.</p>
            <ConnectWallet />
          </div>
        </div>
      ) : loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto w-full">
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              <p className="font-medium">Success!</p>
              <p>Your subscription has been updated. You are now on the {currentTier === SubscriptionTier.PREMIUM ? 'Premium' : 'Free'} plan.</p>
            </div>
          )}
          
          {selectedTier ? (
            <PaymentForm
              tier={selectedTier}
              onSubmit={handlePaymentSubmit}
              onCancel={handleCancel}
            />
          ) : (
            <>
              <PricingTiers
                currentTier={currentTier}
                onSelectTier={handleSelectTier}
              />
              
              <div className="mt-8 bg-surface p-6 rounded-lg shadow-card">
                <h3 className="text-xl font-bold mb-4">Subscription FAQs</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">What's included in the Premium plan?</h4>
                    <p className="text-gray-600">
                      Premium subscribers get unlimited vibe filters, personalized recommendations,
                      detailed trend insights, social media analytics, and advanced search options.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Can I cancel anytime?</h4>
                    <p className="text-gray-600">
                      Yes, you can cancel your Premium subscription at any time.
                      You'll continue to have Premium access until the end of your billing period.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">How is my payment information secured?</h4>
                    <p className="text-gray-600">
                      We use industry-standard encryption to protect your payment information.
                      We never store your full credit card details on our servers.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <button
                  onClick={() => router.push('/')}
                  className="text-primary hover:underline"
                >
                  Return to Home
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

