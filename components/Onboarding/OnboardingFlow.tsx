'use client';

import { useState } from 'react';
import PreferenceSelector from './PreferenceSelector';
import SocialConnector from './SocialConnector';
import { VIBE_CATEGORIES } from '@/lib/personalization/engine';
import { completeOnboarding, updateUserPreferences } from '@/lib/db/user';

interface OnboardingFlowProps {
  userId: string;
  onComplete: () => void;
}

export default function OnboardingFlow({ userId, onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [connectedSocial, setConnectedSocial] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePreferenceChange = (preference: string) => {
    setSelectedPreferences(prev => 
      prev.includes(preference)
        ? prev.filter(p => p !== preference)
        : [...prev, preference]
    );
  };

  const handleSocialConnect = (platform: string) => {
    setConnectedSocial(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Save user preferences
      await updateUserPreferences(userId, selectedPreferences);
      
      // Mark onboarding as complete
      await completeOnboarding(userId);
      
      // Notify parent component
      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface p-6 rounded-lg shadow-card max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-heading mb-2">Welcome to VibeFinder</h2>
        <p className="text-body">Let's set up your profile to find the perfect vibes for you.</p>
        
        <div className="flex items-center mt-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                i + 1 === step ? 'bg-primary text-white' : 
                i + 1 < step ? 'bg-accent text-white' : 'bg-gray-200'
              }`}>
                {i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div className={`h-1 w-10 ${i + 1 < step ? 'bg-accent' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="min-h-[300px]">
        {step === 1 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Tell us what vibes you're into</h3>
            <PreferenceSelector 
              preferences={VIBE_CATEGORIES}
              selectedPreferences={selectedPreferences}
              onChange={handlePreferenceChange}
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Connect your social accounts</h3>
            <p className="text-sm text-gray-600 mb-4">
              This helps us personalize your recommendations. We'll never post without your permission.
            </p>
            <SocialConnector 
              connectedPlatforms={connectedSocial}
              onConnect={handleSocialConnect}
            />
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">You're all set!</h3>
            <p className="mb-4">
              Based on your preferences, we'll curate the best local experiences for you.
            </p>
            <div className="mb-4">
              <h4 className="font-medium mb-2">Your selected vibes:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedPreferences.map(pref => (
                  <span key={pref} className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                    {pref}
                  </span>
                ))}
              </div>
            </div>
            {connectedSocial.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Connected accounts:</h4>
                <div className="flex flex-wrap gap-2">
                  {connectedSocial.map(platform => (
                    <span key={platform} className="bg-accent text-white px-3 py-1 rounded-full text-sm">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        {step > 1 ? (
          <button 
            onClick={handleBack}
            className="px-4 py-2 border border-gray-300 rounded-md"
            disabled={loading}
          >
            Back
          </button>
        ) : (
          <div></div>
        )}
        
        <button 
          onClick={handleNext}
          className="px-4 py-2 bg-primary text-white rounded-md"
          disabled={loading}
        >
          {loading ? 'Loading...' : step === totalSteps ? 'Get Started' : 'Next'}
        </button>
      </div>
    </div>
  );
}

