import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ImageSourcePropType} from 'react-native';
type DemoItem = {id: string; name: string; price: number; image: ImageSourcePropType; quantity: number};
const cartSlice = createSlice({name: 'cart', initialState: {items: [] as DemoItem[]}, reducers: {
  addToCart: (state, {payload}: PayloadAction<Omit<DemoItem, 'quantity'> & {quantity?: number}>) => {
    const quantity = payload.quantity ?? 1;
    if (!Number.isInteger(quantity) || quantity < 1 || !Number.isFinite(payload.price) || payload.price < 0) {return;}
    const existing = state.items.find(item => item.id === payload.id);
    if (existing) {existing.quantity += quantity;} else {state.items.push({...payload, quantity});}
  },
  removeProduct: (state, action: PayloadAction<string>) => {state.items = state.items.filter(item => item.id !== action.payload);},
  clearCart: state => {state.items = [];},
}});
export const {addToCart, removeProduct, clearCart} = cartSlice.actions;
export default cartSlice.reducer;
