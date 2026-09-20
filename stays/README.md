# stays/ — 民宿詳細頁（7個，共用一個模板）

跟第4/19章工作次序，detail page template要等首頁全部section完成、確認咗先開始起。呢個資料夾而家淨係佔位，等到嗰個phase會建立：

- `_template` 邏輯：一個共用版型，7間民宿只換圖片/文字/設施/訂房連結（唔係7份獨立design）
- 對應首頁「Our Stays」卡片已經連緊嘅7個檔案（暫時未存在，連結會404，屬正常）：
  - `harmony-garden.html`　和の園 Harmony Garden
  - `pine-garden.html`　松園まつえん Pine Garden
  - `art-home.html`　芸 Art Home
  - `literature-garden.html`　文園ぶんえん Literature Garden
  - `tea-garden.html`　茶園ちゃえん Tea Garden
  - `furukawa-house.html`　古川の家 Furukawa House
  - `zen-garden.html`　禪園ぜんえん Zen

內容嚟源：每間民宿嘅地址/交通/價錢/設備已經喺項目入面「民宿資料整理.md」整理咗；起呢7個頁面之前，建議先跟返「民宿資料整理.md」第二部分嘅問題清單，同老闆核實返容納人數、古川の家車庫、和の園/古川の家價錢呢幾樣，避免頁面做咗先要返工改。

## 住宿列表與篩選頁（2026-09-21）

- `../stays.html`：已建立日語列表頁，樣式 `../css/stays.css`，互動及房源資料 `../js/stays.js`。
- 初始展示松園、文園、茶園；展開後共 7 間。首頁列表入口已改為相對路徑，支援 GitHub Pages 子目錄。
- 已有地區篩選、人數控制、兒童年齡、重設、日期驗證及可複製查詢文案。
- 松園 5、文園 6、茶園 5、和の園 5 為 reference 中數字，仍須業主最終核實；芸、古川の家、禪園的定員有矛盾，使用 null 保留候選，不能理解為已保證可入住。
- 兒童入住規則未批准，暫不按年齡自動排除房源。設備矩陣目前全部 null：勾選設備不會排除未知房源，會顯示確認提示。核實後在 amenities 填 true/false。
- 日期只生成查詢文案，沒有發送、房態同步、收款或完成預訂。Airbnb 連結來自 reference，需上線前確認。
- 詳細頁尚未建立：目前「詳細を見る」開啟資訊視窗及 Airbnb 入口，日後換成這份文件上方規劃的正式頁面。
- 圖中品牌圖案以 SVG 近似重畫，並非正式商標檔案。背景葉影為網頁 SVG 裝飾。
