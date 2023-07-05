import {
  Attribute,
  ErrorCode,
  Filter,
  NextPage,
  RowsState,
  SingleSelectOperator,
  SortBy,
  SortByOperator,
  StringOperator,
} from '@ayp/typings/commons';
import {
  DataGridExportContext,
  ServiceAgreement,
  ServiceAgreementsFilter,
  ServiceAgreementsSortBy,
} from '@ayp/typings/entities';
import { isErrorResponse, renderString } from '@ayp/utils';
import { CloudDownloadOutlined, KeyboardArrowDown } from '@mui/icons-material';
import { Box, MenuItem, Typography } from '@mui/material';
import {
  getGridSingleSelectOperators,
  getGridStringOperators,
  GridColDef,
} from '@mui/x-data-grid';
import { differenceInCalendarDays } from 'date-fns';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { AppLayout } from '@components/commons';
import { DataGrid, NoRowsOverlay, Toast } from '@components/ui';
import { AnchorMenu } from '@components/ui/anchor-menu';
import {
  DEFAULT_PAGE_SIZE,
  SERVICE_AGREEMENTS_STATUS_LABEL_PREFIX,
  SERVICE_AGREEMENTS_STATUS_OPTIONS,
} from '@configs/constants';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { STAFF_AUDIT_CLIENT_SERVICE_AGREEMENTS_DETAIL } from '@configs/routes';
import { DataGridExportApi, ServiceAgreementApi } from '@services/apis/people';

type FilterType = Filter<ServiceAgreementsFilter>[];

