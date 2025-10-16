import { describe, it, expect } from 'vitest';
import { computeTotals, roundMoney } from './math';

describe('math', () => {
  it('roundMoney rounds to 0.01', () => {
    expect(roundMoney(1.005)).toBe(1.01);
    expect(roundMoney(1.004)).toBe(1.0);
  });

  it('computeTotals aggregates VAT per line', () => {
    const totals = computeTotals([
      { description: 'A', quantity: 2, unitPrice: 100, vatRate: 0.1 },
      { description: 'B', quantity: 1, unitPrice: 50, vatRate: 0.2 },
    ] as any);
    expect(totals.subtotal).toBe(250);
    expect(totals.vat).toBe(2 * 100 * 0.1 + 1 * 50 * 0.2);
    expect(totals.total).toBeCloseTo(250 + totals.vat, 2);
  });
});

