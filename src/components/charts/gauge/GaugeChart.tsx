"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type GaugeChartProps = {
  title: string;
  value: number;
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
  const barColor =
    value < thresholds.min
      ? "#F87171" // red if below min
      : value > thresholds.max
      ? "#F87171" // red if above max
      : "#22C55E"; // green if optimal

  const options: ApexOptions = {
    chart: {
      type: "radialBar",
      offsetY: 0, // reset offset
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        track: {
          background: "#16653430", // translucent green like the card
          strokeWidth: "97%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false, // hide default name inside chart
          },
          value: {
            show: true,
            fontSize: "22px",
            fontWeight: 700,
            color: barColor,
            offsetY: 0, // center vertically
            formatter: () => `${value}${unit}`,
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: [barColor],
    },
    stroke: {
      lineCap: "round",
    },
  };

  const series = [((value - min) / (max - min)) * 100];

  return (
    <div className="bg-green-900/30 border border-green-700 rounded-lg p-5 text-green-100 shadow-md flex flex-col items-center justify-center">
      <ReactApexChart options={options} series={series} type="radialBar" height={height} />
      <div className="mt-2 text-center text-green-300 font-semibold text-sm">
        {title}
      </div>
    </div>
  );
}
