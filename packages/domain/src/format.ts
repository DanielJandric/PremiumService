import { Currency } from './schemas';

export function formatCurrency(value: number, currency: Currency): string {
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDateISOToCH(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat('fr-CH').format(date);
}

