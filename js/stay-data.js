/* ============================================================
   Yusei Stay — Stay detail factual data (shared by all 7 pages)

   Loaded by every stays/*.html page. js/stay-detail.js reads
   document.body.dataset.stayId, looks up the matching entry here,
   and renders/enhances the About gallery, amenities, access and
   stay-guide tabs, re-rendering on "yusei:langchange" without
   resetting the active tab or gallery slide.

   Translation policy: every field is written in all 5 supported
   languages (ja, en, zh-Hans, zh-Hant, ko) as a direct, careful
   translation of the verified facts given for this project — not
   a placeholder and not a machine guess. Japanese addresses,
   station names, URLs, numeric facts and proper names are kept
   accurate and unaltered across languages (addresses are given in
   Japanese in every language, since that is what is needed to
   navigate or hail a taxi in Japan; station names elsewhere use
   the same romanizations as js/i18n.js's station table).
   pick()/pickList() still fall back to en/ja if a language key is
   ever missing on a field — that is defensive code, not a
   documented gap: every field below is fully populated.

   Fields left null are intentionally omitted, not guessed — see
   each property's `verified` flags. Never fill a null field with
   an invented value.
   ============================================================ */

(function () {
  "use strict";

  function pick(field, lang) {
    if (!field) {
      return "";
    }
    if (typeof field === "string") {
      return field;
    }
    return field[lang] || field.en || field.ja || "";
  }

  function pickList(field, lang) {
    if (!field) {
      return [];
    }
    return field[lang] || field.en || field.ja || [];
  }

  var stays = {

    tea: {
      slug: "teagarden2024",
      folder: "stay-01_Tea Garden",
      nameJa: "茶園",
      nameEn: "Tea Garden",
      guideArea: "south",
      heroImage: "room_picture_1.jpeg",
      images: ["room_picture_1.jpeg", "room_picture_2.jpeg", "room_picture_3.jpeg", "room_picture_4.jpeg", "room_picture_5.jpeg", "room_picture_6.jpeg", "room_picture_7.jpeg", "room_picture_8.jpeg", "room_picture_9.jpeg", "room_picture_10.jpeg"],
      verified: { address: true, amenities: true, rules: true, map: true, capacity: false },
      tagline: {
        ja: "天下茶屋に佇む、伝統町家の一棟貸し。",
        en: "A traditional machiya, whole to yourselves, in Tengachaya.",
        "zh-Hans": "坐落于天下茶屋的传统町屋整栋出租。",
        "zh-Hant": "坐落於天下茶屋的傳統町屋整棟出租。",
        ko: "텐가차야에 자리한 전통 마치야 독채 숙소."
      },
      summary: {
        ja: "大阪・天下茶屋にある、伝統的な町家造りの一棟貸し宿です。1階には畳の茶の間とソファのある居間、ダイニング、キッチンがあり、2階の畳2間には寝具やソファベッドが備わります。関西空港へ直通の駅からも近く、大阪の下町らしい落ち着いた通りに面しています。",
        en: "Tea Garden is a traditional machiya-style whole-house rental in Tengachaya, Osaka. The ground floor holds a tatami tea room, a sofa living area, a dining space and a kitchen; upstairs, two tatami rooms are furnished with beds, futons and a sofa bed. It sits on a quiet downtown street close to a station with direct access to Kansai Airport.",
        "zh-Hans": "茶园是位于大阪天下茶屋、传统町屋建筑的整栋出租住宿。1楼设有榻榻米茶室、带沙发的客厅、用餐区与厨房；2楼的两间榻榻米房内备有床铺与沙发床。距离直通关西机场的车站不远，坐落在充满大阪老城风情的宁静街道上。",
        "zh-Hant": "茶園是位於大阪天下茶屋、傳統町屋建築的整棟出租住宿。1樓設有榻榻米茶室、附沙發的客廳、用餐區與廚房；2樓的兩間榻榻米房內備有床鋪與沙發床。距離直通關西機場的車站不遠，座落在充滿大阪老城風情的寧靜街道上。",
        ko: "차엔(Tea Garden)은 오사카 텐가차야에 위치한 전통 마치야 양식의 독채 숙소입니다. 1층에는 다다미 다실과 소파가 있는 거실, 다이닝 공간, 주방이 있으며, 2층의 다다미 방 2개에는 침대와 소파베드가 마련되어 있습니다. 간사이 공항으로 직행하는 역에서 가까우며, 오사카 서민 동네다운 차분한 거리에 면해 있습니다."
      },
      stationText: {
        ja: "花園町駅 徒歩4分・天下茶屋駅 徒歩9分（関西空港へ直通）",
        en: "4 min walk from Hanazonocho Sta. · 9 min walk from Tengachaya Sta. (direct access to Kansai Airport)",
        "zh-Hans": "花园町站 步行4分钟・天下茶屋站 步行9分钟（直通关西机场）",
        "zh-Hant": "花園町站 步行4分鐘・天下茶屋站 步行9分鐘（直通關西機場）",
        ko: "하나조노초역 도보 4분・텐가차야역 도보 9분（간사이 공항 직행）"
      },
      address: {
        ja: "〒557-0014 大阪市西成区天下茶屋1丁目22-21",
        en: "〒557-0014 大阪市西成区天下茶屋1丁目22-21",
        "zh-Hans": "〒557-0014 大阪市西成区天下茶屋1丁目22-21",
        "zh-Hant": "〒557-0014 大阪市西成区天下茶屋1丁目22-21",
        ko: "〒557-0014 大阪市西成区天下茶屋1丁目22-21"
      },
      mapUrl: "https://share.google/9CjIHLYqQntQztZdH",
      rooms: [
        { floor: { ja: "1F", en: "1F", "zh-Hans": "1F", "zh-Hant": "1F", ko: "1F" }, items: { ja: ["畳の茶の間", "ソファのある居間", "ダイニング", "キッチン", "トイレ", "浴室（バスタブ付き）"], en: ["Tatami tea room", "Sofa living area", "Dining space", "Kitchen", "Toilet", "Bathroom with tub"], "zh-Hans": ["榻榻米茶室", "带沙发的客厅", "用餐区", "厨房", "卫生间", "浴室（带浴缸）"], "zh-Hant": ["榻榻米茶室", "附沙發的客廳", "用餐區", "廚房", "廁所", "浴室（附浴缸）"], ko: ["다다미 다실", "소파가 있는 거실", "다이닝 공간", "주방", "화장실", "욕조가 있는 욕실"] } },
        { floor: { ja: "2F", en: "2F", "zh-Hans": "2F", "zh-Hant": "2F", ko: "2F" }, items: { ja: ["畳の寝室×2（ベッド・布団・ソファベッド）"], en: ["Two tatami bedrooms (beds, futons and a sofa bed)"], "zh-Hans": ["两间榻榻米卧室（床・被褥・沙发床）"], "zh-Hant": ["兩間榻榻米臥室（床・被褥・沙發床）"], ko: ["다다미 침실 2개（침대・이불・소파베드）"] } }
      ],
      amenities: {
        basic: { ja: ["寝具", "椅子", "ソファベッド", "座卓", "テレビ・チューナーボックス", "冷暖房エアコン", "扇風機・ヒーター", "浴衣", "照明・防火用品"], en: ["Bedding", "Chairs", "Sofa bed", "Low table", "TV & tuner box", "Air conditioning / heating", "Fan / heater", "Yukata robes", "Lighting & fire safety equipment"], "zh-Hans": ["床上用品", "椅子", "沙发床", "矮桌", "电视及调谐器", "冷暖空调", "电风扇・取暖器", "浴衣", "照明及消防用品"], "zh-Hant": ["床上用品", "椅子", "沙發床", "矮桌", "電視及調諧器", "冷暖空調", "電風扇・暖爐", "浴衣", "照明及消防用品"], ko: ["침구", "의자", "소파베드", "좌식 테이블", "TV 및 튜너 박스", "냉난방 에어컨", "선풍기・히터", "유카타", "조명 및 소방 안전용품"] },
        kitchen: { ja: ["電気コンロ", "電子レンジ", "冷蔵庫", "食器・調理器具", "電気ケトル", "コーヒーポット"], en: ["Electric stove", "Microwave", "Refrigerator", "Tableware & cookware", "Electric kettle", "Coffee pot"], "zh-Hans": ["电炉", "微波炉", "冰箱", "餐具及厨具", "电热水壶", "咖啡壶"], "zh-Hant": ["電爐", "微波爐", "冰箱", "餐具及廚具", "電熱水壺", "咖啡壺"], ko: ["전기레인지", "전자레인지", "냉장고", "식기 및 조리도구", "전기 주전자", "커피포트"] },
        bathroom: { ja: ["浴室・シャワー", "洗面台", "トイレ", "アメニティ", "タオル・歯ブラシ", "スリッパ", "鏡", "ドライヤー", "ヘアアイロン"], en: ["Bath / shower", "Wash basin", "Toilet", "Toiletries", "Towels & toothbrush", "Slippers", "Mirror", "Hair dryer", "Hair iron"], "zh-Hans": ["浴室・淋浴", "洗手台", "卫生间", "洗漱用品", "毛巾及牙刷", "拖鞋", "镜子", "吹风机", "直发夹"], "zh-Hant": ["浴室・淋浴", "洗手台", "廁所", "盥洗用品", "毛巾及牙刷", "拖鞋", "鏡子", "吹風機", "整髮器"], ko: ["욕실・샤워실", "세면대", "화장실", "어메니티", "수건 및 칫솔", "슬리퍼", "거울", "헤어드라이어", "헤어아이론"] },
        other: { ja: ["Wi-Fi", "洗濯機・物干し", "ゴミ箱・ゴミ袋", "救急用品", "掃除用具", "掃除機"], en: ["Wi-Fi", "Washing machine & drying rack", "Trash bins & bags", "First aid kit", "Cleaning tools", "Vacuum cleaner"], "zh-Hans": ["Wi-Fi", "洗衣机及晾衣架", "垃圾桶及垃圾袋", "急救用品", "清洁用具", "吸尘器"], "zh-Hant": ["Wi-Fi", "洗衣機及晾衣架", "垃圾桶及垃圾袋", "急救用品", "清潔用具", "吸塵器"], ko: ["Wi-Fi", "세탁기 및 건조대", "쓰레기통 및 쓰레기봉투", "구급용품", "청소도구", "청소기"] }
      },
      rules: {
        ja: ["室内は禁煙です。喫煙は屋外の指定スペースでお願いします。", "パーティーや大きな音を出すご利用はご遠慮ください。"],
        en: ["No smoking indoors — an outdoor smoking area is provided.", "Parties and loud noise are not permitted."],
        "zh-Hans": ["室内禁烟，请在户外指定区域吸烟。", "谢绝举办派对或发出大声喧哗等行为。"],
        "zh-Hant": ["室內禁菸，請於戶外指定區域吸菸。", "謝絕舉辦派對或發出大聲喧嘩等行為。"],
        ko: ["실내는 금연입니다. 흡연은 실외 지정 구역에서 부탁드립니다.", "파티 또는 큰 소음을 유발하는 이용은 삼가주시기 바랍니다."]
      },
      guide: { checkin: null, checkout: null, cancellation: null },
      capacityText: {
        ja: "施設情報では1〜5名向けとされています。",
        en: "The property listing describes this stay as suited to 1–5 guests.",
        "zh-Hans": "根据房源信息，本住宿适合1〜5位旅客入住。",
        "zh-Hant": "根據房源資訊，本住宿適合1〜5位旅客入住。",
        ko: "시설 정보에 따르면 1~5인에게 적합한 숙소입니다."
      }
    },

    zen: {
      slug: "zen2025",
      folder: "stay-02_Zen Garden",
      nameJa: "禪園",
      nameEn: "Zen Garden",
      guideArea: "south",
      heroImage: "room_picture_1.jpeg",
      images: ["room_picture_1.jpeg", "room_picture_2.jpeg", "room_picture_3.jpeg", "room_picture_4.jpeg", "room_picture_5.jpeg", "room_picture_6.jpeg", "room_picture_7.jpeg", "room_picture_8.jpeg", "room_picture_9.jpeg", "room_picture_10.jpeg", "room_picture_11.jpeg", "room_picture_12.jpeg", "room_picture_13.jpeg", "room_picture_14.jpeg", "room_picture_15.jpeg", "room_picture_16.jpeg", "room_picture_17.jpeg"],
      verified: { address: true, amenities: true, rules: true, map: true, capacity: false },
      tagline: {
        ja: "昭和の町家を改修した、庭のある一棟貸し。",
        en: "A Showa-era row house, renovated, with its own garden.",
        "zh-Hans": "改建自昭和年代町屋、带庭院的整栋出租住宅。",
        "zh-Hant": "改建自昭和年代町屋、附庭院的整棟出租住宅。",
        ko: "쇼와 시대 목조 주택을 개조한 정원 딸린 독채 숙소."
      },
      summary: {
        ja: "禪園は、2024年に改修された昭和年代の町家を、木の建具や庭を活かしたまま一棟貸しにした宿です。1階にはキッチン、ダイニングテーブル、畳の居間、小さな日本庭園、トイレ、浴室（バスタブ付き）があり、2階にはダブルベッドの洋室と布団を敷く和室があります。",
        en: "Zen Garden is a Showa-era row house, renovated in 2024 while preserving its original wood joinery and garden, rented out whole to one group. The ground floor has a kitchen, a dining table, a tatami living room, a small Japanese garden, a toilet and a bathroom with a tub; upstairs there is a Western-style room with a double bed and a Japanese-style room with futons.",
        "zh-Hans": "禅园是一栋建于昭和年代、于2024年翻修的町屋，保留了原有的木制门窗与庭院，整栋出租供旅客使用。1楼设有厨房、餐桌、榻榻米客厅、小型日式庭院、卫生间与浴室（附浴缸）；2楼设有双人床西式房间与铺设被褥的日式房间。",
        "zh-Hant": "禪園是一棟建於昭和年代、於2024年翻修的町屋，保留了原有的木製門窗與庭院，整棟出租供旅客使用。1樓設有廚房、餐桌、榻榻米客廳、小型日式庭院、廁所與浴室（附浴缸）；2樓設有雙人床西式房間與鋪設被褥的日式房間。",
        ko: "젠엔(Zen Garden)은 쇼와 시대에 지어져 2024년에 개조된 마치야로, 원래의 목재 창호와 정원을 그대로 살린 독채 숙소입니다. 1층에는 주방, 다이닝 테이블, 다다미 거실, 작은 일본식 정원, 화장실, 욕조가 있는 욕실이 있으며, 2층에는 더블베드가 있는 서양식 방과 이불을 까는 일본식 방이 있습니다."
      },
      stationText: {
        ja: "花園町駅 徒歩3分・天下茶屋駅 徒歩9分（関西空港へ直通）",
        en: "3 min walk from Hanazonocho Sta. · 9 min walk from Tengachaya Sta. (direct access to Kansai Airport)",
        "zh-Hans": "花园町站 步行3分钟・天下茶屋站 步行9分钟（直通关西机场）",
        "zh-Hant": "花園町站 步行3分鐘・天下茶屋站 步行9分鐘（直通關西機場）",
        ko: "하나조노초역 도보 3분・텐가차야역 도보 9분（간사이 공항 직행）"
      },
      address: {
        ja: "〒557-0015 大阪府大阪市西成区花園南1丁目9-33",
        en: "〒557-0015 大阪府大阪市西成区花園南1丁目9-33",
        "zh-Hans": "〒557-0015 大阪府大阪市西成区花園南1丁目9-33",
        "zh-Hant": "〒557-0015 大阪府大阪市西成区花園南1丁目9-33",
        ko: "〒557-0015 大阪府大阪市西成区花園南1丁目9-33"
      },
      mapUrl: "https://maps.app.goo.gl/m5mRUL41s1pMXpNw9?g_st=ac",
      rooms: [
        { floor: { ja: "1F", en: "1F", "zh-Hans": "1F", "zh-Hant": "1F", ko: "1F" }, items: { ja: ["キッチン", "ダイニングテーブル", "畳の居間", "小さな日本庭園", "トイレ", "浴室（バスタブ付き）"], en: ["Kitchen", "Dining table", "Tatami living room", "Small Japanese garden", "Toilet", "Bathroom with tub"], "zh-Hans": ["厨房", "餐桌", "榻榻米客厅", "小型日式庭院", "卫生间", "浴室（带浴缸）"], "zh-Hant": ["廚房", "餐桌", "榻榻米客廳", "小型日式庭院", "廁所", "浴室（附浴缸）"], ko: ["주방", "다이닝 테이블", "다다미 거실", "작은 일본식 정원", "화장실", "욕조가 있는 욕실"] } },
        { floor: { ja: "2F", en: "2F", "zh-Hans": "2F", "zh-Hant": "2F", ko: "2F" }, items: { ja: ["洋室（ダブルベッド）", "和室（布団）"], en: ["Western-style room (double bed)", "Japanese-style room (futons)"], "zh-Hans": ["西式房间（双人床）", "日式房间（被褥）"], "zh-Hant": ["西式房間（雙人床）", "日式房間（被褥）"], ko: ["서양식 방（더블베드）", "일본식 방（이불）"] } }
      ],
      amenities: {
        basic: { ja: ["寝具", "ダイニングテーブル・椅子", "座卓", "洗濯機・物干し", "テレビ・チューナーボックス", "冷暖房エアコン", "扇風機・ヒーター", "浴衣", "照明・防火用品"], en: ["Bedding", "Dining table & chairs", "Low table", "Washing machine & drying rack", "TV & tuner box", "Air conditioning / heating", "Fan / heater", "Yukata robes", "Lighting & fire safety equipment"], "zh-Hans": ["床上用品", "餐桌及椅子", "矮桌", "洗衣机及晾衣架", "电视及调谐器", "冷暖空调", "电风扇・取暖器", "浴衣", "照明及消防用品"], "zh-Hant": ["床上用品", "餐桌及椅子", "矮桌", "洗衣機及晾衣架", "電視及調諧器", "冷暖空調", "電風扇・暖爐", "浴衣", "照明及消防用品"], ko: ["침구", "다이닝 테이블 및 의자", "좌식 테이블", "세탁기 및 건조대", "TV 및 튜너 박스", "냉난방 에어컨", "선풍기・히터", "유카타", "조명 및 소방 안전용품"] },
        kitchen: { ja: ["電気コンロ", "電子レンジ", "冷蔵庫", "食器", "調理器具", "電気ケトル", "ガスコンロ"], en: ["Electric stove", "Microwave", "Refrigerator", "Tableware", "Cookware", "Electric kettle", "Gas stove"], "zh-Hans": ["电炉", "微波炉", "冰箱", "餐具", "厨具", "电热水壶", "燃气灶"], "zh-Hant": ["電爐", "微波爐", "冰箱", "餐具", "廚具", "電熱水壺", "瓦斯爐"], ko: ["전기레인지", "전자레인지", "냉장고", "식기", "조리도구", "전기 주전자", "가스레인지"] },
        bathroom: { ja: ["浴室・シャワー", "洗面台", "トイレ", "ボディソープ・シャンプー・コンディショナー", "タオル・歯ブラシ・歯磨き粉", "紙製品", "スリッパ", "ヘアアイロン"], en: ["Bath / shower", "Wash basin", "Toilet", "Body wash / shampoo / conditioner", "Towels / toothbrush / toothpaste", "Paper goods", "Slippers", "Hair iron"], "zh-Hans": ["浴室・淋浴", "洗手台", "卫生间", "沐浴露・洗发水・护发素", "毛巾・牙刷・牙膏", "纸制品", "拖鞋", "直发夹"], "zh-Hant": ["浴室・淋浴", "洗手台", "廁所", "沐浴乳・洗髮精・潤髮乳", "毛巾・牙刷・牙膏", "紙製品", "拖鞋", "整髮器"], ko: ["욕실・샤워실", "세면대", "화장실", "바디워시・샴푸・컨디셔너", "수건・칫솔・치약", "화장지 등 종이용품", "슬리퍼", "헤어아이론"] },
        other: { ja: ["Wi-Fi", "ゴミ箱・ゴミ袋", "救急用品", "掃除用具"], en: ["Wi-Fi", "Trash bins & bags", "First aid kit", "Cleaning tools"], "zh-Hans": ["Wi-Fi", "垃圾桶及垃圾袋", "急救用品", "清洁用具"], "zh-Hant": ["Wi-Fi", "垃圾桶及垃圾袋", "急救用品", "清潔用具"], ko: ["Wi-Fi", "쓰레기통 및 쓰레기봉투", "구급용품", "청소도구"] }
      },
      rules: {
        ja: ["建物全体が禁煙です。喫煙は2階バルコニーに限りお願いします。", "パーティーや大きな音を出すご利用はご遠慮ください。"],
        en: ["The whole house is non-smoking — smoking is permitted only on the 2F balcony.", "Parties and loud noise are not permitted."],
        "zh-Hans": ["整栋建筑禁止吸烟，仅可在2楼阳台吸烟。", "谢绝举办派对或发出大声喧哗等行为。"],
        "zh-Hant": ["整棟建築禁止吸菸，僅可於2樓陽台吸菸。", "謝絕舉辦派對或發出大聲喧嘩等行為。"],
        ko: ["건물 전체가 금연입니다. 흡연은 2층 발코니에서만 가능합니다.", "파티 또는 큰 소음을 유발하는 이용은 삼가주시기 바랍니다."]
      },
      guide: {
        checkin: null,
        checkout: null,
        cancellation: {
          ja: "運営者からの参考情報として、30日前までは無料キャンセル、30日以内は50%、7日以内はキャンセル料100%とされています。",
          en: "As reference information from the operator: free cancellation up to 30 days before check-in, 50% within 30 days, and non-refundable within 7 days.",
          "zh-Hans": "作为运营方提供的参考信息：入住前30天以上可免费取消，30天以内收取50%取消费，7天以内则收取100%取消费（不予退款）。",
          "zh-Hant": "作為營運方提供的參考資訊：入住前30天以上可免費取消，30天以內酌收50%取消費，7天以內則收取100%取消費（不予退還）。",
          ko: "운영자 제공 참고 정보에 따르면, 체크인 30일 전까지는 무료 취소, 30일 이내는 취소 수수료 50%, 7일 이내는 취소 수수료 100%（환불 불가）입니다."
        }
      },
      capacityText: null
    },

    literature: {
      slug: "literaturegarden",
      folder: "stay-04_Literature Garden",
      nameJa: "文園",
      nameEn: "Literature Garden",
      guideArea: "bay",
      heroImage: "room_picture_1.jpeg",
      images: ["room_picture_1.jpeg", "room_picture_2.jpeg", "room_picture_3.jpeg", "room_picture_4.jpeg", "room_picture_5.jpeg", "room_picture_6.jpeg", "room_picture_7.jpeg", "room_picture_8.jpeg", "room_picture_9.jpeg"],
      verified: { address: true, amenities: true, rules: true, map: true, capacity: false },
      tagline: {
        ja: "市岡の路地に建つ、三階建ての一棟貸し古民家。",
        en: "A three-storey old row house, whole to yourselves, in Ichioka.",
        "zh-Hans": "坐落于市冈巷弄的三层楼整栋出租老屋。",
        "zh-Hant": "坐落於市岡巷弄的三層樓整棟出租老屋。",
        ko: "이치오카 골목에 자리한 3층 독채 목조 고택."
      },
      summary: {
        ja: "文園は、大阪市港区市岡にある三階建ての古い町家を一棟貸しにした宿です。1階にキッチンと布団を敷く畳の居間、トイレ、浴室（バスタブ付き）、2階にダブルベッドの洋室と着替えスペース、3階に布団を敷く畳の寝室があり、バルコニーには洗濯機・物干しと喫煙スペースを備えます。",
        en: "Literature Garden is a three-storey old row house in Ichioka, Minato-ku, Osaka, rented out whole to one group. The ground floor has a kitchen and a tatami living room with futons, a toilet and a bathroom with a tub; the 2nd floor has a Western-style double room with a dressing area; the 3rd floor has a tatami bedroom with futons and a balcony fitted with a washing machine, drying rack and smoking area.",
        "zh-Hans": "文园是位于大阪市港区市冈、一栋三层楼老町屋的整栋出租住宿。1楼设有厨房、铺设被褥的榻榻米客厅、卫生间与浴室（附浴缸）；2楼设有双人床西式房间与更衣区；3楼设有铺设被褥的榻榻米卧室，阳台配备洗衣机、晾衣架与吸烟区。",
        "zh-Hant": "文園是位於大阪市港區市岡、一棟三層樓老町屋的整棟出租住宿。1樓設有廚房、鋪設被褥的榻榻米客廳、廁所與浴室（附浴缸）；2樓設有雙人床西式房間與更衣區；3樓設有鋪設被褥的榻榻米臥室，陽台配備洗衣機、晾衣架與吸菸區。",
        ko: "분엔(Literature Garden)은 오사카시 미나토구 이치오카에 위치한 3층짜리 오래된 마치야를 독채로 대여하는 숙소입니다. 1층에는 주방과 이불을 까는 다다미 거실, 화장실, 욕조가 있는 욕실이 있으며, 2층에는 더블베드가 있는 서양식 방과 탈의 공간이, 3층에는 이불을 까는 다다미 침실이 있고, 발코니에는 세탁기・건조대와 흡연 구역이 마련되어 있습니다."
      },
      stationText: {
        ja: "Osaka Metro中央線 弁天町駅 徒歩10〜12分・JR弁天町駅 徒歩14〜16分・最寄りバス停 徒歩3分",
        en: "10–12 min walk from Bentencho Sta. (Osaka Metro Chuo Line) · 14–16 min walk from Bentencho Sta. (JR) · 3 min walk from the nearest bus stop",
        "zh-Hans": "Osaka Metro中央线 弁天町站 步行10〜12分钟・JR弁天町站 步行14〜16分钟・最近巴士站 步行3分钟",
        "zh-Hant": "Osaka Metro中央線 弁天町站 步行10〜12分鐘・JR弁天町站 步行14〜16分鐘・最近公車站 步行3分鐘",
        ko: "오사카 메트로 주오선 벤텐초역 도보 10~12분・JR 벤텐초역 도보 14~16분・가장 가까운 버스정류장 도보 3분"
      },
      address: {
        ja: "〒552-0012 大阪市港区市岡1-12-7",
        en: "〒552-0012 大阪市港区市岡1-12-7",
        "zh-Hans": "〒552-0012 大阪市港区市岡1-12-7",
        "zh-Hant": "〒552-0012 大阪市港区市岡1-12-7",
        ko: "〒552-0012 大阪市港区市岡1-12-7"
      },
      mapUrl: "https://maps.app.goo.gl/5arnmbdF3YxQPaum7",
      rooms: [
        { floor: { ja: "1F", en: "1F", "zh-Hans": "1F", "zh-Hant": "1F", ko: "1F" }, items: { ja: ["キッチン", "畳の居間（布団）", "トイレ", "浴室（バスタブ付き）"], en: ["Kitchen", "Tatami living room (futons)", "Toilet", "Bathroom with tub"], "zh-Hans": ["厨房", "榻榻米客厅（被褥）", "卫生间", "浴室（带浴缸）"], "zh-Hant": ["廚房", "榻榻米客廳（被褥）", "廁所", "浴室（附浴缸）"], ko: ["주방", "다다미 거실（이불）", "화장실", "욕조가 있는 욕실"] } },
        { floor: { ja: "2F", en: "2F", "zh-Hans": "2F", "zh-Hant": "2F", ko: "2F" }, items: { ja: ["洋室（ダブルベッド）", "着替えスペース"], en: ["Western-style room (double bed)", "Dressing space"], "zh-Hans": ["西式房间（双人床）", "更衣区"], "zh-Hant": ["西式房間（雙人床）", "更衣區"], ko: ["서양식 방（더블베드）", "탈의 공간"] } },
        { floor: { ja: "3F", en: "3F", "zh-Hans": "3F", "zh-Hant": "3F", ko: "3F" }, items: { ja: ["畳の寝室（布団）", "バルコニー（洗濯機・物干し・喫煙スペース）"], en: ["Tatami bedroom (futons)", "Balcony with washing machine, drying rack & smoking area"], "zh-Hans": ["榻榻米卧室（被褥）", "阳台（洗衣机・晾衣架・吸烟区）"], "zh-Hant": ["榻榻米臥室（被褥）", "陽台（洗衣機・晾衣架・吸菸區）"], ko: ["다다미 침실（이불）", "발코니（세탁기・건조대・흡연구역）"] } }
      ],
      amenities: {
        basic: { ja: ["寝具", "椅子・座卓・ワードローブ", "洗濯機", "テレビ・チューナーボックス", "冷暖房エアコン", "扇風機・ヒーター", "漫画", "浴衣"], en: ["Bedding", "Chairs, low table & wardrobe", "Washing machine", "TV & tuner box", "Air conditioning / heating", "Fan / heater", "Manga", "Yukata robes"], "zh-Hans": ["床上用品", "椅子・矮桌・衣柜", "洗衣机", "电视及调谐器", "冷暖空调", "电风扇・取暖器", "漫画", "浴衣"], "zh-Hant": ["床上用品", "椅子・矮桌・衣櫃", "洗衣機", "電視及調諧器", "冷暖空調", "電風扇・暖爐", "漫畫", "浴衣"], ko: ["침구", "의자・좌식 테이블・옷장", "세탁기", "TV 및 튜너 박스", "냉난방 에어컨", "선풍기・히터", "만화책", "유카타"] },
        kitchen: { ja: ["エアフライヤー", "電子レンジ", "冷蔵庫", "食器・調理器具", "電気ケトル", "電気コンロ", "炊飯器"], en: ["Air fryer", "Microwave", "Refrigerator", "Tableware & cookware", "Electric kettle", "Electric stove", "Rice cooker"], "zh-Hans": ["空气炸锅", "微波炉", "冰箱", "餐具及厨具", "电热水壶", "电炉", "电饭煲"], "zh-Hant": ["氣炸鍋", "微波爐", "冰箱", "餐具及廚具", "電熱水壺", "電爐", "電子鍋"], ko: ["에어프라이어", "전자레인지", "냉장고", "식기 및 조리도구", "전기 주전자", "전기레인지", "전기밥솥"] },
        bathroom: { ja: ["浴室", "アメニティ", "タオル", "スリッパ", "ドライヤー", "ヘアアイロン"], en: ["Bath", "Toiletries", "Towels", "Slippers", "Hair dryer", "Hair iron"], "zh-Hans": ["浴室", "洗漱用品", "毛巾", "拖鞋", "吹风机", "直发夹"], "zh-Hant": ["浴室", "盥洗用品", "毛巾", "拖鞋", "吹風機", "整髮器"], ko: ["욕실", "어메니티", "수건", "슬리퍼", "헤어드라이어", "헤어아이론"] },
        other: { ja: ["Wi-Fi", "収納スペース", "ゴミ箱", "救急用品", "掃除用具", "掃除機"], en: ["Wi-Fi", "Storage space", "Trash bins", "First aid kit", "Cleaning tools", "Vacuum cleaner"], "zh-Hans": ["Wi-Fi", "收纳空间", "垃圾桶", "急救用品", "清洁用具", "吸尘器"], "zh-Hant": ["Wi-Fi", "收納空間", "垃圾桶", "急救用品", "清潔用具", "吸塵器"], ko: ["Wi-Fi", "수납 공간", "쓰레기통", "구급용품", "청소도구", "청소기"] }
      },
      rules: {
        ja: ["室内は禁煙です。喫煙は3階バルコニーの指定スペースでお願いします。", "パーティーや大きな音を出すご利用はご遠慮ください。"],
        en: ["No smoking indoors — a designated smoking area is provided on the 3F balcony.", "Parties and loud noise are not permitted."],
        "zh-Hans": ["室内禁烟，请在3楼阳台的指定区域吸烟。", "谢绝举办派对或发出大声喧哗等行为。"],
        "zh-Hant": ["室內禁菸，請於3樓陽台的指定區域吸菸。", "謝絕舉辦派對或發出大聲喧嘩等行為。"],
        ko: ["실내는 금연입니다. 흡연은 3층 발코니의 지정 구역에서 부탁드립니다.", "파티 또는 큰 소음을 유발하는 이용은 삼가주시기 바랍니다."]
      },
      guide: { checkin: null, checkout: null, cancellation: null },
      capacityText: {
        ja: "施設情報では1〜6名向けとされています。",
        en: "The property listing describes this stay as suited to 1–6 guests.",
        "zh-Hans": "根据房源信息，本住宿适合1〜6位旅客入住。",
        "zh-Hant": "根據房源資訊，本住宿適合1〜6位旅客入住。",
        ko: "시설 정보에 따르면 1~6인에게 적합한 숙소입니다."
      }
    },

    art: {
      slug: "arthome2025",
      folder: "stay-03_Art Home",
      nameJa: "芸",
      nameEn: "Art Home",
      guideArea: "bay",
      heroImage: "room_picture_1.jpeg",
      images: ["room_picture_1.jpeg", "room_picture_2.jpeg", "room_picture_3.jpeg", "room_picture_4.jpeg", "room_picture_5.jpeg", "room_picture_6.jpeg", "room_picture_7.jpeg", "room_picture_8.jpeg", "room_picture_9.jpeg", "room_picture_10.jpeg", "room_picture_11.jpeg", "room_picture_12.jpeg", "room_picture_13.jpeg", "room_picture_14.jpeg"],
      verified: { address: true, amenities: true, rules: true, map: true, capacity: false },
      tagline: {
        ja: "三先に建つ、四階建てのアートな一棟貸し。",
        en: "A four-storey, art-filled whole house in Misaki.",
        "zh-Hans": "坐落于三先、四层楼的艺术风整栋出租住宅。",
        "zh-Hant": "坐落於三先、四層樓的藝術風整棟出租住宅。",
        ko: "미사키에 자리한 4층 예술적인 독채 숙소."
      },
      summary: {
        ja: "芸（Art Home）は、大阪市港区三先にある四階建ての一棟貸し住宅です。1階は車1台分のガレージとトイレ、喫煙スペース、2階はキッチンと居間・トイレ・浴室、3階は和室と洋室（ダブルベッド）＋バルコニー、4階は和室（お子さま向けの遊び要素あり）と洋室（ダブルベッド）＋バルコニーという構成です。",
        en: "Art Home is a four-storey whole-house rental in Misaki, Minato-ku, Osaka. The ground floor has a one-car garage, a toilet and a smoking area; the 2nd floor has a kitchen, a living room, a toilet and a bathroom; the 3rd floor has a Japanese-style room and a Western-style double room with a balcony; the 4th floor has a Japanese-style room with play features for children and a Western-style double room with a balcony.",
        "zh-Hans": "芸（Art Home）是位于大阪市港区三先、一栋四层楼的整栋出租住宅。1楼为可停1辆车的车库、卫生间与吸烟区；2楼为厨房与客厅、卫生间、浴室；3楼为日式房间与西式房间（双人床）+阳台；4楼为日式房间（设有儿童游戏设施）与西式房间（双人床）+阳台。",
        "zh-Hant": "藝（Art Home）是位於大阪市港區三先、一棟四層樓的整棟出租住宅。1樓為可停1輛車的車庫、廁所與吸菸區；2樓為廚房與客廳、廁所、浴室；3樓為日式房間與西式房間（雙人床）+陽台；4樓為日式房間（設有兒童遊戲設施）與西式房間（雙人床）+陽台。",
        ko: "게이(Art Home)는 오사카시 미나토구 미사키에 위치한 4층짜리 독채 주택입니다. 1층은 차량 1대분 차고와 화장실, 흡연 구역이며, 2층은 주방과 거실・화장실・욕실, 3층은 일본식 방과 서양식 방（더블베드）+발코니, 4층은 일본식 방（어린이용 놀이 시설 포함）과 서양식 방（더블베드）+발코니로 구성되어 있습니다."
      },
      stationText: {
        ja: "朝潮橋駅 徒歩9〜10分・最寄りバス停 徒歩2分",
        en: "9–10 min walk from Asashiobashi Sta. · 2 min walk from the nearest bus stop",
        "zh-Hans": "朝潮桥站 步行9〜10分钟・最近巴士站 步行2分钟",
        "zh-Hant": "朝潮橋站 步行9〜10分鐘・最近公車站 步行2分鐘",
        ko: "아사시오바시역 도보 9~10분・가장 가까운 버스정류장 도보 2분"
      },
      address: {
        ja: "〒552-0016 大阪市港区三先1丁目8-29",
        en: "〒552-0016 大阪市港区三先1丁目8-29",
        "zh-Hans": "〒552-0016 大阪市港区三先1丁目8-29",
        "zh-Hant": "〒552-0016 大阪市港区三先1丁目8-29",
        ko: "〒552-0016 大阪市港区三先1丁目8-29"
      },
      mapUrl: "https://g.co/kgs/KiwQqAm",
      rooms: [
        { floor: { ja: "1F", en: "Ground floor", "zh-Hans": "1楼", "zh-Hant": "1樓", ko: "1층" }, items: { ja: ["ガレージ（車1台分）", "トイレ", "喫煙スペース"], en: ["Garage (one car)", "Toilet", "Smoking area"], "zh-Hans": ["车库（可停1辆车）", "卫生间", "吸烟区"], "zh-Hant": ["車庫（可停1輛車）", "廁所", "吸菸區"], ko: ["차고（차량 1대분）", "화장실", "흡연 구역"] } },
        { floor: { ja: "2F", en: "2F", "zh-Hans": "2F", "zh-Hant": "2F", ko: "2F" }, items: { ja: ["キッチン", "居間", "トイレ", "浴室"], en: ["Kitchen", "Living room", "Toilet", "Bathroom"], "zh-Hans": ["厨房", "客厅", "卫生间", "浴室"], "zh-Hant": ["廚房", "客廳", "廁所", "浴室"], ko: ["주방", "거실", "화장실", "욕실"] } },
        { floor: { ja: "3F", en: "3F", "zh-Hans": "3F", "zh-Hant": "3F", ko: "3F" }, items: { ja: ["和室", "洋室（ダブルベッド）", "バルコニー"], en: ["Japanese-style room", "Western-style room (double bed)", "Balcony"], "zh-Hans": ["日式房间", "西式房间（双人床）", "阳台"], "zh-Hant": ["日式房間", "西式房間（雙人床）", "陽台"], ko: ["일본식 방", "서양식 방（더블베드）", "발코니"] } },
        { floor: { ja: "4F", en: "4F", "zh-Hans": "4F", "zh-Hant": "4F", ko: "4F" }, items: { ja: ["和室（お子さま向け遊び要素あり）", "洋室（ダブルベッド）", "バルコニー"], en: ["Japanese-style room (with play features for children)", "Western-style room (double bed)", "Balcony"], "zh-Hans": ["日式房间（设有儿童游戏设施）", "西式房间（双人床）", "阳台"], "zh-Hant": ["日式房間（設有兒童遊戲設施）", "西式房間（雙人床）", "陽台"], ko: ["일본식 방（어린이용 놀이 시설 포함）", "서양식 방（더블베드）", "발코니"] } }
      ],
      amenities: {
        basic: { ja: ["寝具", "椅子", "座卓", "洗濯機・物干し", "テレビ", "冷暖房エアコン", "扇風機・ヒーター", "アートブック", "浴衣", "照明・防火用品"], en: ["Bedding", "Chairs", "Low table", "Washing machine & drying rack", "TV", "Air conditioning / heating", "Fan / heater", "Art books", "Yukata robes", "Lighting & fire safety equipment"], "zh-Hans": ["床上用品", "椅子", "矮桌", "洗衣机及晾衣架", "电视", "冷暖空调", "电风扇・取暖器", "艺术书籍", "浴衣", "照明及消防用品"], "zh-Hant": ["床上用品", "椅子", "矮桌", "洗衣機及晾衣架", "電視", "冷暖空調", "電風扇・暖爐", "藝術書籍", "浴衣", "照明及消防用品"], ko: ["침구", "의자", "좌식 테이블", "세탁기 및 건조대", "TV", "냉난방 에어컨", "선풍기・히터", "아트북", "유카타", "조명 및 소방 안전용품"] },
        kitchen: { ja: ["エアフライヤー", "電子レンジ", "電気鍋", "冷蔵庫", "食器・調理器具", "電気ケトル", "コーヒーポット", "ガスコンロ"], en: ["Air fryer", "Microwave", "Hot pot / electric cooker", "Refrigerator", "Tableware & cookware", "Electric kettle", "Coffee pot", "Gas stove"], "zh-Hans": ["空气炸锅", "微波炉", "电火锅", "冰箱", "餐具及厨具", "电热水壶", "咖啡壶", "燃气灶"], "zh-Hant": ["氣炸鍋", "微波爐", "電火鍋", "冰箱", "餐具及廚具", "電熱水壺", "咖啡壺", "瓦斯爐"], ko: ["에어프라이어", "전자레인지", "전기냄비", "냉장고", "식기 및 조리도구", "전기 주전자", "커피포트", "가스레인지"] },
        bathroom: { ja: ["浴室", "アメニティ", "タオル・歯ブラシ", "紙製品", "スリッパ", "ドライヤー", "ヘアアイロン"], en: ["Bath", "Toiletries", "Towels & toothbrush", "Paper goods", "Slippers", "Hair dryer", "Hair iron"], "zh-Hans": ["浴室", "洗漱用品", "毛巾及牙刷", "纸制品", "拖鞋", "吹风机", "直发夹"], "zh-Hant": ["浴室", "盥洗用品", "毛巾及牙刷", "紙製品", "拖鞋", "吹風機", "整髮器"], ko: ["욕실", "어메니티", "수건 및 칫솔", "화장지 등 종이용품", "슬리퍼", "헤어드라이어", "헤어아이론"] },
        other: { ja: ["Wi-Fi", "収納スペース", "ゴミ箱", "救急用品", "掃除用具"], en: ["Wi-Fi", "Storage space", "Trash bins", "First aid kit", "Cleaning tools"], "zh-Hans": ["Wi-Fi", "收纳空间", "垃圾桶", "急救用品", "清洁用具"], "zh-Hant": ["Wi-Fi", "收納空間", "垃圾桶", "急救用品", "清潔用具"], ko: ["Wi-Fi", "수납 공간", "쓰레기통", "구급용품", "청소도구"] }
      },
      rules: {
        ja: ["室内は禁煙です。喫煙は指定スペースでお願いします。", "パーティーや大きな音を出すご利用はご遠慮ください。"],
        en: ["No smoking indoors — a designated smoking area is provided.", "Parties and loud noise are not permitted."],
        "zh-Hans": ["室内禁烟，请在指定区域吸烟。", "谢绝举办派对或发出大声喧哗等行为。"],
        "zh-Hant": ["室內禁菸，請於指定區域吸菸。", "謝絕舉辦派對或發出大聲喧嘩等行為。"],
        ko: ["실내는 금연입니다. 흡연은 지정 구역에서 부탁드립니다.", "파티 또는 큰 소음을 유발하는 이용은 삼가주시기 바랍니다."]
      },
      guide: { checkin: null, checkout: null, cancellation: null },
      capacityText: null
    },

    pine: {
      slug: "pine2025",
      folder: "stay-05_Pine Garden",
      nameJa: "松園",
      nameEn: "Pine Garden",
      guideArea: "bay",
      heroImage: "room_picture_1.jpeg",
      images: ["room_picture_1.jpeg", "room_picture_2.jpeg", "room_picture_3.jpeg", "room_picture_4.jpeg", "room_picture_5.jpeg", "room_picture_6.jpeg", "room_picture_7.jpeg", "room_picture_8.jpeg", "room_picture_9.jpeg", "room_picture_10.jpeg"],
      verified: { address: true, amenities: true, rules: true, map: false, capacity: false },
      tagline: {
        ja: "市岡に建つ、三階建ての一棟貸し住宅。",
        en: "A three-storey whole house in Ichioka.",
        "zh-Hans": "坐落于市冈、三层楼的整栋出租住宅。",
        "zh-Hant": "坐落於市岡、三層樓的整棟出租住宅。",
        ko: "이치오카에 자리한 3층 독채 숙소."
      },
      summary: {
        ja: "松園は、大阪市港区市岡にある三階建ての一棟貸し住宅です。1階はガレージ・洗濯機・シャワールーム、2階はキッチン・居間・トイレ・バルコニー（物干し・指定喫煙スペース）、3階はシングルベッド2台＋布団追加可のテーマルームと、ダブルベッドの部屋という構成です。",
        en: "Pine Garden is a three-storey whole-house rental in Ichioka, Minato-ku, Osaka. The ground floor has a garage, a washing machine and a shower room; the 2nd floor has a kitchen, a living room, a toilet and a balcony with a drying area and a designated smoking spot; the 3rd floor has a themed room with two single beds (an extra futon available) and a separate room with a double bed.",
        "zh-Hans": "松园是位于大阪市港区市冈、一栋三层楼的整栋出租住宅。1楼为车库、洗衣机与淋浴间；2楼为厨房、客厅、卫生间与阳台（晾衣区・指定吸烟区）；3楼为配备2张单人床（可加铺被褥）的主题房，以及一间双人床房间。",
        "zh-Hant": "松園是位於大阪市港區市岡、一棟三層樓的整棟出租住宅。1樓為車庫、洗衣機與淋浴間；2樓為廚房、客廳、廁所與陽台（晾衣區・指定吸菸區）；3樓為配備2張單人床（可加鋪被褥）的主題房，以及一間雙人床房間。",
        ko: "쇼엔(Pine Garden)은 오사카시 미나토구 이치오카에 위치한 3층짜리 독채 주택입니다. 1층은 차고・세탁기・샤워실, 2층은 주방・거실・화장실・발코니（건조 구역・지정 흡연구역）, 3층은 싱글베드 2개（이불 추가 가능）가 있는 테마룸과 더블베드 방으로 구성되어 있습니다."
      },
      stationText: {
        ja: "Osaka Metro中央線 弁天町駅 徒歩10〜12分・JR弁天町駅 徒歩14〜16分・最寄りバス停 徒歩3分",
        en: "10–12 min walk from Bentencho Sta. (Osaka Metro Chuo Line) · 14–16 min walk from Bentencho Sta. (JR) · 3 min walk from the nearest bus stop",
        "zh-Hans": "Osaka Metro中央线 弁天町站 步行10〜12分钟・JR弁天町站 步行14〜16分钟・最近巴士站 步行3分钟",
        "zh-Hant": "Osaka Metro中央線 弁天町站 步行10〜12分鐘・JR弁天町站 步行14〜16分鐘・最近公車站 步行3分鐘",
        ko: "오사카 메트로 주오선 벤텐초역 도보 10~12분・JR 벤텐초역 도보 14~16분・가장 가까운 버스정류장 도보 3분"
      },
      address: {
        ja: "〒552-0012 大阪市港区市岡1-16-15",
        en: "〒552-0012 大阪市港区市岡1-16-15",
        "zh-Hans": "〒552-0012 大阪市港区市岡1-16-15",
        "zh-Hant": "〒552-0012 大阪市港区市岡1-16-15",
        ko: "〒552-0012 大阪市港区市岡1-16-15"
      },
      mapUrl: null,
      rooms: [
        { floor: { ja: "1F", en: "Ground floor", "zh-Hans": "1楼", "zh-Hant": "1樓", ko: "1층" }, items: { ja: ["ガレージ", "洗濯機", "シャワールーム"], en: ["Garage", "Washing machine", "Shower room"], "zh-Hans": ["车库", "洗衣机", "淋浴间"], "zh-Hant": ["車庫", "洗衣機", "淋浴間"], ko: ["차고", "세탁기", "샤워실"] } },
        { floor: { ja: "2F", en: "2F", "zh-Hans": "2F", "zh-Hant": "2F", ko: "2F" }, items: { ja: ["キッチン", "居間", "トイレ", "バルコニー（物干し・指定喫煙スペース）"], en: ["Kitchen", "Living room", "Toilet", "Balcony with drying area & designated smoking spot"], "zh-Hans": ["厨房", "客厅", "卫生间", "阳台（晾衣区・指定吸烟区）"], "zh-Hant": ["廚房", "客廳", "廁所", "陽台（晾衣區・指定吸菸區）"], ko: ["주방", "거실", "화장실", "발코니（건조 구역・지정 흡연구역）"] } },
        { floor: { ja: "3F", en: "3F", "zh-Hans": "3F", "zh-Hant": "3F", ko: "3F" }, items: { ja: ["テーマルーム（シングルベッド×2、布団追加可）", "ダブルベッドの部屋"], en: ["Themed room (two single beds, extra futon available)", "Room with a double bed"], "zh-Hans": ["主题房（单人床×2，可加铺被褥）", "双人床房间"], "zh-Hant": ["主題房（單人床×2，可加鋪被褥）", "雙人床房間"], ko: ["테마룸（싱글베드×2, 이불 추가 가능）", "더블베드 방"] } }
      ],
      amenities: {
        basic: { ja: ["寝具", "椅子", "座卓", "洗濯機・物干し", "テレビ", "冷暖房エアコン", "扇風機・ヒーター", "漫画・旅行ガイド", "浴衣", "照明・防火用品"], en: ["Bedding", "Chairs", "Low table", "Washing machine & drying rack", "TV", "Air conditioning / heating", "Fan / heater", "Manga & travel books", "Yukata robes", "Lighting & fire safety equipment"], "zh-Hans": ["床上用品", "椅子", "矮桌", "洗衣机及晾衣架", "电视", "冷暖空调", "电风扇・取暖器", "漫画及旅行指南", "浴衣", "照明及消防用品"], "zh-Hant": ["床上用品", "椅子", "矮桌", "洗衣機及晾衣架", "電視", "冷暖空調", "電風扇・暖爐", "漫畫及旅遊指南", "浴衣", "照明及消防用品"], ko: ["침구", "의자", "좌식 테이블", "세탁기 및 건조대", "TV", "냉난방 에어컨", "선풍기・히터", "만화책 및 여행 가이드북", "유카타", "조명 및 소방 안전용품"] },
        kitchen: { ja: ["エアフライヤー", "電子レンジ", "冷蔵庫", "食器・調理器具", "電気ケトル", "電気コンロ"], en: ["Air fryer", "Microwave", "Refrigerator", "Tableware & cookware", "Electric kettle", "Electric stove"], "zh-Hans": ["空气炸锅", "微波炉", "冰箱", "餐具及厨具", "电热水壶", "电炉"], "zh-Hant": ["氣炸鍋", "微波爐", "冰箱", "餐具及廚具", "電熱水壺", "電爐"], ko: ["에어프라이어", "전자레인지", "냉장고", "식기 및 조리도구", "전기 주전자", "전기레인지"] },
        bathroom: { ja: ["シャワー", "洗面台", "トイレ", "アメニティ", "タオル・歯ブラシ", "紙製品", "スリッパ", "鏡", "ドライヤー", "ヘアアイロン"], en: ["Shower", "Wash basin", "Toilet", "Toiletries", "Towels & toothbrush", "Paper goods", "Slippers", "Mirror", "Hair dryer", "Hair iron"], "zh-Hans": ["淋浴", "洗手台", "卫生间", "洗漱用品", "毛巾及牙刷", "纸制品", "拖鞋", "镜子", "吹风机", "直发夹"], "zh-Hant": ["淋浴", "洗手台", "廁所", "盥洗用品", "毛巾及牙刷", "紙製品", "拖鞋", "鏡子", "吹風機", "整髮器"], ko: ["샤워실", "세면대", "화장실", "어메니티", "수건 및 칫솔", "화장지 등 종이용품", "슬리퍼", "거울", "헤어드라이어", "헤어아이론"] },
        other: { ja: ["Wi-Fi", "収納スペース", "ゴミ箱", "救急用品", "掃除用具", "掃除機"], en: ["Wi-Fi", "Storage space", "Trash bins", "First aid kit", "Cleaning tools", "Vacuum cleaner"], "zh-Hans": ["Wi-Fi", "收纳空间", "垃圾桶", "急救用品", "清洁用具", "吸尘器"], "zh-Hant": ["Wi-Fi", "收納空間", "垃圾桶", "急救用品", "清潔用具", "吸塵器"], ko: ["Wi-Fi", "수납 공간", "쓰레기통", "구급용품", "청소도구", "청소기"] }
      },
      rules: {
        ja: ["室内は禁煙です。喫煙は2階バルコニーの指定スペースでお願いします。", "パーティーや大きな音を出すご利用はご遠慮ください。"],
        en: ["No smoking indoors — a designated smoking area is provided on the 2F balcony.", "Parties and loud noise are not permitted."],
        "zh-Hans": ["室内禁烟，请在2楼阳台的指定区域吸烟。", "谢绝举办派对或发出大声喧哗等行为。"],
        "zh-Hant": ["室內禁菸，請於2樓陽台的指定區域吸菸。", "謝絕舉辦派對或發出大聲喧嘩等行為。"],
        ko: ["실내는 금연입니다. 흡연은 2층 발코니의 지정 구역에서 부탁드립니다.", "파티 또는 큰 소음을 유발하는 이용은 삼가주시기 바랍니다."]
      },
      guide: {
        checkin: {
          ja: "施設情報では15時以降とされています。",
          en: "The property listing states check-in from 3:00 PM.",
          "zh-Hans": "根据房源信息，入住时间为15:00以后。",
          "zh-Hant": "根據房源資訊，入住時間為15:00以後。",
          ko: "시설 정보에 따르면 체크인은 오후 3시 이후입니다."
        },
        checkout: null,
        cancellation: null
      },
      capacityText: {
        ja: "施設情報では1〜5名向けとされています。",
        en: "The property listing describes this stay as suited to 1–5 guests.",
        "zh-Hans": "根据房源信息，本住宿适合1〜5位旅客入住。",
        "zh-Hant": "根據房源資訊，本住宿適合1〜5位旅客入住。",
        ko: "시설 정보에 따르면 1~5인에게 적합한 숙소입니다."
      }
    },

    harmony: {
      slug: "2026harmony",
      folder: "stay-07_Harmony Garden",
      nameJa: "和の園",
      nameEn: "Harmony Garden",
      guideArea: "bay",
      heroImage: "room_picture_1.jpeg",
      images: ["room_picture_1.jpeg", "room_picture_2.jpeg", "room_picture_3.jpeg", "room_picture_4.jpeg", "room_picture_5.jpeg", "room_picture_6.jpeg", "room_picture_7.jpeg", "room_picture_8.jpeg", "room_picture_9.jpeg"],
      verified: { address: false, amenities: false, rules: false, map: true, capacity: false },
      tagline: {
        ja: "弁天町エリアに佇む一棟貸しの宿。",
        en: "A whole-house stay in the Bentencho area.",
        "zh-Hans": "坐落于弁天町一带的整栋出租住宅。",
        "zh-Hant": "坐落於弁天町一帶的整棟出租住宅。",
        ko: "벤텐초 지역에 자리한 독채 숙소."
      },
      summary: {
        ja: "和の園は、大阪市の弁天町エリアにある一棟貸しの宿です。難波・心斎橋・梅田へ直通するバス停から徒歩2分と、市内中心部へのアクセスに恵まれています。お部屋や設備の詳しい情報は現在確認中のため、実際の写真とあわせてAirbnbの施設ページでご確認ください。",
        en: "Harmony Garden is a whole-house stay in the Bentencho area of Osaka, 2 minutes on foot from a bus stop with direct routes to Namba, Shinsaibashi and Umeda. Detailed room and amenity information for this property is still being confirmed — please refer to the actual photos here alongside the Airbnb listing.",
        "zh-Hans": "和之园是位于大阪市弁天町一带的整栋出租住宿。距离可直达难波・心斋桥・梅田的巴士站仅步行2分钟，前往市中心交通十分便利。有关房间与设备的详细信息目前仍在确认中，敬请参考本页实际照片，并至Airbnb房源页面确认详情。",
        "zh-Hant": "和之園是位於大阪市弁天町一帶的整棟出租住宿。距離可直達難波・心齋橋・梅田的公車站僅步行2分鐘，前往市中心交通十分便利。有關房間與設備的詳細資訊目前仍在確認中，敬請參考本頁實際照片，並至Airbnb房源頁面確認詳情。",
        ko: "와노소노(Harmony Garden)는 오사카시 벤텐초 지역에 위치한 독채 숙소입니다. 난바・신사이바시・우메다로 직행하는 버스정류장에서 도보 2분 거리에 있어 시내 중심부로의 접근성이 뛰어납니다. 객실 및 설비에 대한 자세한 정보는 현재 확인 중이므로, 실제 사진과 함께 Airbnb 숙소 페이지에서 확인해 주시기 바랍니다."
      },
      stationText: {
        ja: "最寄りバス停 徒歩2分（難波・心斎橋・梅田へ直通）・弁天町駅 徒歩13分・JR弁天町駅 徒歩18分",
        en: "2 min walk to the nearest bus stop (direct routes to Namba, Shinsaibashi and Umeda) · 13 min walk from Bentencho Sta. · 18 min walk from Bentencho Sta. (JR)",
        "zh-Hans": "最近巴士站 步行2分钟（直达难波・心斋桥・梅田）・弁天町站 步行13分钟・JR弁天町站 步行18分钟",
        "zh-Hant": "最近公車站 步行2分鐘（直達難波・心齋橋・梅田）・弁天町站 步行13分鐘・JR弁天町站 步行18分鐘",
        ko: "가장 가까운 버스정류장 도보 2분（난바・신사이바시・우메다 직행）・벤텐초역 도보 13분・JR 벤텐초역 도보 18분"
      },
      address: null,
      mapUrl: "https://share.google/GdpTokWS5t99RRBBL",
      rooms: [],
      amenities: null,
      rules: null,
      guide: { checkin: null, checkout: null, cancellation: null },
      capacityText: null
    },

    furukawa: {
      slug: "furukawa",
      folder: "stay-06_Furukawa House",
      nameJa: "古川の家",
      nameEn: "Furukawa House",
      guideArea: "kaizuka",
      heroImage: "room_picture_1.jpeg",
      images: ["room_picture_1.jpeg", "room_picture_2.jpeg", "room_picture_3.jpeg", "room_picture_4.jpeg", "room_picture_5.jpeg", "room_picture_6.jpeg", "room_picture_7.jpeg", "room_picture_8.jpeg", "room_picture_9.jpeg", "room_picture_10.jpeg", "room_picture_11.jpeg", "room_picture_12.jpeg", "room_picture_13.jpeg", "room_picture_14.jpeg"],
      verified: { address: true, amenities: false, rules: false, map: true, capacity: false },
      tagline: {
        ja: "貝塚・三ツ松に佇む一棟貸しの古民家。",
        en: "A whole-house old home in Mitsumatsu, Kaizuka.",
        "zh-Hans": "坐落于贝冢三ツ松的整栋出租老屋。",
        "zh-Hant": "坐落於貝塚三ツ松的整棟出租老屋。",
        ko: "가이즈카 미츠마츠에 자리한 독채 고택."
      },
      summary: {
        ja: "古川の家は、大阪府貝塚市三ツ松エリアにある一棟貸しの宿です。三ツ松駅から徒歩2〜3分、水間寺にも近く、関西空港やりんくうプレミアム・アウトレットへも車で約30分とされています。お部屋や設備の詳しい情報は現在確認中のため、実際の写真とあわせてAirbnbの施設ページでご確認ください。",
        en: "Furukawa House is a whole-house stay in the Mitsumatsu area of Kaizuka, Osaka Prefecture, 2–3 minutes on foot from Mitsumatsu Station and close to Mizuma-dera Temple, with Kansai Airport and Rinku Premium Outlets said to be about 30 minutes away by car. Detailed room and amenity information for this property is still being confirmed — please refer to the actual photos here alongside the Airbnb listing.",
        "zh-Hans": "古川之家是位于大阪府贝冢市三ツ松一带的整栋出租住宿。距三ツ松站步行2〜3分钟，邻近水间寺，驾车前往关西机场及临空Premium Outlets约需30分钟。有关房间与设备的详细信息目前仍在确认中，敬请参考本页实际照片，并至Airbnb房源页面确认详情。",
        "zh-Hant": "古川之家是位於大阪府貝塚市三ツ松一帶的整棟出租住宿。距三ツ松站步行2〜3分鐘，鄰近水間寺，開車前往關西機場及臨空Premium Outlets約需30分鐘。有關房間與設備的詳細資訊目前仍在確認中，敬請參考本頁實際照片，並至Airbnb房源頁面確認詳情。",
        ko: "후루카와노이에(Furukawa House)는 오사카부 가이즈카시 미츠마츠 지역에 위치한 독채 숙소입니다. 미츠마츠역에서 도보 2~3분 거리이며 미즈마데라 사원과도 가깝고, 간사이 공항 및 린쿠 프리미엄 아울렛까지 차로 약 30분 거리에 있습니다. 객실 및 설비에 대한 자세한 정보는 현재 확인 중이므로, 실제 사진과 함께 Airbnb 숙소 페이지에서 확인해 주시기 바랍니다."
      },
      stationText: {
        ja: "三ツ松駅 徒歩2〜3分・水間寺近く・関西空港/りんくうプレミアム・アウトレットへ車で約30分（施設情報より）",
        en: "2–3 min walk from Mitsumatsu Sta. · near Mizuma-dera Temple · about 30 min by car to Kansai Airport / Rinku Premium Outlets (per the property listing)",
        "zh-Hans": "三ツ松站 步行2〜3分钟・邻近水间寺・驾车约30分钟可达关西机场／临空Premium Outlets（依据房源信息）",
        "zh-Hant": "三ツ松站 步行2〜3分鐘・鄰近水間寺・開車約30分鐘可達關西機場／臨空Premium Outlets（依房源資訊）",
        ko: "미츠마츠역 도보 2~3분・미즈마데라 사원 인근・간사이 공항/린쿠 프리미엄 아울렛까지 차로 약 30분（시설 정보 기준）"
      },
      address: {
        ja: "大阪府貝塚市三ツ松1060",
        en: "大阪府貝塚市三ツ松1060",
        "zh-Hans": "大阪府貝塚市三ツ松1060",
        "zh-Hant": "大阪府貝塚市三ツ松1060",
        ko: "大阪府貝塚市三ツ松1060"
      },
      mapUrl: "https://share.google/hdlnt0XLOAJY9txUy",
      rooms: [],
      amenities: null,
      rules: null,
      guide: { checkin: null, checkout: null, cancellation: null },
      capacityText: null
    }

  };

  /* Osaka Guide teaser shown on each detail page (see stay-detail.js
     renderGuideTeaser). Each stay's `guideArea` above picks one entry.
     `anchor` is the section id on tour-guide.html; `areaKeys` are the
     i18n keys of the guide areas named in the teaser label; `image` is
     relative to the site root. Location relationships are deliberately
     conservative (brief-supplied) — do not add travel times here. */
  var guideAreas = {
    south: {
      anchor: "shinsekai",
      areaKeys: ["guidePage.area.shinsekai.name", "guidePage.area.namba.name"],
      textKey: "stayTeaser.south.text",
      image: "assets/osaka/streetscape_1.jpg",
      imageAltKey: "experience.image1Alt"
    },
    bay: {
      anchor: "bay",
      areaKeys: ["guidePage.area.bay.name"],
      textKey: "stayTeaser.bay.text",
      image: "assets/osaka/USJ.jpeg",
      imageAltKey: "guidePage.area.bay.imageAlt"
    },
    kaizuka: {
      anchor: "kaizuka",
      areaKeys: ["guidePage.area.kaizuka.name"],
      textKey: "stayTeaser.kaizuka.text",
      image: "assets/properties/stay-06_Furukawa House/room_picture_1.jpeg",
      imageAltKey: "guidePage.area.kaizuka.imageAlt"
    }
  };

  window.YuseiStayData = {
    stays: stays,
    guideAreas: guideAreas,
    pick: pick,
    pickList: pickList
  };
})();
