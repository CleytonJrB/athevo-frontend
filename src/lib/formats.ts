export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 9)

  if (digits.length <= 4) return digits
  if (digits.length <= 8) return `${digits.slice(0, 4)}-${digits.slice(4)}`

  return `${digits.slice(0, 1)} ${digits.slice(1, 5)}-${digits.slice(5)}`
}

export function formatDocument(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14)

  if (digits.length <= 11) {
    let formatted = digits.slice(0, 3)
    if (digits.length > 3) formatted += `.${digits.slice(3, 6)}`
    if (digits.length > 6) formatted += `.${digits.slice(6, 9)}`
    if (digits.length > 9) formatted += `-${digits.slice(9, 11)}`
    return formatted
  }

  let formatted = digits.slice(0, 2)
  if (digits.length > 2) formatted += `.${digits.slice(2, 5)}`
  if (digits.length > 5) formatted += `.${digits.slice(5, 8)}`
  if (digits.length > 8) formatted += `/${digits.slice(8, 12)}`
  if (digits.length > 12) formatted += `-${digits.slice(12, 14)}`
  return formatted
}