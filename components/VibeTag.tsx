'use client';

interface Props {
  vibe: string;
  active?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

// Function to get a consistent color based on the vibe string
function getVibeColor(vibe: string): string {
  // Simple hash function to generate a number from a string
  const hash = vibe.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Use the hash to select a hue value (0-360)
  const hue = hash % 360;
  
  // Return HSL color with fixed saturation and lightness
  return `hsl(${hue}, 85%, 75%)`;
}

export default function VibeTag({ vibe, active = false, onClick, size = 'md' }: Props) {
  // Get size-specific classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  }[size];
  
  // Get vibe color
  const vibeColor = getVibeColor(vibe);
  
  // Determine background and text colors based on active state
  const bgColor = active ? 'bg-primary' : `bg-gray-100`;
  const textColor = active ? 'text-white' : 'text-gray-800';
  const borderColor = active ? 'border-primary' : `border-${vibeColor}`;
  
  // Add left accent if active
  const leftAccent = active 
    ? { borderLeft: `4px solid ${vibeColor}` }
    : {};
  
  return (
    <div
      className={`${sizeClasses} ${bgColor} ${textColor} rounded-full border ${borderColor} font-medium transition-all duration-base ${
        onClick ? 'cursor-pointer hover:shadow-sm' : ''
      }`}
      onClick={onClick}
      style={{
        ...leftAccent,
      }}
    >
      {vibe}
    </div>
  );
}

