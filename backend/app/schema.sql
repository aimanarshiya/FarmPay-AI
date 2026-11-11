-- FarmPay AI — Complete Database Schema (v2.0)
-- Engine: MySQL 8.0+ (InnoDB, utf8mb4)
-- Authoritative Schema for FarmPay AI Hackathon MVP
--
-- To initialise or upgrade the database, run:
--   mysql -u root -p farmpay_ai < backend/app/schema.sql
-- Or inside MySQL client:
--   USE farmpay_ai;
--   SOURCE backend/app/schema.sql;

CREATE DATABASE IF NOT EXISTS farmpay_ai
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE farmpay_ai;

-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    user_id             VARCHAR(50)     NOT NULL,
    email               VARCHAR(150)    NOT NULL UNIQUE,
    phone               VARCHAR(20)     DEFAULT NULL,
    password_hash       VARCHAR(255)    NOT NULL,
    salt                VARCHAR(64)     NOT NULL,
    role                ENUM('FARMER', 'BUYER', 'ADMIN') NOT NULL,
    name                VARCHAR(150)    NOT NULL,
    preferred_language  VARCHAR(10)     DEFAULT 'en',
    is_active           BOOLEAN         DEFAULT TRUE,
    created_at          DATETIME(6)     NOT NULL,
    PRIMARY KEY (user_id),
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================================
-- 2. FARMER PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS farmer_profiles (
    user_id             VARCHAR(50)     NOT NULL,
    village_city        VARCHAR(100)    NOT NULL,
    district            VARCHAR(100)    NOT NULL,
    state               VARCHAR(100)    NOT NULL,
    land_acres          DECIMAL(8, 2)   DEFAULT NULL,
    primary_crop        VARCHAR(100)    DEFAULT NULL,
    created_at          DATETIME(6)     NOT NULL,
    PRIMARY KEY (user_id),
    CONSTRAINT fk_farmer_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================================
-- 3. BUYER PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS buyer_profiles (
    user_id             VARCHAR(50)     NOT NULL,
    business_name       VARCHAR(150)    NOT NULL,
    business_type       VARCHAR(100)    DEFAULT 'Mandi Trader',
    city                VARCHAR(100)    NOT NULL,
    district            VARCHAR(100)    NOT NULL,
    state               VARCHAR(100)    NOT NULL,
    verified            BOOLEAN         DEFAULT FALSE,
    created_at          DATETIME(6)     NOT NULL,
    PRIMARY KEY (user_id),
    CONSTRAINT fk_buyer_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================================
-- 4. PRODUCE LISTINGS (Farmer selling produce)
-- ============================================================
CREATE TABLE IF NOT EXISTS produce_listings (
    listing_id          VARCHAR(50)     NOT NULL,
    farmer_id           VARCHAR(50)     NOT NULL,
    farmer_name         VARCHAR(150)    NOT NULL,
    crop                VARCHAR(100)    NOT NULL,
    quantity_kg         DECIMAL(10, 2)  NOT NULL,
    expected_price_per_kg DECIMAL(10, 2) NOT NULL,
    location            VARCHAR(150)    NOT NULL,
    village             VARCHAR(100)    DEFAULT NULL,
    district            VARCHAR(100)    DEFAULT NULL,
    state               VARCHAR(100)    DEFAULT NULL,
    status              VARCHAR(30)     DEFAULT 'ACTIVE',
    created_at          DATETIME(6)     NOT NULL,
    PRIMARY KEY (listing_id),
    INDEX idx_listings_farmer (farmer_id),
    INDEX idx_listings_status (status),
    INDEX idx_listings_crop (crop)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================================
-- 5. BUYER OFFERS (Offers submitted against listings)
-- ============================================================
CREATE TABLE IF NOT EXISTS buyer_offers (
    offer_id            VARCHAR(50)     NOT NULL,
    listing_id          VARCHAR(50)     NOT NULL,
    buyer_id            VARCHAR(50)     NOT NULL,
    buyer_name          VARCHAR(150)    NOT NULL,
    price_per_kg        DECIMAL(10, 2)  NOT NULL,
    offered_quantity_kg DECIMAL(10, 2)  NOT NULL,
    transport_cost      DECIMAL(12, 2)  NOT NULL,
    gross_amount        DECIMAL(12, 2)  NOT NULL,
    net_proceeds        DECIMAL(12, 2)  NOT NULL,
    notes               TEXT            DEFAULT NULL,
    status              VARCHAR(30)     DEFAULT 'PENDING',
    created_at          DATETIME(6)     NOT NULL,
    PRIMARY KEY (offer_id),
    INDEX idx_offers_listing (listing_id),
    INDEX idx_offers_buyer (buyer_id),
    INDEX idx_offers_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================================
-- 6. ORDERS (Preserved & Extended)
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
    order_id            VARCHAR(30)     NOT NULL,
    farmer_id           VARCHAR(50)     DEFAULT NULL,
    listing_id          VARCHAR(50)     DEFAULT NULL,
    offer_id            VARCHAR(50)     DEFAULT NULL,
    buyer_id            VARCHAR(50)     NOT NULL,
    buyer_name          VARCHAR(100)    NOT NULL,
    crop                VARCHAR(100)    NOT NULL,
    quantity_kg         DECIMAL(10, 2)  NOT NULL,
    location            VARCHAR(150)    NOT NULL,
    price_per_kg        DECIMAL(10, 2)  NOT NULL,
    gross_amount        DECIMAL(12, 2)  NOT NULL,
    transport_cost      DECIMAL(12, 2)  NOT NULL,
    net_proceeds        DECIMAL(12, 2)  NOT NULL,
    currency            VARCHAR(10)     DEFAULT 'INR',
    offer_type          VARCHAR(20)     DEFAULT 'DEMO',
    status              VARCHAR(30)     DEFAULT 'PENDING_PAYMENT',
    payment_status      VARCHAR(30)     DEFAULT 'NOT_PAID',
    created_at          DATETIME(6)     NOT NULL,
    paypal_order_id     VARCHAR(100)    DEFAULT NULL,
    paypal_capture_id   VARCHAR(100)    DEFAULT NULL,
    PRIMARY KEY (order_id),
    INDEX idx_orders_farmer (farmer_id),
    INDEX idx_orders_buyer (buyer_id),
    INDEX idx_orders_payment_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================================
-- 7. AI RECOMMENDATIONS AUDIT TRAIL
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_recommendations (
    recommendation_id   VARCHAR(50)     NOT NULL,
    listing_id          VARCHAR(50)     NOT NULL,
    recommended_buyer_id VARCHAR(50)    NOT NULL,
    recommended_offer_id VARCHAR(50)    DEFAULT NULL,
    explanation         TEXT            NOT NULL,
    financial_analysis  TEXT            NOT NULL,
    trade_offs          TEXT            DEFAULT NULL,
    warnings            TEXT            DEFAULT NULL,
    model_used          VARCHAR(50)     DEFAULT 'gemini-2.5-flash',
    is_fallback         BOOLEAN         DEFAULT FALSE,
    created_at          DATETIME(6)     NOT NULL,
    PRIMARY KEY (recommendation_id),
    INDEX idx_ai_listing (listing_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
