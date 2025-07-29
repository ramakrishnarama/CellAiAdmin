"use client";

import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import moment from "moment-timezone"; // ✅ Import moment-timezone

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type LineChartOneProps = {
  data: [number, number][];
  color?: string;
  yAxisTitle?: string;
};

export default function LineChartOne({
  data,
  color = "#465fff",
  yAxisTitle = "Value",
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
        formatter: (value: string) =>
          moment(value).tz("Asia/Kolkata").format("DD/MM/YYYY HH:mm"), // ✅ IST format
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
        formatter: (value: number) =>
          moment(value).tz("Asia/Kolkata").format("DD/MM/YYYY HH:mm"), // ✅ IST in tooltip
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: [color],
  };

  const series = [
    {
      name: yAxisTitle || "Metric",
      data,
    },
  ];

  return (
    <div className="w-full">
      <ReactApexChart options={options} series={series} type="line" height={300} />
    </div>
  );
}
