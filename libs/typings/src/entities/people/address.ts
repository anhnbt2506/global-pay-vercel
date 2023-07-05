import { Country } from './country';

export interface Address {
  id: number;
  addressLine: Nullable<string>;
  city: Nullable<string>;
  state: Nullable<string>;
  postalCode: Nullable<string>;
  countryCode: Nullable<string>;
  addressLineAlternate: Nullable<string>;
  cityAlternate: Nullable<string>;
  stateAlternate: Nullable<string>;
  postalCodeAlternate: Nullable<string>;

  // Relations
  country: Nullable<Country>;
}
