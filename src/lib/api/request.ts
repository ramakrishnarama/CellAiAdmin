export async function apiRequest<T = any>(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: unknown,
    customHeaders?: HeadersInit
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...customHeaders,
    };
  
    const options: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };
  
    const response = await fetch(url, options);
  
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "API Error");
    }
  
    return response.json();
  }
  