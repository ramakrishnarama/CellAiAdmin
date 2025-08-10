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
      height: 350,
      toolbar: { show: true },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 4,
      },
    },
    xaxis: {
      categories,
      labels: {
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
    colors: color,
    grid: { borderColor: "#374151" },
  };

  return (
    <div className="w-full overflow-x-auto">
      <ReactApexChart
        options={options}
        series={valuesPerCategory}
        type="bar"
        height={350}
      />
    </div>
  );
}
