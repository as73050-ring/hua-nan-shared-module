// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('回應設定', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#flow-tbody tr');
    await page.click('#btn-new-flow');
    await page.selectOption('#tpl-type', '客戶意願確認轉真人服務類');
    await page.waitForTimeout(300);
  });

  test('新增回應選項', async ({ page }) => {
    const before = await page.locator('#dyn .resps .resp').count();
    await page.locator('.btn-add-resp').first().click();
    const after = await page.locator('#dyn .resps .resp').count();
    expect(after).toBe(before + 1);
  });

  test('意圖選轉真人：連動動作+原因+台詞', async ({ page }) => {
    await page.locator('.btn-add-resp').first().click();
    const lastResp = page.locator('#dyn .resps .resp').last();
    await lastResp.locator('.rintent').selectOption('轉真人');
    await page.waitForTimeout(100);
    const action = await lastResp.locator('.resp-action').inputValue();
    expect(action).toBe('轉真人');
    await expect(lastResp.locator('.skillset')).toBeVisible();
    await expect(lastResp.locator('.action-script')).toBeVisible();
  });

  test('意圖選掛斷：無台詞欄位', async ({ page }) => {
    await page.locator('.btn-add-resp').first().click();
    const lastResp = page.locator('#dyn .resps .resp').last();
    await lastResp.locator('.rintent').selectOption('掛斷');
    await page.waitForTimeout(100);
    await expect(lastResp.locator('.action-script')).toBeHidden();
  });

  test('動作選結束通話：顯示台詞+訪談結果', async ({ page }) => {
    await page.locator('.btn-add-resp').first().click();
    const lastResp = page.locator('#dyn .resps .resp').last();
    await lastResp.locator('.rintent').selectOption('否');
    await lastResp.locator('.resp-action').selectOption('結束通話（送出以下結束台詞）');
    await page.waitForTimeout(100);
    await expect(lastResp.locator('.action-script')).toBeVisible();
    await expect(lastResp.locator('.interview-set')).toBeVisible();
  });

  test('動作選轉inbound：顯示帶入語句+台詞', async ({ page }) => {
    await page.locator('.btn-add-resp').first().click();
    const lastResp = page.locator('#dyn .resps .resp').last();
    await lastResp.locator('.rintent').selectOption('是');
    await lastResp.locator('.resp-action').selectOption('轉inbound');
    await page.waitForTimeout(100);
    await expect(lastResp.locator('.inbound-set')).toBeVisible();
    await expect(lastResp.locator('.action-script')).toBeVisible();
  });

  test('動作選再聯絡：顯示4個台詞欄位', async ({ page }) => {
    await page.locator('.btn-add-resp').first().click();
    const lastResp = page.locator('#dyn .resps .resp').last();
    await lastResp.locator('.rintent').selectOption('再連絡');
    await page.waitForTimeout(100);
    await expect(lastResp.locator('.callback-set')).toBeVisible();
    const cbSels = await lastResp.locator('.cb-sel').count();
    expect(cbSels).toBe(4);
  });

  test('刪除回應選項', async ({ page }) => {
    await page.locator('.btn-add-resp').first().click();
    const before = await page.locator('#dyn .resps .resp').count();
    await page.locator('#dyn .resps .resp .del').last().click();
    const after = await page.locator('#dyn .resps .resp').count();
    expect(after).toBe(before - 1);
  });
});
