/* ============================================================
   Yusei Stay — Shared info dialog (FAQ / Contact / About /
   Experience). Loaded on index.html and every stays/*.html page.
   No booking, no invented pages — just Airbnb links or a plain
   explanation. Stay-card links now go straight to their detail
   pages instead of opening a dialog (see stays/*.html), so this
   file only ever needs [data-info] + #info-dialog to exist.
   ============================================================ */

(function () {
  "use strict";

  var dialog = document.getElementById("info-dialog");
  var closeButton = document.getElementById("info-dialog-close");
  var titleEl = document.getElementById("info-dialog-title");
  var bodyEl = document.getElementById("info-dialog-body");

  if (!dialog || !closeButton || !titleEl || !bodyEl) {
    return;
  }

  var i18n = window.YuseiI18n;
  var dialogContext = null;

  function paragraph(text) {
    var p = document.createElement("p");
    p.textContent = text;
    bodyEl.appendChild(p);
  }

  function stayHref() {
    var a = document.createElement("a");
    a.className = "button button--outline";
    // Shared by index.html (stays.html lives alongside it) and every
    // stays/*.html detail page (identified by data-stay-id, one level down).
    a.href = document.body.hasAttribute("data-stay-id") ? "../stays.html" : "stays.html";
    a.textContent = i18n.t("dialog.home.stayLink");
    bodyEl.appendChild(a);
  }

  function openDialog(title) {
    titleEl.textContent = title;
    bodyEl.replaceChildren();
    dialog.showModal();
  }

  function renderFaq() {
    dialogContext = { type: "faq" };
    openDialog(i18n.t("nav.faq"));
    paragraph(i18n.t("dialog.home.faq.body"));
    stayHref();
  }

  function renderContact() {
    dialogContext = { type: "contact" };
    openDialog(i18n.t("nav.contact"));
    paragraph(i18n.t("dialog.home.contact.body"));
    stayHref();
  }

  function renderAbout() {
    dialogContext = { type: "about" };
    openDialog(i18n.t("nav.about"));
    paragraph(i18n.t("about.description"));
    paragraph(i18n.t("dialog.about.comingSoon"));
  }

  function renderExperience() {
    dialogContext = { type: "experience" };
    openDialog(i18n.t("experience.dialogTitle"));
    paragraph(i18n.t("dialog.experience.comingSoon"));
    stayHref();
  }

  var infoContent = {
    faq: renderFaq,
    contact: renderContact,
    about: renderAbout,
    experience: renderExperience
  };

  document.querySelectorAll("[data-info]").forEach(function (button) {
    button.addEventListener("click", function () {
      var handler = infoContent[button.dataset.info];
      if (handler) {
        handler();
      }
    });
  });

  closeButton.addEventListener("click", function () {
    dialog.close();
  });

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) {
      var rect = dialog.getBoundingClientRect();
      var isOutside =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;
      if (isOutside) {
        dialog.close();
      }
    }
  });

  document.addEventListener("yusei:langchange", function () {
    if (!dialog.open || !dialogContext) {
      return;
    }
    if (infoContent[dialogContext.type]) {
      infoContent[dialogContext.type]();
    }
  });
})();
