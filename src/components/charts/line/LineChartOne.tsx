"use client";
import React, { useMemo } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Generate 10,000 time-series points
function generateTimeSeriesData(count: number, startDate: number): [number, number][] {
  const data: [number, number][] = [];
  let currentTime = startDate;

  for (let i = 0; i < count; i++) {
    const value = Math.floor(Math.random() * 100) + 50; // Random value between 50–150
    data.push([currentTime, value]);
    currentTime += 60 * 1000; // increment by 1 minute
  }

  return data;
}

export default function LineChartOne() {
  const timeSeries = useMemo(() => generateTimeSeriesData(500, new Date().getTime()), []);

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 300,
      zoom: { enabled: true },
      toolbar: { show: true },
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeUTC: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy HH:mm",
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#465fff"],
  };

  const series = [
    {
      name: "Random Metric",
      data: timeSeries,
    },
  ];

  return (
    <div className="w-full">
      <ReactApexChart options={options} series={series} type="line" height={300} />
    </div>
  );
}