const StaffAuditClientServiceAgreements: NextPage = ({
  isDesktop,
  session,
}) => {
  const { t } = useTranslation('staff-audit-client-service-agreements');
  const [anchorEl, setAnchorEl] = useState<Nullable<Element>>(null);
  const [toast, setToast] = useState<Toast>({});

  const [idElement, setIdElement] = useState<Nullable<string>>(null);
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState<number>(0);
  const [rows, setRows] = useState<ServiceAgreement[]>([]);
  const [filters, setFilters] = useState<FilterType>([]);

  const [rowsState, setRowsState] = useState<RowsState>({
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const attributes = useMemo<Attribute<keyof ServiceAgreement>[]>(
    () => [
      'id',
      'serviceAgreementId',
      'companyId',
      'company:id,companyId,name',
      'createdAt',
      'hireType',
      'lastInReviewAt',
      'iterationCount',
      'status',
    ],
    []
  );

  const sortBy = useMemo<SortBy<ServiceAgreementsSortBy>>(
    () => `createdAt,${SortByOperator.DESC}`,
    []
  );

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { serviceAgreements, meta } = await ServiceAgreementApi.list(
        session,
        {
          attributes,
          ...rowsState,
          filters,
          sortBy: `createdAt,${SortByOperator.DESC}`,
        }
      );

      if (!active) return;

      setRows(serviceAgreements);
      setRowCount(meta.rowCount);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [rowsState, session, setLoading, filters, attributes, sortBy]);

  const serviceAgreementStatusOptions = useMemo(
    () =>
      SERVICE_AGREEMENTS_STATUS_OPTIONS.map((serviceAgreementStatus) => ({
        ...serviceAgreementStatus,
        value: serviceAgreementStatus.id,
        label: t(serviceAgreementStatus.label),
      })),
    [t]
  );

  const operators = getGridStringOperators().filter(
    (operator) => operator.value === StringOperator.CONTAINS
  );

  const statusOperators = getGridSingleSelectOperators().filter(
    (operator) => operator.value === SingleSelectOperator.IS
  );

  const onHandleClick =
    (idElement: string) => (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      setIdElement(idElement);
    };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'company:name',
        headerName: t('dataGrid.header.company.name'),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterOperators: operators,
        disableColumnMenu: true,
        valueGetter: ({ row }) => `${row.company?.name ?? '-'}`,
      },
      {
        field: 'hireType',
        headerName: t('dataGrid.header.hireType'),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterOperators: operators,
        disableColumnMenu: true,
        valueGetter: ({ row }) =>
          row.hireType ? t(`dataGrid.columns.hireType.${row.hireType}`) : '-',
      },
      {
        field: 'lastInReviewAt',
        headerName: t('dataGrid.header.lastInReviewAt'),
        flex: 1,
        sortable: false,
        minWidth: 150,
        filterable: false,
        disableColumnMenu: true,
        valueGetter: ({ row }) =>
          row.lastInReviewAt
            ? differenceInCalendarDays(new Date(), new Date(row.lastInReviewAt))
            : '-',
      },
      {
        field: 'iterationCount',
        headerName: t('dataGrid.header.iterationCount'),
        flex: 1,
        sortable: false,
        minWidth: 150,
        filterable: false,
        disableColumnMenu: true,
        valueGetter: ({ row }) => `${row.iterationCount ?? '-'}`,
      },
      {
        field: 'status',
        headerName: t('dataGrid.header.status'),
        flex: 1,
        sortable: false,
        minWidth: 300,
        filterOperators: statusOperators,
        valueOptions: serviceAgreementStatusOptions,
        type: 'singleSelect',
        disableColumnMenu: true,
        renderCell: ({ row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
            }}
            key={row.serviceAgreementId}
          >
            <Typography>
              {t(`${SERVICE_AGREEMENTS_STATUS_LABEL_PREFIX}${row.status}`)}
            </Typography>
            <Box
              sx={{
                display: 'flex',
              }}
              onClick={onHandleClick(row.serviceAgreementId)}
              data-testid="staffAuditClientServiceAgreements-clientServiceAgreementsRow-itemOptions"
            >
              <KeyboardArrowDown fontSize="small" fill="black" />
            </Box>
            <AnchorMenu
              open={!!anchorEl && idElement === row.serviceAgreementId}
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
            >
              <MenuItem
                key="view"
                data-testid="staffAuditClientServiceAgreements-clientServiceAgreementsRow-itemOptions-view"
                onClick={() => {
                  window.open(
                    renderString(
                      STAFF_AUDIT_CLIENT_SERVICE_AGREEMENTS_DETAIL.path,
                      { serviceAgreementId: row.serviceAgreementId },
                      '_blank'
                    )
                  );
                }}
              >
                <Typography>{t('view.title')}</Typography>
              </MenuItem>
            </AnchorMenu>
          </Box>
        ),
      },
    ],
    [
      t,
      operators,
      statusOperators,
      anchorEl,
      serviceAgreementStatusOptions,
      idElement,
    ]
  );

  const onHandleExportCSV = useCallback(async () => {
    try {
      if (rowCount !== 0) {
        await DataGridExportApi.exportDataGrid<
          DataGridExportContext,
          keyof ServiceAgreement,
          ServiceAgreementsFilter,
          ServiceAgreementsSortBy
        >(
          session,
          DataGridExportContext.STAFF_AUDIT_CLIENT_SERVICE_AGREEMENTS,
          {
            attributes,
            filters,
            sortBy,
          }
        );
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
  }, [filters, session, rowCount, attributes, sortBy, t]);

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
        dataTestId="staffAuditClientServiceAgreements-toast"
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
        dataTestId="staffAuditClientServiceAgreements-dataGrid"
        components={{
          NoRowsOverlay: () => (
            <NoRowsOverlay
              icon="PersonPin"
              title={t('dataGrid.noRowsOverlay.title')}
              description={t('dataGrid.noRowsOverlay.description')}
              dataTestId="no-rows-overlay-clientServiceAgreements"
            />
          ),
        }}
        menuItems={[
          <MenuItem
            key="exportData"
            onClick={onHandleExportCSV}
            data-testid="staffAuditClientServiceAgreements-exportData-button"
          >
            <CloudDownloadOutlined fontSize="small" color="primary" />
            <Typography marginLeft="0.5rem">
              {t('data-grid-export:exportData.title')}
            </Typography>
          </MenuItem>,
        ]}
        pagination
        paginationMode="server"
        paginationModel={{ ...rowsState }}
        onPaginationModelChange={handlePaginationModelChange}
      />
    </AppLayout>
  );
};

export default StaffAuditClientServiceAgreements;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', [
        'common',
        'service-agreements-status',
        'staff-audit-client-service-agreements',
        'data-grid-export',
      ])),
    },
  };
};
