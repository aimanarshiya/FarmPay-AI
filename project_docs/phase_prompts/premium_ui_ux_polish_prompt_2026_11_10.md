# FARM PAY AI — PREMIUM UI/UX POLISH AND VISUAL REFINEMENT

Act as a senior product designer and frontend engineer specialising in world-class agricultural fintech platforms.

The existing FarmPay AI application is working. I have provided four screenshots showing the current Home/FairBid page, Buyer Marketplace, Demand Radar and header.

Your task is to improve the visual quality and usability of these pages while preserving all existing application functionality.

This is a targeted visual refinement, not a project rewrite.

## 1. GLOBAL HEADER — REDESIGN ACROSS ALL PAGES

The current header looks cramped. Redesign it to feel premium, professional, clean and internationally competitive.

### Brand area
- Keep the FarmPay AI brand name.
- Add a real, high-quality agricultural crop photograph beside the brand/logo.
- Use a compact, elegant image treatment, such as a rounded square or carefully cropped organic shape.
- The image should be an actual crop photograph, not an artificial-looking illustration.
- Keep the brand subtitle readable but visually secondary.

Use existing agricultural images in the project assets first. Do not break image paths or introduce unnecessary external dependencies.

### Navigation
Keep these existing destinations:
- Home
- Buyer Marketplace
- Trust Passport
- Demand Radar
- Payments & PayPal
- Logistics
- Track Orders

Improve:
- Horizontal spacing.
- Alignment.
- Typography.
- Active navigation indicator.
- Hover states.
- Mobile navigation.
- Header height and proportions.

Avoid wrapping navigation labels awkwardly across several lines on desktop.

### Language selector
Redesign the existing EN / TE / HI language selector.

Requirements:
- Elegant segmented-control appearance.
- Properly aligned language labels.
- Clear selected-language state.
- Subtle border and background.
- Consistent spacing.
- Accessible contrast.
- Functional language switching.

Do not break existing translations or language preference behaviour.

### Login, signup and profile controls
When the user is logged out:
- Show a prominent but elegant Login button.
- Show a clear Signup / Get Started button.
- Use forest green for the primary CTA and restrained secondary styling for Login.

When the user is logged in:
- Preserve the current role indicator.
- Show the user's name and profile access.
- Provide a clear Sign Out action.

Do not display Login and Signup buttons to an already authenticated user in a way that conflicts with the profile controls.

Make the header responsive and consistent across all pages.

## 2. FAIRBID PAGE — CENTERED, BEAUTIFUL INPUT FORM

The first screenshot shows a poorly positioned FairBid form with its fields clustered toward the left.

Redesign this page.

### Page heading
Use:
"Instant FairBid & AI Analysis"

Supporting description:
"Compare competitive buyer offers and understand your actual net earnings before making a selling decision."

### Form layout
Place the entire form in a centered, premium card.

Include:
- Crop selection.
- Quantity in kilograms.
- Mandi / cluster location.
- Find Competitive Buyer Offers button.

Requirements:
- Consistent field widths.
- Clear labels.
- Proper spacing.
- Rounded but restrained corners.
- Subtle shadows.
- Good contrast.
- Attractive focus states.
- Responsive layout.
- No controls floating independently on the left.

The CTA should be visually prominent and aligned with the form.

Preserve the existing FairBid calculation and Gemini integration. Do not replace working logic with static sample output.

Keep the FAQ section below the form, with appropriate spacing.

## 3. BUYER MARKETPLACE — DISPLAY 4–5 CROP LISTINGS

The second screenshot shows only one crop listing and excessive empty space.

Improve the marketplace layout.

Display approximately 4–5 available crop listings when the existing data supports them.

Use available real database/API records first.

Each listing card should have:
- Crop photograph.
- Crop name.
- Farmer name.
- Available quantity.
- Expected or minimum price per kg.
- Location.
- Listing status.
- Details action.
- Submit Price Bid action.

Possible crop categories include:
- Rice.
- Red Chilli.
- Cotton.
- Turmeric.
- Maize.

Use genuine existing listing records whenever available.

If there are not enough real records, use clearly labelled illustrative demo listings for the visual demonstration. Never present fabricated listings as verified real farmer inventory. Do not allow demo records to create real offers or orders.

