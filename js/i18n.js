/* ============================================================
   Yusei Stay — Shared i18n module
   Loaded before all other page scripts on index.html and stays.html.

   - Explicit, hand-written dictionary (ja / en / zh-Hans / zh-Hant / ko).
     No automatic/generic text-replacement engine and no external
     translation service.
   - Default language: ja. Persisted to localStorage (best-effort,
     wrapped in try/catch for blocked storage). Optional ?lang=
     query param override.
   - DOM hookup:
       data-i18n="key"              -> element.textContent = t(key)
       data-i18n-attr="attr:key"    -> element.setAttribute(attr, t(key))
                                        (pipe-separate for multiple: "alt:key1|title:key2")
     Both only ever touch textContent/attributes on the element they
     are placed on — never a parent with other element children — so
     existing markup (icons, inputs, <br>, nested spans) is preserved.
   - Page scripts that render dynamic content (main.js, stays.js) call
     YuseiI18n.t()/YuseiI18n.station() directly and listen for the
     "yusei:langchange" document event to re-render in place without
     resetting any user-entered state.

   See README.md "Translations" section for how to add or edit copy.
   ============================================================ */

(function () {
  "use strict";

  var STORAGE_KEY = "yusei-lang";
  var SUPPORTED = ["ja", "en", "zh-Hans", "zh-Hant", "ko"];
  var DEFAULT_LANG = "ja";

  var dict = {
    ja: {
      "meta.title": "YUSEI STAY | 大阪の一棟貸し民宿",
      "meta.description": "YUSEI STAYは、大阪のまちに佇む一棟貸しの民宿です。旅先で、暮らすように過ごす特別な滞在をお届けします。",
      "staysPage.metaTitle": "宿を探す | YUSEI STAY",
      "staysPage.metaDescription": "大阪の一棟貸しの宿を、人数や設備の条件から探す。YUSEI STAYで暮らすように泊まる旅を。",

      "nav.home": "ホーム",
      "nav.findStays": "宿を探す",
      "nav.about": "私たちについて",
      "nav.faq": "よくあるご質問",
      "nav.contact": "お問い合わせ",
      "nav.ariaLabel": "メインナビゲーション",
      "footer.navAriaLabel": "フッターナビゲーション",
      "nav.language.label": "言語を選択",
      "nav.language.generic": "言語",

      "brand.ariaLabel": "YUSEI STAY ホームへ戻る",
      "brand.tagline": "暮らすように、泊まる。",

      "cta.findStays": "宿を探す →",
      "cta.viewAllStays": "すべての宿を見る →",
      "cta.viewDetails": "詳細を見る →",
      "cta.accessDetails": "詳しいアクセスは各宿のページへ →",
      "cta.viewStays": "宿を見る",

      "hamburger.open": "メニューを開く",
      "hamburger.close": "メニューを閉じる",

      "hero.subheading": "旅先で、暮らすように泊まる。",
      "hero.description.line1": "大阪市内から貝塚まで、",
      "hero.description.line2": "一棟貸しの宿で過ごす日常。",
      "hero.vertical.line1": "畳に座り、",
      "hero.vertical.line2": "ゆるやかな時間が",
      "hero.vertical.line3": "流れるもうひとつの大阪",
      "hero.imageAlt": "YUSEI STAYの民宿の実際の写真",

      "about.heading": "旅先に、もうひとつのわが家を。",
      "about.description": "YUSEI STAYは、大阪で暮らすように滞在できる一棟貸しの民宿です。伝統と現代が調和するまちで、あなただけの特別な時間をお届けします。",
      "about.cta": "私たちについて →",
      "about.imageAlt": "和の園（Harmony Garden）の室内",

      "stays.heading": "それぞれの家に、それぞれの時間。",
      "stayCard.tea.location": "一棟貸し・天下茶屋・花園町",
      "stayCard.art.location": "一棟貸し・朝潮橋",
      "stayCard.furukawa.location": "一棟貸し・貝塚市",
      "stayCard.tea.imageAlt": "茶園 Tea Gardenの客室",
      "stayCard.art.imageAlt": "芸 Art Homeの客室",
      "stayCard.furukawa.imageAlt": "古川の家 Furukawa Houseの客室",

      "features.heading": "選ばれる3つの理由",
      "features.item1.title": "一棟貸しの安心感",
      "features.item1.description": "他のゲストを気にせず、家族や仲間だけで過ごせるプライベートな空間。",
      "features.item2.title": "便利なロケーション",
      "features.item2.description": "主要観光地へのアクセスが良く、大阪を思う存分楽しめます。",
      "features.item3.title": "快適な暮らし",
      "features.item3.description": "旅に必要な設備が整い、長期滞在でも快適に過ごせます。",

      "experience.heading.line1": "暮らすように旅をする、",
      "experience.heading.line2": "大阪のまちで。",
      "experience.description": "美味しい食、あたたかい人々、どこか懐かしくて新しい街並み。YUSEI STAYで、観光だけでは出会えない大阪の日常を体験してみませんか。",
      "experience.cta": "大阪の楽しみ方を見る →",
      "experience.image1Alt": "夜の新世界、通天閣を望む商店街のイメージ写真",
      "experience.image2Alt": "道頓堀の看板が並ぶ夜の商店街のイメージ写真",
      "experience.image3Alt": "桜と大阪城の夜景のイメージ写真",
      "experience.dialogTitle": "大阪の楽しみ方",

      "access.heading": "滞在するエリアを選ぶ",
      "access.description.line1": "大阪市内から貝塚まで、",
      "access.description.line2": "個性の異なるエリアに7つの宿があります。",
      "access.area1": "弁天町・朝潮橋",
      "access.area2": "天下茶屋・花園町",
      "access.area3": "貝塚",

      "bookingCta.heading": "大阪で、暮らすような旅を。",
      "bookingCta.description": "ご予約は各宿の外部予約サイトから。",
      "bookingCta.imageAlt": "茶園の茶器と鉄瓶",

      "footer.note": "空室状況・ご予約方法は、各施設のAirbnbページをご確認ください。",
      "footer.noteStays": "空室状況・ご予約方法は、各施設の詳細をご確認ください。",
      "footer.followUs": "フォローする",

      "dialog.close": "閉じる",
      "dialog.home.faq.body": "このサイト上では予約は確定しません。空室状況、料金、お子さまの宿泊条件については、ご希望の宿のAirbnbページから直接お問い合わせください。",
      "dialog.home.contact.body": "現在、このサイトからの直接のお問い合わせは受け付けておりません。ご質問・ご予約に関するお問い合わせは、ご希望の宿のAirbnbページからお送りください。",
      "dialog.home.stayLink": "宿を探すページへ →",
      "dialog.about.comingSoon": "詳しいご紹介ページは只今準備中です。",
      "dialog.experience.comingSoon": "大阪のまちや貝塚の下町の楽しみ方をご紹介するページは只今準備中です。",
      "dialog.stay.station": "最寄りエリア：{{station}}",
      "dialog.stay.airbnbNote": "詳しい設備・宿泊条件・空室状況は、Airbnbの施設ページでご確認ください。",
      "dialog.stay.airbnbLink": "{{name}}をAirbnbで見る ↗",
      "dialog.stays.faqContactBody": "このサイト上では予約は確定しません。空室、料金、お子さまの宿泊条件については、ご希望の宿のAirbnbページからお問い合わせください。",
      "dialog.inquiry.title": "空室のお問い合わせ",
      "dialog.inquiry.intro": "お問い合わせ内容を作成しました。まだ送信されていません。下の文面をコピーし、ご希望の施設のAirbnbページからお問い合わせください。",
      "dialog.inquiry.textareaAriaLabel": "お問い合わせ文面",

      "card.imageAlt": "{{name}}の室内",
      "card.detailsAriaLabel": "{{name}}の詳細を見る",

      "results.status.initial": "絞り込み前",
      "results.status.candidates": "候補 {{count}}施設",
      "results.status.all": "全{{count}}施設",
      "results.empty": "条件に合う宿が見つかりませんでした。人数やエリアを変更してお試しください。",
      "results.showAll": "すべての宿を見る（全7施設）",
      "results.heading": "宿泊施設一覧",
      "results.lead": "大阪で出会う、さまざまな暮らし。",

      "filters.note": "定員・設備を確認中の施設も候補に含まれます。お子さまを含む宿泊人数と設備の対応状況は、各施設にご確認ください。空室状況での絞り込みではありません。",
      "filters.heading": "宿泊条件",
      "filters.intro.line1": "ご希望の条件を",
      "filters.intro.line2": "お選びください。",
      "filters.area.label": "エリア",
      "filters.area.all": "すべてのエリア",
      "filters.area.bay": "大阪ベイエリア",
      "filters.area.south": "天下茶屋・花園町",
      "filters.area.kaizuka": "貝塚",
      "filters.adults.label": "大人",
      "filters.adults.decrease": "大人を1人減らす",
      "filters.adults.increase": "大人を1人増やす",
      "filters.children.label": "子ども",
      "filters.children.decrease": "子どもを1人減らす",
      "filters.children.increase": "子どもを1人増やす",
      "filters.ageNote": "お子さまの年齢は宿泊条件の確認に使用します。",
      "filters.amenitiesLegend": "希望する設備",
      "filters.amenity.kitchen": "キッチン",
      "filters.amenity.laundry": "洗濯機",
      "filters.amenity.bath": "バスタブ",
      "filters.amenity.parking": "駐車場",
      "filters.submit": "絞り込む",
      "filters.reset": "リセット",

      "ages.label": "子ども{{n}}の年齢",
      "ages.selectPlaceholder": "選択してください",
      "ages.optionYears": "{{age}}歳",
      "ages.unselected": "未選択",

      "dates.heading": "ご宿泊日",
      "dates.optional": "（任意）",
      "dates.helper.line1": "ご希望の日程で空室を",
      "dates.helper.line2": "お問い合わせ",
      "dates.helper.line3": "いただけます。",
      "dates.checkin": "チェックイン",
      "dates.checkout": "チェックアウト",
      "dates.fine": "日付の入力だけでは、空室や予約は確定しません。",
      "dates.submit": "空室を問い合わせる",
      "dates.validity.checkoutAfterCheckin": "チェックアウトはチェックインより後の日付を選択してください。",

      "inquiry.intro": "空室についてお伺いします。",
      "inquiry.line.checkin": "チェックイン：{{value}}",
      "inquiry.line.checkout": "チェックアウト：{{value}}",
      "inquiry.line.adults": "大人：{{count}}名",
      "inquiry.line.children": "子ども：{{count}}名{{ages}}",
      "inquiry.agesWrapper": "（{{list}}）",
      "inquiry.listSeparator": "、",
      "inquiry.question": "この条件で宿泊できますか？",
      "inquiry.copyButton": "文面をコピー",
      "inquiry.copied": "コピーしました",
      "inquiry.copyFallback": "選択した文面をコピーしてください",
      "inquiry.chooseStay": "お問い合わせ先の宿を選択してください。",

      "skip.toMain": "本文へ移動",
      "page.heading": "大阪で、あなたに合う宿を。",
      "page.lead": "人数や設備の条件から、旅にぴったりの一軒を。",
      "page.aside.line1": "大阪で、",
      "page.aside.line2": "暮らすように泊まる。"
    },

    en: {
      "meta.title": "YUSEI STAY | Whole-House Stays in Osaka",
      "meta.description": "YUSEI STAY offers whole-house minshuku rentals across Osaka. Experience a special stay that feels like everyday life, away from home.",
      "staysPage.metaTitle": "Find a Stay | YUSEI STAY",
      "staysPage.metaDescription": "Search Osaka's whole-house stays by group size and amenities. Travel the YUSEI STAY way — living, not just visiting.",

      "nav.home": "Home",
      "nav.findStays": "Stays",
      "nav.about": "About",
      "nav.faq": "FAQ",
      "nav.contact": "Contact",
      "nav.ariaLabel": "Main navigation",
      "footer.navAriaLabel": "Footer navigation",
      "nav.language.label": "Select language",
      "nav.language.generic": "Language",

      "brand.ariaLabel": "YUSEI STAY — back to homepage",
      "brand.tagline": "Stay like you live here.",

      "cta.findStays": "Find a Stay →",
      "cta.viewAllStays": "View All Stays →",
      "cta.viewDetails": "View Details →",
      "cta.accessDetails": "See access details on each stay's page →",
      "cta.viewStays": "View Stays",

      "hamburger.open": "Open menu",
      "hamburger.close": "Close menu",

      "hero.subheading": "Live like a local, even on a trip.",
      "hero.description.line1": "From central Osaka to Kaizuka,",
      "hero.description.line2": "everyday life in a whole house of your own.",
      "hero.vertical.line1": "Sit on tatami,",
      "hero.vertical.line2": "where time flows",
      "hero.vertical.line3": "gently in another Osaka.",
      "hero.imageAlt": "A real photo of a YUSEI STAY property",

      "about.heading": "Another home away from home.",
      "about.description": "YUSEI STAY offers whole-house minshuku stays across Osaka, where you can live as you travel. In a city where tradition and modern life meet, we welcome you to a time that is uniquely yours.",
      "about.cta": "About Us →",
      "about.imageAlt": "Interior of Harmony Garden",

      "stays.heading": "Every house, its own time.",
      "stayCard.tea.location": "Whole-house rental · Tengachaya, Hanazonocho",
      "stayCard.art.location": "Whole-house rental · Asashiobashi",
      "stayCard.furukawa.location": "Whole-house rental · Kaizuka City",
      "stayCard.tea.imageAlt": "Guest room at Tea Garden",
      "stayCard.art.imageAlt": "Guest room at Art Home",
      "stayCard.furukawa.imageAlt": "Guest room at Furukawa House",

      "features.heading": "Three Reasons to Choose Us",
      "features.item1.title": "The comfort of a whole house to yourselves",
      "features.item1.description": "A private space for just your family or friends, with no other guests to share it with.",
      "features.item2.title": "Convenient locations",
      "features.item2.description": "Easy access to major sights, so you can enjoy Osaka to the fullest.",
      "features.item3.title": "Comfortable everyday living",
      "features.item3.description": "Fully equipped for travel, comfortable even for longer stays.",

      "experience.heading.line1": "Travel like you live here,",
      "experience.heading.line2": "in the city of Osaka.",
      "experience.description": "Delicious food, warm people, streets that feel both nostalgic and new. With YUSEI STAY, discover an everyday side of Osaka you will not find through sightseeing alone.",
      "experience.cta": "Ways to Enjoy Osaka →",
      "experience.image1Alt": "Illustrative photo of Shinsekai at night, with Tsutenkaku Tower in view",
      "experience.image2Alt": "Illustrative photo of Dotonbori's neon signs at night",
      "experience.image3Alt": "Illustrative photo of cherry blossoms and Osaka Castle at night",
      "experience.dialogTitle": "Ways to Enjoy Osaka",

      "access.heading": "Choose Your Area to Stay",
      "access.description.line1": "From central Osaka to Kaizuka,",
      "access.description.line2": "7 stays, each in a distinct area.",
      "access.area1": "Bentencho / Asashiobashi",
      "access.area2": "Tengachaya / Hanazonocho",
      "access.area3": "Kaizuka",

      "bookingCta.heading": "In Osaka, a trip that feels like life.",
      "bookingCta.description": "Bookings are made through each stay's external booking site.",
      "bookingCta.imageAlt": "Teaware and an iron kettle at Tea Garden",

      "footer.note": "Please check each property's Airbnb page for availability and booking.",
      "footer.noteStays": "Please check each property's details for availability and booking.",
      "footer.followUs": "Follow Us",

      "dialog.close": "Close",
      "dialog.home.faq.body": "Bookings are not finalized on this site. For availability, pricing, and conditions for children, please contact your chosen stay directly through its Airbnb page.",
      "dialog.home.contact.body": "This site does not currently accept direct inquiries. Please send questions or booking requests through your chosen stay's Airbnb page.",
      "dialog.home.stayLink": "Go to Find a Stay →",
      "dialog.about.comingSoon": "A detailed introduction page is currently in preparation.",
      "dialog.experience.comingSoon": "A page introducing how to enjoy Osaka's streets and the old town of Kaizuka is currently in preparation.",
      "dialog.stay.station": "Nearest area: {{station}}",
      "dialog.stay.airbnbNote": "For detailed amenities, stay conditions, and availability, please check the property's Airbnb page.",
      "dialog.stay.airbnbLink": "View {{name}} on Airbnb ↗",
      "dialog.stays.faqContactBody": "Bookings are not finalized on this site. For availability, pricing, and conditions for children, please contact your chosen stay through its Airbnb page.",
      "dialog.inquiry.title": "Availability Inquiry",
      "dialog.inquiry.intro": "Your inquiry message has been drafted. It has not been sent yet. Copy the text below and send it via your chosen property's Airbnb page.",
      "dialog.inquiry.textareaAriaLabel": "Inquiry message text",

      "card.imageAlt": "Interior of {{name}}",
      "card.detailsAriaLabel": "View details for {{name}}",

      "results.status.initial": "Before filtering",
      "results.status.candidates": "{{count}} candidate stays",
      "results.status.all": "All {{count}} stays",
      "results.empty": "No stays matched your conditions. Try changing the group size or area.",
      "results.showAll": "View All 7 Stays",
      "results.heading": "Our Stays",
      "results.lead": "A variety of everyday lives to discover in Osaka.",

      "filters.note": "Stays with unconfirmed capacity or amenities are still included as candidates. Please confirm occupancy (including children) and amenities with each property directly. This is not a filter by availability.",
      "filters.heading": "Stay Conditions",
      "filters.intro.line1": "Please select",
      "filters.intro.line2": "your preferred conditions.",
      "filters.area.label": "Area",
      "filters.area.all": "All Areas",
      "filters.area.bay": "Osaka Bay Area",
      "filters.area.south": "Tengachaya / Hanazonocho",
      "filters.area.kaizuka": "Kaizuka",
      "filters.adults.label": "Adults",
      "filters.adults.decrease": "Decrease adults by 1",
      "filters.adults.increase": "Increase adults by 1",
      "filters.children.label": "Children",
      "filters.children.decrease": "Decrease children by 1",
      "filters.children.increase": "Increase children by 1",
      "filters.ageNote": "Children's ages are used to confirm stay conditions.",
      "filters.amenitiesLegend": "Desired amenities",
      "filters.amenity.kitchen": "Kitchen",
      "filters.amenity.laundry": "Washing machine",
      "filters.amenity.bath": "Bathtub",
      "filters.amenity.parking": "Parking",
      "filters.submit": "Filter",
      "filters.reset": "Reset",

      "ages.label": "Age of child {{n}}",
      "ages.selectPlaceholder": "Please select",
      "ages.optionYears": "{{age}} years old",
      "ages.unselected": "Not selected",

      "dates.heading": "Stay Dates",
      "dates.optional": "(optional)",
      "dates.helper.line1": "We'll help you check availability",
      "dates.helper.line2": "for your preferred dates",
      "dates.helper.line3": "— just get in touch.",
      "dates.checkin": "Check-in",
      "dates.checkout": "Check-out",
      "dates.fine": "Entering dates alone does not confirm availability or booking.",
      "dates.submit": "Inquire About Availability",
      "dates.validity.checkoutAfterCheckin": "Please select a check-out date after the check-in date.",

      "inquiry.intro": "I'd like to ask about availability.",
      "inquiry.line.checkin": "Check-in: {{value}}",
      "inquiry.line.checkout": "Check-out: {{value}}",
      "inquiry.line.adults": "Adults: {{count}}",
      "inquiry.line.children": "Children: {{count}}{{ages}}",
      "inquiry.agesWrapper": " ({{list}})",
      "inquiry.listSeparator": ", ",
      "inquiry.question": "Would this be possible for our stay?",
      "inquiry.copyButton": "Copy Text",
      "inquiry.copied": "Copied",
      "inquiry.copyFallback": "Please copy the selected text",
      "inquiry.chooseStay": "Please choose which stay to contact.",

      "skip.toMain": "Skip to main content",
      "page.heading": "Find the Stay That's Right for You in Osaka.",
      "page.lead": "Search by group size and amenities to find your perfect stay.",
      "page.aside.line1": "In Osaka,",
      "page.aside.line2": "stay like you live here."
    },

    "zh-Hant": {
      "meta.title": "YUSEI STAY | 大阪整棟出租民宿",
      "meta.description": "YUSEI STAY 是坐落於大阪街區的整棟出租民宿。在旅途中，享受如日常生活般的特別住宿體驗。",
      "staysPage.metaTitle": "尋找住宿 | YUSEI STAY",
      "staysPage.metaDescription": "依人數與設備條件，尋找大阪的整棟出租住宿。在 YUSEI STAY，展開如日常生活般的旅程。",

      "nav.home": "首頁",
      "nav.findStays": "住宿",
      "nav.about": "關於我們",
      "nav.faq": "常見問題",
      "nav.contact": "聯絡我們",
      "nav.ariaLabel": "主要導覽選單",
      "footer.navAriaLabel": "頁尾導覽選單",
      "nav.language.label": "選擇語言",
      "nav.language.generic": "語言",

      "brand.ariaLabel": "YUSEI STAY — 返回首頁",
      "brand.tagline": "宛如日常般旅居。",

      "cta.findStays": "尋找住宿 →",
      "cta.viewAllStays": "查看全部住宿 →",
      "cta.viewDetails": "查看詳情 →",
      "cta.accessDetails": "詳細交通資訊請見各宿頁面 →",
      "cta.viewStays": "查看住宿",

      "hamburger.open": "開啟選單",
      "hamburger.close": "關閉選單",

      "hero.subheading": "在旅途中，如日常般旅居。",
      "hero.description.line1": "從大阪市區到貝塚，",
      "hero.description.line2": "在整棟出租的住宿中度過日常時光。",
      "hero.vertical.line1": "坐在榻榻米上，",
      "hero.vertical.line2": "感受悠緩流動的時光，",
      "hero.vertical.line3": "遇見另一個大阪。",
      "hero.imageAlt": "YUSEI STAY 民宿的實際照片",

      "about.heading": "在旅途中，擁有另一個家。",
      "about.description": "YUSEI STAY 是可在大阪如日常般旅居的整棟出租民宿。在傳統與現代交織的城市裡，為您獻上專屬於您的特別時光。",
      "about.cta": "關於我們 →",
      "about.imageAlt": "和の園（Harmony Garden）室內",

      "stays.heading": "每一間宿，各有其時光。",
      "stayCard.tea.location": "整棟出租・天下茶屋、花園町",
      "stayCard.art.location": "整棟出租・朝潮橋",
      "stayCard.furukawa.location": "整棟出租・貝塚市",
      "stayCard.tea.imageAlt": "茶園 Tea Garden客房",
      "stayCard.art.imageAlt": "芸 Art Home客房",
      "stayCard.furukawa.imageAlt": "古川の家 Furukawa House客房",

      "features.heading": "受歡迎的三大理由",
      "features.item1.title": "整棟出租的安心感",
      "features.item1.description": "無需在意其他房客，只屬於家人或朋友的私人空間。",
      "features.item2.title": "便利的地理位置",
      "features.item2.description": "前往主要觀光景點交通便利，盡情享受大阪的魅力。",
      "features.item3.title": "舒適的生活機能",
      "features.item3.description": "配備旅行所需設施，長期停留也能舒適自在。",

      "experience.heading.line1": "如日常般旅行，",
      "experience.heading.line2": "在大阪這座城市。",
      "experience.description": "美味的食物、溫暖的人們，還有那些既懷舊又嶄新的街景。透過 YUSEI STAY，體驗只靠觀光無法遇見的大阪日常。",
      "experience.cta": "探索大阪的樂趣 →",
      "experience.image1Alt": "夜晚新世界，可見通天閣的商店街示意照片",
      "experience.image2Alt": "道頓堀夜晚招牌林立的商店街示意照片",
      "experience.image3Alt": "櫻花與大阪城夜景示意照片",
      "experience.dialogTitle": "探索大阪的樂趣",

      "access.heading": "選擇您入住的區域",
      "access.description.line1": "從大阪市區到貝塚，",
      "access.description.line2": "在各具特色的區域中，共有7間住宿。",
      "access.area1": "弁天町・朝潮橋",
      "access.area2": "天下茶屋・花園町",
      "access.area3": "貝塚",

      "bookingCta.heading": "在大阪，展開如生活般的旅程。",
      "bookingCta.description": "預約請透過各住宿的外部訂房網站。",
      "bookingCta.imageAlt": "茶園的茶具與鐵壺",

      "footer.note": "空房狀況與預約方式，請至各設施的Airbnb頁面確認。",
      "footer.noteStays": "空房狀況與預約方式，請至各設施的詳細頁面確認。",
      "footer.followUs": "追蹤我們",

      "dialog.close": "關閉",
      "dialog.home.faq.body": "本網站無法完成訂房。空房狀況、價格及兒童入住條件，請直接透過您所選住宿的Airbnb頁面洽詢。",
      "dialog.home.contact.body": "目前本網站不接受直接洽詢。若有問題或訂房需求，請透過您所選住宿的Airbnb頁面聯絡。",
      "dialog.home.stayLink": "前往尋找住宿頁面 →",
      "dialog.about.comingSoon": "詳細介紹頁面正在準備中。",
      "dialog.experience.comingSoon": "介紹大阪街區與貝塚老街樂趣的頁面正在準備中。",
      "dialog.stay.station": "最近區域：{{station}}",
      "dialog.stay.airbnbNote": "詳細設備、住宿條件與空房狀況，請至Airbnb的設施頁面確認。",
      "dialog.stay.airbnbLink": "在Airbnb查看{{name}} ↗",
      "dialog.stays.faqContactBody": "本網站無法完成訂房。空房、價格及兒童入住條件，請透過您所選住宿的Airbnb頁面洽詢。",
      "dialog.inquiry.title": "空房查詢",
      "dialog.inquiry.intro": "已為您建立詢問內容，但尚未送出。請複製下方文字，並透過您所選設施的Airbnb頁面送出詢問。",
      "dialog.inquiry.textareaAriaLabel": "詢問文字內容",

      "card.imageAlt": "{{name}}室內",
      "card.detailsAriaLabel": "查看{{name}}的詳情",

      "results.status.initial": "篩選前",
      "results.status.candidates": "候選 {{count}} 間住宿",
      "results.status.all": "全部 {{count}} 間住宿",
      "results.empty": "找不到符合條件的住宿。請嘗試變更人數或區域。",
      "results.showAll": "查看全部7間住宿",
      "results.heading": "住宿列表",
      "results.lead": "在大阪，遇見各式各樣的生活方式。",

      "filters.note": "定員與設備尚待確認的設施也包含在候選名單中。含兒童在內的入住人數及設備對應情形，請向各設施個別確認。此篩選並非依空房狀況進行。",
      "filters.heading": "住宿條件",
      "filters.intro.line1": "請選擇您",
      "filters.intro.line2": "希望的條件。",
      "filters.area.label": "區域",
      "filters.area.all": "所有區域",
      "filters.area.bay": "大阪灣岸區域",
      "filters.area.south": "天下茶屋・花園町",
      "filters.area.kaizuka": "貝塚",
      "filters.adults.label": "大人",
      "filters.adults.decrease": "大人人數減少1位",
      "filters.adults.increase": "大人人數增加1位",
      "filters.children.label": "兒童",
      "filters.children.decrease": "兒童人數減少1位",
      "filters.children.increase": "兒童人數增加1位",
      "filters.ageNote": "兒童年齡將用於確認住宿條件。",
      "filters.amenitiesLegend": "希望的設備",
      "filters.amenity.kitchen": "廚房",
      "filters.amenity.laundry": "洗衣機",
      "filters.amenity.bath": "浴缸",
      "filters.amenity.parking": "停車場",
      "filters.submit": "篩選",
      "filters.reset": "重設",

      "ages.label": "兒童{{n}}的年齡",
      "ages.selectPlaceholder": "請選擇",
      "ages.optionYears": "{{age}}歲",
      "ages.unselected": "未選擇",

      "dates.heading": "入住日期",
      "dates.optional": "（選填）",
      "dates.helper.line1": "我們將協助您依",
      "dates.helper.line2": "希望的日期",
      "dates.helper.line3": "查詢空房狀況。",
      "dates.checkin": "入住日",
      "dates.checkout": "退房日",
      "dates.fine": "僅輸入日期並不代表已確認空房或完成預約。",
      "dates.submit": "查詢空房",
      "dates.validity.checkoutAfterCheckin": "請選擇晚於入住日的退房日期。",

      "inquiry.intro": "想請問空房狀況。",
      "inquiry.line.checkin": "入住日：{{value}}",
      "inquiry.line.checkout": "退房日：{{value}}",
      "inquiry.line.adults": "大人：{{count}}位",
      "inquiry.line.children": "兒童：{{count}}位{{ages}}",
      "inquiry.agesWrapper": "（{{list}}）",
      "inquiry.listSeparator": "、",
      "inquiry.question": "這樣的條件可以入住嗎？",
      "inquiry.copyButton": "複製文字",
      "inquiry.copied": "已複製",
      "inquiry.copyFallback": "請複製已選取的文字",
      "inquiry.chooseStay": "請選擇要洽詢的住宿。",

      "skip.toMain": "跳至主要內容",
      "page.heading": "在大阪，找到適合您的住宿。",
      "page.lead": "依人數與設備條件，找到最適合旅程的一間。",
      "page.aside.line1": "在大阪，",
      "page.aside.line2": "如日常般旅居。"
    },

    "zh-Hans": {
      "meta.title": "YUSEI STAY | 大阪整栋出租民宿",
      "meta.description": "YUSEI STAY 是坐落于大阪街区的整栋出租民宿。在旅途中，享受如日常生活般的特别住宿体验。",
      "staysPage.metaTitle": "寻找住宿 | YUSEI STAY",
      "staysPage.metaDescription": "按人数与设施条件，寻找大阪的整栋出租住宿。在 YUSEI STAY，开启如日常生活般的旅程。",

      "nav.home": "首页",
      "nav.findStays": "住宿",
      "nav.about": "关于我们",
      "nav.faq": "常见问题",
      "nav.contact": "联系我们",
      "nav.ariaLabel": "主导航菜单",
      "footer.navAriaLabel": "页脚导航菜单",
      "nav.language.label": "选择语言",
      "nav.language.generic": "语言",

      "brand.ariaLabel": "YUSEI STAY — 返回首页",
      "brand.tagline": "宛如日常般旅居。",

      "cta.findStays": "寻找住宿 →",
      "cta.viewAllStays": "查看全部住宿 →",
      "cta.viewDetails": "查看详情 →",
      "cta.accessDetails": "详细交通信息请见各宿页面 →",
      "cta.viewStays": "查看住宿",

      "hamburger.open": "打开菜单",
      "hamburger.close": "关闭菜单",

      "hero.subheading": "在旅途中，如日常般旅居。",
      "hero.description.line1": "从大阪市区到贝冢，",
      "hero.description.line2": "在整栋出租的住宿中度过日常时光。",
      "hero.vertical.line1": "坐在榻榻米上，",
      "hero.vertical.line2": "感受悠然流动的时光，",
      "hero.vertical.line3": "遇见另一个大阪。",
      "hero.imageAlt": "YUSEI STAY 民宿的实景照片",

      "about.heading": "在旅途中，拥有另一个家。",
      "about.description": "YUSEI STAY 是可在大阪如日常般旅居的整栋出租民宿。在传统与现代交融的城市里，为您献上专属于您的特别时光。",
      "about.cta": "关于我们 →",
      "about.imageAlt": "和之园（Harmony Garden）室内",

      "stays.heading": "每一间宿，各有其时光。",
      "stayCard.tea.location": "整栋出租・天下茶屋、花园町",
      "stayCard.art.location": "整栋出租・朝潮桥",
      "stayCard.furukawa.location": "整栋出租・贝冢市",
      "stayCard.tea.imageAlt": "茶园 Tea Garden客房",
      "stayCard.art.imageAlt": "芸 Art Home客房",
      "stayCard.furukawa.imageAlt": "古川之家 Furukawa House客房",

      "features.heading": "深受喜爱的三大理由",
      "features.item1.title": "整栋出租带来的安心感",
      "features.item1.description": "无需在意其他房客，只属于家人或朋友的私人空间。",
      "features.item2.title": "便利的地理位置",
      "features.item2.description": "前往主要观光景点交通便利，尽情享受大阪的魅力。",
      "features.item3.title": "舒适的生活机能",
      "features.item3.description": "配备旅行所需设施，长期停留也能舒适自在。",

      "experience.heading.line1": "如日常般旅行，",
      "experience.heading.line2": "在大阪这座城市。",
      "experience.description": "美味的食物、温暖的人们，还有那些既怀旧又崭新的街景。通过 YUSEI STAY，体验只靠观光无法遇见的大阪日常。",
      "experience.cta": "探索大阪的乐趣 →",
      "experience.image1Alt": "夜晚新世界，可见通天阁的商店街示意照片",
      "experience.image2Alt": "道顿堀夜晚霓虹招牌林立的商店街示意照片",
      "experience.image3Alt": "樱花与大阪城夜景示意照片",
      "experience.dialogTitle": "探索大阪的乐趣",

      "access.heading": "选择您入住的区域",
      "access.description.line1": "从大阪市区到贝冢，",
      "access.description.line2": "在各具特色的区域中，共有7间住宿。",
      "access.area1": "弁天町・朝潮桥",
      "access.area2": "天下茶屋・花园町",
      "access.area3": "贝冢",

      "bookingCta.heading": "在大阪，开启如生活般的旅程。",
      "bookingCta.description": "预订请通过各住宿的外部订房网站。",
      "bookingCta.imageAlt": "茶园的茶具与铁壶",

      "footer.note": "空房状况与预订方式，请至各设施的Airbnb页面确认。",
      "footer.noteStays": "空房状况与预订方式，请至各设施的详情页面确认。",
      "footer.followUs": "关注我们",

      "dialog.close": "关闭",
      "dialog.home.faq.body": "本网站无法完成预订。空房状况、价格及儿童入住条件，请直接通过您所选住宿的Airbnb页面咨询。",
      "dialog.home.contact.body": "目前本网站不接受直接咨询。如有问题或预订需求，请通过您所选住宿的Airbnb页面联系。",
      "dialog.home.stayLink": "前往寻找住宿页面 →",
      "dialog.about.comingSoon": "详细介绍页面正在准备中。",
      "dialog.experience.comingSoon": "介绍大阪街区与贝冢老街乐趣的页面正在准备中。",
      "dialog.stay.station": "最近区域：{{station}}",
      "dialog.stay.airbnbNote": "详细设施、住宿条件与空房状况，请至Airbnb的设施页面确认。",
      "dialog.stay.airbnbLink": "在Airbnb查看{{name}} ↗",
      "dialog.stays.faqContactBody": "本网站无法完成预订。空房、价格及儿童入住条件，请通过您所选住宿的Airbnb页面咨询。",
      "dialog.inquiry.title": "空房咨询",
      "dialog.inquiry.intro": "已为您生成咨询内容，但尚未发送。请复制下方文字，并通过您所选设施的Airbnb页面发送咨询。",
      "dialog.inquiry.textareaAriaLabel": "咨询文字内容",

      "card.imageAlt": "{{name}}室内",
      "card.detailsAriaLabel": "查看{{name}}的详情",

      "results.status.initial": "筛选前",
      "results.status.candidates": "候选 {{count}} 间住宿",
      "results.status.all": "全部 {{count}} 间住宿",
      "results.empty": "未找到符合条件的住宿。请尝试更改人数或区域。",
      "results.showAll": "查看全部7间住宿",
      "results.heading": "住宿列表",
      "results.lead": "在大阪，遇见各式各样的生活方式。",

      "filters.note": "定员与设施尚待确认的设施也包含在候选名单中。含儿童在内的入住人数及设施对应情况，请向各设施单独确认。此筛选并非依空房状况进行。",
      "filters.heading": "住宿条件",
      "filters.intro.line1": "请选择您",
      "filters.intro.line2": "希望的条件。",
      "filters.area.label": "区域",
      "filters.area.all": "所有区域",
      "filters.area.bay": "大阪湾岸区域",
      "filters.area.south": "天下茶屋・花园町",
      "filters.area.kaizuka": "贝冢",
      "filters.adults.label": "大人",
      "filters.adults.decrease": "大人人数减少1位",
      "filters.adults.increase": "大人人数增加1位",
      "filters.children.label": "儿童",
      "filters.children.decrease": "儿童人数减少1位",
      "filters.children.increase": "儿童人数增加1位",
      "filters.ageNote": "儿童年龄将用于确认住宿条件。",
      "filters.amenitiesLegend": "希望的设施",
      "filters.amenity.kitchen": "厨房",
      "filters.amenity.laundry": "洗衣机",
      "filters.amenity.bath": "浴缸",
      "filters.amenity.parking": "停车场",
      "filters.submit": "筛选",
      "filters.reset": "重置",

      "ages.label": "儿童{{n}}的年龄",
      "ages.selectPlaceholder": "请选择",
      "ages.optionYears": "{{age}}岁",
      "ages.unselected": "未选择",

      "dates.heading": "入住日期",
      "dates.optional": "（选填）",
      "dates.helper.line1": "我们将协助您按",
      "dates.helper.line2": "希望的日期",
      "dates.helper.line3": "查询空房状况。",
      "dates.checkin": "入住日",
      "dates.checkout": "退房日",
      "dates.fine": "仅输入日期并不代表已确认空房或完成预订。",
      "dates.submit": "查询空房",
      "dates.validity.checkoutAfterCheckin": "请选择晚于入住日的退房日期。",

      "inquiry.intro": "想请问空房状况。",
      "inquiry.line.checkin": "入住日：{{value}}",
      "inquiry.line.checkout": "退房日：{{value}}",
      "inquiry.line.adults": "大人：{{count}}位",
      "inquiry.line.children": "儿童：{{count}}位{{ages}}",
      "inquiry.agesWrapper": "（{{list}}）",
      "inquiry.listSeparator": "、",
      "inquiry.question": "这样的条件可以入住吗？",
      "inquiry.copyButton": "复制文字",
      "inquiry.copied": "已复制",
      "inquiry.copyFallback": "请复制已选中的文字",
      "inquiry.chooseStay": "请选择要咨询的住宿。",

      "skip.toMain": "跳至主要内容",
      "page.heading": "在大阪，找到适合您的住宿。",
      "page.lead": "按人数与设施条件，找到最适合旅程的一间。",
      "page.aside.line1": "在大阪，",
      "page.aside.line2": "如日常般旅居。"
    },

    ko: {
      "meta.title": "YUSEI STAY | 오사카 독채 민박",
      "meta.description": "YUSEI STAY는 오사카 시내 곳곳에 자리한 독채형 민박입니다. 여행지에서 일상처럼 머무는 특별한 시간을 선사합니다.",
      "staysPage.metaTitle": "숙소 찾기 | YUSEI STAY",
      "staysPage.metaDescription": "인원수와 편의시설 조건으로 오사카의 독채 숙소를 찾아보세요. YUSEI STAY에서 일상처럼 머무는 여행을.",

      "nav.home": "홈",
      "nav.findStays": "숙소 찾기",
      "nav.about": "소개",
      "nav.faq": "자주 묻는 질문",
      "nav.contact": "문의하기",
      "nav.ariaLabel": "메인 내비게이션",
      "footer.navAriaLabel": "푸터 내비게이션",
      "nav.language.label": "언어 선택",
      "nav.language.generic": "언어",

      "brand.ariaLabel": "YUSEI STAY 홈으로 이동",
      "brand.tagline": "일상처럼, 머물다.",

      "cta.findStays": "숙소 찾기 →",
      "cta.viewAllStays": "모든 숙소 보기 →",
      "cta.viewDetails": "자세히 보기 →",
      "cta.accessDetails": "자세한 오시는 길은 각 숙소 페이지에서 →",
      "cta.viewStays": "숙소 보기",

      "hamburger.open": "메뉴 열기",
      "hamburger.close": "메뉴 닫기",

      "hero.subheading": "여행지에서, 일상처럼 머물다.",
      "hero.description.line1": "오사카 시내부터 가이즈카까지,",
      "hero.description.line2": "독채 숙소에서 보내는 일상.",
      "hero.vertical.line1": "다다미에 앉아,",
      "hero.vertical.line2": "느긋한 시간이",
      "hero.vertical.line3": "흐르는 또 하나의 오사카",
      "hero.imageAlt": "YUSEI STAY 민박의 실제 사진",

      "about.heading": "여행지에, 또 하나의 우리 집을.",
      "about.description": "YUSEI STAY는 오사카에서 일상처럼 머물 수 있는 독채형 민박입니다. 전통과 현대가 조화를 이루는 도시에서, 당신만의 특별한 시간을 선사합니다.",
      "about.cta": "소개 보기 →",
      "about.imageAlt": "와노소노(Harmony Garden) 실내",

      "stays.heading": "저마다의 집에, 저마다의 시간.",
      "stayCard.tea.location": "독채・텐가차야, 하나조노초",
      "stayCard.art.location": "독채・아사시오바시",
      "stayCard.furukawa.location": "독채・가이즈카시",
      "stayCard.tea.imageAlt": "차엔 Tea Garden 객실",
      "stayCard.art.imageAlt": "게이 Art Home 객실",
      "stayCard.furukawa.imageAlt": "후루카와노이에 Furukawa House 객실",

      "features.heading": "선택받는 세 가지 이유",
      "features.item1.title": "독채라서 느끼는 안심감",
      "features.item1.description": "다른 투숙객을 신경 쓰지 않고 가족이나 동행과만 보내는 프라이빗한 공간.",
      "features.item2.title": "편리한 위치",
      "features.item2.description": "주요 관광지 접근성이 좋아 오사카를 마음껏 즐길 수 있습니다.",
      "features.item3.title": "쾌적한 생활 환경",
      "features.item3.description": "여행에 필요한 설비가 갖춰져 있어 장기 체류도 쾌적합니다.",

      "experience.heading.line1": "일상처럼 여행하다,",
      "experience.heading.line2": "오사카라는 도시에서.",
      "experience.description": "맛있는 음식, 따뜻한 사람들, 어딘가 그립고도 새로운 거리 풍경. YUSEI STAY에서 관광만으로는 만날 수 없는 오사카의 일상을 경험해 보세요.",
      "experience.cta": "오사카를 즐기는 방법 보기 →",
      "experience.image1Alt": "밤의 신세카이, 츠텐카쿠가 보이는 상점가 이미지 사진",
      "experience.image2Alt": "도톤보리의 간판이 늘어선 밤 상점가 이미지 사진",
      "experience.image3Alt": "벚꽃과 오사카성 야경 이미지 사진",
      "experience.dialogTitle": "오사카를 즐기는 방법",

      "access.heading": "머무를 지역을 선택하세요",
      "access.description.line1": "오사카 시내부터 가이즈카까지,",
      "access.description.line2": "저마다 개성이 다른 지역에 7곳의 숙소가 있습니다.",
      "access.area1": "벤텐초・아사시오바시",
      "access.area2": "텐가차야・하나조노초",
      "access.area3": "가이즈카",

      "bookingCta.heading": "오사카에서, 일상 같은 여행을.",
      "bookingCta.description": "예약은 각 숙소의 외부 예약 사이트에서 진행됩니다.",
      "bookingCta.imageAlt": "차엔의 다기와 무쇠 주전자",

      "footer.note": "공실 현황과 예약 방법은 각 시설의 에어비앤비 페이지에서 확인해 주세요.",
      "footer.noteStays": "공실 현황과 예약 방법은 각 시설의 상세 정보에서 확인해 주세요.",
      "footer.followUs": "팔로우하기",

      "dialog.close": "닫기",
      "dialog.home.faq.body": "이 사이트에서는 예약이 확정되지 않습니다. 공실 현황, 요금, 어린이 숙박 조건은 원하시는 숙소의 에어비앤비 페이지로 직접 문의해 주세요.",
      "dialog.home.contact.body": "현재 이 사이트에서는 직접 문의를 받고 있지 않습니다. 질문이나 예약 문의는 원하시는 숙소의 에어비앤비 페이지로 보내주세요.",
      "dialog.home.stayLink": "숙소 찾기 페이지로 →",
      "dialog.about.comingSoon": "자세한 소개 페이지는 현재 준비 중입니다.",
      "dialog.experience.comingSoon": "오사카 시내와 가이즈카 구시가지를 즐기는 방법을 소개하는 페이지는 현재 준비 중입니다.",
      "dialog.stay.station": "가까운 지역: {{station}}",
      "dialog.stay.airbnbNote": "자세한 설비・숙박 조건・공실 현황은 에어비앤비의 시설 페이지에서 확인해 주세요.",
      "dialog.stay.airbnbLink": "에어비앤비에서 {{name}} 보기 ↗",
      "dialog.stays.faqContactBody": "이 사이트에서는 예약이 확정되지 않습니다. 공실, 요금, 어린이 숙박 조건은 원하시는 숙소의 에어비앤비 페이지로 문의해 주세요.",
      "dialog.inquiry.title": "공실 문의",
      "dialog.inquiry.intro": "문의 내용을 작성했습니다. 아직 전송되지 않았습니다. 아래 문구를 복사하여 원하시는 시설의 에어비앤비 페이지에서 문의해 주세요.",
      "dialog.inquiry.textareaAriaLabel": "문의 문구",

      "card.imageAlt": "{{name}}의 실내",
      "card.detailsAriaLabel": "{{name}}의 상세 정보 보기",

      "results.status.initial": "필터링 전",
      "results.status.candidates": "후보 {{count}}개 시설",
      "results.status.all": "전체 {{count}}개 시설",
      "results.empty": "조건에 맞는 숙소를 찾지 못했습니다. 인원수나 지역을 변경해 다시 시도해 주세요.",
      "results.showAll": "모든 숙소 보기 (전체 7개 시설)",
      "results.heading": "숙소 목록",
      "results.lead": "오사카에서 만나는 다양한 일상.",

      "filters.note": "정원・설비 확인 중인 시설도 후보에 포함됩니다. 어린이를 포함한 숙박 인원과 설비 대응 여부는 각 시설에 직접 확인해 주세요. 공실 현황에 따른 필터링이 아닙니다.",
      "filters.heading": "숙박 조건",
      "filters.intro.line1": "원하시는 조건을",
      "filters.intro.line2": "선택해 주세요.",
      "filters.area.label": "지역",
      "filters.area.all": "모든 지역",
      "filters.area.bay": "오사카 베이 지역",
      "filters.area.south": "텐가차야・하나조노초",
      "filters.area.kaizuka": "가이즈카",
      "filters.adults.label": "성인",
      "filters.adults.decrease": "성인 1명 줄이기",
      "filters.adults.increase": "성인 1명 늘리기",
      "filters.children.label": "어린이",
      "filters.children.decrease": "어린이 1명 줄이기",
      "filters.children.increase": "어린이 1명 늘리기",
      "filters.ageNote": "어린이 나이는 숙박 조건 확인에 사용됩니다.",
      "filters.amenitiesLegend": "원하는 설비",
      "filters.amenity.kitchen": "주방",
      "filters.amenity.laundry": "세탁기",
      "filters.amenity.bath": "욕조",
      "filters.amenity.parking": "주차장",
      "filters.submit": "검색하기",
      "filters.reset": "초기화",

      "ages.label": "어린이 {{n}}의 나이",
      "ages.selectPlaceholder": "선택해 주세요",
      "ages.optionYears": "{{age}}세",
      "ages.unselected": "미선택",

      "dates.heading": "숙박 일정",
      "dates.optional": "(선택)",
      "dates.helper.line1": "원하시는 일정으로",
      "dates.helper.line2": "공실을",
      "dates.helper.line3": "문의하실 수 있습니다.",
      "dates.checkin": "체크인",
      "dates.checkout": "체크아웃",
      "dates.fine": "날짜 입력만으로는 공실이나 예약이 확정되지 않습니다.",
      "dates.submit": "공실 문의하기",
      "dates.validity.checkoutAfterCheckin": "체크아웃은 체크인보다 나중 날짜를 선택해 주세요.",

      "inquiry.intro": "공실에 대해 문의드립니다.",
      "inquiry.line.checkin": "체크인: {{value}}",
      "inquiry.line.checkout": "체크아웃: {{value}}",
      "inquiry.line.adults": "성인: {{count}}명",
      "inquiry.line.children": "어린이: {{count}}명{{ages}}",
      "inquiry.agesWrapper": " ({{list}})",
      "inquiry.listSeparator": ", ",
      "inquiry.question": "이 조건으로 숙박이 가능할까요?",
      "inquiry.copyButton": "문구 복사",
      "inquiry.copied": "복사되었습니다",
      "inquiry.copyFallback": "선택된 문구를 복사해 주세요",
      "inquiry.chooseStay": "문의할 숙소를 선택해 주세요.",

      "skip.toMain": "본문으로 건너뛰기",
      "page.heading": "오사카에서, 당신에게 맞는 숙소를.",
      "page.lead": "인원수와 편의시설 조건으로 여행에 꼭 맞는 숙소를 찾아보세요.",
      "page.aside.line1": "오사카에서,",
      "page.aside.line2": "일상처럼 머물다."
    }
  };

  /* Small closed set of Japanese place names reused across both pages'
     JS-rendered content (stay cards, dialogs, access list). This is a
     curated lookup for known values only — not a generic translator. */
  var stations = {
    "弁天町・朝潮橋": { en: "Bentencho / Asashiobashi", "zh-Hans": "弁天町・朝潮桥", "zh-Hant": "弁天町・朝潮橋", ko: "벤텐초・아사시오바시" },
    "天下茶屋・花園町": { en: "Tengachaya / Hanazonocho", "zh-Hans": "天下茶屋・花园町", "zh-Hant": "天下茶屋・花園町", ko: "텐가차야・하나조노초" },
    "貝塚": { en: "Kaizuka", "zh-Hans": "贝冢", "zh-Hant": "貝塚", ko: "가이즈카" },
    "天下茶屋": { en: "Tengachaya", "zh-Hans": "天下茶屋", "zh-Hant": "天下茶屋", ko: "텐가차야" },
    "朝潮橋": { en: "Asashiobashi", "zh-Hans": "朝潮桥", "zh-Hant": "朝潮橋", ko: "아사시오바시" },
    "貝塚市": { en: "Kaizuka City", "zh-Hans": "贝冢市", "zh-Hant": "貝塚市", ko: "가이즈카시" },
    "花園町": { en: "Hanazonocho", "zh-Hans": "花园町", "zh-Hant": "花園町", ko: "하나조노초" },
    "弁天町": { en: "Bentencho", "zh-Hans": "弁天町", "zh-Hant": "弁天町", ko: "벤텐초" },
    "三ツ松": { en: "Mitsumatsu", "zh-Hans": "三ツ松", "zh-Hant": "三ツ松", ko: "미츠마츠" }
  };

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
      /* storage blocked (private mode, disabled cookies, etc.) — ignore */
    }
  }

  function getQueryLang() {
    try {
      var params = new URLSearchParams(window.location.search);
      var q = params.get("lang");
      if (q && SUPPORTED.indexOf(q) !== -1) {
        return q;
      }
    } catch (e) {
      /* ignore malformed URL */
    }
    return null;
  }

  var currentLang = getQueryLang() || safeGetStorage() || DEFAULT_LANG;
  if (SUPPORTED.indexOf(currentLang) === -1) {
    currentLang = DEFAULT_LANG;
  }

  function format(str, vars) {
    if (!vars) {
      return str;
    }
    return str.replace(/\{\{(\w+)\}\}/g, function (match, key) {
      return Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : match;
    });
  }

  function t(key, vars) {
    var table = dict[currentLang] || dict[DEFAULT_LANG];
    var value = Object.prototype.hasOwnProperty.call(table, key) ? table[key] : dict[DEFAULT_LANG][key];
    if (value === undefined) {
      return key;
    }
    return format(value, vars);
  }

  function station(raw) {
    var entry = stations[raw];
    if (!entry || currentLang === "ja") {
      return raw;
    }
    return entry[currentLang] || raw;
  }

  function applyDom(root) {
    root = root || document;

    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });

    root.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split("|").forEach(function (pair) {
        var parts = pair.split(":");
        var attr = parts[0];
        var key = parts[1];
        if (attr && key) {
          el.setAttribute(attr, t(key));
        }
      });
    });

    var titleKey = document.documentElement.getAttribute("data-i18n-title");
    if (titleKey) {
      document.title = t(titleKey);
    }

    var metaDesc = document.querySelector('meta[name="description"][data-i18n-content]');
    if (metaDesc) {
      metaDesc.setAttribute("content", t(metaDesc.getAttribute("data-i18n-content")));
    }

    document.documentElement.setAttribute("lang", currentLang);
  }

  function syncLangSelects() {
    document.querySelectorAll(".js-lang-select").forEach(function (select) {
      select.value = currentLang;
    });
  }

  function syncQueryLang(lang) {
    try {
      var params = new URLSearchParams(window.location.search);
      if (!params.has("lang")) {
        return;
      }
      params.set("lang", lang);
      var newUrl = window.location.pathname + "?" + params.toString() + window.location.hash;
      window.history.replaceState(window.history.state, "", newUrl);
    } catch (e) {
      /* URL API or history unavailable — ignore, storage still persists the choice */
    }
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1 || lang === currentLang) {
      if (SUPPORTED.indexOf(lang) !== -1) {
        syncLangSelects();
      }
      return;
    }
    currentLang = lang;
    safeSetStorage(lang);
    syncQueryLang(lang);
    applyDom(document);
    syncLangSelects();
    document.dispatchEvent(new CustomEvent("yusei:langchange", { detail: { lang: lang } }));
  }

  function init() {
    applyDom(document);
    document.querySelectorAll(".js-lang-select").forEach(function (select) {
      select.value = currentLang;
      select.addEventListener("change", function () {
        setLang(select.value);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.YuseiI18n = {
    t: t,
    station: station,
    getLang: function () {
      return currentLang;
    },
    setLang: setLang,
    applyDom: applyDom,
    SUPPORTED_LANGS: SUPPORTED.slice()
  };
})();
