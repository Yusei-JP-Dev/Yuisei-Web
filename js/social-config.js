/* ============================================================
   Yusei Stay — Social links config
   Single source of truth for the footer "Follow Us" icons on both
   pages. Fill in a value below only once the property owner has
   confirmed the official account URL — leave empty ("") until then.

   Rules enforced by js/social-links.js:
   - Empty/missing value  -> icon stays a plain, muted, non-link.
   - Non-https value      -> ignored, icon stays a non-link (fixing a
     typo here is safer than silently linking somewhere unexpected).
   - Valid https:// value -> icon becomes a real link
     (target="_blank" rel="noopener noreferrer").

   Never fill these with a guessed handle or a platform homepage —
   only an official, confirmed profile URL.
   ============================================================ */

window.YuseiSocialConfig = {
  instagram: "https://www.instagram.com/japandreamhomes/",
  facebook: "https://www.facebook.com/p/友誠株式会社日本不動產移居日本-61572866384436/",
  youtube: "https://www.youtube.com/@integrity.512"
};
