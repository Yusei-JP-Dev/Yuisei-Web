/* ============================================================
   Yusei Stay — Osaka Guide data (tour-guide.html)

   One entry per stay, keyed by the same ids as js/stay-data.js
   (tea, zen, pine, literature, harmony, art, furukawa). The guide
   treats the selected stay as the fixed home base for the whole
   trip: every time below starts from (or returns to) that stay.

   Source: the owner's guide document "Yusei Stay 各民宿周邊景點攻略"
   dated 2026-09-24 (times checked by the owner on Google Maps that
   day, plus the stays' own Word introductions and posters). See
   docs/guide-update.md. Nothing here was independently re-checked,
   and nothing may be added that is not in that document.

   Time entries — { mode, t, unit, from, src }:
     mode  walk | drive | train | bus | taxi
     t     approximate minutes (or hours with unit: "h"); null = the
           source gives no time, so none is shown
     from  "stay"    door-to-door from the stay
           "station" from the named station (`station` = place id);
                     the walk from the stay to that station is NOT
                     included and the page says so
           "poster"  promotional poster figure; its starting point is
                     not stated, and the page says so
     src   gm (owner's Google Maps check) | gmNear (Google Maps result
           of a neighbouring stay, `srcStay`) | doc (owner's document
           text, not re-checked) | poster | web (rail sites cited in
           the source document)

   Addresses and shop names are kept exactly as listed in the
   source (Japanese / romanised), in every language.
   ============================================================ */

