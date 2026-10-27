
import logging
from decimal import Decimal, InvalidOperation

import httpx
from fastapi import APIRouter, HTTPException

from app.database import get_connection
from app.paypal_service import (
    create_paypal_order,
    capture_paypal_order,
    get_access_token,
    PAYPAL_BASE_URL,
)

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/payments/paypal",
    tags=["PayPal"],
)

# Sandbox integration test only.
# This $1 payment does not settle the original INR FarmPay order.
SANDBOX_TEST_AMOUNT = Decimal("1.00")
SANDBOX_TEST_CURRENCY = "USD"


def order_to_dict(order):
    if not order:
        return None

    result = dict(order)

    for key in (
        "quantity_kg",
        "price_per_kg",
        "gross_amount",
        "transport_cost",
        "net_proceeds",
    ):
        if result.get(key) is not None:
            result[key] = float(result[key])

    if result.get("created_at"):
        result["created_at"] = result["created_at"].isoformat() + "Z"

    return result


def get_paypal_order_details(paypal_order_id: str) -> dict:
    """Retrieve the PayPal order without capturing it."""
    token = get_access_token()

    response = httpx.get(
        f"{PAYPAL_BASE_URL}/v2/checkout/orders/{paypal_order_id}",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        timeout=30,
    )

    if response.is_error:
        logger.error(
            "PayPal order lookup failed: HTTP %s: %s",
            response.status_code,
            response.text,
        )
        raise HTTPException(
            status_code=502,
            detail="Could not retrieve PayPal order details.",
        )

    return response.json()


def get_single_purchase_unit(paypal_result: dict) -> dict:
    units = paypal_result.get("purchase_units", [])

    if len(units) != 1:
        raise HTTPException(
            status_code=400,
            detail="Expected exactly one PayPal purchase unit.",
        )

    return units[0]


def validate_paypal_order(
    paypal_result: dict,
    farmpay_order_id: str,
) -> dict:
    """Verify order identity and test amount before capturing."""
    unit = get_single_purchase_unit(paypal_result)

    custom_id = unit.get("custom_id")
    reference_id = unit.get("reference_id")

    # Every identifier that is present must agree with the FarmPay order.
    if custom_id and custom_id != farmpay_order_id:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "PayPal custom_id mismatch; capture not attempted.",
                "farm_pay_order_id": farmpay_order_id,
                "paypal_order_id": paypal_result.get("id"),
                "paypal_custom_id": custom_id,
                "paypal_reference_id": reference_id,
            },
        )

    if reference_id and reference_id != farmpay_order_id:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "PayPal reference_id mismatch; capture not attempted.",
                "farm_pay_order_id": farmpay_order_id,
                "paypal_order_id": paypal_result.get("id"),
                "paypal_custom_id": custom_id,
                "paypal_reference_id": reference_id,
            },
        )

    if custom_id != farmpay_order_id and reference_id != farmpay_order_id:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Neither PayPal identifier matches; capture not attempted.",
                "farm_pay_order_id": farmpay_order_id,
                "paypal_order_id": paypal_result.get("id"),
                "paypal_custom_id": custom_id,
                "paypal_reference_id": reference_id,
            },
        )

    amount_info = unit.get("amount", {})

    try:
        amount = Decimal(str(amount_info["value"]))
    except (KeyError, InvalidOperation, TypeError):
        raise HTTPException(
            status_code=400,
            detail="PayPal order amount is missing or invalid.",
        )

    currency = amount_info.get("currency_code")

    if (
        amount != SANDBOX_TEST_AMOUNT
        or currency != SANDBOX_TEST_CURRENCY
    ):
        raise HTTPException(
            status_code=400,
            detail={
                "message": "PayPal amount/currency mismatch; capture not attempted.",
                "expected_amount": str(SANDBOX_TEST_AMOUNT),
                "expected_currency": SANDBOX_TEST_CURRENCY,
                "actual_amount": str(amount),
                "actual_currency": currency,
            },
        )

    return unit


