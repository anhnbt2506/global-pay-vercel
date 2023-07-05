import {
  Attribute,
  ErrorCode,
  Filter,
  NextPage,
  RowsState,
  SortBy,
  SortByOperator,
  StringOperator,
  SingleSelectOperator,
} from '@ayp/typings/commons';
import { fireGtmEvent, renderString } from '@ayp/utils';
import {
  DataGridExportContext,
  HireStatus,
  WorkerEmployment,
  WorkerEmploymentFilter,
} from '@ayp/typings/entities';
import { isErrorResponse } from '@ayp/utils';
import {
  CloudDownloadOutlined,
  KeyboardArrowDown,
  PersonAdd,
} from '@mui/icons-material';
import { Box, MenuItem, Typography } from '@mui/material';
import {
  getGridStringOperators,
  GridColDef,
  getGridSingleSelectOperators,
} from '@mui/x-data-grid';
import { format } from 'date-fns';
import type { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { AppLayout } from '@components/commons';
import {
  ClientOnboardingPeoOrEorPage,
  HireTypeQuery,
  ModeQuery,
} from '@components/pages/company/people/onboarding/create/guided-mode/peo/config';
import {
  AnchorMenu,
  CountryFlag,
  DataGrid,
  NoRowsOverlay,
  Toast,
} from '@components/ui';
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_PAGE_SIZE,
  EMPLOYMENT_TYPE_LABEL_PREFIX,
  HIRE_STATUS_LABEL_PREFIX,
  HIRE_STATUS_OPTIONS,
} from '@configs/constants';
import { GTM_EVENTS } from '@configs/constants/gtm-events';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import {
  COMPANY_PEOPLE_ONBOARDING_CREATE,
  COMPANY_PEOPLE_ONBOARDING_WORKER_DETAIL,
} from '@configs/routes';
import { DataGridExportApi, WorkerEmploymentApi } from '@services/apis/people';

type FilterType = Filter<WorkerEmploymentFilter>[];

