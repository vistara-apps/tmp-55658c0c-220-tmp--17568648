'use client';

interface SentimentDisplayProps {
  positive: number;
  neutral: number;
  negative: number;
}

export default function SentimentDisplay({ positive, neutral, negative }: SentimentDisplayProps) {
  // Calculate total for percentages
  const total = positive + neutral + negative;
  
  // Calculate percentages
  const positivePercent = Math.round((positive / total) * 100);
  const neutralPercent = Math.round((neutral / total) * 100);
  const negativePercent = Math.round((negative / total) * 100);
  
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Sentiment Analysis</h4>
      
      {/* Sentiment bar */}
      <div className="w-full h-4 flex rounded-full overflow-hidden">
        <div 
          className="bg-green-500 h-full" 
          style={{ width: `${positivePercent}%` }}
          title={`Positive: ${positivePercent}%`}
        ></div>
        <div 
          className="bg-gray-400 h-full" 
          style={{ width: `${neutralPercent}%` }}
          title={`Neutral: ${neutralPercent}%`}
        ></div>
        <div 
          className="bg-red-500 h-full" 
          style={{ width: `${negativePercent}%` }}
          title={`Negative: ${negativePercent}%`}
        ></div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-between text-xs mt-1">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
          <span>{positivePercent}% Positive</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-400 rounded-full mr-1"></div>
          <span>{neutralPercent}% Neutral</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
          <span>{negativePercent}% Negative</span>
        </div>
      </div>
    </div>
  );
}

