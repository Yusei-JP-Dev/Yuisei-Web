/* Turns confirmed contact details into WhatsApp, email and phone links. */
(function () {
  "use strict";

  var config = window.YuseiContactConfig || {};

  function normalisePhone(value) {
    return String(value || "").replace(/[^+\d]/g, "");
  }

  function contactHref(channel, value) {
    var clean = String(value || "").trim();
    if (!clean) return "";

    if (channel === "whatsapp") {
      var number = normalisePhone(clean).replace(/^\+/, "");
      return number ? "https://wa.me/" + number : "";
    }

    if (channel === "email") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean) ? "mailto:" + clean : "";
    }

    if (channel === "phone") {
      var phone = normalisePhone(clean);
      return phone ? "tel:" + phone : "";
    }

    return "";
  }

  document.querySelectorAll("[data-contact-channel]").forEach(function (item) {
    var channel = item.dataset.contactChannel;
    var value = String(config[channel] || "").trim();
    var href = contactHref(channel, value);
    var valueNode = item.querySelector(".contact-link__value");

    if (!href || !valueNode) {
      item.classList.add("contact-link--pending");
      item.setAttribute("aria-disabled", "true");
      return;
    }

    item.href = href;
    valueNode.removeAttribute("data-i18n");
    valueNode.textContent = value;
    item.classList.add("contact-link--active");

    if (channel === "whatsapp") {
      item.target = "_blank";
      item.rel = "noopener noreferrer";
    }
  });
})();
