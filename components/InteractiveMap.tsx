'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Import leaflet CSS
import 'leaflet/dist/leaflet.css';

interface Recommendation {
  recommendationId: string;
  title: string;
  venue_name: string;
  location: { lat: number; lng: number };
}

interface Props {
  recommendations: Recommendation[];
}

// Dynamically import the map components with ssr: false to prevent server-side rendering
const MapWithNoSSR = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 flex items-center justify-center">Loading map...</div>
});

export default function InteractiveMap({ recommendations }: Props) {
  return <MapWithNoSSR recommendations={recommendations} />;
}
