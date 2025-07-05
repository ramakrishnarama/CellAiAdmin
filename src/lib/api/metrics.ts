import { apiRequest } from "./request";

// Get metrics data (returns `any`)
export async function getMetrics(serial: string) {
  return apiRequest(`/api/metrics?serial=${serial}`, "GET");
}

// Post metric (accepts any payload)
export async function postMetric(data: any) {
  return apiRequest("/api/metrics", "POST", data);
}


// //Get data from excel sheet
// export async function getExcelSheet() {
//     const res = await fetch("/images/excel/data.json");
//     if (!res.ok) throw new Error("Failed to fetch JSON");
//     return res.json();
//   }

  export async function getExcelSheet(): Promise<any[]> {
    const res = await fetch("/images/excel/data.json");
    if (!res.ok) throw new Error("Failed to fetch JSON");
    return await res.json();
  }