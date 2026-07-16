import { expect, test } from '@playwright/test';

async function dragAndDrop(
  page: Parameters<typeof test>[0]['page'],
  source: string,
  target: string
) {
  const sourceElement = page.locator(source).first();
  const targetElement = page.locator(target).first();

  await sourceElement.scrollIntoViewIfNeeded().catch(() => undefined);
  await targetElement.scrollIntoViewIfNeeded().catch(() => undefined);

  const sourceBox = await sourceElement.boundingBox();
  const targetBox = await targetElement.boundingBox();

  if (!sourceBox || !targetBox) {
    throw new Error('Unable to find drag source or target');
  }

  await page.mouse.move(
    sourceBox.x + sourceBox.width / 2,
    sourceBox.y + sourceBox.height / 2
  );
  await page.mouse.down();
  await page.mouse.move(
    targetBox.x + targetBox.width / 2,
    targetBox.y + targetBox.height / 2,
    { steps: 10 }
  );
  await page.mouse.up();
}

test('creates an order by assembling a burger and opening the order modal', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('accessToken', 'Bearer test-token');
    window.localStorage.setItem('refreshToken', 'test-refresh-token');
  });

  const bun = {
    _id: 'bun-1',
    name: 'Краторная булка',
    type: 'bun',
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 40,
    price: 100,
    image: 'bun.png',
    image_large: 'bun-large.png',
    image_mobile: 'bun-mobile.png',
    __v: 0,
  };

  const sauce = {
    _id: 'sauce-1',
    name: 'Соус',
    type: 'sauce',
    proteins: 1,
    fat: 2,
    carbohydrates: 3,
    calories: 4,
    price: 20,
    image: 'sauce.png',
    image_large: 'sauce-large.png',
    image_mobile: 'sauce-mobile.png',
    __v: 0,
  };

  await page.route('**/api/ingredients', async (route) => {
    await route.fulfill({
      json: {
        success: true,
        data: [bun, sauce],
      },
    });
  });

  await page.route('**/api/auth/user', async (route) => {
    await route.fulfill({
      json: {
        success: true,
        user: { name: 'Test User', email: 'test@example.com' },
      },
    });
  });

  await page.route('**/api/orders', async (route) => {
    await route.fulfill({
      json: {
        success: true,
        name: 'Тестовый бургер',
        order: { number: 4242 },
      },
    });
  });

  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Соберите бургер' })).toBeVisible();
  await expect(page.getByText('Краторная булка', { exact: true })).toBeVisible();

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

  await expect(page.getByText(/Краторная булка.*\(верх\)/)).toBeVisible();
  await expect(
    page.getByTestId('constructor-ingredients-dropzone').getByText(/Соус|соус/i)
  ).toBeVisible();

  await page.getByRole('button', { name: 'Оформить заказ' }).click();

  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText('Ваш заказ начали готовить')).toBeVisible();
  await expect(page.getByText('#4242')).toBeVisible();
});
