import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import CheckoutScreen from '../src/screens/CheckoutScreen';
import OrderDetailScreen from '../src/screens/OrderDetailScreen';
import ProductDetailScreen from '../src/screens/ProductDetailScreen';
import {TouchableOpacity} from 'react-native';
import {ShopButton} from '../src/components/ui/ShopButton';
import {useCartStore} from '../src/store/useCartStore';
import axiosClient from '../src/api/axiosClient';
import {recordNonFatal} from '../src/services/crashReporting';
import {Product} from '../src/data/mockProducts';

jest.mock('@react-navigation/native', () => ({useNavigation: () => ({navigate: jest.fn()})}));
jest.mock('../src/components/LocationBadge', () => () => null);
jest.mock('../src/api/axiosClient', () => ({__esModule: true, default: {post: jest.fn(), get: jest.fn()}}));
jest.mock('../src/services/crashReporting', () => ({addCrashBreadcrumb: jest.fn(), recordNonFatal: jest.fn(), setCrashContext: jest.fn()}));
const post = axiosClient.post as jest.Mock;
const get = axiosClient.get as jest.Mock;
const product: Product = {id: 'p1', name: 'Phone', price: 1000000, image: {uri: 'https://example.com/phone.jpg'}, category: 'Phone', rating: 4, stock: 10, description: '', specs: []};
const order = {id: 'order-1', total: product.price, status: 'PENDING', createdAt: '2026-10-15T00:00:00.000Z', items: [{id: 'item-1', productId: product.id, name: product.name, price: product.price, quantity: 1}]};
const tick = () => new Promise<void>(resolve => setTimeout(resolve, 20));
let renderer: ReactTestRenderer.ReactTestRenderer;
let client: QueryClient;

beforeEach(() => {
  jest.clearAllMocks();
  useCartStore.setState({items: [{...product, quantity: 1}]});
  client = new QueryClient({defaultOptions: {queries: {retry: false, gcTime: Infinity}, mutations: {retry: false, gcTime: Infinity}}});
});
afterEach(async () => {
  if (renderer) {await act(async () => renderer.unmount());}
  client.clear();
});
async function render(child: React.ReactNode) {
  await act(async () => {renderer = ReactTestRenderer.create(<QueryClientProvider client={client}>{child}</QueryClientProvider>); await tick();});
}

test.each(['network failure', 'malformed success'])('checkout preserves the cart on %s and records a non-fatal', async failure => {
  if (failure === 'network failure') {post.mockRejectedValueOnce(new Error('offline'));}
  else {post.mockResolvedValueOnce({data: {id: 'incomplete-order'}});}
  await render(<CheckoutScreen />);
  await act(async () => {renderer.root.findByType(ShopButton).props.onPress(); await tick();});
  expect(useCartStore.getState().items).toHaveLength(1);
  expect(recordNonFatal).toHaveBeenCalledWith(expect.any(Error), 'CheckoutOrderFailed');
  expect(renderer.root.findByType(ShopButton).props.title).toBe('Xác nhận đặt hàng');
});

test('double tap submits once and checkout preserves items added while the request is pending', async () => {
  let resolveResponse!: (response: unknown) => void;
  post.mockReturnValueOnce(new Promise(resolve => {resolveResponse = resolve;}));
  await render(<CheckoutScreen />);
  const confirm = renderer.root.findByType(ShopButton).props.onPress;
  await act(async () => {confirm(); confirm(); await tick();});
  expect(post).toHaveBeenCalledTimes(1);
  await act(async () => {
    useCartStore.getState().addItem(product);
    useCartStore.getState().addItem({...product, id: 'p2'});
    resolveResponse({data: order});
    await tick();
  });
  expect(useCartStore.getState().items.map(({id, quantity}) => ({id, quantity}))).toEqual([{id: 'p1', quantity: 1}, {id: 'p2', quantity: 1}]);
  expect(renderer.root.findByType(ShopButton).props.title).toBe('Xem lịch sử đơn hàng');
});

test('a successful payment remains PAID even when the background refresh is offline', async () => {
  get.mockResolvedValueOnce({data: order}).mockRejectedValue(new Error('offline'));
  post.mockResolvedValueOnce({data: {...order, status: 'PAID'}});
  await render(<OrderDetailScreen route={{key: 'order', name: 'OrderDetail', params: {orderId: order.id}}} navigation={{} as never} />);
  await act(async () => {await tick();});
  await act(async () => {renderer.root.findByType(ShopButton).props.onPress(); await tick();});
  expect(client.getQueryData(['orders', order.id])).toEqual({...order, status: 'PAID'});
  expect(renderer.root.findAllByType(ShopButton)).toHaveLength(0);
});

test('product quantity controls add the selected amount and stop at server stock', async () => {
  useCartStore.setState({items: []});
  get.mockResolvedValue({data: {...product, image: 'https://example.com/phone.jpg', stock: 2}});
  await render(<ProductDetailScreen route={{key: 'product', name: 'ProductDetail', params: {productId: product.id}}} navigation={{} as never} />);
  await act(async () => {await tick();});
  const increase = () => renderer.root.findAllByType(TouchableOpacity).find(button => button.props.accessibilityLabel === 'Tăng số lượng')!;
  await act(async () => {increase().props.onPress();});
  expect(increase().props.disabled).toBe(true);
  await act(async () => {renderer.root.findAllByType(ShopButton).find(button => button.props.testID === 'add-to-cart')!.props.onPress();});
  expect(useCartStore.getState().items[0].quantity).toBe(2);
  expect(renderer.root.findAllByType(ShopButton).find(button => button.props.testID === 'add-to-cart')!.props.disabled).toBe(true);
  expect(useCartStore.getState().addItem(product)).toBe(false);
});
