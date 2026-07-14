import type { TIngredient } from './types';

export type TWSOrderStatus = 'done' | 'pending' | 'created';

export type TWSOrder = {
  ingredients: string[];
  _id: string;
  status: TWSOrderStatus;
  number: number;
  createdAt: string;
  updatedAt: string;
  name?: string;
};

export type TWSOrdersResponse = {
  success: boolean;
  orders: TWSOrder[];
  total: number;
  totalToday: number;
  message?: string;
};

export type TOrderIngredientDetails = TIngredient & {
  count: number;
};

export const isValidWSOrder = (order: unknown): order is TWSOrder => {
  if (typeof order !== 'object' || order === null) return false;
  const payload = order as Record<string, unknown>;
  if (!Array.isArray(payload.ingredients)) return false;
  if (!payload.ingredients.every((id) => typeof id === 'string')) return false;
  if (typeof payload._id !== 'string') return false;
  if (
    payload.status !== 'done' &&
    payload.status !== 'pending' &&
    payload.status !== 'created'
  )
    return false;
  if (typeof payload.number !== 'number') return false;
  if (typeof payload.createdAt !== 'string') return false;
  if (typeof payload.updatedAt !== 'string') return false;
  return true;
};

export const isValidWSOrdersResponse = (
  payload: unknown
): payload is TWSOrdersResponse => {
  if (typeof payload !== 'object' || payload === null) return false;
  const response = payload as Record<string, unknown>;
  if (response.success !== true) return false;
  if (!Array.isArray(response.orders)) return false;
  if (!response.orders.every((order) => isValidWSOrder(order))) return false;
  if (typeof response.total !== 'number') return false;
  if (typeof response.totalToday !== 'number') return false;
  return true;
};

export const getOrderDisplayName = (order: TWSOrder): string => `Заказ №${order.number}`;

export const calculateOrderCost = (
  order: TWSOrder,
  ingredients: TIngredient[]
): number | null => {
  let total = 0;

  for (const ingredientId of order.ingredients) {
    const ingredient = ingredients.find((item) => item._id === ingredientId);
    if (!ingredient) return null;
    total += ingredient.price;
  }

  return total;
};

export const getOrderIngredientsWithCount = (
  order: TWSOrder,
  ingredients: TIngredient[]
): TOrderIngredientDetails[] | null => {
  const ingredientMap = new Map<string, TOrderIngredientDetails>();

  for (const ingredientId of order.ingredients) {
    const ingredient = ingredients.find((item) => item._id === ingredientId);
    if (!ingredient) return null;

    const existing = ingredientMap.get(ingredientId);
    if (existing) {
      ingredientMap.set(ingredientId, { ...existing, count: existing.count + 1 });
    } else {
      ingredientMap.set(ingredientId, { ...ingredient, count: 1 });
    }
  }

  return Array.from(ingredientMap.values());
};

export const getOrderIngredientPreview = (
  order: TWSOrder,
  ingredients: TIngredient[],
  maxItems = 5
): TIngredient[] | null => {
  const uniqueIds: string[] = [];
  for (const ingredientId of order.ingredients) {
    if (!uniqueIds.includes(ingredientId)) {
      uniqueIds.push(ingredientId);
    }
  }

  const previewIngredients: TIngredient[] = [];
  for (const id of uniqueIds) {
    const ingredient = ingredients.find((item) => item._id === id);
    if (!ingredient) return null;
    previewIngredients.push(ingredient);
    if (previewIngredients.length >= maxItems) break;
  }

  return previewIngredients;
};

export const getStatusColumns = (numbers: number[]): number[][] => {
  const chunks: number[][] = [];
  for (let i = 0; i < numbers.length && chunks.length < 2; i += 10) {
    chunks.push(numbers.slice(i, i + 10));
  }
  return chunks;
};

export const getStatusTitle = (status: TWSOrderStatus): string => {
  if (status === 'done') return 'Выполнено';
  if (status === 'pending') return 'Готовится';
  return 'Создан';
};
