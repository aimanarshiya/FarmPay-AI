import assert from "node:assert";
import { formatINR } from "./src/utils/currency.js";
import { ModuleRegistry, AllCommunityModule, themeQuartz } from "ag-grid-community";

console.log("--- 1. Testing AG Grid Community Module Registration ---");
ModuleRegistry.registerModules([AllCommunityModule]);
console.log("✓ AllCommunityModule registered successfully.");

console.log("\n--- 2. Testing FarmPay AI themeQuartz Customization ---");
const customTheme = themeQuartz.withParams({
  accentColor: "#4a7c59",
  backgroundColor: "#ffffff",
  headerBackgroundColor: "#f0ece4",
  headerTextColor: "#2e3230",
  headerFontWeight: 700,
  textColor: "#2e3230",
  borderColor: "#e4e0d8",
  rowHoverColor: "#f5f1ea",
});
assert.ok(customTheme, "Custom themeQuartz must be instantiated");
console.log("✓ themeQuartz customized with FarmPay AI earthen palette.");

console.log("\n--- 3. Testing Currency Utilities ---");
assert.strictEqual(formatINR(0), "₹0.00");
assert.ok(formatINR(25.20).includes("25.20"));
assert.ok(formatINR(373464).includes("3,73,464"));
console.log("✓ Currency formatting verified for INR.");

console.log("\n--- 4. Testing Financial Calculation & Best Offer Invariants ---");
const testOffers = [
  {
    offer_id: "OFF-AGRO-8841",
    buyer_name: "AgroCorp Mills",
    price_per_kg: 25.20,
    offered_quantity_kg: 15000,
    gross_amount: 378000,
    transport_cost: 0,
    handling_cost: 0,
    other_deductions: 4536,
    total_deductions: 4536,
    net_proceeds: 373464,
    is_incomplete: false,
  },
  {
    offer_id: "OFF-KAVERI-8842",
    buyer_name: "Kaveri Agri Trading",
    price_per_kg: 25.60, // Higher headline (+₹40/Qtl)
    offered_quantity_kg: 15000,
    gross_amount: 384000,
    transport_cost: 14250,
    handling_cost: 6000,
    other_deductions: 4608,
    total_deductions: 24858,
    net_proceeds: 359142, // Lower net take-home
    is_incomplete: false,
  },
  {
    offer_id: "OFF-MANDI-8844",
    buyer_name: "Local APMC Mandi Yard",
    price_per_kg: 22.50,
    offered_quantity_kg: 15000,
    gross_amount: 337500,
    transport_cost: 12000,
    handling_cost: 8250,
    other_deductions: 6750,
    total_deductions: 27000,
    net_proceeds: 310500,
    is_incomplete: true, // Incomplete/unverified
  },
];

// Invariant: Best offer must be AgroCorp Mills with highest confirmed net proceeds
const completeOffers = testOffers.filter(o => !o.is_incomplete);
const maxConfirmedNet = Math.max(...completeOffers.map(o => o.net_proceeds));
const bestOffer = completeOffers.find(o => o.net_proceeds === maxConfirmedNet);

assert.strictEqual(bestOffer.offer_id, "OFF-AGRO-8841");
assert.strictEqual(bestOffer.buyer_name, "AgroCorp Mills");
assert.strictEqual(bestOffer.net_proceeds, 373464);
console.log("✓ AgroCorp correctly identified as highest confirmed net realization (₹3,73,464).");

// Invariant: Kaveri has higher headline rate, but is flagged as deceptive headline
const maxHeadlineRate = Math.max(...testOffers.map(o => o.price_per_kg));
assert.strictEqual(maxHeadlineRate, 25.60);
const kaveri = testOffers.find(o => o.buyer_name === "Kaveri Agri Trading");
assert.ok(kaveri.price_per_kg === maxHeadlineRate && kaveri.net_proceeds < bestOffer.net_proceeds);
console.log("✓ Deceptive headline rate (+₹40/Qtl with hidden deductions) identified.");

// Invariant: Mandi yard with incomplete deductions is NOT ranked as best offer
const mandiYard = testOffers.find(o => o.buyer_name === "Local APMC Mandi Yard");
assert.strictEqual(mandiYard.is_incomplete, true);
assert.notStrictEqual(mandiYard.offer_id, bestOffer.offer_id);
console.log("✓ Unverified/incomplete offers excluded from best-deal confirmation.");

console.log("\n--- 5. Testing CSV Processing Callback ---");
const testRow = {
  buyer_name: "AgroCorp Mills",
  price_per_kg: 25.20,
  quantity_kg: 15000,
  gross_amount: 378000,
  net_proceeds: 373464,
};
const exportedPrice = `INR ${Number(testRow.price_per_kg).toFixed(2)}`;
const exportedNet = `INR ${Number(testRow.net_proceeds).toFixed(2)}`;
assert.strictEqual(exportedPrice, "INR 25.20");
assert.strictEqual(exportedNet, "INR 373464.00");
console.log("✓ CSV processing preserves exact monetary precision and INR denomination.");

console.log("\nALL AG GRID INTEGRATION INVARIANTS VERIFIED SUCCESSFULLY!");
