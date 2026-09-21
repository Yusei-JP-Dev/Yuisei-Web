/* ============================================================
   Yusei Stay — Social icon link upgrader
   Reads window.YuseiSocialConfig (js/social-config.js, loaded first)
   and upgrades each [data-social] placeholder in the footer from a
   plain, muted span into a real link — but only when a valid
   https:// URL has been configured for that platform. Otherwise the
   placeholder is left as a non-interactive span. Shared by both
   pages; see README "Social links" section for the contract.
   ============================================================ */

(function () {
  "use strict";

  var config = window.YuseiSocialConfig || {};

  function isValidHttpsUrl(value) {
    if (typeof value !== "string" || value.trim() === "") {
      return false;
    }
    try {
      return new URL(value).protocol === "https:";
    } catch (e) {
      return false;
    }
  }

  document.querySelectorAll("[data-social]").forEach(function (placeholder) {
    var platform = placeholder.dataset.social;
    var url = config[platform];

    if (!isValidHttpsUrl(url)) {
      placeholder.classList.add("social-icon--pending");
      return;
    }

    var link = document.createElement("a");
    link.className = placeholder.className + " social-icon--active";
    link.dataset.social = platform;
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.innerHTML = placeholder.innerHTML;
    placeholder.replaceWith(link);
  });
})();
