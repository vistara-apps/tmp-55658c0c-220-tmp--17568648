'use client';

import { useState } from 'react';
import VibeTag from './VibeTag';
import TrendInsights from './TrendInsights';

interface Recommendation {
  recommendationId: string;
  title: string;
  description: string;
  venue_name: string;
  social_media_url: string;
  trend_score: number;
  vibe_tags: string[];
  image_url: string;
  video_url: string;
  timestamp: string;
}

interface Props {
  recommendation: Recommendation;
  onSave: (id: string) => void;
  isActive?: boolean;
  onClick?: () => void;
  isPremium?: boolean;
}

export default function RecommendationCard({ 
  recommendation, 
  onSave, 
  isActive = false,
  onClick,
  isPremium = false
}: Props) {
  const [expanded, setExpanded] = useState(isActive);
  const [saved, setSaved] = useState(false);
  
  // Mock social proof data - in a real app, this would come from the API
  const socialProof = {
    views: Math.floor(Math.random() * 10000) + 1000,
    likes: Math.floor(Math.random() * 1000) + 100,
    comments: Math.floor(Math.random() * 100) + 10,
  };
  
  // Mock sentiment data - in a real app, this would come from the API
  const sentiment = {
    positive: Math.floor(Math.random() * 70) + 30,
    neutral: Math.floor(Math.random() * 40) + 10,
    negative: Math.floor(Math.random() * 20),
  };
  
  // Mock keywords - in a real app, this would come from the API
  const keywords = [
    'trending', 'local', 'popular', 'weekend', 'nightlife', 'food'
  ].sort(() => Math.random() - 0.5).slice(0, 4);
  
  const handleSave = () => {
    onSave(recommendation.recommendationId);
    setSaved(true);
  };
  
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
    setExpanded(!expanded);
  };
  
  // Format date
  const formattedDate = new Date(recommendation.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  
  return (
    <div 
      className={`bg-surface p-4 rounded-lg shadow-card transition-all duration-base ${
        isActive ? 'ring-2 ring-primary' : ''
      } ${
        expanded ? 'scale-100' : 'hover:shadow-lg cursor-pointer'
      }`}
    >
      <div onClick={handleCardClick}>
        <div className="relative">
          <img 
            src={recommendation.image_url} 
            alt={recommendation.title} 
            className="w-full h-48 object-cover rounded-md" 
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
            {formattedDate}
          </div>
          <div className="absolute bottom-2 left-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-bold">
            {recommendation.trend_score} Trending
          </div>
        </div>
        
        <h3 className="text-heading mt-2">{recommendation.title}</h3>
        <p className="text-body">{recommendation.description}</p>
        <p className="text-sm font-medium mt-1">Venue: {recommendation.venue_name}</p>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {recommendation.vibe_tags.map(tag => (
            <VibeTag key={tag} vibe={tag} />
          ))}
        </div>
      </div>
      
      {expanded && (
        <div className="mt-4">
          <div className="border-t border-gray-200 pt-4 mb-4">
            <h4 className="font-medium mb-2">Social Proof</h4>
            <a 
              href={recommendation.social_media_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
            >
              <span>View on Social Media</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
          
          {recommendation.video_url && (
            <div className="mb-4">
              <video 
                src={recommendation.video_url} 
                controls 
                className="w-full rounded-md" 
                poster={recommendation.image_url}
              />
            </div>
          )}
          
          {isPremium && (
            <TrendInsights
              trendScore={recommendation.trend_score}
              socialProof={socialProof}
              sentiment={sentiment}
              keywords={keywords}
            />
          )}
          
          {!isPremium && (
            <div className="bg-gray-100 p-3 rounded-md text-sm text-gray-700 mb-4">
              <p className="font-medium">Premium Feature</p>
              <p>Upgrade to see detailed trend insights and analytics.</p>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-4 flex justify-between">
        <button 
          onClick={handleCardClick}
          className="text-primary hover:underline"
        >
          {expanded ? 'Show Less' : 'Show More'}
        </button>
        
        <button 
          onClick={handleSave} 
          disabled={saved}
          className={`px-4 py-2 rounded-md ${
            saved 
              ? 'bg-gray-300 text-gray-700' 
              : 'bg-accent text-white hover:bg-accent/90'
          }`}
        >
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
}
