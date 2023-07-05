import {
  BackendFieldTypes,
  CountryCode,
  SortByOperator,
  Stage,
  StringOperator,
  UserSession,
  WorkerEmploymentValidateCsvError,
} from '@ayp/typings/commons';
import { CsvTemplate, HireStatus } from '@ayp/typings/entities';
import { CountryOption, CurrencyOption, Option } from '@ayp/typings/ui';
import { Box, Grid, Typography } from '@mui/material';
import {
  GridCellParams,
  GridColDef,
  GridRowClassNameParams,
  useGridApiRef,
} from '@mui/x-data-grid';
import { format } from 'date-fns';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash-es';
import memoizee from 'memoizee';
import { useTranslation } from 'next-i18next';
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Environment } from '@ayp/utils';

import {
  Autocomplete,
  CountryFlag,
  DataGrid,
  DatePickerDataGrid,
  NumberField,
  Select,
  TextareaDataGrid,
  TextField,
  TimePickerDataGrid,
} from '@components/ui';
import {
  BOOLEAN_OPTIONS,
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
} from '@configs/constants';
import { CountryApi, CurrencyApi } from '@services/apis/people';
import { BankApi } from '@services/apis/people/bank-api';

import { BulkUploadPomFormValues, getDataGridFieldName } from '../config';
import { CellDataGrid } from './cell-data-grid';
import {
  getColumnOptionLabel,
  getCurrencyOptions,
  getEnumOptionsPermitType,
} from './config';

const getCountriesMemo = memoizee(
  async (): Promise<CountryOption[]> => {
    const { countries } = await CountryApi.getCountries();

    return countries.map((country) => ({
      id: country.id,
      code: country.code,
      label: country.name,
      dialingCode: country.dialingCode,
    }));
  },
  { promise: true }
);

const getCurrenciesMemo = memoizee(
  async (session): Promise<CurrencyOption[]> => {
    const { currencies } = await CurrencyApi.getCurrencies(session);
    return currencies.map((currency) => ({
      id: currency.id,
      code: currency.code,
      label: currency.name,
    }));
  },
  { promise: true }
);

const getBankOptionsMemo = memoizee(
  async (
    session: UserSession,
    country: CountryCode
  ): Promise<Option<string>[]> => {
    const { banks } = await BankApi.getBanks(session, {
      attributes: ['bankId', 'bankName'],
      filters: [`countryCode,${StringOperator.EQUALS},${country}`],
      sortBy: `bankName,${SortByOperator.ASC}`,
    });

    return banks.map(({ bankId, bankName }) => ({
      id: bankId,
      label: bankName,
      value: bankId,
    }));
  },
  { promise: true }
);

