import { describe, it, expect } from 'vitest';
import { quoteOrInvoiceSchema } from './schemas';

describe('quoteOrInvoiceSchema', () => {
  it('validates happy path', () => {
    const res = quoteOrInvoiceSchema.safeParse({
      kind: 'devis',
      seller: { name: 'A', address: 'B' },
      buyer: { name: 'C', address: 'D', email: 'c@d.ch' },
      items: [{ description: 'Audit', quantity: 2, unitPrice: 800, vatRate: 0.077 }],
      currency: 'CHF',
      issueDate: new Date().toISOString(),
      notes: 'x',
      terms: 'y',
    });
    expect(res.success).toBe(true);
  });

  it('rejects invalid', () => {
    const res = quoteOrInvoiceSchema.safeParse({});
    expect(res.success).toBe(false);
  });
});

