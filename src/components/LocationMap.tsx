import React, { useRef, useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

interface LocationMapProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
  initialAddress?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function LocationMap({ 
  onLocationSelect, 
  initialLat = -12.0464, 
  initialLng = -77.0428,
  initialAddress = 'Miraflores, Lima'
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [address, setAddress] = useState(initialAddress);
  const [loaded, setLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    if (window.google) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBncFo8kQN_D_0Y2G7XvWnrYHmXtIEb5-Q'; // default key for demo
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!loaded || !mapRef.current || map) return;

    const newMap = new window.google.maps.Map(mapRef.current, {
      zoom: 15,
      center: { lat: initialLat, lng: initialLng },
      mapTypeControl: false,
      fullscreenControl: false,
    });

    const newMarker = new window.google.maps.Marker({
      position: { lat: initialLat, lng: initialLng },
      map: newMap,
      draggable: true,
      title: address,
    });

    // Geocode initial position to get address
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat: initialLat, lng: initialLng } }, (results: any) => {
      if (results && results[0]) {
        setAddress(results[0].formatted_address);
      }
    });

    // Update marker on click
    newMap.addListener('click', (e: any) => {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      newMarker.setPosition({ lat: newLat, lng: newLng });

      geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results: any) => {
        if (results && results[0]) {
          const newAddress = results[0].formatted_address;
          setAddress(newAddress);
          onLocationSelect(newLat, newLng, newAddress);
        }
      });
    });

    // Update on marker drag
    newMarker.addListener('dragend', () => {
      const pos = newMarker.getPosition();
      const newLat = pos.lat();
      const newLng = pos.lng();

      geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results: any) => {
        if (results && results[0]) {
          const newAddress = results[0].formatted_address;
          setAddress(newAddress);
          onLocationSelect(newLat, newLng, newAddress);
        }
      });
    });

    setMap(newMap);
    setMarker(newMarker);
  }, [loaded, map]);

  return (
    <div className="space-y-3">
      <div
        ref={mapRef}
        className="w-full h-64 rounded-xl border border-gray-200 shadow-sm"
      />
      {address && (
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5">
          <MapPin className="text-secondary w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-xs text-slate-900">Ubicación seleccionada:</p>
            <p className="text-[11px] text-slate-500 leading-normal mt-0.5">{address}</p>
          </div>
        </div>
      )}
      <p className="text-xs text-slate-500 italic">Haz clic en el mapa para seleccionar tu ubicación o arrastra el marcador.</p>
    </div>
  );
}
