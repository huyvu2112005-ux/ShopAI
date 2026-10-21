const vnd = new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND', maximumFractionDigits: 0});
/** Prices are whole VND; negative values are supported for refunds. */
export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) {throw new RangeError('Currency must be a finite number');}
  return vnd.format(value);
}
