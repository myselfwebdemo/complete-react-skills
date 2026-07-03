import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice';
import burgerConstructorReducer from '../features/burgerConstructor/burgerConstructorSlice';
import ingredientsReducer from '../features/ingredients/ingredientsSlice';
import orderReducer from '../features/order/orderSlice';
import selectedIngredientReducer from '../features/selectedIngredient/selectedIngredientSlice';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    selectedIngredient: selectedIngredientReducer,
    order: orderReducer,
    burgerConstructor: burgerConstructorReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
