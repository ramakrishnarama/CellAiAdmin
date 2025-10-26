// "use client";

// import { useState } from "react";
// import ComponentCard from "@/components/common/ComponentCard";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import BarChartOne from "@/components/charts/bar/BarChartOne";
// import BarChartMultiYValues from "@/components/charts/bar/BarChartMultiYValues";

// // Helper: random int
// const randInt = (min: number, max: number) =>
//   Math.floor(Math.random() * (max - min + 1)) + min;

// // ✅ Generate time-series bar data
// const generateBarData = (min = 0, max = 100) =>
//   Array.from({ length: 7 }, (_, i) => {
//     const date = new Date();
//     date.setDate(date.getDate() - (6 - i));
//     return {
//       x: date.getTime(),
//       y: randInt(min, max),
//     };
//   });

// // ✅ Generate multi-category stacked data
// const generateStackedData = (categories: string[], columns = 7) =>
//   categories.map((label) => ({
//     name: label,
//     data: Array.from({ length: columns }, () => randInt(10, 100)),
//   }));

// // 🌾 Agriculture chart mock data
// const soilMoistureData = generateBarData(40, 90);
// const humidityData = generateBarData(30, 80);
// const temperatureData = generateBarData(20, 40);

// const nutrientLabels = ["Nitrogen (N)", "Phosphorus (P)", "Potassium (K)"];
// const nutrientLevelsData = generateStackedData(nutrientLabels);

// const cropTypes = ["Sugarcane", "Groundnut", "Paddy", "Banana", "Cotton"];
// const irrigationEventsData = generateStackedData(cropTypes, 7);

// const waterUsageData = generateBarData(10, 60);

// const tabs = [
//   { key: "overview", label: "Overview" },
//   { key: "soil", label: "Soil & Climate" },
//   { key: "irrigation", label: "Irrigation" },
// ];

// // 🆕 Latest IoT event data (example)
// const latestEvent = {
//   timestamp: "26-10-2025 07:00",
//   location: "19.1700 N, 73.2300 E",
//   crop: "Cotton",
//   soil: "Black",
//   temperature: 29.7,
//   humidity: 18,
//   moisture: 82,
//   irrigation: "Off",
//   message: "💧 Water needed in 6 hrs – low moisture",
// };

// export default function AgricultureDashboard() {
//   const [activeTab, setActiveTab] = useState("overview");

//   return (
//     <div className="space-y-6">
//       <PageBreadcrumb pageTitle="Agriculture IoT Dashboard" />

//       {/* 🌿 Latest Event Summary */}
//       <div className="bg-green-900/40 border border-green-700 rounded-lg p-5 text-green-100">
//         <div className="flex flex-wrap justify-between items-center gap-4">
//           <div>
//             <h3 className="text-lg font-semibold text-green-300">
//               🌾 Latest IoT Event
//             </h3>
//             <p className="text-sm text-green-200">
//               {latestEvent.timestamp} | {latestEvent.location}
//             </p>
//           </div>
//           <div className="text-sm flex flex-wrap gap-6">
//             <p>
//               <span className="font-medium text-green-300">Crop:</span>{" "}
//               {latestEvent.crop}
//             </p>
//             <p>
//               <span className="font-medium text-green-300">Soil:</span>{" "}
//               {latestEvent.soil}
//             </p>
//             <p>
//               <span className="font-medium text-green-300">Temp:</span>{" "}
//               {latestEvent.temperature}°C
//             </p>
//             <p>
//               <span className="font-medium text-green-300">Humidity:</span>{" "}
//               {latestEvent.humidity}%
//             </p>
//             <p>
//               <span className="font-medium text-green-300">Moisture:</span>{" "}
//               {latestEvent.moisture}%
//             </p>
//             <p>
//               <span className="font-medium text-green-300">Irrigation:</span>{" "}
//               <span
//                 className={`font-semibold ${
//                   latestEvent.irrigation === "On"
//                     ? "text-green-400"
//                     : "text-red-400"
//                 }`}
//               >
//                 {latestEvent.irrigation}
//               </span>
//             </p>
//           </div>
//         </div>
//         <div className="mt-2 text-green-300 italic">{latestEvent.message}</div>
//       </div>

