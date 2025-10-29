"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import ComponentCard from "@/components/common/ComponentCard";

const AnalogGauge = dynamic(() => import("@/components/charts/Analog/AnalogGauge"), { ssr: false });
const LineChartOne = dynamic(() => import("@/components/charts/line/LineChartOne"), { ssr: false });
const LineChartMultiSeries = dynamic(() => import("@/components/charts/line/LineChartMultiSeries"), { ssr: false });
const BarChartMultiYValues = dynamic(() => import("@/components/charts/bar/BarChartMultiYValues"), { ssr: false });

// ------------------ Utility Generators ------------------

const randInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

interface DayData {
  labels: string[];
  values: number[];
}

interface PhaseData {
  L1: DayData;
  L2: DayData;
  L3: DayData;
}

const generateDayData = (max: number, min: number = 0, days: number = 7): DayData => {
  const labels = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });
  const values = labels.map(() => randInt(min, max));
  return { labels, values };
};

const generatePhaseData = (max: number, min: number = 0): PhaseData => ({
  L1: generateDayData(max, min),
  L2: generateDayData(max, min),
  L3: generateDayData(max, min),
});

const generateStackedData = (categories: string[], min: number, max: number) =>
  categories.map((label) => ({
    name: label,
    data: Array.from({ length: 7 }, () => randInt(min, max)),
  }));

// ------------------ Main Component ------------------

