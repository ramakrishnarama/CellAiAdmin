// app/device/page.tsx
"use client";

import { Suspense } from "react";
import FleetPage from "@/components/fleet/FleetPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white">Loading fleet page...</div>}>
      <FleetPage />
    </Suspense>
  );
}
