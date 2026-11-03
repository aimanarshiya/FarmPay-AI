import { request } from "./apiClient";

/**
 * Creates a PayPal checkout order for the specified FarmPay order ID.
 * Returns approval URL and sandbox checkout metadata.
 */
export async function createPayPalPayment(orderId) {
  return request(`/api/payments/paypal/create/${encodeURIComponent(orderId)}`, {
    method: "POST",
  });
}

/**
 * Validates and captures an approved PayPal order.
 * Records paypal_capture_id in MySQL.
 * Leaves original INR order in NOT_PAID status.
 */
export async function capturePayPalPayment(orderId) {
  return request(`/api/payments/paypal/capture/${encodeURIComponent(orderId)}`, {
    method: "POST",
  });
}