export default function EngineDashboardTabs() {
  const [activeTab, setActiveTab] = useState("overview");

  const [values, setValues] = useState({
    hoursRun: 80787.55,
    batteryVoltage: 12,
    engineSpeed: 1000,
    engineTemp: 30,
    fuelLevel: 55,
    frequency: 48.5,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setValues((prev) => ({
        ...prev,
        batteryVoltage: 11 + Math.random() * 2,
        engineSpeed: 900 + Math.random() * 200,
        engineTemp: 25 + Math.random() * 10,
        fuelLevel: 50 + Math.random() * 10,
        frequency: 48 + Math.random() * 2,
      }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // ------------------ Chart Data ------------------

  const chartData = useMemo(
    () => ({
      voltage: generatePhaseData(1000, 200),
      current: generatePhaseData(20000, 200),
      speed: generateDayData(10000, 800),
      temperature: generateDayData(150, -40),
      fuel: generateDayData(100),
      frequency: generateDayData(100),
      fuelUsed: generateDayData(800, 700),
      hoursRun: generateDayData(90000, 70000),
    }),
    []
  );

  const stackedCategories = ["L1", "L2", "L3"];
  const genBarData = generateStackedData(stackedCategories, 200, 800);

  // ------------------ Render ------------------

  return (
    <div className="p-6 bg-slate-900 text-slate-200 min-h-screen">
      <h1 className="text-white text-3xl font-bold mb-8 text-center tracking-wide">
        ⚙️ Engine & Generator Dashboard — Real-Time + 7-Day History
      </h1>

      {/* 🔹 Top Section — Gauges Left + Larger Details Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Left — Gauges */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <AnalogGauge title="Battery Voltage" value={values.batteryVoltage} min={0} max={60} unit="Vdc" />
          <AnalogGauge title="Fuel Level" value={values.fuelLevel} min={0} max={100} unit="%" />
          <AnalogGauge title="Engine Speed" value={values.engineSpeed} min={0} max={10000} unit="RPM" />
          <AnalogGauge title="Engine Temperature" value={values.engineTemp} min={-40} max={150} unit="°C" />
          <AnalogGauge title="Engine Oil Pressure" value={12.3} min={-1} max={25} unit="Bar" />
          <AnalogGauge title="Frequency" value={values.frequency} min={0} max={100} unit="Hz" />
        </div>

        {/* Right — Details Panel */}
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 h-fit shadow-2xl hover:shadow-green-700/30 transition-all duration-300">
          <h2 className="text-white font-bold text-2xl mb-6 text-center tracking-wide">
            Engine & Generator Details
          </h2>

          <div className="grid grid-cols-2 gap-5 text-base">
            {[
              ["Hours Run", `${values.hoursRun.toFixed(2)} H`],
              ["Total Fuel Used", "787.2 L"],
              ["Frequency", `${values.frequency.toFixed(1)} Hz`],
              ["Power Factor (L1)", "0.80 PF"],
              ["Apparent Power (L1)", "750.5 kVA"],
              ["Reactive Power (L1)", "200.0 kVAR"],
              ["Real Power (L1)", "604.0 kW"],
              ["Power Factor (L2)", "0.82 PF"],
              ["Apparent Power (L2)", "755.5 kVA"],
              ["Reactive Power (L2)", "205.0 kVAR"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="bg-slate-900 rounded-lg p-4 border border-slate-700 hover:border-green-500 hover:bg-slate-800/80 transition-all duration-300"
              >
                <p className="text-slate-300 text-sm tracking-wide">{label}</p>
                <p className="text-green-400 font-semibold text-xl mt-1">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔹 Tabs */}
      <div className="flex gap-3 border-b border-slate-700 mb-6 justify-center flex-wrap">
        {[
          { key: "overview", label: "Overview" },
          { key: "generator", label: "Generator L1–L3" },
          { key: "fuel", label: "Fuel & Runtime" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-2 px-4 text-sm font-medium rounded-t-md transition-colors duration-300 ${
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
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ComponentCard title="Battery Voltage (Vdc)">
            <LineChartOne data={chartData.voltage.L1.values.map((y, i) => [i, y])} color="#3b82f6" yAxisTitle="Volts" />
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
      {activeTab === "generator" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ComponentCard title="Voltage L1–L3 (Vac)">
            <LineChartMultiSeries
              series={[
                { name: "L1 - L2", data: chartData.voltage.L1.values.map((y, i) => ({ x: i, y })) },
                { name: "L2 - L3", data: chartData.voltage.L2.values.map((y, i) => ({ x: i, y })) },
                { name: "L3 - L1", data: chartData.voltage.L3.values.map((y, i) => ({ x: i, y })) },
              ]}
              colorPalette={["#22c55e", "#f59e0b", "#ef4444"]}
              yAxisTitle="Volts"
            />
          </ComponentCard>

          <ComponentCard title="Current L1–L3 (Aac)">
            <LineChartMultiSeries
              series={[
                { name: "L1 - L2", data: chartData.current.L1.values.map((y, i) => ({ x: i, y })) },
                { name: "L2 - L3", data: chartData.current.L2.values.map((y, i) => ({ x: i, y })) },
                { name: "L3 - L1", data: chartData.current.L3.values.map((y, i) => ({ x: i, y })) },
              ]}
              colorPalette={["#06b6d4", "#a855f7", "#84cc16"]}
              yAxisTitle="A"
            />
          </ComponentCard>

          <ComponentCard title="Generator Load (kVA per Phase)">
            <BarChartMultiYValues
              categories={["Day 1", "Day 2"]}
              valuesPerCategory={genBarData}
              yAxisTitle="kVA"
              color={["#22c55e", "#f59e0b", "#ef4444"]}
            />
          </ComponentCard>
        </div>
      )}

      {/* 🔹 Fuel & Runtime Tab */}
      {activeTab === "fuel" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ComponentCard title="Engine Total Fuel Used (L)">
            <LineChartOne data={chartData.fuelUsed.values.map((y, i) => [i, y])} color="#f59e0b" yAxisTitle="Liters" />
          </ComponentCard>
          <ComponentCard title="Hours Run (H)">
            <LineChartOne data={chartData.hoursRun.values.map((y, i) => [i, y])} color="#a855f7" yAxisTitle="Hours" />
          </ComponentCard>
        </div>
      )}
    </div>
  );
}
