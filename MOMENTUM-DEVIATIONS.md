# Momentum deviation log

This log records every place the CommerceShield prototype departs from the Momentum design system rules, and the status of each. Momentum is the source of truth for all design updates in this repo.

## Source of truth

- Momentum repo (local snapshot): `../momentum` (an identical copy is in `Downloads/momentum`). It is not a git clone, so its version against `dev.azure.com/UPSProd4/P06SGit_UPSCapital/_git/momentum` is unknown. Refresh it before relying on newer rules.
- Rules applied, in this order:
  1. `momentum/AGENTS.md` hard rules 1 to 8
  2. `momentum/docs/enforcement.md`
  3. `momentum/.claude/skills/momentum-build/references/*` (MB-* rule IDs)
  4. `momentum/docs/ia-interaction-rules.md`. These IA rules are marked proposed, not adopted, so findings against them are labelled "proposed".
- Severity follows MR-01:
  - **Blocker:** breaks a hard rule or WCAG 2.2 AA, or ships a lookalike component.
  - **Major:** wrong component or token intent, a missing state, or a missing reduced-motion fallback.
  - **Minor:** cosmetic or consistency.

## Why the automated checks do not run here

The prototype is a prebuilt bundle (`assets/index-UmjNPosQ.js`, `assets/index-Dq8oPn-5.css`) edited by hand. Momentum's lint, `npm run momentum:audit` and CI only run inside the Momentum monorepo, so none of them check this repo. This log is the manual substitute (MR-03 grep fallback).

Layout for the CommerceShield additions lives in `assets/cs-momentum.css`. It holds token classes only: every value is a `var(--m-*)` token (35 tokens, all present in the theme), with px allowed only in a media query.

## Scan before and after the Nov 4, 2026 blocker fixes

Counts are for the bundle regions changed in the Nov 3 to 4 sessions.

| Region (function in the bundle) | Inline style literals | Raw hex | `rgba()` | Em dashes | Uppercase | Raw controls and svg |
|---|---|---|---|---|---|---|
| Product picker and Home flyouts (`ProductPicker`, `ProductMark`, `ConfigureCallout`, `RiskSetupFlyout`, `PreferenceFlyout`) | 45 → 0 | 40 → 0 | 2 → 0 | 6 → 0 | 1 → 0 | 3 buttons, 1 svg, 3 `role=` → 0 |
| Home setup flyouts after the Nov 4 rebuild (`InsuranceFlyout`, `ActivateRiskFlyout`, `ConfigureCallout`; product selection removed) | 0 | 0 | 0 | 0 | 0 | none |
| Configure wizard (`yP`) | 114 → 0 | 2 → 0 | 3 → 0 | 5 → 0 | 2 → 0 | 5 buttons, 1 select, 2 inputs, `role=switch` → 0 |
| Claims strategy (`CSClaimsStrategy`) | 186 → 0 | 32 → 0 | 11 → 0 | 3 → 0 | 3 → 0 | 14 buttons, 1 select, 4 inputs, 1 textarea, 14 svg → 0 |
| Orders (`OP_*`, `OpScoreChip`, `OpInsuredPill`, `OpDeliveryTag`, `aN`) | 29 → 0 | 1 → 0 | 1 → 0 | 0 | 0 | none |
| Home (`yF`) and Risk Intelligence tab (`pM`) | 2 → 0 | 0 | 0 | 1 → 0 | 0 | none |

Remaining inline `style` in these regions only sets the computed custom property `--cs-pct`, which enforcement rule 3 allows. Every em dash and uppercase transform is now gone from the whole bundle, including two pre-existing em dash empty-value placeholders in File A Claim, now "N/A" per MB-CNT-03.

## Findings

