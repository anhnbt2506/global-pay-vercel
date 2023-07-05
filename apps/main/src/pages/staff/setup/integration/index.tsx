import {
  Attribute,
  DateOperator,
  Filter,
  NextPage,
  RowsState,
  SingleSelectOperator,
  SortBy,
  SortByOperator,
  StringOperator,
} from '@ayp/typings/commons';
import {
  HireType,
  JtCompany,
  JtCompanyFilter,
  JtCompanySortBy,
} from '@ayp/typings/entities';
import { CountryOption } from '@ayp/typings/ui';
import { isErrorResponse } from '@ayp/utils';
import { Box, Typography } from '@mui/material';
import {
  GridColDef,
  getGridDateOperators,
  getGridSingleSelectOperators,
  getGridStringOperators,
} from '@mui/x-data-grid';
import { format } from 'date-fns';
import memoizee from 'memoizee';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { AppLayout } from '@components/commons';
import { CountryFlag, DataGrid, NoRowsOverlay, Toast } from '@components/ui';
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_PAGE_SIZE,
  HIRE_TYPE_LABEL_PREFIX,
  HIRE_TYPE_OPTIONS,
} from '@configs/constants';
import { RedirectionError } from '@configs/errors';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { JtCompanyApi } from '@services/apis/fintech';
import { CountryApi } from '@services/apis/people';

type FilterType = Filter<JtCompanyFilter>[];

const getCountriesMemo = memoizee(
  async (): Promise<CountryOption[]> => {
    const { countries } = await CountryApi.getCountries();

    return countries.map((country) => ({
      id: country.id,
      code: country.code,
      label: country.name,
    }));
  },
  { promise: true }
);

