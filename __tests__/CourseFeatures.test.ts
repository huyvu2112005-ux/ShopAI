import {getStateFromPath} from '@react-navigation/native';
import {linking} from '../src/navigation/linking';
import {productCodeFromScan} from '../src/utils/scanCode';
import {useCartStore} from '../src/store/useCartStore';
import {MOCK_PRODUCTS} from '../src/data/mockProducts';
import {store} from '../src/store/redux/store';
import {increment, resetCounter} from '../src/store/redux/counterSlice';

beforeEach(() => {useCartStore.getState().clearCart(); store.dispatch(resetCounter());});
test('cart quantity rejects invalid values and respects available stock', () => {
  const product = {...MOCK_PRODUCTS[0], stock: 3};
  expect(useCartStore.getState().addItem(product)).toBe(true);
  for (const quantity of [0, -1, 1.5, 4, NaN]) {
    expect(useCartStore.getState().setQuantity(product.id, quantity)).toBe(false);
  }
  expect(useCartStore.getState().setQuantity(product.id, 3)).toBe(true);
  expect(useCartStore.getState().totalPrice()).toBe(product.price * 3);
  expect(useCartStore.getState().addItem(product)).toBe(false);
});
test('Redux practice counter does not mutate the persisted shopping cart', () => {
  useCartStore.getState().addItem(MOCK_PRODUCTS[0], 2);
  store.dispatch(increment());
  expect(store.getState().counter.value).toBe(1);
  expect(useCartStore.getState().totalQuantity()).toBe(2);
});
test('product deep links reach the detail inside the drawer and home stack', () => {
  const state = getStateFromPath('product/backend_prod_19', linking.config);
  const shop = state!.routes[0];
  expect(shop.name).toBe('Shop');
  const home = shop.state!.routes[0].state!.routes[0];
  expect(home.name).toBe('HomeTab');
  expect(home.state!.routes.map(route => route.name)).toEqual(['Home', 'ProductDetail']);
  expect(home.state!.routes[1].params).toEqual({productId: 'backend_prod_19'});
});
test('QR links normalize encoded identifiers without failing on malformed codes', () => {
  expect(productCodeFromScan(' shopai://product/phone%201?ref=qr ')).toBe('phone 1');
  expect(productCodeFromScan('8936117530045')).toBe('8936117530045');
  expect(productCodeFromScan('%broken')).toBe('%broken');
});
