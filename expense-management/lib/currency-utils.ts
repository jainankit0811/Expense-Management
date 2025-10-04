import { CURRENCIES } from "./types"

export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  const fromRate = CURRENCIES.find((c) => c.code === fromCurrency)?.rate || 1
  const toRate = CURRENCIES.find((c) => c.code === toCurrency)?.rate || 1

  // Convert to USD first, then to target currency
  const usdAmount = amount / fromRate
  const convertedAmount = usdAmount * toRate

  return Math.round(convertedAmount * 100) / 100
}

export function formatCurrency(amount: number, currency: string): string {
  const currencyInfo = CURRENCIES.find((c) => c.code === currency)
  const symbol = currencyInfo?.symbol || currency

  return `${symbol}${amount.toFixed(2)}`
}
