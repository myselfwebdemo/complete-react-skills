import { describe, expect, it } from 'vitest';

import reducer, { createOrder, initialState } from './orderSlice';

describe('orderSlice', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('sets loading state while creating an order', () => {
    const state = reducer(
      { number: null, status: 'idle', error: null },
      createOrder.pending('request-id', ['bun', 'sauce'])
    );

    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
    expect(state.number).toBeNull();
  });

  it('stores the created order number on success', () => {
    const state = reducer(
      { number: null, status: 'loading', error: null },
      createOrder.fulfilled('12345', 'request-id', ['bun', 'sauce'])
    );

    expect(state.status).toBe('succeeded');
    expect(state.number).toBe('12345');
  });

  it('stores an error on failure', () => {
    const state = reducer(
      { number: null, status: 'loading', error: null },
      {
        type: createOrder.rejected.type,
        payload: 'Ошибка создания заказа',
        error: { message: 'Ошибка создания заказа' },
        meta: { requestId: 'request-id', arg: ['bun', 'sauce'], aborted: false },
      }
    );

    expect(state.status).toBe('failed');
    expect(state.error).toBe('Ошибка создания заказа');
  });
});
