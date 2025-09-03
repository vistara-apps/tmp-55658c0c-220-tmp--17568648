'use client';

interface TrendInsightsProps {
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

export default function TrendInsights({
  trendScore,
  socialProof,
  sentiment,
  keywords,
}: TrendInsightsProps) {
  // Calculate total sentiment for percentages
  const totalSentiment = sentiment.positive + sentiment.neutral + sentiment.negative;
  
  // Format large numbers with K suffix
  const formatNumber = (num: number): string => {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toString();
  };
  
  return (
    <div className="bg-surface p-4 rounded-lg shadow-card">
      <h3 className="text-heading mb-2">Trend Insights</h3>
      
      {/* Trend Score */}
      <div className="mb-4">
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
      
      {/* Social Proof */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Social Engagement</h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-100 p-2 rounded text-center">
            <div className="text-lg font-bold">{formatNumber(socialProof.views)}</div>
            <div className="text-xs text-gray-600">Views</div>
          </div>
          <div className="bg-gray-100 p-2 rounded text-center">
            <div className="text-lg font-bold">{formatNumber(socialProof.likes)}</div>
            <div className="text-xs text-gray-600">Likes</div>
          </div>
          <div className="bg-gray-100 p-2 rounded text-center">
            <div className="text-lg font-bold">{formatNumber(socialProof.comments)}</div>
            <div className="text-xs text-gray-600">Comments</div>
          </div>
        </div>
      </div>
      
      {/* Sentiment Analysis */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Sentiment Analysis</h4>
        <div className="w-full h-4 flex rounded-full overflow-hidden">
          <div 
            className="bg-green-500 h-full" 
            style={{ width: `${(sentiment.positive / totalSentiment) * 100}%` }}
            title={`Positive: ${Math.round((sentiment.positive / totalSentiment) * 100)}%`}
          ></div>
          <div 
            className="bg-gray-400 h-full" 
            style={{ width: `${(sentiment.neutral / totalSentiment) * 100}%` }}
            title={`Neutral: ${Math.round((sentiment.neutral / totalSentiment) * 100)}%`}
          ></div>
          <div 
            className="bg-red-500 h-full" 
            style={{ width: `${(sentiment.negative / totalSentiment) * 100}%` }}
            title={`Negative: ${Math.round((sentiment.negative / totalSentiment) * 100)}%`}
          ></div>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span>Positive</span>
          <span>Neutral</span>
          <span>Negative</span>
        </div>
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

