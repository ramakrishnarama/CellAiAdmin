"use client";
import React from "react";

type Metric = {
  label: string;
  count: number;
  color: string;
};

const metrics: Metric[] = [
  { label: "Total Batteries", count: 1200, color: "bg-blue-500" },
  { label: "Out of Geofence", count: 15, color: "bg-pink-500" },
  { label: "Low SOC", count: 43, color: "bg-red-500" },
  { label: "Discharge Disabled", count: 7, color: "bg-yellow-600" },
  { label: "Not Contacting", count: 21, color: "bg-gray-500" },
  { label: "Not Used (24 hr+)", count: 32, color: "bg-orange-500" },
  { label: "Potential Tamper", count: 4, color: "bg-purple-500" },
  { label: "Not Charged In 7 Days", count: 18, color: "bg-teal-500" },
  { label: "High Temperature", count: 6, color: "bg-rose-500" },
  { label: "Low Temperature", count: 9, color: "bg-sky-500" },
];

// Emoji fallback (for icon position)
const getIcon = (label: string) => {
  const map: Record<string, string> = {
    "Total Batteries": "🔋",
    "Out of Geofence": "📍",
    "Low SOC": "⚠️",
    "Discharge Disabled": "⛔",
    "Not Contacting": "📴",
    "Not Used (24 hr+)": "🕒",
    "Potential Tamper": "🔓",
    "Not Charged In 7 Days": "🔌",
    "High Temperature": "🌡️",
    "Low Temperature": "❄️",
  };
  return map[label] || "📊";
};

export const EcommerceMetrics = () => {
  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      {metrics.map(({ label, count }) => (
        <div
          key={label}
          className="col-span-6 sm:col-span-4 md:col-span-3 lg:col-span-2 transform transition-transform hover:scale-105 hover:shadow-xl duration-200 rounded-2xl bg-zinc-900 text-white shadow-md p-4 dark:bg-white/[0.03]"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-4xl">{getIcon(label)}</div>
            <div className="text-2xl font-bold">{count}</div>
          </div>
          <div className="text-sm sm:text-base font-medium text-gray-300 mt-1 truncate">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
};
