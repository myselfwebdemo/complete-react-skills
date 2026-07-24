import checkResponse from '@/utils/check-response';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { API_BASE_URL } from '@utils/constants';

import type { TIngredient } from '@utils/types';

type IngredientsState = {
  items: TIngredient[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

export const initialState: IngredientsState = {
  items: [],
  status: 'idle',
  error: null,
};

type TIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/ingredients`).then(
      checkResponse<TIngredientsResponse>
    );
    if (!res?.success || !Array.isArray(res.data))
      return rejectWithValue('Получены некорректные данные от сервера');

    return res.data;
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Неизвестная ошибка');
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Ошибка загрузки';
      });
  },
});

export default ingredientsSlice.reducer;
