import { LineItem } from './schemas';

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function computeTotals(items: LineItem[]): {
  subtotal: number;
  vat: number;
  total: number;
} {
  const subtotal = roundMoney(
    items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
  );
  const vat = roundMoney(
    items.reduce((sum, item) => {
      const rate = item.vatRate ?? 0;
      return sum + roundMoney(item.quantity * item.unitPrice * rate);
    }, 0),
  );
  const total = roundMoney(subtotal + vat);
  return { subtotal, vat, total };
}

