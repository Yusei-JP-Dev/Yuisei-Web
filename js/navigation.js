/* ============================================================
   Yusei Stay — Navigation behaviour
   Handles: mobile hamburger menu open/close, language switcher
   dropdown. Kept intentionally small — no framework needed.
   ============================================================ */

(function () {
  "use strict";

  // ---- Mobile hamburger menu ----
  var hamburger = document.getElementById("hamburger-toggle");
  var mobileMenu = document.getElementById("mobile-menu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", function () {
      var isOpen = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", String(!isOpen));
      mobileMenu.hidden = isOpen;
    });
  }

  // ---- Desktop language switcher dropdown ----
  var langToggle = document.querySelector(".language-switcher__toggle");
  var langMenu = document.querySelector(".language-switcher__menu");

  if (langToggle && langMenu) {
    langToggle.addEventListener("click", function () {
      var isOpen = langToggle.getAttribute("aria-expanded") === "true";
      langToggle.setAttribute("aria-expanded", String(!isOpen));
      langMenu.hidden = isOpen;
    });

    // Close the dropdown when clicking anywhere outside it.
    document.addEventListener("click", function (event) {
      var isClickInside =
        langToggle.contains(event.target) || langMenu.contains(event.target);
      if (!isClickInside) {
        langToggle.setAttribute("aria-expanded", "false");
        langMenu.hidden = true;
      }
    });
  }
})();
