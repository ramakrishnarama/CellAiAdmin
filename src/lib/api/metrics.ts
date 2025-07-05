import { apiRequest } from "./request";

// Define type for each row in the Excel JSON
export type ExcelRow = {
  _field: string;
  _value: string;
  _time: string;
};

export async function getMetrics(serial: string) {
  return apiRequest(`/api/metrics?serial=${serial}`, "GET");
}

export async function postMetric(data: unknown) {
  return apiRequest("/api/metrics", "POST", data);
}

// Fetch Excel sheet JSON with proper typing
export async function getExcelSheet(): Promise<ExcelRow[]> {
  const res = await fetch("/images/excel/data.json");
  if (!res.ok) throw new Error("Failed to fetch JSON");
  return await res.json();
}
