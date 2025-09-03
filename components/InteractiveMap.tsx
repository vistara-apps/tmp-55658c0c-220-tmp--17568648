'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Recommendation } from '@/lib/supabase';

// Fix default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Create custom marker icons
const activeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const inactiveIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map view updates
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

interface Props {
  recommendations: Recommendation[];
  selectedId?: string;
  onMarkerClick?: (id: string) => void;
}

export default function InteractiveMap({ 
  recommendations, 
  selectedId, 
  onMarkerClick 
}: Props) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([37.7749, -122.4194]);
  const [mapZoom, setMapZoom] = useState(13);
  
  // Update map center when a recommendation is selected
  useEffect(() => {
    if (selectedId) {
      const selected = recommendations.find(r => r.recommendationId === selectedId);
      if (selected) {
        setMapCenter([selected.location.lat, selected.location.lng]);
        setMapZoom(15); // Zoom in when a specific location is selected
      }
    } else if (recommendations.length > 0) {
      // Calculate the center of all recommendations
      const lats = recommendations.map(r => r.location.lat);
      const lngs = recommendations.map(r => r.location.lng);
      const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
      const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
      
      setMapCenter([avgLat, avgLng]);
      setMapZoom(13); // Default zoom for multiple locations
    }
  }, [selectedId, recommendations]);
  
  return (
    <div className="rounded-lg overflow-hidden shadow-card">
      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        style={{ height: '400px', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapUpdater center={mapCenter} zoom={mapZoom} />
        
        {recommendations.map(rec => (
          <Marker 
            key={rec.recommendationId} 
            position={[rec.location.lat, rec.location.lng]}
            icon={selectedId === rec.recommendationId ? activeIcon : inactiveIcon}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(rec.recommendationId)
            }}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-sm">{rec.title}</h3>
                <p className="text-xs">{rec.venue_name}</p>
                <p className="text-xs mt-1">{rec.description}</p>
                <div className="flex gap-1 mt-1">
                  {rec.vibe_tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 px-1 rounded">
                      {tag}
                    </span>
                  ))}
                  {rec.vibe_tags.length > 2 && (
                    <span className="text-xs bg-gray-100 px-1 rounded">
                      +{rec.vibe_tags.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
