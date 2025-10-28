// "use client";

// import React from "react";
// import dynamic from "next/dynamic";
// const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// interface GaugeProps {
// title: string;
// value: number;
// min: number;
// max: number;
// unit?: string;
// color?: string;
// }

// export default function AnalogGauge({
// title,
// value,
// min,
// max,
// unit = "",
// color = "#22c55e",
// }: GaugeProps) {
// const percentage = ((value - min) / (max - min)) * 100;

// const options: ApexCharts.ApexOptions = {
// chart: {
// type: "radialBar",
// height: 280,
// sparkline: { enabled: false },
// animations: { enabled: true, dynamicAnimation: { speed: 800 } },
// foreColor: "#cbd5e1",
// },
// plotOptions: {
// radialBar: {
// startAngle: -140,
// endAngle: 140,
// hollow: {
// margin: 0,
// size: "65%",
// background: "#0f172a",
// dropShadow: { enabled: true, top: 2, blur: 3, opacity: 0.3 },
// },
// track: {
// background: "#1e293b",
// strokeWidth: "97%",
// },
// dataLabels: {
// name: {
// show: true,
// color: "#a3e635",
// fontSize: "14px",
// offsetY: 20,
// },
// value: {
// show: true,
// fontSize: "24px",
// fontWeight: 600,
// offsetY: -10,
// formatter: () => `${value.toFixed(1)} ${unit}`,
// },
// },
// },
// },
// fill: {
// type: "gradient",
// gradient: {
// shade: "dark",
// type: "horizontal",
// gradientToColors: [color],
// stops: [0, 100],
// },
// },
// stroke: { dashArray: 0 },
// labels: [title],
// annotations: {
// points: [
// {
// x: percentage,
// marker: {
// size: 6,
// fillColor: color,
// strokeColor: "#fff",
// strokeWidth: 1,
// shape: "circle",
// },
// label: {
// borderColor: color,
// offsetY: -10,
// style: { background: "#0f172a", color: color },
// text: "Needle",
// },
// },
// ],
// },
// };

// const series = [percentage];

// return ( <div className="bg-green-900/40 border border-green-700 rounded-xl p-4 flex flex-col items-center"> <Chart options={options} series={series} type="radialBar" height={280} /> <div className="text-xs text-green-300 mt-1">
// Range: {min} → {max} {unit} </div> </div>
// );
// }


"use client";

import React from "react";
import GaugeComponent from "react-gauge-component";

interface GaugeProps {
  title: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  color?: string;
}

export default function AnalogGauge({
  title,
  value,
  min,
  max,
  unit = "",
  color = "#22c55e",
}: GaugeProps) {
  return (
    <div className="border border-blue-700 rounded-xl p-4 flex flex-col items-center text-green-200">
      <h3 className="text-green-400 text-sm font-semibold mb-2">{title}</h3>

      <GaugeComponent
        type="semicircle"
        arc={{
          width: 0.3,
          padding: 0.02,
          cornerRadius: 3,
          subArcs: [
            { limit: max * 0.2, color: "#ef4444" }, // red
            { limit: max * 0.5, color: "#facc15" }, // yellow
            { limit: max, color: color }, // main color
          ],
        }}
        pointer={{
          color: color,
          length: 0.8,
          width: 6,
          elastic: true,
        }}
        labels={{
          valueLabel: {
            formatTextValue: (v) => `${v.toFixed(1)} ${unit}`,
            style: { fill: "#a3e635", fontSize: "20px", fontWeight: 600 },
          },
          tickLabels: {
            type: "outer",
            defaultTickValueConfig: {
              formatTextValue: (v) => `${Math.round(v)}`,
              style: { fill: "#94a3b8", fontSize: "10px" },
            },
            ticks: [
              { value: min },
              { value: min + (max - min) * 0.2 },
              { value: min + (max - min) * 0.4 },
              { value: min + (max - min) * 0.6 },
              { value: min + (max - min) * 0.8 },
              { value: max },
            ],
          },
        }}
        value={value}
        minValue={min}
        maxValue={max}
        style={{ width: "90%", height: "180px" }}
      />

      <div className="text-xs text-green-300 mt-2">
        Range: {min} → {max} {unit}
      </div>
    </div>
  );
}
