import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Product } from "../data/mockProducts";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: any;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartPayload = Product | CartItem;

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartPayload>) => {
      const payloadItem = {
        ...action.payload,
        quantity: "quantity" in action.payload ? action.payload.quantity : 1,
      };

      const existingItem = state.items.find(item => item.id === payloadItem.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...payloadItem,
          quantity: payloadItem.quantity,
        });
      }
    },

    removeProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    clearCart: state => {
      state.items = [];
    },
  },
});

export const { addToCart, removeProduct, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
