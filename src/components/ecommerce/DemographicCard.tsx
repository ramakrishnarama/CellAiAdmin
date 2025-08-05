"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const MapWithScooters = dynamic(() => import("@/components/ecommerce/MapWithScooters"), {
  ssr: false,
});

export default function DemographicCard() {
  return (
    <div
      id="mapOne"
      className="w-full h-[500px] sm:h-[600px] md:h-[500px] lg:h-[500px] overflow-hidden relative"
    >
      <Suspense fallback={<div className="text-center text-gray-500">Loading map...</div>}>
        <MapWithScooters />
      </Suspense>
    </div>
  );
}
