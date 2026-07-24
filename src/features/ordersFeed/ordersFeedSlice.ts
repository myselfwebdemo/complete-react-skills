import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TWSOrder } from '../../utils/orders';

type OrdersFeedState = {
  orders: TWSOrder[];
  total: number;
  totalToday: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  isConnected: boolean;
};

export const initialState: OrdersFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  status: 'idle',
  error: null,
  isConnected: false,
};

const ordersFeedSlice = createSlice({
  name: 'ordersFeed',
  initialState,
  reducers: {
    wsConnect: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    wsDisconnect: (state) => {
      state.isConnected = false;
    },
    wsOpen: (state) => {
      state.isConnected = true;
      state.status = 'succeeded';
      state.error = null;
    },
    wsClose: (state) => {
      state.isConnected = false;
    },
    wsError: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
      state.isConnected = false;
    },
    ordersReceived: (
      state,
      action: PayloadAction<{ orders: TWSOrder[]; total: number; totalToday: number }>
    ) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.status = 'succeeded';
      state.error = null;
    },
  },
});

export const {
  wsConnect: connectOrdersFeed,
  wsDisconnect: disconnectOrdersFeed,
  wsOpen: ordersFeedOpen,
  wsClose: ordersFeedClose,
  wsError: ordersFeedError,
  ordersReceived: ordersFeedReceived,
} = ordersFeedSlice.actions;

export default ordersFeedSlice.reducer;
