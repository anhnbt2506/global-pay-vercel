export interface CsvHeader {
  id: string;
  label: string;
}

export interface CsvFileData {
  name: string;
  headers: CsvHeader[];
  values: Record<string, unknown>[];
}
