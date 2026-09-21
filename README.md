# Yusei Stay Website

Official showcase website for Yusei's minshuku properties in Japan.

## Status
In development

## Tech
- HTML
- CSS
- JavaScript
- GitHub
- Vercel

## Purpose
Showcase accommodation properties and direct visitors to external booking platforms.

## Translations

`index.html` and `stays.html` support five languages — Japanese
(default), English, Simplified Chinese (`zh-Hans`), Traditional Chinese
(`zh-Hant`), and Korean — via a native `<select>` in the header (and
mobile menu / footer, where present), listed in that order (Japanese,
English, Simplified Chinese, Traditional Chinese, Korean). There is no
build step or translation framework — everything lives in one shared
dictionary file:

- `js/i18n.js` — all copy for both pages, keyed by a flat string key
  (e.g. `"hero.subheading"`), one object per language (`ja`, `en`,
  `zh-Hans`, `zh-Hant`, `ko`). Also holds a small `stations` lookup for
  the handful of Japanese place names reused across stay cards/dialogs.

**To edit existing copy:** find the key in `js/i18n.js` and edit the
string for the language(s) you want to change. Keys support
`{{placeholder}}` substitution (e.g. `"最寄りエリア：{{station}}"`).

**To add new translatable text:**
1. Add a key + value for all five languages in `js/i18n.js`.
2. In HTML, either:
   - add `data-i18n="your.key"` to the element whose *entire* text
     content should be replaced (only use this on elements with no
     child elements you need to keep — icons, `<br>`, nested spans,
     inputs, etc. would be wiped out), or
   - add `data-i18n-attr="attr:your.key"` to translate an attribute
     (e.g. `alt`, `aria-label`); pipe-separate for more than one
     attribute on the same element.
   - If an existing string mixes translatable text with markup that
     must survive (an arrow icon span, a `<br>` line break, a form
     input), wrap just the text in its own `<span data-i18n="...">`
     so the sibling markup is untouched.
3. In JS (`main.js` / `stays.js`), call `YuseiI18n.t('your.key')` (or
   `YuseiI18n.t('your.key', {placeholder: value})`) whenever building
   dynamic content (dialogs, cards, status text).

Both page scripts listen for the `yusei:langchange` document event to
re-render any dynamic content (open dialogs, result cards, age
selects) in the new language without resetting form state.

Proper names (property names, station names not covered by the
`stations` lookup) and a handful of intentional English editorial
slogans (e.g. the hero heading, "OSAKA MINSHUKU") are left untranslated
by design.

## Shared navigation component

`index.html` and `stays.html` use the exact same header markup, mobile
menu markup, and behaviour — this is the contract to follow for any
future page:

1. Copy the `<header class="site-header" id="site-header">…</header>`
   block verbatim from either page (brand / `.main-nav` / `.header-utility`
   / hamburger / `.mobile-menu`), adjusting only: which nav link carries
   `aria-current="page"`, and the header CTA's href/label.
2. Link `css/reset.css`, `css/variables.css`, `css/global.css` and
   `css/header.css` (in that order, before the page's own CSS) — these
   provide `.container`, `.button`, `.visually-hidden`, focus styles,
   and all header/mobile-menu/nav styling.
3. Load `js/i18n.js`, then `js/language-switcher.js`, then
   `js/navigation.js` (hamburger open/close is ID-based —
   `#hamburger-toggle` / `#mobile-menu` — and needs no per-page config).
4. If a page's own stylesheet defines generic element selectors (e.g. a
   bare `nav`, `section`, or heading rule), double-check it doesn't
   collide with `header.css`/`global.css` once both are loaded — see the
   "Shared header/global.css bring some selectors…" comment block in
   `css/stays.css` for a worked example of the kind of override needed.

Do not hand-roll a second nav/hamburger implementation for a new page —
reuse this markup + these four CSS files + these three scripts.

## Language switcher

The visible language control is a custom disclosure widget (button +
list of language buttons), not a native `<select>`. It's a progressive
enhancement over `js/i18n.js`: `js/language-switcher.js` only builds and
opens/closes the UI, and calls `YuseiI18n.setLang()` on selection —
`getLang`/`setLang`/`applyDom`, the `yusei:langchange` event, storage,
and the `?lang=` query param all still live in `js/i18n.js`, unchanged.

To add another instance (header/mobile-menu/footer, on any page), drop
this markup anywhere and load `js/language-switcher.js` after
`js/i18n.js`:

```html
<div class="lang-switcher" data-lang-switcher>
  <button type="button" class="lang-switcher__trigger" data-lang-trigger
          aria-expanded="false"
          data-i18n-attr="aria-label:nav.language.label">
    <svg class="lang-switcher__globe" ...>...</svg>
    <span data-i18n="nav.language.generic">言語</span>
  </button>
</div>
```

