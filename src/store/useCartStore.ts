import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

import {Product} from '../data/mockProducts';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  totalQuantity: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: product =>
        set(state => {
          const existing = state.items.find(item => item.id === product.id);

          if (existing) {
            return {
              items: state.items.map(item =>
                item.id === product.id
                  ? {...item, quantity: item.quantity + 1}
                  : item,
              ),
            };
          }

          return {items: [...state.items, {...product, quantity: 1}]};
        }),
      removeItem: productId =>
        set(state => ({
          items: state.items.filter(item => item.id !== productId),
        })),
      clearCart: () => set({items: []}),
      totalQuantity: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
      totalPrice: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: 'shopai-cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({items: state.items}),
    },
  ),
);
