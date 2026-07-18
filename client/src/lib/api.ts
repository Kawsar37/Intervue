const API_URL = "/api";

interface RequestOptions extends Omit<RequestInit, "method" | "body"> {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  params?: Record<string, string>;
}

// Store the current user ID so API requests can include it
let _currentUserId: string | null = null;

export function setCurrentUserId(userId: string | null) {
  _currentUserId = userId;
}

export function getCurrentUserId(): string | null {
  return _currentUserId;
}

function buildUrl(endpoint: string, params?: Record<string, string>): string {
  const url = new URL(endpoint, typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  return url.toString();
}

function getSessionToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    /(?:^|;\s*)better-auth\.session_token=([^;]*)/,
  );
  return match ? decodeURIComponent(match[1]) : null;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    params,
    headers: customHeaders,
    ...rest
  } = options;

  const url = buildUrl(endpoint, params);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  // Send JWT token for cross-origin auth, fallback to x-user-id header
  const jwt = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null;
  if (jwt) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${jwt}`;
  } else if (_currentUserId) {
    (headers as Record<string, string>)["x-user-id"] = _currentUserId;
  }

  const response = await fetch(url, {
    method,
    headers,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An unexpected error occurred",
    }));
    throw new Error(
      error.message || `Request failed with status ${response.status}`,
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "POST", body }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "PUT", body }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
