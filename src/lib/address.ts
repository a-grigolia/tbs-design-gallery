export type StructuredAddress = {
  address: string
  street: string
  city: string
  state: string
  zipcode: string
  googlePlaceId: string
}

type AddressComponentLike = {
  longText: string | null
  shortText: string | null
  types: string[]
}

type PlaceAddressLike = {
  id: string
  formattedAddress?: string | null
  addressComponents?: AddressComponentLike[] | null
}

function componentValue(components: AddressComponentLike[], type: string, short = false) {
  const component = components.find((item) => item.types.includes(type))
  return short ? component?.shortText : component?.longText
}

export function californiaAddressFromPlace(place: PlaceAddressLike): StructuredAddress | null {
  const components = place.addressComponents ?? []
  const streetNumber = componentValue(components, 'street_number') ?? ''
  const route = componentValue(components, 'route') ?? ''
  const subpremise = componentValue(components, 'subpremise')
  const city =
    componentValue(components, 'locality') ??
    componentValue(components, 'postal_town') ??
    componentValue(components, 'sublocality_level_1') ??
    ''
  const state = componentValue(components, 'administrative_area_level_1', true) ?? ''
  const postalCode = componentValue(components, 'postal_code') ?? ''
  const postalSuffix = componentValue(components, 'postal_code_suffix')
  const streetBase = [streetNumber, route].filter(Boolean).join(' ')
  const street = subpremise ? `${streetBase}, ${subpremise}` : streetBase
  const zipcode = postalSuffix ? `${postalCode}-${postalSuffix}` : postalCode

  if (state !== 'CA' || !place.formattedAddress || !street || !city || !zipcode || !place.id) {
    return null
  }

  return {
    address: place.formattedAddress,
    street,
    city,
    state,
    zipcode,
    googlePlaceId: place.id,
  }
}
