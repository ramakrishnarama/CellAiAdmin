"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import ComponentCard from "@/components/common/ComponentCard";

const AnalogGauge = dynamic(() => import("@/components/charts/Analog/AnalogGauge"), { ssr: false });
const LineChartOne = dynamic(() => import("@/components/charts/line/LineChartOne"), { ssr: false });
const LineChartMultiSeries = dynamic(() => import("@/components/charts/line/LineChartMultiSeries"), { ssr: false });
// const BarChartMultiYValues = dynamic(() => import("@/components/charts/bar/BarChartMultiYValues"), { ssr: false });

// ------------------ Types ------------------
interface PhaseMetrics {
VLT: number; // Voltage
CRT: number; // Current
PFR: number; // Power Factor
APP: number; // Apparent Power (kVA)
RAP: number; // Reactive Power (kVAR)
RLP: number; // Real Power (kW)
}

interface EngineRecord {
timestamp: string;
hoursRun: number;
batteryVoltage: number;
engineSpeed: number;
engineTemp: number;
fuelLevel: number;
frequency: number;
engineOilPressure: number;
engineOilTemperature: number;
L1: PhaseMetrics;
L2: PhaseMetrics;
L3: PhaseMetrics;
}

// ------------------ Main Component ------------------
export default function EngineDashboardTabs() {
const [activeTab, setActiveTab] = useState("overview");
const [values, setValues] = useState<EngineRecord | null>(null);
const [historyData, setHistoryData] = useState<EngineRecord[]>([]);

// ------------------ Fetch Real API Data ------------------
useEffect(() => {
async function fetchEngineData() {
try {
const res = await fetch("http://52.90.158.135:4000/api/engine/000044455601/history");
const data = await res.json();


    if (data.records && data.records.length > 0) {
      const latest = data.records[data.records.length - 1];
      setValues(latest);
      setHistoryData(data.records);
    } else {
      console.warn("No data records found in API response");
    }
  } catch (err) {
    console.error("Error fetching engine data:", err);
  }
}

fetchEngineData();
const interval = setInterval(fetchEngineData, 60000); // refresh every 1 min
return () => clearInterval(interval);


}, []);

// ------------------ Chart Data from API History ------------------
const chartData = useMemo(() => {
if (historyData.length === 0) return null;


const labels = historyData.map((r) =>
  new Date(r.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
);

return {
  voltage: { labels, values: historyData.map((r) => r.batteryVoltage) },
  speed: { labels, values: historyData.map((r) => r.engineSpeed) },
  temperature: { labels, values: historyData.map((r) => r.engineTemp) },
  fuel: { labels, values: historyData.map((r) => r.fuelLevel) },
  frequency: { labels, values: historyData.map((r) => r.frequency) },
  hoursRun: { labels, values: historyData.map((r) => r.hoursRun) },
  L1: {
    voltage: { labels, values: historyData.map((r) => r.L1.VLT) },
    current: { labels, values: historyData.map((r) => r.L1.CRT) },
    pf: { labels, values: historyData.map((r) => r.L1.PFR) },
    power: { labels, values: historyData.map((r) => r.L1.APP) },
  },
  L2: {
    voltage: { labels, values: historyData.map((r) => r.L2.VLT) },
    current: { labels, values: historyData.map((r) => r.L2.CRT) },
    pf: { labels, values: historyData.map((r) => r.L2.PFR) },
    power: { labels, values: historyData.map((r) => r.L2.APP) },
  },
  L3: {
    voltage: { labels, values: historyData.map((r) => r.L3.VLT) },
    current: { labels, values: historyData.map((r) => r.L3.CRT) },
    pf: { labels, values: historyData.map((r) => r.L3.PFR) },
    power: { labels, values: historyData.map((r) => r.L3.APP) },
  },
};


}, [historyData]);

if (!values)
return ( <div className="flex items-center justify-center min-h-screen text-white text-xl">
Loading engine data... </div>
);

// ------------------ Render ------------------
return ( <div className="p-6 bg-slate-900 text-slate-200 min-h-screen"> <h1 className="text-white text-3xl font-bold mb-8 text-center tracking-wide">
⚙️ Engine & Generator Dashboard — Real-Time + Historical Data </h1>


  {/* 🔹 Gauges + Summary */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
      <AnalogGauge title="Battery Voltage" value={values.batteryVoltage} min={0} max={60} unit="Vdc" />
      <AnalogGauge title="Fuel Level" value={values.fuelLevel} min={0} max={100} unit="%" />
      <AnalogGauge title="Engine Speed" value={values.engineSpeed} min={0} max={10000} unit="RPM" />
      <AnalogGauge title="Engine Temperature" value={values.engineTemp} min={-40} max={150} unit="°C" />
      <AnalogGauge title="Engine Oil Pressure" value={values.engineOilPressure} min={0} max={25} unit="Bar" />
      <AnalogGauge title="Engine Oil Temperature" value={values.engineOilTemperature} min={-40} max={150} unit="°C" />
    </div>

    <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl flex flex-col gap-6">
      <h2 className="text-white font-semibold text-2xl mb-4 text-center">Engine Summary</h2>
      <div className="grid grid-cols-2 gap-5 text-base">
        {[
          ["Hours Run", `${values.hoursRun.toFixed(2)} H`],
          ["Frequency", `${values.frequency.toFixed(1)} Hz`],
          ["Last Updated", new Date(values.timestamp).toLocaleTimeString()],
        ].map(([label, value]) => (
          <div
            key={label}
            className="bg-slate-900 rounded-lg p-4 border border-slate-700 hover:border-green-500 transition"
          >
            <p className="text-slate-300 text-sm">{label}</p>
            <p className="text-green-400 font-semibold text-xl mt-1">{value}</p>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* 🔹 Tabs */}
  <div className="flex gap-3 border-b border-slate-700 mb-6 flex-wrap">
    {[
      { key: "overview", label: "Overview" },
      { key: "generator", label: "Generator L1–L3" },
      { key: "fuel", label: "Fuel & Runtime" },
    ].map((tab) => (
      <button
        key={tab.key}
        onClick={() => setActiveTab(tab.key)}
        className={`py-2 px-4 text-sm font-medium rounded-t-md transition ${
          activeTab === tab.key
            ? "bg-slate-800 text-green-300 border-b-2 border-green-500"
            : "text-slate-400 hover:text-green-200"
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>

  {/* 🔹 Overview Tab */}
  {activeTab === "overview" && chartData && (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <ComponentCard title="Battery Voltage (Vdc)">
        <LineChartOne data={chartData.voltage.values.map((y, i) => [i, y])} color="#3b82f6" yAxisTitle="Volts" />
      </ComponentCard>
      <ComponentCard title="Engine Speed (RPM)">
        <LineChartOne data={chartData.speed.values.map((y, i) => [i, y])} color="#f59e0b" yAxisTitle="RPM" />
      </ComponentCard>
      <ComponentCard title="Engine Temperature (°C)">
        <LineChartOne data={chartData.temperature.values.map((y, i) => [i, y])} color="#ef4444" yAxisTitle="°C" />
      </ComponentCard>
      <ComponentCard title="Fuel Level (%)">
        <LineChartOne data={chartData.fuel.values.map((y, i) => [i, y])} color="#84cc16" yAxisTitle="%" />
      </ComponentCard>
    </div>
  )}

  {/* 🔹 Generator L1–L3 Tab */}
  {activeTab === "generator" && chartData && (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <ComponentCard title="Voltage (L1–L3)">
        <LineChartMultiSeries
          series={[
            { name: "L1 Voltage", data: chartData.L1.voltage.values.map((y, i) => ({ x: i, y })) },
            { name: "L2 Voltage", data: chartData.L2.voltage.values.map((y, i) => ({ x: i, y })) },
            { name: "L3 Voltage", data: chartData.L3.voltage.values.map((y, i) => ({ x: i, y })) },
          ]}
          colorPalette={["#22c55e", "#f59e0b", "#ef4444"]}
          yAxisTitle="Volts"
        />
      </ComponentCard>

      <ComponentCard title="Current (L1–L3)">
        <LineChartMultiSeries
          series={[
            { name: "L1 Current", data: chartData.L1.current.values.map((y, i) => ({ x: i, y })) },
            { name: "L2 Current", data: chartData.L2.current.values.map((y, i) => ({ x: i, y })) },
            { name: "L3 Current", data: chartData.L3.current.values.map((y, i) => ({ x: i, y })) },
          ]}
          colorPalette={["#06b6d4", "#a855f7", "#84cc16"]}
          yAxisTitle="Amps"
        />
      </ComponentCard>

      <ComponentCard title="Power Factor (PF per Phase)">
        <LineChartMultiSeries
          series={[
            { name: "L1 PF", data: chartData.L1.pf.values.map((y, i) => ({ x: i, y })) },
            { name: "L2 PF", data: chartData.L2.pf.values.map((y, i) => ({ x: i, y })) },
            { name: "L3 PF", data: chartData.L3.pf.values.map((y, i) => ({ x: i, y })) },
          ]}
          colorPalette={["#f59e0b", "#10b981", "#3b82f6"]}
          yAxisTitle="Power Factor"
        />
      </ComponentCard>

      <ComponentCard title="Apparent Power (kVA per Phase)">
        <LineChartMultiSeries
          series={[
            { name: "L1 kVA", data: chartData.L1.power.values.map((y, i) => ({ x: i, y })) },
            { name: "L2 kVA", data: chartData.L2.power.values.map((y, i) => ({ x: i, y })) },
            { name: "L3 kVA", data: chartData.L3.power.values.map((y, i) => ({ x: i, y })) },
          ]}
          colorPalette={["#eab308", "#a855f7", "#ef4444"]}
          yAxisTitle="kVA"
        />
      </ComponentCard>
    </div>
  )}

  {/* 🔹 Fuel & Runtime Tab */}
  {activeTab === "fuel" && chartData && (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <ComponentCard title="Hours Run (H)">
        <LineChartOne data={chartData.hoursRun.values.map((y, i) => [i, y])} color="#a855f7" yAxisTitle="Hours" />
      </ComponentCard>
      <ComponentCard title="Frequency (Hz)">
        <LineChartOne data={chartData.frequency.values.map((y, i) => [i, y])} color="#22c55e" yAxisTitle="Hz" />
      </ComponentCard>
    </div>
  )}
</div>


);
}
