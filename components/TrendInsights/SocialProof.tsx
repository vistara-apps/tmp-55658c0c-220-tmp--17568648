'use client';

interface SocialProofProps {
  views: number;
  likes: number;
  comments: number;
}

export default function SocialProof({ views, likes, comments }: SocialProofProps) {
  // Format large numbers with K suffix
  const formatNumber = (num: number): string => {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toString();
  };
  
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Social Engagement</h4>
      
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-100 p-2 rounded text-center">
          <div className="text-lg font-bold">{formatNumber(views)}</div>
          <div className="text-xs text-gray-600">Views</div>
        </div>
        <div className="bg-gray-100 p-2 rounded text-center">
          <div className="text-lg font-bold">{formatNumber(likes)}</div>
          <div className="text-xs text-gray-600">Likes</div>
        </div>
        <div className="bg-gray-100 p-2 rounded text-center">
          <div className="text-lg font-bold">{formatNumber(comments)}</div>
          <div className="text-xs text-gray-600">Comments</div>
        </div>
      </div>
      
      {/* Engagement rate */}
      <div className="mt-2 text-xs text-gray-600">
        <span className="font-medium">Engagement Rate: </span>
        {((likes + comments) / views * 100).toFixed(1)}%
      </div>
    </div>
  );
}

