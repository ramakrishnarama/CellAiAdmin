"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
});

// Custom scooter icon
const scooterIcon = new L.Icon({
  iconUrl: "/images/icons/image.png", // Make sure this exists in /public/images/icons/
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Sample data
const scooterLocations = [
  { lat: 28.6139, lng: 77.2090, name: "Delhi" },
  { lat: 19.0760, lng: 72.8777, name: "Mumbai" },
];

export default function MapWithScooters() {
  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "700px", width: "100%" }}>
      {/* 🌙 Dark tile layer */}
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
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
  );
}
