"use client";

import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type LineChartOneProps = {
  data: [number, number][];
  color?: string;
  yAxisTitle?: string; // <- new prop
};

export default function LineChartOne({
  data,
  color = "#465fff",
  yAxisTitle = "Value", // <- default label
}: LineChartOneProps) {
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
      x: {
        format: "dd MMM yyyy HH:mm",
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: [color],
  };

  const series = [
    {
      name: yAxisTitle || "Metric", // Label for legend & tooltip
      data,
    },
  ];

  return (
    <div className="w-full">
      <ReactApexChart options={options} series={series} type="line" height={300} />
    </div>
  );
}
