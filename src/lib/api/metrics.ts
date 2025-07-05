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
// export async function getExcelSheet(): Promise<ExcelRow[]> {
//   const res = await fetch("/images/excel/data.json");
//   if (!res.ok) throw new Error("Failed to fetch JSON");
//   return await res.json();
// }

export async function getExcelSheet({
  startDate,
  endDate,
  live
}: {
  startDate?: Date | null;
  endDate?: Date | null;
  live?: Boolean | null;
} = {}): Promise<ExcelRow[]> {
  const res = await fetch("/images/excel/data.json");
  if (!res.ok) throw new Error("Failed to fetch JSON");

  const data: ExcelRow[] = await res.json();

  if (!startDate && !endDate) return data;

  return data.filter((item) => {
    const itemDate = new Date(item._time).getTime();
    const start = startDate ? startDate.getTime() : -Infinity;
    const end = endDate ? endDate.getTime() : Infinity;
    return itemDate >= start && itemDate <= end;
  });
}