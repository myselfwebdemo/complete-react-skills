import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { expect, test, type Page } from '@playwright/test';

async function dragAndDrop(
  page: Parameters<typeof test>[0]['page'],
  source: string,
  target: string
) {
  const sourceElement = page.locator(source).first();
  const targetElement = page.locator(target).first();

  await sourceElement.scrollIntoViewIfNeeded().catch(() => undefined);
  await targetElement.scrollIntoViewIfNeeded().catch(() => undefined);

  await sourceElement.dragTo(targetElement)
}

async function mockRequestsFromHar(page: Page) {
  const harPath = fileURLToPath(new URL('./fixtures/burger-flow.har', import.meta.url));
  const harContent = await readFile(harPath, 'utf8');
  const har = JSON.parse(harContent) as {
    log: {
      entries: Array<{
        request: { method: string; url: string };
        response: {
          status: number;
          content: { mimeType?: string; text?: string };
        };
      }>;
    };
  };

  await page.route('**/*', async (route) => {
    const request = route.request();
    const requestMethod = request.method().toUpperCase();
    const requestUrl = request.url();

    const matchingEntry = har.log.entries.find(
      (entry) =>
        entry.request.method.toUpperCase() === requestMethod &&
        entry.request.url === requestUrl
    );

    if (!matchingEntry) {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: matchingEntry.response.status,
      contentType: matchingEntry.response.content.mimeType ?? 'application/json',
      body: matchingEntry.response.content.text ?? '',
    });
  });
}

test('creates an order by assembling a burger and opening the order modal', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('accessToken', 'Bearer test-token');
    window.localStorage.setItem('refreshToken', 'test-refresh-token');
  });

  await mockRequestsFromHar(page);

  page.on('console', (msg) => {console.log(msg.text())});

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await expect(
    page.getByTestId('bun-dropzone-top')
  ).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Соберите бургер' })).toBeVisible();
  await expect(page.getByText('Краторная булка', { exact: true })).toBeVisible();

  await page.waitForTimeout(1000)

  await dragAndDrop(
    page,
    'li:has-text("Краторная булка")',
    '[data-testid="bun-dropzone-top"]'
  );
  await dragAndDrop(
    page,
    'li:has-text("Соус")',
    '[data-testid="constructor-ingredients-dropzone"]'
  );

  await expect(page.getByTestId('bun-dropzone-top')).toContainText('Краторная булка');
  await expect(page.getByTestId('constructor-ingredients-dropzone').getByText(/Соус|соус/i)).toBeVisible();

  const orderButton = page.getByRole('button', { name: 'Оформить заказ' });
  await expect(orderButton).toBeEnabled();
  await orderButton.click();

  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText('Ваш заказ начали готовить')).toBeVisible();
  await expect(page.getByText('#4242')).toBeVisible();

  await page.getByRole('button', { name: 'Закрыть' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
