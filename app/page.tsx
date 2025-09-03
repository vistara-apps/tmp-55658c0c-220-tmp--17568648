'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import AppHeader from '@/components/AppHeader';
import RecommendationCard from '@/components/RecommendationCard';
import InteractiveMap from '@/components/InteractiveMap';
import VibeTag from '@/components/VibeTag';
import OnboardingFlow from '@/components/OnboardingFlow';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { getRecommendations } from '@/actions/getRecommendations';
import { Recommendation, User, getUserProfile, saveRecommendation, updateUserPreferences } from '@/lib/supabase';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { setFrameReady } = useMiniKit();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [userPreferences, setUserPreferences] = useState<string[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | undefined>();
  const [location, setLocation] = useState('San Francisco');
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [savedRecommendations, setSavedRecommendations] = useState<string[]>([]);

  // Initialize MiniKit
  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  // Load user profile when connected
  useEffect(() => {
    if (isConnected && address) {
      loadUserProfile(address);
    }
  }, [isConnected, address]);

  // Fetch recommendations when user preferences change
  useEffect(() => {
    if (isConnected && userProfile) {
      fetchRecommendations();
    }
  }, [isConnected, userProfile, userPreferences]);

  // Load user profile from Supabase
  const loadUserProfile = async (userId: string) => {
    try {
      const profile = await getUserProfile(userId);
      
      if (profile) {
        setUserProfile(profile);
        setUserPreferences(profile.preferences || []);
        setSavedRecommendations(profile.saved_locations || []);
        setNeedsOnboarding(false);
      } else {
        // No profile found, user needs onboarding
        setNeedsOnboarding(true);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setNeedsOnboarding(true);
    }
  };

  // Fetch recommendations based on location and preferences
  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const generated = await getRecommendations(location, userPreferences);
      setRecommendations(generated);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
    setLoading(false);
  };

  // Handle saving a recommendation
  const handleSave = async (recId: string) => {
    if (!address) return;
    
    try {
      await saveRecommendation(address, recId);
      setSavedRecommendations(prev => [...prev, recId]);
    } catch (error) {
      console.error('Error saving recommendation:', error);
    }
  };

  // Handle filter selection
  const handleFilter = async (vibe: string) => {
    const newPreferences = userPreferences.includes(vibe) 
      ? userPreferences.filter(v => v !== vibe) 
      : [...userPreferences, vibe];
    
    setUserPreferences(newPreferences);
    
    if (address) {
      await updateUserPreferences(address, newPreferences);
    }
  };

  // Handle onboarding completion
  const handleOnboardingComplete = (preferences: string[]) => {
    setUserPreferences(preferences);
    setNeedsOnboarding(false);
    fetchRecommendations();
  };

  // Handle map marker click
  const handleMarkerClick = (id: string) => {
    setSelectedRecommendation(id);
    
    // Scroll to the recommendation card
    const element = document.getElementById(`rec-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Handle recommendation card click
  const handleCardClick = (id: string) => {
    setSelectedRecommendation(id);
  };

  return (
    <div className="container mx-auto flex flex-col min-h-screen px-4">
      <AppHeader />
      
      {!isConnected ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-display mb-6">Welcome to VibeFinder</h1>
            <p className="text-body mb-8 max-w-md mx-auto">
              Stop doomscrolling, start discovering: Your AI guide to trending local spots.
            </p>
            <ConnectWallet />
          </div>
        </div>
      ) : needsOnboarding ? (
        <div className="flex-1 flex items-center justify-center py-8">
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        </div>
      ) : (
        <>
          <div className="my-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-heading">Trending in {location}</h2>
                <p className="text-body text-gray-600">
                  Discover what's hot right now based on real-time social media
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location"
                  className="px-3 py-2 border rounded-md"
                />
                <button 
                  onClick={fetchRecommendations} 
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Filter by vibe:</h3>
              <div className="flex flex-wrap gap-2">
                {['Chill', 'Energetic', 'Romantic', 'Adventurous', 'Foodie', 'Nightlife', 'Outdoors', 'Artsy'].map(vibe => (
                  <VibeTag 
                    key={vibe} 
                    vibe={vibe} 
                    active={userPreferences.includes(vibe)} 
                    onClick={() => handleFilter(vibe)} 
                  />
                ))}
              </div>
            </div>
          </div>
          
          <InteractiveMap 
            recommendations={recommendations} 
            selectedId={selectedRecommendation}
            onMarkerClick={handleMarkerClick}
          />
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-pulse text-center">
                <div className="h-8 w-32 bg-gray-200 rounded mx-auto mb-4"></div>
                <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
              </div>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-heading mb-2">No recommendations found</h3>
              <p className="text-body text-gray-600">
                Try adjusting your filters or changing your location
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
              {recommendations.map(rec => (
                <div 
                  key={rec.recommendationId}
                  id={`rec-${rec.recommendationId}`}
                  className={`transition-all duration-base ${
                    selectedRecommendation === rec.recommendationId ? 'scale-102' : ''
                  }`}
                  onClick={() => handleCardClick(rec.recommendationId)}
                >
                  <RecommendationCard 
                    recommendation={rec} 
                    onSave={handleSave}
                    isSaved={savedRecommendations.includes(rec.recommendationId)}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      <footer className="py-6 border-t mt-auto">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">© 2025 VibeFinder</p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-primary hover:underline">Terms</a>
            <a href="#" className="text-sm text-primary hover:underline">Privacy</a>
            <a href="#" className="text-sm text-primary hover:underline">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
