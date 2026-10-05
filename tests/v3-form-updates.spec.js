// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('v3 表單更新', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/v3/');
    await page.waitForSelector('#flow-tbody tr');
    await page.click('#btn-new-flow');
  });

  test('轉inbound顯示補充說明', async ({ page }) => {
    await page.selectOption('#tpl-type', '客戶意願確認轉真人服務類');
    await page.waitForTimeout(300);

    await page.locator('.btn-add-resp').first().click();
    const lastResp = page.locator('#dyn .resps .resp').last();
    await lastResp.locator('.rintent').selectOption('是(意圖)');
    await lastResp.locator('.resp-action').selectOption('轉inbound');

    const note = lastResp.locator('.inbound-set .note').filter({ hasText: '若流程開關未開啟時則轉真人，轉真人原因、台詞、訪談結果同共用回應處理' });
    await expect(note).toBeVisible();
  });

  test('業務資訊通知類 Part2 固定訪談結果不可編輯', async ({ page }) => {
    await page.selectOption('#tpl-type', '業務資訊通知類');
    await page.waitForTimeout(300);

    const iv = page.locator('#notice-body .notice-fixed-iv');
    await expect(iv).toBeVisible();

    await expect(iv.locator('select').nth(0)).toHaveValue('本人');
    await expect(iv.locator('select').nth(1)).toHaveValue('完成通知');
    await expect(iv.locator('select').nth(2)).toHaveValue('完成通知');

    await expect(iv.locator('select').nth(0)).toBeDisabled();
    await expect(iv.locator('select').nth(1)).toBeDisabled();
    await expect(iv.locator('select').nth(2)).toBeDisabled();
  });

  test('interview 清單包含有意願與無意願', async ({ page }) => {
    await page.selectOption('#tpl-type', '客戶意願確認轉真人服務類');
    await page.waitForTimeout(300);

    await page.locator('.btn-add-resp').first().click();
    const lastResp = page.locator('#dyn .resps .resp').last();
    await lastResp.locator('.rintent').selectOption('否(意圖)');
    await lastResp.locator('.resp-action').selectOption('結束通話（送出以下結束台詞）');
    const genericIv = lastResp.locator('.interview-set:not([data-notify-channel])');
    await genericIv.locator('.iv-contact').selectOption('本人');

    const typeOptions = await genericIv.locator('.iv-type option:not([disabled])').allTextContents();
    expect(typeOptions).toContain('有意願');
    expect(typeOptions).toContain('無意願');
  });

  test('共用回應規則掛斷依樣板切換訪談結果', async ({ page }) => {
    await page.selectOption('#tpl-type', '滿意度類');
    await page.waitForTimeout(300);
    await expect(page.locator('#sr-body [data-rule="掛斷"] .sr-fixed').filter({ hasText: '訪談結果：本人 / 本人接聽 / 未完成問卷（一題以上未給分)' })).toBeVisible();

    await page.selectOption('#tpl-type', '客戶意願確認轉真人服務類');
    await page.waitForTimeout(300);
    await expect(page.locator('#sr-body [data-rule="掛斷"] .sr-fixed').filter({ hasText: '訪談結果：非本人 / 客戶自行掛斷 / 客戶自行掛斷' })).toBeVisible();
  });

  test('滿意度類問卷處理機制完成通知顯示固定訪談結果', async ({ page }) => {
    await page.selectOption('#tpl-type', '滿意度類');
    await page.waitForTimeout(300);

    const fixedIv = page.locator('#dyn .resps .resp .fixed-iv-note').filter({ hasText: '訪談結果：本人 / 本人接聽 / 完成問卷' });
    await expect(fixedIv).toBeVisible();
  });
});

test.describe('v3 訪談結果清單', () => {
  test('flows 預設訪談結果皆存在於 interview.csv，且無已刪除項目', async ({ request }) => {
    const csv = await (await request.get('/v3/data/interview.csv')).text();
    const set = new Set(csv.split(/\r?\n/).slice(1).filter(Boolean));
    expect(set.size).toBe(csv.split(/\r?\n/).slice(1).filter(Boolean).length);
    for (const gone of ['轉真人(敏感詞)', '關係戶', '非本人接聽(結案)', '有意願消費', '無意願消費']) {
      expect(csv).not.toContain(gone);
    }
    const ids = await (await request.get('/v3/data/flows/index.json')).json();
    for (const id of (Array.isArray(ids) ? ids : ids.flows).map(x => x.id || x)) {
      const txt = await (await request.get(`/v3/data/flows/${id}.json`)).text();
      const re = /"interview":\s*\{\s*"contact":\s*"([^"]*)",\s*"type":\s*"([^"]*)",\s*"result":\s*"([^"]*)"/g;
      let m;
      while ((m = re.exec(txt))) { if (m[1]) expect(set.has(`${m[1]},${m[2]},${m[3]}`), `${id}: ${m[0]}`).toBe(true); }
    }
  });
});
