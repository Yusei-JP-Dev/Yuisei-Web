# Osaka Guide imagery cleanup and Art Home supermarket photo

Date: 2026-10-16. Latest user instructions supersede prior generated-image badge requirements in local documentation.

## Required changes

1. Remove every visitor-facing explicit AI-generation label across the site, including five-language image badges, AI prefixes in image alt text, and the generated-image paragraph at the bottom of the guide credits. Remove unused guide.img.ai, guide.img.aiAlt, guide.credits.ai keys rather than replacing with empty UI. Keep useful descriptive alt/caption text, and keep atmosphere images generically described, not asserted to be photos of named real stores. Do not replace AI labels with different badges. Internal source/provenance metadata can remain truthful and is not rendered.
2. For Art Home only, replace chapter 05 / daily life image mapping with the real supermarket exterior prepared at `assets/guide/destinations/life-asashiobashi-ekimae-exterior.webp`. Other stays retain existing chapter images.
3. New asset id `life-asashiobashi-ekimae`, kind `photo`, original dimensions **4032 × 3024**, local src above. Caption/alt in five languages:
   - ja: ライフ朝潮橋駅前店
   - en: LIFE Asashiobashi Ekimae supermarket
   - zh-Hans: LIFE 朝潮桥站前店
   - zh-Hant: LIFE 朝潮橋站前店
   - ko: 라이프 아사시오바시 에키마에점
   Only shop name/description appears below this image; no source credit, AI badge, or "not a specific shop" suffix. User explicitly requested no visible source for this new image. Do not remove existing Wikimedia credit lines/licenses from unrelated photos.
4. Safely support a real photo with internal source metadata but no displayed credit. Existing renderer assumes every photo has a Wikimedia credit object; adjust conditional branches so new photo renders without `undefined`, fake CC licenses, or runtime errors. Prefer simply only call creditLine / markUsed / list credit entries when asset.credit exists. Do not hardcode asset IDs in renderer. Do not falsely label official company press photo Wikimedia or freely licensed.
5. Use existing imagery layout/reveal/Top/locale mechanics unchanged. For this new photo pick a crop that shows the store name and entrance clearly, e.g. object-position 50% 65%; use responsive CSS only if needed. Do not edit image pixels. Scope any special fit to the new asset; avoid regressions to other chapter photos.

## Source evidence, internal only

- Art Home address already in project: 大阪市港区三先1丁目8-29. Existing daily facilities include LIFE/関西スーパー. No new travel time estimates needed.
- Current official store page: https://store.lifecorp.jp/detail/west429/
- Store address: 大阪府大阪市港区夕凪2-18-49, adjacent to Asashiobashi Station exit 7.
- Photo: LIFE CORPORATION press release, 2021-02-03, https://newscast.jp/news/7159338
- Exact downloaded original: https://newscast.jp/attachments/eK8srw8o1vlo5VUGXwVV.jpg
- The image was visually inspected by Codex: actual exterior with LIFE signs, supermarket entrance, nearby apartments. No generative reconstruction or attribution watermark removal. Source photograph was copied unchanged to the development asset path.
- Retain provenance in assets/guide/manifest.json and docs/guide-image-credits.md, separate from rendered UI; don't invent a CC/free license. Use neutral `source`/`sourceType`/`photographerOrPublisher`/`sourceDate`/`retrieved` metadata for this official press asset, separate from `credit` used for licensed Commons images.

## Allowed files and preservation

Implement only `js/guide-images.js`, `js/tour-guide.js`, `js/i18n.js` (only remove the obsolete three AI key families), `css/tour-guide.css` (remove obsolete badge style, optional narrowly scoped photo fit), `tour-guide.html` (bump cache versions for changed guide files), `assets/guide/manifest.json`, `docs/guide-image-credits.md`.

Update old comments/manifest usage rules demanding visible AI badges so future edits don't reintroduce them. Keep generated kind/provenance internally accurate. Preserve all other current uncommitted work, partner content, contacts, translations, trip data, image credits and animations. Do not add/remove attractions, change timings or change guide-data.js.

No commands, tools beyond Read/Edit/Write/Glob/Grep, agents, installs, commits or deployment. Codex will test desktop/mobile, all five languages, 7 stay image mappings, no visible or alt AI labels, correct real supermarket image, no credit crash, and existing Commons credits retained.
