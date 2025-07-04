"use client";

import { useState } from "react";
import BarChartOne from "@/components/charts/bar/BarChartOne";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TwinApex from "@/components/ecommerce/TwinApex";
import LineChartOne from "@/components/charts/line/LineChartOne";

// ✅ Dummy API
const fetchMetrics = async (serial: string) => {
  console.log("✅ API called for:", serial);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (serial === "ABCTEST") {
        resolve([
          { name: "State of Charge", label: "SOC", value: 75.55, color: "#465FFF" },
          { name: "Pack Voltage", label: "Volts", value: 82.4, color: "#22C55E" },
          { name: "Pack Temperature", label: "°C", value: 64.1, color: "#F97316" },
          { name: "Pack Current", label: "Amperes", value: 48.3, color: "#06B6D4" },
          { name: "Motor Speed", label: "RPM", value: 92.7, color: "#8B5CF6" },
          { name: "Motor Temperature", label: "°C", value: 55.2, color: "#EF4444" },
        ]);
      } else {
        reject(new Error("Invalid serial number"));
      }
    }, 1000);
  });
};

export default function Page() {
  const [inputSerial, setInputSerial] = useState("");
  const [submittedSerial, setSubmittedSerial] = useState("");
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    const serial = inputSerial.trim();
    if (!serial) return;

    setLoading(true);
    setErrorMsg("");
    setMetrics([]);

    try {
      const data = await fetchMetrics(serial);
      setSubmittedSerial(serial); // ✅ Track successful serial
      setMetrics(data as any[]);
    } catch (err) {
      setSubmittedSerial(""); // Clear on invalid submit
      setErrorMsg("No data available for this serial number.");
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = (value: string) => {
    setInputSerial(value)
    setMetrics([]);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          value={inputSerial}
          onChange={(e) => handleOnChange(e.target.value)}
          placeholder="Enter Serial Number"
          className="px-3 py-2 border border-gray-300 rounded w-64 text-white bg-gray-800 placeholder-gray-400"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>

      {/* Feedback */}
      {loading && <p className="text-white">Loading data...</p>}
      {errorMsg && <p className="text-red-500">{errorMsg}</p>}

      {/* Charts */}
      {!loading && submittedSerial === "ABCTEST" && metrics.length > 0 && (
        <>
          <div className="grid grid-cols-12 gap-4">
            {metrics.map((metric, idx) => (
              <div key={idx} className="col-span-6 md:col-span-4 lg:col-span-2">
                <TwinApex {...metric} />
              </div>
            ))}
          </div>

          <PageBreadcrumb pageTitle="Charts Overview" />
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-6">
              <ComponentCard title="Line Chart">
                <LineChartOne />
              </ComponentCard>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <ComponentCard title="Bar Chart">
                <BarChartOne />
              </ComponentCard>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
