import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice';
import burgerConstructorReducer from '../features/burgerConstructor/burgerConstructorSlice';
import ingredientsReducer from '../features/ingredients/ingredientsSlice';
import orderReducer from '../features/order/orderSlice';
import ordersFeedReducer from '../features/ordersFeed/ordersFeedSlice';
import profileOrdersReducer from '../features/profileOrders/profileOrdersSlice';
import selectedIngredientReducer from '../features/selectedIngredient/selectedIngredientSlice';
import {
  ordersFeedSocketMiddleware,
  profileOrdersSocketMiddleware,
} from '../middleware/socketMiddleware';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    selectedIngredient: selectedIngredientReducer,
    order: orderReducer,
    burgerConstructor: burgerConstructorReducer,
    auth: authReducer,
    ordersFeed: ordersFeedReducer,
    profileOrders: profileOrdersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      ordersFeedSocketMiddleware,
      profileOrdersSocketMiddleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
