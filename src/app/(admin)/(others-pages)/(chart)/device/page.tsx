"use client";

import { useState } from "react";
import BarChartOne from "@/components/charts/bar/BarChartOne";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TwinApex from "@/components/ecommerce/TwinApex";
import LineChartOne from "@/components/charts/line/LineChartOne";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Next.js Charts | TailAdmin - Dashboard Template",
//   description: "Charts demo page in TailAdmin dashboard template.",
// };

const metrics = [
  { name: "State of Charge", label: "SOC", value: 75.55, color: "#465FFF" },
  { name: "Pack Voltage", label: "Volts", value: 82.4, color: "#22C55E" },
  { name: "Pack Temperature", label: "°C", value: 64.1, color: "#F97316" },
  { name: "Pack Current", label: "Amperes", value: 48.3, color: "#06B6D4" },
  { name: "Motor Speed", label: "RPM", value: 92.7, color: "#8B5CF6" },
  { name: "Motor Temperature", label: "°C", value: 55.2, color: "#EF4444" },
];

export default function Page() {
  const [serial, setSerial] = useState("");
  const [showContent, setShowContent] = useState(false);

  const handleSubmit = () => {
    if (!serial.trim()) return;
    setShowContent(true);
  };

  return (
    <div className="space-y-6">
      {/* Search Device Section */}
      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
          placeholder="Enter Serial Number"
          className="px-3 py-2 border border-gray-300 rounded w-64 text-white bg-gray-800 placeholder-gray-400"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
      {/* Render Metrics and Charts only after submission */}
      {showContent && (
        <>
          {/* Metrics Row */}
          <div className="grid grid-cols-12 gap-4">
            {metrics.map((metric, idx) => (
              <div key={idx} className="col-span-6 md:col-span-4 lg:col-span-2">
                <TwinApex
                  name={metric.name}
                  label={metric.label}
                  value={metric.value}
                  color={metric.color}
                />
              </div>
            ))}
          </div>

          {/* Line & Bar Charts */}
          <PageBreadcrumb pageTitle="Charts Overview" />
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-6">
              <ComponentCard title="Line Chart">
                <LineChartOne />
              </ComponentCard>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <ComponentCard title="Bar Chart">
                <BarChartOne />
              </ComponentCard>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
