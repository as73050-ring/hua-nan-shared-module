// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('列表頁', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#flow-tbody tr');
  });

  test('載入顯示6筆流程', async ({ page }) => {
    const rows = await page.locator('#flow-tbody tr').count();
    expect(rows).toBe(6);
  });

  test('搜尋篩選正確', async ({ page }) => {
    await page.fill('#search-input', 'OBFMS');
    await page.click('#btn-search');
    const rows = await page.locator('#flow-tbody tr').count();
    expect(rows).toBe(1);
    const firstCell = await page.locator('#flow-tbody tr td').first().textContent();
    expect(firstCell).toContain('OBFMS');
  });

  test('清空搜尋顯示全部', async ({ page }) => {
    await page.fill('#search-input', 'OBFMS');
    await page.click('#btn-search');
    await page.fill('#search-input', '');
    await page.click('#btn-search');
    const rows = await page.locator('#flow-tbody tr').count();
    expect(rows).toBe(6);
  });

  test('刪除流程後列表更新', async ({ page }) => {
    page.on('dialog', d => d.accept());
    const before = await page.locator('#flow-tbody tr').count();
    await page.locator('[data-act="del"]').first().click();
    const after = await page.locator('#flow-tbody tr').count();
    expect(after).toBe(before - 1);
  });

  test('ChatWeb管理導航回列表', async ({ page }) => {
    await page.click('#btn-new-flow');
    await expect(page.locator('#view-form')).toBeVisible();
    await page.click('#nav-chatwebmgmt');
    await expect(page.locator('#view-list')).toBeVisible();
  });

  test('參數管理導航', async ({ page }) => {
    await page.click('#nav-params');
    await expect(page.locator('#view-params')).toBeVisible();
  });
});
