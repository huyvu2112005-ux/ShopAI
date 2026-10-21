import React from 'react';
import {act, fireEvent, render, screen} from '@testing-library/react-native';
import ShopExperience from '../src/components/ShopExperience';
import {ThemeProvider} from '../src/contexts/ThemeContext';
import i18n from '../src/i18n';

afterEach(async () => {await act(async () => {await i18n.changeLanguage('vi');}); jest.useRealTimers();});
test('Home exercise switches English and Vietnamese using the real i18n instance', async () => {
  await render(<ThemeProvider><ShopExperience /></ThemeProvider>);
  await fireEvent.press(screen.getByRole('button', {name: 'English'}));
  expect(screen.getByText('Welcome to ShopAI')).toBeOnTheScreen();
  await fireEvent.press(screen.getByRole('button', {name: 'Tiếng Việt'}));
  expect(screen.getByText('Chào mừng bạn đến với ShopAI')).toBeOnTheScreen();
});
test('Home countdown starts, advances, pauses and cleans up its interval', async () => {
  jest.useFakeTimers();
  await render(<ThemeProvider><ShopExperience /></ThemeProvider>);
  await fireEvent.press(screen.getByRole('button', {name: 'Bắt đầu đếm ngược'}));
  await act(async () => {jest.advanceTimersByTime(1000);});
  expect(screen.getByText('Đếm ngược: 9 giây')).toBeOnTheScreen();
  await fireEvent.press(screen.getByRole('button', {name: 'Tạm dừng'}));
  await act(async () => {jest.advanceTimersByTime(2000);});
  expect(screen.getByText('Đếm ngược: 9 giây')).toBeOnTheScreen();
});