const CompanyPeopleOnboarding: NextPage = ({ isDesktop, session }) => {
  const router = useRouter();
  const { t } = useTranslation('company-people-onboarding');

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
      'status',
      'hireType',
      'startDate',
      'employmentId',
      'employmentType',
      'status',
      'employmentId',
      'companyId',
      'company:companyId,name',
      'hiringCountryCode',
      'hiringCountry:id,code,name',
      'workerUserId',
      'workerUser.userContext.user:id,cognitoId,firstName,lastName',
    ],
    []
  );

  const sortBy = useMemo<SortBy<keyof WorkerEmployment>>(
    () => `createdAt,${SortByOperator.DESC}`,
    []
  );

  const columnFilters = useMemo<Filter<WorkerEmploymentFilter>[]>(
    () => [
      ...filters,
      `status,${StringOperator.NOT_EQUALS},${HireStatus.ONBOARDED}`,
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
    attributes,
    sortBy,
    columnFilters,
    setLoading,
  ]);

  const operators = getGridStringOperators().filter(
    (operator) => operator.value === StringOperator.CONTAINS
  );

  const constantOperators = getGridSingleSelectOperators().filter(
    (operator) => operator.value === SingleSelectOperator.IS
  );

  const hiringStatusOptions = useMemo(
    () =>
      HIRE_STATUS_OPTIONS.map((hireStatus) => ({
        ...hireStatus,
        value: hireStatus.id,
        label: t(hireStatus.label),
      })).filter(
        (hireStatus) =>
          hireStatus.value === HireStatus.EMPLOYEE_INVITED ||
          hireStatus.value === HireStatus.EMPLOYEE_DECLARATION ||
          hireStatus.value === HireStatus.CONTRACT_ACCEPTANCE
      ),
    [t]
  );

  const onHandleExportCSV = useCallback(async () => {
    try {
      if (rowCount) {
        await DataGridExportApi.exportDataGrid<
          DataGridExportContext,
          keyof WorkerEmployment,
          WorkerEmploymentFilter,
          keyof WorkerEmployment
        >(session, DataGridExportContext.COMPANY_PEOPLE_ONBOARDING, {
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
        field: 'status',
        headerName: t('dataGrid.header.status'),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterOperators: constantOperators,
        valueOptions: hiringStatusOptions,
        type: 'singleSelect',
        disableColumnMenu: true,
        valueFormatter: ({ value }) => t(`${HIRE_STATUS_LABEL_PREFIX}${value}`),
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
        field: 'employmentType',
        headerName: t('dataGrid.header.employmentType'),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterable: false,
        disableColumnMenu: true,
        valueGetter: ({ row }) =>
          row.employmentType
            ? t(`${EMPLOYMENT_TYPE_LABEL_PREFIX}${row.employmentType}`)
            : '-',
      },
      {
        field: 'startDate',
        headerName: t('dataGrid.header.startDate'),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterable: false,
        disableColumnMenu: true,
        valueFormatter: ({ value }) =>
          format(new Date(value as string), DEFAULT_DATE_FORMAT),
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
                data-testid="companyPeopleOnboarding-row-itemOptions"
              >
                <KeyboardArrowDown
                  fontSize="small"
                  fill="black"
                  data-testid="companyPeopleOnboarding-row-arrowDown"
                />
              </Box>
              <AnchorMenu
                open={!!anchorEl && idElement === employmentId}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
              >
                {row.status === HireStatus.DRAFT && (
                  <MenuItem
                    key="finishAndInvite"
                    data-testid="companyPeopleOnboarding-row-finishAndInvite"
                    onClick={() => {
                      const queryParams = new URLSearchParams({
                        hireType: HireTypeQuery.EOR,
                        mode: ModeQuery.GUIDED,
                        employmentId: row.employmentId,
                        step: ClientOnboardingPeoOrEorPage.HIRING_DETAILS.toString(),
                      });

                      window.open(
                        `${COMPANY_PEOPLE_ONBOARDING_CREATE.path}?${queryParams}`
                      );
                    }}
                  >
                    <Typography>
                      {t('dataGrid.menuItems.finishAndInvite')}
                    </Typography>
                  </MenuItem>
                )}
                <MenuItem
                  key="viewProfile"
                  data-testid="companyPeopleOnboarding-row-viewProfile"
                  onClick={() => {
                    window.open(
                      renderString(
                        COMPANY_PEOPLE_ONBOARDING_WORKER_DETAIL.path,
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
    [t, constantOperators, hiringStatusOptions, operators, anchorEl, idElement]
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
        dataTestId="companyPeopleOnboarding-toast"
      >
        {toast.message}
      </Toast>
      <DataGrid<FilterType>
        rows={rows}
        columns={columns}
        loading={loading}
        rowCount={rowCount}
        filters={filters}
        dataTestId="companyPeopleOnboarding-dataGrid"
        components={{
          NoRowsOverlay: () => (
            <NoRowsOverlay
              icon="PersonPin"
              title={t('dataGrid.noRowsOverlay.title')}
              description={t('dataGrid.noRowsOverlay.description')}
              dataTestId="no-rows-overlay-companyOnboarding"
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
            key="addNewHire"
            onClick={() => {
              fireGtmEvent<GTM_EVENTS>({
                event: GTM_EVENTS.CLIENT_PORTAL_ONBOARDING_ADD_NEW_HIRE,
              });
              router.push(COMPANY_PEOPLE_ONBOARDING_CREATE.path);
            }}
            data-testid="companyPeopleOnboarding-addNewHire-button"
          >
            <PersonAdd fontSize="small" color="primary" />
            <Typography marginLeft="0.5rem">
              {t('dataGrid.menuItems.addNewHire')}
            </Typography>
          </MenuItem>,
          <MenuItem
            key="exportData"
            onClick={onHandleExportCSV}
            data-testid="companyPeopleOnboarding-exportData-button"
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

export default CompanyPeopleOnboarding;

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'common',
      'employment-type',
      'company-people-onboarding',
      'data-grid-export',
      'hire-status',
    ])),
  },
});
