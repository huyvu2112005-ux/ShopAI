import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {TextInput} from 'react-native';
import AIChatScreen from '../src/screens/AIChatScreen';
import {ShopButton} from '../src/components/ui/ShopButton';
import {askShopAI} from '../src/services/shopApi';
import axiosClient from '../src/api/axiosClient';
import {fetchProductById, fetchProductsPage} from '../src/services/productQuery';

jest.mock('../src/api/axiosClient', () => ({__esModule: true, default: {get: jest.fn(), post: jest.fn()}}));
jest.mock('../src/services/shopApi', () => ({askShopAI: jest.fn(), apiError: () => 'Lỗi kết nối'}));
const ask = askShopAI as jest.MockedFunction<typeof askShopAI>;
const get = axiosClient.get as jest.Mock;
const raw = {id: 'backend_prod_0', name: 'Phone', price: 1000000, image: '/assets/products/phone.jpg', category: 'Điện thoại', rating: 4.5, stock: 10, description: 'Phone', specs: []};

beforeEach(() => {jest.clearAllMocks();});

test('catalog and product detail use server data and reject invalid prices', async () => {
  get.mockResolvedValueOnce({data: {items: Array.from({length: 4}, (_, i) => ({...raw, id: `backend_prod_${16 + i}`})), nextPage: null, total: 20}});
  const page = await fetchProductsPage({pageParam: 3});
  expect(get).toHaveBeenCalledWith('/api/products', {params: {page: 3, limit: 8}});
  expect(page.items).toHaveLength(4);
  expect(page.nextPage).toBeNull();
  expect(page.items[0].image.uri).toContain('/assets/products/phone.jpg');
  get.mockResolvedValueOnce({data: {...raw, price: -100}});
  await expect(fetchProductById(raw.id)).rejects.toThrow();
});

test('chat retries the failed question and keeps successful conversation context', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {renderer = ReactTestRenderer.create(<AIChatScreen />);});
  const type = async (value: string) => {
    await ReactTestRenderer.act(async () => {renderer!.root.findByType(TextInput).props.onChangeText(value);});
  };
  const press = async (title: string) => {
    await ReactTestRenderer.act(async () => {
      renderer!.root.findAllByType(ShopButton).find(button => button.props.title === title)!.props.onPress();
      await new Promise<void>(resolve => setTimeout(() => resolve(), 0));
    });
  };
  ask.mockResolvedValueOnce('Chọn điện thoại A');
  await type('Tư vấn điện thoại');
  await press('Gửi');
  expect(ask).toHaveBeenLastCalledWith('Tư vấn điện thoại', []);
  ask.mockRejectedValueOnce(new Error('offline'));
  await type('Có camera tốt không?');
  await press('Gửi');
  expect(renderer!.root.findAllByType(ShopButton).find(button => button.props.title === 'Gửi')!.props.disabled).toBe(true);
  ask.mockResolvedValueOnce('Camera tốt');
  await press('Thử lại');
  expect(ask).toHaveBeenLastCalledWith('Có camera tốt không?', [
    {role: 'user', text: 'Tư vấn điện thoại'},
    {role: 'model', text: 'Chọn điện thoại A'},
  ]);
  expect(renderer!.root.findAllByType(ShopButton).some(button => button.props.title === 'Thử lại')).toBe(false);
  await ReactTestRenderer.act(async () => {renderer!.unmount();});
});
