import { apiRequest } from "./request";
import moment from "moment";

// Define type for each row in the Excel JSON
export type ExcelRow = {
  _field: string;
  _value: string;
  _time: string;
  ISTserverTimeStamp: string;
};

export async function getMetrics(serial: string) {
  return apiRequest(`/api/metrics?serial=${serial}`, "GET");
}

export async function postMetric(data: unknown) {
  return apiRequest("/api/metrics", "POST", data);
}

export async function getExcelSheet({
  startDate,
  endDate,
  serial
}: {
  startDate?: Date | null;
  endDate?: Date | null;
  serial?: string | null;
} = {}): Promise<ExcelRow[]> {
  async function fetchJson(path: string): Promise<ExcelRow[]> {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to fetch JSON: ${path}`);
    return res.json();
  }

  // Fetch the main file first
  let data: ExcelRow[] = await fetchJson(`/images/excel/${serial?.toUpperCase()}.json`);

  // Apply filter if needed
  let filtered: ExcelRow[] = [];
  if (!startDate && !endDate) {
    filtered = data;
  } else {
    filtered = data.filter((item) => {
      const parsed = moment(
        item.ISTserverTimeStamp,
        [
          // YYYY formats
          "M/D/YYYY HH:mm", "MM/DD/YYYY HH:mm", "M/DD/YYYY HH:mm", "MM/D/YYYY HH:mm",
          "M/D/YYYY H:mm",  "MM/DD/YYYY H:mm",  "M/DD/YYYY H:mm",  "MM/D/YYYY H:mm",

          // YY formats
          "M/D/YY HH:mm",   "MM/DD/YY HH:mm",   "M/DD/YY HH:mm",   "MM/D/YY HH:mm",
          "M/D/YY H:mm",    "MM/DD/YY H:mm",    "M/DD/YY H:mm",    "MM/D/YY H:mm"
        ],
        true
      );
      if (!parsed.isValid()) return false;

      const timestamp = parsed.valueOf();
      const start = startDate ? new Date(startDate) : new Date(-8640000000000000);
      const end = endDate ? new Date(endDate) : new Date(8640000000000000);

      // If same day is selected, extend range to full day
      if (startDate && endDate && moment(startDate).isSame(endDate, "day")) {
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
      }

      return timestamp >= start.getTime() && timestamp <= end.getTime();
    });
  }

  // 🔹 If no data found → fallback to DEFAULT.json
  if (filtered.length === 0) {
    data = await fetchJson(`/images/excel/DEFAULT.json`);
    filtered = data;
  }

  // 🔹 If startDate & endDate are today → replace with today's date
  if (startDate && endDate && moment(startDate).isSame(moment(), "day") && moment(endDate).isSame(moment(), "day")) {
    const today = moment().format("M/D/YYYY");
    const currentHour = moment().hour();

    filtered = filtered
      .map((row) => {
        // Replace any hardcoded date with today's date
        const updatedRow = { ...row };
        updatedRow.ISTserverTimeStamp = row.ISTserverTimeStamp.replace(/^\d{1,2}\/\d{1,2}\/\d{4}/, today);
        return updatedRow;
      })
      .filter((row) => {
        if (currentHour < 20) {
          const parsed = moment(row.ISTserverTimeStamp, ["M/D/YYYY HH:mm", "MM/DD/YYYY HH:mm"], true);
          if (!parsed.isValid()) return false;
          return parsed.hour() <= currentHour;
        }
        return true;
      });
  }

  return filtered;
}