//       {/* 🌿 Tabs */}
//       <div className="flex flex-wrap gap-4 border-b border-green-700">
//         {tabs.map((tab) => (
//           <button
//             key={tab.key}
//             onClick={() => setActiveTab(tab.key)}
//             className={`py-2 px-4 text-sm font-medium rounded-t-md transition-all duration-200 ${
//               activeTab === tab.key
//                 ? "bg-green-800 text-white border-b-2 border-green-500"
//                 : "text-green-300 hover:text-white"
//             }`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* === OVERVIEW === */}
//       {activeTab === "overview" && (
//         <>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             <ComponentCard title="Average Temperature (°C)">
//               <BarChartOne
//                 data={temperatureData}
//                 color="#84cc16"
//                 yAxisTitle="°C"
//               />
//             </ComponentCard>
//             <ComponentCard title="Average Humidity (%)">
//               <BarChartOne
//                 data={humidityData}
//                 color="#22c55e"
//                 yAxisTitle="%"
//               />
//             </ComponentCard>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             <ComponentCard title="Soil Moisture (%)">
//               <BarChartOne
//                 data={soilMoistureData}
//                 color="#16a34a"
//                 yAxisTitle="%"
//               />
//             </ComponentCard>
//             <ComponentCard title="Water Usage (Liters)">
//               <BarChartOne
//                 data={waterUsageData}
//                 color="#4ade80"
//                 yAxisTitle="L"
//               />
//             </ComponentCard>
//           </div>
//         </>
//       )}

//       {/* === SOIL & CLIMATE === */}
//       {activeTab === "soil" && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           <ComponentCard title="Soil Nutrient Levels">
//             <BarChartMultiYValues
//               categories={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
//               valuesPerCategory={nutrientLevelsData}
//               yAxisTitle="ppm"
//               color={["#84cc16", "#fbbf24", "#22c55e"]}
//             />
//           </ComponentCard>
//           <ComponentCard title="Moisture Trend (7 Days)">
//             <BarChartOne
//               data={soilMoistureData}
//               color="#16a34a"
//               yAxisTitle="%"
//             />
//           </ComponentCard>
//         </div>
//       )}

//       {/* === IRRIGATION === */}
//       {activeTab === "irrigation" && (
//         <>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             <ComponentCard title="Irrigation Events per Crop">
//               <BarChartMultiYValues
//                 categories={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
//                 valuesPerCategory={irrigationEventsData}
//                 yAxisTitle="Events"
//                 color={[
//                   "#22c55e",
//                   "#4ade80",
//                   "#86efac",
//                   "#166534",
//                   "#65a30d",
//                 ]}
//               />
//             </ComponentCard>

//             <ComponentCard title="Water Usage Efficiency">
//               <BarChartOne
//                 data={waterUsageData}
//                 color="#65a30d"
//                 yAxisTitle="L/hour"
//               />
//             </ComponentCard>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BarChartOne from "@/components/charts/bar/BarChartOne";
import BarChartMultiYValues from "@/components/charts/bar/BarChartMultiYValues";
import GaugeChart from "@/components/charts/gauge/GaugeChart";

// Helper: random int
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Generate time-series bar data
const generateBarData = (min = 0, max = 100) =>
  Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      x: date.getTime(),
      y: randInt(min, max),
    };
  });

// Generate multi-category stacked data
const generateStackedData = (categories: string[], columns = 7) =>
  categories.map((label) => ({
    name: label,
    data: Array.from({ length: columns }, () => randInt(10, 100)),
  }));

// Agriculture chart mock data
const soilMoistureData = generateBarData(40, 90);
const humidityData = generateBarData(30, 80);
const temperatureData = generateBarData(20, 40);

const nutrientLabels = ["Nitrogen (N)", "Phosphorus (P)", "Potassium (K)"];
const nutrientLevelsData = generateStackedData(nutrientLabels);

const cropTypes = ["Sugarcane", "Groundnut", "Paddy", "Banana", "Cotton"];
const irrigationEventsData = generateStackedData(cropTypes, 7);

const waterUsageData = generateBarData(10, 60);

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "soil", label: "Soil & Climate" },
  { key: "irrigation", label: "Irrigation" },
];

// Generate latest IoT event dynamically
const getLatestEvent = () => {
  const now = new Date();
  const timestamp = now.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const temperature = randInt(20, 40);
  const humidity = randInt(30, 80);
  const moisture = randInt(40, 90);
  const irrigation = Math.random() > 0.5 ? "On" : "Off";

  // Dynamic message based on thresholds
  let message = "All conditions normal 🌱";
  if (moisture < 50) {
    message = "💧 Water needed soon – low soil moisture";
  } else if (temperature > 35) {
    message = "🔥 High temperature alert – protect crops";
  } else if (humidity < 40) {
    message = "💨 Low humidity – monitor irrigation";
  } else if (irrigation === "On") {
    message = "💧 Irrigation is running";
  }

  return {
    timestamp,
    location: "19.1700 N, 73.2300 E",
    crop: "Cotton",
    soil: "Black",
    temperature,
    humidity,
    moisture,
    irrigation,
    message,
  };
};

