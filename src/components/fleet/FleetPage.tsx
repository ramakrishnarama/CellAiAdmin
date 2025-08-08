"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BarChartOne from "@/components/charts/bar/BarChartOne";

// ✅ Generate 7 days of random data
const generateBarData = (offset = 0, min = 0, max = 100) =>
  Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i)); // From 6 days ago to today
    return {
      x: date.getTime(),
      y: Math.floor(Math.random() * (max - min)) + min,
    };
  });

const barData = generateBarData();
const barDataDischarged = generateBarData();
const barDataHrCharging = generateBarData(0, 80, 180);
const barDataHrDischarging = generateBarData(0, 30, 130);

export default function FleetClient() {
  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Charts Overview" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ComponentCard title="Batteries Charged" className="w-full">
          <BarChartOne data={barData} yAxisTitle="Batteries" color="#22C55E" />
        </ComponentCard>
        <ComponentCard title="Batteries Discharged" className="w-full">
          <BarChartOne data={barDataDischarged} yAxisTitle="Batteries" color="#38BDF8" />
        </ComponentCard>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ComponentCard title="Hourly Charging" className="w-full">
          <BarChartOne data={barDataHrCharging} yAxisTitle="Batteries" color="#FBBF24" />
        </ComponentCard>
        <ComponentCard title="Hourly Discharging" className="w-full">
          <BarChartOne data={barDataHrDischarging} yAxisTitle="Batteries" color="#F472B6" />
        </ComponentCard>
      </div>
    </div>
  );
}
