import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils/types';

export const initialState = null as TIngredient | null;

const selectedIngredientSlice = createSlice({
  name: 'selectedIngredient',
  initialState,
  reducers: {
    selectIngredient: (_state, action: PayloadAction<TIngredient>) => action.payload,
    clearSelectedIngredient: () => null,
  },
});

export const { selectIngredient, clearSelectedIngredient } =
  selectedIngredientSlice.actions;

export default selectedIngredientSlice.reducer;
