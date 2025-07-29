// app/device/page.tsx
"use client";

import { Suspense } from "react";
import DevicePage from "@/components/device/DevicePage";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white">Loading device page...</div>}>
      <DevicePage />
    </Suspense>
  );
}