const StaffSetupIntegration: NextPage = ({ isDesktop, session }) => {
  const { t } = useTranslation('staff-setup-integration');
  const [toast, setToast] = useState<Toast>({});
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<JtCompany[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [filters, setFilters] = useState<FilterType>([]);
  const [countries, setCountries] = useState<CountryOption[]>([]);

  const [rowsState, setRowsState] = useState<RowsState>({
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const sortBy = useMemo<SortBy<JtCompanySortBy>>(
    () => `lastSyncedAt,${SortByOperator.DESC}`,
    []
  );

  useEffect(() => {
    (async () => {
      try {
        const data = await getCountriesMemo();
        setCountries(data);
      } catch {}
    })();
  }, []);

  const attributes = useMemo<Attribute<keyof JtCompany>[]>(
    () => [
      'companyId',
      'hireType',
      'countryCode',
      'jtCompanyId',
      'lastSyncedAt',
    ],
    []
  );

  const operators = getGridStringOperators().filter(
    (operator) => operator.value === StringOperator.CONTAINS
  );

  const dateOperators = getGridDateOperators().filter((operator) =>
    Object.values<string>(DateOperator).includes(operator.value)
  );

  const constantOperators = getGridSingleSelectOperators().filter(
    (operator) => operator.value === SingleSelectOperator.IS
  );

  const serviceTypeOptions = useMemo(
    () =>
      HIRE_TYPE_OPTIONS.filter(({ id }) => id !== HireType.FREELANCER).map(
        (serviceType) => ({
          ...serviceType,
          value: serviceType.id,
          label: t(serviceType.label),
        })
      ),
    [t]
  );

  const fetchData = useCallback(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const { jtCompanies, meta } = await JtCompanyApi.list(session, {
          ...rowsState,
          attributes,
          filters,
          sortBy,
        });

        if (!active) return;
        setRows(jtCompanies);
        setRowCount(meta.rowCount);
        setLoading(false);
      } catch (e) {
        if (isErrorResponse(e)) {
          setToast({
            severity: 'error',
            message: e.error.name,
          });
        } else {
          setToast({
            severity: 'error',
            message: t(UNKNOWN_ERROR_MESSAGE),
          });
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [attributes, filters, rowsState, session, sortBy, t]);

  useEffect(() => {
    return fetchData();
  }, [fetchData]);

  const getCountryName = useCallback(
    (countryCode: string): string => {
      const country = countries.find((country) => country.code === countryCode);
      return country ? country.label : '-';
    },
    [countries]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'company:name',
        headerName: t('dataGrid.header.company'),
        flex: 1,
        sortable: false,
        minWidth: 250,
        disableColumnMenu: true,
        filterOperators: operators,
        valueGetter: (params) => params.row.company.name,
      },
      {
        field: 'hireType',
        headerName: t('dataGrid.header.hireType'),
        flex: 1,
        sortable: false,
        minWidth: 250,
        filterOperators: constantOperators,
        valueOptions: serviceTypeOptions,
        type: 'singleSelect',
        valueFormatter: ({ value }) => {
          return t(`${HIRE_TYPE_LABEL_PREFIX}${value}`);
        },
        disableColumnMenu: true,
      },
      {
        field: 'countryCode',
        headerName: t('dataGrid.header.countryCode'),
        flex: 1,
        sortable: false,
        filterable: false,
        minWidth: 250,
        disableColumnMenu: true,
        renderCell: ({ value }) =>
          value ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <CountryFlag code={value} />
              <Typography ml={2}>{getCountryName(value)}</Typography>
            </Box>
          ) : (
            '-'
          ),
      },
      {
        field: 'lastSyncedAt',
        headerName: t('dataGrid.header.lastSyncedAt'),
        flex: 1,
        sortable: false,
        minWidth: 250,
        disableColumnMenu: true,
        filterOperators: dateOperators,
        valueFormatter: ({ value }) =>
          value && format(new Date(value as string), DEFAULT_DATE_FORMAT),
      },
      {
        field: 'companyId',
        headerName: t('dataGrid.header.companyId'),
        flex: 1,
        sortable: false,
        minWidth: 250,
        filterOperators: operators,
        disableColumnMenu: true,
      },
      {
        field: 'jtCompanyId',
        headerName: t('dataGrid.header.jtCompanyId'),
        flex: 1,
        sortable: false,
        minWidth: 250,
        filterOperators: operators,
        disableColumnMenu: true,
      },
    ],
    [
      constantOperators,
      dateOperators,
      getCountryName,
      operators,
      serviceTypeOptions,
      t,
    ]
  );

  const handlePaginationModelChange = (newPaginationModel: RowsState) => {
    setRowsState({
      page: newPaginationModel.page,
      pageSize: newPaginationModel.pageSize,
    });
  };

  return (
    <AppLayout isDesktop={isDesktop} pageName={t('pageName')}>
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId="staffIntegration-toast"
      >
        {toast.message}
      </Toast>
      <DataGrid<FilterType>
        rows={rows}
        columns={columns}
        loading={loading}
        rowCount={rowCount}
        filters={filters}
        filterMode="server"
        setFilters={setFilters}
        useSearchFilter
        searchFilterColumnField="company:name"
        searchFilterOperatorValue={StringOperator.CONTAINS}
        searchFilterPlaceholder={t('dataGrid.searchPlaceholder')}
        dataTestId="staffSetUpIntegration-dataGrid"
        components={{
          NoRowsOverlay: () => (
            <NoRowsOverlay
              icon="PersonPin"
              title={t('dataGrid.noRowsOverlay.title')}
              description={t('dataGrid.noRowsOverlay.description')}
              dataTestId="staffSetUpIntegration-noRowsOverLay"
            />
          ),
        }}
        pagination
        paginationMode="server"
        paginationModel={{ ...rowsState }}
        getRowId={(row) => row.jtCompanyId + row.companyId}
        onPaginationModelChange={handlePaginationModelChange}
      />
    </AppLayout>
  );
};

export default StaffSetupIntegration;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    return {
      props: {
        ...(await serverSideTranslations(context.locale ?? 'en', [
          'common',
          'staff-setup-integration',
        ])),
      },
    };
  } catch (e) {
    if (e instanceof RedirectionError) {
      return e.redirect();
    }

    return {
      props: {},
    };
  }
};
