// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('v2 表單更新', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/v2/');
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
    await lastResp.locator('.iv-contact').selectOption('本人');

    const typeOptions = await lastResp.locator('.iv-type option:not([disabled])').allTextContents();
    expect(typeOptions).toContain('有意願');
    expect(typeOptions).toContain('無意願');
  });

  test('共用回應規則掛斷依樣板切換訪談結果', async ({ page }) => {
    await page.selectOption('#tpl-type', '滿意度類');
    await page.waitForTimeout(300);
    await expect(page.locator('#sr-body [data-rule="掛斷"] .sr-fixed').filter({ hasText: '訪談結果：本人 / 本人接聽 / 未完成問卷' })).toBeVisible();

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
