import {formatCurrency} from '../src/utils/formatCurrency';
const normalize = (value: string) => value.replace(/\s/g, ' ');
describe('formatCurrency: whole VND prices and refunds', () => {
  test.each([[0, '0 \u20ab'], [1000, '1.000 \u20ab'], [16990000, '16.990.000 \u20ab'], [-1000, '-1.000 \u20ab'], [1000.5, '1.001 \u20ab']])('formats %p', (value, expected) => {
    expect(normalize(formatCurrency(value as number))).toBe(expected);
  });
  test.each([NaN, Infinity, -Infinity])('rejects non-finite price %p', value => expect(() => formatCurrency(value)).toThrow(RangeError));
});
