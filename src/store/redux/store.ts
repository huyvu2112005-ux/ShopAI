import {configureStore} from '@reduxjs/toolkit';
import cart from './cartSlice';
import counter from './counterSlice';
export const store = configureStore({reducer: {cart, counter}});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
