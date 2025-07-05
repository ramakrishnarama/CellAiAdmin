"use client";

import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type Series = {
  name: string;
  data: { x: number; y: number }[];
};

type MultiLineChartProps = {
  series: Series[];
  yAxisTitle?: string;
  colorPalette?: string[];
};

export default function LineChartMultiSeries({
  series,
  yAxisTitle = "Value",
  colorPalette,
}: MultiLineChartProps) {
  const defaultColors = [
    "#22C55E", "#06B6D4", "#F97316", "#8B5CF6", "#EF4444",
    "#EAB308", "#3B82F6", "#0EA5E9", "#EC4899", "#10B981",
    "#FACC15", "#6366F1", "#14B8A6"
  ];

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
        style: { colors: "#ccc" },
      },
      axisBorder: { show: true },
      axisTicks: { show: true },
    },
    yaxis: {
      title: {
        text: yAxisTitle,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    tooltip: {
      shared: true,
      x: {
        format: "dd MMM yyyy HH:mm",
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
    },
    colors: colorPalette ?? defaultColors,
    grid: {
      xaxis: {
        lines: { show: false },
      },
    },
  };

  return (
    <div className="w-full">
      <ReactApexChart options={options} series={series} type="line" height={300} />
    </div>
  );
}
