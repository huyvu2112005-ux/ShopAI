import {useCartStore} from '../src/store/useCartStore';
import {Product} from '../src/data/mockProducts';
const phone: Product = {id: 'phone', name: 'Phone', price: 1200000, stock: 8, image: {uri: 'https://example.com/a.jpg'}, category: 'Phone', rating: 4.5, description: 'Phone', specs: []};
const headphones = {...phone, id: 'headphones', name: 'Headphones', price: 350000};
const cart = () => useCartStore.getState();
beforeEach(() => cart().clearCart());
describe('cart money and quantity invariants', () => {
  test('empty cart totals are zero; removing a missing item is safe', () => {
    cart().removeItem('missing');
    expect(cart().items).toEqual([]);
    expect(cart().totalPrice()).toBe(0);
    expect(cart().totalQuantity()).toBe(0);
  });
  test('same product merges quantities and different products retain their prices', () => {
    expect(cart().addItem(phone)).toBe(true);
    expect(cart().addItem(phone, 2)).toBe(true);
    cart().addItem(headphones, 2);
    expect(cart().items).toHaveLength(2);
    expect(cart().items[0].quantity).toBe(3);
    expect(cart().totalQuantity()).toBe(5);
    expect(cart().totalPrice()).toBe(4300000);
  });
  test.each([0, -1, 1.5, NaN, Infinity, 9])('rejects invalid add quantity %p without mutating money', quantity => {
    expect(cart().addItem(phone, quantity)).toBe(false);
    expect(cart().totalPrice()).toBe(0);
  });
  test('sold-out, unknown stock, and per-order ceiling are enforced', () => {
    expect(cart().addItem({...phone, stock: 0})).toBe(false);
    expect(cart().addItem({...phone, stock: NaN})).toBe(false);
    expect(cart().addItem({...phone, stock: 1000}, 101)).toBe(false);
    expect(cart().addItem({...phone, stock: 1000}, 100)).toBe(true);
    expect(cart().addItem({...phone, stock: 1000})).toBe(false);
  });
  test('reduced catalog stock cannot be exceeded by merging into existing cart', () => {
    cart().addItem(phone, 3);
    expect(cart().addItem({...phone, stock: 3})).toBe(false);
    expect(cart().totalQuantity()).toBe(3);
  });
  test('set quantity updates totals and remove only removes the selected item', () => {
    cart().addItem(phone); cart().addItem(headphones);
    expect(cart().setQuantity(phone.id, 2)).toBe(true);
    expect(cart().setQuantity('missing', 2)).toBe(false);
    cart().removeItem(headphones.id);
    expect(cart().totalPrice()).toBe(2400000);
    cart().clearCart();
    expect(cart().totalQuantity()).toBe(0);
  });
  test('checkout subtracts only the submitted snapshot; items added meanwhile remain', () => {
    cart().addItem(phone, 3); cart().addItem(headphones);
    cart().completeCheckout([{id: phone.id, quantity: 2}]);
    expect(cart().items.map(item => [item.id, item.quantity])).toEqual([['phone', 1], ['headphones', 1]]);
    cart().completeCheckout([{id: phone.id, quantity: 1}, {id: headphones.id, quantity: 1}]);
    expect(cart().items).toEqual([]);
  });
});
