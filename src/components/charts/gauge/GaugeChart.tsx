"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type GaugeChartProps = {
  title: string;
  value: number | string;
  unit?: string;
  min?: number;
  max?: number;
  thresholds?: { min: number; max: number };
  height?: number;
};

export default function GaugeChart({
  title,
  value,
  unit = "",
  min = 0,
  max = 100,
  thresholds = { min: 30, max: 70 },
  height = 140,
}: GaugeChartProps) {
  // Determine bar color based on thresholds
  let barColor = "#22C55E"; // default green

  // Handle numeric values only for thresholds
  if (typeof value === "number") {
    if (value < thresholds.min) barColor = "#F87171"; // red if below min
    else if (value > thresholds.max) barColor = "#F87171"; // red if above max
  } else if (title.toLowerCase().includes("irrigation")) {
    // irrigation on/off color
    barColor = value === "On" ? "#22C55E" : "#F87171";
  }

  const options: ApexOptions = {
    chart: {
      type: "radialBar",
      offsetY: 0,
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        track: {
          background: "#16653430",
          strokeWidth: "97%",
          margin: 5,
        },
        dataLabels: {
          name: { show: false },
          value: {
            show: true,
            fontSize: "22px",
            fontWeight: 700,
            color: barColor,
            offsetY: 0,
            formatter: () => {
              // For irrigation, display "On/Off" instead of numeric
              if (title.toLowerCase().includes("irrigation") && typeof value === "string") {
                return value;
              }
              return `${value}${unit}`;
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: [barColor],
    },
    stroke: { lineCap: "round" },
  };

  // numeric series for gauge chart, default 0 if value is non-numeric
  const series =
    typeof value === "number" ? [((value - min) / (max - min)) * 100] : [100];

  return (
    <div className="bg-green-900/30 border border-green-700 rounded-lg p-5 text-green-100 shadow-md flex flex-col items-center justify-center">
      <ReactApexChart
        options={options}
        series={series}
        type="radialBar"
        height={height}
      />
      <div className="mt-2 text-center text-green-300 font-semibold text-sm">
        {title}
      </div>
    </div>
  );
}
