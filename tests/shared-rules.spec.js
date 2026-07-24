// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('共用回應處理規則', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#flow-tbody tr');
    await page.click('#btn-new-flow');
    await page.selectOption('#tpl-type', '客戶意願確認轉真人服務類');
    await page.waitForTimeout(300);
  });

  test('共用規則區段存在', async ({ page }) => {
    await expect(page.locator('.shared-rules')).toBeVisible();
  });

  test('共用規則有7項', async ({ page }) => {
    const items = await page.locator('.sr-item').count();
    expect(items).toBe(7);
  });

  test('收合/展開功能', async ({ page }) => {
    await page.click('#sr-toggle-head');
    await expect(page.locator('#sr-body')).toBeHidden();
    await page.click('#sr-toggle-head');
    await expect(page.locator('#sr-body')).toBeVisible();
  });

  test('閒置台詞預設ZZZ001', async ({ page }) => {
    const val = await page.locator('[data-rule="閒置"] .sr-script').inputValue();
    expect(val).toBe('ZZZ001');
  });

  test('聽不懂台詞預設ZZZ002', async ({ page }) => {
    const val = await page.locator('[data-rule="聽不懂"] .sr-script').inputValue();
    expect(val).toBe('ZZZ002');
  });

  test('再聯絡4句台詞預設ZZA001~004', async ({ page }) => {
    const cb1 = await page.locator('[data-rule="再聯絡"] .sr-cb1').inputValue();
    const cb4 = await page.locator('[data-rule="再聯絡"] .sr-cb4').inputValue();
    expect(cb1).toBe('ZZA001');
    expect(cb4).toBe('ZZA004');
  });

  test('訪談結果顯示不可編輯', async ({ page }) => {
    const ivText = await page.locator('[data-rule="閒置"] .sr-config').textContent();
    expect(ivText).toContain('本人 / 系統紀錄 / 閒置');
  });

  test('各區塊有套用共用判斷勾選', async ({ page }) => {
    const checks = await page.locator('.shared-checks input[type=checkbox]').count();
    expect(checks).toBeGreaterThan(0);
  });
});
