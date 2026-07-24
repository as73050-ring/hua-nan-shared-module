// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('通知動作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#flow-tbody tr');
    await page.click('#btn-new-flow');
    await page.selectOption('#tpl-type', '客戶意願確認轉真人服務類');
    await page.waitForTimeout(300);
    await page.locator('.btn-add-resp').first().click();
  });

  test('動作選SMS：顯示3個欄位+備註', async ({ page }) => {
    const lastResp = page.locator('#dyn .resps .resp').last();
    await lastResp.locator('.rintent').selectOption('是');
    await lastResp.locator('.resp-action').selectOption('SMS');
    await page.waitForTimeout(100);
    await expect(lastResp.locator('.notify-set')).toBeVisible();
    const inputs = await lastResp.locator('.nf-input').count();
    expect(inputs).toBe(3);
    const note = await lastResp.locator('.nf-note').textContent();
    expect(note).toContain('{:DAl}');
  });

  test('動作選EMAIL：顯示3個欄位+備註', async ({ page }) => {
    const lastResp = page.locator('#dyn .resps .resp').last();
    await lastResp.locator('.rintent').selectOption('是');
    await lastResp.locator('.resp-action').selectOption('EMAIL');
    await page.waitForTimeout(100);
    await expect(lastResp.locator('.notify-set')).toBeVisible();
    const note = await lastResp.locator('.nf-note').textContent();
    expect(note).toContain('{:To_Mail}');
  });

  test('動作選LINE：顯示4個欄位+備註', async ({ page }) => {
    const lastResp = page.locator('#dyn .resps .resp').last();
    await lastResp.locator('.rintent').selectOption('是');
    await lastResp.locator('.resp-action').selectOption('LINE');
    await page.waitForTimeout(100);
    await expect(lastResp.locator('.notify-set')).toBeVisible();
    const inputs = await lastResp.locator('.nf-input').count();
    expect(inputs).toBe(4);
    const note = await lastResp.locator('.nf-note').textContent();
    expect(note).toContain('{:nationalID}');
  });

  test('動作選APP推播：顯示6個欄位+備註', async ({ page }) => {
    const lastResp = page.locator('#dyn .resps .resp').last();
    await lastResp.locator('.rintent').selectOption('是');
    await lastResp.locator('.resp-action').selectOption('APP推播');
    await page.waitForTimeout(100);
    await expect(lastResp.locator('.notify-set')).toBeVisible();
    const inputs = await lastResp.locator('.nf-input').count();
    expect(inputs).toBe(6);
    const note = await lastResp.locator('.nf-note').textContent();
    expect(note).toContain('{:device_id}');
  });
});
