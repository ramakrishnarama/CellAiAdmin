"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue in Leaflet
if ("_getIconUrl" in L.Icon.Default.prototype) {
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

const scooterLocations: Scooter[] = [
  { lat: 17.481857, lng: 78.372079, name: "FLOWBATT00001" },
  { lat: 12.9719, lng: 77.5937, name: "FLOWBATT00002" },
  { lat: 19.076, lng: 72.8777, name: "FLOWBATT00003" },
];

// Status values
const statuses = [
  { label: "RUNNING", value: 10, color: "text-orange-500" },
  { label: "CHARGING", value: 45, color: "text-green-500" },
  { label: "IDLE", value: 67, color: "text-blue-500" },
  { label: "LOW SOC", value: 8, color: "text-red-500" },
];

export default function MapWithScooters() {
  return (
    <div className="relative w-full h-[700px] overflow-hidden z-0">
      {/* ✅ STATUS BAR ABOVE MAP */}

    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-black/70 text-white rounded-xl px-4 py-2 text-sm backdrop-blur-md shadow-md w-[90%] max-w-md flex flex-wrap justify-between gap-y-2 gap-x-4 sm:gap-x-6">
      {statuses.map((status) => (
        <div key={status.label} className="flex flex-col items-center w-1/4 sm:w-auto">
          <span className="text-[10px] sm:text-xs text-gray-300">{status.label}</span>
          <span className={`text-base sm:text-lg font-semibold ${status.color}`}>{status.value}</span>
        </div>
      ))}
    </div>


      {/* ✅ MAP */}
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        zoomControl={true}
        className="w-full h-full z-0"
      >
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
    </div>
  );
}
