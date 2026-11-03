import { request } from "./apiClient";

export async function fetchOffers({ crop, quantityKg, location }) {
  return request("/api/offers", {
    method: "POST",
    body: JSON.stringify({
      crop,
      quantity_kg: Number(quantityKg),
      location,
    }),
  });
}

