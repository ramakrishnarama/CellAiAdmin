import BarChartOne from "@/components/charts/bar/BarChartOne";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TwinApex from "@/components/ecommerce/TwinApex";
import LineChartOne from "@/components/charts/line/LineChartOne";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Charts | TailAdmin - Dashboard Template",
  description: "Charts demo page in TailAdmin dashboard template.",
};

const metrics = [
  { name: "State of Charge", label: "SOC", value: 75.55, color: "#465FFF" },
  { name: "Pack Voltage", label: "Volts", value: 82.4, color: "#22C55E" },
  { name: "Pack Temperature", label: "°C", value: 64.1, color: "#F97316" },
  { name: "Pack Current", label: "Amperes", value: 48.3, color: "#06B6D4" },
  { name: "Motor Speed", label: "RPM", value: 92.7, color: "#8B5CF6" },
  { name: "Motor Temperature", label: "°C", value: 55.2, color: "#EF4444" },
];

export default function Page() {
  return (
    <div className="space-y-6">
      {/* Metrics row */}
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

      {/* Line & Bar Chart row */}
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
    </div>
  );
}
