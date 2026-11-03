import { request } from "./apiClient";

export async function createOrder({ crop, quantityKg, location, buyerId }) {
  return request("/api/orders", {
    method: "POST",
    body: JSON.stringify({
      crop,
      quantity_kg: Number(quantityKg),
      location,
      buyer_id: buyerId,
    }),
  });
}

export async function fetchOrder(orderId) {
  return request(`/api/orders/${encodeURIComponent(orderId)}`, {
    method: "GET",
  });
}

export async function fetchOrders({ limit = 50, offset = 0 } = {}) {
  const query = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  }).toString();
  return request(`/api/orders?${query}`, {
    method: "GET",
  });
}

