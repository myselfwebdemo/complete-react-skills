import { describe, expect, it } from 'vitest';

import reducer, {
  addBun,
  addIngredient,
  clearConstructor,
  moveIngredient,
  removeIngredient,
} from './burgerConstructorSlice';

import type { TIngredient } from '@/utils/types';

const bun: TIngredient = {
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

const sauce: TIngredient = {
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

describe('burgerConstructorSlice', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('adds bun with generated unique id', () => {
    const state = reducer({ bun: null, ingredients: [] }, addBun(bun));

    expect(state.bun).toBeDefined();
    expect(state.bun).toMatchObject(bun);
    if (!state.bun) {
      throw new Error('Expected bun to be present');
    }
    expect(typeof state.bun.uniqueId).toBe('string');
    expect(state.ingredients).toEqual([]);
  });

  it('adds non-bun ingredient with generated unique id', () => {
    const state = reducer({ bun: null, ingredients: [] }, addIngredient(sauce));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toBeDefined();
    if (!state.ingredients[0]) {
      throw new Error('Expected ingredient to be present');
    }
    expect(state.ingredients[0]).toMatchObject(sauce);
    expect(typeof state.ingredients[0].uniqueId).toBe('string');
  });

  it('removes ingredient by unique id', () => {
    const state = reducer(
      {
        bun: null,
        ingredients: [
          { ...sauce, uniqueId: 'unique-1' },
          { ...bun, uniqueId: 'unique-2' },
        ],
      },
      removeIngredient('unique-1')
    );

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].uniqueId).toBe('unique-2');
  });

  it('moves ingredient to another position', () => {
    const first = { ...sauce, uniqueId: 'unique-1' };
    const second = { ...bun, uniqueId: 'unique-2' };
    const state = reducer(
      { bun: null, ingredients: [first, second] },
      moveIngredient({ from: 0, to: 1 })
    );

    expect(state.ingredients.map((item) => item.uniqueId)).toEqual([
      'unique-2',
      'unique-1',
    ]);
  });

  it('clears constructor state', () => {
    const state = reducer(
      {
        bun: { ...bun, uniqueId: 'unique-bun' },
        ingredients: [{ ...sauce, uniqueId: 'unique-sauce' }],
      },
      clearConstructor()
    );

    expect(state).toEqual({ bun: null, ingredients: [] });
  });
});