| ID | Severity | Rule | What was wrong | Status |
|---|---|---|---|---|
| DEV-001 | Blocker | Hard rule 3, MB-TOK-01, MB-TOK-03, enforcement rules 1 and 3 | Inline style literals, raw hex and `rgba()`, raw px | **Fixed.** Token classes in `cs-momentum.css` and library components. |
| DEV-002 | Blocker | Hard rule 6, MB-CNT-07 | Em dashes in UI copy | **Fixed.** Replaced with periods, commas or colons. |
| DEV-003 | Blocker | Hard rule 6, MB-CNT-09, D-045 | All-caps labels (product pills, "Closed loop", Configure labels, the "Illustrative" tag) | **Fixed.** Title Case words, no transform. |
| DEV-004 | Blocker | Hard rule 5, MB-CMP-01 | Lookalike controls | **Fixed.** See the replacement list below. |
| DEV-005 | Blocker | MB-THEME-05, hard rule 1 | Dead customer experience code with a real brand color and domain | **Fixed.** The ported module is deleted. |
| DEV-006 | Blocker | Hard rule 4, D-037 | Hand-drawn SVG graphics in the app | **Fixed.** Library Checkbox and Icon glyphs; product marks use the bundled coverage shields. |
| DEV-007 | Major | MB-A11Y-03 | No focus ring on lookalikes | **Fixed** by DEV-004. |
| DEV-008 | Major | MB-A11Y-06 | Targets under 24px | **Fixed** for app controls. The library Checkbox is 16px, which is library drift (known-drift.md, MB-A11Y-06), so it is reported once and not per use (MR-05). |
| DEV-009 | Major | MB-A11Y-02 | `ink-low` small text | **Fixed.** Small text uses `ink-medium`. |
| DEV-010 | Major | MB-MOT-01, MB-MOT-02 | Raw transitions with no reduced-motion fallback | **Fixed.** No custom transitions remain. Illustrations still pass the reduced-motion flag. |
| DEV-011 | Major | IA 7 (proposed), MB-FORM | Fields inside sentences with no visible label | **Fixed.** Select and Input with visible labels. |
| DEV-012 | Major | MB-TOK-08, IA 6.6 (proposed) | Product identity carried by tone color | **Fixed** in the app code. Products are words plus coverage shields. The Orders tab styling from DEV-019 is still open. |
| DEV-013 | Major | MB-TOK-08, IA 7 (proposed) | Selected states drawn with a stroke | **Fixed.** Library selected states, and a `selection-container-lowest` fill with no stroke for product panels. |
| DEV-014 | Major | MB-STATE-03 | No loading or error states for the new data regions | **Open.** The prototype has no async data, so there is nothing to wire a Skeleton or error state to yet. |
| DEV-015 | Major | IA 6.4 (proposed) | Row menu items hidden rather than disabled; destructive item not `tone="danger"` | **Open.** |
| DEV-016 | Major | IA 6.3 (proposed) | Destructive confirmation in a side flyout | **Open.** It needs a centred popup modal. |
| DEV-017 | Major | IA 6.3 (proposed) | Multi-step flyout without StepProgress | **Fixed, then superseded.** On Nov 4 the Home setup was rebuilt into single-step flyouts (Insurance Preferences, Activate Risk Intelligence), so no step progress is needed. |
| DEV-018 | Minor | IA 7 (proposed) | Save enabled with no changes | **Fixed.** "Save Changes" stays disabled until a setting changes. |

