'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import VibeTag from './VibeTag';
import { updateUserProfile } from '@/lib/supabase';

interface OnboardingProps {
  onComplete: (preferences: string[]) => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingProps) {
  const { address } = useAccount();
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const vibeCategories = [
    'Chill', 'Energetic', 'Romantic', 'Adventurous', 
    'Foodie', 'Artsy', 'Outdoors', 'Nightlife',
    'Family-friendly', 'Pet-friendly', 'Luxury', 'Budget'
  ];

  const handleVibeToggle = (vibe: string) => {
    setPreferences(prev => 
      prev.includes(vibe) 
        ? prev.filter(v => v !== vibe) 
        : [...prev, vibe]
    );
  };

  const handleSubmit = async () => {
    if (!address) return;
    
    setLoading(true);
    
    try {
      // Save user preferences to Supabase
      await updateUserProfile({
        userId: address,
        preferences,
        saved_locations: [],
        onboarding_complete: true
      });
      
      // Notify parent component that onboarding is complete
      onComplete(preferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface p-6 rounded-lg shadow-card max-w-md mx-auto">
      <h2 className="text-heading text-center mb-6">Welcome to VibeFinder!</h2>
      
      {step === 1 && (
        <>
          <p className="text-body mb-4">
            Let's personalize your experience. What kind of vibes are you looking for?
          </p>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {vibeCategories.map(vibe => (
              <VibeTag 
                key={vibe} 
                vibe={vibe} 
                active={preferences.includes(vibe)}
                onClick={() => handleVibeToggle(vibe)}
              />
            ))}
          </div>
          <p className="text-sm mb-4">
            Selected: {preferences.length > 0 ? preferences.join(', ') : 'None'}
          </p>
          <button 
            onClick={() => setStep(2)}
            disabled={preferences.length === 0}
            className={`w-full py-2 rounded-md ${
              preferences.length > 0 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            Next
          </button>
        </>
      )}
      
      {step === 2 && (
        <>
          <p className="text-body mb-4">
            Where are you looking to explore?
          </p>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city name"
            className="w-full p-2 border rounded-md mb-4"
          />
          <div className="flex gap-2">
            <button 
              onClick={() => setStep(1)}
              className="flex-1 py-2 bg-gray-200 rounded-md"
            >
              Back
            </button>
            <button 
              onClick={handleSubmit}
              disabled={!location || loading}
              className={`flex-1 py-2 rounded-md ${
                location && !loading
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {loading ? 'Saving...' : 'Get Started'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

