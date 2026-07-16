import { describe, expect, it } from 'vitest';

import reducer, { fetchIngredients } from './ingredientsSlice';

import type { TIngredient } from '@/utils/types';

const ingredient: TIngredient = {
  _id: 'ing-1',
  name: 'Ингредиент',
  type: 'main',
  proteins: 5,
  fat: 6,
  carbohydrates: 7,
  calories: 8,
  price: 9,
  image: 'ing.png',
  image_large: 'ing-large.png',
  image_mobile: 'ing-mobile.png',
  __v: 0,
};

describe('ingredientsSlice', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      items: [],
      status: 'idle',
      error: null,
    });
  });

  it('sets loading status while fetching ingredients', () => {
    const state = reducer(
      { items: [], status: 'idle', error: null },
      fetchIngredients.pending('request-id')
    );

    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('stores fetched ingredients on success', () => {
    const state = reducer(
      { items: [], status: 'loading', error: null },
      fetchIngredients.fulfilled([ingredient], 'request-id')
    );

    expect(state.status).toBe('succeeded');
    expect(state.items).toEqual([ingredient]);
  });

  it('stores an error on failure', () => {
    const state = reducer(
      { items: [], status: 'loading', error: null },
      {
        type: fetchIngredients.rejected.type,
        payload: 'Ошибка загрузки',
        error: { message: 'Ошибка загрузки' },
        meta: { requestId: 'request-id', arg: undefined, aborted: false },
      }
    );

    expect(state.status).toBe('failed');
    expect(state.error).toBe('Ошибка загрузки');
  });
});
