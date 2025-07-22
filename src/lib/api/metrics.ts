import { apiRequest } from "./request";
import moment from "moment";

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
  serial
}: {
  startDate?: Date | null;
  endDate?: Date | null;
  serial?: string | null
} = {}): Promise<ExcelRow[]> {
  const res = await fetch(`/images/excel/${serial?.toUpperCase()}.json`);
  if (!res.ok) throw new Error("Failed to fetch JSON");

  const data: ExcelRow[] = await res.json();

  if (!startDate && !endDate) return data;

  // return data.filter((item) => {
  //   // Convert "DD-MM-YYYY" and "HH:mm:ss" into a valid ISO string
  //   const [day, month, year] = item.date.split("-");
  //   const isoString = `${year}-${month}-${day}T${item.time}`; // e.g. "2025-01-07T00:00:12"
  //   const itemDate = new Date(isoString).getTime();
  
  //   const start = startDate ? startDate.getTime() : -Infinity;
  //   const end = endDate ? endDate.getTime() : Infinity;
  
  //   return itemDate >= start && itemDate <= end;
  // });

return data.filter((item) => {
  let timestamp: number | null = null;

  // Try parsing with moment using multiple formats
  const dateTimeString = `${item.ISTserverTimeStamp}`;
  const parsed = moment(dateTimeString, "M/D/YY HH:mm", true); // `true` enables strict parsing     
  if (parsed.isValid()) {
    timestamp = parsed.valueOf();
  } else {
    return false; // skip invalid
  }

  const start = startDate ? startDate.getTime() : -Infinity;
  const end = endDate ? endDate.getTime() : Infinity;

  return timestamp >= start && timestamp <= end;
});

  
  // return data.filter((item) => {
  //   const itemDate = new Date(item._time).getTime();
  //   const start = startDate ? startDate.getTime() : -Infinity;
  //   const end = endDate ? endDate.getTime() : Infinity;
  //   return itemDate >= start && itemDate <= end;
  // });
}