/* ============================================================
   Yusei Stay — Osaka Guide chapter images (tour-guide.html)

   Static copy of assets/guide/manifest.json plus the per-stay
   chapter mapping, kept as a plain script so the guide still works
   when opened from file:// (no fetch). Keep the credit fields
   (title / author / source / license / licenseUrl) identical to
   the manifest and docs/guide-image-credits.md.

   kind "photo"      real photo from Wikimedia Commons. Shown with a
                     visible credit line and listed in the page-end
                     photo credits. It illustrates the destination,
                     not a station or stop, and may be years old.
   kind "generated"  AI-generated mood illustration. Always shown with
                     a visible "AI-generated illustration" badge; never
                     captioned as a real street, shop or neighbourhood.

   desc      what the picture shows (used as alt text and caption)
   note      optional caption clarification (e.g. "not the station")
   overlay   decorative romanised label over real photos, like the
             stay-name overlays (aria-hidden)
   position  CSS object-position for the cover crop
   portrait  true = use the tall 4:5 frame so the subject (e.g. the
             pagoda finial) is not cropped
   ============================================================ */

(function () {
  "use strict";

  function L(ja, en, hans, hant, ko) {
    return { ja: ja, en: en, "zh-Hans": hans, "zh-Hant": hant, ko: ko };
  }

  var assets = {

    /* ---- AI-generated mood illustrations ---- */
    "residential-lane-generated": {
      kind: "generated",
      src: "assets/guide/mood/residential-lane-generated.jpg",
      width: 1168,
      height: 784,
      desc: L("静かな住宅街の路地の雰囲気", "The feel of a quiet residential lane", "安静住宅区小巷的氛围", "安靜住宅區小巷的氛圍", "조용한 주택가 골목의 분위기"),
      note: L("特定の場所ではありません", "Not a specific street", "并非特定地点", "並非特定地點", "특정 장소가 아닙니다")
    },
    "old-town-walk-generated": {
      kind: "generated",
      src: "assets/guide/mood/old-town-walk-generated.jpg",
      width: 1728,
      height: 1152,
      desc: L("古い町並みを歩く雰囲気", "The feel of a walk through an old town", "漫步老街的氛围", "漫步老街的氛圍", "옛 마을을 걷는 분위기"),
      note: L("特定の場所やお店ではありません", "Not a specific place or shop", "并非特定地点或店铺", "並非特定地點或店鋪", "특정 장소나 가게가 아닙니다")
    },
    "neighborhood-grocery-generated": {
      kind: "generated",
      src: "assets/guide/mood/neighborhood-grocery-generated.jpg",
      width: 1728,
      height: 1152,
      desc: L("まちのスーパーの雰囲気", "The feel of a neighbourhood supermarket", "街坊超市的氛围", "街坊超市的氛圍", "동네 슈퍼마켓의 분위기"),
      note: L("特定のお店ではありません", "Not a specific shop", "并非特定店铺", "並非特定店鋪", "특정 가게가 아닙니다")
    },
    "corner-produce-shop-generated": {
      kind: "generated",
      src: "assets/guide/mood/corner-produce-shop-generated.jpg",
      width: 1168,
      height: 784,
      desc: L("街角の八百屋の雰囲気", "The feel of a corner produce shop", "街角蔬果店的氛围", "街角蔬果店的氛圍", "길모퉁이 채소 가게의 분위기"),
      note: L("特定のお店ではありません", "Not a specific shop", "并非特定店铺", "並非特定店鋪", "특정 가게가 아닙니다")
    },
    "greengrocer-cyclist-generated": {
      kind: "generated",
      src: "assets/guide/mood/greengrocer-cyclist-generated.jpg",
      width: 1168,
      height: 784,
      desc: L("自転車が行き交う八百屋の店先の雰囲気", "The feel of a greengrocer's shopfront with passing bicycles", "单车往来的蔬果店门前氛围", "單車往來的蔬果店門前氛圍", "자전거가 오가는 채소 가게 앞의 분위기"),
      note: L("特定のお店ではありません", "Not a specific shop", "并非特定店铺", "並非特定店鋪", "특정 가게가 아닙니다")
    },

    /* ---- Real photos (Wikimedia Commons) ---- */
    mizumadera: {
      kind: "photo",
      src: "assets/guide/destinations/mizumadera-photo.jpg",
      width: 1536,
      height: 2048,
      portrait: true,
      position: "50% 18%",
      overlay: "Mizuma-dera",
      desc: L("水間寺の三重塔", "The three-storey pagoda at Mizuma-dera", "水间寺的三重塔", "水間寺的三重塔", "미즈마데라의 삼층탑"),
      credit: {
        title: "File:Mizumadera Sanzyunotou.jpg",
        author: "Nozomikobe",
        source: "https://commons.wikimedia.org/wiki/File:Mizumadera_Sanzyunotou.jpg",
        license: "CC0",
        licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
      }
    },
    "misaki-tenmangu": {
      kind: "photo",
      src: "assets/guide/destinations/misaki-tenmangu-photo.jpg",
      width: 1600,
      height: 1200,
      position: "50% 55%",
      overlay: "Misaki Tenmangu",
      desc: L("三先天満宮の社殿", "The shrine hall of Misaki Tenmangu", "三先天满宫的社殿", "三先天滿宮的社殿", "미사키 텐만구의 사전"),
      credit: {
        title: "File:Misaki-tenman-gu.jpg",
        author: "KENPEI",
        source: "https://commons.wikimedia.org/wiki/File:Misaki-tenman-gu.jpg",
        license: "CC BY-SA 3.0",
        licenseUrl: "http://creativecommons.org/licenses/by-sa/3.0/"
      }
    },
    kaiyukan: {
      kind: "photo",
      src: "assets/guide/destinations/kaiyukan-photo.jpg",
      width: 1280,
      height: 960,
      position: "50% 40%",
      overlay: "Kaiyukan",
      desc: L("海遊館の外観", "The exterior of Osaka Aquarium Kaiyukan", "海游馆的外观", "海遊館的外觀", "가이유칸 수족관의 외관"),
      credit: {
        title: "File:Acuario de Osaka - Edificio.jpg",
        author: "SpiceMan",
        source: "https://commons.wikimedia.org/wiki/File:Acuario_de_Osaka_-_Edificio.jpg",
        license: "CC BY 2.5",
        licenseUrl: "https://creativecommons.org/licenses/by/2.5"
      }
    },
    dotonbori: {
      kind: "photo",
      src: "assets/guide/destinations/dotonbori-photo.jpg",
      width: 1280,
      height: 720,
      position: "50% 50%",
      overlay: "Dōtonbori",
      desc: L("夜の道頓堀川", "The Dōtonbori Canal at night", "夜晚的道顿堀川", "夜晚的道頓堀川", "밤의 도톤보리강"),
      credit: {
        title: "File:Dotonbori Canal 1.jpg",
        author: "Ray in Manila",
        source: "https://commons.wikimedia.org/wiki/File:Dotonbori_Canal_1.jpg",
        license: "CC BY 2.0",
        licenseUrl: "https://creativecommons.org/licenses/by/2.0"
      }
    },
    rinku: {
      kind: "photo",
      src: "assets/guide/destinations/rinku-photo.jpg",
      width: 1600,
      height: 1067,
      position: "50% 50%",
      overlay: "Rinku",
      desc: L("りんくうプレミアム・アウトレット", "Rinku Premium Outlets", "临空Premium Outlets", "臨空Premium Outlets", "린쿠 프리미엄 아울렛"),
      credit: {
        title: "File:Rinku premium outlets02s3200.jpg",
        author: "663highland",
        source: "https://commons.wikimedia.org/wiki/File:Rinku_premium_outlets02s3200.jpg",
        license: "CC BY 2.5",
        licenseUrl: "https://creativecommons.org/licenses/by/2.5"
      }
    },
    nara: {
      kind: "photo",
      src: "assets/guide/destinations/nara-photo.jpg",
      width: 960,
      height: 720,
      position: "50% 50%",
      desc: L("奈良公園の鹿", "Deer in Nara Park", "奈良公园的鹿", "奈良公園的鹿", "나라 공원의 사슴"),
      note: L("近鉄奈良駅の写真ではありません", "Not Kintetsu-Nara Station", "并非近铁奈良站", "並非近鐵奈良站", "긴테쓰나라역 사진이 아닙니다"),
      credit: {
        title: "File:Deer in Nara Park.jpg",
        author: "Christophe95",
        source: "https://commons.wikimedia.org/wiki/File:Deer_in_Nara_Park.jpg",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
      }
    },
    kyoto: {
      kind: "photo",
      src: "assets/guide/destinations/kyoto-photo.jpg",
      width: 1280,
      height: 960,
      position: "50% 72%",
      overlay: "Kyoto<br>Kamo River",
      desc: L("三条大橋から望む鴨川", "The Kamo River from Sanjō Ōhashi Bridge", "从三条大桥眺望鸭川", "從三條大橋眺望鴨川", "산조오하시 다리에서 바라본 가모강"),
      note: L("京都駅の写真ではありません", "Not Kyoto Station", "并非京都站", "並非京都站", "교토역 사진이 아닙니다"),
      credit: {
        title: "File:Kamogawa River from Sanjo-Ohashi Bridge (North).JPG",
        author: "そらみみ",
        source: "https://commons.wikimedia.org/wiki/File:Kamogawa_River_from_Sanjo-Ohashi_Bridge_(North).JPG",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0"
      }
    },
    kobe: {
      kind: "photo",
      src: "assets/guide/destinations/kobe-photo.jpg",
      width: 960,
      height: 837,
      position: "50% 50%",
      desc: L("神戸港のポートタワーと海洋博物館", "Kobe harbour: Port Tower and Maritime Museum", "神户港的神户塔与海洋博物馆", "神戶港的神戶塔與海洋博物館", "고베항의 포트 타워와 해양박물관"),
      note: L("三ノ宮駅の写真ではありません", "Not Sannomiya Station", "并非三之宫站", "並非三之宮站", "산노미야역 사진이 아닙니다"),
      credit: {
        title: "File:Kobe Port Tower and Maritime Museum, November 2016.jpg",
        author: "Martin Falbisoner",
        source: "https://commons.wikimedia.org/wiki/File:Kobe_Port_Tower_and_Maritime_Museum,_November_2016.jpg",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
      }
    },
    arima: {
      kind: "photo",
      src: "assets/guide/destinations/arima-photo.jpg",
      width: 960,
      height: 720,
      position: "50% 50%",
      desc: L("有馬温泉「金の湯」", "Kin-no-yu, Arima Onsen", "有马温泉「金之汤」", "有馬溫泉「金之湯」", "아리마 온천 '긴노유'"),
      credit: {
        title: "File:Kin-no-yu Arima Onsen 2013.jpg",
        author: "Wpcpey",
        source: "https://commons.wikimedia.org/wiki/File:Kin-no-yu_Arima_Onsen_2013.jpg",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
      }
    },
    awaji: {
      kind: "photo",
      src: "assets/guide/destinations/awaji-photo.jpg",
      width: 960,
      height: 720,
      position: "50% 50%",
      desc: L("淡路島・慶野松原の松林", "The pine forest of Keino-matsubara, Awaji Island", "淡路岛庆野松原的松林", "淡路島慶野松原的松林", "아와지시마 게이노마쓰바라의 소나무 숲"),
      credit: {
        title: "File:Keino matsubara 01.jpg",
        author: "Pinqui",
        source: "https://commons.wikimedia.org/wiki/File:Keino_matsubara_01.jpg",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0"
      }
    },
    wakayama: {
      kind: "photo",
      src: "assets/guide/destinations/wakayama-photo.jpg",
      width: 960,
      height: 639,
      position: "50% 45%",
      overlay: "Wakayama<br>Nishinomaru Garden",
      desc: L("和歌山城 西之丸庭園", "Nishinomaru Garden, Wakayama Castle grounds", "和歌山城西之丸庭园", "和歌山城西之丸庭園", "와카야마성 니시노마루 정원"),
      note: L("庭園の写真で、天守などの城の外観や和歌山駅ではありません", "The garden — not the castle keep or Wakayama Station", "为庭园照片，并非天守等城堡外观或和歌山站", "為庭園照片，並非天守等城堡外觀或和歌山站", "정원 사진이며, 천수각 등 성의 외관이나 와카야마역이 아닙니다"),
      credit: {
        title: "File:Wakayama Castle Nishinomaru Garden04bs3200.jpg",
        author: "663highland",
        source: "https://commons.wikimedia.org/wiki/File:Wakayama_Castle_Nishinomaru_Garden04bs3200.jpg",
        license: "CC BY 2.5",
        licenseUrl: "https://creativecommons.org/licenses/by/2.5"
      }
    }
  };

  /* Chapter images per stay. Chapter 01 (この宿から) always keeps the
     stay's own photo from js/guide-data.js. furtherInset is an
     existing site image (no manifest entry), kept only for the bay
     stays where USJ is one of the listed destinations. */
  var usjInset = { src: "assets/osaka/USJ.jpeg", altKey: "guidePage.area.bay.imageAlt" };

  var chapters = {
    tea:        { near: "residential-lane-generated", further: "dotonbori", day: "kyoto", daily: "greengrocer-cyclist-generated" },
    zen:        { near: "residential-lane-generated", further: "dotonbori", day: "kyoto", daily: "greengrocer-cyclist-generated" },
    pine:       { near: "residential-lane-generated", further: "kaiyukan", furtherInset: usjInset, day: "kyoto", daily: "neighborhood-grocery-generated" },
    literature: { near: "residential-lane-generated", further: "kaiyukan", furtherInset: usjInset, day: "kyoto", daily: "neighborhood-grocery-generated" },
    harmony:    { near: "residential-lane-generated", further: "kaiyukan", furtherInset: usjInset, day: "kyoto", daily: "neighborhood-grocery-generated" },
    art:        { near: "misaki-tenmangu", further: "kaiyukan", furtherInset: usjInset, day: "kyoto", daily: "corner-produce-shop-generated" },
    furukawa:   { near: "mizumadera", further: "rinku", day: "wakayama", daily: "old-town-walk-generated" }
  };

  /* Day-trip thumbnails, keyed by the place id used in
     js/guide-data.js (dayTrips + Furukawa's dayOverride). */
  var trips = {
    nara: "nara",
    kyoto: "kyoto",
    kobe: "kobe",
    arima: "arima",
    awaji: "awaji",
    wakayama: "wakayama"
  };

  /* Page-end credit order. */
  var creditOrder = ["mizumadera", "misaki-tenmangu", "dotonbori", "kaiyukan", "rinku", "kyoto", "wakayama", "nara", "kobe", "arima", "awaji"];

  window.YuseiGuideImages = {
    assets: assets,
    chapters: chapters,
    trips: trips,
    creditOrder: creditOrder
  };
})();
