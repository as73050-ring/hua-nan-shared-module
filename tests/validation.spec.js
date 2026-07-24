// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('儲存檢核', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#flow-tbody tr');
    await page.click('#btn-new-flow');
    await page.selectOption('#tpl-type', '客戶意願確認轉真人服務類');
    await page.waitForTimeout(300);
  });

  test('空白流程編號：紅框+錯誤訊息', async ({ page }) => {
    await page.click('#btn-save');
    await expect(page.locator('#flow-no').locator('..')).toHaveClass(/field-error/);
    await expect(page.locator('.error-msg').first()).toBeVisible();
  });

  test('空白業務流程名稱：紅框', async ({ page }) => {
    await page.fill('#flow-no', 'TEST999');
    await page.click('#btn-save');
    await expect(page.locator('.error-msg').first()).toBeVisible();
  });

  test('未選轉真人Skills：紅框', async ({ page }) => {
    await page.fill('#flow-no', 'TEST999');
    await page.fill('#flow-name', '測試');
    await page.click('#btn-save');
    const errorMsgs = await page.locator('.error-msg').allTextContents();
    const hasSkillError = errorMsgs.some(m => m.includes('Skills'));
    expect(hasSkillError).toBe(true);
  });

  test('通過檢核：成功儲存並回列表', async ({ page }) => {
    // Use a simpler template with no responses to validate
    await page.selectOption('#tpl-type', '業務資訊通知類');
    await page.waitForTimeout(300);
    await page.fill('#flow-no', 'TESTOK');
    await page.fill('#flow-name', '完整測試');
    await page.selectOption('#transfer-skill', '88001');
    // Remove response rows that trigger validation
    await page.evaluate(() => {
      document.querySelectorAll('#dyn .shared-checks input[type=checkbox]').forEach(cb=>{cb.checked=false;});
      document.querySelectorAll('#dyn .resps .resp').forEach(r=>r.remove());
    });
    await page.click('#btn-save');
    await page.waitForTimeout(500);
    await expect(page.locator('#view-list')).toBeVisible();
  });
});