| DEV-019 | Major | MB-TOK-01, MB-BTN-05, MB-THEME-01, MB-THEME-04, IA 6.6 and 7 (proposed) | A Nov 4 change made outside the logged sessions: (a) an `index.html` `<style>` block (`.op-tab*`) overriding the segmented item with `!important`, raw hex, px, a gradient and an inset stroke; (b) a hand-built Delivery tag (`OpDeliveryTag`) using raw values and `color-mix`. It also rewrote every line ending in `index.html`. | **Fixed.** (b) The Delivery tag is the library Badge again (solid, small). (a) On Nov 5 the product tabs were removed at the user's request, so the `.op-tab` overrides were deleted from `index.html`. |
| DEV-020 | Minor | MB-CNT-02 | Headings, buttons and badges not in Title Case | **Fixed** in rebuilt regions. **Open:** the Risk Intelligence tab action reads "File a claim" (the app uses "File A Claim"). "You're now protected" was requested copy. |
| DEV-021 | Minor | MB-CNT-03 | Number and date formats | **Fixed:** money uses separators; the letter date reads "Nov 4, 2026". **Open:** the table's order date format ("01/04/23") predates this work. |
| DEV-022 | Minor | MB-BTN-02, MB-BTN-03 | Back as Secondary; an extra Primary-styled "Done" | **Fixed.** Tertiary Back, one Primary per footer, and Disclosure instead of "Done". |
| DEV-023 | Minor | MB-TYPE-01, MB-TYPE-02, MB-TOK-09, MB-TOK-11 | Off-scale type, radii and shadows | **Fixed.** Typography, radius and border tokens through classes. |
| DEV-024 | Minor | IA 6.6 (proposed) | Claim eligibility shown outside the side panel Banner | **Accepted.** The Risk Intelligence tab uses a library Banner under the score, at the user's request. |
| DEV-025 | Minor | MB-GAP-01, MB-CMP-01 | The Orders Coverage filter needs a coloured coverage shield beside each option. The filter menu item (`Vx` → `Ix`) only took an icon glyph name. | **Accepted.** The bundled filter menu now renders an optional `leading` element before the label, the same pattern Select options already use (`tS`). The label stays plain text for find and the trigger. Proposed library gap: "Filter and menu items accept a leading mark". |
| DEV-026 | Major | MB-TOK-08, D-272 | The compiled app stylesheet (`index-Dq8oPn-5.css`) had a prototype rule, `:root[data-brand][data-theme]`, that remapped every Selection token to the blue Secondary tokens. Every selected state (tabs, pagination, nav counts, nav indicator, checkboxes, choice cards, selected rows) showed blue instead of Momentum teal. The nav counts also set `countTone="secondary"` explicitly. | **Fixed (Nov 5).** The remap rule is removed and the two nav counts use the default (Selection) tone. Selected and active states now read the Momentum `selection-*` tokens (teal `#0a8080`). Status badges such as "In Transit" stay on the info status colour, as intended. |
| DEV-027 | Major | Hard rule 5, MB-CMP-01, MB-GAP-01 | The user asked for a slider for each band's Order Value Threshold, but this prototype bundle predates Momentum Slider and has no React Aria slider. | **Accepted, requested by the user (Nov 5).** `CsSlider` (app code) ports Momentum `packages/react/src/slider` faithfully: same anatomy (label at start, value in title-lg selection ink, typed editing per D-141, Material 3 track per D-149, the container ground per D-100), same tokens, reduced-motion fallback. A transparent native range input over the track provides pointer, keyboard (arrows, Home, End, Page Up and Down) and screen reader support, with the handle drawn at the native thumb's geometry. Replace with the library Slider when the prototype is rebuilt against the current `@momentum/react`. |
| DEV-028 | Minor | MB-CMP-01 | The exceptions If / Then list (`cs-exc`) is a token-styled layout around bundled Switch, Select, Input, Checkbox and Badge, not a Momentum Table. The rows hold form controls of varying height, which Table is not built for. | **Accepted (Nov 5).** Layout only: borders, padding and grounds come from tokens, and no component is restyled. The If and Then column header is visual only (`aria-hidden`), because each Switch label is a full sentence and each field has its own label. Rows are a `role="list"` named "Specific situations". |
### Nov 4, 2026: Configure journey merged with the published site

The Configure page now combines our content with patterns from the published site (`mproby-ups.github.io/CommerceShield_com`). It is built only from bundled components (Card with SectionHeader and card footer, StepProgress, Banner, Badge, Select, Input, Switch, Checkbox, DescriptionList, Matrix Card, Button) and token classes. The region scans clean: 0 style literals, 0 hex, 0 em dashes, 0 uppercase, 0 raw controls.

**Taken from the published site:**
- "Skip to Review" in the page header.
- Step progress with names and checkmarks.
- Each step framed as a card, with Back and "Next: …" in the card footer.
- A Live Preview aside: share of sample orders per action, updating as bands and exceptions change.
- "% of orders" on each risk band.
- Review summary cards with check lists and Edit.
- A "Connect Your Store First" warning gate.

**Kept from ours, overriding the published site:**
- 3 steps. Exceptions were a separate page inside step 1 until Nov 5; they now sit in step 1 as a collapsible list (see below).
- Chargeback-only claims.
- Save Changes instead of Activate, since activation happens in Home onboarding.
- The brand was the Delivery Solutions (`lynkup`) theme at the time. On Nov 5 the whole prototype moved to the Momentum default theme (gold); see below.

**Not adopted:**
- The "Your business" questionnaire. It is published-site content that ours does not have, and our content takes priority.

**Removed from Review:**
- The "Customer communications" setup check. The customer experience step it referred to no longer exists.


