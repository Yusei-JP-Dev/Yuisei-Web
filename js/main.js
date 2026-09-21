/* ============================================================
   Yusei Stay — Homepage info dialog
   Honest informational modal for nav items and stay cards that
   have no dedicated page yet (FAQ / Contact / About / Experience
   / Our Stays detail links). Mirrors the pattern used in stays.js:
   no booking, no invented pages — just Airbnb links or a plain
   explanation.
   ============================================================ */

(function () {
  "use strict";

  var stays = {
    tea: { name: "茶園 Tea Garden", station: "天下茶屋・花園町", url: "teagarden2024" },
    art: { name: "芸 Art Home", station: "朝潮橋", url: "arthome2025" },
    furukawa: { name: "古川の家 Furukawa House", station: "貝塚市", url: "furukawa" }
  };

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

  function airbnbLink(stay) {
    var a = document.createElement("a");
    a.className = "button button--primary";
    a.href = "https://www.airbnb.com/h/" + stay.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = i18n.t("dialog.stay.airbnbLink", { name: stay.name });
    bodyEl.appendChild(a);
  }

  function stayHref() {
    var a = document.createElement("a");
    a.className = "button button--outline";
    a.href = "stays.html";
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

  function renderStay(key) {
    var stay = stays[key];
    if (!stay) {
      return;
    }
    dialogContext = { type: "stay", key: key };
    openDialog(stay.name);
    paragraph(i18n.t("dialog.stay.station", { station: i18n.station(stay.station) }));
    paragraph(i18n.t("dialog.stay.airbnbNote"));
    airbnbLink(stay);
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

  document.querySelectorAll("[data-stay]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      renderStay(link.dataset.stay);
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
    if (dialogContext.type === "stay") {
      renderStay(dialogContext.key);
    } else if (infoContent[dialogContext.type]) {
      infoContent[dialogContext.type]();
    }
  });
})();
