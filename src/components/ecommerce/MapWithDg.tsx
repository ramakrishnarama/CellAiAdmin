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
  iconUrl: "/images/icons/dg.jpeg",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

interface Engine {
  GID: string;
  LAT: number;
  LON: number;
}

interface MapWithScootersProps {
  engineList: Engine[];
  selectedEngine?: Engine | null;
  onSelectEngine?: (engine: Engine) => void; // 👈 new prop
}

export default function MapWithScooters({
  engineList,
  selectedEngine,
  onSelectEngine,
}: MapWithScootersProps) {
  const router = useRouter();

  const handleMarkerClick = (engine: Engine) => {
    // 👇 Trigger selection in parent if provided
    if (onSelectEngine) {
      onSelectEngine(engine);
      return;
    }

    // Optional navigation if used standalone
    const today = new Date().toISOString().split("T")[0];
    const query = new URLSearchParams({
      serial: engine.GID,
      startDate: today,
      endDate: today,
    });
    router.push(`/device?${query.toString()}`);
  };

  const defaultCenter = selectedEngine
    ? [selectedEngine.LAT, selectedEngine.LON]
    : [20.5937, 78.9629]; // India default

  return (
    <div className="relative w-full h-full z-0">
      <MapContainer
        center={defaultCenter as [number, number]}
        zoom={selectedEngine ? 10 : 5}
        zoomControl={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {engineList.map((engine) => (
          <Marker
            key={engine.GID}
            position={[engine.LAT, engine.LON]}
            icon={scooterIcon}
            eventHandlers={{
              click: () => handleMarkerClick(engine),
            }}
          >
            <Popup>
              <button
                onClick={() => handleMarkerClick(engine)}
                className="text-blue-600 hover:underline focus:outline-none text-sm"
              >
                {engine.GID}
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
