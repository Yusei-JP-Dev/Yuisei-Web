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
  var hamburgerLabel = hamburger && hamburger.querySelector(".visually-hidden");

  function updateHamburgerLabel() {
    if (!hamburgerLabel || !window.YuseiI18n) {
      return;
    }
    var isOpen = hamburger.getAttribute("aria-expanded") === "true";
    var key = isOpen ? "hamburger.close" : "hamburger.open";
    hamburgerLabel.setAttribute("data-i18n", key);
    hamburgerLabel.textContent = window.YuseiI18n.t(key);
  }

  function closeMobileMenu(restoreFocus) {
    hamburger.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
    updateHamburgerLabel();
    if (restoreFocus) {
      hamburger.focus();
    }
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", function () {
      var isOpen = hamburger.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMobileMenu(false);
      } else {
        hamburger.setAttribute("aria-expanded", "true");
        mobileMenu.hidden = false;
        updateHamburgerLabel();
      }
    });

    document.addEventListener("yusei:langchange", updateHamburgerLabel);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && hamburger.getAttribute("aria-expanded") === "true") {
        closeMobileMenu(true);
      }
    });

    // Close the menu once a nav link or info button is selected. No focus
    // restore here: a data-info button opens a dialog that should keep
    // focus, and a link's own navigation/scroll should be left alone.
    mobileMenu.addEventListener("click", function (event) {
      var target = event.target.closest("a, button[data-info]");
      if (target) {
        closeMobileMenu(false);
      }
    });
  }
})();
