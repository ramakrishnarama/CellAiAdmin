"use client";

import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BarChartOne from "@/components/charts/bar/BarChartOne";
import LineChartMultiSeries from "@/components/charts/line/LineChartMultiSeries";

// ✅ Generate 7 days of random data
const generateBarData = (min = 0, max = 100) =>
  Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      x: date.getTime(),
      y: Math.floor(Math.random() * (max - min)) + min,
    };
  });

const barData = generateBarData();
const barDataDischarged = generateBarData();
const barDataHrCharging = generateBarData(80, 180);
const barDataHrDischarging = generateBarData(30, 130);

// Generate one week's worth of data per series
const generateLineSeries = (label: string, min = 20, max = 100) => ({
  name: label,
  data: Array.from({ length: 8 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (7 - i));
    return {
      x: date.getTime(), // ✅ use timestamp
      y: Math.floor(Math.random() * (max - min + 1)) + min,
    };
  }),
});

// Multi-series line chart data
const multiLineData = [
  generateLineSeries("Battery A", 50, 90),
  generateLineSeries("Battery B", 30, 80),
  generateLineSeries("Battery C", 60, 100),
  generateLineSeries("Battery D", 60, 100),
  generateLineSeries("Battery E", 60, 100),
  generateLineSeries("Battery F", 60, 100),
  generateLineSeries("Battery E", 60, 100),
  generateLineSeries("Battery F", 60, 100),
  generateLineSeries("Battery G", 60, 100),
  generateLineSeries("Battery H", 60, 100),
];

// Multi-series line chart data
const multiLineDataEnergy = [
  generateLineSeries("Battery A", 50, 90),
  generateLineSeries("Battery B", 30, 80),
  generateLineSeries("Battery C", 60, 100),
  generateLineSeries("Battery D", 60, 100),
  generateLineSeries("Battery E", 60, 100),
  generateLineSeries("Battery F", 60, 100),
  generateLineSeries("Battery E", 60, 100),
  generateLineSeries("Battery F", 60, 100),
  generateLineSeries("Battery G", 60, 100),
  generateLineSeries("Battery H", 60, 100),
];

const multiLineDataEnergyOut = [
  generateLineSeries("Battery A", 50, 90),
  generateLineSeries("Battery B", 30, 80),
  generateLineSeries("Battery C", 60, 100),
  generateLineSeries("Battery D", 60, 100),
  generateLineSeries("Battery E", 60, 100),
  generateLineSeries("Battery F", 60, 100),
  generateLineSeries("Battery E", 60, 100),
  generateLineSeries("Battery F", 60, 100),
  generateLineSeries("Battery G", 60, 100),
  generateLineSeries("Battery H", 60, 100),
];

const multiLineDataKms = [
  generateLineSeries("Battery A", 50, 90),
  generateLineSeries("Battery B", 30, 80),
  generateLineSeries("Battery C", 60, 100),
  generateLineSeries("Battery D", 60, 100),
  generateLineSeries("Battery E", 60, 100),
  generateLineSeries("Battery F", 60, 100),
  generateLineSeries("Battery E", 60, 100),
  generateLineSeries("Battery F", 60, 100),
  generateLineSeries("Battery G", 60, 100),
  generateLineSeries("Battery H", 60, 100),
];

// Color palette suitable for dark themes
const colorPalette = [
  "#22C55E", "#06B6D4", "#F97316", "#8B5CF6", "#EF4444", "#EAB308", "#3B82F6", "#0EA5E9",
  "#EC4899", "#10B981", "#FACC15", "#6366F1", "#14B8A6", "#4ADE80", "#FB923C", "#F472B6"
];

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "charging", label: "Charging Summary" },
  { key: "stats", label: "Battery Stats" },
];

export default function FleetClient() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Charts Overview" />

      {/* ✅ Tabs */}
      <div className="flex flex-wrap gap-4 border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-2 px-4 text-sm font-medium rounded-t-md transition-all duration-200 ${activeTab === tab.key
              ? "bg-gray-800 text-white border-b-2 border-green-500"
              : "text-gray-400 hover:text-white"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ✅ Tab Content */}
      {activeTab === "overview" && (
        <>
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
        </>
      )}

      {activeTab === "charging" && (
        <><div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ComponentCard title="Cycle Count Per Day" className="w-full">
            <LineChartMultiSeries
              series={multiLineData}
              colorPalette={colorPalette}
              yAxisTitle="No Of Batteries"
            />
          </ComponentCard>
          <ComponentCard title="Energy In (kWh)" className="w-full">
            <LineChartMultiSeries
              series={multiLineDataEnergy}
              colorPalette={colorPalette}
              yAxisTitle="No Of Batteries"
            />
          </ComponentCard>
        </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ComponentCard title="Energy In (kWh)" className="w-full">
              <LineChartMultiSeries
                series={multiLineDataEnergyOut}
                colorPalette={colorPalette}
                yAxisTitle="No Of Batteries"
              />
            </ComponentCard>
            <ComponentCard title="Distance (kms)" className="w-full">
              <LineChartMultiSeries
                series={multiLineDataKms}
                colorPalette={colorPalette}
                yAxisTitle="No Of Batteries"
              />
            </ComponentCard>
          </div>
        </>
      )}

      {activeTab === "stats" && (
        <><div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ComponentCard title="Efficiency(Wh/km)" className="w-full">
            <LineChartMultiSeries
              series={multiLineData}
              colorPalette={colorPalette}
              yAxisTitle="No Of Batteries"
            />
          </ComponentCard>
          <ComponentCard title="Efficiency Distribution" className="w-full">
            <BarChartOne data={barDataDischarged} yAxisTitle="No Of Batteries" color="#8B5CF6" />
          </ComponentCard>
        </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ComponentCard title="Energy In(kWh)" className="w-full">
              <BarChartOne data={barDataHrCharging} yAxisTitle="EnergyIn" color="#4ADE80" />
            </ComponentCard>
            <ComponentCard title="Energy Out(kWh)" className="w-full">
              <BarChartOne data={barDataHrDischarging} yAxisTitle="EnergyOut" color="#FB923C" />
            </ComponentCard>
          </div>
        </>
      )}
    </div>
  );
}
