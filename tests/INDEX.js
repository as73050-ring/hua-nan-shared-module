// @ts-check
/**
 * 測試索引與關聯性對照表
 * 
 * 執行方式：
 *   全部跑：npx playwright test
 *   跑單檔：npx playwright test tests/list-page.spec.js
 *   跑指定：npx playwright test --grep "列表頁"
 *   跑關聯：npx playwright test tests/list-page.spec.js tests/import-export.spec.js
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ 測試檔案                    │ 測試數 │ 涵蓋功能                      │
 * ├─────────────────────────────┼────────┼───────────────────────────────┤
 * │ list-page.spec.js           │   6    │ 列表載入/搜尋/刪除/導航       │
 * │ form-basic.spec.js          │   8    │ 新增/編輯/切換樣板/檢核       │
 * │ form-responses.spec.js      │   7    │ 意圖連動/動作切換/新增刪除    │
 * │ shared-rules.spec.js        │   7    │ 共用規則區/收合/預設值/勾選   │
 * │ survey.spec.js              │   5    │ 問卷代碼/預覽/處理機制        │
 * │ params.spec.js              │   6    │ 參數管理4分頁/篩選            │
 * │ import-export.spec.js       │   2    │ JSON匯出結構/儲存後保留       │
 * │ notify.spec.js              │   4    │ SMS/EMAIL/LINE/APP面板        │
 * │ validation.spec.js          │   4    │ 必填紅框/通過儲存             │
 * └─────────────────────────────┴────────┴───────────────────────────────┘
 *                                  50 total
 *
 * ═══════════════════════════════════════════════════════════════════════
 * 關聯性對照（改了左邊，跑右邊的測試）
 * ═══════════════════════════════════════════════════════════════════════
 *
 * 異動範圍                         │ 需覆測的測試檔
 * ─────────────────────────────────┼──────────────────────────────────
 * index.html 列表頁 HTML/JS        │ list-page, import-export
 * index.html 表單基本欄位          │ form-basic, validation
 * index.html 回應設定/respRow      │ form-responses, shared-rules, notify
 * index.html 共用規則區段          │ shared-rules, form-responses
 * index.html 問卷區(Part2 survey)  │ survey
 * index.html syncActionFields      │ form-responses, notify
 * index.html handleIntentChange    │ form-responses, shared-rules
 * index.html captureFormData       │ import-export, survey
 * index.html restoreFormData       │ import-export, survey
 * index.html renderTemplate        │ form-basic, form-responses, shared-rules, survey
 * index.html 儲存檢核邏輯         │ validation, form-basic
 * index.html 通知面板(notify-set)  │ notify
 * index.html 參數管理JS           │ params
 * index.html scriptDropdown搜尋    │ (目前無獨立測試，影響全域台詞選擇)
 * data/scripts.csv                 │ form-responses, shared-rules, survey
 * data/flows/*.json                │ list-page, import-export, survey
 * data/flows/index.json            │ list-page
 * data/surveys.csv                 │ survey
 * data/checks.csv                  │ shared-rules
 * data/actions.csv                 │ form-responses, notify
 * data/interview.csv               │ (目前無獨立測試，影響訪談結果選單)
 * data/skills.csv                  │ validation (transfer-skill)
 * data/reasons.csv                 │ form-responses
 *
 * ═══════════════════════════════════════════════════════════════════════
 * 快速覆測指令
 * ═══════════════════════════════════════════════════════════════════════
 *
 * # 改了回應設定相關
 * npx playwright test tests/form-responses.spec.js tests/shared-rules.spec.js tests/notify.spec.js
 *
 * # 改了儲存/匯入匯出
 * npx playwright test tests/import-export.spec.js tests/validation.spec.js tests/form-basic.spec.js
 *
 * # 改了問卷區
 * npx playwright test tests/survey.spec.js
 *
 * # 改了列表頁/流程JSON
 * npx playwright test tests/list-page.spec.js tests/import-export.spec.js
 *
 * # 改了renderTemplate（影響大，建議全跑）
 * npx playwright test
 *
 * # 改了參數管理
 * npx playwright test tests/params.spec.js
 *
 * # 改了CSS/排版（不影響邏輯，可略）
 * (不需跑測試)
 */
