/* ============================================================
   Yusei Stay — Osaka Guide page controller (tour-guide.html)

   "ここを拠点に、大阪を楽しむ。" — the guest picks ONE stay as the
   fixed base for the whole trip; every chapter is written from
   and back to that stay. The five chapters are reading progress
   through the guide, not a day-by-day route between stays.

   - Stay selector: APG tabs (automatic activation, Left/Right/
     Up/Down/Home/End), a sliding selected-tab indicator, plus a
     compact sticky "current base" bar with a native <select>.
   - URL: ?stay=<StayData id>. Click / select => pushState, arrow
     keys => replaceState, popstate re-renders. With no ?stay the
     last base (localStorage) is used; legacy #shinsekai / #namba /
     #bay / #kaizuka anchors map to a stay in that area; anything
     invalid falls back to the first stay.
   - Chapter rail: IntersectionObserver marks the chapter in view
     with aria-current; a rAF-throttled scroll listener only
     updates the progress line. No scroll hijacking.
   - Entry motion: IntersectionObserver adds a one-shot staggered
     entry to blocks that start off-screen. Content already on
     screen is never hidden or faded out. Each render bumps a
     token and rebuilds the observer, so rapid switching cannot
     leave stale animations. prefers-reduced-motion skips it all.
   - Re-renders in place on "yusei:langchange", keeping the stay
     and the reader's chapter/scroll position.
   Data: js/stay-data.js (names, photos, addresses) and
   js/guide-data.js (all guide facts).
   ============================================================ */

