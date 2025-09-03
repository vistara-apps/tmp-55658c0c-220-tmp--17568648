'use client';

import { useState, useEffect } from 'react';
import TrendChart from './TrendChart';
import SentimentDisplay from './SentimentDisplay';
import SocialProof from './SocialProof';
import { getVenueTrendHistory } from '@/lib/trends/analyzer';

interface DetailedInsightsProps {
  venueId: string;
  trendScore: number;
  socialProof: {
    views: number;
    likes: number;
    comments: number;
  };
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  keywords: string[];
}

export default function DetailedInsights({
  venueId,
  trendScore,
  socialProof,
  sentiment,
  keywords,
}: DetailedInsightsProps) {
  const [trendHistory, setTrendHistory] = useState<{ date: string; score: number }[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchTrendHistory() {
      try {
        const history = await getVenueTrendHistory(venueId);
        setTrendHistory(history);
      } catch (error) {
        console.error('Error fetching trend history:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTrendHistory();
  }, [venueId]);
  
  return (
    <div className="bg-surface p-4 rounded-lg shadow-card">
      <h3 className="text-heading mb-4">Detailed Trend Insights</h3>
      
      {/* Trend Score */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">Trend Score</span>
          <span className="text-sm font-bold">{trendScore}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${trendScore}%` }}
          ></div>
        </div>
      </div>
      
      {/* Trend History Chart */}
      <div className="mb-6">
        {loading ? (
          <div className="h-[200px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <TrendChart data={trendHistory} width={400} height={200} />
        )}
      </div>
      
      {/* Social Proof */}
      <div className="mb-6">
        <SocialProof
          views={socialProof.views}
          likes={socialProof.likes}
          comments={socialProof.comments}
        />
      </div>
      
      {/* Sentiment Analysis */}
      <div className="mb-6">
        <SentimentDisplay
          positive={sentiment.positive}
          neutral={sentiment.neutral}
          negative={sentiment.negative}
        />
      </div>
      
      {/* Keywords */}
      <div>
        <h4 className="text-sm font-medium mb-2">Trending Keywords</h4>
        <div className="flex flex-wrap gap-1">
          {keywords.map((keyword, index) => (
            <span 
              key={index}
              className="bg-gray-100 px-2 py-1 rounded-full text-xs"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

