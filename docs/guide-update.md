# Osaka Guide — stay-as-base update (handoff notes)

## Concept
`tour-guide.html` now reads **ここを拠点に、大阪を楽しむ。** The guest picks one stay as their base, and
every chapter describes things to do and ways to travel from that stay. No chapter promotes a
different stay. The five rail items (この宿から / 近所を楽しむ / 少し足をのばす / 一日のおでかけ / 暮らしの便利帳)
show reading progress through the guide. They are not a day-by-day itinerary.

The design rule for a single, fixed base is internal: the page copy does not repeat it. The
customer-facing copy stays inviting, and the idea of returning to the stay appears only once, in
the 一日のおでかけ heading.

## Customer-facing copy rules (after review, 2026-09-24)
- Customer copy must not describe internal process. Don't write "our document has no list" or
  "not re-verified", and don't show a source note on every row.
- Each route row shows only the destination and its time. Two qualifiers stay visible when the
  time depends on them:
  - For times counted from a station: "…駅から約N分（宿から駅までの徒歩は含みません）".
  - For poster times: "出発地点の明記なし・目安".
- The source of each time (Google Maps, information from the stay, route planners) appears only
  inside the collapsed details. The page footer carries a single line giving the information
  date (2026-09-24) and a reminder to check timetables.
- If a stay has no restaurant list, the restaurant subsection is left out. Everyday shops are
  covered in 暮らしの便利帳.
- If a stay's address is unconfirmed (Harmony Garden), the address row is left out. The area
  label and the owner's map link stay.
- Photo labels: `assets/osaka/shisaibashi.jpeg` shows a night shopping street with a large crab
  sign, but the street is not confirmed. On this page it uses the generic alt
  `guide.photo.streetAlt` ("夜の大阪の繁華街のイメージ写真") and has no caption. The shared key
  `experience.image2Alt` is still used on the homepage and was not changed there.
  `streetscape_1.jpg` clearly shows the 通天閣 sign and keeps its Shinsekai label.

## Files
| File | Role |
| --- | --- |
| `js/guide-data.js` (new) | All guide facts per stay (keyed by the StayData ids `tea, zen, pine, literature, harmony, art, furukawa`), places + Google Maps queries, restaurant lists, shared day trips, legacy hash map. |
| `js/tour-guide.js` (new) | Tabs (APG, arrow/Home/End keys), sticky base bar + `<select>`, `?stay=` URL/history, remembered base (`localStorage["yusei-guide-stay"]`), rail `aria-current`, entry motion, re-render on `yusei:langchange`. |
| `tour-guide.html` | Hero text changed; the old four area sections were replaced by the selector + guide body. The header, footer and booking CTA were left alone. |
| `css/tour-guide.css` | Rewritten for the new layout. It keeps the hero modifier, the tokens and the editorial photo/copy alternation. |
| `js/i18n.js` | Added `guide.*` UI keys and `stayTeaser.ctaAriaStay` in all 5 languages. Changed the `guidePage.hero.*` and `guidePage.metaDescription` text. |
| `js/stay-detail.js` | The detail-page teaser now links to `../tour-guide.html?stay=<id>`. |
| `js/stay-data.js` | Comment only. |

## URL behaviour
- The page reads `?stay=<id>`. Clicking a tab or using the base-bar select pushes a history entry, arrow keys replace the current entry, and Back/Forward re-render the page.
- With no `?stay`, the page opens on the last base the guest chose, or on `tea` if there is none. An invalid id is treated as if there were no `?stay` parameter.
- Old anchors still work. `#shinsekai` and `#namba` open `tea`, `#bay` opens `pine`, and `#kaizuka` opens `furukawa`; each scrolls to the selector. `#areas` scrolls to the selector.
- Chapter anchors are `#guide-from|near|further|day|daily`. The page keeps the current chapter when the language or the stay changes.

## Source provenance
- The facts come only from the owner's document "Yusei Stay 各民宿周邊景點攻略（網頁資料整理）", dated **2026-09-24**. That document reports its own Google Maps checks made at noon that day, plus figures from the stays' Word introductions and posters. **None of these figures were re-verified for this update.**
- Every time in `js/guide-data.js` records its source in `src` (`gm`, `gmNear` + `srcStay`, `doc`, `poster`, `web`). The page shows this source only inside the collapsed details, in customer wording.
- Times that start at a station say so and add "the walk from the stay to the station is not included". Poster times say that the starting point is not specified. Both qualifiers stay visible.
- Map links: stays with a confirmed address get Google Maps directions from that address. Harmony Garden gets destination searches only. Restaurant links are name + address searches; none of them claim to be a verified pin.
- Photos: the chapter images are the stays' own `room_picture_*` files, with alt text "〈name〉の実際の写真". The city chapter uses the existing area images (Shinsekai street, Dotonbori, the USJ globe) with their existing area-level alt text. There are no photos of Nara, Kyoto, Kaiyukan, Mizuma-dera or any restaurant, so none are shown.

## Deliberately NOT published (still unconfirmed — ask the owner)
1. **Harmony Garden street address** (市岡1-23-19 is from the Google business listing and the owner has not confirmed it). The address row is left out, and the page shows only the area label and the owner's map share link. The page also never uses this address as a directions origin.
2. **Art Home restaurant ratings** (4.8 / 4.2 / 4.0; the rating platform is unknown). Ratings were left out. The source's "open from 5 pm" was also left out, because opening hours are not published. No street addresses are given for these three restaurants; the page shows the source's "about 1 min on foot".
3. **Furukawa House natural onsen and horse-riding-club restaurant** (unnamed; the source only says "right nearby"). Both were left out.
4. Art Home: the times to Soraniwa Onsen, AEON Mall and Kyocera Dome are marked "待查" (to be checked) in the source, so they are listed without times.
5. Harmony Garden: the poster times (USJ, Osaka Castle, Shinsaibashi, Kaiyukan) have no stated starting point, and they are labelled that way on the page.
6. Awaji highway bus: the source says the times were not checked trip by trip, and the page repeats that note.

## Interpretation calls to review
- The source's "摩天輪" (ferris wheel) near Harmony Garden is shown as "天保山の観覧車", and the map query is 天保山大観覧車. "Legoland" is shown as LEGOLAND Discovery Center Osaka. "臨空城 Outlet" is shown as りんくうプレミアム・アウトレット. "Aeon / Dome" is shown as イオンモール大阪ドームシティ・京セラドーム大阪. "漁協青空市場" is shown by its plain name, with a plain search.
- Zen Garden's list of drive destinations follows its own paragraph in the source, so AEON / Dome is not included for Zen.
- The Harmony walk to Bentencho Station is shown as 約16–17分: the source table gives 16, and its Google Maps check gave 17.
- The walking times in `js/stay-data.js` (detail pages) sometimes differ from this guide. For example, Pine's detail page says 10–12 min to the Metro station, but the guide says 15–20 min to "弁天町駅". The detail pages were not changed.

## Maintenance
Add or change facts only in `js/guide-data.js`, and follow the `{ mode, t, unit, from, src }` shape described at the top of that file. Never put a time in without its source. UI copy goes in `js/i18n.js` under `guide.*`, in all five languages.
