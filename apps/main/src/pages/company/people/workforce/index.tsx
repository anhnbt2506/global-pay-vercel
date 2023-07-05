import {
  Attribute,
  ErrorCode,
  Filter,
  NextPage,
  RowsState,
  SortBy,
  SortByOperator,
  StringOperator,
} from '@ayp/typings/commons';
import {
  DataGridExportContext,
  HireStatus,
  WorkerEmployment,
  WorkerEmploymentFilter,
} from '@ayp/typings/entities';
import { isErrorResponse, renderString } from '@ayp/utils';
import { CloudDownloadOutlined, KeyboardArrowDown } from '@mui/icons-material';
import { Box, MenuItem, Typography } from '@mui/material';
import { getGridStringOperators, GridColDef } from '@mui/x-data-grid';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { AppLayout } from '@components/commons';
import {
  AnchorMenu,
  CountryFlag,
  DataGrid,
  NoRowsOverlay,
  Toast,
} from '@components/ui';
import {
  BOOLEAN_NO_LABEL,
  BOOLEAN_YES_LABEL,
  CONTRACT_TYPE_LABEL_PREFIX,
  DEFAULT_PAGE_SIZE,
} from '@configs/constants';
import { COMPANY_PEOPLE_WORKFORCE_WORKER_DETAIL } from '@configs/routes';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { DataGridExportApi, WorkerEmploymentApi } from '@services/apis/people';

type FilterType = Filter<WorkerEmploymentFilter>[];

