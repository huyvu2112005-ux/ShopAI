import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react-native';
import ShopButton from '../src/components/ui/ShopButton';
describe('ShopButton: real Pressable integration', () => {
  test('shows its title and invokes the action once', async () => {
    const press = jest.fn();
    await render(<ShopButton title="Confirm order" onPress={press} />);
    const button = screen.getByRole('button', {name: 'Confirm order'});
    expect(screen.getByText('Confirm order')).toBeOnTheScreen();
    await fireEvent.press(button);
    expect(press).toHaveBeenCalledTimes(1);
  });
  test('disabled prevents pressing', async () => {
    const press = jest.fn();
    await render(<ShopButton title="Confirm order" disabled onPress={press} />);
    const button = screen.getByRole('button', {name: 'Confirm order'});
    expect(button).toBeDisabled();
    await fireEvent.press(button);
    expect(press).not.toHaveBeenCalled();
  });
  test.each(['loading', 'isLoading'] as const)('%s displays progress and prevents duplicate actions', async flag => {
    const press = jest.fn();
    await render(<ShopButton title="Pay" {...{[flag]: true}} onPress={press} />);
    const button = screen.getByRole('button', {name: 'Pay'});
    expect(button).toBeDisabled();
    expect(button).toBeBusy();
    expect(screen.queryByText('Pay')).toBeNull();
    await fireEvent.press(button);
    expect(press).not.toHaveBeenCalled();
  });
  test.each(['primary', 'secondary', 'outline'] as const)('%s keeps accessible label and custom styles', async variant => {
    await render(<ShopButton title="Buy" accessibilityLabel="Buy this item" testID="buy" variant={variant} style={{marginTop: 12}} textStyle={{fontSize: 18}} onPress={() => {}} />);
    expect(screen.getByRole('button', {name: 'Buy this item'})).toBeEnabled();
    expect(screen.getByTestId('buy')).toHaveStyle({marginTop: 12});
  });
});
