# About Us partner section — implementation handoff

Date: 2026-10-16. User is PM; Codex plans/reviews; Claude implements.

## Scope

Add a `#partners` section to `about.html`, between the seven homes list/philosophy section and `#booking-cta`. Follow the user's supplied four-category reference layout, rendered in this site's cream/brown/olive serif style. Preserve all current edits, headers, footers, page content, photo ring, and other features. Do not edit other pages. No commits or deployment.

Allowed implementation files: `about.html`, new `css/partners.css`, and new `partners.*` dictionary entries in `js/i18n.js`. This handoff and image preparation are already supplied. No extra JS framework or new dynamic rendering.

## Content and verified destinations

Heading: パートナー / Our Partners / 合作夥伴 / 合作伙伴 / 파트너. Optional small English eyebrow OUR PARTNERS; no HARUKAS STAY branding. Categories and one-line descriptions translated in all five existing languages. Official company names remain exactly as provided, not invented translations. Do not add marketing guarantees, discounts, or unsupported services.

Main row four groups (each group heading has a small decorative outline category icon, aria-hidden, inline SVG is fine):

1. Project development / 項目發展商: **樹都發展有限公司**. Plain company text, no logo or destination verified. Subtle gold/brown outline around this card as in reference. Do not fabricate a tree logo or use the whole screenshot.
2. Japan real estate / 日本不動產: **友誠株式会社**. Short description 日本不動產投資與資產管理 (localize). Text brand treatment. Facebook: `https://www.facebook.com/p/友誠株式会社日本不動產移居日本-61572866384436/` — existing site/user-supplied URL.
3. Design and renovation / 設計及裝修工程: **株式会社奢翹** with description 日式空間設計與裝潢; then thin divider; **株式会社 田中工務店** with description 日式建築與裝修. Both text only, no confirmed URLs. Do not choose among unrelated same-name Tanaka companies.
4. Overseas property / 海外房地產: **旗艦店海外房地產** / The Flagship Overseas Real Estate, then divider; **旗王海外房地產** / The King Overseas Real Estate. Both text only; no verified destinations. Do not invent official social handles.

**Explicit exclusion: 大成不動產株式会社 (also 大成不動産株式会社) must not appear.**

Under main row, a smaller matching two-card row headed 旅のパートナー / Travel Partners / 旅遊夥伴 / 旅游伙伴 / 여행 파트너:

- **Pit Chan Rentalcars Osaka**: text logo fallback; service label レンタカー / Car rental / 租車 / 租车 / 렌터카. Link `https://www.pitchanrentalcarsosaka.com/` with localized Official website link. No pricing or guarantees.
- **番茄出行 TOMATO GO**: provided logo `assets/partners/tomato-go-logo.webp` (1600×620). Render `object-fit:contain`, never crop/redraw. Link `https://www.facebook.com/tomatogohk/` with localized Facebook CTA. Service scope not confirmed; do not assign SIM/insurance/logistics claims. Company name also visible as real text; image may have empty alt when adjacent text duplicates.

Unknown links: show polished, readable text, not a disabled button or website-facing 'pending' warning. No fake href="#", no Facebook search results, no cursor pointer or lift effect suggesting click. Add concise HTML maintainer comments at the relevant entries to indicate URLs can be added when owner supplies them. Confirmed links use real `<a target="_blank" rel="noopener noreferrer">`, clear label and external-arrow cue. No fake logo initials or decorative stock company marks.

## Layout and interaction

- Reuse `.container` and existing design tokens. Plenty of breathing room but not huge blank logo placeholders for text-only companies.
- Main four-column grid at >=1100px; two columns intermediate; one column <=600px. Consistent card heights within desktop row, headings above cards like reference. Use `minmax(0,1fr)` and sensible text wrapping so long names fit at 320px.
- Main cards use warm white, fine borders, restrained corner radius and no harsh shadow. Descriptions smaller but readable, with sufficient contrast. Thin separators between two companies. No multi-line cramped headings at normal 1440px.
- Travel row desktop two columns; single on phone. Tomato logo in a white inset, max width around 220px, not a giant poster. Maintain balanced row with text-only Pit Chan card.
- Real links respond on hover and focus-visible with olive/brown color, underline/arrow movement, short 160–220ms transitions. Keyboard focus must be clear. No click interaction on unlinked text.
- Section may use site's existing reveal system only if reliably visible. Respect prefers-reduced-motion. Do not hide partner content without JS; no looping autoplay.
- All new reader-facing generic copy uses `data-i18n` and has complete ja/en/zh-Hant/zh-Hans/ko entries. Static default Japanese markup. Preserve names and correct URLs through language switching.

## Review gates

Inspect desktop + 390px and 320px. Verify all eight companies appear, exclusion, 3 confirmed links, image resolution, no overflow, all five translations, keyboard focus, and no modifications outside intended files. Existing git dirty state is unrelated and must remain intact.

## Sources and limitations

User's image `harukas-stay-partner-reference.png` supplies company names and categories; user's `tomato-go-logo.png` supplies logo. Existing `js/social-config.js` supplies Yusei Facebook. User supplies Tomato Facebook and Pit Chan website. Public search did not conclusively identify other five companies' Facebook accounts. Additional unknown service-provider names (SIM, insurance, logistics) are not fabricated or displayed.
