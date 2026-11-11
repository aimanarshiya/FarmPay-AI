# FARM PAY AI — HOMEPAGE CLEANUP & PREMIUM LANDING PAGE REDESIGN

Act as a senior UI/UX designer and React frontend engineer.

The FarmPay AI website is already implemented, and all 17 approved screens are currently accessible. I am satisfied with the existing application functionality.

However, the homepage is visually cluttered. I want you to redesign ONLY the homepage presentation and remove unnecessary development/navigation elements that are currently exposed on the public landing page.

Use the screenshot I provided as the reference for the problems to fix.

## 1. REMOVE THESE ELEMENTS COMPLETELY

**A. Top Kisan Support Desk strip**

Remove the separate green strip at the very top containing:
- 24x7 Kisan Support Desk.
- Toll-free phone number.
- High Contrast control.
- Font-size controls.
- Language controls in that strip.

Do not remove necessary accessibility or language functionality from the actual application if it is used elsewhere.

**B. Homepage Stitch screen gallery**

Remove the entire homepage section containing:

"GOOGLE STITCH PRODUCTION PROTOTYPE IMPLEMENTATION"

"All 17 Approved Stitch Screens — 100% Retained & Functional"

Also remove:
- All 17 screen preview cards.
- Screen numbers and category badges.
- The 17 of 17 Modules Live badge.
- The development-oriented explanatory text.
- Any other screen-gallery presentation below the homepage hero.

These are implementation/development previews, not content that belongs on the public landing page.

**C. Floating Stitch Navigator widget**

Remove the floating bottom-left widget displaying:

"Stitch 17 Screens 17/17"

It must not appear on the public homepage.

Inspect `StitchNavigator.jsx` and its mounting location. Remove the floating widget from the public-facing experience.

IMPORTANT: Do not delete the 17 screen components, their route definitions, or their existing functionality. Only remove the unnecessary floating gallery/widget from the public-facing homepage.

## 2. REDESIGN THE HOMEPAGE AS A CLEAN PREMIUM LANDING PAGE

The homepage must communicate FarmPay AI's purpose immediately.

Keep the existing brand identity and use the current design system:

- Forest green.
- Warm cream.
- Muted gold/amber.
- Natural agricultural imagery.
- Elegant serif headings.
- Clean, readable sans-serif body text.

Avoid a blue-heavy theme, excessive cards, unnecessary badges, and crowded sections.

## 3. MAIN NAVIGATION BAR

Keep the main navigation bar with:

- FarmPay AI logo and brand name.
- Home.
- Buyer Marketplace.
- Trust Passport.
- Demand Radar.
- Payments & PayPal.
- Logistics.
- Track Orders.
- Existing login/profile controls according to authentication state.

Make the navigation clean, properly aligned and responsive.

Do not introduce duplicate navigation bars.

## 4. HERO SECTION

Retain the existing agricultural hero background and improve its presentation.

Use a strong, simple heading:

"Connecting Farmers. Empowering Trade."

Supporting text:

"FarmPay AI connects farmers directly with buyers through transparent bidding, intelligent price comparisons and secure digital trade management."

Primary CTA:
"Explore Marketplace"

Secondary CTA:
"Create Produce Listing"

Feature CTA:
"Discover FairBid"

Ensure:
- The heading is fully visible.
- No content is clipped behind the navbar.
- Text has appropriate contrast.
- Buttons are aligned consistently.
- The hero has sufficient vertical breathing space.
- Background imagery is properly positioned.
- The layout works on desktop and mobile.

Reuse existing navigation destinations and functionality. Do not create duplicate pages or fake button actions.

## 5. HOMEPAGE CONTENT AFTER THE HERO

After the hero, create a minimal, professionally designed feature section introducing only the main FarmPay AI capabilities:

1. Voice-to-Trade — Create produce listings using speech.
2. FarmPay FairBid — Compare offers using actual net realisation.
3. Buyer Trust Passport — Understand buyer transaction history.
4. Digital Payments — Demonstrate the existing PayPal Sandbox payment workflow.

Use a clean four-column feature layout on desktop and a responsive layout on mobile.

Use concise descriptions, subtle icons, consistent spacing and restrained styling.

Do not display all 17 screen previews.

Do not add fake statistics, fabricated testimonials, or invented transaction metrics.

## 6. FOOTER

Keep or improve the existing footer with:
- FarmPay AI identity.
- Short platform description.
- Relevant navigation links.
- Contact/support information only where already configured.

Do not reintroduce the removed top support strip.

## 7. PRESERVE THE EXISTING APPLICATION

This is a homepage cleanup, not a full application rewrite.

Mandatory:
- Preserve all existing 17 screen components.
- Preserve all existing routes.
- Preserve login and registration.
- Preserve farmer, buyer and admin dashboards.
- Preserve marketplace, offers and order workflows.
- Preserve PayPal integration.
- Preserve existing AI functionality.
- Preserve existing backend APIs.
- Preserve the current React Router architecture.
- Do not migrate frameworks.
- Do not change the MySQL database.
- Do not introduce new backend modules.
- Do not remove working functionality.

The 17 screens should remain accessible through their existing appropriate navigation and direct routes, even though their gallery is removed from the homepage.

## 8. RESPONSIVE DESIGN

Check:
- Desktop.
- Tablet.
- Mobile.

Ensure:
- No horizontal scrolling.
- No overlapping navigation.
- No clipped hero text.
- No floating development widget.
- No excessive vertical whitespace.
- No unexpected duplicate content.

## 9. TESTING

After implementation:

1. Run `npm run lint`.
2. Run `npm run build`.
3. Open the homepage in the browser.
4. Verify the top support strip is removed.
5. Verify the 17-screen gallery is removed.
6. Verify the floating Stitch widget is removed.
7. Verify the main navigation works.
8. Verify the homepage CTAs navigate correctly.
9. Verify existing direct routes still work.
10. Verify mobile responsiveness.

## 10. DOCUMENTATION AND SAFETY

Save the exact prompt in `project_docs/phase_prompts/`.

Create a dated implementation report under `project_docs/implementation_reports/`.

Record test results under `project_docs/test_reports/`.

Update `project_docs/current_progress.md`.

Preserve previous documentation and the existing Git worktree. Do not discard uncommitted changes. Do not commit or push.

## FINAL DESIGN DIRECTION

The final homepage should feel like a professionally designed agricultural fintech product.

It should be:
- Clean.
- Minimal.
- Premium.
- Trustworthy.
- Easy to understand.
- Visually balanced.

A visitor should immediately understand what FarmPay AI does and how to access the marketplace.

**Do not show development galleries, implementation status, Stitch previews, or floating screen-navigation widgets on the public homepage.**

Make these changes now, inspect the result in the browser, and verify the build without disturbing the rest of the application.
