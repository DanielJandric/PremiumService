import { z } from 'zod';

export const partySchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  email: z.string().email().optional().nullable(),
  vatNumber: z.string().min(1).optional().nullable(),
});

export type Party = z.infer<typeof partySchema>;

export const currencySchema = z.enum(['CHF', 'EUR']);
export type Currency = z.infer<typeof currencySchema>;

export const lineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().positive(),
  unitPrice: z.number().min(0),
  // Default Swiss VAT 8.1% if not provided
  vatRate: z.number().min(0).max(1).optional().default(0.081),
});

export type LineItem = z.infer<typeof lineItemSchema>;

export const docKindSchema = z.enum(['devis', 'facture']);
export type DocKind = z.infer<typeof docKindSchema>;

export const quoteOrInvoiceSchema = z.object({
  kind: docKindSchema,
  number: z.string().min(1).optional(),
  seller: partySchema,
  buyer: partySchema,
  items: z.array(lineItemSchema).min(1),
  currency: currencySchema,
  notes: z.string().optional(),
  terms: z.string().optional(),
  issueDate: z.string().min(1),
  dueDate: z.string().optional(),
});

export type QuoteOrInvoice = z.infer<typeof quoteOrInvoiceSchema>;

export const totalsSchema = z.object({
  subtotal: z.number(),
  vat: z.number(),
  total: z.number(),
});

export type Totals = z.infer<typeof totalsSchema>;

export function validateQuoteOrInvoice(input: unknown) {
  return quoteOrInvoiceSchema.safeParse(input);
}

