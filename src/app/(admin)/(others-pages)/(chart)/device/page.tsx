// app/device/page.tsx
"use client";

import { Suspense } from "react";
import DevicePage from "@/components/device/DevicePage";
import AuthGuard from "@/components/auth/AuthGuard";

export default function Page() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="text-white">Loading device page...</div>}>
        <DevicePage />
      </Suspense>
    </AuthGuard>

  );
}
