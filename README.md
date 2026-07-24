# 華南銀行外撥語音流程共用模組 Prototype

互動式原型展示系統，用於設定與管理外撥語音（Outbound）流程的共用模組。

## 線上展示

**GitHub Pages**：https://as73050-ring.github.io/hua-nan-shared-module/

## 功能概覽

### 三種樣板類型
- **滿意度類** — 問卷調查流程（DTMF/自然語言互動）
- **客戶意願確認轉真人服務類** — 多區塊分歧流程
- **業務資訊通知類** — 單向通知流程

### 系統功能
| 功能 | 說明 |
|------|------|
| 流程列表 | 搜尋、新增、編輯、刪除 |
| 表單設定 | 樣板切換、台詞選擇、回應設定、訪談結果 |
| 共用回應規則 | 全流程共用 7 種判斷（閒置/聽不懂/抱怨/轉真人/結束/再聯絡/掛斷） |
| 問卷管理 | 問卷代碼自動對應、DTMF 預覽 |
| 通知動作 | SMS / EMAIL / LINE / APP推播 |
| 參數管理 | 台詞、轉真人Skills、轉真人原因、訪談結果的 CRUD |
| 匯入匯出 | JSON 格式，結構化 formData |

## 技術棧

- 純 HTML + CSS + Vanilla JS（單一檔案 `index.html`）
- 資料來源：CSV（`data/`）+ JSON（`data/flows/`）
- 測試：Playwright Test（50 tests / 8 spec files）

## 本機開發

```bash
# 啟動本機伺服器（CSV/JSON 需透過 HTTP 載入）
npx serve . -l 5000

# 開啟 http://localhost:5000

# 執行測試（需先啟動伺服器）
npx playwright test

# 跑單一測試檔
npx playwright test tests/list-page.spec.js
```

## 專案結構

```
├── index.html              主要頁面（~1900 行）
├── data/                   CSV 資料庫
│   ├── scripts.csv          台詞（44筆）
│   ├── skills.csv           轉真人Skills（6筆）
│   ├── reasons.csv          轉真人原因（5筆）
│   ├── interview.csv        訪談結果（60+筆）
│   ├── surveys.csv          問卷主檔
│   ├── survey_questions.csv 問卷題目
│   ├── actions.csv          動作選項
│   ├── intents.csv          意圖清單
│   ├── checks.csv           共用判斷項目
│   ├── variables.csv        變數對照
│   └── flows/               JSON 流程檔
│       ├── index.json        流程 ID 清單
│       ├── OBCCI.json        信用卡交易分期
│       ├── OBCCE.json        電子帳單退件通知
│       ├── OBCCA.json        信用卡年費到期通知
│       ├── OBCCL.json        臨時額度調整
│       ├── OBCSI.json        存款綜合對帳單推廣
│       └── OBFMS.json        財富管理客戶滿意度調查
├── tests/                  Playwright 測試
│   ├── INDEX.js             測試索引與關聯表
│   ├── list-page.spec.js    列表頁（6 tests）
│   ├── form-basic.spec.js   表單基本（8 tests）
│   ├── form-responses.spec.js 回應設定（7 tests）
│   ├── shared-rules.spec.js 共用規則（7 tests）
│   ├── survey.spec.js       問卷（5 tests）
│   ├── params.spec.js       參數管理（6 tests）
│   ├── import-export.spec.js 匯入匯出（2 tests）
│   ├── notify.spec.js       通知動作（4 tests）
│   └── validation.spec.js   儲存檢核（4 tests）
└── playwright.config.js    測試設定
```

## 更新紀錄

### 2026-07-24
- 共用回應處理規則重構（全流程共用，各區塊僅勾選套用）
- JSON 結構化 formData（取代 innerHTML snapshot）
- Playwright TDD 50 tests 建立
- 測試索引與關聯性對照表
- 轉inbound 新增台詞選單
- 掛斷意圖隱藏台詞欄位

### 2026-07-22
- CSV 資料庫化（11 檔案）
- JSON 流程儲存（import/export）
- 通知動作面板（SMS/EMAIL/LINE/APP推播）
- 台詞搜尋篩選
- 問卷代碼依 flow_no 自動對應
- 表單驗證紅框+錯誤文字

### 2026-07-20
- 訪談結果三階段連動
- 共用回應意圖鎖定連動
- 轉真人原因下拉取代 skills 輸入

### 2026-07-16
- 列表頁（搜尋/新增/編輯/刪除）
- 參數管理（4分頁 CRUD）
- 全域台詞池
- 問卷 DTMF 預覽

### 2026-07-15
- 初版整合（三檔合一）
- 意圖連動、共用判斷
- 問卷套用區

## License

Internal use only.
