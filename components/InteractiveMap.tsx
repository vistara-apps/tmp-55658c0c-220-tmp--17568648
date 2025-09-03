'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MapPin from './MapPin';

// Fix default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Recommendation {
  recommendationId: string;
  title: string;
  venue_name: string;
  location: { lat: number; lng: number };
  trend_score: number;
}

interface Props {
  recommendations: Recommendation[];
  onSelectRecommendation?: (id: string) => void;
  selectedRecommendationId?: string;
  userLocation?: { lat: number; lng: number };
}

// Component to handle map view updates
function MapUpdater({ 
  center, 
  zoom,
  recommendations
}: { 
  center: [number, number]; 
  zoom: number;
  recommendations: Recommendation[];
}) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  useEffect(() => {
    if (recommendations.length > 0) {
      // Create bounds from all recommendation locations
      const bounds = L.latLngBounds(
        recommendations.map(rec => [rec.location.lat, rec.location.lng])
      );
      
      // Fit map to bounds with padding
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, recommendations]);
  
  return null;
}

export default function InteractiveMap({ 
  recommendations, 
  onSelectRecommendation,
  selectedRecommendationId,
  userLocation = { lat: 37.7749, lng: -122.4194 } // Default to San Francisco
}: Props) {
  const [activeRecommendation, setActiveRecommendation] = useState<string | null>(
    selectedRecommendationId || null
  );
  
  // Update active recommendation when selectedRecommendationId changes
  useEffect(() => {
    if (selectedRecommendationId) {
      setActiveRecommendation(selectedRecommendationId);
    }
  }, [selectedRecommendationId]);
  
  const handlePinClick = useCallback((id: string) => {
    setActiveRecommendation(id);
    if (onSelectRecommendation) {
      onSelectRecommendation(id);
    }
  }, [onSelectRecommendation]);
  
  // Default center and zoom
  const center: [number, number] = [userLocation.lat, userLocation.lng];
  const zoom = 13;
  
  return (
    <div className="relative rounded-lg overflow-hidden shadow-card">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '500px', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ZoomControl position="bottomright" />
        
        {/* User location marker */}
        {userLocation && (
          <div className="leaflet-marker-icon leaflet-div-icon leaflet-zoom-animated leaflet-interactive">
            <div 
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: 'blue',
                borderRadius: '50%',
                border: '3px solid white',
                boxShadow: '0 0 0 2px blue',
              }}
            />
          </div>
        )}
        
        {/* Recommendation pins */}
        {recommendations.map(rec => (
          <MapPin
            key={rec.recommendationId}
            id={rec.recommendationId}
            position={[rec.location.lat, rec.location.lng]}
            title={rec.title}
            venueName={rec.venue_name}
            trendScore={rec.trend_score}
            isActive={activeRecommendation === rec.recommendationId}
            onClick={() => handlePinClick(rec.recommendationId)}
          />
        ))}
        
        {/* Map updater to handle view changes */}
        <MapUpdater 
          center={center} 
          zoom={zoom}
          recommendations={recommendations}
        />
      </MapContainer>
      
      {/* Map overlay with legend */}
      <div className="absolute bottom-4 left-4 bg-white p-2 rounded-md shadow-md z-[1000]">
        <div className="text-sm font-medium mb-1">Legend</div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[hsl(158,75%,50%)]"></div>
          <span className="text-xs">Regular Spot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[hsl(234,82%,57%)]"></div>
          <span className="text-xs">Selected Spot</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Size indicates trend score
        </div>
      </div>
    </div>
  );
}
