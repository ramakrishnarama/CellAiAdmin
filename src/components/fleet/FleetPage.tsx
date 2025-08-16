"use client";

import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BarChartOne from "@/components/charts/bar/BarChartOne";
// import LineChartMultiSeries from "@/components/charts/line/LineChartMultiSeries";
import BarChartMultiYValues from "@/components/charts/bar/BarChartMultiYValues";

// Helper to generate random integers
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// ✅ Generate stacked data with custom bucket names
const generateStackedData = (
  ranges: number[], // breakpoints
  columns = 7
) => {
  // Sort descending
  const sortedRanges = [...ranges].sort((a, b) => b - a);

  const labels = sortedRanges.map((r, i) => {
    if (i === 0) return `>${r}`;
    if (i === sortedRanges.length - 1) return `0.01–${sortedRanges[i - 1]}`;
    return `${sortedRanges[i]}–${sortedRanges[i - 1]}`;
  });

  return labels.map((label) => ({
    name: label,
    data: Array.from({ length: columns }, () => randInt(1, 50)),
  }));
};

// Generate example bar chart data
const generateBarData = (min = 0, max = 100) =>
  Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      x: date.getTime(),
      y: randInt(min, max),
    };
  });

const barData = generateBarData();
const barDataDischarged = generateBarData();

// Multi-series line chart data
// const generateLineSeries = (label: string, min = 20, max = 100) => ({
//   name: label,
//   data: Array.from({ length: 8 }, (_, i) => {
//     const date = new Date();
//     date.setDate(date.getDate() - (7 - i));
//     return {
//       x: date.getTime(),
//       y: randInt(min, max),
//     };
//   }),
// });

// Helper: generate range labels
// const generateRangeLabels = (min: number, max: number, step: number) => {
//   const labels: string[] = [];
//   for (let start = min; start < max; start += step) {
//     const end = start + step;
//     labels.push(`${start}–${end}`);
//   }
//   labels.push(`>${max}`);
//   return labels;
// };

// Generate multi-line data with range labels
// const rangeLabels = generateRangeLabels(5, 40, 5);
// const multiLineData = rangeLabels.map((label) =>
//   generateLineSeries(label, randInt(10, 30), randInt(35, 80))
// );


// const colorPalette = [
//   "#22C55E", "#06B6D4", "#F97316", "#8B5CF6",
//   "#EF4444", "#EAB308", "#3B82F6", "#0EA5E9"
// ];

// ✅ Category arrays
const hourlyCategories = Array.from({ length: 24 }, (_, i) =>
  `${String(i).padStart(2, "0")}:00`
);
const dateCategories = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - i));
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
});

const dateCategoriesForMileage = Array.from({ length: 14 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (13 - i));
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
});

// ✅ Chart data using ranges
const cyclesPerCountData = generateStackedData(
  [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2], // breakpoints
  7
);
const energyInData = generateStackedData(
  [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4],
  7
);
const energyOutData = generateStackedData(
  [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4],
  7
);
const distanceKmsData = generateStackedData(
  [10, 20, 30, 40, 50, 60, 80, 100],
  7
);

const mileageData = generateStackedData(
  [0,10, 20, 30, 40, 50,],
  14
);
// const barDataHrCharging = generateStackedData([5, 10, 15, 20], 24);
// const barDataHrDischarging = generateStackedData([5, 10, 15, 20], 24);

const generateChargingData = (seriesCount: number, columns = 7) =>
  Array.from({ length: seriesCount }, (_, sIdx) => ({
    name: `Batteries ${sIdx + 1}`,
    data: Array.from({ length: columns }, () => randInt(10, 50)),
  }));


const barDataHrCharging = generateChargingData(1, 24);
const barDataHrDischarging = generateChargingData(1, 24);

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "charging", label: "Utilization Metrics" },
  { key: "stats", label: "Performance & Efficiency" },
];

export default function FleetClient() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Fleet Overview" />

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-2 px-4 text-sm font-medium rounded-t-md transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-gray-800 text-white border-b-2 border-green-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ComponentCard title="Batteries Charged">
              <BarChartOne data={barData} yAxisTitle="Batteries" color="#22C55E" />
            </ComponentCard>
            <ComponentCard title="Batteries Discharged">
              <BarChartOne data={barDataDischarged} yAxisTitle="Batteries" color="#38BDF8" />
            </ComponentCard>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ComponentCard title="Hourly Charging">
              <BarChartMultiYValues
                categories={hourlyCategories}
                valuesPerCategory={barDataHrCharging}
                yAxisTitle="Batteries"
                color={["#FBBF24"]}
              />
            </ComponentCard>
            <ComponentCard title="Hourly Discharging">
              <BarChartMultiYValues
                categories={hourlyCategories}
                valuesPerCategory={barDataHrDischarging}
                yAxisTitle="Batteries"
                color={["#8B5CF6"]}
              />
            </ComponentCard>
          </div>
        </>
      )}

      {activeTab === "charging" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ComponentCard title="Cycle Count Per Day">
              <BarChartMultiYValues
                categories={dateCategories}
                valuesPerCategory={cyclesPerCountData}
                yAxisTitle="Number Of Batteries"
                color={[]}
              />
            </ComponentCard>
            <ComponentCard title="KMS Travelled">
              <BarChartMultiYValues
                categories={dateCategories}
                valuesPerCategory={distanceKmsData}
                yAxisTitle="Number Of Batteries"
                color={[]}
              />
            </ComponentCard>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ComponentCard title="Energy In (kWh)">
              <BarChartMultiYValues
                categories={dateCategories}
                valuesPerCategory={energyInData}
                yAxisTitle="Number Of Batteries"
                color={[]}
              />
            </ComponentCard>
            <ComponentCard title="Energy Out (kWh)">
              <BarChartMultiYValues
                categories={dateCategories}
                valuesPerCategory={energyOutData}
                yAxisTitle="Number Of Batteries"
                color={[]}
              />
            </ComponentCard>
          </div>
        </>
      )}

      {activeTab === "stats" && (
        <>
          <div className="grid">
          {/* grid-cols-1 sm:grid-cols-2 gap-6 */}
            {/* <ComponentCard title="Efficiency (Wh/km)">
              <LineChartMultiSeries
                series={multiLineData}
                colorPalette={[]}
                yAxisTitle="Number Of Batteries"
              />
            </ComponentCard> */}
            <ComponentCard title="Mileage (Wh/km)">
              <BarChartMultiYValues
                  categories={dateCategoriesForMileage}
                  valuesPerCategory={mileageData}
                  yAxisTitle="Number Of Batteries"
                  color={[]}
                />
            </ComponentCard>
          </div>
          
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ComponentCard title="Energy In (kWh)">
              <BarChartMultiYValues
                categories={dateCategories}
                valuesPerCategory={energyInData}
                yAxisTitle="Energy In"
                color={[]}
              />
            </ComponentCard>
            <ComponentCard title="Energy Out (kWh)">
              <BarChartMultiYValues
                categories={dateCategories}
                valuesPerCategory={energyOutData}
                yAxisTitle="Energy Out"
                color={[]}
              />
            </ComponentCard>
          </div>
        </>
      )}
    </div>
  );
}
