// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('表單基本操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#flow-tbody tr');
  });

  test('新增流程：欄位預設空白', async ({ page }) => {
    await page.click('#btn-new-flow');
    await expect(page.locator('#flow-no')).toHaveValue('');
    await expect(page.locator('#flow-name')).toHaveValue('');
    const tplVal = await page.locator('#tpl-type').inputValue();
    expect(tplVal).toBe('');
  });

  test('新增流程：問卷代碼預設隱藏', async ({ page }) => {
    await page.click('#btn-new-flow');
    await expect(page.locator('#fld-survey-code')).toBeHidden();
  });

  test('選擇滿意度類：問卷代碼顯示', async ({ page }) => {
    await page.click('#btn-new-flow');
    await page.selectOption('#tpl-type', '滿意度類');
    await expect(page.locator('#fld-survey-code')).toBeVisible();
  });

  test('編輯流程：流程編號唯讀', async ({ page }) => {
    await page.locator('[data-act="edit"]').first().click();
    await expect(page.locator('#flow-no')).toHaveAttribute('readonly', 'readonly');
  });

  test('切換樣板不覆蓋已輸入的流程編號', async ({ page }) => {
    await page.click('#btn-new-flow');
    await page.fill('#flow-no', 'TEST001');
    await page.fill('#flow-name', '測試流程');
    await page.selectOption('#tpl-type', '客戶意願確認轉真人服務類');
    await page.waitForTimeout(300);
    await expect(page.locator('#flow-no')).toHaveValue('TEST001');
    await expect(page.locator('#flow-name')).toHaveValue('測試流程');
  });

  test('取消回到列表', async ({ page }) => {
    await page.click('#btn-new-flow');
    await page.click('#btn-cancel');
    await expect(page.locator('#view-list')).toBeVisible();
  });

  test('麵包屑回上頁', async ({ page }) => {
    await page.click('#btn-new-flow');
    await page.click('#crumb-back');
    await expect(page.locator('#view-list')).toBeVisible();
  });

  test('流程編號重複檢核', async ({ page }) => {
    await page.click('#btn-new-flow');
    await page.selectOption('#tpl-type', '業務資訊通知類');
    await page.waitForTimeout(300);
    const existingNo = await page.locator('#flow-tbody tr td').first().textContent();
    await page.fill('#flow-no', existingNo);
    await page.fill('#flow-name', '重複測試');
    await page.selectOption('#transfer-skill', '88001');
    // Uncheck shared checks to avoid other validation
    const checks = page.locator('#dyn .shared-checks input[type=checkbox]:checked');
    const count = await checks.count();
    for(let i=0;i<count;i++){ await checks.nth(0).uncheck(); }
    await page.click('#btn-save');
    await expect(page.locator('.error-msg').first()).toBeVisible();
  });
});
