import type { Location } from '../types/location';

/** Indica se `location` pertence à hierarquia abaixo do país `countryLocationId`. */
export function isLocationDescendantOfCountry(
  location: Location,
  countryLocationId: number
): boolean {
  let currentParent = location.parent;

  if (location.id === countryLocationId) {
    return false;
  }

  while (currentParent) {
    if (currentParent.id === countryLocationId) {
      return true;
    }
    currentParent = currentParent.parent;
  }

  return false;
}
