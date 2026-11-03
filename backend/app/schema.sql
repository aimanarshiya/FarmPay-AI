-- FarmPay AI — MySQL Database Schema
-- Version: 1.1
-- Engine: MySQL 8.0+ (InnoDB, utf8mb4)
--
-- This file is the authoritative source for the database structure,
-- verified against the live MySQL orders table definition.
-- Run it once to initialise a new database:
--
--   mysql -u root -p < backend/app/schema.sql
--
-- Or from the MySQL prompt:
--
--   source /path/to/FarmPay-AI/backend/app/schema.sql;
--
-- NOTES:
--   * Monetary values use DECIMAL to avoid floating-point rounding errors.
--   * created_at stores UTC as DATETIME(6) with microsecond precision.
--   * paypal_order_id and paypal_capture_id are NULL until the PayPal
--     checkout and capture steps are completed.
--   * payment_status values: NOT_PAID | PAID
--   * status values:         PENDING_PAYMENT | COMPLETED | CANCELLED

-- ============================================================
-- Create the database (skip if it already exists)
-- ============================================================
CREATE DATABASE IF NOT EXISTS farmpay_ai
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE farmpay_ai;

-- ============================================================
-- orders
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (

    -- Primary key (e.g. FP-ABC123DEF456)
    order_id            VARCHAR(30)     NOT NULL,

    -- Buyer identifier (e.g. BUYER001)
    buyer_id            VARCHAR(50)     NOT NULL,

    -- Denormalised buyer name stored at order creation time
    buyer_name          VARCHAR(100)    NOT NULL,

    -- Crop name, title-cased at creation time
    crop                VARCHAR(100)    NOT NULL,

    -- Quantity offered by the farmer, in kilograms
    quantity_kg         DECIMAL(10, 2)  NOT NULL,

    -- Farm location provided by the farmer
    location            VARCHAR(150)    NOT NULL,

    -- Price the buyer pays per kilogram (INR)
    price_per_kg        DECIMAL(10, 2)  NOT NULL,

    -- quantity_kg * price_per_kg (INR)
    gross_amount        DECIMAL(12, 2)  NOT NULL,

    -- Buyer-quoted transport cost deducted from the gross amount (INR)
    transport_cost      DECIMAL(12, 2)  NOT NULL,

    -- gross_amount - transport_cost; the farmer's estimated net earnings (INR)
    net_proceeds        DECIMAL(12, 2)  NOT NULL,

    -- Currency code for the INR amounts above
    currency            VARCHAR(10)     DEFAULT 'INR',

    -- DEMO = illustrative offer data; LIVE = real market offer (future)
    offer_type          VARCHAR(20)     DEFAULT 'DEMO',

    -- Overall order lifecycle status
    -- Values: PENDING_PAYMENT | COMPLETED | CANCELLED
    status              VARCHAR(30)     DEFAULT 'PENDING_PAYMENT',

    -- Payment settlement status
    -- Values: NOT_PAID | PAID
    payment_status      VARCHAR(30)     DEFAULT 'NOT_PAID',

    -- UTC creation timestamp with microsecond precision
    created_at          DATETIME(6)     NOT NULL,

    -- PayPal order ID returned by POST /v2/checkout/orders
    paypal_order_id     VARCHAR(100)    DEFAULT NULL,

    -- PayPal capture ID returned by POST /v2/checkout/orders/{id}/capture
    paypal_capture_id   VARCHAR(100)    DEFAULT NULL,

    PRIMARY KEY (order_id)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- ============================================================
-- Recommended indexes for Phase 1+
-- (Not required for the current prototype; add as query
--  patterns are identified)
-- ============================================================
-- CREATE INDEX idx_orders_payment_status ON orders (payment_status);
-- CREATE INDEX idx_orders_status         ON orders (status);
-- CREATE INDEX idx_orders_created_at     ON orders (created_at);

-- ============================================================
-- Future tables (Phase 2+)
-- ============================================================
-- users        — farmer profiles and authentication
-- buyers       — real buyer catalog
-- crops        — crop catalog and pricing rules
-- payments     — full payment audit trail
-- locations    — geographic reference data
