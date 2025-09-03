'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import AppHeader from '@/components/AppHeader';
import RecommendationCard from '@/components/RecommendationCard';
import InteractiveMap from '@/components/InteractiveMap';
import VibeTag from '@/components/VibeTag';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { getRecommendations } from '@/actions/getRecommendations';

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
  const { address, isConnected } = useAccount();
  const { setFrameReady } = useMiniKit();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [userPreferences, setUserPreferences] = useState<string[]>([]);

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  useEffect(() => {
    if (isConnected) {
      fetchRecommendations();
    }
  }, [isConnected]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      // Mock call to AI generation - in real, would use location and preferences
      const generated = await getRecommendations('San Francisco', userPreferences);
      setRecommendations(generated);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
    setLoading(false);
  };

  const handleSave = (recId: string) => {
    // TODO: Save to Supabase
    console.log('Saved recommendation:', recId);
  };

  const handleFilter = (vibe: string) => {
    setUserPreferences(prev => prev.includes(vibe) ? prev.filter(v => v !== vibe) : [...prev, vibe]);
  };

  return (
    <div className="container flex flex-col min-h-screen">
      <AppHeader />
      {!isConnected ? (
        <div className="flex-1 flex items-center justify-center">
          <ConnectWallet />
        </div>
      ) : (
        <>
          <div className="my-4">
            <h2 className="text-heading">Filters</h2>
            <div className="flex gap-2">
              {['Chill', 'Energetic', 'Romantic', 'Adventurous'].map(vibe => (
                <VibeTag key={vibe} vibe={vibe} active={userPreferences.includes(vibe)} onClick={() => handleFilter(vibe)} />
              ))}
            </div>
            <button onClick={fetchRecommendations} className="mt-2 bg-primary text-white px-4 py-2 rounded-md">
              Refresh Recommendations
            </button>
          </div>
          <InteractiveMap recommendations={recommendations} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              recommendations.map(rec => (
                <RecommendationCard key={rec.recommendationId} recommendation={rec} onSave={handleSave} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
