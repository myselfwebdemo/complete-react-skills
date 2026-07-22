import { describe, expect, it } from 'vitest';

import reducer, {
  connectOrdersFeed,
  disconnectOrdersFeed,
  initialState,
  ordersFeedClose,
  ordersFeedError,
  ordersFeedOpen,
  ordersFeedReceived,
} from './ordersFeedSlice';

describe('ordersFeedSlice', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
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
      connectOrdersFeed()
    );

    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('marks feed as connected on open', () => {
    const state = reducer(
      {
        orders: [],
        total: 0,
        totalToday: 0,
        status: 'loading',
        error: null,
        isConnected: false,
      },
      ordersFeedOpen()
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
      disconnectOrdersFeed()
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
      ordersFeedClose()
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
      ordersFeedError('Socket error')
    );

    expect(state.status).toBe('failed');
    expect(state.error).toBe('Socket error');
    expect(state.isConnected).toBe(false);
  });

  it('stores incoming feed orders', () => {
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
      total: 10,
      totalToday: 2,
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
      ordersFeedReceived(payload)
    );

    expect(state.orders).toEqual(payload.orders);
    expect(state.total).toBe(10);
    expect(state.totalToday).toBe(2);
    expect(state.status).toBe('succeeded');
    expect(state.error).toBeNull();
  });
});
