'use client';

import { useState } from 'react';
import VibeTag from './VibeTag';
import { VIBE_CATEGORIES } from '@/lib/personalization/engine';

interface FilterControlsProps {
  selectedVibes: string[];
  onVibeChange: (vibes: string[]) => void;
  onRefresh: () => void;
  isPremium: boolean;
}

export default function FilterControls({
  selectedVibes,
  onVibeChange,
  onRefresh,
  isPremium,
}: FilterControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter vibe categories based on search term
  const filteredVibes = searchTerm
    ? VIBE_CATEGORIES.filter(vibe => 
        vibe.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : VIBE_CATEGORIES;
  
  // Display vibes - show all if expanded, otherwise just the first 8
  const displayVibes = isExpanded ? filteredVibes : filteredVibes.slice(0, 8);
  
  const handleVibeToggle = (vibe: string) => {
    if (selectedVibes.includes(vibe)) {
      onVibeChange(selectedVibes.filter(v => v !== vibe));
    } else {
      // If not premium, limit to 3 vibes
      if (!isPremium && selectedVibes.length >= 3) {
        return;
      }
      onVibeChange([...selectedVibes, vibe]);
    }
  };
  
  const handleClearAll = () => {
    onVibeChange([]);
  };
  
  return (
    <div className="bg-surface p-4 rounded-lg shadow-card mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-heading">Filters</h2>
        <div className="flex gap-2">
          {selectedVibes.length > 0 && (
            <button 
              onClick={handleClearAll}
              className="text-sm text-gray-600 hover:text-primary"
            >
              Clear All
            </button>
          )}
          <button 
            onClick={onRefresh}
            className="bg-primary text-white px-3 py-1 rounded-md text-sm"
          >
            Refresh
          </button>
        </div>
      </div>
      
      {/* Search input */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search vibes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            ✕
          </button>
        )}
      </div>
      
      {/* Vibe tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {displayVibes.map(vibe => (
          <VibeTag
            key={vibe}
            vibe={vibe}
            active={selectedVibes.includes(vibe)}
            onClick={() => handleVibeToggle(vibe)}
          />
        ))}
      </div>
      
      {/* Expand/collapse button */}
      {filteredVibes.length > 8 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-primary hover:underline"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      )}
      
      {/* Premium upsell */}
      {!isPremium && selectedVibes.length >= 3 && (
        <div className="mt-3 text-sm text-gray-600 bg-gray-100 p-2 rounded">
          <span className="font-medium">Premium Feature:</span> Upgrade to select more than 3 vibes and unlock advanced filtering.
        </div>
      )}
    </div>
  );
}

