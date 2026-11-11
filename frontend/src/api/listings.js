import { request } from "./apiClient";

export async function createProduceListing(listingData) {
  return request("/api/listings", {
    method: "POST",
    body: JSON.stringify(listingData),
  });
}

export async function fetchActiveListings(params = {}) {
  const query = new URLSearchParams();
  if (params.crop) query.append("crop", params.crop);
  if (params.location) query.append("location", params.location);
  if (params.status) query.append("status", params.status);

  const qs = query.toString();
  return request(`/api/listings${qs ? `?${qs}` : ""}`);
}

export async function fetchMyFarmerListings() {
  return request("/api/listings/farmer/my-listings");
}

export async function fetchListingDetails(listingId) {
  return request(`/api/listings/${encodeURIComponent(listingId)}`);
}
