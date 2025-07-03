"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type Props = {
  label: string;
  value: number;
  color: string;
  name: string;
};

export default function TwinApex({name, label, value, color }: Props) {
  const options: ApexOptions = {
    colors: [color],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 300,
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -95,
        endAngle: 95,
        hollow: {
          size: "50%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "18px",
            fontWeight: "600",
            offsetY: 10,
            color: color,
            formatter: (val) => `${val}%`,
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: [color],
    },
    stroke: {
      lineCap: "round",
    },
    labels: [label],
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-5">
        <div className="">
        <h4 className="text-base font-semibold text-center dark:text-white/70">
          {name}
        </h4>
        </div>
      <ReactApexChart
        options={options}
        series={[value]}
        type="radialBar"
        height={300}
      />
      <div className="text-center mt-2 text-sm font-medium text-gray-700 dark:text-white">
        {label}
      </div>
    </div>
  );
}
