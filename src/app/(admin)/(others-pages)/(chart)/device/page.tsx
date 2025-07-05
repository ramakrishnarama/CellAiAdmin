"use client";

import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TwinApex from "@/components/ecommerce/TwinApex";
import LineChartOne from "@/components/charts/line/LineChartOne";
import LineChartMultiSeries from "@/components/charts/line/LineChartMultiSeries";
import { getExcelSheet } from "@/lib/api/metrics";
import DatePicker from "react-datepicker"; // install via: npm i react-datepicker
import "react-datepicker/dist/react-datepicker.css";

type Metric = {
  name: string;
  label: string;
  value: number;
  color: string;
};

export default function Page() {
  const [inputSerial, setInputSerial] = useState("");
  const [submittedSerial, setSubmittedSerial] = useState("");
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [lineChartData, setLineChartData] = useState<[number, number][]>([]);
  const [currentData, setLineChartDataForCurrent] = useState<[number, number][]>([]);
  const [motorSpeedData, setMotorSpeedData] = useState<[number, number][]>([]);
  const [multiLineData, setMultiLineData] = useState<{ name: string; data: { x: number; y: number }[] }[]>([]);
  const [colorPalette, setColorPalette] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [ntcSeriesData, setNtcSeriesData] = useState<{ name: string; data: { x: number; y: number }[] }[]>([]);
  const [ntcColors, setNtcColors] = useState<string[]>([]);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [liveMode, setLiveMode] = useState<boolean>(false);

  const handleSubmit = async () => {
    const serial = inputSerial.trim();
    if (!serial) return;

    setLoading(true);
    setErrorMsg("");

    try {
      // const json = await getExcelSheet();
      // In your handleSubmit:
      const json = await getExcelSheet({ startDate, endDate, live: liveMode });

      if(!json || json.length == 0){
        throw new Error("No data");
      }
      const parseData = (field: string): [number, number][] =>
        json
          .filter(item => item._field === field && item._time && item._value)
          .map(item => [new Date(item._time).getTime(), parseFloat(item._value)] as [number, number])
          .slice(0, 2000);

      const filteredDataVoltage = parseData("bms_voltage");
      const filteredDataCurrent = parseData("bms_current");
      const motorSpeed = parseData("motor_speed");

      const cellVoltageSeriesMap: Record<string, [number, number][]> = {};
      json.forEach(item => {
        if (/^cell_\d+_voltage$/.test(item._field) && item._time && item._value) {
          const timestamp = new Date(item._time).getTime();
          const value = parseFloat(item._value);
          if (!cellVoltageSeriesMap[item._field]) cellVoltageSeriesMap[item._field] = [];
          cellVoltageSeriesMap[item._field].push([timestamp, value]);
        }
      });

      const limitedSeriesMap = Object.entries(cellVoltageSeriesMap).map(([field, data]) => ({
        name: field,
        data: data.slice(0, 2000).map(([x, y]) => ({ x, y })),
      }));

      const colors = [
        "#22C55E", "#06B6D4", "#F97316", "#8B5CF6", "#EF4444", "#EAB308", "#3B82F6", "#0EA5E9",
        "#EC4899", "#10B981", "#FACC15", "#6366F1", "#14B8A6", "#4ADE80", "#FB923C"
      ].slice(0, limitedSeriesMap.length);

      const ntcSeriesMap: Record<string, [number, number][]> = {};
      json.forEach(item => {
        if (/^ntc_\d+$/.test(item._field) && item._time && item._value) {
          const timestamp = new Date(item._time).getTime();
          const value = parseFloat(item._value);
          if (!ntcSeriesMap[item._field]) ntcSeriesMap[item._field] = [];
          ntcSeriesMap[item._field].push([timestamp, value]);
        }
      });

      const limitedNtcSeries = Object.entries(ntcSeriesMap).map(([field, data]) => ({
        name: field,
        data: data.slice(0, 2000).map(([x, y]) => ({ x, y })),
      }));

      const ntcColorList = [
        "#F87171", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA", "#F472B6", "#FCD34D", "#4ADE80"
      ].slice(0, limitedNtcSeries.length);

      if (serial === "ABCTEST") {
        setSubmittedSerial(serial);
        setMetrics([
          { name: "State of Charge", label: "SOC", value: 75.55, color: "#465FFF" },
          { name: "Pack Voltage", label: "Volts", value: 82.4, color: "#22C55E" },
          { name: "Pack Temperature", label: "°C", value: 64.1, color: "#F97316" },
          { name: "Pack Current", label: "Amperes", value: 48.3, color: "#06B6D4" },
          { name: "Motor Speed", label: "RPM", value: 92.7, color: "#8B5CF6" },
          { name: "Motor Temperature", label: "°C", value: 55.2, color: "#EF4444" },
        ]);
        setLineChartData(filteredDataVoltage);
        setLineChartDataForCurrent(filteredDataCurrent);
        setMotorSpeedData(motorSpeed);
        setMultiLineData(limitedSeriesMap);
        setColorPalette(colors);
        setNtcSeriesData(limitedNtcSeries);
        setNtcColors(ntcColorList);
      } else {
        throw new Error("Invalid serial number");
      }
    } catch (err) {
      console.error(err);
      setSubmittedSerial("");
      setMetrics([]);
      setLineChartData([]);
      setMotorSpeedData([]);
      setMultiLineData([]);
      setColorPalette([]);
      setNtcSeriesData([]);
      setNtcColors([]);
      setErrorMsg("No data available for this serial number.");
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = (value: string) => {
    setInputSerial(value);
    setMetrics([]);
    setLineChartData([]);
    setMotorSpeedData([]);
    setMultiLineData([]);
    setColorPalette([]);
    setNtcSeriesData([]);
    setNtcColors([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">        
      <input
          type="text"
          value={inputSerial}
          onChange={(e) => handleOnChange(e.target.value)}
          placeholder="Enter Serial Number"
          className="px-3 py-2 border border-gray-300 rounded text-white bg-gray-800 placeholder-gray-400 w-64"
        />

        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          placeholderText="Start Date"
          className="px-3 py-2 border border-gray-300 rounded text-white bg-gray-800 placeholder-gray-400"
          dateFormat="yyyy-MM-dd"
        />

        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          placeholderText="End Date"
          className="px-3 py-2 border border-gray-300 rounded text-white bg-gray-800 placeholder-gray-400"
          dateFormat="yyyy-MM-dd"
        />

        <label className="flex items-center gap-2 text-white">
          <input
            type="checkbox"
            checked={liveMode}
            onChange={() => setLiveMode(!liveMode)}
          />
          Live Sync
        </label>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>

      {loading && <p className="text-white">Loading data...</p>}
      {errorMsg && <p className="text-red-200">{errorMsg}</p>}

      {!loading && submittedSerial === "ABCTEST" && metrics.length > 0 && (
        <>
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

          <PageBreadcrumb pageTitle="Charts Overview" />

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-6">
              <ComponentCard title="Pack Voltage">
                <LineChartOne data={lineChartData} color="#465fff" yAxisTitle="Volts" />
              </ComponentCard>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <ComponentCard title="Pack Current">
                <LineChartOne data={currentData} color="#22C55E" yAxisTitle="Ampere" />
              </ComponentCard>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-6">
              <ComponentCard title="Cell Voltages">
                <LineChartMultiSeries
                  series={multiLineData}
                  colorPalette={colorPalette}
                  yAxisTitle="Volts"
                />
              </ComponentCard>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <ComponentCard title="Temperature Sensors">
                <LineChartMultiSeries
                  series={ntcSeriesData}
                  colorPalette={ntcColors}
                  yAxisTitle="°Celsius"
                />
              </ComponentCard>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-6">
              <ComponentCard title="RPM">
                <LineChartOne data={motorSpeedData} color="#6366F1" yAxisTitle="Volts" />
              </ComponentCard>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <ComponentCard title="Pack Current">
                <LineChartOne data={currentData} color="#FB923C" yAxisTitle="Ampere" />
              </ComponentCard>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
