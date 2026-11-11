-- FarmPay AI — Schema Migration v2 (Authentication + Marketplace + Profiles)
-- Safe, repeatable, forward-compatible migration for MySQL 8.0+

USE farmpay_ai;

-- 1. Users table
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

-- 2. Farmer profiles
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

-- 3. Buyer profiles
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

-- 4. Produce listings (Farmer crop sell listings)
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

-- 5. Buyer offers submitted against produce listings
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

-- 6. AI recommendations audit metadata table
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

-- 7. Add columns to orders table if they do not exist
-- Using procedure for idempotency in MySQL
DROP PROCEDURE IF EXISTS upgrade_orders_table;
DELIMITER $$
CREATE PROCEDURE upgrade_orders_table()
BEGIN
    IF NOT EXISTS (
        SELECT * FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'orders'
        AND COLUMN_NAME = 'farmer_id'
    ) THEN
        ALTER TABLE orders ADD COLUMN farmer_id VARCHAR(50) NULL AFTER order_id;
    END IF;

    IF NOT EXISTS (
        SELECT * FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'orders'
        AND COLUMN_NAME = 'listing_id'
    ) THEN
        ALTER TABLE orders ADD COLUMN listing_id VARCHAR(50) NULL AFTER farmer_id;
    END IF;

    IF NOT EXISTS (
        SELECT * FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'orders'
        AND COLUMN_NAME = 'offer_id'
    ) THEN
        ALTER TABLE orders ADD COLUMN offer_id VARCHAR(50) NULL AFTER listing_id;
    END IF;
END $$
DELIMITER ;
CALL upgrade_orders_table();
DROP PROCEDURE IF EXISTS upgrade_orders_table;
