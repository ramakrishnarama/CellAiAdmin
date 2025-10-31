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
}

export default function AnalogGauge({
title,
value,
min,
max,
unit = "",
}: GaugeProps) {
const safeLimit = (limit: number) => Math.min(Math.max(limit, min), max);

return ( <div className="border border-blue-700 rounded-xl p-5 flex flex-col items-center text-green-200 bg-slate-900 shadow-lg"> 
<h2 className="text-lg font-bold mb-3 tracking-wide text-center">{title} </h2>

  <GaugeComponent
    id={`gauge-${title.replace(/\s+/g, "-").toLowerCase()}`}
    type="semicircle"
    arc={{
      gradient: true,
      width: 0.18,
      padding: 0,
      subArcs: [
        { limit: safeLimit(min + (max - min) * 0.2), color: "#EA4228", showTick: true },
        { limit: safeLimit(min + (max - min) * 0.4), color: "#F5CD19", showTick: true },
        { limit: safeLimit(min + (max - min) * 0.6), color: "#5BE12C", showTick: true },
        { limit: safeLimit(min + (max - min) * 0.8), color: "#F5CD19", showTick: true },
        { color: "#EA4228" },
      ],
    }}
    pointer={{
      type: "arrow",
      elastic: true,
      color: "#22c55e",
      width: 8,
      animationDelay: 0,
    }}
    value={value}
    minValue={min}
    maxValue={max}
    labels={{
      valueLabel: {
        formatTextValue: (v) => `${v.toFixed(0)} ${unit}`,
        style: { fill: "#f8f9f6ff", fontSize: "30px", fontWeight: 700 },
      },
      tickLabels: {
        type: "outer",
        defaultTickValueConfig: {
          formatTextValue: (v) => `${Math.round(v)}`,
          style: { fill: "#9ca3af", fontSize: "15px" },
        },
      },
    }}
    style={{ width: "100%", height: "220px" }}
  />

  {/* <div className="text-sm text-green-300 mt-3 font-medium">
    Range: {min} → {max} {unit}
  </div> */}
</div>


);
}
