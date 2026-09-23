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
     Inline SVG icon registry (currentColor stroke line icons,
     built with DOM APIs only — no innerHTML, no external assets).
     Shared by the Amenities key-icon grid and the Access
     transport list.
     --------------------------------------------------------- */
  var SVG_NS = "http://www.w3.org/2000/svg";

  function svgNode(tag, attrs) {
    var el = document.createElementNS(SVG_NS, tag);
    for (var key in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, key)) {
        el.setAttribute(key, attrs[key]);
      }
    }
    return el;
  }

  function buildIcon(spec) {
    var svg = svgNode("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      focusable: "false"
    });
    if (!spec) {
      return svg;
    }
    spec.forEach(function (part) {
      svg.appendChild(svgNode(part[0], part[1]));
    });
    return svg;
  }

  var AMENITY_ICON_SPECS = {
    aircon: [
      ["rect", { x: "2.5", y: "5", width: "19", height: "6", rx: "1.5" }],
      ["path", { d: "M6 15l-1 3" }],
      ["path", { d: "M11 15l-0.5 4" }],
      ["path", { d: "M16 15l1 3" }]
    ],
    tv: [
      ["rect", { x: "3", y: "4", width: "18", height: "12", rx: "1.2" }],
      ["line", { x1: "8", y1: "20", x2: "16", y2: "20" }],
      ["line", { x1: "12", y1: "16", x2: "12", y2: "20" }]
    ],
    washer: [
      ["rect", { x: "4", y: "3", width: "16", height: "18", rx: "2" }],
      ["line", { x1: "6.5", y1: "6", x2: "9", y2: "6" }],
      ["circle", { cx: "12", cy: "13", r: "5" }],
      ["circle", { cx: "12", cy: "13", r: "1.6" }]
    ],
    microwave: [
      ["rect", { x: "3", y: "5", width: "18", height: "14", rx: "1.2" }],
      ["rect", { x: "5", y: "7.5", width: "11", height: "9", rx: "0.6" }],
      ["circle", { cx: "19", cy: "10", r: "1", fill: "currentColor" }],
      ["line", { x1: "17.5", y1: "14", x2: "20.5", y2: "14" }]
    ],
    refrigerator: [
      ["rect", { x: "6", y: "2", width: "12", height: "20", rx: "1.5" }],
      ["line", { x1: "6", y1: "9", x2: "18", y2: "9" }],
      ["line", { x1: "9", y1: "4.5", x2: "9", y2: "7" }],
      ["line", { x1: "9", y1: "11.5", x2: "9", y2: "15" }]
    ],
    cookware: [
      ["rect", { x: "5", y: "11", width: "14", height: "7", rx: "3" }],
      ["line", { x1: "3", y1: "11", x2: "5.5", y2: "11" }],
      ["line", { x1: "18.5", y1: "11", x2: "21", y2: "11" }],
      ["path", { d: "M5.5 11a6.5 3 0 0 1 13 0" }],
      ["line", { x1: "12", y1: "6", x2: "12", y2: "8" }],
      ["circle", { cx: "12", cy: "5", r: "1" }]
    ],
    wifi: [
      ["path", { d: "M2 8.5c5.5-5 14.5-5 20 0" }],
      ["path", { d: "M5.5 12c3.5-3 9.5-3 13 0" }],
      ["path", { d: "M9 15.5c1.7-1.5 4.3-1.5 6 0" }],
      ["circle", { cx: "12", cy: "19", r: "1", fill: "currentColor" }]
    ],
    bath: [
      ["path", { d: "M6 8a6 6 0 0 1 12 0" }],
      ["line", { x1: "6", y1: "8", x2: "18", y2: "8" }],
      ["line", { x1: "8.5", y1: "11.5", x2: "7.5", y2: "14" }],
      ["line", { x1: "12", y1: "11.5", x2: "11", y2: "15" }],
      ["line", { x1: "15.5", y1: "11.5", x2: "14.5", y2: "14" }]
    ],
    parking: [
      ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "3" }],
      ["line", { x1: "9", y1: "8", x2: "9", y2: "16" }],
      ["path", { d: "M9 8h3a2.5 2.5 0 0 1 0 5H9" }]
    ],
    bedding: [
      ["rect", { x: "5", y: "10", width: "5", height: "4", rx: "1" }],
      ["path", { d: "M3 19v-6h18v6" }],
      ["line", { x1: "4", y1: "19", x2: "4", y2: "21" }],
      ["line", { x1: "20", y1: "19", x2: "20", y2: "21" }]
    ],
    hairdryer: [
      ["path", { d: "M3 9a5 5 0 0 1 5-5h4a5 5 0 0 1 0 10h-1" }],
      ["path", { d: "M11 14v3.5a1.5 1.5 0 0 1-1.5 1.5h-1A1.5 1.5 0 0 1 7 17.5V13" }],
      ["line", { x1: "18.5", y1: "7.5", x2: "21.5", y2: "6.5" }],
      ["line", { x1: "18.5", y1: "10", x2: "21.5", y2: "10" }],
      ["line", { x1: "18.5", y1: "12.5", x2: "21.5", y2: "13.5" }]
    ]
  };

  /* Ordered so the same canonical category always wins first when several
     amenity lines could match, and so the 8–10 icon cap keeps the most
     universally useful categories. Matched against the *localized* amenity
     text itself (ja/en/zh-Hans/zh-Hant/ko), never a hardcoded label. */
  var AMENITY_MATCHERS = [
    { key: "aircon", re: /エアコン|空調|空调|air conditioning|에어컨/i },
    { key: "tv", re: /テレビ|電視|电视|\bTV\b|튜너/i },
    { key: "washer", re: /洗濯機|洗衣机|洗衣機|washing machine|세탁기/i },
    { key: "microwave", re: /電子レンジ|微波炉|微波爐|microwave|전자레인지/i },
    { key: "refrigerator", re: /冷蔵庫|冰箱|refrigerator|냉장고/i },
    { key: "cookware", re: /調理器具|食器|厨具|廚具|餐具|cookware|tableware|조리도구|식기/i },
    { key: "wifi", re: /wi-?fi/i },
    { key: "bath", re: /浴室|シャワー|バスタブ|浴缸|淋浴|\bbath\b|shower|욕실|샤워|욕조/i },
    { key: "parking", re: /ガレージ|駐車場|车库|車庫|停车场|停車場|garage|parking|차고|주차장/i },
    { key: "bedding", re: /寝具|床上用品|bedding|침구/i },
    { key: "hairdryer", re: /ドライヤー|吹风机|吹風機|hair dryer|헤어드라이어/i }
  ];

  var AMENITY_HIGHLIGHT_CAP = 10;

  function collectKeyAmenities(l) {
    if (!data.amenities) {
      return [];
    }
    var found = {};
    ["basic", "kitchen", "bathroom", "other"].forEach(function (groupKey) {
      var group = data.amenities[groupKey];
      if (!group) {
        return;
      }
      pickList(group, l).forEach(function (item) {
        AMENITY_MATCHERS.forEach(function (matcher) {
          if (!found[matcher.key] && matcher.re.test(item)) {
            found[matcher.key] = item;
          }
        });
      });
    });
    var result = [];
    AMENITY_MATCHERS.forEach(function (matcher) {
      if (found[matcher.key]) {
        result.push({ key: matcher.key, label: found[matcher.key] });
      }
    });
    return result.slice(0, AMENITY_HIGHLIGHT_CAP);
  }

  var TRANSPORT_ICON_SPECS = {
    train: [
      ["rect", { x: "5", y: "4", width: "14", height: "12", rx: "3" }],
      ["rect", { x: "7", y: "6.5", width: "4", height: "3.2" }],
      ["rect", { x: "13", y: "6.5", width: "4", height: "3.2" }],
      ["line", { x1: "5", y1: "16", x2: "19", y2: "16" }],
      ["circle", { cx: "8", cy: "19", r: "1.4" }],
      ["circle", { cx: "16", cy: "19", r: "1.4" }]
    ],
    bus: [
      ["rect", { x: "3", y: "6", width: "18", height: "10", rx: "2" }],
      ["line", { x1: "3", y1: "12", x2: "21", y2: "12" }],
      ["rect", { x: "5.5", y: "8", width: "3", height: "3" }],
      ["rect", { x: "10.5", y: "8", width: "3", height: "3" }],
      ["rect", { x: "15.5", y: "8", width: "3", height: "3" }],
      ["circle", { cx: "7", cy: "18", r: "1.4" }],
      ["circle", { cx: "17", cy: "18", r: "1.4" }]
    ],
    car: [
      ["path", { d: "M6 11l1.6-3.6A2 2 0 0 1 9.4 6.2h5.2a2 2 0 0 1 1.8 1.2L18 11" }],
      ["rect", { x: "3", y: "11", width: "18", height: "5", rx: "2" }],
      ["circle", { cx: "7.5", cy: "17", r: "1.4" }],
      ["circle", { cx: "16.5", cy: "17", r: "1.4" }]
    ],
    walk: [
      ["circle", { cx: "12", cy: "4.2", r: "1.6", fill: "currentColor", stroke: "none" }],
      ["path", { d: "M12 7v4" }],
      ["path", { d: "M12 8.5l3.5-1.5" }],
      ["path", { d: "M12 11l-3 6" }],
      ["path", { d: "M12 11l3.5 5" }]
    ],
    route: [
      ["path", { d: "M12 21s7-6.7 7-11.3A7 7 0 0 0 5 9.7C5 14.3 12 21 12 21z" }],
      ["circle", { cx: "12", cy: "9.6", r: "2.2" }]
    ]
  };

  /* Bus is matched before train: zh-Hans/zh-Hant render both "train station"
     and "bus stop" with a trailing 站 character (巴士站 = bus stop), so the
     train pattern's bare 站 would otherwise win on every bus-stop segment in
     those two languages. Checking the more specific バス/巴士/公車/버스/bus
     keywords first keeps bus segments correctly iconified. */
  var TRANSPORT_MATCHERS = [
    { key: "bus", re: /バス|巴士|公車|公车|버스|\bbus\b/i },
    { key: "train", re: /駅|station|sta\.|站|역/i },
    { key: "car", re: /車で|by car|車|车|차로|자동차/i },
    { key: "walk", re: /徒歩|步行|도보|\bwalk\b/i }
  ];

  function detectTransportKey(segment) {
    for (var i = 0; i < TRANSPORT_MATCHERS.length; i++) {
      if (TRANSPORT_MATCHERS[i].re.test(segment)) {
        return TRANSPORT_MATCHERS[i].key;
      }
    }
    return "route";
  }

  /* A handful of real-world proper nouns contain the same middle-dot used
     as a clause separator in stationText (e.g. the Rinku Premium Outlet's
     Japanese name). Guarded here so splitting never breaks a name in two —
     this only protects known names, it never rewrites or invents text. */
  var STATION_TEXT_NAME_GUARDS = ["りんくうプレミアム・アウトレット"];

  function splitStationSegments(str) {
    var guarded = str;
    var guardMarker = " ";
    STATION_TEXT_NAME_GUARDS.forEach(function (name, index) {
      guarded = guarded.split(name).join(guardMarker + index + guardMarker);
    });

    var segments = [];
    var current = "";
    var depth = 0;
    for (var i = 0; i < guarded.length; i++) {
      var ch = guarded.charAt(i);
      if (ch === "（" || ch === "(") {
        depth++;
        current += ch;
      } else if (ch === "）" || ch === ")") {
        depth = Math.max(0, depth - 1);
        current += ch;
      } else if (depth === 0 && (ch === "・" || ch === "·")) {
        segments.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    if (current.trim()) {
      segments.push(current.trim());
    }

    return segments
      .map(function (segment) {
        return segment.replace(new RegExp(guardMarker + "(\\d+)" + guardMarker, "g"), function (match, index) {
          return STATION_TEXT_NAME_GUARDS[Number(index)];
        });
      })
      .filter(Boolean);
  }

  function buildMapPreview() {
    var svg = svgNode("svg", {
      viewBox: "0 0 240 150",
      class: "stay-access__map-svg",
      "aria-hidden": "true",
      focusable: "false"
    });
    svg.appendChild(svgNode("rect", { x: "0", y: "0", width: "240", height: "150", class: "stay-access__map-bg" }));

    [30, 70, 110, 150, 190, 230].forEach(function (x) {
      svg.appendChild(svgNode("line", { x1: x, y1: "0", x2: x, y2: "150", class: "stay-access__map-grid" }));
    });
    [25, 60, 95, 130].forEach(function (y) {
      svg.appendChild(svgNode("line", { x1: "0", y1: y, x2: "240", y2: y, class: "stay-access__map-grid" }));
    });

    svg.appendChild(svgNode("path", { d: "M0 40 C60 20, 120 90, 240 60", class: "stay-access__map-route" }));
    svg.appendChild(
      svgNode("path", {
        d: "M150 55c0 16-16 30-16 30s-16-14-16-30a16 16 0 1 1 32 0z",
        class: "stay-access__map-pin"
      })
    );
    svg.appendChild(svgNode("circle", { cx: "134", cy: "55", r: "5", class: "stay-access__map-pin-dot" }));

    return svg;
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
      var highlights = collectKeyAmenities(l);
      if (highlights.length) {
        var highlightsWrap = document.createElement("div");
        highlightsWrap.className = "stay-amenities-highlights";
        var highlightsHeading = document.createElement("h3");
        highlightsHeading.className = "stay-amenities-highlights__heading";
        highlightsHeading.textContent = i18n.t("stayDetail.amenities.highlightsHeading");
        var highlightsList = document.createElement("ul");
        highlightsList.className = "stay-amenities-highlights__list";
        highlights.forEach(function (highlight) {
          var item = document.createElement("li");
          item.className = "stay-amenities-highlights__item";
          var iconWrap = document.createElement("span");
          iconWrap.className = "stay-amenities-highlights__icon";
          iconWrap.appendChild(buildIcon(AMENITY_ICON_SPECS[highlight.key]));
          var label = document.createElement("span");
          label.className = "stay-amenities-highlights__label";
          label.textContent = highlight.label;
          item.append(iconWrap, label);
          highlightsList.appendChild(item);
        });
        highlightsWrap.append(highlightsHeading, highlightsList);
        container.appendChild(highlightsWrap);
      }

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

    var layout = document.createElement("div");
    layout.className = "stay-access__layout";

    /* ---- Property / location column ---- */
    var propertyCol = document.createElement("div");
    propertyCol.className = "stay-access__col stay-access__col--property";
    var propertyKicker = document.createElement("p");
    propertyKicker.className = "stay-access__kicker";
    propertyKicker.textContent = i18n.t("stayDetail.access.address");
    var propertyName = document.createElement("h3");
    propertyName.className = "stay-access__property-name";
    propertyName.textContent = data.nameJa;
    var propertyNameEn = document.createElement("span");
    propertyNameEn.className = "stay-access__property-name-en";
    propertyNameEn.textContent = data.nameEn;
    propertyName.appendChild(propertyNameEn);
    var propertyAddress = document.createElement("p");
    if (data.verified.address && data.address) {
      propertyAddress.className = "stay-access__property-address";
      propertyAddress.textContent = pick(data.address, l);
    } else {
      propertyAddress.className = "stay-access__property-address stay-access__property-address--note";
      propertyAddress.textContent = i18n.t("stayDetail.verification.address");
    }
    propertyCol.append(propertyKicker, propertyName, propertyAddress);

    /* ---- Transport column ---- */
    var transportCol = document.createElement("div");
    transportCol.className = "stay-access__col stay-access__col--transport";
    var transportKicker = document.createElement("p");
    transportKicker.className = "stay-access__kicker";
    transportKicker.textContent = i18n.t("stayDetail.access.station");
    var transportList = document.createElement("ul");
    transportList.className = "stay-access__transport-list";
    splitStationSegments(pick(data.stationText, l)).forEach(function (segment) {
      var item = document.createElement("li");
      item.className = "stay-access__transport-item";
      var iconWrap = document.createElement("span");
      iconWrap.className = "stay-access__transport-icon";
      iconWrap.appendChild(buildIcon(TRANSPORT_ICON_SPECS[detectTransportKey(segment)]));
      var text = document.createElement("span");
      text.className = "stay-access__transport-text";
      text.textContent = segment;
      item.append(iconWrap, text);
      transportList.appendChild(item);
    });
    transportCol.append(transportKicker, transportList);

    /* ---- Map column (stylized preview — never live Google tiles) ---- */
    var mapCol = document.createElement("div");
    mapCol.className = "stay-access__col stay-access__col--map";
    var mapKicker = document.createElement("p");
    mapKicker.className = "stay-access__kicker";
    mapKicker.textContent = i18n.t("stayDetail.access.map");

    var mapHref = data.mapUrl;
    if (!mapHref && data.verified.address && data.address) {
      mapHref = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(pick(data.address, "ja"));
    }

    if (mapHref) {
      var name = data.nameJa + " " + data.nameEn;
      var mapCard = document.createElement("a");
      mapCard.className = "stay-access__map-card";
      mapCard.href = mapHref;
      mapCard.target = "_blank";
      mapCard.rel = "noopener noreferrer";
      mapCard.setAttribute("aria-label", i18n.t("stayDetail.access.mapAriaLabel", { name: name }));
      mapCard.appendChild(buildMapPreview());
      var mapLabel = document.createElement("span");
      mapLabel.className = "stay-access__map-label";
      mapLabel.textContent = name;
      var mapCta = document.createElement("span");
      mapCta.className = "stay-access__map-cta";
      mapCta.textContent = i18n.t("stayDetail.access.openInMaps");
      mapCard.append(mapLabel, mapCta);
      mapCol.append(mapKicker, mapCard);
    } else {
      var mapNote = document.createElement("p");
      mapNote.className = "stay-access__map-note";
      mapNote.textContent = i18n.t("stayDetail.verification.map");
      mapCol.append(mapKicker, mapNote);
    }

    layout.append(propertyCol, transportCol, mapCol);
    container.appendChild(layout);
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
