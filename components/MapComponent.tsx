'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix default icon issue
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

interface Recommendation {
  recommendationId: string;
  title: string;
  venue_name: string;
  location: { lat: number; lng: number };
}

interface Props {
  recommendations: Recommendation[];
}

export default function MapComponent({ recommendations }: Props) {
  return (
    <MapContainer center={[37.7749, -122.4194]} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {recommendations.map(rec => (
        <Marker key={rec.recommendationId} position={[rec.location.lat, rec.location.lng]}>
          <Popup>
            <h3>{rec.title}</h3>
            <p>{rec.venue_name}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