const CompanyPeopleWorkforce: NextPage = ({ isDesktop, session }) => {
  const { t } = useTranslation('company-people-workforce');

  const [loading, setLoading] = useState(true);
  const [rowCount, setRowCount] = useState<number>(0);
  const [rows, setRows] = useState<WorkerEmployment[]>([]);
  const [toast, setToast] = useState<Toast>({});
  const [anchorEl, setAnchorEl] = useState<Nullable<Element>>(null);
  const [idElement, setIdElement] = useState<Nullable<string>>(null);

  const [filters, setFilters] = useState<FilterType>([]);

  const [rowsState, setRowsState] = useState<RowsState>({
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const attributes = useMemo<Attribute<keyof WorkerEmployment>[]>(
    () => [
      'id',
      'hireType',
      'contractType',
      'title',
      'isPermitRequired',
      'status',
      'employmentId',
      'companyId',
      'company:companyId,name',
      'hiringCountryCode',
      'hiringCountry:id,code,name',
      'workerUserId',
      'workerUser.userContext.user:id,cognitoId,firstName,lastName,email',
    ],
    []
  );

  const sortBy = useMemo<SortBy<keyof WorkerEmployment>>(
    () => `createdAt,${SortByOperator.DESC}`,
    []
  );

  const columnFilters = useMemo<Filter<WorkerEmploymentFilter>[]>(
    () => [
      `status,${StringOperator.EQUALS},${HireStatus.ONBOARDED}`,
      ...filters,
    ],
    [filters]
  );

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      const { workerEmployments, meta } = await WorkerEmploymentApi.get(
        session,
        {
          ...rowsState,
          attributes,
          filters: columnFilters,
          sortBy,
        }
      );

      if (!active) return;

      setRows(workerEmployments);
      setRowCount(meta.rowCount);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [
    rowsState,
    session,
    filters,
    columnFilters,
    sortBy,
    attributes,
    setLoading,
  ]);

  const operators = getGridStringOperators().filter(
    (operator) => operator.value === StringOperator.CONTAINS
  );

  const onHandleExportCSV = useCallback(async () => {
    try {
      if (rowCount) {
        await DataGridExportApi.exportDataGrid<
          DataGridExportContext,
          keyof WorkerEmployment,
          WorkerEmploymentFilter,
          keyof WorkerEmployment
        >(session, DataGridExportContext.COMPANY_PEOPLE_WORKFORCE, {
          attributes,
          filters: columnFilters,
          sortBy,
        });
        setToast({
          severity: 'success',
          message: t('data-grid-export:exportData.toastMessage.exportSuccess'),
        });
      } else {
        setToast({
          severity: 'error',
          message: t('data-grid-export:exportData.toastMessage.noData'),
        });
      }
    } catch (e) {
      /* istanbul ignore else */
      //this case is  unnecessary to test
      if (isErrorResponse(e)) {
        switch (e.error.code) {
          case ErrorCode.TOO_MANY_REQUESTS:
            setToast({
              severity: 'error',
              message: t(
                'data-grid-export:exportData.toastMessage.existingFileExportInProgress'
              ),
            });
            break;
          default:
            setToast({
              severity: 'error',
              message: e.error.name,
            });
        }
      } else {
        setToast({
          severity: 'error',
          message: t(UNKNOWN_ERROR_MESSAGE),
        });
      }
    }
  }, [session, rowCount, attributes, sortBy, columnFilters, t]);

  const onHandleClickRowOptions =
    (idElement: string) => (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      setIdElement(idElement);
    };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'workerUser.userContext.user:fullName',
        headerName: t(
          'dataGrid.header.workerUser.userContext.user.firstName;workerUser.userContext.user.lastName'
        ),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterable: false,
        disableColumnMenu: true,
        valueGetter: ({ row }) =>
          `${row.workerUser.userContext.user.firstName} ${row.workerUser.userContext.user.lastName}`,
      },
      {
        field: 'workerUser.userContext.user:email',
        headerName: t('dataGrid.header.workerUser.userContext.user.email'),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterOperators: operators,
        disableColumnMenu: true,
        valueGetter: ({ row }) => `${row.workerUser.userContext.user.email}`,
      },
      {
        field: 'hiringCountry:name',
        headerName: t('dataGrid.header.hiringCountry.name'),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterOperators: operators,
        disableColumnMenu: true,
        renderCell: ({ row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <CountryFlag code={row.hiringCountry.code} />
            <Typography ml={2} variant="body2">
              {row.hiringCountry.name}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'hireType',
        headerName: t('dataGrid.header.hireType'),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterOperators: operators,
        disableColumnMenu: true,
      },
      {
        field: 'contractType',
        headerName: t('dataGrid.header.contractType'),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterOperators: operators,
        disableColumnMenu: true,
        valueGetter: ({ row }) =>
          t(`${CONTRACT_TYPE_LABEL_PREFIX}${row.contractType}`),
      },
      {
        field: 'title',
        headerName: t('dataGrid.header.title'),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterOperators: operators,
        disableColumnMenu: true,
      },
      {
        field: 'isPermitRequired',
        headerName: t('dataGrid.header.isPermitRequired'),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterable: false,
        disableColumnMenu: true,
        valueGetter: ({ row }) =>
          t(
            row.isPermitRequired
              ? BOOLEAN_YES_LABEL
              : Object.is(row.isPermitRequired, null)
              ? '-'
              : BOOLEAN_NO_LABEL
          ),
      },
      {
        field: 'actions',
        headerName: '',
        flex: 1,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: ({ row }) => {
          const employmentId = row.employmentId;

          return (
            <>
              <Box
                sx={{
                  display: 'flex',
                }}
                onClick={onHandleClickRowOptions(employmentId)}
                data-testid="companyPeopleWorkforce-row-itemOptions"
              >
                <KeyboardArrowDown
                  fontSize="small"
                  fill="black"
                  data-testid="companyPeopleWorkforce-row-arrowDown"
                />
              </Box>
              <AnchorMenu
                open={!!anchorEl && idElement === employmentId}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
              >
                <MenuItem
                  key="viewProfile"
                  data-testid="companyPeopleWorkforce-row-viewProfile"
                  onClick={() => {
                    window.open(
                      renderString(
                        COMPANY_PEOPLE_WORKFORCE_WORKER_DETAIL.path,
                        { employmentId },
                        '_blank'
                      )
                    );
                  }}
                >
                  <Typography>{t('dataGrid.menuItems.viewProfile')}</Typography>
                </MenuItem>
              </AnchorMenu>
            </>
          );
        },
      },
    ],
    [t, operators, anchorEl, idElement]
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
        onClose={
          /* istanbul ignore next */
          // don't have this case
          () => setToast({ message: '' })
        }
        dataTestId="companyPeopleWorkforce-toast"
      >
        {toast.message}
      </Toast>
      <DataGrid<FilterType>
        rows={rows}
        columns={columns}
        loading={loading}
        rowCount={rowCount}
        filters={filters}
        dataTestId="companyPeopleWorkforce-dataGrid"
        components={{
          NoRowsOverlay: () => (
            <NoRowsOverlay
              icon="PersonPin"
              title={t('dataGrid.noRowsOverlay.title')}
              description={t('dataGrid.noRowsOverlay.description')}
              dataTestId="companyPeopleWorkforce-noRowsOverlay"
            />
          ),
        }}
        filterMode="server"
        setFilters={setFilters}
        useSearchFilter
        searchFilterColumnField="workerUser.userContext.user:fullName"
        searchFilterOperatorValue={StringOperator.CONTAINS}
        searchFilterPlaceholder={t('dataGrid.searchPlaceholder')}
        pagination
        paginationMode="server"
        paginationModel={{ ...rowsState }}
        onPaginationModelChange={handlePaginationModelChange}
        menuItems={[
          <MenuItem
            key="exportData"
            onClick={onHandleExportCSV}
            data-testid="companyPeopleWorkforce-exportData-button"
          >
            <CloudDownloadOutlined fontSize="small" color="primary" />
            <Typography marginLeft="0.5rem">
              {t('data-grid-export:exportData.title')}
            </Typography>
          </MenuItem>,
        ]}
      />
    </AppLayout>
  );
};

export default CompanyPeopleWorkforce;

export const getServerSideProps = async ({ locale = 'en' }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'common',
      'contract-type',
      'company-people-workforce',
      'data-grid-export',
    ])),
  },
});