export default function AgricultureDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [latestEvent, setLatestEvent] = useState(getLatestEvent());

  // Refresh latest event every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setLatestEvent(getLatestEvent());
    }, 60000); // 60s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Agriculture IoT Dashboard" />

      {/* Latest IoT Event */}
      <div className="bg-green-900/30 border border-green-700 rounded-lg p-5 text-green-100 shadow-md">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-green-300">
              🌾 Latest IoT Event
            </h3>
            <p className="text-sm text-green-200">
              {latestEvent.timestamp} | {latestEvent.location}
            </p>
          </div>
          <div className="text-sm flex flex-wrap gap-6">
            <p>
              <span className="font-medium text-green-300">Crop:</span>{" "}
              {latestEvent.crop}
            </p>
            <p>
              <span className="font-medium text-green-300">Soil:</span>{" "}
              {latestEvent.soil}
            </p>
            <p>
              <span className="font-medium text-green-300">Temp:</span>{" "}
              {latestEvent.temperature}°C
            </p>
            <p>
              <span className="font-medium text-green-300">Humidity:</span>{" "}
              {latestEvent.humidity}%
            </p>
            <p>
              <span className="font-medium text-green-300">Moisture:</span>{" "}
              {latestEvent.moisture}%
            </p>
            <p>
              <span className="font-medium text-green-300">Irrigation:</span>{" "}
              <span
                className={`font-semibold ${
                  latestEvent.irrigation === "On"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {latestEvent.irrigation}
              </span>
            </p>
          </div>
        </div>
        <div className="mt-2 text-green-300 italic">{latestEvent.message}</div>
      </div>

      {/* Gauge Charts */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <GaugeChart
            title="Temperature"
            value={latestEvent.temperature}
            unit="°C"
            min={10}
            max={50}
            thresholds={{ min: 20, max: 35 }}
            height={140}
          />
          <GaugeChart
            title="Humidity"
            value={latestEvent.humidity}
            unit="%"
            min={0}
            max={100}
            thresholds={{ min: 40, max: 70 }}
            height={140}
          />
          <GaugeChart
            title="Soil Moisture"
            value={latestEvent.moisture}
            unit="%"
            min={0}
            max={100}
            thresholds={{ min: 60, max: 85 }}
            height={140}
          />
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 border-b border-green-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-2 px-4 text-sm font-medium rounded-t-md transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-green-800 text-white border-b-2 border-green-500"
                : "text-green-300 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* === OVERVIEW === */}
      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ComponentCard title="Average Temperature (°C)">
              <BarChartOne
                data={temperatureData}
                color="#F59E0B"
                yAxisTitle="°C"
              />
            </ComponentCard>
            <ComponentCard title="Average Humidity (%)">
              <BarChartOne data={humidityData} color="#3B82F6" yAxisTitle="%" />
            </ComponentCard>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ComponentCard title="Soil Moisture (%)">
              <BarChartOne
                data={soilMoistureData}
                color="#22C55E"
                yAxisTitle="%"
              />
            </ComponentCard>
            <ComponentCard title="Water Usage (Liters)">
              <BarChartOne data={waterUsageData} color="#8B5CF6" yAxisTitle="L" />
            </ComponentCard>
          </div>
        </>
      )}

      {/* === SOIL & CLIMATE === */}
      {activeTab === "soil" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ComponentCard title="Soil Nutrient Levels">
            <BarChartMultiYValues
              categories={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
              valuesPerCategory={nutrientLevelsData}
              yAxisTitle="ppm"
              color={["#84CC16", "#FBBF24", "#E11D48"]}
            />
          </ComponentCard>
          <ComponentCard title="Moisture Trend (7 Days)">
            <BarChartOne
              data={soilMoistureData}
              color="#06B6D4"
              yAxisTitle="%"
            />
          </ComponentCard>
        </div>
      )}

      {/* === IRRIGATION === */}
      {activeTab === "irrigation" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ComponentCard title="Irrigation Events per Crop">
            <BarChartMultiYValues
              categories={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
              valuesPerCategory={irrigationEventsData}
              yAxisTitle="Events"
              color={["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"]}
            />
          </ComponentCard>

          <ComponentCard title="Water Usage Efficiency">
            <BarChartOne
              data={waterUsageData}
              color="#65A30D"
              yAxisTitle="L/hour"
            />
          </ComponentCard>
        </div>
      )}
    </div>
  );
}
