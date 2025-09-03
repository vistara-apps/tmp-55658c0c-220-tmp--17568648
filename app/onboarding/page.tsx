'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import OnboardingFlow from '@/components/Onboarding/OnboardingFlow';
import { getCurrentUser } from '@/lib/supabase';

export default function OnboardingPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      if (isConnected && address) {
        setLoading(true);
        try {
          const user = await getCurrentUser();
          if (user) {
            setUserId(user.id);
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
  }, [isConnected, address]);

  const handleOnboardingComplete = () => {
    // Redirect to home page
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto py-8">
        <h1 className="text-display text-center text-primary mb-8">VibeFinder</h1>
        
        {!isConnected ? (
          <div className="bg-surface p-8 rounded-lg shadow-card max-w-md mx-auto text-center">
            <h2 className="text-heading mb-4">Connect Your Wallet</h2>
            <p className="mb-6">Connect your wallet to get started with VibeFinder.</p>
            <div className="flex justify-center">
              <ConnectWallet />
            </div>
          </div>
        ) : !userId ? (
          <div className="bg-surface p-8 rounded-lg shadow-card max-w-md mx-auto text-center">
            <h2 className="text-heading mb-4">Account Error</h2>
            <p className="mb-6">There was an error retrieving your account. Please try again.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-md"
            >
              Retry
            </button>
          </div>
        ) : (
          <OnboardingFlow 
            userId={userId} 
            onComplete={handleOnboardingComplete} 
          />
        )}
      </div>
    </div>
  );
}

