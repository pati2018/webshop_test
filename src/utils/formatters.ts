import { Currency } from '../types';

export const CURRENCY_RATES: Record<Currency, { rate: number; symbol: string; label: string }> = {
  EUR: { rate: 1.0, symbol: '€', label: 'EUR (€)' },
  CHF: { rate: 0.96, symbol: 'CHF', label: 'CHF' },
  USD: { rate: 1.08, symbol: '$', label: 'USD ($)' },
};

export function formatPrice(amountInEur: number, currency: Currency = 'EUR'): string {
  const { rate, symbol } = CURRENCY_RATES[currency] || CURRENCY_RATES.EUR;
  const converted = amountInEur * rate;

  if (currency === 'EUR') {
    return `${converted.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} €`;
  }

  if (currency === 'CHF') {
    return `CHF ${converted.toLocaleString('de-CH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `$${converted.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