(function () {
  "use strict";

  function L(ja, en, hans, hant, ko) {
    return { ja: ja, en: en, "zh-Hans": hans, "zh-Hant": hant, ko: ko };
  }

  /* ---- Places: display name + Google Maps destination query ----
     query null = no reliable pin, so no map link is rendered. */
  var places = {
    bentenchoSta: { name: L("弁天町駅", "Bentencho Station", "弁天町站", "弁天町站", "벤텐초역"), query: "弁天町駅" },
    ichiokaBus: { name: L("市岡バス停", "Ichioka bus stop", "市冈巴士站", "市岡公車站", "이치오카 버스정류장"), query: null },
    kuyakushoBus: { name: L("港区役所前バス停", "Minato Ward Office bus stop", "港区役所前巴士站", "港區役所前公車站", "미나토구청 앞 버스정류장"), query: null },
    artBus: { name: L("夕凪バス停", "Yunagi bus stop", "夕凪巴士站", "夕凪公車站", "유나기 버스정류장"), query: "夕凪バス停 大阪市港区" },
    asashiobashiSta: { name: L("朝潮橋駅（Osaka Metro中央線）", "Asashiobashi Station (Osaka Metro Chuo Line)", "朝潮桥站（Osaka Metro中央线）", "朝潮橋站（Osaka Metro中央線）", "아사시오바시역（오사카 메트로 주오선）"), query: "朝潮橋駅" },
    hanazonochoSta: { name: L("花園町駅（Osaka Metro四つ橋線）", "Hanazonocho Station (Osaka Metro Yotsubashi Line)", "花园町站（Osaka Metro四つ桥线）", "花園町站（Osaka Metro四つ橋線）", "하나조노초역（오사카 메트로 요츠바시선）"), query: "花園町駅 大阪" },
    tengachayaSta: { name: L("天下茶屋駅（南海線・関西空港へ直通）", "Tengachaya Station (Nankai Line, direct to Kansai Airport)", "天下茶屋站（南海线・直达关西机场）", "天下茶屋站（南海線・直達關西機場）", "텐가차야역（난카이선・간사이 공항 직행）"), query: "天下茶屋駅" },
    mitsumatsuSta: { name: L("三ツ松駅（水間鉄道）", "Mitsumatsu Station (Mizuma Railway)", "三ツ松站（水间铁道）", "三ツ松站（水間鐵道）", "미츠마츠역（미즈마 철도）"), query: "三ツ松駅 貝塚" },
    namba: { name: L("難波", "Namba", "难波", "難波", "난바"), query: "なんば駅 大阪" },
    umeda: { name: L("梅田（大阪駅）", "Umeda (Osaka Station)", "梅田（大阪站）", "梅田（大阪站）", "우메다（오사카역）"), query: "大阪駅" },
    kix: { name: L("関西国際空港", "Kansai International Airport", "关西国际机场", "關西國際機場", "간사이 국제공항"), query: "関西国際空港" },
    kaiyukan: { name: L("海遊館", "Osaka Aquarium Kaiyukan", "海游馆", "海遊館", "가이유칸 수족관"), query: "海遊館" },
    usj: { name: L("ユニバーサル・スタジオ・ジャパン", "Universal Studios Japan", "日本环球影城", "日本環球影城", "유니버설 스튜디오 재팬"), query: "ユニバーサル・スタジオ・ジャパン" },
    tsutenkaku: { name: L("通天閣・新世界・天王寺", "Tsutenkaku, Shinsekai & Tennoji", "通天阁・新世界・天王寺", "通天閣・新世界・天王寺", "츠텐카쿠・신세카이・텐노지"), query: "通天閣" },
    shinsaibashi: { name: L("心斎橋・道頓堀", "Shinsaibashi & Dotonbori", "心斋桥・道顿堀", "心齋橋・道頓堀", "신사이바시・도톤보리"), query: "心斎橋" },
    osakajo: { name: L("大阪城公園", "Osaka Castle Park", "大阪城公园", "大阪城公園", "오사카성 공원"), query: "大阪城公園" },
    soraniwa: { name: L("空庭温泉（弁天町駅）", "Soraniwa Onsen (at Bentencho Station)", "空庭温泉（弁天町站）", "空庭溫泉（弁天町站）", "소라니와 온천（벤텐초역）"), query: "空庭温泉 OSAKA BAY TOWER" },
    aeonDome: { name: L("イオンモール大阪ドームシティ・京セラドーム大阪", "AEON Mall Osaka Dome City & Kyocera Dome Osaka", "永旺梦乐城大阪巨蛋城・京瓷巨蛋大阪", "永旺夢樂城大阪巨蛋城・京瓷巨蛋大阪", "이온몰 오사카 돔 시티・교세라 돔 오사카"), query: "イオンモール大阪ドームシティ" },
    misakiTenmangu: { name: L("三先天満宮", "Misaki Tenmangu Shrine", "三先天满宫", "三先天滿宮", "미사키 텐만구"), query: "三先天満宮 大阪市港区三先1-5-40" },
    tempozanWheel: { name: L("天保山の観覧車", "Ferris wheel at Tempozan", "天保山摩天轮", "天保山摩天輪", "텐포잔 대관람차"), query: "天保山大観覧車" },
    legoland: { name: L("レゴランド・ディスカバリー・センター大阪", "LEGOLAND Discovery Center Osaka", "大阪乐高探索中心", "大阪樂高探索中心", "레고랜드 디스커버리 센터 오사카"), query: "レゴランド・ディスカバリー・センター大阪" },
    mizumadera: { name: L("水間寺（水間観音）", "Mizuma-dera Temple (Mizuma Kannon)", "水间寺（水间观音）", "水間寺（水間觀音）", "미즈마데라（미즈마 관음）"), query: "水間寺" },
    misasaOnsen: { name: L("積善温泉 美笹のゆ", "Sekizen Onsen Misasa no Yu", "积善温泉 美笹之汤", "積善溫泉 美笹之湯", "세키젠 온천 미사사노유"), query: "天然温泉 美笹のゆ 大阪府貝塚市橋本991-1" },
    rinku: { name: L("りんくうプレミアム・アウトレット", "Rinku Premium Outlets", "临空Premium Outlets", "臨空Premium Outlets", "린쿠 프리미엄 아울렛"), query: "りんくうプレミアム・アウトレット" },
    gansenji: { name: L("願泉寺", "Gansen-ji Temple", "愿泉寺", "願泉寺", "간센지"), query: "願泉寺 貝塚市" },
    kouonji: { name: L("孝恩寺", "Koon-ji Temple", "孝恩寺", "孝恩寺", "고온지"), query: "孝恩寺 貝塚市" },
    gyokyo: { name: L("漁協青空市場", "Fishermen's co-op open-air market", "渔协青空市场", "漁協青空市場", "어협 아오조라 시장"), query: "漁協青空市場" },
    wakayama: { name: L("和歌山", "Wakayama", "和歌山", "和歌山", "와카야마"), query: "和歌山駅" },
    nara: { name: L("奈良", "Nara", "奈良", "奈良", "나라"), query: "近鉄奈良駅" },
    kyoto: { name: L("京都", "Kyoto", "京都", "京都", "교토"), query: "京都駅" },
    kobe: { name: L("神戸（三宮）", "Kobe (Sannomiya)", "神户（三宫）", "神戶（三宮）", "고베（산노미야）"), query: "三ノ宮駅" },
    arima: { name: L("有馬温泉", "Arima Onsen", "有马温泉", "有馬溫泉", "아리마 온천"), query: "有馬温泉" },
    awaji: { name: L("淡路島", "Awaji Island", "淡路岛", "淡路島", "아와지시마"), query: "淡路島" }
  };

  /* ---- Reusable route descriptions ---- */
  var routes = {
    bentenKaiyukan: L(
      "地下鉄中央線で大阪港駅へ（2〜3駅）、駅から徒歩約5分",
      "Chuo Line subway to Osakako Station (2–3 stops), then about 5 min on foot",
      "乘地铁中央线到大阪港站（2〜3站），出站步行约5分钟",
      "搭地鐵中央線到大阪港站（2〜3站），出站步行約5分鐘",
      "지하철 주오선으로 오사카코역까지（2~3정거장）, 역에서 도보 약 5분"
    ),
    bentenUsj: L(
      "JRで西九条駅へ、JR桜島線（ゆめ咲線）に乗り換えてユニバーサルシティ駅へ",
      "JR to Nishikujo, then change to the JR Sakurajima Line for Universal City Station",
      "乘JR到西九条站，换乘JR樱岛线到Universal City站",
      "搭JR到西九條站，轉乘JR櫻島線到Universal City站",
      "JR로 니시쿠조역까지, JR 사쿠라지마선으로 갈아타 유니버설시티역까지"
    ),
    bentenOsakajo: L(
      "地下鉄中央線で森ノ宮駅へ",
      "Chuo Line subway to Morinomiya Station",
      "乘地铁中央线到森之宫站",
      "搭地鐵中央線到森之宮站",
      "지하철 주오선으로 모리노미야역까지"
    ),
    asashioKaiyukan: L(
      "中央線で1駅の大阪港駅へ、駅から徒歩約5分",
      "One stop on the Chuo Line to Osakako Station, then about 5 min on foot",
      "乘中央线1站到大阪港站，出站步行约5分钟",
      "搭中央線1站到大阪港站，出站步行約5分鐘",
      "주오선으로 1정거장인 오사카코역까지, 역에서 도보 약 5분"
    )
  };

  /* ---- Nearby restaurant lists (names/addresses verbatim) ---- */
  var restaurants = {
    bentencho: [
      { name: "ふる里 Furusato", address: "2 Chome-1-8 Isoji" },
      { name: "手打うどん きぬや食堂", address: "3 Chome-11-22 Minamiichioka" },
      { name: "みの八 Minohachi", address: "港区市岡元町3-13-1" },
      { name: "大輪（居酒屋）", address: "港区市岡1-5-20" },
      { name: "なかよし家", address: "Isoji 1 Chome−3−19" },
      { name: "居間蔵屋", address: "3 Chome-15-6 Isoji" },
      { name: "炭火焼鳥 とりだん 市岡店", address: "1 Chome-4-24 Ichioka" },
      { name: "赤丸食堂 Akamaru Shokudo", address: "2 Chome-6-3 Isoji" },
      { name: "元祖 札幌や", address: "1 Chome-4-23 Ichioka" },
      { name: "はなみち 市岡店", address: "1 Chome-4-27 Ichioka" },
      { name: "モスバーガー 市岡みなと通り店", address: "1 Chome-5-24 Ichioka" },
      { name: "Mon Doux Vie", address: "1 Chome−6−4 Ichioka" },
      { name: "長栄堂", address: "1 Chome-1-10 Ichioka" }
    ],
    /* Art Home: ratings and opening hours are deliberately not
       published. Owner-supplied Google Maps links are used when
       available; otherwise the renderer builds a name/address search. */
    art: [
      { name: "Goodman", address: null, kind: L("鉄板焼き（豚肉）", "Teppanyaki (pork)", "铁板烧（猪肉）", "鐵板燒（豬肉）", "철판구이（돼지고기）"), areaQuery: "大阪市港区三先" },
      { name: "Yakitori Minamimisaki", address: null, kind: L("焼き鳥", "Yakitori", "烤鸡串", "烤雞串", "야키토리"), areaQuery: "大阪市港区三先" },
      { name: "Misaki Nikuyakiya", address: null, kind: L("焼肉", "Yakiniku", "烤肉", "燒肉", "야키니쿠"), areaQuery: "大阪市港区三先" },
      {
        name: "居間蔵屋",
        address: "3 Chome-15-6 Isoji, Minato Ward, Osaka, 552-0003",
        kind: L("磯路にある地元の寿司店。落ち着いて日本の寿司を楽しみたい日に立ち寄れる一軒です。", "A neighbourhood sushi restaurant in Isoji, suited to a relaxed local Japanese meal.", "位于矶路的社区寿司店，适合想悠闲品尝地道日本寿司的旅客。", "位於磯路的社區壽司店，適合想悠閒品嘗地道日本壽司的旅客。", "이소지에 자리한 동네 스시집으로, 편안한 분위기에서 일본 스시를 즐기기 좋습니다."),
        mapUrl: "https://maps.app.goo.gl/7eFnhhwD5NMiawEJ9"
      },
      {
        name: "ふる里 Furusato",
        address: "2 Chome-1-8 Isoji, Minato Ward, Osaka",
        kind: L("新鮮な活魚や伊勢海老料理を味わえる海鮮料理店。家族やグループで大阪の魚料理を楽しみたい時に向いています。", "A seafood restaurant known for fresh live fish and spiny lobster dishes, suitable for families and groups.", "以新鲜活鱼和伊势龙虾料理见长的海鲜餐厅，适合家庭或多人一起用餐。", "以新鮮活魚和伊勢龍蝦料理見長的海鮮餐廳，適合家庭或多人一起用餐。", "신선한 활어와 닭새우 요리로 알려진 해산물 식당으로, 가족이나 단체 식사에 잘 어울립니다.")
      },
      {
        name: "大輪（居酒屋）",
        address: "大阪市港区市岡1-5-20",
        kind: L("市岡にある地元の居酒屋。観光のあとに、地域の日常に触れながら食事とお酒を楽しめます。", "A local izakaya in Ichioka for an easygoing meal and drinks after a day of sightseeing.", "位于市冈的社区居酒屋，适合观光后轻松享用料理与酒饮。", "位於市岡的社區居酒屋，適合觀光後輕鬆享用料理與酒飲。", "이치오카의 동네 이자카야로, 관광을 마친 뒤 편하게 음식과 술을 즐기기 좋습니다."),
        mapUrl: "https://g.co/kgs/dzX8ny6"
      },
      {
        name: "なかよし家",
        address: "Osaka, Minato Ward, Isoji, 1 Chome-3-19, Global 86",
        kind: L("海鮮、串揚げ、鍋などを気軽に楽しめる居酒屋。料理の種類が多く、仲間との夕食にも選びやすいお店です。", "A friendly izakaya serving seafood, kushikatsu and hot-pot dishes, with plenty of choices for a shared evening meal.", "供应海鲜、炸串和锅物等料理的居酒屋，菜式丰富，适合与亲友共享晚餐。", "供應海鮮、炸串和鍋物等料理的居酒屋，菜式豐富，適合與親友共享晚餐。", "해산물, 꼬치튀김, 전골 등을 편하게 즐길 수 있는 이자카야로, 함께 나누는 저녁 식사에 좋습니다."),
        mapUrl: "https://maps.app.goo.gl/zjJpos4BFJv7Wry97"
      },
      {
        name: "赤丸食堂 Akamaru Shokudo",
        address: "2 Chome-6-3 Isoji, Minato Ward, Osaka, 552-0003",
        kind: L("昭和20年創業の地元食堂。名物のボリュームあるチキンカツをはじめ、昔ながらの食堂メニューを楽しめます。", "A long-running local diner founded in 1945, known for hearty classics including its substantial chicken cutlet.", "创立于1945年的老字号社区食堂，以份量十足的炸鸡排等传统食堂料理闻名。", "創立於1945年的老字號社區食堂，以份量十足的炸雞排等傳統食堂料理聞名。", "1945년에 문을 연 오랜 동네 식당으로, 푸짐한 치킨가스를 비롯한 전통 식당 메뉴로 유명합니다."),
        mapUrl: "https://maps.app.goo.gl/DEAeqgr3dd1gBBc8A"
      },
      {
        name: "元祖 札幌や Ganso Sapporo-ya",
        address: "1 Chome-4-23 Ichioka, Minato Ward, Osaka, 552-0012",
        kind: L("ラーメンと、皮から手作りする餃子が人気の老舗。気軽な夕食や、餃子をつまみたい時に立ち寄れます。", "A long-established ramen shop especially known for handmade-from-scratch gyoza, ideal for a casual meal.", "老字号拉面店，尤以从面皮开始手工制作的饺子闻名，适合轻松用餐。", "老字號拉麵店，尤以從麵皮開始手工製作的餃子聞名，適合輕鬆用餐。", "라멘과 피부터 직접 만드는 수제 교자로 알려진 오래된 가게로, 가볍게 식사하기 좋습니다."),
        mapUrl: "https://maps.app.goo.gl/FeoVFBuWNLt6foBx7"
      },
      {
        name: "麺匠はなみち 市岡店 Hanamichi Ichioka",
        address: "1 Chome-4-27 Ichioka, Minato Ward, Osaka, 552-0012",
        kind: L("市岡で気軽に立ち寄れるラーメン店。温かい麺料理で手早く食事を済ませたい時にも便利です。", "A casual ramen stop in Ichioka, convenient when you want a warm and straightforward noodle meal.", "位于市冈、可以轻松前往的拉面店，适合想简单享用一碗热面时到访。", "位於市岡、可以輕鬆前往的拉麵店，適合想簡單享用一碗熱麵時到訪。", "이치오카에서 부담 없이 들를 수 있는 라멘집으로, 따뜻한 면 요리를 간단히 즐기고 싶을 때 편리합니다."),
        mapUrl: "https://maps.app.goo.gl/XqAAc2c65312b8dB6"
      }
    ],
    furukawa: [
      {
        name: "和幸寿司 Wako Sushi",
        address: "〒597-0081 大阪府貝塚市麻生中818-24",
        kind: L("大阪湾で獲れた地魚を味わえる貝塚の寿司店。地域ならではの新鮮な魚介を楽しみたい日におすすめです。", "A Kaizuka sushi restaurant serving local fish from Osaka Bay, ideal for tasting fresh regional seafood.", "可品尝大阪湾当地鲜鱼的贝冢寿司店，适合想体验新鲜地方海产的旅客。", "可品嚐大阪灣當地鮮魚的貝塚壽司店，適合想體驗新鮮地方海產的旅客。", "오사카만에서 잡은 지역 생선을 맛볼 수 있는 가이즈카의 스시집으로, 신선한 현지 해산물을 즐기기 좋습니다."),
        mapUrl: "https://maps.app.goo.gl/cFxMmL1M7uoRxPgF7"
      },
      {
        name: "恵寿し Megu Sushi",
        address: "大阪府貝塚市三ツ松915-4",
        kind: L("三ツ松にある地域の寿司店。宿の近くで気軽に寿司を楽しみたい時に立ち寄れる一軒です。", "A neighbourhood sushi restaurant in Mitsumatsu, convenient for a relaxed sushi meal close to the stay.", "位于三松的社区寿司店，适合想在住宿附近轻松品尝寿司的旅客。", "位於三松的社區壽司店，適合想在住宿附近輕鬆品嚐壽司的旅客。", "미쓰마쓰에 있는 동네 스시집으로, 숙소 가까이에서 편안하게 스시를 즐기기 좋습니다."),
        mapUrl: "https://share.google/5NJTP96IqUHGAsOP2"
      },
      {
        name: "BOKETTO",
        address: "大阪府貝塚市名越251-1（251-1 Nagose, Kaizuka, Osaka 597-0042）",
        kind: L("観葉植物に囲まれたプラントカフェ。ガレットやクレープ、ランチと一緒に、緑のある空間でゆっくり過ごせます。", "A plant-filled café serving galettes, crêpes and lunch dishes in a relaxed green setting.", "被观叶植物环绕的绿意咖啡店，可在悠闲环境中享用荞麦薄饼、可丽饼和午餐。", "被觀葉植物環繞的綠意咖啡店，可在悠閒環境中享用蕎麥薄餅、可麗餅和午餐。", "관엽식물로 둘러싸인 플랜트 카페로, 편안한 초록빛 공간에서 갈레트와 크레프, 점심 메뉴를 즐길 수 있습니다."),
        mapUrl: "https://share.google/Tpu4u1hVns0kBQ2Mf"
      },
      {
        name: "森の小径 Morinokomichi",
        address: "460 Jizodo, Kaizuka, Osaka 597-005",
        kind: L("ピザ生地、パン、手打ちパスタ、デザートまで丁寧に手作りするレストラン。森の中のような穏やかな雰囲気で食事を楽しめます。", "A restaurant making its pizza dough, bread, handmade pasta and desserts in-house, with a calm woodland feel.", "从披萨面团、面包到手工意面和甜点都用心自制的餐厅，可在如森林般宁静的氛围中用餐。", "從披薩麵團、麵包到手工意麵和甜點都用心自製的餐廳，可在如森林般寧靜的氛圍中用餐。", "피자 도우와 빵, 수제 파스타, 디저트까지 정성껏 직접 만드는 레스토랑으로, 숲속 같은 차분한 분위기에서 식사할 수 있습니다."),
        mapUrl: "https://share.google/9HvofHurXIBfLQ5FB"
      },
      {
        name: "DABOS",
        address: "510-2 Mori, Kaizuka, Osaka 597-0044",
        kind: L("森地区にある昔ながらの喫茶店。レトロな雰囲気の中で、軽食や定食を気軽に楽しめます。", "A retro neighbourhood kissaten in Mori, suited to a casual light meal or set lunch.", "位于森地区的怀旧社区咖啡店，适合在复古氛围中轻松享用简餐或定食。", "位於森地區的懷舊社區咖啡店，適合在復古氛圍中輕鬆享用簡餐或定食。", "모리 지역의 옛 분위기를 간직한 동네 다방으로, 복고풍 공간에서 가벼운 식사나 정식을 즐기기 좋습니다."),
        mapUrl: "https://share.google/Uqw9kXLk4yGpdvjh8"
      },
      {
        name: "一（にのまえ） Ninomae",
        address: "〒597-0104 大阪府貝塚市水間213-1",
        kind: L("水間観音駅近くにある寿司店。落ち着いた空間で、丁寧に仕立てた寿司と日本料理を楽しめます。", "A sushi restaurant near Mizuma Kannon Station, offering carefully prepared sushi and Japanese dishes in a calm setting.", "位于水间观音站附近的寿司店，可在安静舒适的环境中享用精心制作的寿司和日本料理。", "位於水間觀音站附近的壽司店，可在安靜舒適的環境中享用精心製作的壽司和日本料理。", "미즈마칸논역 근처의 스시집으로, 차분한 공간에서 정성껏 만든 스시와 일본 요리를 즐길 수 있습니다."),
        mapUrl: "https://maps.app.goo.gl/gjGp2oBu2buwygqj6"
      },
      {
        name: "Cafe りえぞん水間",
        address: "〒597-0104 大阪府貝塚市水間199",
        kind: L("日本庭園を望む古民家カフェ。静かな和の空間で、ゆっくりランチを楽しめます。", "A renovated old-house café overlooking a Japanese garden, made for a slow lunch in a quiet Japanese setting.", "可眺望日式庭园的古民家咖啡店，适合在宁静的和风空间中悠闲享用午餐。", "可眺望日式庭園的古民家咖啡店，適合在寧靜的和風空間中悠閒享用午餐。", "일본 정원을 바라보는 고민가 카페로, 조용한 일본식 공간에서 여유롭게 점심을 즐길 수 있습니다."),
        mapUrl: "https://maps.app.goo.gl/JchMoNkygzXtBJyG7"
      },
      {
        name: "金胡麻木うどん",
        address: "〒597-0104 大阪府貝塚市水間260",
        kind: L("水間観音駅そばのうどん店。香り豊かな金胡麻を生かしたうどんを気軽に味わえます。", "An udon shop by Mizuma Kannon Station, featuring fragrant golden sesame in its signature noodles.", "位于水间观音站旁的乌冬面店，可轻松品尝以香气浓郁的金芝麻为特色的乌冬面。", "位於水間觀音站旁的烏冬麵店，可輕鬆品嚐以香氣濃郁的金芝麻為特色的烏冬麵。", "미즈마칸논역 옆의 우동집으로, 향긋한 금참깨를 살린 대표 우동을 편하게 맛볼 수 있습니다."),
        mapUrl: "https://maps.app.goo.gl/CFiHd5xaJ5YrC3ue8"
      }
    ]
  };

  /* ---- Everyday facilities ---- */
  function F(label, t) {
    return { label: label, t: t };
  }
  var fac = {
    laundryConbini: L("コインランドリー・コンビニ", "Laundromat & convenience store", "自助洗衣店・便利店", "自助洗衣店・便利商店", "코인 세탁소・편의점"),
    laundry: L("コインランドリー", "Laundromat", "自助洗衣店", "自助洗衣店", "코인 세탁소"),
    conbini: L("コンビニ", "Convenience store", "便利店", "便利商店", "편의점"),
    lawson: L("ローソン（コンビニ）", "Lawson (convenience store)", "罗森（便利店）", "Lawson（便利商店）", "로손（편의점）"),
    kansaiSuper: L("関西スーパー", "Kansai Supermarket", "关西超市", "關西超市", "간사이 슈퍼"),
    life: L("ライフ（スーパー）", "Life (supermarket)", "Life超市", "Life超市", "라이프（슈퍼마켓）"),
    bigSupers: L("大型スーパー（関西スーパー・ライフ）", "Large supermarkets (Kansai Supermarket, Life)", "大型超市（关西超市・Life）", "大型超市（關西超市・Life）", "대형 슈퍼마켓（간사이 슈퍼・라이프）"),
    donki: L("ドン・キホーテ", "Don Quijote", "唐吉诃德", "唐吉訶德", "돈키호테"),
    mcd: L("マクドナルド", "McDonald's", "麦当劳", "麥當勞", "맥도날드"),
    daiso: L("ダイソー（100円ショップ）", "DAISO (100-yen shop)", "大创（百元店）", "大創（百圓商店）", "다이소（100엔 숍）"),
    supermarket: L("スーパー", "Supermarket", "超市", "超市", "슈퍼마켓")
  };

  var bentenchoEateries = L(
    "徒歩2〜10分の範囲に、ラーメン、焼肉、居酒屋、海鮮居酒屋、カフェ、モスバーガー、大阪王将があります。",
    "Within a 2–10 min walk: ramen, yakiniku, izakaya, a seafood izakaya, cafés, MOS Burger and Osaka Ohsho.",
    "步行2〜10分钟范围内有拉面、烤肉、居酒屋、海鲜居酒屋、咖啡店、MOS Burger和大阪王将。",
    "步行2〜10分鐘範圍內有拉麵、燒肉、居酒屋、海鮮居酒屋、咖啡店、MOS Burger和大阪王將。",
    "도보 2~10분 거리에 라멘, 야키니쿠, 이자카야, 해산물 이자카야, 카페, 모스버거, 오사카 오쇼가 있습니다."
  );

  var posterFacilities = L(
    "スーパー、コンビニ、飲食店、居酒屋が歩いて行ける範囲にあります。",
    "Supermarkets, convenience stores, restaurants and izakaya are within walking distance.",
    "超市、便利店、餐厅、居酒屋都在步行范围内。",
    "超市、便利商店、餐廳、居酒屋都在步行範圍內。",
    "슈퍼마켓, 편의점, 음식점, 이자카야가 걸어서 갈 수 있는 거리에 있습니다."
  );

  /* ---- Day trips from Osaka (shared by the six city stays) ----
     `ride` is station-to-station; `total` is the owner's estimate
     from the stay including getting to the big station and changes. */
  var dayTrips = [
    {
      place: "nara",
      route: L("大阪難波駅から近鉄の快速急行で近鉄奈良駅へ", "Kintetsu Rapid Express from Osaka-Namba to Kintetsu-Nara", "从大阪难波站乘近铁快速急行到近铁奈良站", "從大阪難波站搭近鐵快速急行到近鐵奈良站", "오사카난바역에서 긴테쓰 쾌속급행으로 긴테쓰나라역까지"),
      ride: { t: "35–40", unit: "min" },
      total: { south: { t: "1", unit: "h" }, bay: { t: "1–1.25", unit: "h" } }
    },
    {
      place: "kyoto",
      route: L("JR大阪駅から新快速で京都駅へ", "JR Special Rapid from Osaka Station to Kyoto Station", "从JR大阪站乘新快速到京都站", "從JR大阪站搭新快速到京都站", "JR 오사카역에서 신쾌속으로 교토역까지"),
      ride: { t: "30", unit: "min" },
      total: { all: { t: "1–1.25", unit: "h" } }
    },
    {
      place: "kobe",
      route: L("JR大阪駅から新快速で三ノ宮駅へ", "JR Special Rapid from Osaka Station to Sannomiya Station", "从JR大阪站乘新快速到三之宫站", "從JR大阪站搭新快速到三之宮站", "JR 오사카역에서 신쾌속으로 산노미야역까지"),
      ride: { t: "20", unit: "min" },
      total: { all: { t: "45–60", unit: "min" } }
    },
    {
      place: "arima",
      route: L("大阪駅から三宮で乗り換え、または高速バス「有馬エクスプレス」", "From Osaka Station, change at Sannomiya — or take the Arima Express highway bus", "从大阪站经三宫换乘，或乘高速巴士「有马Express」", "從大阪站經三宮轉車，或搭高速巴士「有馬Express」", "오사카역에서 산노미야 환승, 또는 고속버스 '아리마 익스프레스'"),
      ride: { t: "1", unit: "h" },
      total: { all: { t: "1.5", unit: "h" } }
    },
    {
      place: "awaji",
      route: L("車、または大阪駅から高速バス「かけはし号」", "By car, or the Kakehashi highway bus from Osaka Station", "自驾，或从大阪站乘高速巴士「かけはし号」", "開車，或從大阪站搭高速巴士「かけはし號」", "자동차, 또는 오사카역에서 고속버스 '가케하시호'"),
      ride: null,
      rideNote: L("島内の行き先によって異なります", "Depends on where on the island you go", "视乎岛上目的地而定", "視乎島上目的地而定", "섬 안의 목적지에 따라 다릅니다"),
      total: { all: { t: "1.5–2.5", unit: "h" } },
      note: L("高速バスの時刻は事前にご確認ください。", "Please check highway bus times in advance.", "高速巴士班次请提前确认。", "高速巴士班次請提前確認。", "고속버스 시간은 미리 확인해 주세요.")
    }
  ];

  /* ---- Stays ----
     photos: file names inside the stay's assets folder (see
     StayData.folder) for the selector tab and chapter 01. Images
     for chapters 02-05 live in js/guide-images.js. */
  var stays = {

    tea: {
      group: "south",
      originConfirmed: true,
      photos: { tab: "room_picture_1.jpeg", from: "room_picture_1.jpeg" },
      intro: L(
        "花園町駅まで徒歩約6分。地下鉄四つ橋線で難波へは宿から約15分、関西空港へ直通の南海・天下茶屋駅へも徒歩約10分です。通天閣や心斎橋など、大阪の南側の名所に出かけやすい拠点です。",
        "About 6 min on foot to Hanazonocho Station. Namba is about 15 min from the door on the Yotsubashi subway line, and Tengachaya Station — direct trains to Kansai Airport — is about 10 min on foot. A handy base for southern Osaka sights such as Tsutenkaku and Shinsaibashi.",
        "步行约6分钟到花园町站。乘地铁四つ桥线从住宿到难波约15分钟，步行约10分钟即到可直达关西机场的南海天下茶屋站。前往通天阁、心斋桥等大阪南部景点十分方便。",
        "步行約6分鐘到花園町站。搭地鐵四つ橋線從住宿到難波約15分鐘，步行約10分鐘即到可直達關西機場的南海天下茶屋站。前往通天閣、心齋橋等大阪南部景點十分方便。",
        "하나조노초역까지 도보 약 6분. 지하철 요츠바시선으로 숙소에서 난바까지 약 15분, 간사이 공항 직행 난카이 텐가차야역까지 도보 약 10분입니다. 츠텐카쿠, 신사이바시 등 오사카 남쪽 명소로 나가기 편한 거점입니다."
      ),
      access: [
        { place: "hanazonochoSta", ways: [{ mode: "walk", t: "6", from: "stay", src: "gm" }] },
        { place: "namba", ways: [{ mode: "train", t: "15", from: "stay", src: "gm", route: L("花園町駅から四つ橋線で約2駅（約6分間隔）", "About 2 stops on the Yotsubashi Line from Hanazonocho (trains about every 6 min)", "从花园町站乘四つ桥线约2站（约每6分钟一班）", "從花園町站搭四つ橋線約2站（約每6分鐘一班）", "하나조노초역에서 요츠바시선으로 약 2정거장（약 6분 간격）") }] },
        { place: "tengachayaSta", ways: [{ mode: "walk", t: "10", from: "stay", src: "gm" }] },
        { place: "kix", ways: [{ mode: "drive", t: "45–55", from: "stay", src: "gm" }] }
      ],
      near: {
        spots: [
          { place: "tsutenkaku", ways: [{ mode: "drive", t: "10–15", from: "stay", src: "gm" }] }
        ],
        restaurants: null
      },
      further: {
        drive: [
          { place: "shinsaibashi", ways: [{ mode: "drive", t: "15", from: "stay", src: "gm" }] },
          { place: "aeonDome", ways: [{ mode: "drive", t: "15–20", from: "stay", src: "doc" }] },
          { place: "osakajo", ways: [{ mode: "drive", t: "20–25", from: "stay", src: "gm" }] },
          { place: "kaiyukan", ways: [{ mode: "drive", t: "25–30", from: "stay", src: "gm" }] },
          { place: "usj", ways: [{ mode: "drive", t: "25–30", from: "stay", src: "gm" }] }
        ]
      },
      daily: {
        items: [F(fac.laundry, "1"), F(fac.lawson, "1"), F(fac.daiso, "4"), F(fac.supermarket, "4")],
        parking: "500–700"
      }
    },

    zen: {
      group: "south",
      originConfirmed: true,
      photos: { tab: "room_picture_1.jpeg", from: "room_picture_1.jpeg" },
      intro: L(
        "花園町駅まで徒歩約3〜5分。難波へは地下鉄四つ橋線で宿から約15分、関西空港へ直通の南海・天下茶屋駅へも徒歩約10分です。大阪の南側を楽しむのに便利な立地です。",
        "About 3–5 min on foot to Hanazonocho Station. Namba is about 15 min from the door on the Yotsubashi subway line, and Tengachaya Station — direct trains to Kansai Airport — is about 10 min on foot. A convenient spot for exploring southern Osaka.",
        "步行约3〜5分钟到花园町站。乘地铁四つ桥线从住宿到难波约15分钟，步行约10分钟即到可直达关西机场的南海天下茶屋站。是畅游大阪南部的便利据点。",
        "步行約3〜5分鐘到花園町站。搭地鐵四つ橋線從住宿到難波約15分鐘，步行約10分鐘即到可直達關西機場的南海天下茶屋站。是暢遊大阪南部的便利據點。",
        "하나조노초역까지 도보 약 3~5분. 지하철 요츠바시선으로 숙소에서 난바까지 약 15분, 간사이 공항 직행 난카이 텐가차야역까지 도보 약 10분입니다. 오사카 남쪽을 즐기기 편리한 위치입니다."
      ),
      access: [
        { place: "hanazonochoSta", ways: [{ mode: "walk", t: "3–5", from: "stay", src: "gm" }] },
        { place: "namba", ways: [{ mode: "train", t: "15", from: "stay", src: "gmNear", srcStay: "tea", route: L("花園町駅から四つ橋線で約2駅", "About 2 stops on the Yotsubashi Line from Hanazonocho", "从花园町站乘四つ桥线约2站", "從花園町站搭四つ橋線約2站", "하나조노초역에서 요츠바시선으로 약 2정거장") }] },
        { place: "tengachayaSta", ways: [{ mode: "walk", t: "10", from: "stay", src: "gm" }] },
        { place: "kix", ways: [{ mode: "drive", t: "45–55", from: "stay", src: "gmNear", srcStay: "tea" }] }
      ],
      near: {
        spots: [
          { place: "tsutenkaku", ways: [{ mode: "drive", t: "10–15", from: "stay", src: "gmNear", srcStay: "tea" }] }
        ],
        restaurants: null
      },
      further: {
        drive: [
          { place: "shinsaibashi", ways: [{ mode: "drive", t: "15", from: "stay", src: "gmNear", srcStay: "tea" }] },
          { place: "osakajo", ways: [{ mode: "drive", t: "20–25", from: "stay", src: "gmNear", srcStay: "tea" }] },
          { place: "kaiyukan", ways: [{ mode: "drive", t: "25–30", from: "stay", src: "gmNear", srcStay: "tea" }] },
          { place: "usj", ways: [{ mode: "drive", t: "25–30", from: "stay", src: "gmNear", srcStay: "tea" }] }
        ]
      },
      daily: {
        items: [F(fac.laundry, "1"), F(fac.lawson, "2"), F(fac.daiso, "3"), F(fac.supermarket, "3")],
        parking: "500–900"
      }
    },

    pine: {
      group: "bay",
      originConfirmed: true,
      photos: { tab: "room_picture_1.jpeg", from: "room_picture_1.jpeg" },
      intro: L(
        "弁天町駅まで徒歩約14分。近くの市岡バス停からは難波・梅田へ直通のバスがあり、市内の主な名所へは車で約15〜25分です。近所の飲食店も13軒ご紹介しています。",
        "About 14 min on foot to Bentencho Station. Direct buses to Namba and Umeda leave from the nearby Ichioka stop, and most major city sights are about 15–25 min by car. We also introduce 13 places to eat nearby.",
        "步行约14分钟到弁天町站。附近的市冈巴士站有直达难波、梅田的巴士，开车前往市内主要景点约15〜25分钟。另介绍附近13家餐厅。",
        "步行約14分鐘到弁天町站。附近的市岡公車站有直達難波、梅田的公車，開車前往市內主要景點約15〜25分鐘。另介紹附近13家餐廳。",
        "벤텐초역까지 도보 약 14분. 근처 이치오카 버스정류장에서 난바・우메다 직행 버스가 있고, 시내 주요 명소까지 차로 약 15~25분입니다. 근처 음식점 13곳도 소개합니다."
      ),
      access: [
        { place: "bentenchoSta", ways: [{ mode: "walk", t: "14", from: "stay", src: "gm" }] },
        { place: "ichiokaBus", ways: [{ mode: "walk", t: "5", from: "stay", src: "doc" }] },
        { place: "namba", ways: [{ mode: "bus", t: "25–30", from: "stay", src: "gm", route: L("60号系統バスで直通", "Direct on bus route 60", "60路巴士直达", "60路公車直達", "60번 버스로 직행") }] },
        { place: "umeda", ways: [
          { mode: "bus", t: "35–40", from: "stay", src: "gm", route: L("88号系統バスで直通（約20分間隔）", "Direct on bus route 88 (about every 20 min)", "88路巴士直达（约每20分钟一班）", "88路公車直達（約每20分鐘一班）", "88번 버스로 직행（약 20분 간격）") },
          { mode: "train", t: "25–30", from: "stay", src: "gm", route: L("弁天町駅からJR大阪環状線", "JR Osaka Loop Line from Bentencho", "从弁天町站乘JR大阪环状线", "從弁天町站搭JR大阪環狀線", "벤텐초역에서 JR 오사카 순환선") }
        ] },
        { place: "kix", ways: [{ mode: "drive", t: "40–55", from: "stay", src: "gm" }] }
      ],
      near: {
        spots: [],
        noTime: ["soraniwa"],
        restaurants: "bentencho"
      },
      further: {
        transit: [
          { place: "kaiyukan", ways: [{ mode: "train", t: "10", from: "station", station: "bentenchoSta", src: "web", route: routes.bentenKaiyukan }] },
          { place: "usj", ways: [{ mode: "train", t: "10–15", from: "station", station: "bentenchoSta", src: "web", route: routes.bentenUsj }] },
          { place: "osakajo", ways: [{ mode: "train", t: "15", from: "station", station: "bentenchoSta", src: "web", route: routes.bentenOsakajo }] }
        ],
        drive: [
          { place: "kaiyukan", ways: [{ mode: "drive", t: "15", from: "stay", src: "gm" }] },
          { place: "usj", ways: [{ mode: "drive", t: "15–20", from: "stay", src: "gm" }] },
          { place: "tsutenkaku", ways: [{ mode: "drive", t: "20", from: "stay", src: "gm" }] },
          { place: "shinsaibashi", ways: [{ mode: "drive", t: "20", from: "stay", src: "gm" }] },
          { place: "osakajo", ways: [{ mode: "drive", t: "20–25", from: "stay", src: "gm" }] }
        ]
      },
      daily: {
        items: [F(fac.laundryConbini, "1–2"), F(fac.kansaiSuper, "2"), F(fac.life, "10"), F(fac.donki, "13")],
        text: bentenchoEateries,
        parking: "500–900"
      }
    },

    literature: {
      group: "bay",
      originConfirmed: true,
      photos: { tab: "room_picture_1.jpeg", from: "room_picture_1.jpeg" },
      intro: L(
        "弁天町駅まで徒歩約15〜20分。市岡のまちにあり、市岡バス停から難波・梅田へ直通バスが出ています。イオンモールや京セラドームへは車で約5〜10分です。",
        "About 15–20 min on foot to Bentencho Station. In the Ichioka neighbourhood, with direct buses to Namba and Umeda from the Ichioka stop. AEON Mall and Kyocera Dome are about 5–10 min by car.",
        "步行约15〜20分钟到弁天町站。位于市冈一带，市冈巴士站有直达难波、梅田的巴士。开车约5〜10分钟可到永旺梦乐城和京瓷巨蛋。",
        "步行約15〜20分鐘到弁天町站。位於市岡一帶，市岡公車站有直達難波、梅田的公車。開車約5〜10分鐘可到永旺夢樂城和京瓷巨蛋。",
        "벤텐초역까지 도보 약 15~20분. 이치오카 동네에 있으며, 이치오카 버스정류장에서 난바・우메다 직행 버스가 있습니다. 이온몰과 교세라 돔까지는 차로 약 5~10분입니다."
      ),
      access: [
        { place: "bentenchoSta", ways: [{ mode: "walk", t: "15–20", from: "stay", src: "gm" }] },
        { place: "ichiokaBus", ways: [{ mode: "walk", t: "5", from: "stay", src: "doc" }] },
        { place: "namba", ways: [{ mode: "bus", t: "25–30", from: "stay", src: "gmNear", srcStay: "pine", route: L("60号系統バスで直通", "Direct on bus route 60", "60路巴士直达", "60路公車直達", "60번 버스로 직행") }] },
        { place: "umeda", ways: [{ mode: "bus", t: "35–40", from: "stay", src: "gmNear", srcStay: "pine", route: L("88号系統バスで直通", "Direct on bus route 88", "88路巴士直达", "88路公車直達", "88번 버스로 직행") }] },
        { place: "kix", ways: [{ mode: "drive", t: "40–55", from: "stay", src: "gmNear", srcStay: "pine" }] }
      ],
      near: {
        spots: [
          { place: "aeonDome", ways: [{ mode: "drive", t: "5–10", from: "stay", src: "doc" }] }
        ],
        restaurants: "bentencho"
      },
      further: {
        transit: [
          { place: "kaiyukan", ways: [{ mode: "train", t: "10", from: "station", station: "bentenchoSta", src: "web", route: routes.bentenKaiyukan }] },
          { place: "usj", ways: [{ mode: "train", t: "10–15", from: "station", station: "bentenchoSta", src: "web", route: routes.bentenUsj }] },
          { place: "osakajo", ways: [{ mode: "train", t: "15", from: "station", station: "bentenchoSta", src: "web", route: routes.bentenOsakajo }] }
        ],
        drive: [
          { place: "kaiyukan", ways: [{ mode: "drive", t: "15", from: "stay", src: "gmNear", srcStay: "pine" }] },
          { place: "usj", ways: [{ mode: "drive", t: "15–20", from: "stay", src: "gmNear", srcStay: "pine" }] },
          { place: "shinsaibashi", ways: [{ mode: "drive", t: "20", from: "stay", src: "gmNear", srcStay: "pine" }] },
          { place: "tsutenkaku", ways: [{ mode: "drive", t: "20", from: "stay", src: "gmNear", srcStay: "pine" }] },
          { place: "osakajo", ways: [{ mode: "drive", t: "20–25", from: "stay", src: "gmNear", srcStay: "pine" }] }
        ]
      },
      daily: {
        items: [F(fac.laundryConbini, "1–2"), F(fac.kansaiSuper, "2"), F(fac.life, "10"), F(fac.donki, "13")],
        text: bentenchoEateries,
        parking: "500–900"
      }
    },

    harmony: {
      group: "bay",
      /* Street number unconfirmed by the owner — never used as a
         directions origin and never printed. */
      originConfirmed: false,
      photos: { tab: "room_picture_6.jpeg", from: "room_picture_6.jpeg" },
      intro: L(
        "難波・心斎橋・梅田へ直通するバス停まで徒歩約2分、弁天町駅までは徒歩約12〜15分です。USJや大阪城などの主要観光地へは、JR・地下鉄・バスでアクセスできます。",
        "About 2 min on foot to a bus stop with direct routes to Namba, Shinsaibashi and Umeda, and about 12–15 min on foot to Bentencho Station. Major sights such as USJ and Osaka Castle can be reached by JR, subway or bus.",
        "步行约2分钟可到直达难波、心斋桥、梅田的巴士站，步行约12至15分钟可到弁天町站。可乘JR、地铁或巴士前往USJ、大阪城等主要景点。",
        "步行約2分鐘可到直達難波、心齋橋、梅田的公車站，步行約12至15分鐘可到弁天町站。可搭JR、地鐵或公車前往USJ、大阪城等主要景點。",
        "난바・신사이바시・우메다 직행 버스정류장까지 도보 약 2분, 벤텐초역까지 도보 약 12~15분입니다. USJ와 오사카성 등 주요 명소는 JR・지하철・버스로 갈 수 있습니다."
      ),
      access: [
        { place: "kuyakushoBus", ways: [{ mode: "walk", t: "2", from: "stay", src: "poster" }], note: L("難波・心斎橋・梅田へ直通のバスが発着", "Direct buses to Namba, Shinsaibashi and Umeda", "有直达难波、心斋桥、梅田的巴士", "有直達難波、心齋橋、梅田的公車", "난바・신사이바시・우메다 직행 버스 운행") },
        { place: "bentenchoSta", ways: [{ mode: "walk", t: "12–15", from: "stay", src: "gm" }] }
      ],
      near: {
        spots: [],
        noTime: ["tempozanWheel", "legoland", "aeonDome"],
        restaurants: "bentencho"
      },
      further: {
        poster: [
          { place: "usj", ways: [{ mode: "train", t: "15", from: "poster", src: "poster", route: L("JR", "JR", "JR", "JR", "JR") }, { mode: "taxi", t: "10–15", from: "poster", src: "poster" }] },
          { place: "osakajo", ways: [{ mode: "train", t: "15", from: "poster", src: "poster", route: L("地下鉄", "Subway", "地铁", "地鐵", "지하철") }] },
          { place: "shinsaibashi", ways: [{ mode: "train", t: "15", from: "poster", src: "poster", route: L("地下鉄", "Subway", "地铁", "地鐵", "지하철") }, { mode: "bus", t: "30", from: "poster", src: "poster" }] },
          { place: "kaiyukan", ways: [{ mode: "bus", t: "20", from: "poster", src: "poster" }] }
        ]
      },
      daily: {
        items: [],
        text: posterFacilities,
        parking: null
      }
    },

    art: {
      group: "bay",
      originConfirmed: true,
      photos: { tab: "room_picture_10.jpeg", from: "room_picture_10.jpeg" },
      intro: L(
        "朝潮橋駅まで徒歩約9分。夕凪バス停までは徒歩約2分で、難波・梅田へ直通し、所要時間は約30分です。",
        "About 9 min on foot to Asashiobashi Station. Yunagi bus stop is about 2 min away on foot, with direct buses taking about 30 min to Namba or Umeda.",
        "步行约9分钟到朝潮桥站。步行约2分钟可到夕凪巴士站，乘直达巴士前往难波或梅田约需30分钟。",
        "步行約9分鐘到朝潮橋站。步行約2分鐘可到夕凪公車站，搭直達公車前往難波或梅田約需30分鐘。",
        "아사시오바시역까지 도보 약 9분입니다. 유나기 버스정류장까지는 도보 약 2분이며, 난바 또는 우메다까지 직행버스로 약 30분 걸립니다."
      ),
      access: [
        { place: "asashiobashiSta", ways: [{ mode: "walk", t: "9", from: "stay", src: "gm" }] },
        { place: "artBus", ways: [{ mode: "walk", t: "2", from: "stay", src: "doc" }], note: L("難波・梅田へ直通のバスが発着", "Direct buses to Namba and Umeda", "有直达难波、梅田的巴士", "有直達難波、梅田的公車", "난바・우메다 직행 버스 운행") },
        { place: "namba", ways: [{ mode: "bus", t: "30", from: "stay", src: "doc", route: L("夕凪バス停から直通", "Direct from Yunagi bus stop", "从夕凪巴士站直达", "從夕凪公車站直達", "유나기 버스정류장에서 직행") }] },
        { place: "umeda", ways: [{ mode: "bus", t: "30", from: "stay", src: "doc", route: L("夕凪バス停から直通", "Direct from Yunagi bus stop", "从夕凪巴士站直达", "從夕凪公車站直達", "유나기 버스정류장에서 직행") }] },
        { place: "kix", ways: [{ mode: "drive", t: "40–55", from: "stay", src: "gmNear", srcStay: "pine" }] }
      ],
      airport: L(
        "関西空港から：JRで大阪環状線の弁天町駅へ。中央線に乗り換えて1駅の朝潮橋駅で降ります。",
        "From Kansai Airport: take JR to Bentencho Station on the Osaka Loop Line, then change to the Chuo Line for one stop to Asashiobashi.",
        "从关西机场：乘JR到大阪环状线弁天町站，换乘中央线坐一站到朝潮桥站。",
        "從關西機場：搭JR到大阪環狀線弁天町站，轉乘中央線坐一站到朝潮橋站。",
        "간사이 공항에서: JR로 오사카 순환선 벤텐초역까지 간 뒤, 주오선으로 갈아타 한 정거장인 아사시오바시역에서 내립니다."
      ),
      near: {
        spots: [
          { place: "misakiTenmangu", ways: [{ mode: "walk", t: "2–3", from: "stay", src: "gm" }], note: L("宿から約120m。港区三先1-5-40", "About 120 m from the stay. 港区三先1-5-40", "距住宿约120米。港区三先1-5-40", "距住宿約120米。港區三先1-5-40", "숙소에서 약 120m. 港区三先1-5-40") }
        ],
        noTime: ["soraniwa", "aeonDome"],
        restaurants: "art"
      },
      further: {
        transit: [
          { place: "kaiyukan", ways: [{ mode: "train", t: "10", from: "station", station: "asashiobashiSta", src: "web", route: routes.asashioKaiyukan }] }
        ],
        drive: [
          { place: "usj", ways: [{ mode: "drive", t: "15", from: "stay", src: "gm" }] },
          { place: "shinsaibashi", ways: [{ mode: "drive", t: "20–25", from: "stay", src: "gm" }] },
          { place: "tsutenkaku", ways: [{ mode: "drive", t: "20–25", from: "stay", src: "gm" }] }
        ]
      },
      daily: {
        items: [F(fac.conbini, "1"), F(fac.mcd, "3"), F(fac.bigSupers, "8"), F(fac.donki, "9")],
        parking: "700"
      }
    },

    furukawa: {
      group: "kaizuka",
      originConfirmed: true,
      photos: { tab: "room_picture_2.jpeg", from: "room_picture_2.jpeg" },
      intro: L(
        "水間鉄道・三ツ松駅まで徒歩約3〜5分。関西空港へは鉄道で約30分、車で約20〜35分です。大阪市内のにぎわいから離れ、水間寺や泉州のまちでゆったり過ごすための拠点です。",
        "About 3–5 min on foot to Mitsumatsu Station on the Mizuma Railway. Kansai Airport is about 30 min by rail or 20–35 min by car. A base for slow days around Mizuma-dera and the towns of Senshu, away from the bustle of central Osaka.",
        "步行约3〜5分钟到水间铁道三ツ松站。乘铁路到关西机场约30分钟，开车约20〜35分钟。远离大阪市区的喧嚣，是悠闲游览水间寺与泉州小镇的据点。",
        "步行約3〜5分鐘到水間鐵道三ツ松站。搭鐵路到關西機場約30分鐘，開車約20〜35分鐘。遠離大阪市區的喧囂，是悠閒遊覽水間寺與泉州小鎮的據點。",
        "미즈마 철도 미츠마츠역까지 도보 약 3~5분. 간사이 공항까지 철도로 약 30분, 차로 약 20~35분입니다. 오사카 시내의 번잡함에서 벗어나 미즈마데라와 센슈의 마을에서 느긋하게 지내기 위한 거점입니다."
      ),
      access: [
        { place: "mitsumatsuSta", ways: [{ mode: "walk", t: "3–5", from: "stay", src: "gm" }] },
        { place: "kix", ways: [
          { mode: "train", t: "30", from: "stay", src: "gm", route: L("水間鉄道＋南海線（約30分間隔）", "Mizuma Railway + Nankai Line (about every 30 min)", "水间铁道＋南海线（约每30分钟一班）", "水間鐵道＋南海線（約每30分鐘一班）", "미즈마 철도＋난카이선（약 30분 간격）") },
          { mode: "drive", t: "20–35", from: "stay", src: "gm", route: L("有料道路を利用", "Using toll roads", "走收费道路", "走收費道路", "유료 도로 이용") }
        ] }
      ],
      warning: L(
        "水間鉄道は約30分に1本です。空港へ向かう日は、前もって時刻表をご確認ください。",
        "Mizuma Railway trains run only about every 30 minutes. On the day you head to the airport, check the timetable in advance.",
        "水间铁道约30分钟才有一班车。前往机场当天，请提前查好班次。",
        "水間鐵道約30分鐘才有一班車。前往機場當天，請提前查好班次。",
        "미즈마 철도는 약 30분에 1대입니다. 공항으로 가는 날에는 미리 시간표를 확인해 주세요."
      ),
      airport: L(
        "関西空港から：南海線で貝塚駅へ → 水間鉄道に乗り換えて三ツ松駅へ → 駅から徒歩約2〜3分。",
        "From Kansai Airport: Nankai Line to Kaizuka Station → change to the Mizuma Railway for Mitsumatsu Station → about 2–3 min on foot.",
        "从关西机场：乘南海线到贝冢站 → 换乘水间铁道到三ツ松站 → 步行约2〜3分钟。",
        "從關西機場：搭南海線到貝塚站 → 轉乘水間鐵道到三ツ松站 → 步行約2〜3分鐘。",
        "간사이 공항에서: 난카이선으로 가이즈카역까지 → 미즈마 철도로 갈아타 미츠마츠역까지 → 역에서 도보 약 2~3분."
      ),
      near: {
        spots: [
          { place: "mizumadera", ways: [
            { mode: "train", t: "15", from: "stay", src: "gm", route: L("電車＋徒歩", "Train + walk", "电车＋步行", "電車＋步行", "전철＋도보") },
            { mode: "walk", t: "25", from: "stay", src: "gm", route: L("約1.7km", "About 1.7 km", "约1.7公里", "約1.7公里", "약 1.7km") }
          ] },
          {
            place: "misasaOnsen",
            ways: [{
              mode: "train",
              t: null,
              from: "stay",
              src: "web",
              route: L("水間鉄道で石才駅へ、駅から徒歩約5分", "Take the Mizuma Railway to Ishizai Station, then walk about 5 minutes", "乘水间铁道到石才站，再步行约5分钟", "搭水間鐵道到石才站，再步行約5分鐘", "미즈마 철도로 이시자이역까지 이동한 뒤 도보 약 5분")
            }],
            note: L(
              "地下約620mから湧く弱アルカリ性の天然療養泉。岩風呂、人工炭酸風呂、シルク風呂、露天風呂、壷風呂、電気風呂、幼児遊楽風呂などを楽しめます。営業時間は9:00〜24:00（最終受付23:30）。入浴料や休館日は公式サイトで最新情報をご確認ください。住所：大阪府貝塚市橋本991-1。",
              "A weakly alkaline natural therapeutic spring drawn from about 620 metres underground. Facilities include a hot-spring rock bath, artificial carbonated bath, silk bath, open-air baths, pot baths, an electric bath and a shallow children's bath. Open 9:00 AM–midnight, with last admission at 11:30 PM. Check the official website for current admission fees and closures. Address: 991-1 Hashimoto, Kaizuka, Osaka.",
              "采用从地下约620米涌出的弱碱性天然疗养泉，设有温泉岩浴、人工碳酸浴、丝绸浴、露天浴、壶浴、电气浴及儿童浅水浴池等。营业时间为9:00至24:00，最迟入场时间23:30。票价及休馆安排请以官网最新公布为准。地址：大阪府贝冢市桥本991-1。",
              "採用從地下約620米湧出的弱鹼性天然療養泉，設有溫泉岩浴、人工碳酸浴、絲綢浴、露天浴、壺浴、電氣浴及兒童淺水浴池等。營業時間為9:00至24:00，最遲入場時間23:30。票價及休館安排請以官網最新公布為準。地址：大阪府貝塚市橋本991-1。",
              "지하 약 620m에서 솟아나는 약알칼리성 천연 요양천입니다. 온천 암반탕, 인공 탄산탕, 실크탕, 노천탕, 항아리탕, 전기탕, 어린이용 얕은 놀이탕 등을 즐길 수 있습니다. 영업시간은 9:00~24:00이며 최종 입장은 23:30입니다. 입욕료와 휴관일은 공식 사이트의 최신 정보를 확인해 주세요. 주소: 오사카부 가이즈카시 하시모토 991-1."
            ),
            officialUrl: "https://www.misasanoyu.com/",
            officialLabel: L("公式サイトを見る", "Visit official website", "查看官方网站", "查看官方網站", "공식 사이트 보기")
          }
        ],
        extra: L(
          "宿には自転車と浴衣があります。浴衣で貝塚の下町の路地を散歩するのもおすすめです。",
          "Bicycles and yukata are available at the stay — try wandering the old lanes of Kaizuka in a yukata.",
          "民宿备有单车和浴衣，推荐穿上浴衣漫步贝冢老街巷弄。",
          "民宿備有單車和浴衣，推薦穿上浴衣漫步貝塚老街巷弄。",
          "숙소에 자전거와 유카타가 있습니다. 유카타를 입고 가이즈카 옛 골목을 산책해 보세요."
        ),
        restaurants: "furukawa"
      },
      further: {
        drive: [
          { place: "rinku", ways: [{ mode: "drive", t: "20–30", from: "stay", src: "gm" }] }
        ],
        poster: [
          { place: "gansenji", ways: [{ mode: "train", t: "25–30", from: "poster", src: "poster" }] },
          { place: "kouonji", ways: [{ mode: "train", t: "25–30", from: "poster", src: "poster" }] },
          { place: "gyokyo", ways: [{ mode: "train", t: "40–45", from: "poster", src: "poster" }] }
        ]
      },
      dayOverride: {
        trips: [
          { place: "wakayama", ways: [{ mode: "train", t: "1", unit: "h", from: "poster", src: "poster" }] }
        ],
        note: L(
          "奈良・京都・神戸・有馬へは、まず大阪市内の大きな駅へ出てからの移動になります。下の時間は大阪市内の駅からの乗車時間です。近場の日帰りなら和歌山もおすすめです。",
          "For Nara, Kyoto, Kobe or Arima, you'll first travel into a major station in central Osaka. The times below are ride times from those stations. For a closer day out, Wakayama is a good choice.",
          "前往奈良、京都、神户、有马，需先前往大阪市区的大站。以下为从大阪市内车站出发的乘车时间。想就近一日游，也推荐和歌山。",
          "前往奈良、京都、神戶、有馬，需先前往大阪市區的大站。以下為從大阪市內車站出發的乘車時間。想就近一日遊，也推薦和歌山。",
          "나라・교토・고베・아리마로 가려면 먼저 오사카 시내의 큰 역으로 이동해야 합니다. 아래는 오사카 시내 역에서 출발하는 승차 시간입니다. 가까운 당일치기라면 와카야마도 추천합니다."
        )
      },
      daily: {
        items: [],
        text: posterFacilities,
        parking: null
      }
    }
  };

  /* Tab / selector order: grouped by neighbourhood. */
  var order = ["tea", "zen", "pine", "literature", "harmony", "art", "furukawa"];

  /* Legacy tour-guide.html#area anchors (pre-2026-09 detail-page
     teaser links) -> a representative stay in that area. */
  var legacyHashes = {
    areas: null,
    shinsekai: "tea",
    namba: "tea",
    bay: "pine",
    kaizuka: "furukawa"
  };

  window.YuseiGuideData = {
    places: places,
    restaurants: restaurants,
    dayTrips: dayTrips,
    stays: stays,
    order: order,
    legacyHashes: legacyHashes,
    sourceDate: "2026-09-24"
  };
})();
