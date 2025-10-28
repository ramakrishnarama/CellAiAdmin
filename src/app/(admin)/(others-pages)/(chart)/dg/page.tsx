"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import ComponentCard from "@/components/common/ComponentCard";

// Lazy-load heavy chart components
const AnalogGauge = dynamic(() => import("@/components/charts/Analog/AnalogGauge"), { ssr: false });
const LineChartOne = dynamic(() => import("@/components/charts/line/LineChartOne"), { ssr: false });
const LineChartMultiSeries = dynamic(() => import("@/components/charts/line/LineChartMultiSeries"), { ssr: false });
const BarChartMultiYValues = dynamic(() => import("@/components/charts/bar/BarChartMultiYValues"), { ssr: false });

// Helper functions
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateDayData = (max: number, min = 0, days = 7) => {
  const labels = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });
  const values = labels.map(() => randInt(min, max));
  return { labels, values };
};

const generateStackedData = (categories: string[], min: number, max: number) =>
  categories.map((label) => ({
    name: label,
    data: Array.from({ length: 2 }, () => randInt(min, max)),
  }));

export default function EngineDashboardTabs() {
  const [activeTab, setActiveTab] = useState("overview");

  // Simulated live values
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

  // Chart Data
  const chartData = useMemo(
    () => ({
      voltage: generateDayData(60),
      speed: generateDayData(10000),
      temperature: generateDayData(150, -40),
      fuel: generateDayData(100),
      frequency: generateDayData(100),
      power: generateDayData(1000),
      current: generateDayData(20000),
      kVA: generateDayData(100000),
      kVAR: generateDayData(100000),
      kW: generateDayData(100000),
      pf: generateDayData(1, -1),
    }),
    []
  );

  const stackedCategories = ["L1", "L2", "L3"];
  const genBarData = generateStackedData(stackedCategories, 10, 90);

  return (<div className="p-6 bg-slate-900 text-green-200 min-h-screen"> <h1 className="text-green-400 text-xl font-semibold mb-6">
    ⚙️ Engine & Generator Dashboard — Last 2 Days </h1>
        {/* Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <AnalogGauge title="Battery Voltage" value={values.batteryVoltage} min={0} max={60} unit="Vdc" color="#3b82f6" />
          <AnalogGauge title="Engine Speed" value={values.engineSpeed} min={0} max={10000} unit="RPM" color="#f59e0b" />
          <AnalogGauge title="Engine Temperature" value={values.engineTemp} min={-40} max={150} unit="°C" color="#ef4444" />
          <AnalogGauge title="Fuel Level" value={values.fuelLevel} min={0} max={100} unit="%" color="#84cc16" />
          <AnalogGauge title="Frequency" value={values.frequency} min={0} max={100} unit="Hz" color="#06b6d4" />
          <AnalogGauge title="Hours Run" value={values.hoursRun / 1000} min={0} max={100000} unit="H" color="#a855f7" />
        </div>

    {/* Tabs */}
    <div className="flex gap-3 border-b border-slate-700 mb-6">
      {[
        { key: "overview", label: "Overview" },
        { key: "generator", label: "Generator L1–L3" },
        { key: "fuel", label: "Fuel & Runtime" },
      ].map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`py-2 px-4 text-sm font-medium rounded-t-md ${activeTab === tab.key
              ? "bg-slate-800 text-green-300 border-b-2 border-green-500"
              : "text-gray-400 hover:text-green-200"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>

    {/* Overview */}
    {activeTab === "overview" && (
      <>
        {/* Line/Bar Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ComponentCard title="Battery Voltage (Vdc)">
            <LineChartOne data={chartData.voltage.values.map((y, i) => [i, y])} color="#3b82f6" yAxisTitle="Volts" />
          </ComponentCard>


          <ComponentCard title="Engine Speed (RPM)">

          <LineChartMultiSeries
            series={[
              {
                name: "RPM",
                data: chartData.speed.values.map((y, i) => ({ x: i, y })),
              },
            ]}
            colorPalette={["#f59e0b"]}
            yAxisTitle="RPM"
          />

          </ComponentCard>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ComponentCard title="Engine Temperature (°C)">
            <LineChartOne data={chartData.temperature.values.map((y, i) => [i, y])} color="#ef4444" yAxisTitle="°C" />
          </ComponentCard>
          <ComponentCard title="Fuel Level (%)">
            <LineChartOne data={chartData.fuel.values.map((y, i) => [i, y])} color="#84cc16" yAxisTitle="%" />
          </ComponentCard>


        </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                  <ComponentCard title="Frequency (Hz)">
            <BarChartMultiYValues categories={["<50", "50–100"]} valuesPerCategory={genBarData} yAxisTitle="Hz" color={["#06b6d4"]} />
          </ComponentCard>
          </div>
      </>
    )}

    {/* Generator Tab */}
    {activeTab === "generator" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { title: "Voltage L1–L3 (Vac)", data: chartData.voltage, color: "#3b82f6" },
            { title: "Current (Aac)", data: chartData.current, color: "#f97316" },
            { title: "Power Factor (PF)", data: chartData.pf, color: "#22c55e" },
            { title: "Apparent Power (kVA)", data: chartData.kVA, color: "#a855f7" },
            { title: "Reactive Power (kVAR)", data: chartData.kVAR, color: "#06b6d4" },
            { title: "Real Power (kW)", data: chartData.kW, color: "#ef4444" },
          ].map((item) => (
            <>
             <ComponentCard title={item.title} >
              <LineChartOne
                  data={item.data.values.map((y, i) => [i, y])}
                  color={item.color}
                  yAxisTitle={item.title.split("(")[1]?.replace(")", "")}
                />
              </ComponentCard>
            </>
          ))}
        </div>
      )}

    {/* Fuel & Runtime Tab */}
    {activeTab === "fuel" && (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* <ComponentCard title="Fuel Level (%)">
            <AnalogGauge title="Fuel Level" value={values.fuelLevel} min={0} max={100} unit="%" color="#84cc16" />
          </ComponentCard> */}
          <ComponentCard title="Engine Total Fuel Used (L)">
            <h3 className="text-green-300 text-sm font-semibold mb-2"></h3>
            <LineChartOne data={generateDayData(800, 700).values.map((y, i) => [i, y])} color="#f59e0b" yAxisTitle="Liters" />
          </ComponentCard>
          
          <ComponentCard title="Hours Run (H)">
            <LineChartOne data={generateDayData(90000, 70000).values.map((y, i) => [i, y])} color="#a855f7" yAxisTitle="Hours" />
          </ComponentCard>
        </div>
      </>
    )}
  </div>


  );
}
