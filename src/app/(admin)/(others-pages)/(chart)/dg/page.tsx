"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import ComponentCard from "@/components/common/ComponentCard";
// import Image from "next/image";

const AnalogGauge = dynamic(() => import("@/components/charts/Analog/AnalogGauge"), { ssr: false });
const LineChartOne = dynamic(() => import("@/components/charts/line/LineChartOne"), { ssr: false });
const LineChartMultiSeries = dynamic(() => import("@/components/charts/line/LineChartMultiSeries"), { ssr: false });
const MapWithDg = dynamic(() => import("@/components/ecommerce/MapWithDg"), { ssr: false });

interface PhaseMetrics {
  VLT: number;
  CRT: number;
  PFR: number;
  APP: number;
  RAP: number;
  RLP: number;
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
  VL12?: number;
  VL23?: number;
  VL31?: number;
  L1: PhaseMetrics;
  L2: PhaseMetrics;
  L3: PhaseMetrics;
}

export default function EngineDashboardTabs() {
  const [activeTab, setActiveTab] = useState("overview");
  const [values, setValues] = useState<EngineRecord | null>(null);
  const [historyData, setHistoryData] = useState<EngineRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSerial, setSelectedSerial] = useState<string | null>(null);
  const [engines, setEngines] = useState<{ GID: string; LAT: number; LON: number, HTH: string }[]>([]);
  const [selectedEngine, setSelectedEngine] = useState<{ GID: string; LAT: number; LON: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Fetch engine list

  useEffect(() => {
    const fetchEngines = async () => {
      try {
        const res = await fetch("/api/engine/list");
        const data = await res.json();
        setEngines(data.engines || []);
      } catch (err) {
        console.error("Error fetching engine list:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEngines();
  }, []);

  // Fetch selected engine data
  useEffect(() => {
    if (!selectedSerial) return;
    async function fetchEngineData() {
      try {
        const res = await fetch(`/api/engine/${selectedSerial}/history`);
        const data = await res.json();
        if (data.records && data.records.length > 0) {
          const latest = data.records[data.records.length - 1];
          setValues(latest);
          setHistoryData(data.records);
        }
      } catch (err) {
        console.error("Error fetching engine data:", err);
      }
    }
    fetchEngineData();
    const interval = setInterval(fetchEngineData, 60000);
    return () => clearInterval(interval);
  }, [selectedSerial]);

  // ✅ Chart data formatted as [timestamp, value]
  const chartData = useMemo(() => {
    if (!historyData || historyData.length === 0) return null;

    const toMs = (t: string) => new Date(t).getTime();

    // Helper: safely format to 2 decimals
    const safeValue = (val: unknown): number => {
      if (typeof val === "number" && !isNaN(val)) {
        return Number(val.toFixed(2));
      }
      if (typeof val === "string") {
        const num = parseFloat(val);
        return !isNaN(num) ? Number(num.toFixed(2)) : 0;
      }
      return 0;
    };


    return {
      voltage: historyData.map(
        (r) => [toMs(r.timestamp), safeValue(r.batteryVoltage)] as [number, number]
      ),
      speed: historyData.map(
        (r) => [toMs(r.timestamp), safeValue(r.engineSpeed)] as [number, number]
      ),
      temperature: historyData.map(
        (r) => [toMs(r.timestamp), safeValue(r.engineTemp)] as [number, number]
      ),
      fuel: historyData.map(
        (r) => [toMs(r.timestamp), safeValue(r.fuelLevel)] as [number, number]
      ),
      frequency: historyData.map(
        (r) => [toMs(r.timestamp), safeValue(r.frequency)] as [number, number]
      ),
      // hoursRun: historyData.map(
      //   (r) => [toMs(r.timestamp), safeValue(r.hoursRun)] as [number, number]
      // ),
      fuelLevel: historyData.map(
        (r) => [toMs(r.timestamp), safeValue(r.fuelLevel)] as [number, number]
      ),

      lineVoltages: {
        VL12: historyData.map(
          (r) => [toMs(r.timestamp), safeValue(r.VL12)] as [number, number]
        ),
        VL23: historyData.map(
          (r) => [toMs(r.timestamp), safeValue(r.VL23)] as [number, number]
        ),
        VL31: historyData.map(
          (r) => [toMs(r.timestamp), safeValue(r.VL31)] as [number, number]
        ),
      },

      L1: {
        voltage: historyData.map(
          (r) => [toMs(r.timestamp), safeValue(r?.L1?.VLT)] as [number, number]
        ),
        current: historyData.map(
          (r) => [toMs(r.timestamp), safeValue(r?.L1?.CRT)] as [number, number]
        ),
        pf: historyData.map(
          (r) => [toMs(r.timestamp), safeValue(r?.L1?.PFR)] as [number, number]
        ),
        power: historyData.map(
          (r) => [toMs(r.timestamp), safeValue(r?.L1?.APP)] as [number, number]
        ),
      },

      L2: {
        voltage: historyData.map(
          (r) => [toMs(r.timestamp), safeValue(r?.L2?.VLT)] as [number, number]
        ),
        current: historyData.map(
          (r) => [toMs(r.timestamp), safeValue(r?.L2?.CRT)] as [number, number]
        ),
        pf: historyData.map(
          (r) => [toMs(r.timestamp), safeValue(r?.L2?.PFR)] as [number, number]
        ),
        power: historyData.map(
          (r) => [toMs(r.timestamp), safeValue(r?.L2?.APP)] as [number, number]
        ),
      },

      L3: {
        voltage: historyData.map(
          (r) => [toMs(r.timestamp), safeValue(r?.L3?.VLT)] as [number, number]
        ),
        current: historyData.map(
          (r) => [toMs(r.timestamp), safeValue(r?.L3?.CRT)] as [number, number]
        ),
        pf: historyData.map(
          (r) => [toMs(r.timestamp), safeValue(r?.L3?.PFR)] as [number, number]
        ),
        power: historyData.map(
          (r) => [toMs(r.timestamp), safeValue(r?.L3?.APP)] as [number, number]
        ),
      },
    };
  }, [historyData]);


  const total = engines.length;
  const offCount = engines.filter((e) => e.HTH === "000").length;
  const onCount = total - offCount;

  if (loading)
    return <div className="text-center text-gray-400 py-10">Loading data...</div>;

  // 🔹 Engine selection view
  if (!selectedSerial) {
    // const filtered = (engines || []).filter(
    //   (e) => e && typeof e.GID === "string" && e.GID.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    return (

      <div className="min-h-screen bg-slate-900 flex flex-col items-center text-white p-8">
        {/* Header */}
        {/* <div className="text-center mb-8"> */}
        {/* <h1 className="text-3xl font-bold mb-2">🔍 Select Engine Serial Number</h1> */}
        {/* <p className="text-slate-400 text-sm">
          Total Devices: <span className="text-green-400 font-semibold">{engines.length}</span>
        </p> */}
        {/* </div> */}
        {/* === Status Cards === */}
        <div className="flex flex-wrap justify-center gap-4 p-4">
          {/* Total Devices */}
          <div
            key="Total Devices"
            className="flex flex-col justify-between w-64 h-36 transform transition-transform hover:scale-105 hover:shadow-2xl duration-200 rounded-2xl bg-zinc-900 text-white shadow-md p-5 dark:bg-white/[0.03]"
          >
            <div className="flex items-center justify-between">
              <div className="text-4xl">🧰</div>
              <div className="text-2xl font-bold text-blue-400">{total}</div>
            </div>
            <div className="text-sm sm:text-base font-medium text-gray-300 text-center mt-3">
              Total DGs
            </div>
          </div>

          {/* Devices ON */}
          <div
            key="Devices ON"
            className="flex flex-col justify-between w-64 h-36 transform transition-transform hover:scale-105 hover:shadow-2xl duration-200 rounded-2xl bg-zinc-900 text-white shadow-md p-5 dark:bg-white/[0.03]"
          >
            <div className="flex items-center justify-between">
              <div className="text-4xl">🔌</div>
              <div className="text-2xl font-bold text-green-400">{onCount}</div>
            </div>
            <div className="text-sm sm:text-base font-medium text-gray-300 text-center mt-3">
              DGs ON
            </div>
          </div>

          {/* Devices OFF */}
          <div
            key="Devices OFF"
            className="flex flex-col justify-between w-64 h-36 transform transition-transform hover:scale-105 hover:shadow-2xl duration-200 rounded-2xl bg-zinc-900 text-white shadow-md p-5 dark:bg-white/[0.03]"
          >
            <div className="flex items-center justify-between">
              <div className="text-4xl">⛔</div>
              <div className="text-2xl font-bold text-red-400">{offCount}</div>
            </div>
            <div className="text-sm sm:text-base font-medium text-gray-300 text-center mt-3">
              DGs OFF
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full max-w-md mb-6">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Enter or select serial number..."
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;
              setSearchTerm(value);

              const matched = engines.find(
                (engine) => engine.GID.toLowerCase() === value.trim().toLowerCase()
              );

              if (matched) {
                setSelectedSerial(matched.GID);
                setSelectedEngine(matched);
                setErrorMsg(""); // clear any previous errors
              } else if (value.trim() !== "") {
                setErrorMsg(`No data available for serial number: ${value}`);
                setSelectedEngine(null);
              } else {
                setErrorMsg("");
              }
            }}
            list="engineSerials"
            className="p-3 pl-10 rounded-xl bg-slate-800 border border-slate-700 w-full text-white 
                    focus:ring-2 focus:ring-green-500 outline-none shadow-md"
          />
          <datalist id="engineSerials">
            {engines.map((engine) => (
              <option key={engine.GID} value={engine.GID} />
            ))}
          </datalist>
        </div>

        {/* ⚠️ No Data Message */}
        {errorMsg && (
          <p className="text-red-400 font-medium mb-4">
            ❌ {errorMsg}
          </p>
        )}

        {/* Map */}
        <div id="mapOne" className="w-full max-w-6xl h-[500px] overflow-hidden relative rounded-2xl border border-slate-700 shadow-lg">
          <Suspense fallback={<div className="text-center text-gray-500 py-20">Loading map...</div>}>
            <MapWithDg
              engineList={engines}
              selectedEngine={selectedEngine}
              onSelectEngine={(engine) => {
                setSelectedEngine(engine);
                setSelectedSerial(engine.GID);
                setErrorMsg(""); // clear error when user selects a valid marker
              }}
            />
          </Suspense>
        </div>
      </div>
    );
  }

  // 🔹 Dashboard view
  if (!values)
    return (
      <div className="flex items-center justify-center min-h-screen text-white text-xl">
        Loading engine data for {selectedSerial}...
      </div>
    );

  return (
    <div className="p-6 bg-slate-900 text-slate-200 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-white text-1xl font-bold">Serial Number — {selectedSerial}</h1>
        <button
          onClick={() => {
            setSelectedSerial(null);
            setValues(null);
            setHistoryData([]);
          }}
          className="px-4 py-2 bg-slate-700 text-sm rounded-md hover:bg-red-500 transition"
        >
          Change Serial
        </button>
      </div>

      {/* Gauges */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 p-6">
        <AnalogGauge title="Battery Voltage" value={values.batteryVoltage} min={0} max={60} unit="Vdc" />
        <AnalogGauge title="Fuel Level" value={values.fuelLevel} min={0} max={100} unit="%" />
        <AnalogGauge title="Engine Speed" value={values.engineSpeed} min={0} max={10000} unit="RPM" />
        <AnalogGauge title="Engine Temperature" value={values.engineTemp} min={-40} max={150} unit="°C" />
        <AnalogGauge title="Oil Pressure" value={values.engineOilPressure} min={0} max={25} unit="Bar" />
        <AnalogGauge title="Oil Temperature" value={values.engineOilTemperature} min={-40} max={150} unit="°C" />
      </div>

      {/* Summary + Generator Phase Metrics Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Engine Summary */}
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl flex flex-col gap-6">
          <h2 className="text-white font-semibold text-2xl mb-4 text-center">
            Engine Summary
          </h2>
          <div className="grid grid-cols-2 gap-5 text-base">
            {[
              ["Hours Run", `${values.hoursRun.toFixed(2)} H`],
              ["Frequency", `${values.frequency.toFixed(1)} Hz`],
              ["Last Updated", formatDateTime(values.timestamp)],
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

        {/* Generator Phase Metrics */}
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">
          <h2 className="text-white text-2xl font-semibold mb-8 text-center tracking-wide">
            Generator Phase Metrics (L1, L2, L3)
          </h2>

          {/* Table-like Layout */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="p-3 text-base font-semibold">Metric</th>
                  {["L1", "L2", "L3"].map((phase) => (
                    <th
                      key={`phase-header-${phase}`}
                      className="p-3 text-center text-base font-semibold text-green-400"
                    >
                      {phase}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {[
                  ["Power Factor", "PFR", "PF"],
                  ["Apparent Power", "APP", "kVA"],
                  ["Reactive Power", "RAP", "kVAR"],
                  ["Real Power", "RLP", "kW"],
                ].map(([label, key, unit]) => (
                  <tr
                    key={`metric-row-${key}`}
                    className="border-b border-slate-700 hover:bg-slate-900/50 transition"
                  >
                    <td className="p-3 text-slate-300 font-medium">{label}</td>
                    {["L1", "L2", "L3"].map((phase) => {
                      const phaseData = values[phase as keyof EngineRecord] as PhaseMetrics;
                      const val = phaseData?.[key as keyof PhaseMetrics] ?? 0;
                      return (
                        <td
                          key={`metric-${phase}-${key}`}
                          className="p-3 text-center text-white font-semibold"
                        >
                          {val.toFixed(2)} {unit}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-slate-700 mb-6 flex-wrap">
        {[
          { key: "overview", label: "Overview" },
          { key: "generator", label: "Generator L1–L3" },
          { key: "fuel", label: "Fuel & Runtime" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-2 px-4 text-sm font-medium rounded-t-md transition ${activeTab === tab.key
                ? "bg-slate-800 text-green-300 border-b-2 border-green-500"
                : "text-slate-400 hover:text-green-200"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Charts */}
      {activeTab === "overview" && chartData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ComponentCard title="Battery Voltage (Vdc)">
            <LineChartOne data={chartData.voltage} color="#3b82f6" yAxisTitle="Volts" />
          </ComponentCard>
          <ComponentCard title="Engine Speed (RPM)">
            <LineChartOne data={chartData.speed} color="#f59e0b" yAxisTitle="RPM" />
          </ComponentCard>
          <ComponentCard title="Engine Temperature (°C)">
            <LineChartOne data={chartData.temperature} color="#ef4444" yAxisTitle="°C" />
          </ComponentCard>
          <ComponentCard title="Fuel Level (%)">
            <LineChartOne data={chartData.fuel} color="#84cc16" yAxisTitle="%" />
          </ComponentCard>
        </div>
      )}

      {activeTab === "generator" && chartData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ComponentCard title="Line-to-Line Voltage Comparison (V)">
            <LineChartMultiSeries
              series={[
                { name: "L1–L2", data: chartData.lineVoltages.VL12.map(([x, y]) => ({ x, y })) },
                { name: "L2–L3", data: chartData.lineVoltages.VL23.map(([x, y]) => ({ x, y })) },
                { name: "L3–L1", data: chartData.lineVoltages.VL31.map(([x, y]) => ({ x, y })) },
              ]}
              colorPalette={["#3b82f6", "#10b981", "#f59e0b"]}
              yAxisTitle="Volts"
            />
          </ComponentCard>
          <ComponentCard title="Voltage (L1–L3)">
            <LineChartMultiSeries
              series={[
                { name: "L1 Voltage", data: chartData.L1.voltage.map(([x, y]) => ({ x, y })) },
                { name: "L2 Voltage", data: chartData.L2.voltage.map(([x, y]) => ({ x, y })) },
                { name: "L3 Voltage", data: chartData.L3.voltage.map(([x, y]) => ({ x, y })) },
              ]}
              colorPalette={["#22c55e", "#f59e0b", "#ef4444"]}
              yAxisTitle="Volts"
            />
          </ComponentCard>
          <ComponentCard title="Current (L1–L3)">
            <LineChartMultiSeries
              series={[
                { name: "L1 Current", data: chartData.L1.current.map(([x, y]) => ({ x, y })) },
                { name: "L2 Current", data: chartData.L2.current.map(([x, y]) => ({ x, y })) },
                { name: "L3 Current", data: chartData.L3.current.map(([x, y]) => ({ x, y })) },
              ]}
              colorPalette={["#06b6d4", "#a855f7", "#84cc16"]}
              yAxisTitle="Amps"
            />
          </ComponentCard>

          <ComponentCard title="Power Factor (PF)">
            <LineChartMultiSeries
              series={[
                { name: "L1 PF", data: chartData.L1.pf.map(([x, y]) => ({ x, y })) },
                { name: "L2 PF", data: chartData.L2.pf.map(([x, y]) => ({ x, y })) },
                { name: "L3 PF", data: chartData.L3.pf.map(([x, y]) => ({ x, y })) },
              ]}
              colorPalette={["#f59e0b", "#10b981", "#3b82f6"]}
              yAxisTitle="PF"
            />
          </ComponentCard>

          <ComponentCard title="Apparent Power (kVA)">
            <LineChartMultiSeries
              series={[
                { name: "L1 kVA", data: chartData.L1.power.map(([x, y]) => ({ x, y })) },
                { name: "L2 kVA", data: chartData.L2.power.map(([x, y]) => ({ x, y })) },
                { name: "L3 kVA", data: chartData.L3.power.map(([x, y]) => ({ x, y })) },
              ]}
              colorPalette={["#eab308", "#a855f7", "#ef4444"]}
              yAxisTitle="kVA"
            />
          </ComponentCard>
        </div>
      )}

      {activeTab === "fuel" && chartData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ComponentCard title="Engine Total Fuel Used (L)">
            <LineChartOne data={chartData.fuelLevel} color="#f59e0b" yAxisTitle="Liters" />
          </ComponentCard>
          {/* <ComponentCard title="Hours Run (H)">
            <LineChartOne data={chartData.hoursRun} color="#a855f7" yAxisTitle="Hours" />
          </ComponentCard> */}
          <ComponentCard title="Frequency (Hz)">
            <LineChartOne data={chartData.frequency} color="#22c55e" yAxisTitle="Hz" />
          </ComponentCard>
        </div>
      )}
    </div>
  );
}
