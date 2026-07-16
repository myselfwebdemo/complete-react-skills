import { describe, expect, it } from 'vitest';

import reducer, {
  clearSelectedIngredient,
  selectIngredient,
} from './selectedIngredientSlice';

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

describe('selectedIngredientSlice', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toBeNull();
  });

  it('selects an ingredient', () => {
    expect(reducer(null, selectIngredient(ingredient))).toEqual(ingredient);
  });

  it('clears the selected ingredient', () => {
    expect(reducer(ingredient, clearSelectedIngredient())).toBeNull();
  });
});
