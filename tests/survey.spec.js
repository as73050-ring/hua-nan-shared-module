// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('問卷功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#flow-tbody tr');
  });

  test('滿意度類：流程編號輸入OBFMS自動帶出問卷代碼', async ({ page }) => {
    await page.click('#btn-new-flow');
    await page.selectOption('#tpl-type', '滿意度類');
    await page.waitForTimeout(300);
    await page.fill('#flow-no', 'OBFMS');
    await page.locator('#flow-no').blur();
    await page.waitForTimeout(300);
    const scVal = await page.locator('#survey-code').inputValue();
    expect(scVal).toContain('Q001');
  });

  test('不存在的流程編號顯示錯誤', async ({ page }) => {
    await page.click('#btn-new-flow');
    await page.selectOption('#tpl-type', '滿意度類');
    await page.waitForTimeout(300);
    await page.fill('#flow-no', 'NOTEXIST');
    await page.locator('#flow-no').blur();
    await page.waitForTimeout(300);
    await expect(page.locator('#fld-survey-code .error-msg')).toBeVisible();
  });

  test('問卷預覽顯示正確題數', async ({ page }) => {
    await page.click('#btn-new-flow');
    await page.selectOption('#tpl-type', '滿意度類');
    await page.waitForTimeout(300);
    await page.fill('#flow-no', 'OBFMS');
    await page.locator('#flow-no').blur();
    await page.waitForTimeout(500);
    const preview = await page.locator('#survey-preview').textContent();
    expect(preview).toContain('6 題');
  });

  test('問卷處理機制有完成通知和問答題轉真人', async ({ page }) => {
    await page.click('#btn-new-flow');
    await page.selectOption('#tpl-type', '滿意度類');
    await page.waitForTimeout(300);
    await expect(page.locator('[data-role="done"]')).toBeVisible();
    await expect(page.locator('[data-role="human"]')).toBeVisible();
  });

  test('匯入OBFMS後問卷處理機制台詞正確', async ({ page }) => {
    await page.locator('[data-no="OBFMS"][data-act="edit"]').click();
    await page.waitForTimeout(600);
    const doneVal = await page.locator('[data-role="done"]').inputValue();
    const humanVal = await page.locator('[data-role="human"]').inputValue();
    expect(doneVal).toBe('OBFMS009');
    expect(humanVal).toBe('ZZZ002');
  });
});
