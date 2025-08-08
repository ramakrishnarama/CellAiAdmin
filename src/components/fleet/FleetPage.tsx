"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BarChartOne from "@/components/charts/bar/BarChartOne";

// ✅ Generate 30 days of random data
const barData: { x: number; y: number }[] = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - i)); // From 15 days ago to today
  return {
    x: date.getTime(),                  // timestamp (x)
    y: Math.floor(Math.random() * 100), // random value (y)
  };
});

const barDataDischarged: { x: number; y: number }[] = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - i)); // From 15 days ago to today
  return {
    x: date.getTime(),                  // timestamp (x)
    y: Math.floor(Math.random() * 100), // random value (y)
  };
});

const barDataHrchaging: { x: number; y: number }[] = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - i)); // From 15 days ago to today
  return {
    x: date.getTime(),                  // timestamp (x)
    y: Math.floor(Math.random() * 100) + 80, // random value (y)
  };
});

const barDataHrDischaging: { x: number; y: number }[] = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - i)); // From 15 days ago to today
  return {
    x: date.getTime(),                  // timestamp (x)
    y: Math.floor(Math.random() * 100) + 30, // random value (y)
  };
});

export default function FleetClient() {
  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Charts Overview" />
      <div className="grid grid-cols-12 gap-6">
        <ComponentCard title="Batteries Charged" className="col-span-6">
          <BarChartOne data={barData} yAxisTitle="Batteries" color="#22C55E" /> 
        </ComponentCard>
        <ComponentCard title="Batteries Discharged" className="col-span-6">
          <BarChartOne data={barDataDischarged} yAxisTitle="Batteries" color="#38BDF8" /> 
        </ComponentCard>
      </div>
      <div className="grid grid-cols-12 gap-6">
        <ComponentCard title="Hourly Charging" className="col-span-6">
          <BarChartOne data={barDataHrchaging} yAxisTitle="Batteries" color="#FBBF24" /> 
        </ComponentCard>
        <ComponentCard title="Hourly Discharging" className="col-span-6">
          <BarChartOne data={barDataHrDischaging} yAxisTitle="Batteries" color="#F472B6" /> 
        </ComponentCard>
      </div>
    </div>
  );
}
