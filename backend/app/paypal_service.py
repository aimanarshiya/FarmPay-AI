
import os
import httpx
import uuid
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

PAYPAL_BASE_URL = os.getenv(
    "PAYPAL_BASE_URL",
    "https://api-m.sandbox.paypal.com"
).rstrip("/")

PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET")


def get_access_token():
    if not PAYPAL_CLIENT_ID or not PAYPAL_CLIENT_SECRET:
        raise RuntimeError("PayPal credentials are not configured.")

    response = httpx.post(
        f"{PAYPAL_BASE_URL}/v1/oauth2/token",
        auth=(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET),
        data={"grant_type": "client_credentials"},
        timeout=30,
    )

    response.raise_for_status()
    return response.json()["access_token"]



def create_paypal_order(order_id, amount, currency="USD"):
    token = get_access_token()

    # Generate a unique request ID for each new checkout attempt.
    request_id = f"create-{uuid.uuid4()}"

    response = httpx.post(
        f"{PAYPAL_BASE_URL}/v2/checkout/orders",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "PayPal-Request-Id": request_id,
        },
        json={
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "reference_id": order_id,
                    "custom_id": order_id,
                    "amount": {
                        "currency_code": currency,
                        "value": f"{float(amount):.2f}",
                    },
                }
            ],
            "application_context": {
                "brand_name": "FarmPay AI",
                "user_action": "PAY_NOW",
                "return_url": "http://localhost:5173/payment/success",
                "cancel_url": "http://localhost:5173/payment/cancel",
            },
        },
        timeout=30,
    )

    response.raise_for_status()
    return response.json()
def capture_paypal_order(paypal_order_id):
    token = get_access_token()

    response = httpx.post(
        f"{PAYPAL_BASE_URL}/v2/checkout/orders/"
        f"{paypal_order_id}/capture",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "PayPal-Request-Id": f"capture-{paypal_order_id}",
        },
        json={},
        timeout=30,
    )

    if response.is_error:
        raise RuntimeError(
            f"PayPal HTTP {response.status_code}: {response.text}"
        )
    return response.json()
