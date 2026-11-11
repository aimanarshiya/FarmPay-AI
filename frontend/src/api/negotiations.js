import { request } from "./apiClient";

export async function submitBuyerOffer(listingId, offerData) {
  return request(`/api/listings/${encodeURIComponent(listingId)}/offers`, {
    method: "POST",
    body: JSON.stringify(offerData),
  });
}

export async function fetchListingOffers(listingId) {
  return request(`/api/listings/${encodeURIComponent(listingId)}/offers`);
}

export async function fetchAIOfferRecommendation(listingId) {
  return request(`/api/listings/${encodeURIComponent(listingId)}/ai-recommendation`);
}

export async function acceptOffer(offerId) {
  return request(`/api/offers/${encodeURIComponent(offerId)}/accept`, {
    method: "POST",
  });
}

export async function rejectOffer(offerId) {
  return request(`/api/offers/${encodeURIComponent(offerId)}/reject`, {
    method: "POST",
  });
}

export async function fetchMyBuyerOffers() {
  return request("/api/buyer/my-offers");
}