### Layout
- Use a responsive card grid.
- Three columns on wide desktop screens where space permits.
- Two columns on medium screens.
- One column on mobile.
- Consistent card heights.
- Good crop-image proportions.
- Readable financial details.
- Attractive buttons.
- Proper spacing.

Keep the existing search and location filters functional.

Do not break buyer offer submission or existing database integration.

## 4. DEMAND RADAR — REALISTIC GEOGRAPHICAL MAP

The third screenshot currently contains a schematic-looking map.

Make it look like a real agricultural procurement and demand intelligence map.

Use an existing mapping library if available.

Do not migrate frameworks or add unnecessary dependencies.

### Geographic appearance
Use a realistic geographic basemap centred on the relevant Andhra Pradesh and Telangana region.

The map should show:
- Realistic roads and geographic boundaries.
- Recognisable city/mandi locations.
- Geographic positioning of procurement clusters.
- Attractive location markers.
- Clear legends.
- A clean zoom experience.
- Useful map tooltips or marker details.

Use grounded locations such as Guntur, Vijayawada, Hyderabad, Warangal and other relevant procurement locations only where appropriate to the existing data.

### Demand visualization
Use distinct marker styles for:
- High demand.
- Supply availability.
- Critical deficit.
- Procurement hubs.

Selecting a marker should show a detail panel with:
- Location.
- Commodity.
- Available or demanded quantity, when known.
- Offer information, when known.
- Relevant explanation.

Do not invent real-time demand, actual institutional buyers, escrow guarantees or live telemetry.

If the displayed geographic information is illustrative, label it as demonstration data.

### Visual refinement
- Improve map size.
- Use a clean panel layout.
- Avoid cluttered markers.
- Keep the procurement cards visually consistent.
- Ensure the map and cards work on mobile.

Preserve existing Demand Radar functionality and navigation.

## 5. VISUAL DESIGN SYSTEM

Apply a consistent premium design system across these pages.

Colours:
- Forest green.
- Warm white.
- Cream.
- Muted gold/amber.
- Restrained terracotta accents.

Typography:
- Elegant serif headings.
- Highly readable sans-serif body text.
- Consistent font weights.
- Clear information hierarchy.

Design qualities:
- Spacious layouts.
- Consistent margins.
- Professional cards.
- Subtle shadows.
- Carefully selected icons.
- Clear buttons.
- Accessible contrast.
- Natural agricultural imagery.

Avoid:
- Excessive rounded boxes.
- Too many badges.
- Cluttered navigation.
- Oversized blank spaces.
- Inconsistent card dimensions.
- Fake statistics.
- Decorative controls without functionality.
- Generic AI-generated-looking illustrations.

## 6. PRESERVE EVERYTHING THAT ALREADY WORKS

Mandatory:
- Keep all 17 approved Stitch screens.
- Keep all existing routes.
- Keep React Router.
- Keep FastAPI.
- Keep MySQL.
- Keep PayPal Sandbox.
- Keep authentication and role-based access.
- Keep existing marketplace APIs.
- Keep listing and offer functionality.
- Keep FairBid calculations.
- Keep AI integrations.
- Keep existing translation functionality.
- Do not create additional backend modules.
- Do not change the database schema.
- Do not remove working features.

Only make targeted visual and usability improvements.

## 7. TESTING

After the changes:

1. Run frontend lint.
2. Run frontend production build.
3. Open Home.
4. Open FairBid.
5. Open Buyer Marketplace.
6. Open Demand Radar.
7. Check the header on all these pages.
8. Verify Login/Signup behaviour when logged out.
9. Verify profile controls when logged in.
10. Test language switching.
11. Verify all marketplace cards and buttons.
12. Verify FairBid form submission.
13. Verify Demand Radar marker interactions.
14. Test desktop and mobile layouts.
15. Confirm the other existing routes still work.

## 8. DOCUMENTATION AND SAFETY

Save this exact prompt under `project_docs/phase_prompts/`.

Create a dated implementation report under `project_docs/implementation_reports/`.

Save test results under `project_docs/test_reports/`.

Update `project_docs/current_progress.md`.

Preserve previous reports and the existing Git worktree.

Do not discard uncommitted changes.

Do not commit or push.
