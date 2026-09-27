interface ViaCepResponse {
  bairro: string
  cep: string
  erro?: boolean | string
  localidade: string
  logradouro: string
  uf: string
}

export interface PostalCodeAddress {
  city: string
  district: string
  state: string
  street: string
  zipCode: string
}

export async function getAddressByPostalCode(
  postalCode: string,
): Promise<PostalCodeAddress> {
  const digits = postalCode.replace(/\D/g, "")

  if (!/^\d{8}$/.test(digits)) {
    throw new Error("Informe um CEP com oito dígitos.")
  }

  const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
    headers: { Accept: "application/json" },
  })

  if (!response.ok) {
    throw new Error("O ViaCEP não conseguiu consultar esse CEP.")
  }

  const address = (await response.json()) as ViaCepResponse

  if (address.erro === true || address.erro === "true") {
    throw new Error("CEP não encontrado.")
  }

  return {
    city: address.localidade,
    district: address.bairro,
    state: address.uf,
    street: address.logradouro,
    zipCode: address.cep,
  }
}
