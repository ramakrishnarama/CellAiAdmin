import { apiRequest } from "./request";
import moment from "moment";

// Define type for each row in the Excel JSON
export type ExcelRow = {
  _field: string;
  _value: string;
  _time: string;
  ISTserverTimeStamp: string; // 👈 Add this line
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
    // const dateTimeString = item.ISTserverTimeStamp;
  
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
  
    const start = startDate ? new Date(startDate) : new Date(-8640000000000000); // minimum date
    const end = endDate ? new Date(endDate) : new Date(8640000000000000); // maximum date
  
    // If same day is selected, extend range to full day: 00:00:00 - 23:59:59.999
    if (
      startDate &&
      endDate &&
      moment(startDate).isSame(endDate, "day")
    ) {
      start.setHours(0, 0, 0, 0);         // 00:00:00.000
      end.setHours(23, 59, 59, 999);      // 23:59:59.999
    }
  
    return timestamp >= start.getTime() && timestamp <= end.getTime();
  });
  

// return data.filter((item) => {
//   let timestamp: number | null = null;

//   // Try parsing with moment using multiple formats
//   const dateTimeString = `${item.ISTserverTimeStamp}`;
//   const parsed = moment(
//     dateTimeString,
//     [
//       "M/D/YYYY HH:mm", "MM/DD/YYYY HH:mm", "M/DD/YYYY HH:mm", "MM/D/YYYY HH:mm",
//       "M/D/YY HH:mm", "MM/DD/YY HH:mm", "M/DD/YY HH:mm", "MM/D/YY HH:mm"
//     ],
//     true
//   );
  
//   if (parsed.isValid()) {
//     timestamp = parsed.valueOf();
//   } else {
//     return false; // skip invalid
//   }

//   const start = startDate ? startDate.getTime() : -Infinity;
//   const end = endDate ? endDate.getTime() : Infinity;

//   return timestamp >= start && timestamp <= end;
// });

  
  // return data.filter((item) => {
  //   const itemDate = new Date(item._time).getTime();
  //   const start = startDate ? startDate.getTime() : -Infinity;
  //   const end = endDate ? endDate.getTime() : Infinity;
  //   return itemDate >= start && itemDate <= end;
  // });
}