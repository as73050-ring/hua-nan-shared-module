// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('參數管理', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#flow-tbody tr');
    await page.click('#nav-params');
    await page.waitForTimeout(300);
  });

  test('4個分頁存在', async ({ page }) => {
    const tabs = await page.locator('.ptab').count();
    expect(tabs).toBe(4);
  });

  test('台詞管理：顯示台詞列表', async ({ page }) => {
    const rows = await page.locator('.param-table tbody tr').count();
    expect(rows).toBeGreaterThan(0);
  });

  test('切換到轉真人Skills分頁', async ({ page }) => {
    await page.locator('.ptab[data-ptab="skills"]').click();
    const rows = await page.locator('.param-table tbody tr').count();
    expect(rows).toBeGreaterThanOrEqual(6);
  });

  test('切換到轉真人原因分頁', async ({ page }) => {
    await page.locator('.ptab[data-ptab="reasons"]').click();
    const rows = await page.locator('.param-table tbody tr').count();
    expect(rows).toBeGreaterThanOrEqual(5);
  });

  test('切換到訪談結果分頁', async ({ page }) => {
    await page.locator('.ptab[data-ptab="interview"]').click();
    const rows = await page.locator('.param-table tbody tr').count();
    expect(rows).toBeGreaterThan(0);
  });

  test('訪談結果篩選：本人', async ({ page }) => {
    await page.locator('.ptab[data-ptab="interview"]').click();
    await page.waitForTimeout(200);
    await page.locator('.pf-btn[data-filter="本人"]').click();
    const content = await page.locator('.param-table').textContent();
    expect(content).not.toContain('非本人');
  });
});