### Nov 5, 2026: Momentum default theme

The whole prototype now uses the Momentum default brand (`data-brand="momentum"`: primary gold `#fcc400`, font/base Roboto Flex). It is set once on the root element in `index.html` (MB-THEME-01, `docs/theming.md`), and Roboto Flex is loaded the same way as the Momentum Storybook (`apps/docs/.storybook/preview-head.html`).

No component or stylesheet needed a change, because every colour reads a semantic token. Secondary and tertiary actions and links stay blue in every brand (MB-BTN-05, MB-TOK-08), so blue text links are expected, not leftovers.

### Nov 5, 2026: Exceptions simplified (pattern from the published site)

The exceptions now follow the published site's "Adjust for specific situations (optional)" pattern, built in our style:
- They sit in the Risk Strategy step under the bands, inside a Disclosure titled "Adjust for Specific Situations (Optional) · N of 8 On". It opens when you come back from Claims or from Edit on Review.
- One If / Then list replaces the step 1 ChipGroup, the "How Exceptions Work" Banner and the three group cards (By Signal, By Customer, By Basket).
- Each row is a Switch with `layout="start"` (a documented Momentum Switch layout) and a plain sentence. Its Then fields (Select, Input, Checkbox, Badge) show only while the rule is on; otherwise the row reads "Off".
- The order follows the published site: customer, then basket, then signals. The footnote reads "When several apply, the strictest wins. Trusted customers are the one exception."
- Our content is kept: the 8 rules, their actions, the item types and the defaults (all on). The one-line hints under each rule were dropped to keep the list short.
- Rules with extra settings (trusted customers, basket value, high-theft items) put those settings in an indented "For" box. A decorative rail connects the Then action to them (see `CsFlow` below, part of DEV-028).
- High-theft item types are now Electronics, Jewelry, Apparel and Home Goods (Electronics and Jewelry on by default). A labelled Input, "Or for specific SKUs or Item IDs", takes comma-separated values.

### Nov 6, 2026: Claims setup matched to the published configuration

`CSClaimsStrategy` follows the published Claims step's eight If / Then rules, implemented with the bundled Table and existing Momentum controls:
- Claim filing is accepted within 30 days of delivery, with photos and a police or theft report requested by default; a signed statement is optional.
- Auto-approval requires a claim under $500, an order score of at least 700, and a trusted customer.
- Claims over $1,000 or customers with two or more claims in 90 days are sent to the team.
- Approved claims use a single Refund resolution; type-specific resolution categories were removed at the user's request.
- Email and SMS updates default on for Received, Under review, Approved, Resolved, and Denied.

**Nov 16 alignment:** The Configure Claims step now matches the published page's contained If/Then grid, receipt-icon heading, and Branch-style Then groups: action first, followed by separate setting cards connected by the marker rail and rounded elbows. Filing-window, claim-value, and score options, accessible group labels, team-review timing, and defaults match the reference. The Branch anatomy is token-styled because this static bundle does not include the library component.

**Nov 17 refinement:** Recommended Risk Strategy now presents each band as a responsive If/Then row with an editable numeric currency threshold and action. The category name stands alone; the score range is a status-colored tag, and order share sits beside it on one secondary line. Threshold inputs use the matching success, warning, or error container tint. The helper explains that orders above the threshold receive additional scrutiny without asserting a specific action. The illustrative High Risk band is 0–399 with a $300 threshold. Save Changes remains on the existing Review step. Review keeps the Risk Strategy summary, removes the duplicate outcomes card, summarizes each active exception as an If/Then rule, and groups Claims settings by policy decision with Edit links.

The Review card summarizes the same values. Claim rule contents use `cs-claim-*` token classes for wrapping and spacing; they do not restyle the bundled Table or controls.

**Condition rails (`CsFlow`, `cs-flow`):** the elbow boxes are gone. Exception Then conditions use one continuous rail through round nodes. The rail is drawn with token borders, and its nodes take the rule tone (success or warning) or the low ink. Nodes sit at a label's centre, or at a Switch control's centre (via `:has`). The rail is decorative; every item keeps its own label. This is part of DEV-028. Claims use the bundled Table for their If / Then grid.
### Lookalike replacements (DEV-004)

