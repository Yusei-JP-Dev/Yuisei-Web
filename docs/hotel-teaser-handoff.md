# Homepage hotel project preview

## Scope
Add a compact promotional banner at the start of the homepage main content, between the existing header and Hero. The user supplied the complete poster and wants a small preview of a future project. Preserve the existing Hero, navbar, logo, pages, animations and all prior uncommitted edits. No commit, push, deployment, packages, external requests, new booking functionality or invented opening date.

## Asset and content
Use `assets/promotions/osaka-business-hotel-tennoji-coming-soon.webp` (1672 × 941). Keep this exact poster, including the building, moon and embedded lettering, fully visible. Use an image element with width/height attributes, object-fit: contain and eager loading; never reference the Temp or reference folder. Do not generate or edit the artwork.

Shared project name: OSAKA BUSINESS HOTEL. Shared small status: COMING SOON. Company: 友誠株式会社 (already on poster). Add the following translatable strings to each existing dictionary in js/i18n.js with projectPreview.* keys:

| Key suffix | ja | en | zh-Hant | zh-Hans | ko |
| --- | --- | --- | --- | --- | --- |
| eyebrow | 新プロジェクト予告 | A NEW PROJECT | 新項目預告 | 新项目预告 | 새로운 프로젝트 안내 |
| location | 大阪・天王寺 | Tennoji, Osaka | 大阪・天王寺 | 大阪・天王寺 | 오사카・덴노지 |
| description | 天王寺で、新たな滞在のかたちを。ホテルプロジェクトを準備中です。 | A new way to stay in Tennoji. Our hotel project is in preparation. | 在天王寺，迎接全新的住宿體驗。酒店項目正籌備中。 | 在天王寺，迎接全新的住宿体验。酒店项目正筹备中。 | 덴노지에서 만나는 새로운 숙박 경험. 호텔 프로젝트를 준비하고 있습니다. |
| action | 予告を見る | View the preview | 查看項目預告 | 查看项目预告 | 프로젝트 미리 보기 |
| imageAlt | 大阪・天王寺のホテルプロジェクト予告。夜景の建物と月、OSAKA BUSINESS HOTEL、COMING SOON、友誠株式会社の文字。 | Preview of a hotel project in Tennoji, Osaka: a building at night and the moon, with OSAKA BUSINESS HOTEL, COMING SOON and 友誠株式会社. | 大阪天王寺酒店項目預告：夜景建築與月亮，並寫有 OSAKA BUSINESS HOTEL、COMING SOON 及友誠株式会社。 | 大阪天王寺酒店项目预告：夜景建筑与月亮，并写有 OSAKA BUSINESS HOTEL、COMING SOON 及友誠株式会社。 | 오사카 덴노지 호텔 프로젝트 예고: 야경 속 건물과 달, OSAKA BUSINESS HOTEL, COMING SOON, 友誠株式会社 문구. |
| note | 計画イメージです。詳細は今後お知らせします。 | Project preview. More details will be announced. | 項目示意圖，詳情將陸續公布。 | 项目示意图，详情将陆续公布。 | 프로젝트 이미지입니다. 자세한 내용은 추후 안내합니다. |

Use existing dialog.close translation for a close button. The poster lettering stays original; all supporting HTML copy, accessible labels and modal caption follow current site language. Set a meaningful section label, heading (h2; existing Hero remains h1), and dialog aria-labelledby/describedby.

## Composition
- Inline, non-sticky banner; no automatic modal, dimming or blocking on entry.
- Outer warm ivory using current tokens; inner max-width same .container (1240px), 16–24px vertical spacing; thin border and restrained shadow. Deep nighttime image paired with existing cream/olive/brown typography.
- Desktop: two columns, poster about 38% (approximately 430px, height 242px), copy about 62%. Aim around 260px total inner height, not a second giant Hero. Text padding 20–28px. Small uppercase eyebrow/status, clear title, location, short description and unobtrusive preview button/arrow. No redundant huge headings.
- Mobile <= 640px: poster full width at native 1672/941 aspect, compact supporting text underneath with 16px padding. Long English and Korean wrap naturally. Avoid horizontal scrolling. Keep banner height sensible with compact font sizes.
- Entire poster is an accessible link to its own image (progressive fallback). With JS it opens the preview dialog, and the text CTA also opens the same dialog. Every visible affordance must work.

## Interaction
- Use dedicated `css/project-preview.css` and `js/project-preview.js`, included only by index.html. Don't overload shared main.js.
- Hover/focus: border/arrow/brightness response around 180–240ms; optional gentle image lift but never crop/zoom the poster. Focus visible and >=44px controls.
- Native dialog with exact full image, title and localized note. Max-width about 1000px; constrain height with viewport units and allow scrolling on short landscape screens. Close control always reachable and visually outside image text. Escape and close button work, click outside may close, focus restored to actual opener; native modal traps focus. No stale locked body scroll on close.
- Dialog opens with brief opacity/translation fade; no waiting timer needed. Respect prefers-reduced-motion, including any banner entry animation. Essential banner content must be visible with JS disabled and when animation is disabled.
- Language switching follows existing YuseiI18n. Do not implement a separate language store/dictionary or change other pages.

## Acceptance
Preview desktop, 390px phone, narrow 320px and short landscape. Verify no cropped art or overflow, both openers, close/Escape and focus return, five translations and no missing-key output, links/assets valid. Ensure new code doesn't interfere with existing language dropdown, menu, Hero links or other dialogs. Check JavaScript syntax and diff. Report files changed and actual checks; planner will perform browser review after implementation.
