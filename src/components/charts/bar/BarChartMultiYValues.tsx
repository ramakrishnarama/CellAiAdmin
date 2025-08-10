"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type ValueSeries = {
  name: string;
  data: number[];
};

type RangeBarChartProps = {
  categories: string[];
  valuesPerCategory: ValueSeries[];
  yAxisTitle?: string;
  color: string[];
};

export default function BarChartMultiYValues({
  categories,
  valuesPerCategory,
  yAxisTitle = "Batteries",
  color = []
}: RangeBarChartProps) {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: true },
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "10px",
        colors: ["#fff"],
      },
      formatter: (val: number) => val.toString(),
    },
    xaxis: {
      categories,
      labels: {
        rotate: -45,
        style: {
          fontSize: "12px",
          colors: "#9CA3AF",
        },
      },
    },
    yaxis: {
      min: 0,
      title: {
        text: yAxisTitle,
        style: { color: "#9CA3AF" },
      },
      labels: {
        style: {
          fontSize: "12px",
          colors: "#9CA3AF",
        },
      },
    },
    legend: {
      position: "right",
    },
    grid: { borderColor: "#374151" },
    colors: color,
    responsive: [
      {
        breakpoint: 1024, // tablets
        options: {
          chart: { height: 300 },
          legend: { position: "bottom" },
        },
      },
      {
        breakpoint: 640, // mobile
        options: {
          chart: { height: 280 },
          xaxis: {
            labels: { rotate: -30, style: { fontSize: "10px" } },
          },
          legend: { position: "bottom", fontSize: "10px" },
        },
      },
    ],
  };

  return (
    <div className="w-full overflow-x-auto">
      <div style={{ minWidth: "400px" }}>
        <ReactApexChart
          options={options}
          series={valuesPerCategory}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
}
