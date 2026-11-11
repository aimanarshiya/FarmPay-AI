import { request } from "./apiClient";

export async function fetchAdminMetrics() {
  return request("/api/admin/metrics");
}

export async function fetchAdminUsers() {
  return request("/api/admin/users");
}

export async function fetchAdminAIActivity() {
  return request("/api/admin/ai-activity");
}
