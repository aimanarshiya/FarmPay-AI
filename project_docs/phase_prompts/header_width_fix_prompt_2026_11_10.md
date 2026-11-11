# URGENT FIX — FARM PAY AI HEADER WIDTH, ALIGNMENT AND OVERFLOW

The latest header redesign has introduced a serious visual bug. Refer to the latest screenshot.

The header does not occupy the full browser viewport. It stops approximately 150px before the right edge, leaving an ugly empty area. The logo image is clipped, navigation is cramped, and the market ticker is cut off.

Fix this immediately.

## 1. FIX THE FULL-WIDTH HEADER

Inspect the actual header component, its parent containers, global CSS, and layout wrappers.

Identify and fix the root cause of:
- Header width being smaller than the viewport.
- Unwanted right-side blank space.
- Fixed widths or restrictive max-width values.
- Incorrect flex sizing.
- Horizontal overflow.
- Parent containers constraining the header.

Requirements:
- Header must span 100% of the viewport width.
- Use `width: 100%` and appropriate `box-sizing: border-box`.
- Remove inappropriate fixed widths and max-width constraints from the global header wrappers.
- Do not use arbitrary negative margins or absolute positioning to hide the problem.
- Ensure the page itself does not create horizontal scrolling.

## 2. FIX BRAND LOGO AND IMAGE

- Display the crop photograph completely inside its logo container.
- Do not crop the important subject or cut off the image at the screen edge.
- Keep the FarmPay AI brand name and subtitle properly aligned.
- Give the logo a consistent size and spacing.

## 3. FIX NAVIGATION ALIGNMENT

Keep the existing navigation:
Home, Buyer Marketplace, Trust Passport, Demand Radar, Payments & PayPal, Logistics, Track Orders.

- Align all items vertically.
- Give navigation adequate horizontal spacing.
- Prevent labels from being clipped.
- Avoid awkward wrapping on desktop.
- Keep the active navigation indicator.
- Keep profile, role and sign-out controls fully visible.
- Do not allow the navigation to push outside the viewport.

Use a flexible layout with sensible sizing:
- Brand section.
- Navigation section.
- Language selector.
- User/account section.

Allow the navigation to adapt when the viewport becomes narrower. Use a proper mobile menu when necessary rather than shrinking everything until it becomes unreadable.

## 4. FIX MARKET TICKER

The market ticker below the header is also clipped.

- Make it full width.
- Align its content correctly.
- Prevent text from beginning outside the viewport.
- Ensure the scrolling or static ticker does not cause horizontal page overflow.
- On mobile, use a compact responsive presentation.

## 5. RESPONSIVE VERIFICATION

Test at these viewport widths:
- 1440px
- 1366px
- 1280px
- 1024px
- 768px
- 390px

At every width:
- Header remains within the viewport.
- No right-side blank strip caused by a constrained wrapper.
- No clipped logo.
- No overlapping navigation.
- No clipped account controls.
- No horizontal scrollbar.

## 6. PRESERVE FUNCTIONALITY

Do not change:
- React Router.
- Authentication.
- Role-based navigation.
- Language switching.
- Marketplace.
- PayPal.
- Existing page routes.
- Backend APIs.
- MySQL.
- The 17 approved screens.

Do not redesign the entire website again. Fix the shared header and its layout only, along with any directly related ticker overflow.

## 7. VERIFY THE ACTUAL BROWSER RESULT

After fixing:
1. Run frontend lint.
2. Run production build.
3. Open the homepage in the browser.
4. Inspect the header at desktop and mobile widths.
5. Visit Marketplace and Demand Radar to confirm the shared header works there too.
6. Check that no horizontal overflow remains.

Save the prompt and a dated implementation/test report under `project_docs/`. Update `project_docs/current_progress.md`. Preserve existing uncommitted work. Do not commit or push.
