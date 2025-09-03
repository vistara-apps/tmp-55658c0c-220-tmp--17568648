'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import RecommendationCard from '@/components/RecommendationCard';
import InteractiveMap from '@/components/InteractiveMap';
import FilterControls from '@/components/FilterControls';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { getRecommendations } from '@/actions/getRecommendations';
import { getCurrentUser } from '@/lib/supabase';
import { hasPremiumSubscription } from '@/lib/db/user';
import { saveRecommendation } from '@/lib/db/recommendation';
import { personalizeRecommendations, learnFromInteraction } from '@/lib/personalization/engine';

interface Recommendation {
  recommendationId: string;
  title: string;
  description: string;
  venue_name: string;
  location: { lat: number; lng: number };
  social_media_url: string;
  trend_score: number;
  vibe_tags: string[];
  image_url: string;
  video_url: string;
  timestamp: string;
}

export default function Home() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { setFrameReady } = useMiniKit();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [userPreferences, setUserPreferences] = useState<string[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: 37.7749,
    lng: -122.4194, // Default to San Francisco
  });
  const [locationName, setLocationName] = useState('San Francisco');
  const [onboardingComplete, setOnboardingComplete] = useState(true);

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  // Check user authentication and premium status
  useEffect(() => {
    async function checkUser() {
      if (isConnected) {
        try {
          const user = await getCurrentUser();
          if (user) {
            setUserId(user.id);
            
            // Check if user has completed onboarding
            if (user.onboarding_complete === false) {
              setOnboardingComplete(false);
              router.push('/onboarding');
              return;
            }
            
            // Check premium status
            const premium = await hasPremiumSubscription(user.id);
            setIsPremium(premium);
            
            // Get user location from browser
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                  });
                  // In a real app, we would reverse geocode to get the location name
                  setLocationName('Current Location');
                },
                (error) => {
                  console.error('Error getting location:', error);
                }
              );
            }
          }
        } catch (error) {
          console.error('Error checking user:', error);
        }
      }
    }

    checkUser();
  }, [isConnected, router]);

  // Fetch recommendations when user is connected
  useEffect(() => {
    if (isConnected && onboardingComplete) {
      fetchRecommendations();
    }
  }, [isConnected, userPreferences, onboardingComplete]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      // Get recommendations based on location and preferences
      const generated = await getRecommendations(locationName, userPreferences);
      
      // If user is authenticated, personalize recommendations
      let personalized = generated;
      if (userId) {
        personalized = await personalizeRecommendations(generated, userPreferences);
      }
      
      setRecommendations(personalized);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
    setLoading(false);
  };

  const handleSave = useCallback(async (recId: string) => {
    if (!userId) return;
    
    try {
      // Save to database
      await saveRecommendation(userId, recId);
      
      // Learn from this interaction
      const recommendation = recommendations.find(r => r.recommendationId === recId);
      if (recommendation) {
        await learnFromInteraction(userId, recId, 'save', recommendation);
      }
    } catch (error) {
      console.error('Error saving recommendation:', error);
    }
  }, [userId, recommendations]);

  const handleFilterChange = useCallback((vibes: string[]) => {
    setUserPreferences(vibes);
  }, []);

  const handleRecommendationSelect = useCallback((id: string) => {
    setSelectedRecommendation(id);
    
    // Learn from this interaction
    if (userId) {
      const recommendation = recommendations.find(r => r.recommendationId === id);
      if (recommendation) {
        learnFromInteraction(userId, id, 'click', recommendation);
      }
    }
    
    // Scroll to the recommendation card
    const element = document.getElementById(`rec-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [userId, recommendations]);

  return (
    <div className="container mx-auto flex flex-col min-h-screen px-4">
      <AppHeader />
      
      {!isConnected ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-surface p-8 rounded-lg shadow-card max-w-md text-center">
            <h2 className="text-heading mb-4">Discover Trending Local Spots</h2>
            <p className="mb-6">Connect your wallet to start exploring the best local experiences based on real-time social media trends.</p>
            <ConnectWallet />
          </div>
        </div>
      ) : (
        <>
          <div className="my-6">
            <h1 className="text-heading mb-2">Trending in {locationName}</h1>
            <p className="text-body text-gray-600">
              Discover the most vibrant local experiences based on real-time social media trends.
            </p>
          </div>
          
          <FilterControls
            selectedVibes={userPreferences}
            onVibeChange={handleFilterChange}
            onRefresh={fetchRecommendations}
            isPremium={isPremium}
          />
          
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <InteractiveMap 
                recommendations={recommendations}
                onSelectRecommendation={handleRecommendationSelect}
                selectedRecommendationId={selectedRecommendation}
                userLocation={userLocation}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
                {recommendations.map(rec => (
                  <div id={`rec-${rec.recommendationId}`} key={rec.recommendationId}>
                    <RecommendationCard 
                      recommendation={rec} 
                      onSave={handleSave}
                      isActive={selectedRecommendation === rec.recommendationId}
                      onClick={() => handleRecommendationSelect(rec.recommendationId)}
                      isPremium={isPremium}
                    />
                  </div>
                ))}
              </div>
              
              {recommendations.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No recommendations found</h3>
                  <p className="text-gray-600">
                    Try adjusting your filters or location to find more experiences.
                  </p>
                </div>
              )}
            </>
          )}
          
          {/* Premium upsell */}
          {!isPremium && (
            <div className="bg-surface p-6 rounded-lg shadow-card mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
                  <p className="text-gray-600 mb-4 md:mb-0">
                    Get access to advanced filtering, personalized vibe matching, and detailed trend insights.
                  </p>
                </div>
                <button 
                  onClick={() => router.push('/subscription')}
                  className="bg-accent text-white px-6 py-3 rounded-md font-medium"
                >
                  Upgrade for $5/month
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
