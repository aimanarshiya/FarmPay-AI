/**
 * Centralized API client for FarmPay AI.
 * Uses VITE_API_URL or defaults to local FastAPI instance.
 * Automatically injects JWT Bearer token if present in localStorage.
 */

const BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
export const AUTH_INVALID_EVENT = "farmpay:auth-invalid";

function getStoredToken() {
  try {
    return window.localStorage.getItem("farmpay_auth_token");
  } catch {
    return null;
  }
}

function clearStoredSession() {
  try {
    window.localStorage.removeItem("farmpay_auth_token");
    window.localStorage.removeItem("farmpay_auth_user");
  } catch {
    // The in-memory auth provider also clears its state on this event.
  }
}

export async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = getStoredToken();
  const isPublicAuthRequest =
    endpoint === "/api/auth/login" ||
    endpoint === "/api/auth/register/farmer" ||
    endpoint === "/api/auth/register/buyer";

  const headers = {
    "Content-Type": "application/json",
    ...(token && !isPublicAuthRequest ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      if (response.status === 401 && token && !isPublicAuthRequest) {
        clearStoredSession();
        window.dispatchEvent(new Event(AUTH_INVALID_EVENT));
      }

      const errorMessage =
        (typeof data === "object" && data !== null && (data.detail?.message || data.detail || data.message)) ||
        `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.status) {
      throw err;
    }
    const networkError = new Error(
      "Could not connect to FarmPay AI backend. Please verify that FastAPI is running on port 8000."
    );
    networkError.originalError = err;
    throw networkError;
  }
}
