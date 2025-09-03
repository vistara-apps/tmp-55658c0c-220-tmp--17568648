'use client';

import { useState } from 'react';
import VibeTag from './VibeTag';
import { Recommendation } from '@/lib/supabase';

interface Props {
  recommendation: Recommendation;
  onSave: (id: string) => void;
  isSaved?: boolean;
}

export default function RecommendationCard({ recommendation, onSave, isSaved = false }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  
  const handleSave = () => {
    setSaved(true);
    onSave(recommendation.recommendationId);
  };
  
  // Format trend score as a percentage
  const trendScoreFormatted = `${recommendation.trend_score}%`;
  
  // Format timestamp to a readable date
  const formattedDate = new Date(recommendation.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  
  return (
    <div className={`bg-surface p-4 rounded-lg shadow-card transition-all duration-base ${
      expanded ? 'ring-2 ring-primary' : ''
    }`}>
      <div className="relative">
        <img 
          src={recommendation.image_url} 
          alt={recommendation.title} 
          className="w-full h-48 object-cover rounded-md" 
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
          {trendScoreFormatted} trending
        </div>
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
          {formattedDate}
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
      
      <div className="flex justify-between items-center mt-3">
        <a 
          href={recommendation.social_media_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary text-sm font-medium hover:underline"
        >
          View on Social
        </a>
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="text-sm text-gray-600 hover:text-primary"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      </div>
      
      {expanded && (
        <div className="mt-3 animate-fadeIn">
          <div className="aspect-video rounded-md overflow-hidden bg-black">
            <video 
              src={recommendation.video_url} 
              controls 
              className="w-full h-full" 
              poster={recommendation.image_url}
            />
          </div>
          
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="bg-bg p-2 rounded-md">
              <span className="text-xs text-gray-500">Location</span>
              <p className="text-sm font-medium">
                {recommendation.location.lat.toFixed(4)}, {recommendation.location.lng.toFixed(4)}
              </p>
            </div>
            <div className="bg-bg p-2 rounded-md">
              <span className="text-xs text-gray-500">Trend Score</span>
              <p className="text-sm font-medium">{trendScoreFormatted}</p>
            </div>
          </div>
        </div>
      )}
      
      <button 
        onClick={handleSave} 
        disabled={saved}
        className={`mt-3 w-full py-2 rounded-md transition-colors duration-fast ${
          saved 
            ? 'bg-gray-200 text-gray-500' 
            : 'bg-accent text-white hover:bg-accent/90'
        }`}
      >
        {saved ? 'Saved' : 'Save'}
      </button>
    </div>
  );
}
