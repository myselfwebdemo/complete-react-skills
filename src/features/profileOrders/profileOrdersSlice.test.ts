import { describe, expect, it } from 'vitest';

import reducer, {
  connectProfileOrders,
  disconnectProfileOrders,
  profileOrdersClose,
  profileOrdersError,
  profileOrdersOpen,
  profileOrdersReceived,
} from './profileOrdersSlice';

describe('profileOrdersSlice', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      status: 'idle',
      error: null,
      isConnected: false,
    });
  });

  it('sets loading state on connect', () => {
    const state = reducer(
      {
        orders: [],
        total: 0,
        totalToday: 0,
        status: 'idle',
        error: null,
        isConnected: false,
      },
      connectProfileOrders()
    );

    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('marks profile orders feed as connected', () => {
    const state = reducer(
      {
        orders: [],
        total: 0,
        totalToday: 0,
        status: 'loading',
        error: null,
        isConnected: false,
      },
      profileOrdersOpen()
    );

    expect(state.isConnected).toBe(true);
    expect(state.status).toBe('succeeded');
    expect(state.error).toBeNull();
  });

  it('disconnects the socket', () => {
    const state = reducer(
      {
        orders: [],
        total: 0,
        totalToday: 0,
        status: 'succeeded',
        error: null,
        isConnected: true,
      },
      disconnectProfileOrders()
    );

    expect(state.isConnected).toBe(false);
  });

  it('closes the socket', () => {
    const state = reducer(
      {
        orders: [],
        total: 0,
        totalToday: 0,
        status: 'succeeded',
        error: null,
        isConnected: true,
      },
      profileOrdersClose()
    );

    expect(state.isConnected).toBe(false);
  });

  it('stores an error', () => {
    const state = reducer(
      {
        orders: [],
        total: 0,
        totalToday: 0,
        status: 'loading',
        error: null,
        isConnected: true,
      },
      profileOrdersError('Socket error')
    );

    expect(state.status).toBe('failed');
    expect(state.error).toBe('Socket error');
    expect(state.isConnected).toBe(false);
  });

  it('stores incoming profile orders', () => {
    const payload = {
      orders: [
        {
          _id: 'order-1',
          ingredients: ['bun', 'sauce'],
          status: 'done',
          name: 'Burger',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          number: 1,
        },
      ],
      total: 5,
      totalToday: 1,
    };

    const state = reducer(
      {
        orders: [],
        total: 0,
        totalToday: 0,
        status: 'loading',
        error: null,
        isConnected: true,
      },
      profileOrdersReceived(payload)
    );

    expect(state.orders).toEqual(payload.orders);
    expect(state.total).toBe(5);
    expect(state.totalToday).toBe(1);
    expect(state.status).toBe('succeeded');
    expect(state.error).toBeNull();
  });
});
