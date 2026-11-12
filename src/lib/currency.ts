const currencyFormatters = new Map<string, Intl.NumberFormat>()

export function formatCurrency(value: number, currency = "BRL") {
  const normalizedCurrency = currency.toUpperCase()
  let formatter = currencyFormatters.get(normalizedCurrency)
  if (!formatter) {
    formatter = new Intl.NumberFormat("pt-BR", {
      currency: normalizedCurrency,
      style: "currency",
    })
    currencyFormatters.set(normalizedCurrency, formatter)
  }

  return formatter.format(value)
}
