import {
  BackendFieldTypes,
  Boolean,
  CsvFileData,
  CsvHeader,
} from '@ayp/typings/commons';
import { CsvTemplate } from '@ayp/typings/entities';
import { CountryOption, CurrencyOption, Option } from '@ayp/typings/ui';
import type { TFunction } from 'next-i18next';
import Papa from 'papaparse';

import { convertTimeToDateTime } from './convert-time-to-date-time';
import { isDateValid } from './is-date-valid';
import { isTimeValid } from './is-time-valid';

const maxCsvRow = 100;
const uploadedCsvDelimiter = '--';

const isValidHeader = (
  csvTemplates: CsvTemplate[],
  uploadedHeader: string
): boolean => {
  return !!csvTemplates.find(
    (csvTemplate) => csvTemplate.columnName === uploadedHeader
  );
};

export const csvToObject = (
  file: File,
  csvTemplates: CsvTemplate[],
  t: TFunction,
  countries: CountryOption[],
  currencies: CurrencyOption[],
  banks: Option<string>[]
) => {
  const headers: CsvHeader[] = [];

  return new Promise<CsvFileData>((resolve, reject) => {
    Papa.parse<Record<string, unknown>>(file, {
      skipEmptyLines: 'greedy',
      header: true,
      transformHeader: (csvHeader, index) => {
        const uploadedHeaderSplit = csvHeader.split(uploadedCsvDelimiter);
        const uploadedHeaderId = uploadedHeaderSplit[0].trim();

        if (!isValidHeader(csvTemplates, uploadedHeaderId)) {
          reject({
            message: t('common:fileUpload.csvUnsupportedColumn', {
              columnId: uploadedHeaderId,
            }),
          });
        } else if (typeof index === 'number') {
          headers.push({
            id: uploadedHeaderId,
            label: uploadedHeaderSplit[1] ? uploadedHeaderSplit[1].trim() : '',
          });
        }

        return uploadedHeaderId;
      },
      transform: (value, headerName) => {
        const columnType = csvTemplates.find(
          (template) => template.columnName === headerName
        )?.dataType;
        const trimValue = value.length
          ? value.split(uploadedCsvDelimiter)[0].trim()
          : null;

        switch (columnType) {
          case BackendFieldTypes.DATE:
            return !!trimValue && isDateValid(trimValue)
              ? new Date(trimValue)
              : null;
          case BackendFieldTypes.TIME:
            return !!trimValue && isTimeValid(trimValue)
              ? convertTimeToDateTime(trimValue)
              : null;
          case BackendFieldTypes.COUNTRY:
          case BackendFieldTypes.DIALING_CODE:
            return (
              countries.find((country) => country.code === trimValue) ?? null
            );
          case BackendFieldTypes.CURRENCY:
            return (
              currencies.find((currency) => currency.code === trimValue) ?? null
            );
          case BackendFieldTypes.BOOLEAN:
            return !!trimValue ? (trimValue === Boolean.YES ? 1 : 0) : null;
          case BackendFieldTypes.TEXT:
            return trimValue ?? '';
          case BackendFieldTypes.BANK:
            return banks.find((bank) => bank.id === trimValue) ?? null;
          default:
            return trimValue;
        }
      },
      complete: (results) => {
        if (results.data.length > maxCsvRow) {
          reject({
            message: t('common:fileUpload.csvRowExceeded', {
              userUploadedRows: results.data.length,
              maxCsvRow: maxCsvRow,
            }),
          });
        }

        const values = results.data.map((row, index) => {
          row.id = index + 1;
          return row;
        });

        resolve({ name: file.name, headers, values });
      },
    });
  });
};
