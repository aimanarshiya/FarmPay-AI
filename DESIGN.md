# FarmPay AI — Design System & UI Specification

> **Source of Truth:** Stitch Project `FarmPay AI Agricultural Marketplace` (`projects/7674813774794234311`)
> **Exported Reference Artifacts:** [`project_docs/stitch_reference/`](file:///c:/Users/DELL-PC/FarmPay-AI/project_docs/stitch_reference/)
> **Design Theme Archetype:** Terra — Organic Design
> **North Star Vision:** *"Rooted Warmth"* — Calm, grounded, human, and transparent agricultural commerce.

---

## 1. Design Philosophy & Aesthetic Foundation

FarmPay AI serves Indian farmers, agricultural buyers, logistics operators, and Mandi regulation officers. The interface completely rejects sterile, ultra-corporate SaaS tropes and harsh stark contrasts. Instead, it embodies **Rooted Warmth**:

- **Organic & Human:** Warm cream tones, soft rounded radii (12px standard), and earthy botanical accents evoke fertile land and trust.
- **Zero Tech-Alienation:** Jargon-free terminology, clear visual hierarchy, large legible touch targets, and high contrast without clinical glare.
- **Radical Financial Transparency:** Net take-home earnings are always foregrounded over confusing gross quotes; deductions (transport, unloading, cess) are clearly itemized.

---

## 2. Color Palette & Token Architecture

The color system uses tonal spot variants derived from agricultural greens and warm earthen neutrals.

### Primary & Action Colors
| Token | Hex Value | Semantic Role |
|---|---|---|
| `primary` | `#4a7c59` | Forest Green — Primary buttons, navigation highlights, active states |
| `on_primary` | `#ffffff` | Text/icons on primary green backgrounds |
| `primary_container` | `#78a886` | Secondary active elements, highlighted badges |
| `on_primary_container` | `#d8f0de` | Text/icons on deep primary containers |
| `primary_fixed` | `#c8e8d0` | Light green accent chips, success backgrounds |
| `surface_tint` | `#4a7c59` | Subtle green ambient wash |

### Surface & Background Tokens
| Token | Hex Value | Semantic Role |
|---|---|---|
| `background` | `#faf6f0` | Warm cream canvas (never sterile `#ffffff`) |
| `surface` | `#faf6f0` | Standard card and dialog surfaces |
| `surface_container_lowest`| `#ffffff` | High-contrast inner metric callouts and inputs |
| `surface_container_low` | `#f5f1ea` | Card backgrounds, nested panels |
| `surface_container` | `#f0ece4` | Sidebars, table headers, sticky navigation |
| `surface_container_high`| `#eae6de` | Hover states, elevated cards |
| `surface_container_highest`| `#e4e0d8` | Secondary borders, divider bars |
| `on_surface` | `#2e3230` | Deep slate charcoal — Primary typography |
| `on_surface_variant` | `#4a4e4a` | Muted slate — Supporting descriptions, captions |

### Accent & Tertiary Colors (Trust, Warnings & Escrow)
| Token | Hex Value | Semantic Role |
|---|---|---|
| `tertiary` | `#705c30` | Warm Amber — Escrow badges, notice highlights, caution states |
| `tertiary_container` | `#c4a66a` | Amber warning container backgrounds |
| `tertiary_fixed` | `#f8e0a8` | Soft gold badge backgrounds |
| `error` | `#b83230` | Muted brick red — Penalty alerts, disputes, validation errors |
| `error_container` | `#ffdad8` | Soft red container for dispute / cancellation banners |

### Border & Elevation Tokens
| Token | Hex Value / Formula | Semantic Role |
|---|---|---|
| `outline` | `#74796e` | High-visibility borders, focused outlines |
| `outline_variant` | `#c4c8bc` | Subtle borders for cards and tables at low opacity |
| `soft_shadow` | `0 4px 20px rgba(46, 50, 48, 0.06)` | Breathable, organic elevation |

---

## 3. Typography Hierarchy

| Role | Font Family | Weight | Line Height | Usage |
|---|---|---|---|---|
| **Headlines (H1–H3)** | **Literata** (Serif) | 600, 700 | 1.25–1.35 | Page hero titles, major section headers, editorial callouts |
| **Subheadings (H4–H6)** | **Literata** / **Nunito Sans** | 600 | 1.4 | Card headers, modal titles, table headers |
| **Body & Paragraphs** | **Nunito Sans** (Sans) | 400, 500 | 1.6+ | Data tables, offer breakdowns, explanatory text |
| **Labels & Badges** | **Nunito Sans** | 600, 700 | 1.2 | Form labels, navigation links, status pills |
| **Monospace / Financial**| **JetBrains Mono** / System | 500 | 1.2 | Currency amounts (`₹1,19,900.00`), lot numbers (`#FP-2024-884`), hashes |

---

## 4. UI Components & Patterns

1. **Buttons:**
   - **Primary Action:** Solid forest green (`#4a7c59`), text `#ffffff`, `border-radius: 12px`, padding `12px 24px`.
   - **Secondary Action:** Cream background (`#faf6f0`), green border (`#4a7c59`), green text, `border-radius: 12px`.
   - **Danger / Dispute Action:** Soft red fill or border (`#b83230`).

2. **Cards & Containers:**
   - Fill: Warm cream (`#f5f1ea` or `#faf6f0`).
   - Padding: `24px` standard (comfortable, breathable).
   - Corner Radius: `12px` (`ROUND_TWELVE`).
   - Border: Subtle `1px solid #c4c8bc` at low opacity, or purely tonal separation without harsh lines.

3. **Form Inputs:**
   - Background: `#ffffff` or `#faf6f0`.
   - Focus State: Soft forest green ring (`box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.2)`).
   - Radius: `12px`.

4. **Financial Net Proceeds Badging:**
   - Always prominent in bold Literata / Nunito Sans.
   - Itemized deductions (Transport, Handling, APMC Levy) shown in transparent collapsible accordions.
   - Gemini AI Recommendation Badge: Gold/amber badge with sparkling icon indicating grounded mathematical advice.

---

## 5. Screen Inventory & Architecture Map

| # | Screen Label | Device | Target Route | Primary Role | Reference Directory |
|---|---|---|---|---|---|
| 01 | **Order Escrow & Fulfillment Milestone Tracker** | Desktop | `/orders/:id/escrow` | Farmer, Buyer, Admin | `screens/01_order_escrow_fulfillment_milestone_tracker_lot_fp_/` |
| 02 | **Buyer Show-Cause Notice & Penalty Management** | Desktop | `/admin/penalties` | Mandi Officer, Admin | `screens/02_buyer_show_cause_notice_penalty_management/` |
| 03 | **AI Negotiation Copilot** | Desktop | `/negotiation/:offer_id` | Farmer | `screens/03_farmpay_ai_ai_negotiation_copilot/` |
| 04 | **Webhook Resilience & Dispute Refund Console** | Desktop | `/admin/webhooks` | Admin, DevOps | `screens/04_farmpay_ai_webhook_resilience_dispute_refund_conso/` |
| 05 | **Live GPS Transit & Weighbridge Telemetry Sheet**| Mobile | `/logistics/telemetry/:lot`| Transporter, Farmer | `screens/05_live_gps_transit_weighbridge_telemetry_sheet_lot_f/` |
| 06 | **Farmer Mobile Command Hub** | Mobile | `/farmer/dashboard` | Farmer | `screens/06_farmpay_ai_farmer_mobile_command_hub/` |
| 07 | **FairBid Engine — Transparent Net Earnings** | Desktop | `/listings/:id/offers` | Farmer | `screens/07_fairbid_engine_transparent_net_earnings_comparison/` |
| 08 | **Collective Selling Hub** | Desktop | `/fpo/pools` | Farmer, FPO Lead | `screens/08_farmpay_ai_collective_selling_hub/` |
| 09 | **Demand Radar** | Desktop | `/market/demand-radar` | Farmer, Buyer, Trader | `screens/09_farmpay_ai_demand_radar/` |
| 10 | **Dispute Arbitration Decision Console** | Desktop | `/disputes/arbitration/:id`| Mandi Nodal Officer | `screens/10_mandi_nodal_officer_dispute_arbitration_decision_c/` |
| 11 | **Voice-to-Trade AI — Voice Listing Studio** | Desktop | `/listings/create/voice` | Farmer | `screens/11_voice_to_trade_ai_voice_listing_studio/` |
| 12 | **Buyer Trust Passport — AgroCorp** | Desktop | `/buyers/:id/passport` | Public, Farmer | `screens/12_buyer_trust_passport_agrocorp_processing_mills/` |
| 13 | **Payments Center & PayPal Sandbox Gateway** | Desktop | `/payments` | Farmer, Buyer | `screens/13_farmpay_ai_payments_center_paypal_sandbox_gateway/` |
| 14 | **Logistics Intelligence** | Desktop | `/logistics` | Transporter, Farmer | `screens/14_farmpay_ai_logistics_intelligence/` |
| 15 | **Digital Crop Passport** | Desktop | `/passport/lot/:id` | Farmer, Buyer, Inspector | `screens/15_farmpay_ai_digital_crop_passport/` |
| 16 | **Dispute Shield** | Desktop | `/disputes` | Farmer, Buyer | `screens/16_farmpay_ai_dispute_shield/` |
| 17 | **Public Marketplace & Trade Gateway** | Desktop | `/` (Home) | Public, All Users | `screens/17_farmpay_ai_public_marketplace_trade_gateway/` |

---

## 6. Layout Guidelines & Breakpoints

- **Desktop Standard (`2560px` design canvas):** Centered max-width content container (`1440px` - `1600px`), fluid side gutters, responsive CSS grid.
- **Mobile Standard (`780px` design canvas):** Single-column stack, sticky bottom action bar, minimum 48px touch targets, swipeable card carousels for offers and telemetry feeds.
- **Elevation Layering:** Use tonal separation (`#faf6f0` -> `#f5f1ea` -> `#f0ece4`) rather than heavy drop shadows to preserve readability under bright outdoor sunlight.