const ReviewEmployeeDataForm: FC<{
  dataTestId?: string;
  csvTemplates: CsvTemplate[];
  session: UserSession;
  dataGridEditable: boolean;
  validationCsvErrors: WorkerEmploymentValidateCsvError[];
  setValidationCsvErrors: Dispatch<
    SetStateAction<WorkerEmploymentValidateCsvError[]>
  >;
}> = ({
  csvTemplates,
  session,
  dataGridEditable,
  validationCsvErrors,
  setValidationCsvErrors,
}) => {
  const { t } = useTranslation(
    'company-people-onboarding-create-bulk-upload-mode'
  );
  const apiRef = useGridApiRef();
  const {
    values: { onboardEmployeesCsvData, country },
  } = useFormikContext<BulkUploadPomFormValues>();
  /* istanbul ignore next */
  // this case doesn't necessary to test
  const rows = onboardEmployeesCsvData?.values ?? [];

  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [selectedCountryOption, setSelectedCountryOption] = useState<
    CountryOption[]
  >([]);
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);
  const [bankOptions, setBankOptions] = useState<Option<string>[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [countries, currencies, banks] = await Promise.all([
          getCountriesMemo(),
          getCurrenciesMemo(session),
          getBankOptionsMemo(session, country?.code),
        ]);

        setCountries(countries);
        setCurrencies(currencies);
        setSelectedCountryOption(
          countries.filter(
            (selectedCountry) => selectedCountry.code === country?.code
          )
        );
        setBankOptions(banks);
      } catch {}
    })();
  }, [session, country]);

  const yesNoOptions = useMemo(
    () =>
      BOOLEAN_OPTIONS.map((option) => ({
        id: option.id,
        label: t(option.label),
      })),
    [t]
  );

  const getAutocompleteOptions = useCallback(
    (columnName: string) => {
      switch (columnName) {
        case 'WHC':
          return selectedCountryOption;
        case 'WCSR':
          return getCurrencyOptions(country, currencies);
        case 'WBN':
          return bankOptions;
        default:
          return countries;
      }
    },
    [countries, selectedCountryOption, country, currencies, bankOptions]
  );

  const getEnumOptions = useCallback(
    (column: CsvTemplate) => {
      const { columnName, options } = column;
      /* istanbul ignore next */
      // this case cannot be reproduced
      const mappedOptions = options
        ? options.map((option) => ({
            label: getColumnOptionLabel(column.columnName, option, t),
            id: `${option}`,
          }))
        : [];
      switch (columnName) {
        case 'WES':
          return mappedOptions.filter(
            (option) => option.id === HireStatus.ONBOARDED
          );
        case 'WPT':
          return getEnumOptionsPermitType(country, mappedOptions);
        default:
          return mappedOptions;
      }
    },
    [t, country]
  );

  const columns: GridColDef[] = useMemo(() => {
    const templateColumns: GridColDef[] = csvTemplates.map((column) => {
      const header = onboardEmployeesCsvData?.headers?.find?.(
        (header) => header.id === column.columnName
      );
      const columnLabel = header?.label;
      const commonGridColDef: GridColDef = {
        field: column.columnName,
        headerName: columnLabel,
        flex: 1,
        minWidth: 200,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        align: 'left',
        headerAlign: 'left',
        editable: dataGridEditable,
        renderCell: (params) => (
          <CellDataGrid
            params={params}
            validationCsvErrors={validationCsvErrors}
            t={t}
            tooltipTitle={params.formattedValue ?? params.value}
          >
            <Typography>
              {params.formattedValue ?? params.value ?? '-'}
            </Typography>
          </CellDataGrid>
        ),
      };

      switch (column.dataType) {
        case BackendFieldTypes.BANK:
          return Object.assign<GridColDef, Partial<GridColDef>>(
            commonGridColDef,
            {
              type: 'bank',
              renderEditCell: (params) => (
                <Autocomplete
                  name={getDataGridFieldName(params)}
                  options={getAutocompleteOptions(column.columnName)}
                  dataTestId={`${params.id}-${params.field}-bankCell`}
                  sx={{
                    width: '100%',
                  }}
                />
              ),
              valueFormatter: ({ value }) => (value?.label ? value.label : '-'),
            }
          );
        case BackendFieldTypes.COUNTRY:
          return Object.assign<GridColDef, Partial<GridColDef>>(
            commonGridColDef,
            {
              type: 'country',
              renderEditCell: (params) => (
                <Autocomplete
                  name={getDataGridFieldName(params)}
                  variant="country"
                  options={getAutocompleteOptions(column.columnName)}
                  dataTestId={`${params.id}-${params.field}-countryCell`}
                  sx={{
                    width: '100%',
                  }}
                />
              ),
              renderCell: (params) => {
                const cellValue = params.row[column.columnName];

                return (
                  <CellDataGrid
                    params={params}
                    validationCsvErrors={validationCsvErrors}
                    t={t}
                    tooltipTitle={cellValue ? cellValue.label : '-'}
                  >
                    {cellValue ? (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <CountryFlag code={cellValue.code} />
                        <Typography ml={2}>{cellValue.label}</Typography>
                      </Box>
                    ) : (
                      <Typography>{'-'}</Typography>
                    )}
                  </CellDataGrid>
                );
              },
            }
          );
        case BackendFieldTypes.DIALING_CODE:
          return Object.assign<GridColDef, Partial<GridColDef>>(
            commonGridColDef,
            {
              type: 'dialingCode',
              renderEditCell: (params) => (
                <Autocomplete
                  name={getDataGridFieldName(params)}
                  variant="dialingCode"
                  options={getAutocompleteOptions(column.columnName)}
                  sx={{
                    width: '100%',
                  }}
                  dataTestId={`${params.id}-${params.field}-dialingCodeCell`}
                />
              ),
              renderCell: (params) => {
                const cellValue = params.row[column.columnName];
                const dialingCode = cellValue ? cellValue.dialingCode : null;
                const countryName = cellValue ? cellValue.label : null;

                return (
                  <CellDataGrid
                    params={params}
                    validationCsvErrors={validationCsvErrors}
                    t={t}
                    tooltipTitle={
                      cellValue ? `${dialingCode} ${countryName}` : '-'
                    }
                  >
                    {cellValue ? (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <CountryFlag code={cellValue.code} />
                        <Typography ml={2}>{dialingCode}</Typography>
                        <Typography ml={2}>{countryName}</Typography>
                      </Box>
                    ) : (
                      <Typography>{'-'}</Typography>
                    )}
                  </CellDataGrid>
                );
              },
            }
          );
        case BackendFieldTypes.CURRENCY:
          return Object.assign<GridColDef, Partial<GridColDef>>(
            commonGridColDef,
            {
              type: 'currency',
              renderEditCell: (params) => (
                <Autocomplete
                  name={getDataGridFieldName(params)}
                  variant="currency"
                  options={getAutocompleteOptions(column.columnName)}
                  sx={{
                    width: '100%',
                  }}
                  dataTestId={`${params.id}-${params.field}-currencyCell`}
                />
              ),
              valueFormatter: ({ value }) =>
                value ? `${value.code} - ${value.label}` : '-',
            }
          );
        case BackendFieldTypes.STRING:
          return Object.assign<GridColDef, Partial<GridColDef>>(
            commonGridColDef,
            {
              type: 'string',
              valueFormatter: ({ value }) => value ?? '-',
              renderEditCell: (params) => (
                <TextField
                  name={getDataGridFieldName(params)}
                  autoFocus
                  dataTestId={`${params.id}-${params.field}-stringCell`}
                />
              ),
            }
          );
        case BackendFieldTypes.TEXT:
          return Object.assign<GridColDef, Partial<GridColDef>>(
            commonGridColDef,
            {
              type: 'text',
              valueFormatter: ({ value }) =>
                value && value.length ? value : '-',
              renderEditCell: (params) => (
                <TextareaDataGrid
                  label={columnLabel}
                  name={getDataGridFieldName(params)}
                  dataTestId={`${params.id}-${params.field}-textCell`}
                />
              ),
            }
          );
        case BackendFieldTypes.FLOAT:
          return Object.assign<GridColDef, Partial<GridColDef>>(
            commonGridColDef,
            {
              type: 'string',
              valueFormatter: ({ value }) =>
                value
                  ? isNaN(value)
                    ? /* istanbul ignore next */
                      // this case cannot be reproduced
                      '-'
                    : value.toLocaleString('en-US')
                  : value === 0
                  ? '0'
                  : '-',
              renderEditCell: (params) => (
                <NumberField
                  name={getDataGridFieldName(params)}
                  numberFormatProps={{
                    decimalScale: 2,
                    allowNegative: false,
                    thousandSeparator: true,
                  }}
                  autoFocus
                  dataTestId={`${params.id}-${params.field}-floatCell`}
                />
              ),
            }
          );
        case BackendFieldTypes.INTEGER:
        case BackendFieldTypes.SMALLINT:
          return Object.assign<GridColDef, Partial<GridColDef>>(
            commonGridColDef,
            {
              type: 'string',
              valueFormatter: ({ value }) =>
                value
                  ? isNaN(value)
                    ? '-'
                    : value.toLocaleString('en-US')
                  : value === 0
                  ? '0'
                  : '-',
              renderEditCell: (params) => (
                <NumberField
                  name={getDataGridFieldName(params)}
                  numberFormatProps={{
                    decimalScale: 0,
                    allowNegative: false,
                    thousandSeparator: true,
                  }}
                  autoFocus
                  dataTestId={`${params.id}-${params.field}-intCell`}
                />
              ),
            }
          );
        case BackendFieldTypes.DATE:
          return Object.assign<GridColDef, Partial<GridColDef>>(
            commonGridColDef,
            {
              type: 'date',
              valueFormatter: ({ value }) =>
                value instanceof Date
                  ? format(value, DEFAULT_DATE_FORMAT)
                  : '-',
              renderEditCell: (params) => (
                <DatePickerDataGrid
                  label={columnLabel}
                  name={getDataGridFieldName(params)}
                  dataTestId={`${params.id}-${params.field}-dateCell`}
                />
              ),
            }
          );
        case BackendFieldTypes.TIME:
          return Object.assign<GridColDef, Partial<GridColDef>>(
            commonGridColDef,
            {
              type: 'time',
              valueFormatter: ({ value }) =>
                value instanceof Date
                  ? format(value, DEFAULT_TIME_FORMAT)
                  : '-',
              renderEditCell: (params) => (
                <TimePickerDataGrid
                  label={columnLabel}
                  name={getDataGridFieldName(params)}
                  dataTestId={`${params.id}-${params.field}-timeCell`}
                />
              ),
            }
          );
        case BackendFieldTypes.BOOLEAN:
          return Object.assign<GridColDef, Partial<GridColDef>>(
            commonGridColDef,
            {
              type: 'boolean',
              renderEditCell: (params) => (
                <Select
                  name={getDataGridFieldName(params)}
                  options={yesNoOptions}
                  dataTestId={`${params.id}-${params.field}-booleanCell`}
                />
              ),
              valueFormatter: ({ value }) => {
                return typeof value === 'number'
                  ? yesNoOptions.find((option) => option.id === value)?.label
                  : '-';
              },
            }
          );
        case BackendFieldTypes.ENUM:
          return Object.assign<
            GridColDef,
            Partial<GridColDef>,
            Partial<GridColDef> | null
          >(
            commonGridColDef,
            {
              type: 'enum',
              renderEditCell: (params) => (
                <Select
                  name={getDataGridFieldName(params)}
                  options={getEnumOptions(column)}
                  dataTestId={`${params.id}-${params.field}-enumCell`}
                />
              ),
              valueFormatter: ({ value }) => {
                if (!value) return '-';
                return getColumnOptionLabel(column.columnName, value, t);
              },
            },
            {}
          );
        default:
          return commonGridColDef;
      }
    });

    const sortedColumns: GridColDef[] = [];
    onboardEmployeesCsvData?.headers.forEach((header) => {
      const foundColumn = templateColumns.find(
        (column) => column.field === header.id
      );

      /* istanbul ignore next */
      // this case doesn't necessary to test
      if (!!foundColumn) sortedColumns.push(foundColumn);
    });

    return [
      {
        field: 'id',
        headerName: t('pom.steps.reviewEmployeeData.dataGrid.header.no'),
        flex: 1,
        sortable: false,
        filterable: false,
      },
      ...sortedColumns,
    ];
  }, [
    t,
    onboardEmployeesCsvData?.headers,
    dataGridEditable,
    yesNoOptions,
    csvTemplates,
    validationCsvErrors,
    getAutocompleteOptions,
    getEnumOptions,
  ]);

  const onCellEditStop = useCallback(
    (params: GridCellParams) => {
      const { id, field, value } = params;
      apiRef.current.setEditCellValue({
        id,
        field,
        value,
      });

      setValidationCsvErrors((prev) => {
        if (!prev.length) return [];

        const tempValidationCsvError = [...prev];

        const validationCsvErrorIndex = tempValidationCsvError.findIndex(
          (error) => error.row === params.id
        );

        /* istanbul ignore next */
        // this case cannot be reproduced
        if (validationCsvErrorIndex >= 0) {
          delete tempValidationCsvError[validationCsvErrorIndex].messages[
            params.field
          ];

          isEmpty(tempValidationCsvError[validationCsvErrorIndex].messages) &&
            tempValidationCsvError.splice(validationCsvErrorIndex, 1);
        }

        return tempValidationCsvError;
      });
    },
    [apiRef, setValidationCsvErrors]
  );

  const getCellClassName = useCallback(() => 'gridCellError', []);

  const getRowClassName = useCallback(
    (params: GridRowClassNameParams) => {
      if (!validationCsvErrors.length) return '';

      const error = validationCsvErrors.find(
        (error) => error.row === params.id && !isEmpty(error.messages)
      );

      return error ? 'gridRowError' : '';
    },
    [validationCsvErrors]
  );

  return (
    <Grid
      container
      sx={{
        display: 'flex',
        minHeight: '60vh',
        backgroundColor: 'white',
        padding: '1rem 1rem 0 1rem',
        borderRadius: '0.5rem',
        boxShadow: (theme) => theme.palette.customs.boxShadow,
        '& .gridCellError': {
          display: 'flex',
          justifyContent: 'space-between',
        },
        '& .gridRowError': {
          background: (theme) => theme.palette.error.shades.p190,
        },
      }}
    >
      <DataGrid<[]>
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        loading={false}
        components={{
          NoRowsOverlay:
            /* istanbul ignore next */
            // this case doesn't necessary to test
            () => <></>,
        }}
        hideFooterPagination
        hideFooter
        paginationModel={{
          page: 0,
          pageSize: rows.length,
        }}
        onCellEditStop={onCellEditStop}
        getCellClassName={getCellClassName}
        getRowClassName={getRowClassName}
        disableVirtualization={Environment.getStage() === Stage.TESTING}
      />
    </Grid>
  );
};

export default ReviewEmployeeDataForm;
