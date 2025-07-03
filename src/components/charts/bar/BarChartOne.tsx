"use client";
import React, { useMemo } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Generate 10,000 time-series bar data points
function generateBarTimeSeriesData(count: number, startTime: number): [number, number][] {
  const data: [number, number][] = [];
  let currentTime = startTime;

  for (let i = 0; i < count; i++) {
    const value = Math.floor(Math.random() * 200) + 50; // Random value between 50 and 250
    data.push([currentTime, value]);
    currentTime += 60 * 60 * 1000; // 1 hour increment
  }

  return data;
}

export default function BarChartOne() {
  const barData = useMemo(() => generateBarTimeSeriesData(500, new Date().getTime()), []);

  const options: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 300,
      zoom: { enabled: true },
      toolbar: { show: true },
    },
    colors: ["#22C55E"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 3,
      },
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "datetime",
      labels: {
        rotate: -45,
        datetimeUTC: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy HH:mm",
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  };

  const series = [
    {
      name: "Metric",
      data: barData,
    },
  ];

  return (
    <div className="w-full">
      <ReactApexChart options={options} series={series} type="bar" height={300} />
    </div>
  );
}