(function () {
  "use strict";

  var i18n = window.YuseiI18n;
  var StayData = window.YuseiStayData;
  var Guide = window.YuseiGuideData;

  var tabList = document.getElementById("guide-tablist");
  var panel = document.getElementById("guide-panel");
  if (!i18n || !StayData || !Guide || !tabList || !panel) {
    return;
  }

  var STORAGE_KEY = "yusei-guide-stay";
  var CHAPTERS = ["from", "near", "further", "day", "daily"];
  var CHAPTER_EYEBROWS = {
    from: "FROM YOUR BASE",
    near: "AROUND THE STAY",
    further: "A LITTLE FURTHER",
    day: "DAY TRIPS",
    daily: "EVERYDAY LIFE"
  };

  var motionQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var tabScroller = document.querySelector(".guide-tabs__scroller");
  var indicator = document.querySelector(".guide-tabs__indicator");
  var baseSelect = document.getElementById("guide-base-select");
  var baseThumb = document.getElementById("guide-basebar-thumb");
  var baseName = document.getElementById("guide-basebar-name");
  var baseArea = document.getElementById("guide-basebar-area");
  var liveRegion = document.getElementById("guide-live");
  var guideBody = document.getElementById("guide-body");
  var railLinks = Array.prototype.slice.call(document.querySelectorAll(".guide-rail__link"));

  var state = {
    stay: null,
    activeChapter: "from",
    renderToken: 0
  };
  var tabs = {};
  var revealObserver = null;

  /* ---------------------------------------------------------
     Helpers
     --------------------------------------------------------- */
  function reducedMotion() {
    return !!(motionQuery && motionQuery.matches);
  }

  function lang() {
    return i18n.getLang();
  }

  function pick(field) {
    return StayData.pick(field, lang());
  }

  function t(key, vars) {
    return i18n.t(key, vars);
  }

  function isStay(id) {
    return typeof id === "string" &&
      Object.prototype.hasOwnProperty.call(Guide.stays, id) &&
      Object.prototype.hasOwnProperty.call(StayData.stays, id);
  }

  function h(tag, className, text) {
    var node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (text !== undefined && text !== null) {
      node.textContent = text;
    }
    return node;
  }

  function stayData(id) {
    return StayData.stays[id || state.stay];
  }

  function guideData(id) {
    return Guide.stays[id || state.stay];
  }

  function fullName(id) {
    var s = stayData(id);
    return s.nameJa + " " + s.nameEn;
  }

  function photoSrc(id, file) {
    return encodeURI("assets/properties/" + stayData(id).folder + "/" + file);
  }

  function placeName(placeId) {
    var place = Guide.places[placeId];
    return place ? pick(place.name) : placeId;
  }

  function safeGetStorage() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function safeSetStorage(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      /* storage blocked — the URL still carries the stay */
    }
  }

  /* ---------------------------------------------------------
     Time / source / map text
     --------------------------------------------------------- */
  function timeText(value, unit) {
    return t(unit === "h" ? "guide.time.h" : "guide.time.min", { t: value });
  }

  function wayTimeText(way) {
    if (!way.t) {
      return t("guide.time.unknown");
    }
    var time = timeText(way.t, way.unit);
    if (way.from === "station") {
      return t("guide.origin.station", { station: placeName(way.station), time: time });
    }
    if (way.from === "poster") {
      return t("guide.origin.poster", { time: time });
    }
    return t("guide.origin.stay", { time: time });
  }

  function sourceText(way) {
    switch (way.src) {
      case "gm":
        return t("guide.src.gm");
      case "gmNear":
        return t("guide.src.gmNear");
      case "poster":
        return t("guide.src.poster");
      case "web":
        return t("guide.src.web");
      default:
        return t("guide.src.doc");
    }
  }

  var TRAVEL_MODES = { walk: "walking", drive: "driving", taxi: "driving", train: "transit", bus: "transit" };

  function originAddress() {
    var s = stayData();
    var g = guideData();
    if (!g.originConfirmed || !s.address || !s.verified || !s.verified.address) {
      return null;
    }
    return StayData.pick(s.address, "ja");
  }

  /* Directions from the stay's confirmed address when there is one;
     otherwise (Harmony Garden) a plain destination search. */
  function mapHref(query, mode) {
    if (!query) {
      return null;
    }
    var origin = originAddress();
    if (origin && mode) {
      return "https://www.google.com/maps/dir/?api=1&origin=" + encodeURIComponent(origin) +
        "&destination=" + encodeURIComponent(query) +
        "&travelmode=" + (TRAVEL_MODES[mode] || "transit");
    }
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);
  }

  function externalLink(href, label, ariaLabel, className) {
    var a = h("a", className || "guide-maplink");
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.appendChild(h("span", null, label));
    a.appendChild(h("span", "guide-maplink__arrow", "↗")).setAttribute("aria-hidden", "true");
    a.setAttribute("aria-label", ariaLabel + t("guide.link.newTab"));
    return a;
  }

  function placeMapLink(placeId, mode) {
    var place = Guide.places[placeId];
    var href = place && mapHref(place.query, mode);
    if (!href) {
      return null;
    }
    var directions = href.indexOf("/dir/") !== -1;
    var label = directions ? t("guide.link.directions") : t("guide.link.search");
    var aria = directions
      ? t("guide.link.directionsAria", { place: placeName(placeId), name: fullName() })
      : t("guide.link.searchAria", { place: placeName(placeId) });
    return externalLink(href, label, aria);
  }

  /* ---------------------------------------------------------
     Stop list items (a destination + one or more ways to go)
     The summary shows the name and time (including any station /
     unclear-origin wording the time depends on). Route, note,
     source and map link stay collapsed inside the <details>.
     --------------------------------------------------------- */
  function renderWays(item) {
    var wrap = h("span", "guide-stop__ways");
    item.ways.forEach(function (way) {
      var w = h("span", "guide-way");
      w.appendChild(h("span", "guide-way__mode guide-way__mode--" + way.mode, t("guide.mode." + way.mode)));
      w.appendChild(h("span", "guide-way__time", wayTimeText(way)));
      wrap.appendChild(w);
    });
    return wrap;
  }

  function renderStop(item) {
    var mainMode = item.ways[0] && item.ways[0].mode;
    var mapLink = placeMapLink(item.place, mainMode);

    var head = h("span", "guide-stop__head");
    head.appendChild(h("span", "guide-stop__name", placeName(item.place)));
    head.appendChild(renderWays(item));

    var sources = [];
    item.ways.forEach(function (way) {
      var s = sourceText(way);
      if (sources.indexOf(s) === -1) {
        sources.push(s);
      }
    });

    var liD = h("li", "guide-stop guide-stop--details");
    var details = h("details", "guide-disclosure");
    var summary = h("summary", "guide-disclosure__summary");
    summary.appendChild(head);
    summary.appendChild(h("span", "guide-disclosure__icon")).setAttribute("aria-hidden", "true");
    details.appendChild(summary);

    var body = h("div", "guide-disclosure__body");
    item.ways.forEach(function (way) {
      if (!way.route) {
        return;
      }
      var p = h("p", "guide-stop__route");
      p.appendChild(h("span", "guide-stop__route-mode", t("guide.mode." + way.mode)));
      p.appendChild(document.createTextNode(pick(way.route)));
      body.appendChild(p);
    });
    if (item.note) {
      body.appendChild(h("p", "guide-stop__note", pick(item.note)));
    }
    body.appendChild(h("p", "guide-stop__source", sources.join(" / ")));
    if (mapLink) {
      body.appendChild(mapLink);
    }
    details.appendChild(body);
    liD.appendChild(details);
    return liD;
  }

  function renderStopGroup(titleKey, noteKey, items, modifier) {
    var group = h("div", "guide-group" + (modifier ? " guide-group--" + modifier : ""));
    group.setAttribute("data-anim", "");
    group.appendChild(h("h4", "guide-group__title", t(titleKey)));
    if (noteKey) {
      group.appendChild(h("p", "guide-group__note", t(noteKey)));
    }
    var list = h("ul", "guide-stops");
    items.forEach(function (item) {
      list.appendChild(renderStop(item));
    });
    group.appendChild(list);
    return group;
  }

  function renderNoTimeGroup(placeIds) {
    var group = h("div", "guide-group guide-group--plain");
    group.setAttribute("data-anim", "");
    group.appendChild(h("h4", "guide-group__title", t("guide.group.noTime")));
    group.appendChild(h("p", "guide-group__note", t("guide.group.noTimeNote")));
    var list = h("ul", "guide-stops");
    placeIds.forEach(function (placeId) {
      var li = h("li", "guide-stop");
      var row = h("div", "guide-stop__row");
      var head = h("span", "guide-stop__head");
      head.appendChild(h("span", "guide-stop__name", placeName(placeId)));
      row.appendChild(head);
      var link = placeMapLink(placeId, null);
      if (link) {
        row.appendChild(link);
      }
      li.appendChild(row);
      list.appendChild(li);
    });
    group.appendChild(list);
    return group;
  }

  /* ---------------------------------------------------------
     Chapter scaffolding (photo + editorial copy, alternating)
     --------------------------------------------------------- */
  function renderMedia(opts) {
    var figure = h("figure", "guide-chapter__media");
    figure.setAttribute("data-anim", "");
    var frame = h("div", "guide-chapter__frame");
    var img = h("img", "guide-chapter__image");
    img.src = opts.src;
    img.alt = opts.alt;
    img.loading = opts.eager ? "eager" : "lazy";
    img.decoding = "async";
    frame.appendChild(img);
    if (opts.caption) {
      var cap = h("figcaption", "guide-area__caption guide-chapter__caption");
      cap.setAttribute("aria-hidden", "true");
      opts.caption.split("<br>").forEach(function (line, index) {
        if (index) {
          cap.appendChild(document.createElement("br"));
        }
        cap.appendChild(document.createTextNode(line));
      });
      frame.appendChild(cap);
    }
    figure.appendChild(frame);
    if (opts.inset) {
      var insetWrap = h("div", "guide-chapter__inset");
      var inset = h("img", "guide-chapter__inset-image");
      inset.src = opts.inset.src;
      inset.alt = opts.inset.alt;
      inset.loading = "lazy";
      inset.decoding = "async";
      insetWrap.appendChild(inset);
      figure.appendChild(insetWrap);
      figure.classList.add("guide-chapter__media--inset");
    }
    return figure;
  }

  function stayPhoto(file, eager) {
    var name = fullName();
    return {
      src: photoSrc(state.stay, file),
      alt: t("guide.photo.stayAlt", { name: name }),
      caption: stayData().nameEn,
      eager: eager
    };
  }

  function chapterHead(chapter, headingText) {
    var head = h("div", "guide-chapter__head");
    head.setAttribute("data-anim", "");
    var eyebrow = h("p", "guide-chapter__eyebrow");
    eyebrow.appendChild(h("span", "guide-chapter__number", "0" + (CHAPTERS.indexOf(chapter) + 1))).setAttribute("aria-hidden", "true");
    eyebrow.appendChild(document.createTextNode(CHAPTER_EYEBROWS[chapter]));
    head.appendChild(eyebrow);
    var title = h("h2", "guide-chapter__title", t("guide.ch." + chapter));
    title.id = "guide-" + chapter + "-heading";
    title.tabIndex = -1;
    head.appendChild(title);
    if (headingText) {
      head.appendChild(h("p", "guide-chapter__heading", headingText));
    }
    return head;
  }

  function chapterLayout(media, content, reverse) {
    var inner = h("div", "guide-chapter__inner" + (reverse ? " guide-chapter__inner--reverse" : ""));
    inner.appendChild(media);
    inner.appendChild(content);
    return inner;
  }

  /* ---- 01 この宿から (identity + transport overview) ---- */
  function renderFrom() {
    var s = stayData();
    var g = guideData();
    var content = h("div", "guide-chapter__content");
    content.appendChild(chapterHead("from", null));

    var identity = h("div", "guide-identity");
    identity.setAttribute("data-anim", "");
    identity.appendChild(h("p", "guide-identity__label", t("guide.base.current")));
    var name = h("h3", "guide-identity__name");
    name.appendChild(h("span", "guide-identity__ja", s.nameJa));
    name.appendChild(h("span", "guide-identity__en", s.nameEn));
    identity.appendChild(name);
    identity.appendChild(h("p", "guide-identity__area", t("stayCard." + state.stay + ".location")));
    identity.appendChild(h("p", "guide-chapter__heading", pick(s.tagline)));

    /* Unconfirmed addresses (Harmony Garden) are omitted entirely;
       the area line above and the map link still locate the stay. */
    if (g.originConfirmed && s.address) {
      var addr = h("dl", "guide-identity__facts");
      addr.appendChild(h("dt", null, t("guide.base.address")));
      addr.appendChild(h("dd", null, StayData.pick(s.address, "ja")));
      identity.appendChild(addr);
    }
    if (s.mapUrl) {
      identity.appendChild(externalLink(s.mapUrl, t("guide.base.map"), t("guide.base.mapAria", { name: fullName() }), "guide-maplink guide-maplink--strong"));
    }
    content.appendChild(identity);

    var intro = h("p", "guide-chapter__body", pick(g.intro));
    intro.setAttribute("data-anim", "");
    content.appendChild(intro);

    content.appendChild(renderStopGroup("guide.group.access", "guide.group.accessNote", g.access, "access"));

    if (g.warning) {
      var warn = h("div", "guide-notice");
      warn.setAttribute("role", "note");
      warn.setAttribute("data-anim", "");
      warn.appendChild(h("p", "guide-notice__label", t("guide.notice.label")));
      warn.appendChild(h("p", "guide-notice__text", pick(g.warning)));
      content.appendChild(warn);
    }

    if (g.airport) {
      var details = h("details", "guide-disclosure guide-disclosure--block");
      details.setAttribute("data-anim", "");
      var summary = h("summary", "guide-disclosure__summary");
      summary.appendChild(h("span", "guide-disclosure__title", t("guide.details.airport")));
      summary.appendChild(h("span", "guide-disclosure__icon")).setAttribute("aria-hidden", "true");
      details.appendChild(summary);
      var body = h("div", "guide-disclosure__body");
      body.appendChild(h("p", null, pick(g.airport)));
      details.appendChild(body);
      content.appendChild(details);
    }

    return chapterLayout(renderMedia(stayPhoto(g.photos.from, true)), content, false);
  }

  /* ---- 02 近所を楽しむ ---- */
  function renderRestaurants(listId) {
    var list = Guide.restaurants[listId];
    var details = h("details", "guide-disclosure guide-disclosure--block");
    details.setAttribute("data-anim", "");
    var summary = h("summary", "guide-disclosure__summary");
    summary.appendChild(h("span", "guide-disclosure__title", t("guide.details.restaurants", { count: list.length })));
    summary.appendChild(h("span", "guide-disclosure__icon")).setAttribute("aria-hidden", "true");
    details.appendChild(summary);

    var body = h("div", "guide-disclosure__body");
    body.appendChild(h("p", "guide-group__note", t(listId === "art" ? "guide.restaurants.artNote" : "guide.restaurants.note")));
    var ol = h("ol", "guide-restaurants");
    list.forEach(function (r) {
      var li = h("li", "guide-restaurant");
      var text = h("div", "guide-restaurant__text");
      text.appendChild(h("span", "guide-restaurant__name", r.name));
      if (r.kind) {
        text.appendChild(h("span", "guide-restaurant__kind", pick(r.kind)));
      }
      text.appendChild(h("span", "guide-restaurant__address", r.address || t("guide.restaurants.noAddress")));
      li.appendChild(text);
      var query = r.address ? r.name + " " + r.address + " 大阪市港区" : r.name + " " + r.areaQuery;
      li.appendChild(externalLink(
        "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query),
        t("guide.link.search"),
        t("guide.link.searchAria", { place: r.name })
      ));
      ol.appendChild(li);
    });
    body.appendChild(ol);
    details.appendChild(body);
    return details;
  }

  function renderNear() {
    var g = guideData();
    var content = h("div", "guide-chapter__content");
    content.appendChild(chapterHead("near", t("guide.near.heading")));
    var lead = h("p", "guide-chapter__body", t("guide.near.lead"));
    lead.setAttribute("data-anim", "");
    content.appendChild(lead);

    if (g.near.spots && g.near.spots.length) {
      content.appendChild(renderStopGroup("guide.group.nearby", null, g.near.spots));
    }
    if (g.near.noTime && g.near.noTime.length) {
      content.appendChild(renderNoTimeGroup(g.near.noTime));
    }
    if (g.near.extra) {
      var extra = h("p", "guide-chapter__body guide-chapter__body--accent", pick(g.near.extra));
      extra.setAttribute("data-anim", "");
      content.appendChild(extra);
    }
    /* Stays without a restaurant list simply skip this block;
       everyday shops follow in 暮らしの便利帳. */
    if (g.near.restaurants) {
      content.appendChild(renderRestaurants(g.near.restaurants));
    }
    return chapterLayout(renderMedia(stayPhoto(g.photos.near)), content, true);
  }

  /* ---- 03 少し足をのばす ---- */
  function renderFurther() {
    var g = guideData();
    var content = h("div", "guide-chapter__content");
    content.appendChild(chapterHead("further", t("guide.further.heading")));
    var lead = h("p", "guide-chapter__body", t("guide.further.lead"));
    lead.setAttribute("data-anim", "");
    content.appendChild(lead);

    if (g.further.transit && g.further.transit.length) {
      content.appendChild(renderStopGroup("guide.group.transit", "guide.group.transitNote", g.further.transit, "transit"));
    }
    if (g.further.poster && g.further.poster.length) {
      content.appendChild(renderStopGroup("guide.group.poster", "guide.group.posterNote", g.further.poster, "poster"));
    }
    if (g.further.drive && g.further.drive.length) {
      content.appendChild(renderStopGroup("guide.group.drive", "guide.group.driveNote", g.further.drive, "drive"));
    }

    var media;
    if (g.areaPhoto) {
      media = renderMedia({
        src: g.areaPhoto.src,
        alt: t(g.areaPhoto.altKey),
        caption: g.areaPhoto.caption,
        inset: g.areaPhoto2 ? { src: g.areaPhoto2.src, alt: t(g.areaPhoto2.altKey) } : null
      });
    } else {
      media = renderMedia(stayPhoto(g.furtherPhoto));
    }
    return chapterLayout(media, content, false);
  }

  /* ---- 04 一日のおでかけ ---- */
  function renderDay() {
    var g = guideData();
    var content = h("div", "guide-chapter__content");
    content.appendChild(chapterHead("day", t("guide.day.heading", { name: fullName() })));
    var lead = h("p", "guide-chapter__body", t("guide.day.lead"));
    lead.setAttribute("data-anim", "");
    content.appendChild(lead);

    var override = g.dayOverride;
    if (override) {
      content.appendChild(renderStopGroup("guide.group.nearDay", "guide.group.posterNote", override.trips, "poster"));
      var note = h("div", "guide-notice guide-notice--soft");
      note.setAttribute("role", "note");
      note.setAttribute("data-anim", "");
      note.appendChild(h("p", "guide-notice__text", pick(override.note)));
      content.appendChild(note);
    }

    var group = h("div", "guide-group guide-group--day");
    group.setAttribute("data-anim", "");
    group.appendChild(h("h4", "guide-group__title", t("guide.group.dayTrips")));
    group.appendChild(h("p", "guide-group__note", t(override ? "guide.day.rideOnlyNote" : "guide.day.totalNote")));
    var list = h("ul", "guide-stops");
    Guide.dayTrips.forEach(function (trip) {
      var li = h("li", "guide-stop guide-stop--details");
      var details = h("details", "guide-disclosure");
      var summary = h("summary", "guide-disclosure__summary");
      var head = h("span", "guide-stop__head");
      head.appendChild(h("span", "guide-stop__name", placeName(trip.place)));
      var ways = h("span", "guide-stop__ways");
      var w = h("span", "guide-way");
      if (!override) {
        var total = trip.total.all || trip.total[g.group];
        w.appendChild(h("span", "guide-way__mode guide-way__mode--total", t("guide.day.total")));
        w.appendChild(h("span", "guide-way__time", t("guide.origin.stay", { time: timeText(total.t, total.unit) })));
      } else {
        w.appendChild(h("span", "guide-way__mode guide-way__mode--train", t("guide.mode.train")));
        w.appendChild(h("span", "guide-way__time", trip.ride ? t("guide.day.ride", { time: timeText(trip.ride.t, trip.ride.unit) }) : pick(trip.rideNote)));
      }
      ways.appendChild(w);
      head.appendChild(ways);
      summary.appendChild(head);
      summary.appendChild(h("span", "guide-disclosure__icon")).setAttribute("aria-hidden", "true");
      details.appendChild(summary);

      var body = h("div", "guide-disclosure__body");
      var route = h("p", "guide-stop__route");
      route.appendChild(h("span", "guide-stop__route-mode", t("guide.day.route")));
      route.appendChild(document.createTextNode(pick(trip.route)));
      body.appendChild(route);
      body.appendChild(h("p", "guide-stop__note", trip.ride
        ? t("guide.day.ride", { time: timeText(trip.ride.t, trip.ride.unit) })
        : pick(trip.rideNote)));
      if (trip.note) {
        body.appendChild(h("p", "guide-stop__note", pick(trip.note)));
      }
      body.appendChild(h("p", "guide-stop__source", t(override ? "guide.src.web" : "guide.src.dayTrip")));
      var link = placeMapLink(trip.place, null);
      if (link) {
        body.appendChild(link);
      }
      details.appendChild(body);
      li.appendChild(details);
      list.appendChild(li);
    });
    group.appendChild(list);
    content.appendChild(group);
    return chapterLayout(renderMedia(stayPhoto(g.photos.day)), content, true);
  }

  /* ---- 05 暮らしの便利帳 ---- */
  function renderDaily() {
    var g = guideData();
    var content = h("div", "guide-chapter__content");
    content.appendChild(chapterHead("daily", t("guide.daily.heading")));
    var lead = h("p", "guide-chapter__body", t("guide.daily.lead"));
    lead.setAttribute("data-anim", "");
    content.appendChild(lead);

    if (g.daily.items.length) {
      var group = h("div", "guide-group");
      group.setAttribute("data-anim", "");
      group.appendChild(h("h4", "guide-group__title", t("guide.group.daily")));
      var dl = h("dl", "guide-facilities");
      g.daily.items.forEach(function (item) {
        var row = h("div", "guide-facility");
        row.appendChild(h("dt", "guide-facility__label", pick(item.label)));
        row.appendChild(h("dd", "guide-facility__time", t("guide.daily.walk", { time: timeText(item.t, "min") })));
        dl.appendChild(row);
      });
      group.appendChild(dl);
      content.appendChild(group);
    }
    if (g.daily.text) {
      var text = h("p", "guide-chapter__body", pick(g.daily.text));
      text.setAttribute("data-anim", "");
      content.appendChild(text);
    }
    if (g.daily.parking) {
      var parking = h("p", "guide-daily__parking", t("guide.daily.parking", { yen: g.daily.parking }));
      parking.setAttribute("data-anim", "");
      content.appendChild(parking);
    }
    return chapterLayout(renderMedia(stayPhoto(g.photos.daily)), content, false);
  }

  var RENDERERS = { from: renderFrom, near: renderNear, further: renderFurther, day: renderDay, daily: renderDaily };

  /* ---------------------------------------------------------
     Entry motion (one-shot, only for blocks that start off-screen)
     --------------------------------------------------------- */
  function setupMotion(animateVisible) {
    if (revealObserver) {
      revealObserver.disconnect();
      revealObserver = null;
    }
    if (reducedMotion() || typeof IntersectionObserver === "undefined") {
      return;
    }
    var token = state.renderToken;
    var viewportH = window.innerHeight || document.documentElement.clientHeight;

    function play(node) {
      node.classList.remove("guide-anim-pending");
      node.classList.add("guide-anim-in");
      node.addEventListener("animationend", function done() {
        node.removeEventListener("animationend", done);
        node.classList.remove("guide-anim-in");
      });
    }

    revealObserver = new IntersectionObserver(function (entries) {
      if (token !== state.renderToken) {
        return;
      }
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealObserver.unobserve(entry.target);
          play(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    CHAPTERS.forEach(function (chapter) {
      var section = document.getElementById("guide-" + chapter);
      var nodes = section ? section.querySelectorAll("[data-anim]") : [];
      Array.prototype.forEach.call(nodes, function (node, index) {
        node.style.setProperty("--anim-delay", Math.min(index, 6) * 70 + "ms");
        var rect = node.getBoundingClientRect();
        var onScreen = rect.top < viewportH && rect.bottom > 0;
        if (onScreen) {
          if (animateVisible) {
            play(node);
          }
          return;
        }
        if (rect.top >= viewportH) {
          node.classList.add("guide-anim-pending");
          revealObserver.observe(node);
        }
      });
    });
  }

  /* ---------------------------------------------------------
     Rendering
     --------------------------------------------------------- */
  function renderChapters(animate) {
    state.renderToken += 1;
    CHAPTERS.forEach(function (chapter) {
      var section = document.getElementById("guide-" + chapter);
      if (!section) {
        return;
      }
      section.replaceChildren(RENDERERS[chapter]());
    });
    panel.setAttribute("aria-labelledby", "guide-tab-" + state.stay);
    setupMotion(animate);
  }

  function renderTabs() {
    if (!tabList.childElementCount) {
      Guide.order.forEach(function (id) {
        if (!isStay(id)) {
          return;
        }
        var tab = h("button", "guide-tab");
        tab.type = "button";
        tab.id = "guide-tab-" + id;
        tab.setAttribute("role", "tab");
        tab.setAttribute("aria-controls", "guide-panel");
        tab.dataset.stay = id;
        var media = h("span", "guide-tab__media");
        var img = h("img", "guide-tab__image");
        img.src = photoSrc(id, Guide.stays[id].photos.tab);
        img.alt = "";
        img.loading = "lazy";
        img.decoding = "async";
        media.appendChild(img);
        tab.appendChild(media);
        var text = h("span", "guide-tab__text");
        text.appendChild(h("span", "guide-tab__name", stayData(id).nameJa));
        text.appendChild(h("span", "guide-tab__en", stayData(id).nameEn));
        text.appendChild(h("span", "guide-tab__area"));
        tab.appendChild(text);
        tab.appendChild(h("span", "guide-tab__arrow", "→")).setAttribute("aria-hidden", "true");
        tab.addEventListener("click", function () {
          selectStay(id, { history: "push" });
        });
        tabList.appendChild(tab);
        tabs[id] = tab;

        if (baseSelect) {
          var option = document.createElement("option");
          option.value = id;
          baseSelect.appendChild(option);
        }
      });
    }
    Object.keys(tabs).forEach(function (id) {
      tabs[id].querySelector(".guide-tab__area").textContent = t("stayCard." + id + ".location");
      if (baseSelect) {
        baseSelect.querySelector('option[value="' + id + '"]').textContent = fullName(id);
      }
    });
  }

  function syncTabs() {
    Object.keys(tabs).forEach(function (id) {
      var selected = id === state.stay;
      tabs[id].setAttribute("aria-selected", selected ? "true" : "false");
      tabs[id].tabIndex = selected ? 0 : -1;
      tabs[id].classList.toggle("is-selected", selected);
    });
    if (baseSelect) {
      baseSelect.value = state.stay;
    }
    positionIndicator();
  }

  function positionIndicator() {
    var tab = tabs[state.stay];
    if (!indicator || !tab) {
      return;
    }
    indicator.style.width = tab.offsetWidth + "px";
    indicator.style.height = tab.offsetHeight + "px";
    indicator.style.transform = "translate(" + tab.offsetLeft + "px, " + tab.offsetTop + "px)";
    indicator.classList.add("is-ready");
  }

  function revealSelectedTab() {
    var tab = tabs[state.stay];
    if (!tabScroller || !tab || tabScroller.scrollWidth <= tabScroller.clientWidth) {
      return;
    }
    var left = tab.offsetLeft - (tabScroller.clientWidth - tab.offsetWidth) / 2;
    tabScroller.scrollTo({ left: Math.max(0, left), behavior: reducedMotion() ? "auto" : "smooth" });
  }

  function renderBasebar() {
    var s = stayData();
    if (baseThumb) {
      baseThumb.src = photoSrc(state.stay, guideData().photos.tab);
    }
    if (baseName) {
      baseName.textContent = fullName();
    }
    if (baseArea) {
      baseArea.textContent = t("stayCard." + state.stay + ".location");
    }
    document.documentElement.setAttribute("data-guide-stay", state.stay);
    return s;
  }

  /* Keep the reader on the same chapter while content above or
     inside it changes height (stay switch / language switch). */
  function withScrollAnchor(fn) {
    var anchor = document.getElementById("guide-" + state.activeChapter);
    var bodyRect = guideBody ? guideBody.getBoundingClientRect() : null;
    var inGuide = bodyRect && bodyRect.top < 0;
    var before = anchor && inGuide ? anchor.getBoundingClientRect().top : null;
    fn();
    if (before !== null) {
      var after = anchor.getBoundingClientRect().top;
      var delta = after - before;
      if (Math.abs(delta) > 1) {
        window.scrollTo({ top: window.pageYOffset + delta, behavior: "instant" });
      }
    }
  }

  /* ---------------------------------------------------------
     URL / history
     --------------------------------------------------------- */
  function chapterHash() {
    var hash = window.location.hash.replace("#", "");
    return CHAPTERS.indexOf(hash.replace("guide-", "")) !== -1 && hash.indexOf("guide-") === 0 ? "#" + hash : "";
  }

  function urlFor(id, hash) {
    var params = new URLSearchParams(window.location.search);
    params.set("stay", id);
    return window.location.pathname + "?" + params.toString() + (hash || "");
  }

  function writeHistory(mode) {
    if (mode !== "push" && mode !== "replace") {
      return;
    }
    try {
      var url = urlFor(state.stay, chapterHash());
      var data = { guideStay: state.stay };
      if (mode === "push") {
        window.history.pushState(data, "", url);
      } else {
        window.history.replaceState(data, "", url);
      }
    } catch (e) {
      /* history unavailable (file:// in some browsers) — ignore */
    }
  }

  function selectStay(id, opts) {
    opts = opts || {};
    if (!isStay(id)) {
      id = Guide.order[0];
    }
    if (id === state.stay && !opts.force) {
      return;
    }
    var first = state.stay === null;
    state.stay = id;
    safeSetStorage(id);
    syncTabs();
    renderBasebar();
    if (first) {
      renderChapters(false);
    } else {
      withScrollAnchor(function () {
        renderChapters(true);
      });
      if (liveRegion) {
        liveRegion.textContent = t("guide.base.changed", { name: fullName() });
      }
    }
    if (opts.focusTab && tabs[id]) {
      tabs[id].focus();
    }
    revealSelectedTab();
    writeHistory(opts.history);
  }

  /* ---------------------------------------------------------
     Tabs keyboard pattern
     --------------------------------------------------------- */
  tabList.addEventListener("keydown", function (event) {
    var ids = Object.keys(tabs);
    var index = ids.indexOf(state.stay);
    var next = null;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = ids[(index + 1) % ids.length];
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = ids[(index - 1 + ids.length) % ids.length];
        break;
      case "Home":
        next = ids[0];
        break;
      case "End":
        next = ids[ids.length - 1];
        break;
      default:
        return;
    }
    event.preventDefault();
    selectStay(next, { history: "replace", focusTab: true });
  });

  if (baseSelect) {
    baseSelect.addEventListener("change", function () {
      selectStay(baseSelect.value, { history: "push" });
    });
  }

  /* ---------------------------------------------------------
     Reading-progress rail
     --------------------------------------------------------- */
  function setActiveChapter(chapter) {
    state.activeChapter = chapter;
    railLinks.forEach(function (link) {
      if (link.dataset.chapter === chapter) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  var visibleChapters = {};
  if (typeof IntersectionObserver !== "undefined") {
    var chapterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visibleChapters[entry.target.dataset.chapter] = entry.isIntersecting;
      });
      for (var i = CHAPTERS.length - 1; i >= 0; i -= 1) {
        if (visibleChapters[CHAPTERS[i]]) {
          setActiveChapter(CHAPTERS[i]);
          return;
        }
      }
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    CHAPTERS.forEach(function (chapter) {
      var section = document.getElementById("guide-" + chapter);
      if (section) {
        chapterObserver.observe(section);
      }
    });
  }

  var progressQueued = false;
  function updateProgress() {
    progressQueued = false;
    var panelRect = panel.getBoundingClientRect();
    var viewportH = window.innerHeight || document.documentElement.clientHeight;
    var total = panelRect.height - viewportH * 0.5;
    var done = viewportH * 0.5 - panelRect.top;
    var ratio = total > 0 ? Math.min(1, Math.max(0, done / total)) : 0;
    guideBody.style.setProperty("--guide-progress", ratio.toFixed(4));
  }
  function queueProgress() {
    if (!progressQueued) {
      progressQueued = true;
      window.requestAnimationFrame(updateProgress);
    }
  }
  if (guideBody) {
    window.addEventListener("scroll", queueProgress, { passive: true });
  }

  railLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var chapter = link.dataset.chapter;
      var section = document.getElementById("guide-" + chapter);
      if (!section) {
        return;
      }
      event.preventDefault();
      section.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
      var heading = document.getElementById("guide-" + chapter + "-heading");
      if (heading) {
        heading.focus({ preventScroll: true });
      }
      setActiveChapter(chapter);
      try {
        window.history.replaceState({ guideStay: state.stay }, "", urlFor(state.stay, "#guide-" + chapter));
      } catch (e) {
        /* ignore */
      }
    });
  });

  /* ---------------------------------------------------------
     Resize / language / history
     --------------------------------------------------------- */
  var resizeQueued = false;
  window.addEventListener("resize", function () {
    if (resizeQueued) {
      return;
    }
    resizeQueued = true;
    window.requestAnimationFrame(function () {
      resizeQueued = false;
      positionIndicator();
      queueProgress();
    });
  });

  document.addEventListener("yusei:langchange", function () {
    withScrollAnchor(function () {
      renderTabs();
      renderBasebar();
      renderChapters(false);
    });
    positionIndicator();
    queueProgress();
  });

  window.addEventListener("popstate", function () {
    var params = new URLSearchParams(window.location.search);
    var id = params.get("stay");
    if (isStay(id) && id !== state.stay) {
      selectStay(id, { history: "none" });
    }
  });

  if (motionQuery && typeof motionQuery.addEventListener === "function") {
    motionQuery.addEventListener("change", function (event) {
      if (event.matches) {
        document.querySelectorAll(".guide-anim-pending, .guide-anim-in").forEach(function (node) {
          node.classList.remove("guide-anim-pending", "guide-anim-in");
        });
        if (revealObserver) {
          revealObserver.disconnect();
        }
      }
    });
  }

  /* Keyboard users tabbing into a still-pending block: show it. */
  panel.addEventListener("focusin", function (event) {
    var pending = event.target.closest && event.target.closest(".guide-anim-pending");
    if (pending) {
      pending.classList.remove("guide-anim-pending");
      if (revealObserver) {
        revealObserver.unobserve(pending);
      }
    }
  });

  /* ---------------------------------------------------------
     Init
     --------------------------------------------------------- */
  function initialStay() {
    var params = new URLSearchParams(window.location.search);
    var query = params.get("stay");
    var hash = window.location.hash.replace("#", "");
    if (isStay(query)) {
      return { id: query, legacy: false };
    }
    if (!query && Object.prototype.hasOwnProperty.call(Guide.legacyHashes, hash)) {
      var mapped = Guide.legacyHashes[hash];
      if (isStay(mapped)) {
        return { id: mapped, legacy: true };
      }
    }
    var stored = safeGetStorage();
    if (isStay(stored)) {
      return { id: stored, legacy: hash === "areas" };
    }
    return { id: Guide.order[0], legacy: hash === "areas" };
  }

  renderTabs();
  var start = initialStay();
  var startChapter = chapterHash();
  selectStay(start.id, { history: "none", force: true });
  try {
    window.history.replaceState({ guideStay: state.stay }, "", urlFor(state.stay, startChapter));
  } catch (e) {
    /* ignore */
  }

  window.requestAnimationFrame(function () {
    positionIndicator();
    var target = null;
    if (start.legacy) {
      target = document.getElementById("base");
    } else if (startChapter) {
      target = document.getElementById(startChapter.slice(1));
      setActiveChapter(startChapter.replace("#guide-", ""));
    }
    if (target) {
      target.scrollIntoView({ behavior: "auto", block: "start" });
      setupMotion(false);
    }
    updateProgress();
  });
})();
