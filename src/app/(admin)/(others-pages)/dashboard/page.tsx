import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
// import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
// import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
// import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import AuthGuard from "@/components/auth/AuthGuard";

export const metadata: Metadata = {
  title: "Solutions | Cell AI Battery Intelligence",
  description:
    "Explore Cell AI's solutions for EV battery management, SOC/SOH estimation, digital twin, and IoT battery analytics.",
};

export default function Ecommerce() {
  return (
    <AuthGuard>
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <EcommerceMetrics />

        {/* <MonthlySalesChart /> */}
      </div>
      {/* 
      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div> */}

      <div className="col-span-12 xl:col-span-8">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-4">
        <RecentOrders />
      </div>
    </div>
    </AuthGuard>
  );
}