@router.post("/create/{order_id}")
def create_payment(order_id: str):
    connection = None

    try:
        connection = get_connection()

        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM orders WHERE order_id = %s FOR UPDATE",
                (order_id,),
            )
            order = cursor.fetchone()

        if not order:
            raise HTTPException(
                status_code=404,
                detail="FarmPay order not found.",
            )

        if order["payment_status"] == "PAID":
            raise HTTPException(
                status_code=409,
                detail="This FarmPay order is already marked paid.",
            )

        paypal_result = create_paypal_order(
            order_id=order_id,
            amount=SANDBOX_TEST_AMOUNT,
            currency=SANDBOX_TEST_CURRENCY,
        )

        paypal_order_id = paypal_result.get("id")

        if not paypal_order_id:
            raise HTTPException(
                status_code=502,
                detail="PayPal did not return an order ID.",
            )

        approval_url = next(
            (
                link["href"]
                for link in paypal_result.get("links", [])
                if link.get("rel") in ("approve", "payer-action")
            ),
            None,
        )

        if not approval_url:
            raise HTTPException(
                status_code=502,
                detail="PayPal did not return an approval URL.",
            )

        # Store the exact PayPal order returned to the browser.
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE orders
                SET paypal_order_id = %s,
                    paypal_capture_id = NULL
                WHERE order_id = %s
                  AND payment_status != 'PAID'
                """,
                (paypal_order_id, order_id),
            )

            cursor.execute(
                """
                SELECT payment_status, paypal_order_id
                FROM orders
                WHERE order_id = %s
                """,
                (order_id,),
            )
            saved = cursor.fetchone()

        if not saved or saved["paypal_order_id"] != paypal_order_id:
            raise HTTPException(
                status_code=409,
                detail="Could not verify the saved PayPal order ID.",
            )

        if saved["payment_status"] == "PAID":
            raise HTTPException(
                status_code=409,
                detail="This FarmPay order is already marked paid.",
            )

        connection.commit()

        return {
            "success": True,
            "order_id": order_id,
            "paypal_order_id": paypal_order_id,
            "approval_url": approval_url,
            "amount": float(SANDBOX_TEST_AMOUNT),
            "currency": SANDBOX_TEST_CURRENCY,
            "farm_pay_amount_inr": float(order["net_proceeds"]),
            "test_mode": True,
            "message": (
                "Sandbox checkout created. Approve this exact checkout "
                "before requesting capture. It does not settle the INR order."
            ),
        }

    except HTTPException:
        if connection:
            connection.rollback()
        raise

    except Exception:
        logger.exception("PayPal checkout creation failed")
        if connection:
            connection.rollback()
        raise HTTPException(
            status_code=502,
            detail="PayPal checkout creation failed. Check backend logs.",
        )

    finally:
        if connection:
            connection.close()


@router.post("/capture/{order_id}")
def capture_payment(order_id: str):
    connection = None

    try:
        connection = get_connection()

        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM orders WHERE order_id = %s FOR UPDATE",
                (order_id,),
            )
            order = cursor.fetchone()

        if not order:
            raise HTTPException(
                status_code=404,
                detail="FarmPay order not found.",
            )

        paypal_order_id = order.get("paypal_order_id")

        if not paypal_order_id:
            raise HTTPException(
                status_code=400,
                detail="No PayPal order is saved. Create a checkout first.",
            )

        # Do not call capture until we have retrieved and validated
        # the exact PayPal order currently saved in MySQL.
        details = get_paypal_order_details(paypal_order_id)

        if details.get("id") != paypal_order_id:
            raise HTTPException(
                status_code=400,
                detail="PayPal returned a different order ID; capture not attempted.",
            )

        unit = validate_paypal_order(details, order_id)
        paypal_status = details.get("status")

        # If PayPal already completed this order, reuse its capture details.
        # Never attempt a second capture for a completed order.
        if paypal_status == "COMPLETED":
            paypal_result = details

        elif paypal_status == "APPROVED":
            paypal_result = capture_paypal_order(paypal_order_id)

        else:
            raise HTTPException(
                status_code=409,
                detail={
                    "message": (
                        "PayPal order is not approved. "
                        "Open the saved approval URL and approve this exact order."
                    ),
                    "paypal_order_id": paypal_order_id,
                    "paypal_status": paypal_status,
                },
            )

        if paypal_result.get("id") != paypal_order_id:
            raise HTTPException(
                status_code=400,
                detail="Capture response PayPal order ID does not match.",
            )

        if paypal_result.get("status") != "COMPLETED":
            raise HTTPException(
                status_code=402,
                detail={
                    "message": "PayPal has not completed the capture.",
                    "paypal_status": paypal_result.get("status"),
                },
            )

        # Validate the returned capture against the same FarmPay order.
        unit = validate_paypal_order(paypal_result, order_id)
        captures = unit.get("payments", {}).get("captures", [])

        completed_captures = [
            item for item in captures
            if item.get("status") == "COMPLETED"
        ]

        if len(completed_captures) != 1:
            raise HTTPException(
                status_code=402,
                detail="Expected exactly one completed PayPal capture.",
            )

        capture = completed_captures[0]
        capture_id = capture.get("id")

        if not capture_id:
            raise HTTPException(
                status_code=402,
                detail="PayPal capture ID is missing.",
            )

        capture_amount = Decimal(str(capture["amount"]["value"]))
        capture_currency = capture["amount"]["currency_code"]

        if (
            capture_amount != SANDBOX_TEST_AMOUNT
            or capture_currency != SANDBOX_TEST_CURRENCY
        ):
            raise HTTPException(
                status_code=400,
                detail="Captured amount or currency does not match the test checkout.",
            )

        # Record only the test capture ID. Do NOT mark the INR order paid.
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE orders
                SET paypal_capture_id = %s
                WHERE order_id = %s
                  AND paypal_order_id = %s
                  AND payment_status = 'NOT_PAID'
                """,
                (capture_id, order_id, paypal_order_id),
            )

            cursor.execute(
                "SELECT * FROM orders WHERE order_id = %s",
                (order_id,),
            )
            updated_order = cursor.fetchone()

        if not updated_order:
            raise HTTPException(
                status_code=404,
                detail="FarmPay order disappeared during capture verification.",
            )

        connection.commit()

        return {
            "success": True,
            "sandbox_test_payment": True,
            "paypal_order_id": paypal_order_id,
            "paypal_status": paypal_result["status"],
            "capture_id": capture_id,
            "test_amount": float(capture_amount),
            "test_currency": capture_currency,
            "farm_pay_order_payment_status": updated_order["payment_status"],
            "order": order_to_dict(updated_order),
            "message": (
                "Sandbox test capture verified and recorded. "
                "The original INR FarmPay order remains unpaid."
            ),
        }

    except HTTPException:
        if connection:
            connection.rollback()
        raise

    except Exception:
        logger.exception("PayPal capture failed")
        if connection:
            connection.rollback()
        raise HTTPException(
            status_code=502,
            detail=(
                "PayPal capture or verification failed. "
                "Check backend logs before retrying."
            ),
        )

    finally:
        if connection:
            connection.close()
