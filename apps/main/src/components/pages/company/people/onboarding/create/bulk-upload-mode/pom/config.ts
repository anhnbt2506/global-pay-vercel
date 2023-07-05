import {
  BackendFieldTypes,
  Boolean,
  CountryCode,
  CsvFileData,
  WorkerEmploymentUploadCsvBody,
} from '@ayp/typings/commons';
import {
  Country,
  CsvTemplate,
  Currency,
  HireType,
} from '@ayp/typings/entities';
import { CountryOption, Option } from '@ayp/typings/ui';
import { getAssetUrl, isTypeOf } from '@ayp/utils';
import { GridRenderEditCellParams } from '@mui/x-data-grid';
import { format } from 'date-fns';
import * as yup from 'yup';

import {
  GP_BACKEND_DATE_FORMAT,
  GP_BACKEND_TIME_FORMAT,
} from '@configs/constants';
import { REQUIRED_FIELD_ERROR_MESSAGE } from '@configs/forms';

export const getDataGridFieldName = (params: GridRenderEditCellParams) => {
  const index = (params.id as number) - 1;
  return `onboardEmployeesCsvData.values[${index}].${params.field}`;
};

export interface BulkUploadPomFormValues {
  country: Nullable<CountryOption>;
  file?: File;
  onboardEmployeesCsvData: Nullable<CsvFileData>;
}

export const initialValues: BulkUploadPomFormValues = {
  country: null,
  onboardEmployeesCsvData: null,
};

export enum ClientOnboardingPomPage {
  PAYROLL_COUNTRY,
  ONBOARD_EMPLOYEES,
  REVIEW_EMPLOYEES_DATA,
  COMPLETE_ENROLLMENT,
}

const mapCsvRow = (
  values: Record<string, unknown>,
  csvTemplates: CsvTemplate[]
) => {
  const mappedValues: Record<string, unknown> = {};
  csvTemplates.forEach((column) => {
    const value = values[column.columnName];
    let mappedValue = value;

    switch (column.dataType) {
      case BackendFieldTypes.DATE:
        if (!(value instanceof Date)) break;
        mappedValue = format(value, GP_BACKEND_DATE_FORMAT);
        break;
      case BackendFieldTypes.TIME:
        if (!(value instanceof Date)) break;
        mappedValue = format(value, GP_BACKEND_TIME_FORMAT);
        break;
      case BackendFieldTypes.STRING:
        if (!value) break;
        mappedValue = `${value}`;
        break;
      case BackendFieldTypes.TEXT:
        if (typeof value !== 'string') {
          mappedValue = null;
          break;
        }

        mappedValue = value.length ? value : null;
        break;
      case BackendFieldTypes.CURRENCY:
        if (!value) break;
        if (isTypeOf<Currency>(value, ['code'])) mappedValue = value.code;
        break;
      case BackendFieldTypes.COUNTRY:
      case BackendFieldTypes.DIALING_CODE:
        if (!value) break;
        if (isTypeOf<Country>(value, ['code'])) mappedValue = value.code;
        break;
      case BackendFieldTypes.BOOLEAN:
        if (!value) break;
        mappedValue = value === 0 ? Boolean.NO : Boolean.YES;
        break;
      case BackendFieldTypes.BANK:
        if (!value) break;
        if (isTypeOf<Option>(value, ['id'])) mappedValue = value.id;
        break;
    }
    mappedValues[column.columnName] = mappedValue;
  });

  return mappedValues;
};

export const mapToRequestBody = (
  onboardEmployeesUpdatedValues: Record<string, unknown>[],
  hireType: HireType,
  csvTemplates: CsvTemplate[]
): WorkerEmploymentUploadCsvBody => {
  const data =
    onboardEmployeesUpdatedValues.map((value: Record<string, unknown>) => {
      const { id, ...restValues } = value;

      return {
        row: id as number,
        values: mapCsvRow(restValues, csvTemplates),
      };
    }) ?? [];

  return {
    hireType,
    data,
  };
};

export const getBulkUploadByCountry = (countryCode: CountryCode) => {
  if (!countryCode) return '#';
  return getAssetUrl(
    `shared/doc/worker-bulk-upload-template-${countryCode.toLowerCase()}.xlsx`
  );
};

export const validationSchema = [
  yup.object({
    country: yup.object().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  }),
  yup.object({
    file: yup.mixed().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  }),
];
