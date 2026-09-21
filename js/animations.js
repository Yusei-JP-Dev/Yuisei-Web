/* ============================================================
   Yusei Stay — Scroll reveal
   Adds a gentle once-only fade/translate reveal to elements marked
   with [data-reveal] as they enter the viewport. Shared by both
   pages (index.html section wrappers, stays.html panels/results).

   Safety:
   - The "hidden until revealed" state (`.reveal-init`) is only ever
     added by this script, never present in the base CSS — so if JS
     fails to load, or IntersectionObserver is unsupported, content
     stays fully visible with no animation, ever.
   - Respects prefers-reduced-motion by skipping the effect entirely
     (elements are left in their normal, fully visible state).
   - Each element reveals once, then is unobserved — no repeated
     animation on re-scroll.
   ============================================================ */

(function () {
  "use strict";

  var elements = document.querySelectorAll("[data-reveal]");
  if (!elements.length) {
    return;
  }

  var motionQuery =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");

  if (motionQuery && motionQuery.matches) {
    return;
  }

  if (typeof IntersectionObserver === "undefined") {
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  function revealNow(el) {
    el.classList.add("reveal-visible");
    observer.unobserve(el);
  }

  elements.forEach(function (el) {
    el.classList.add("reveal-init");
    observer.observe(el);
    el.addEventListener("focusin", function () {
      if (!el.classList.contains("reveal-visible")) {
        revealNow(el);
      }
    });
  });

  if (motionQuery && typeof motionQuery.addEventListener === "function") {
    motionQuery.addEventListener("change", function (event) {
      if (event.matches) {
        elements.forEach(function (el) {
          el.classList.add("reveal-visible");
          observer.unobserve(el);
        });
      }
    });
  }
})();
