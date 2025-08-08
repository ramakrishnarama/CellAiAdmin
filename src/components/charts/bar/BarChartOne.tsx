"use client";

import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type BarChartProps = {
  data?: { x: number; y: number }[];
  color?: string;
  yAxisTitle?: string;
  height?: number;
};

export default function BarChartOne({
  data,
  color = "#22C55E",
  yAxisTitle = "Value",
  height = 300,
}: BarChartProps) {
  if (!data || data.length === 0) {
    return null;
  }

  // ✅ Prepare separate arrays for x-axis labels and values
  const categories = data.map((item) => {
    const date = new Date(item.x);
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
  });

  const seriesData = data.map((item) => item.y);

  const options: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height,
      zoom: { enabled: true },
      toolbar: { show: false },
    },
    colors: [color],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "category", // ✅ Use category for perfect alignment
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
      title: {
        text: yAxisTitle,
        style: {
          color: "#9CA3AF",
        },
      },
      labels: {
        style: {
          fontSize: "12px",
          colors: "#9CA3AF",
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}`,
      },
      x: {
        formatter: (_, { dataPointIndex }) => {
          return categories[dataPointIndex];
        },
      },
    },
    grid: {
      borderColor: "#374151",
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
  };

  const series = [
    {
      name: yAxisTitle,
      data: seriesData,
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <ReactApexChart options={options} series={series} type="bar" height={height} />
    </div>
  );
}
