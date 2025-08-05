"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useRouter } from "next/navigation";

if ("_getIconUrl" in L.Icon.Default.prototype) {
  delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
}

L.Icon.Default.mergeOptions({
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
});

const scooterIcon = new L.Icon({
  iconUrl: "/images/icons/image.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const scooterLocations = [
  { lat: 17.481857, lng: 78.372079, name: "BATT00001" },
  { lat: 17.4833, lng: 78.376294, name: "BATT00002" },
  { lat: 17.467173, lng: 78.480725, name: "BATT00003" },
];

export default function MapWithScooters() {
  const router = useRouter();

  const handleScooterClick = (name: string) => {
    const today = new Date().toISOString().split("T")[0];
    const query = new URLSearchParams({
      serial: name,
      startDate: today,
      endDate: today,
    });
    router.push(`/device?${query.toString()}`);
  };

  return (
    <div className="relative w-full h-full z-0">
      <MapContainer
        center={[20.5937, 78.9629]} // Centered over India
        zoom={5}
        zoomControl={true}
        className="w-full h-full"
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
            <Popup>
              <button
                onClick={() => handleScooterClick(scooter.name)}
                className="text-blue-600 hover:underline focus:outline-none text-sm"
              >
                {scooter.name}
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
