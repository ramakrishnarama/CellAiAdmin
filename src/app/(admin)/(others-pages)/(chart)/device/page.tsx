"use client";

import { useState } from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { ExcelRow } from "@/types/excel";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TwinApex from "@/components/ecommerce/TwinApex";
import LineChartOne from "@/components/charts/line/LineChartOne";
import LineChartMultiSeries from "@/components/charts/line/LineChartMultiSeries";
import { getExcelSheet } from "@/lib/api/metrics";

type Metric = {
  name: string;
  label: string;
  value: number;
  color: string;
};

// interface DataItem {
//   ISTserverTimeStamp: string;
//   [key: string]: any;
// }

interface DataItem {
  ISTserverTimeStamp?: string;
  [key: string]: string | number | undefined;
}

// export interface ExcelRow {
//   ISTserverTimeStamp: string;
//   [key: string]: string | number | undefined;
// }

export default function Page() {
  const [inputSerial, setInputSerial] = useState("");
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [lineChartData, setLineChartData] = useState<[number, number][]>([]);
  const [currentData, setLineChartDataForCurrent] = useState<[number, number][]>([]);
  const [motorSpeedData, setMotorSpeedData] = useState<[number, number][]>([]);
  const [multiLineData, setMultiLineData] = useState<{ name: string; data: { x: number; y: number }[] }[]>([]);
  const [colorPalette, setColorPalette] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const toTimestamp = (item: DataItem): number => {
    const dateTimeString = item.ISTserverTimeStamp;
    const parsed = moment(dateTimeString, "M/D/YY HH:mm", true);
    return parsed.isValid() ? parsed.valueOf() : 0;
  };

  const extractSeries = (json: DataItem[], field: string) =>
    json
      .filter(item => item[field] !== undefined)
      .map(item => [
        toTimestamp(item),
        parseFloat(item[field]?.toString() ?? "0"),
      ] as [number, number])
      .slice(0, 2000);

  const handleSubmit = async () => {
    const serial = inputSerial.trim();
    if (!serial) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const json: DataItem[] = await getExcelSheet({ startDate, endDate, serial });

      if (!json || json.length === 0) throw new Error("No data");

      const filteredDataVoltage = extractSeries(json, "batVolt");
      const filteredDataCurrent = extractSeries(json, "batCurrent");
      const motorSpeed = extractSeries(json, "speed");

      const cellVoltageSeriesMap: Record<string, { x: number; y: number }[]> = {};
      for (let i = 1; i <= 16; i++) {
        const field = `cell${i}Volt`;
        const series = json
          .filter(item => item[field] !== undefined)
          .map(item => ({
            x: toTimestamp(item),
            y: parseFloat(item[field]?.toString() ?? "0"),
          }))
          .slice(0, 2000);
        if (series.length > 0) {
          cellVoltageSeriesMap[field] = series;
        }
      }

      const limitedSeriesMap = Object.entries(cellVoltageSeriesMap).map(([field, data]) => ({
        name: field,
        data,
      }));

      const colors = [
        "#22C55E", "#06B6D4", "#F97316", "#8B5CF6", "#EF4444", "#EAB308", "#3B82F6", "#0EA5E9",
        "#EC4899", "#10B981", "#FACC15", "#6366F1", "#14B8A6", "#4ADE80", "#FB923C", "#F472B6"
      ].slice(0, limitedSeriesMap.length);

      // setMetrics([
      //   { name: "State of Charge", label: "SOC", value: json[0].socPercent, color: "#465FFF" },
      //   { name: "Pack Voltage", label: "Volts", value: json[0].batVolt, color: "#22C55E" },
      //   { name: "Pack Temperature", label: "°C", value: json[0].batTemp, color: "#F97316" },
      //   { name: "Pack Current", label: "Amperes", value: json[0].batCurrent, color: "#06B6D4" },

      // ]);
      setMetrics([
        {
          name: "State of Charge",
          label: "SOC",
          value: Number(json[0].socPercent ?? 0),
          color: "#465FFF",
        },
        {
          name: "Pack Voltage",
          label: "Volts",
          value: Number(json[0].batVolt ?? 0),
          color: "#22C55E",
        },
        {
          name: "Pack Temperature",
          label: "°C",
          value: Number(json[0].batTemp ?? 0),
          color: "#F97316",
        },
        {
          name: "Pack Current",
          label: "Amperes",
          value: Number(json[0].batCurrent ?? 0),
          color: "#06B6D4",
        },
        { name: "Motor Speed", label: "kmph", value: Number(json[0].speedt ?? 0), color: "#8B5CF6" },
        { name: "Max Cell Temp", label: "°C", value: Number(json[0].batTemp?? 0), color: "#EF4444" },
        { name: "Odometer", label: "km", value: Number(json[0].odo?? 0), color: "#F97316" },
        { name: "Discharge Cycle", label: "count", value: Number(json[0].dischargeCycle?? 0), color: "#EAB308" },
      ]);
      

      setLineChartData(filteredDataVoltage);
      setLineChartDataForCurrent(filteredDataCurrent);
      setMotorSpeedData(motorSpeed);
      setMultiLineData(limitedSeriesMap);
      setColorPalette(colors);
    } catch (err) {
      console.error(err);
      setMetrics([]);
      setLineChartData([]);
      setLineChartDataForCurrent([]);
      setMotorSpeedData([]);
      setMultiLineData([]);
      setColorPalette([]);
      setErrorMsg("No data available for this serial number.");
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = (value: string) => {
    setInputSerial(value);
    setMetrics([]);
    setLineChartData([]);
    setLineChartDataForCurrent([]);
    setMotorSpeedData([]);
    setMultiLineData([]);
    setColorPalette([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <input
          type="text"
          value={inputSerial}
          onChange={(e) => handleOnChange(e.target.value)}
          placeholder="Enter Serial Number"
          className="px-3 py-2 border border-gray-300 rounded text-white bg-gray-800 placeholder-gray-400 w-full md:w-64"
        />

        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          placeholderText="Start Date"
          className="px-3 py-2 border border-gray-300 rounded text-white bg-gray-800 placeholder-gray-400 w-full md:w-auto"
          dateFormat="yyyy-MM-dd"
        />

        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          placeholderText="End Date"
          className="px-3 py-2 border border-gray-300 rounded text-white bg-gray-800 placeholder-gray-400 w-full md:w-auto"
          dateFormat="yyyy-MM-dd"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full md:w-auto"
        >
          Submit
        </button>
      </div>

      {loading && <p className="text-white">Loading data...</p>}
      {errorMsg && <p className="text-red-200">{errorMsg}</p>}

      {!loading && metrics.length > 0 && (
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
              <ComponentCard title="Speed">
                <LineChartOne data={motorSpeedData} color="#6366F1" yAxisTitle="Speed" />
              </ComponentCard>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