The `<ul>` of options (flag SVG + native language name, one per
supported language) is generated entirely by `language-switcher.js`
from a single data source in that file — never hand-write the option
list in HTML, so flag artwork only ever lives in one place. Placement
variants (`.site-footer__language`, `.mobile-menu__language`) add
positioning only (open-upward near the page bottom, full-width in the
mobile panel) in `css/header.css`.

## Social links (footer "Follow Us")

`js/social-config.js` is the single place to turn on a footer social
icon — set `instagram` / `facebook` / `youtube` to the official,
confirmed profile URL (must be `https://`). Leave a value as `""` and
that icon stays a plain, muted, non-interactive placeholder — it never
falls back to `#`, a platform homepage, or a guessed handle.
`js/social-links.js` (shared, loaded on both pages) upgrades a
placeholder to a real `target="_blank" rel="noopener noreferrer"` link
only once a valid `https://` URL is present.

Current values were confirmed by manually opening each URL in a
browser and checking the displayed account name/bio matches 友誠株式会社
(Yusei): Instagram `japandreamhomes` and YouTube `@integrity.512` both
display 友誠株式会社; Facebook (`61572866384436`) displays 友誠株式会社（日本不動產／移居日本）,
based in Osaka, with a bio covering property and minshuku management.
The YouTube channel is also the one explicitly linked from the Pine
Garden property reference doc.

## Hero focal point

The hero uses two different treatments depending on viewport, both built on
the same `assets/hero/cover_1.jpg`:

**Desktop/tablet (>768px):** a layered look. `.hero__media::before`
(`css/home.css`) is a pure-CSS, decorative duplicate of the photo —
`background-size: cover`, blurred (~18px) and slightly scaled up (1.08x) to
hide the blur's soft edge — filling the whole hero band as a backdrop. The
real `.hero__image` sits on top of it, sharp and **uncropped**: its
`height`/`width: auto`/`aspect-ratio: 4/3` show the complete original 4:3
frame (no `object-fit: cover` crop), scaled proportionally and pinned to the
right as an editorial insert, not stretched full-bleed. Its `right` offset
(`max(96px, calc((100vw - 1600px) / 2))`) keeps it clear of
`.hero__vertical-copy` (pinned at `right: 48px`) and anchors it toward the
site's ~1600px central composition rather than the raw screen edge on
ultrawide; `max-width: min(760px, 34vw)` caps its size so it doesn't crowd
`.hero__content` (whose own `max-width: min(560px, 40vw)` shrinks in tandem)
on narrower desktop/tablet widths. Desktop hero height (`css/home.css`) is
`clamp(560px, 25vw, 720px)`, not a fixed 560px — it holds 560px through
1366/1440/1920, grows to 640px at 2560, and caps at 720px from ~2880px up.
If `cover_1.jpg` is ever replaced, update **both** the `<img src>`
(index.html) and the `--hero-backdrop-image` value (`css/home.css`) so the
two layers keep matching.

**Mobile (<=768px):** the layered treatment is fully reset in
`css/responsive.css` — the backdrop is hidden and `.hero__image` reverts to
the original single full-bleed `object-fit: cover` crop, focused via
`object-position: 85% 20%` (`--hero-focal-x`/`--hero-focal-y` equivalents,
now hard-coded directly in the mobile rule since nothing else consumes
them). This keeps the wooden wall-hanging with the 禪 character (in
`cover_1.jpg`, roughly source pixels x:1140–1390, y:140–565 of the
1600x1200 photo) visibly composed even though, on this comparatively tall,
narrow viewport, the crop flips from vertical to horizontal and overflows
sideways rather than top/bottom. If `cover_1.jpg` is ever replaced,
re-locate the subject's pixel coordinates in the new image and recompute
this position (`x / imageWidth`, `y / imageHeight`) rather than reusing the
old values as-is.

## Motion / feedback

- `js/animations.js` adds a once-only scroll reveal to any element
  marked `data-reveal`. The pre-reveal hidden state (`.reveal-init` in
  `css/motion.css`) is only ever applied by this script — if JS fails
  or `IntersectionObserver` is unsupported, marked elements simply stay
  fully visible (no content ever depends on JS to appear).
- `prefers-reduced-motion: reduce` is handled once, globally, in
  `css/reset.css` (collapses all transition/animation durations) — no
  other file needs its own reduced-motion override.
- Dialog entrance (`css/motion.css`, `dialog[open]`) applies to both
  `#info-dialog` (index.html) and `#dialog` (stays.html) automatically.
