/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import {useAuthStore} from '../src/store/useAuthStore';
import * as SecureStore from 'expo-secure-store';

test('renders correctly', async () => {
  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(<App />);
    await Promise.resolve();
    await Promise.resolve();
  });
});

test('authenticated app mounts the drawer, tabs and home without navigation API errors', async () => {
  (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('navigation-smoke-token');
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(<App />);
    await Promise.resolve();
    await Promise.resolve();
  });
  expect(useAuthStore.getState().token).toBe('navigation-smoke-token');
  expect(tree.toJSON()).toBeTruthy();
  await ReactTestRenderer.act(async () => {tree.unmount(); await useAuthStore.getState().logout();});
});
