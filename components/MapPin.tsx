'use client';

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface MapPinProps {
  id: string;
  position: [number, number];
  title: string;
  venueName: string;
  trendScore: number;
  isActive: boolean;
  onClick: () => void;
}

// Create custom marker icons
const createIcon = (isActive: boolean, trendScore: number) => {
  // Determine size based on trend score (higher score = larger icon)
  const size = Math.max(25, Math.min(40, 25 + (trendScore / 100) * 15));
  
  // Determine color based on active state
  const color = isActive ? 'hsl(234, 82%, 57%)' : 'hsl(158, 75%, 50%)';
  
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
      ">
        ${Math.round(trendScore)}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -size/2],
  });
};

export default function MapPin({
  id,
  position,
  title,
  venueName,
  trendScore,
  isActive,
  onClick,
}: MapPinProps) {
  const icon = createIcon(isActive, trendScore);
  
  return (
    <Marker 
      key={id}
      position={position}
      icon={icon}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Popup>
        <div className="p-2">
          <h3 className="font-bold">{title}</h3>
          <p>{venueName}</p>
          <p className="text-sm">Trend Score: {trendScore}</p>
        </div>
      </Popup>
    </Marker>
  );
}

