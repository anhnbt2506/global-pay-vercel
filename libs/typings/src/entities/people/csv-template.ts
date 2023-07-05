import { BackendFieldTypes } from '@commons';

export interface CsvTemplate {
  columnName: string;
  dataType: BackendFieldTypes;
  options: Nullable<string[]>;
}
