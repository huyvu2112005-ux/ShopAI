import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

import {Product} from '../data/mockProducts';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => boolean;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => boolean;
  clearCart: () => void;
  completeCheckout: (purchased: {id: string; quantity: number}[]) => void;
  totalQuantity: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const existingItem = get().items.find(item => item.id === product.id);
        const currentQuantity = existingItem?.quantity ?? 0;
        const stockLimit = Math.min(product.stock, existingItem?.stock ?? product.stock, 100);
        if (!Number.isInteger(quantity) || quantity < 1 || !Number.isFinite(stockLimit) || currentQuantity + quantity > stockLimit) {
          return false;
        }
        set(state => {
          const existing = state.items.find(item => item.id === product.id);

          if (existing) {
            return {
              items: state.items.map(item =>
                item.id === product.id
                  ? {...product, quantity: item.quantity + quantity}
                  : item,
              ),
            };
          }

          return {items: [...state.items, {...product, quantity}]};
        });
        return true;
      },
      removeItem: productId =>
        set(state => ({
          items: state.items.filter(item => item.id !== productId),
        })),
      setQuantity: (productId, quantity) => {
        const item = get().items.find(product => product.id === productId);
        if (!item || !Number.isInteger(quantity) || quantity < 1 || quantity > Math.min(item.stock, 100)) {return false;}
        set(state => ({items: state.items.map(product => product.id === productId ? {...product, quantity} : product)}));
        return true;
      },
      clearCart: () => set({items: []}),
      completeCheckout: purchased => set(state => ({
        items: state.items.map(item => ({
          ...item,
          quantity: item.quantity - (purchased.find(product => product.id === item.id)?.quantity ?? 0),
        })).filter(item => item.quantity > 0),
      })),
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
