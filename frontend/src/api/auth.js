import { request } from "./apiClient";

export async function loginUser(credentials) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function registerFarmer(data) {
  return request("/api/auth/register/farmer", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function registerBuyer(data) {
  return request("/api/auth/register/buyer", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchMe() {
  return request("/api/auth/me");
}