| Was | Now (bundled Momentum component) |
|---|---|
| Switch built from a button (Configure exceptions, Claims notifications) | Switch |
| Checkbox built from a button or span (product include, dispute reasons, evidence, recipients, rule toggles) | Checkbox |
| Radio chips for band actions | Select with leading Icon glyphs |
| Radio cards (claim type, reimbursement, payout) | ChoiceCardGroup and ChoiceCard |
| Toggle chips (item types, evidence, recipients) | Checkbox |
| Native `<select>` | Select |
| Native number `<input>` | Input, with a visible label |
| Native range `<input>` (band threshold) | Port of Momentum Slider, `CsSlider` (DEV-027) |
| Step pills and stage tabs built from buttons | StepProgress (the step 1 ChipGroup was removed on Nov 5) |
| Group cards, rule panels, letter preview | Card (CardContent), with `headerBand` and SectionHeader |
| Expanding rule groups with a custom "Done" button | Disclosure |
| Message panels ("How exceptions work", risk notice, "Closed loop", callouts, eligibility strip) | Banner (info, neutral or success) |
| Status pills (product, score, insured, delivery) | Badge, plus product marks with VisuallyHidden labels |
| Clickable div with `role=button` | Plain content; inclusion is the Checkbox |
| Raw text button ("Change") | Button, tertiary small |
| Review stats | Matrix Card (`Hb`) |
| Read-only rows (estimates, setup checks) | DescriptionList |

### Accepted custom graphics (decorative, token-styled, with text alternatives)

- **Score Band Distribution bars (Configure):** the same percentages are shown in text.
- **Inline score bar with the 700 marker (Orders):** the eligibility is also in hidden text and the title.

## Library gaps

Existing `momentum/GAPS.md` entries these findings depend on: G-011 (choice chip group), G-029 (Score Display), G-067 (text button in link style), G-072 (Switch), G-074 (Select), G-086 (product option card), G-090 (Banner).

Proposed new entries. These are not written to `momentum/GAPS.md`, because the local copy is a snapshot. Add them in the real repo.

### Proposed: Slider missing from the prototype build
- **Severity:** moderate
- **Where:** CommerceShield Configure band threshold
- **Rule:** MB-GAP-01
- **Finding:** Slider is exported in `packages/react`, but this prototype bundle predates it. Since Nov 5 the prototype carries a faithful port (`CsSlider`, DEV-027) as a stopgap.
- **Library implication:** rebuild the prototype against the current `@momentum/react`
- **Proposed fix:** republish and rebuild, then restore the threshold slider with typed input (WCAG 2.5.7).

### Proposed: score with a threshold marker
- **Severity:** minor
- **Where:** CommerceShield Orders Protection column
- **Rule:** MB-GAP-01
- **Finding:** Score Display has no compact inline size with a threshold mark, so the prototype draws a small token-styled bar.
- **Library implication:** Score Display variant
- **Proposed fix:** an inline size of Score Display with an optional threshold.

### Proposed: inline sentence fields
- **Severity:** minor
- **Where:** CommerceShield exception and claim rules
- **Rule:** MB-GAP-01, MB-FORM
- **Finding:** Rules read best as sentences with a value inside ("If the basket is over $1,000"). The prototype now uses a Switch or Checkbox with a labelled Input beside it, which is longer.
- **Library implication:** pattern or Input variant
- **Proposed fix:** a compact Input and Select whose label is the surrounding sentence.

## Working agreement

From Nov 4, 2026, every design update in this repo follows these steps:

1. **Look up before building**, in the order set by `momentum-build`:
   1. Storybook manifest, or `packages/react/src/index.ts`
   2. Tokens
   3. Rules
   4. `GAPS.md`

   Use only components that exist in this bundle, and only tokens defined in `assets/index-Dq8oPn-5.css`.
2. **No raw values, no lookalikes, no em dashes, no all caps.** Layout goes in `assets/cs-momentum.css` with tokens only. If the library lacks something, use the closest component and add a row to this log.
3. **Scan before calling it done.** Before reporting a change, scan the changed region for hex, `rgba()`, px literals, `style:{`, raw `button`, `select` and `input`, `role=`, em dashes and uppercase. Record any accepted exception here, with its rule ID.
4. **Requested deviations.** When a design request would break a rule, say so first, then log the deviation if the request stands.
