# POLA bath amenity placement

The user confirms their stays use POLA products and asks us to choose the placement and provide Japanese/Korean translations from their Chinese/English copy. Implement an elegant editorial brand feature in the current website; Codex will review your actual implementation.

## Scope and preservation

- Preserve all existing uncommitted changes, including the new hotel preview banner/dialog and translations.
- Homepage: insert a modest photo/text section after `#features` and before `#experience`. Cream surface, warm brown/olive accents, existing serif typography. Approximately 340–400px tall desktop, photo about one third of content width, copy right with breathing room. On phone stack image and copy; keep photo at max-width about 360px to avoid dominating page.
- All seven stay detail pages: show a compact version inside the Amenities tab, after the key icon row and before equipment groups. All seven must show it, including Furukawa whose amenities data is null; keep the existing unknown-equipment note after the confirmed POLA information. Do not change existing property facts or equipment lists.
- Use shared `css/pola-amenities.css`, link from index and all stays/*.html. Add a small DOM builder in js/stay-detail.js for the detail variant, rendered with existing language-change lifecycle, rather than separate copy per property. Use h2 homepage, h3 detail.
- No new JS for decorative marketing block, no fake clickable card, no shopping links, no partnership/endorsement, certifications or skincare claims. No extra package, commit, push, deployment or agents.

## Exact supplied image

Local asset: `assets/amenities/pola-shower-break-products.webp` (1080x1123). Use `../assets/...` in detail pages. Preserve original file pixels. It is a screenshot: top y0–155 is app chrome and bottom has a camera control at about y1080. Present only the photo with CSS clipping: a relative overflow-hidden image frame aspect-ratio 1080 / 920; image width:100%, max-width:none, height:auto, position:absolute, left:0, top:calc(-156 / 920 * 100%) (or equivalent supported percentage -16.956522%). This shows y156–1076 without the toolbar or camera icon. Do not use object-fit:cover to crop more horizontally; keep all three products and their labels visible. Do not stretch or generate new bottles. Use meaningful localized alt. Lazy loading with explicit source width/height. The source screenshot already cuts off bottoms; do not invent missing parts.

## Content: add 4 new pola.* keys per language to existing i18n dictionaries

Brand heading: POLA (literal, stable). No need to repeat the series or manufacture details. All supporting text localized.

| Key | ja | en | zh-Hant | zh-Hans | ko |
| --- | --- | --- | --- | --- | --- |
| eyebrow | バスアメニティ | BATH AMENITIES | 洗浴用品 | 洗浴用品 | 욕실 어메니티 |
| message | 日本で人気のブランド「POLA」で、旅のひとときをより上質に。 | Use the popular Japanese brand POLA to make the journey more refined. | 使用日本人氣產品 POLA，讓旅程精緻。 | 使用日本人气产品 POLA，让旅程精致。 | 일본의 인기 브랜드 POLA와 함께, 한층 더 품격 있는 여행을. |
| availability | 各宿にPOLAのバスアメニティをご用意しています。 | POLA bath amenities are provided at every stay. | 每間民宿均提供 POLA 洗浴用品。 | 每间民宿均提供 POLA 洗浴用品。 | 모든 숙소에 POLA 욕실 어메니티를 제공합니다. |
| imageAlt | POLAのシャンプー、コンディショナー、ボディソープ | POLA shampoo, conditioner and body soap | POLA 洗髮水、護髮素及沐浴露 | POLA 洗发水、护发素及沐浴露 | POLA 샴푸, 컨디셔너, 바디워시 |

Homepage uses existing data-i18n/data-i18n-attr. Detail DOM builder calls i18n.t directly so existing renderAll() updates it. Ensure no duplicate blocks on repeated language/tab changes. No separate language state.

## Visual/interaction details

- A restrained thin divider above/below, not a loud sale banner. Product golden tone provides the accent. Clear product image, short text, no unnecessary CTA.
- Use existing palette tokens; preserve relative image frame crop at all widths and proper wrapping at 320px. Desktop compact detail image ~240–300px wide; phone centered max-width 300px.
- Avoid implying click affordance on static image. Existing tab transition can animate detail content; no autoplay or timers.
- Do not add once-only reveal behavior to new section (user dislikes one-shot interactions); always readable, use existing smooth flow.

## Small previous-banner cleanup

Move #0E1A33 new night-blue colour into a named CSS variable in css/variables.css and reference it from css/project-preview.css. This follows the documented token convention. Do not otherwise redesign the accepted banner.

## Allowed edits

index.html, js/i18n.js (new pola keys only), js/stay-detail.js (POLA builder/insertion only), stays/*.html (stylesheet link only), new css/pola-amenities.css, css/variables.css (one new colour token), css/project-preview.css (reference new colour token). Do not change other files.

Implement using Read/Edit/Write/Glob/Grep only; no commands, no agents, no packages, no deployment. Report changes honestly and any concerns. Planner handles browser and syntax review.
