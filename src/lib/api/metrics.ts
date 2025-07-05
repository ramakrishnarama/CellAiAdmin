import { apiRequest } from "./request";

// Define a proper interface for the expected response
interface Metric {
  id: string;
  value: number;
  timestamp: string;
  [key: string]: unknown; // Optional: in case the shape is not fixed
}

// Define a type for posting metric data
interface MetricPayload {
  [key: string]: unknown;
}

// Get metrics data (returns `Metric[]`)
export async function getMetrics(serial: string): Promise<Metric[]> {
  return apiRequest(`/api/metrics?serial=${serial}`, "GET");
}

// Post metric (accepts a known structure)
export async function postMetric(data: MetricPayload): Promise<void> {
  await apiRequest("/api/metrics", "POST", data);
}

// Define Excel row type
export interface ExcelData {
  time: string;
  [key: string]: number | string; // Extend based on actual keys (e.g., cell_0_voltage, ntc_1, etc.)
}

// Get data from excel sheet
export async function getExcelSheet(): Promise<ExcelData[]> {
  const res = await fetch("/images/excel/data.json");
  if (!res.ok) throw new Error("Failed to fetch JSON");
  return await res.json();
}
