/* ============================================================
   Yusei Stay — Stay detail page controller (shared by all 7
   stays/*.html pages via <body data-stay-id="...">).

   Responsibilities:
   - Accessible tabs (About / Amenities / Access / Stay Guide):
     roving tabindex, sliding indicator, fade/slide panel swap.
   - About-tab photo gallery: builds a crossfade carousel from
     js/stay-data.js's image list, with autoplay, pause-on-
     interaction, swipe and keyboard navigation.
   - Renders the Amenities / Access / Stay Guide panels from
     js/stay-data.js (kept out of static HTML — those 3 tabs are
     unreachable without JS anyway, since switching tabs needs
     JS). The Hero and About panel are fully authored in static
     HTML instead, so a no-JS visit still shows something
     meaningful.
   - Re-renders all of the above's *text* on "yusei:langchange"
     without touching tab selection or gallery slide state.

   If js/stay-data.js has no entry for this page's data-stay-id,
   every function below no-ops and the static HTML (hero + about)
   is left exactly as authored.
   ============================================================ */

(function () {
  "use strict";

  var stayId = document.body.getAttribute("data-stay-id");
  var StayData = window.YuseiStayData;
  var i18n = window.YuseiI18n;

  if (!stayId || !StayData || !StayData.stays[stayId] || !i18n) {
    return;
  }

  var data = StayData.stays[stayId];
  var pick = StayData.pick;
  var pickList = StayData.pickList;
  var bookingDock = null;

  function lang() {
    return i18n.getLang();
  }

  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function verificationNote(key) {
    var p = document.createElement("p");
    p.className = "stay-verification-note";
    p.textContent = i18n.t(key);
    return p;
  }

  /* ---------------------------------------------------------
     Document title / meta description (proper names stay as
     authored; the descriptive summary is localized)
     --------------------------------------------------------- */
  function renderHead() {
    var l = lang();
    document.title = data.nameJa + " " + data.nameEn + " | YUSEI STAY";
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", pick(data.summary, l));
    }
  }

  /* ---------------------------------------------------------
     Persistent booking dock
     --------------------------------------------------------- */
  function renderBookingDock() {
    if (!bookingDock) {
      return;
    }
    var name = data.nameJa + " " + data.nameEn;
    bookingDock.name.textContent = data.nameJa;
    bookingDock.nameEn.textContent = data.nameEn;
    bookingDock.name.appendChild(bookingDock.nameEn);
    bookingDock.cue.textContent = i18n.t("stayDetail.booking.dockCue");
    bookingDock.link.textContent = i18n.t("stayDetail.booking.cta");
    bookingDock.link.setAttribute("aria-label", i18n.t("stayDetail.booking.dockAria", { name: name }));
  }

  function initBookingDock() {
    var canonical = document.querySelector(".stay-booking");
    var sourceLink = canonical && canonical.querySelector('a[href*="airbnb"]');
    if (!canonical || !sourceLink) {
      return;
    }

    var dock = document.createElement("aside");
    dock.className = "stay-booking-dock";
    dock.setAttribute("data-booking-dock", "");
    dock.setAttribute("aria-hidden", "false");

    var inner = document.createElement("div");
    inner.className = "container stay-booking-dock__inner";
    var info = document.createElement("div");
    info.className = "stay-booking-dock__info";
    var name = document.createElement("p");
    name.className = "stay-booking-dock__name";
    var nameEn = document.createElement("span");
    nameEn.className = "stay-booking-dock__name-en";
    name.appendChild(nameEn);
    var cue = document.createElement("p");
    cue.className = "stay-booking-dock__cue";
    info.append(name, cue);

    var link = document.createElement("a");
    link.className = "button button--primary stay-booking-dock__cta";
    link.href = sourceLink.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    inner.append(info, link);
    dock.appendChild(inner);
    document.body.appendChild(dock);

    bookingDock = { root: dock, name: name, nameEn: nameEn, cue: cue, link: link };
    renderBookingDock();

    function setHidden(hidden) {
      dock.classList.toggle("is-hidden", hidden);
      dock.setAttribute("aria-hidden", hidden ? "true" : "false");
      link.tabIndex = hidden ? -1 : 0;
    }

    function syncFromRect() {
      var rect = canonical.getBoundingClientRect();
      /* The dock appears only before the canonical section is reached. It
         stays hidden through the footer and returns when scrolling upward. */
      setHidden(rect.top <= window.innerHeight);
    }

    syncFromRect();
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        var entry = entries[0];
        setHidden(entry.isIntersecting || entry.boundingClientRect.top < 0);
      }, { threshold: [0, 0.01] });
      observer.observe(canonical);
    } else {
      window.addEventListener("scroll", syncFromRect, { passive: true });
      window.addEventListener("resize", syncFromRect);
    }
  }

  /* ---------------------------------------------------------
     Hero / About static-field re-render (tagline, summary, rooms)
     --------------------------------------------------------- */
  function renderFields() {
    var l = lang();

    document.querySelectorAll('[data-stay-field="tagline"]').forEach(function (el) {
      el.textContent = pick(data.tagline, l);
    });

    document.querySelectorAll('[data-stay-field="summary"]').forEach(function (el) {
      el.textContent = pick(data.summary, l);
    });

    document.querySelectorAll("[data-stay-rooms-wrap]").forEach(function (wrap) {
      wrap.hidden = data.rooms.length === 0;
    });

    document.querySelectorAll('[data-stay-field="rooms"]').forEach(function (list) {
      list.replaceChildren();
      data.rooms.forEach(function (room) {
        var li = document.createElement("li");
        li.className = "stay-rooms__item";
        var h3 = document.createElement("h3");
        h3.textContent = pick(room.floor, l);
        var ul = document.createElement("ul");
        pickList(room.items, l).forEach(function (item) {
          var itemLi = document.createElement("li");
          itemLi.textContent = item;
          ul.appendChild(itemLi);
        });
        li.append(h3, ul);
        list.appendChild(li);
      });
    });

    document.querySelectorAll('[data-stay-field="capacityNote"]').forEach(function (el) {
      if (data.capacityText) {
        el.hidden = false;
        el.textContent = pick(data.capacityText, l) + " " + i18n.t("stayDetail.capacityNote");
      } else {
        el.hidden = true;
      }
    });
  }

  /* ---------------------------------------------------------
     Amenities panel
     --------------------------------------------------------- */
  function renderAmenities() {
    var container = document.querySelector('[data-stay-render="amenities"]');
    if (!container) {
      return;
    }
    container.replaceChildren();
    var l = lang();

    if (!data.amenities && !data.rules) {
      container.appendChild(verificationNote("stayDetail.verification.amenities"));
      return;
    }

    if (data.amenities) {
      var grid = document.createElement("div");
      grid.className = "stay-amenities";
      ["basic", "kitchen", "bathroom", "other"].forEach(function (key) {
        var group = data.amenities[key];
        if (!group) {
          return;
        }
        var wrap = document.createElement("div");
        wrap.className = "stay-amenities__group";
        var h3 = document.createElement("h3");
        h3.textContent = i18n.t("stayDetail.amenities." + key);
        var ul = document.createElement("ul");
        ul.className = "stay-amenities__list";
        pickList(group, l).forEach(function (item) {
          var li = document.createElement("li");
          li.textContent = item;
          ul.appendChild(li);
        });
        wrap.append(h3, ul);
        grid.appendChild(wrap);
      });
      container.appendChild(grid);
    } else {
      container.appendChild(verificationNote("stayDetail.verification.amenities"));
    }

    if (data.rules) {
      var rulesWrap = document.createElement("div");
      rulesWrap.className = "stay-rules";
      var rulesHeading = document.createElement("h3");
      rulesHeading.textContent = i18n.t("stayDetail.amenities.rulesHeading");
      var rulesList = document.createElement("ul");
      pickList(data.rules, l).forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item;
        rulesList.appendChild(li);
      });
      rulesWrap.append(rulesHeading, rulesList);
      container.appendChild(rulesWrap);
    } else {
      container.appendChild(verificationNote("stayDetail.verification.rules"));
    }
  }

  /* ---------------------------------------------------------
     Access panel
     --------------------------------------------------------- */
  function renderAccess() {
    var container = document.querySelector('[data-stay-render="access"]');
    if (!container) {
      return;
    }
    container.replaceChildren();
    var l = lang();

    function row(labelKey, valueNode) {
      var r = document.createElement("div");
      r.className = "stay-access__row";
      var label = document.createElement("div");
      label.className = "stay-access__label";
      label.textContent = i18n.t(labelKey);
      var value = document.createElement("div");
      value.className = "stay-access__value";
      value.appendChild(valueNode);
      r.append(label, value);
      container.appendChild(r);
    }

    function textNode(str) {
      var span = document.createElement("span");
      span.textContent = str;
      return span;
    }

    row("stayDetail.access.address", data.address ? textNode(pick(data.address, l)) : textNode(i18n.t("stayDetail.verification.address")));
    row("stayDetail.access.station", textNode(pick(data.stationText, l)));

    if (data.mapUrl) {
      var a = document.createElement("a");
      a.href = data.mapUrl;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = i18n.t("stayDetail.access.mapLink");
      row("stayDetail.access.map", a);
    } else {
      row("stayDetail.access.map", textNode(i18n.t("stayDetail.verification.map")));
    }
  }

  /* ---------------------------------------------------------
     Stay Guide panel
     --------------------------------------------------------- */
  function renderGuide() {
    var container = document.querySelector('[data-stay-render="guide"]');
    if (!container) {
      return;
    }
    container.replaceChildren();
    var l = lang();

    function row(labelKey, text) {
      var r = document.createElement("div");
      r.className = "stay-guide__row";
      var label = document.createElement("div");
      label.className = "stay-guide__label";
      label.textContent = i18n.t(labelKey);
      var value = document.createElement("div");
      value.className = "stay-guide__value";
      value.textContent = text;
      r.append(label, value);
      container.appendChild(r);
    }

    row("stayDetail.guide.checkin", data.guide.checkin ? pick(data.guide.checkin, l) : i18n.t("stayDetail.verification.guide"));
    row("stayDetail.guide.checkout", data.guide.checkout ? pick(data.guide.checkout, l) : i18n.t("stayDetail.verification.guide"));

    if (data.guide.cancellation) {
      var r = document.createElement("div");
      r.className = "stay-guide__row";
      var label = document.createElement("div");
      label.className = "stay-guide__label";
      label.textContent = i18n.t("stayDetail.guide.cancellation");
      var value = document.createElement("div");
      value.className = "stay-guide__value";
      var p1 = document.createElement("p");
      p1.textContent = pick(data.guide.cancellation, l);
      var p2 = document.createElement("p");
      p2.className = "stay-guide__subnote";
      p2.textContent = i18n.t("stayDetail.guide.cancellationSourceNote");
      value.append(p1, p2);
      r.append(label, value);
      container.appendChild(r);
    } else {
      row("stayDetail.guide.cancellation", i18n.t("stayDetail.verification.guide"));
    }

    row("stayDetail.guide.children", i18n.t("stayDetail.guide.childrenNote"));
  }

  /* ---------------------------------------------------------
     Tabs
     --------------------------------------------------------- */
  function initTabs() {
    var tablist = document.querySelector("[data-tablist]");
    if (!tablist) {
      return;
    }
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var indicator = tablist.querySelector("[data-tab-indicator]");
    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-panel]"));

    function panelFor(tab) {
      return document.getElementById(tab.getAttribute("aria-controls"));
    }

    function moveIndicator(tab) {
      if (!indicator) {
        return;
      }
      var tabRect = tab.getBoundingClientRect();
      var listRect = tablist.getBoundingClientRect();
      var x = tabRect.left - listRect.left + tablist.scrollLeft;
      indicator.style.setProperty("--indicator-x", x + "px");
      indicator.style.setProperty("--indicator-width", tabRect.width + "px");
    }

    function activate(tab, opts) {
      opts = opts || {};
      var current = tabs.filter(function (t) {
        return t.getAttribute("aria-selected") === "true";
      })[0];
      if (current === tab && !opts.force) {
        if (opts.focus) {
          tab.focus();
        }
        return;
      }

      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute("aria-selected", selected ? "true" : "false");
        t.tabIndex = selected ? 0 : -1;
      });
      moveIndicator(tab);

      if (opts.focus) {
        tab.focus();
      }
      if (typeof tab.scrollIntoView === "function") {
        tab.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", inline: "center", block: "nearest" });
      }

      var nextPanel = panelFor(tab);
      var prevPanel = panels.filter(function (p) {
        return !p.hidden;
      })[0];

      if (!nextPanel || !prevPanel || prevPanel === nextPanel) {
        panels.forEach(function (p) {
          p.hidden = p !== nextPanel;
        });
        return;
      }

      if (prefersReducedMotion()) {
        prevPanel.hidden = true;
        nextPanel.hidden = false;
        return;
      }

      prevPanel.classList.add("is-leaving");
      window.setTimeout(function () {
        prevPanel.hidden = true;
        prevPanel.classList.remove("is-leaving");
        nextPanel.hidden = false;
        nextPanel.classList.add("is-entering");
        void nextPanel.offsetWidth;
        requestAnimationFrame(function () {
          nextPanel.classList.remove("is-entering");
          nextPanel.classList.add("is-entered");
          window.setTimeout(function () {
            nextPanel.classList.remove("is-entered");
          }, 320);
        });
      }, 190);
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        activate(tab);
      });
      tab.addEventListener("keydown", function (event) {
        var newIndex = null;
        if (event.key === "ArrowRight") {
          newIndex = (index + 1) % tabs.length;
        } else if (event.key === "ArrowLeft") {
          newIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === "Home") {
          newIndex = 0;
        } else if (event.key === "End") {
          newIndex = tabs.length - 1;
        }
        if (newIndex !== null) {
          event.preventDefault();
          activate(tabs[newIndex], { focus: true });
        }
      });
    });

    window.addEventListener("resize", function () {
      var active = tabs.filter(function (t) {
        return t.getAttribute("aria-selected") === "true";
      })[0];
      if (active) {
        moveIndicator(active);
      }
    });

    if (tabs[0]) {
      requestAnimationFrame(function () {
        moveIndicator(tabs[0]);
        if (indicator) {
          /* Commit the measured first position without animation. Enable
             transitions on the following frame for real tab changes only. */
          void indicator.offsetWidth;
          requestAnimationFrame(function () {
            indicator.classList.add("is-ready");
          });
        }
      });
    }
  }

  /* ---------------------------------------------------------
     Gallery (About tab)
     --------------------------------------------------------- */
  function initGallery() {
    var root = document.querySelector("[data-stay-gallery]");
    if (!root) {
      return;
    }
    var viewport = root.querySelector("[data-gallery-viewport]");
    var counter = root.querySelector("[data-gallery-counter]");
    var dotsWrap = root.querySelector("[data-gallery-dots]");
    var thumbsWrap = root.querySelector("[data-gallery-thumbs]");
    var prevBtn = root.querySelector("[data-gallery-prev]");
    var nextBtn = root.querySelector("[data-gallery-next]");
    if (!viewport) {
      return;
    }

    var basePath = "../assets/properties/" + data.folder + "/";
    var reduced = prefersReducedMotion();
    var slides = [];
    var dots = [];
    var thumbs = [];
    var current = 0;
    var lastAdvance = Date.now();
    var manualPauseUntil = 0;
    var hoverPaused = false;
    var focusPaused = false;

    var existingImg = viewport.querySelector("[data-gallery-img]");

    function altText(index) {
      return i18n.t("stayDetail.gallery.imageAlt", { name: data.nameJa + " " + data.nameEn, index: index + 1 });
    }

    function nextValidIndex(from, direction) {
      var total = slides.length;
      if (total === 0) {
        return 0;
      }
      var i = from;
      for (var step = 0; step < total; step++) {
        i = (i + direction + total) % total;
        if (slides[i] && slides[i].valid) {
          return i;
        }
      }
      return from;
    }

    function updateCounter() {
      if (counter) {
        counter.textContent = i18n.t("stayDetail.gallery.counter", { index: current + 1, total: slides.length });
      }
    }

    function relocalize() {
      slides.forEach(function (s, i) {
        s.img.alt = altText(i);
      });
      dots.forEach(function (d, i) {
        d.setAttribute("aria-label", i18n.t("stayDetail.gallery.viewImage", { index: i + 1 }));
      });
      thumbs.forEach(function (t, i) {
        t.setAttribute("aria-label", i18n.t("stayDetail.gallery.viewImage", { index: i + 1 }));
      });
      updateCounter();
    }

    function goTo(index, manual) {
      if (!slides.length) {
        return;
      }
      if (!slides[index] || !slides[index].valid) {
        index = nextValidIndex(index, 1);
      }
      slides.forEach(function (s, i) {
        s.img.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (d, i) {
        d.classList.toggle("is-active", i === index);
      });
      thumbs.forEach(function (t, i) {
        t.classList.toggle("is-active", i === index);
      });
      current = index;
      updateCounter();
      if (manual) {
        manualPauseUntil = Date.now() + 10000;
        var activeThumb = thumbs[index];
        if (activeThumb && typeof activeThumb.scrollIntoView === "function") {
          activeThumb.scrollIntoView({ behavior: reduced ? "auto" : "smooth", inline: "center", block: "nearest" });
        }
      }
      lastAdvance = Date.now();
    }

    function step(direction, manual) {
      goTo(nextValidIndex(current, direction), manual === undefined ? true : manual);
    }

    function markBroken(index) {
      if (!slides[index]) {
        return;
      }
      slides[index].valid = false;
      slides[index].img.classList.add("is-broken");
      if (dots[index]) {
        dots[index].style.display = "none";
      }
      if (thumbs[index]) {
        thumbs[index].style.display = "none";
      }
      if (current === index) {
        goTo(nextValidIndex(index, 1), false);
      }
    }

    data.images.forEach(function (file, index) {
      var img;
      if (index === 0 && existingImg) {
        img = existingImg;
      } else {
        img = document.createElement("img");
        img.className = "stay-gallery__img";
        img.loading = "lazy";
        img.setAttribute("data-gallery-img", "");
        img.src = basePath + file;
        viewport.insertBefore(img, prevBtn || null);
      }
      img.alt = altText(index);
      img.addEventListener("error", function () {
        markBroken(index);
      });
      slides.push({ img: img, valid: true });

      if (dotsWrap) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "stay-gallery__dot" + (index === 0 ? " is-active" : "");
        dot.setAttribute("aria-label", i18n.t("stayDetail.gallery.viewImage", { index: index + 1 }));
        dot.addEventListener("click", function () {
          goTo(index, true);
        });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      }

      if (thumbsWrap) {
        var thumbLi = document.createElement("li");
        var thumbButton = document.createElement("button");
        thumbButton.type = "button";
        thumbButton.className = "stay-gallery__thumb" + (index === 0 ? " is-active" : "");
        thumbButton.setAttribute("aria-label", i18n.t("stayDetail.gallery.viewImage", { index: index + 1 }));
        var thumbImg = document.createElement("img");
        thumbImg.src = basePath + file;
        thumbImg.alt = "";
        thumbImg.loading = "lazy";
        thumbButton.appendChild(thumbImg);
        thumbButton.addEventListener("click", function () {
          goTo(index, true);
        });
        thumbLi.appendChild(thumbButton);
        thumbsWrap.appendChild(thumbLi);
        thumbs.push(thumbButton);
      }
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        step(-1, true);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        step(1, true);
      });
    }

    viewport.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1, true);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1, true);
      }
    });

    var touchStartX = null;
    viewport.addEventListener(
      "touchstart",
      function (event) {
        touchStartX = event.changedTouches[0].clientX;
      },
      { passive: true }
    );
    viewport.addEventListener(
      "touchend",
      function (event) {
        if (touchStartX === null) {
          return;
        }
        var dx = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) {
          step(dx > 0 ? -1 : 1, true);
        }
        touchStartX = null;
      },
      { passive: true }
    );

    root.addEventListener("mouseenter", function () {
      hoverPaused = true;
    });
    root.addEventListener("mouseleave", function () {
      hoverPaused = false;
    });
    root.addEventListener("focusin", function () {
      focusPaused = true;
    });
    root.addEventListener("focusout", function () {
      focusPaused = false;
    });

    if (!reduced && slides.length > 1) {
      window.setInterval(function () {
        if (document.hidden || hoverPaused || focusPaused) {
          return;
        }
        var now = Date.now();
        if (now < manualPauseUntil) {
          return;
        }
        if (now - lastAdvance >= 6000) {
          step(1, false);
        }
      }, 1000);
    }

    updateCounter();
    document.addEventListener("yusei:langchange", relocalize);
  }

  /* ---------------------------------------------------------
     Init + language change
     --------------------------------------------------------- */
  function renderAll() {
    renderHead();
    renderFields();
    renderAmenities();
    renderAccess();
    renderGuide();
    renderBookingDock();
  }

  function init() {
    renderAll();
    initTabs();
    initGallery();
    initBookingDock();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  document.addEventListener("yusei:langchange", renderAll);
})();
