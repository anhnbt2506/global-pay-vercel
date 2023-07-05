import { CountryCode } from '@commons';

export interface Country {
  id: number;
  code: CountryCode;
  name: string;
  dialingCode: string;
}
