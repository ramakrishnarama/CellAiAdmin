"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue in Leaflet
if ('_getIconUrl' in L.Icon.Default.prototype) {
  delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
}

L.Icon.Default.mergeOptions({
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
});

// Custom scooter icon
const scooterIcon = new L.Icon({
  iconUrl: "/images/icons/image.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

type Scooter = {
  lat: number;
  lng: number;
  name: string;
};

// Sample data
const scooterLocations: Scooter[] = [
  { lat: 28.6139, lng: 77.2090, name: "Delhi" },
  { lat: 19.0760, lng: 72.8777, name: "Mumbai" },
];

export default function MapWithScooters() {
  return (
    <div className="relative w-full h-[700px] overflow-hidden z-0">
      {/* <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        className="w-full h-full"
      > */}
        <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        zoomControl={true} // ✅ Explicitly enable zoom controls
        className="w-full h-full"
      >
        {/* ✅ Light gray basemap */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {scooterLocations.map((scooter, index) => (
          <Marker
            key={index}
            position={[scooter.lat, scooter.lng]}
            icon={scooterIcon}
          >
            <Popup>{scooter.name}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* 🖤 Optional: Transparent black overlay */}
      {/* <div className="absolute top-0 left-0 w-full h-full bg-black/10 pointer-events-none z-10" /> */}
    </div>
  );
}
