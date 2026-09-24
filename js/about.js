/* ============================================================
   Yusei Stay — About page: 旅人に選ばれた宿 award-board ring
   Loaded only on about.html, after i18n.js / main.js.

   Progressive enhancement:
   - The HTML is a plain scroll-snap list of links (readable with no
     JS). This script always localises the card alt text; it only
     upgrades to the rotating 3D ring when prefers-reduced-motion is
     NOT set, and tears the ring back down if that preference turns on.
   - Ring mode clones the cards so the ring is always full (fewer than
     9 boards would otherwise leave visible gaps). Clones and the
     original cards are hidden from assistive tech / tab order in ring
     mode; the status line + "詳細を見る" link under the ring always
     point at the front card instead, and are the accessible surface
     together with the prev / pause / next buttons.
   - Autoplay runs only while the ring is on-screen, the tab is
     visible, the user hasn't paused it, and the pointer / keyboard
     focus isn't inside the ring.

   Adding a stay: add an <li data-award-item> to about.html — the
   item count is read at runtime.
   ============================================================ */

(function () {
  "use strict";

  var ring = document.querySelector("[data-award-ring]");
  if (!ring) {
    return;
  }

  var stage = ring.querySelector("[data-award-stage]");
  var track = ring.querySelector("[data-award-track]");
  var controls = ring.querySelector("[data-award-controls]");
  var prevButton = ring.querySelector("[data-award-prev]");
  var nextButton = ring.querySelector("[data-award-next]");
  var toggleButton = ring.querySelector("[data-award-toggle]");
  var toggleLabel = ring.querySelector("[data-award-toggle-label]");
  var statusText = ring.querySelector("[data-award-status]");
  var currentLink = ring.querySelector("[data-award-current]");
  var items = Array.prototype.slice.call(track.querySelectorAll("[data-award-item]"));
  var count = items.length;

  if (!stage || !count) {
    return;
  }

  var i18n = window.YuseiI18n;
  var motionQuery =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---- Ring geometry / timing ---- */
  var STEP = Math.PI / 7;        // angle between neighbouring slots
  var SPEED = 1 / 5;             // slots per second while auto-rotating
  var FRONT_BAND = 1.2;          // |offset| that stays flat, sharp, fully opaque
  var FADE_SPAN = 2.1;           // offsets over which side cards fade out
  var HIDE_AT = FRONT_BAND + FADE_SPAN + 0.3;
  var MIN_SLOTS = 9;             // enough that the hidden back of the ring never shows

  /* ---- State ---- */
  var enabled = false;
  var slots = [];
  var clones = [];
  var slotCount = 0;
  var rotation = 0;              // float, in slot units; slot i sits at offset (i - rotation)
  var playing = true;            // user intent (pause button)
  var hovered = false;
  var focused = false;
  var onScreen = true;
  var dragging = false;
  var tween = null;
  var rafId = 0;
  var lastTime = 0;
  var currentIndex = -1;
  var suppressClick = false;
  var drag = null;
  var metrics = { radius: 700, spacing: 300 };
  var observer = null;

  function t(key, vars) {
    return i18n ? i18n.t(key, vars) : key;
  }

  function lang() {
    return i18n ? i18n.getLang() : "ja";
  }

  function itemName(item) {
    var ja = item.getAttribute("data-name-ja");
    var en = item.getAttribute("data-name-en");
    var l = lang();
    return l === "en" || l === "ko" ? en : ja + " " + en;
  }

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  // Signed offset of a slot from the front, wrapped to [-slotCount/2, slotCount/2).
  function offsetOf(index) {
    var d = mod(index - rotation, slotCount);
    return d >= slotCount / 2 ? d - slotCount : d;
  }

  /* ---- Localised text (both modes) ---- */
  function localiseCards() {
    var all = items.concat(clones);
    all.forEach(function (li) {
      var img = li.querySelector("img");
      if (img) {
        img.alt = t("aboutPage.awards.cardAlt", { name: itemName(li) });
      }
    });
  }

  function renderToggle() {
    var key = playing ? "aboutPage.awards.pause" : "aboutPage.awards.play";
    toggleLabel.textContent = t(key);
    toggleButton.classList.toggle("is-paused", !playing);
  }

  function renderStatus(force) {
    var index = mod(Math.round(rotation), slotCount) % count;
    if (!force && index === currentIndex) {
      return;
    }
    currentIndex = index;
    var item = items[index];
    var name = itemName(item);
    statusText.textContent = t("aboutPage.awards.current", {
      index: pad(index + 1),
      total: pad(count),
      name: name
    });
    currentLink.href = item.querySelector("a").getAttribute("href");
    currentLink.setAttribute("aria-label", t("aboutPage.awards.cardAria", { name: name }));
  }

  // APG carousel guidance: don't announce slide changes while it is
  // rotating on its own; do announce them once the user is in control.
  function renderLiveRegion() {
    statusText.setAttribute("aria-live", playing && !focused ? "off" : "polite");
  }

  /* ---- Layout ---- */
  function measure() {
    var cardWidth = items[0].offsetWidth || 300;
    var narrow = stage.clientWidth < 700;
    metrics.spacing = cardWidth * (narrow ? 0.74 : 1.06);
    metrics.radius = metrics.spacing / Math.sin(STEP);
  }

  function layout() {
    var radius = metrics.radius;
    for (var i = 0; i < slotCount; i++) {
      var el = slots[i];
      var d = offsetOf(i);
      var ad = Math.abs(d);

      if (ad > HIDE_AT) {
        el.style.visibility = "hidden";
        el.classList.remove("is-front");
        continue;
      }

      var sign = d < 0 ? -1 : 1;
      var angle = d * STEP;
      var x = Math.sin(angle) * radius;
      var z = -(1 - Math.cos(angle)) * radius * 0.9;
      var side = Math.max(0, ad - FRONT_BAND);
      var turn = sign * Math.min(side, 2) * 22;
      var scale = 1 - Math.min(side, 2.4) * 0.08;
      var opacity = Math.max(0, 1 - side / FADE_SPAN);
      var blur = Math.min(3, side * 1.6);

      el.style.visibility = "visible";
      el.style.transform =
        "translate(-50%, -50%) translate3d(" + x.toFixed(1) + "px, 0, " + z.toFixed(1) + "px)" +
        " rotateY(" + turn.toFixed(2) + "deg) scale(" + scale.toFixed(3) + ")";
      el.style.opacity = opacity.toFixed(3);
      el.style.filter = blur > 0.05 ? "blur(" + blur.toFixed(2) + "px)" : "";
      el.style.zIndex = String(100 - Math.round(ad * 10));
      el.classList.toggle("is-front", ad < 0.5);
    }
  }

  /* ---- Animation loop ---- */
  function shouldAutoplay() {
    return playing && !hovered && !focused && !dragging && onScreen && !document.hidden;
  }

  function easeOut(p) {
    return 1 - Math.pow(1 - p, 3);
  }

  function tick(now) {
    rafId = 0;
    if (!enabled) {
      return;
    }
    var dt = lastTime ? Math.min(0.1, (now - lastTime) / 1000) : 0;
    lastTime = now;

    if (tween) {
      var p = Math.min(1, (now - tween.start) / tween.duration);
      rotation = tween.from + (tween.to - tween.from) * easeOut(p);
      if (p >= 1) {
        tween = null;
        rotation = mod(rotation, slotCount);
      }
    } else if (shouldAutoplay()) {
      rotation = mod(rotation + dt * SPEED, slotCount);
    }

    layout();
    renderStatus(false);

    if (tween || shouldAutoplay()) {
      rafId = window.requestAnimationFrame(tick);
    } else {
      lastTime = 0;
    }
  }

  function wake() {
    renderLiveRegion();
    if (enabled && !rafId && (tween || shouldAutoplay())) {
      lastTime = 0;
      rafId = window.requestAnimationFrame(tick);
    }
  }

  function tweenTo(target, duration) {
    tween = {
      from: rotation,
      to: target,
      start: window.performance.now(),
      duration: duration || 700
    };
    wake();
  }

  function goBy(delta) {
    var base = tween ? tween.to : rotation;
    tweenTo(Math.round(base) + delta);
  }

  /* ---- Build / tear down ring mode ---- */
  function enable() {
    if (enabled) {
      return;
    }
    enabled = true;

    var copies = count >= MIN_SLOTS ? 1 : Math.ceil(MIN_SLOTS / count);
    for (var c = 1; c < copies; c++) {
      items.forEach(function (item) {
        var clone = item.cloneNode(true);
        clone.removeAttribute("data-award-item");
        clone.setAttribute("data-award-clone", "");
        track.appendChild(clone);
        clones.push(clone);
      });
    }
    slots = items.concat(clones);
    slotCount = slots.length;

    ring.classList.add("is-ring");
    track.setAttribute("aria-hidden", "true");
    slots.forEach(function (li) {
      var link = li.querySelector("a");
      link.setAttribute("tabindex", "-1");
      link.setAttribute("draggable", "false");
    });
    stage.setAttribute("tabindex", "0");
    stage.setAttribute("aria-describedby", "award-ring-instructions");
    controls.hidden = false;

    localiseCards();
    measure();
    layout();
    renderStatus(true);
    renderToggle();
    wake();
  }

  function disable() {
    if (!enabled) {
      return;
    }
    enabled = false;
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
    tween = null;
    drag = null;
    dragging = false;

    clones.forEach(function (clone) {
      clone.remove();
    });
    clones = [];
    items.forEach(function (li) {
      li.removeAttribute("style");
      li.classList.remove("is-front");
      var link = li.querySelector("a");
      link.removeAttribute("tabindex");
      link.removeAttribute("draggable");
    });
    slots = items.slice();
    slotCount = slots.length;

    ring.classList.remove("is-ring");
    track.removeAttribute("aria-hidden");
    stage.removeAttribute("tabindex");
    stage.removeAttribute("aria-describedby");
    stage.classList.remove("is-dragging");
    controls.hidden = true;
  }

  /* ---- Controls ---- */
  prevButton.addEventListener("click", function () {
    goBy(-1);
  });

  nextButton.addEventListener("click", function () {
    goBy(1);
  });

  toggleButton.addEventListener("click", function () {
    playing = !playing;
    renderToggle();
    wake();
  });

  stage.addEventListener("keydown", function (event) {
    if (!enabled) {
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goBy(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goBy(1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      currentLink.click();
    }
  });

  /* ---- Pause on hover / focus ---- */
  stage.addEventListener("pointerenter", function (event) {
    if (event.pointerType === "mouse") {
      hovered = true;
      wake();
    }
  });

  stage.addEventListener("pointerleave", function (event) {
    if (event.pointerType === "mouse") {
      hovered = false;
      wake();
    }
  });

  // Only keyboard focus pauses — a mouse click on a button or the stage
  // shouldn't leave autoplay stuck until the user clicks elsewhere.
  function isKeyboardFocus(el) {
    try {
      return el.matches(":focus-visible");
    } catch (e) {
      return true;
    }
  }

  ring.addEventListener("focusin", function (event) {
    focused = isKeyboardFocus(event.target);
    wake();
  });

  ring.addEventListener("focusout", function (event) {
    if (!event.relatedTarget || !ring.contains(event.relatedTarget)) {
      focused = false;
      wake();
    }
  });

  /* ---- Drag / swipe ----
     Pointer capture is only taken once the gesture is clearly
     horizontal, so a simple click still reaches the card link and
     vertical swipes still scroll the page (touch-action: pan-y). */
  stage.addEventListener("pointerdown", function (event) {
    if (!enabled || (event.pointerType === "mouse" && event.button !== 0)) {
      return;
    }
    drag = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startRotation: rotation,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocity: 0,
      moved: false
    };
  });

  stage.addEventListener("pointermove", function (event) {
    if (!drag || event.pointerId !== drag.id) {
      return;
    }
    var dx = event.clientX - drag.startX;

    if (!drag.moved) {
      if (Math.abs(dx) < 6) {
        return;
      }
      if (Math.abs(event.clientY - drag.startY) > Math.abs(dx)) {
        drag = null;
        return;
      }
      drag.moved = true;
      dragging = true;
      tween = null;
      drag.startX = event.clientX;
      drag.startRotation = rotation;
      dx = 0;
      stage.classList.add("is-dragging");
      try {
        stage.setPointerCapture(event.pointerId);
      } catch (e) {
        /* capture unsupported — dragging still works while over the stage */
      }
    }

    var elapsed = event.timeStamp - drag.lastTime;
    if (elapsed > 0) {
      drag.velocity = (event.clientX - drag.lastX) / elapsed;
    }
    drag.lastX = event.clientX;
    drag.lastTime = event.timeStamp;

    rotation = drag.startRotation - dx / metrics.spacing;
    layout();
    renderStatus(false);
  });

  function endDrag(event) {
    if (!drag || event.pointerId !== drag.id) {
      return;
    }
    if (drag.moved) {
      // Carry a little of the release velocity (px/ms) forward, then settle.
      var fling = Math.max(-2, Math.min(2, (-drag.velocity * 220) / metrics.spacing));
      suppressClick = true;
      window.setTimeout(function () {
        suppressClick = false;
      }, 0);
      dragging = false;
      stage.classList.remove("is-dragging");
      tweenTo(Math.round(rotation + fling), 520);
    }
    drag = null;
  }

  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);

  // A click on a side card brings it to the front; a click on the front
  // card follows its link. Clicks that end a drag are swallowed.
  track.addEventListener(
    "click",
    function (event) {
      if (!enabled) {
        return;
      }
      var link = event.target.closest("a");
      if (!link) {
        return;
      }
      if (suppressClick) {
        event.preventDefault();
        return;
      }
      var index = slots.indexOf(link.closest("li"));
      if (index === -1) {
        return;
      }
      var d = offsetOf(index);
      if (Math.abs(d) > 0.5) {
        event.preventDefault();
        tweenTo(rotation + d);
      }
    },
    true
  );

  /* ---- Visibility / resize / language / motion preference ---- */
  if (typeof IntersectionObserver !== "undefined") {
    observer = new IntersectionObserver(
      function (entries) {
        onScreen = entries[0].isIntersecting;
        wake();
      },
      { threshold: 0.1 }
    );
    observer.observe(ring);
  }

  document.addEventListener("visibilitychange", wake);

  var resizeTimer = 0;
  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      if (enabled) {
        measure();
        layout();
      }
    }, 120);
  });

  document.addEventListener("yusei:langchange", function () {
    localiseCards();
    if (enabled) {
      renderStatus(true);
      renderToggle();
    }
  });

  function applyMotionPreference() {
    if (motionQuery && motionQuery.matches) {
      disable();
    } else {
      enable();
    }
  }

  if (motionQuery && typeof motionQuery.addEventListener === "function") {
    motionQuery.addEventListener("change", applyMotionPreference);
  }

  slots = items.slice();
  slotCount = slots.length;
  localiseCards();
  applyMotionPreference();
})();
