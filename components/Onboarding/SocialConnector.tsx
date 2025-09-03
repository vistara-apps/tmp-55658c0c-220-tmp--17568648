'use client';

interface SocialConnectorProps {
  connectedPlatforms: string[];
  onConnect: (platform: string) => void;
}

export default function SocialConnector({ 
  connectedPlatforms, 
  onConnect 
}: SocialConnectorProps) {
  const platforms = [
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: '📸', 
      description: 'Connect to find experiences based on your visual preferences'
    },
    { 
      id: 'tiktok', 
      name: 'TikTok', 
      icon: '🎵', 
      description: 'Connect to discover trending local spots from your favorite creators'
    },
    { 
      id: 'twitter', 
      name: 'Twitter', 
      icon: '🐦', 
      description: 'Connect to find experiences based on your interests and follows'
    }
  ];

  const handleConnect = (platformId: string) => {
    // In a real app, this would open an OAuth flow
    // For now, we'll just toggle the connection status
    onConnect(platformId);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        Connecting your social accounts helps us personalize your recommendations.
        This step is optional but recommended.
      </p>
      
      {platforms.map(platform => (
        <div 
          key={platform.id}
          className="border rounded-lg p-4 flex items-center justify-between"
        >
          <div className="flex items-center">
            <span className="text-2xl mr-3">{platform.icon}</span>
            <div>
              <h4 className="font-medium">{platform.name}</h4>
              <p className="text-sm text-gray-600">{platform.description}</p>
            </div>
          </div>
          
          <button
            onClick={() => handleConnect(platform.id)}
            className={`px-4 py-2 rounded-md ${
              connectedPlatforms.includes(platform.id)
                ? 'bg-accent text-white'
                : 'border border-gray-300'
            }`}
          >
            {connectedPlatforms.includes(platform.id) ? 'Connected' : 'Connect'}
          </button>
        </div>
      ))}
      
      <p className="text-sm text-gray-500 mt-4">
        You can skip this step if you prefer not to connect your social accounts.
      </p>
    </div>
  );
}

