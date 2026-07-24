import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TWSOrder } from '../../utils/orders';

type ProfileOrdersState = {
  orders: TWSOrder[];
  total: number;
  totalToday: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  isConnected: boolean;
};

export const initialState: ProfileOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  status: 'idle',
  error: null,
  isConnected: false,
};

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
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
  wsConnect: connectProfileOrders,
  wsDisconnect: disconnectProfileOrders,
  wsOpen: profileOrdersOpen,
  wsClose: profileOrdersClose,
  wsError: profileOrdersError,
  ordersReceived: profileOrdersReceived,
} = profileOrdersSlice.actions;

export default profileOrdersSlice.reducer;
