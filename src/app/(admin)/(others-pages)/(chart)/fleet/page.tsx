// app/device/page.tsx
"use client";

import { Suspense } from "react";
import FleetPage from "@/components/fleet/FleetPage";
import AuthGuard from "@/components/auth/AuthGuard";

export default function Page() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="text-white">Loading fleet page...</div>}>
        <FleetPage />
      </Suspense>
    </AuthGuard>

  );
}
