import {
  Filter,
  RowsState,
  SortByOperator,
  Attribute,
  SortBy,
  StringOperator,
  SingleSelectOperator,
  UserSession,
} from '@ayp/typings/commons';
import {
  CompanyPayroll,
  CompanyPayrollFilter,
  CompanyPayrollSortBy,
  CompanyPayrollStatus,
  Role,
} from '@ayp/typings/entities';
import { Box, Typography, Tooltip, Button } from '@mui/material';
import {
  getGridSingleSelectOperators,
  getGridStringOperators,
  GridColDef,
} from '@mui/x-data-grid';
import { TFunction } from 'next-i18next';
import { useRouter } from 'next/router';
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CompanyPayrollApi } from '@services/apis/fintech';
import { isErrorResponse, isUserPermitted, renderString } from '@ayp/utils';
import { InfoOutlined } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';

import { D_MMM_YYYY } from '@configs/constants';

import { CountryFlag, DataGrid, NoRowsOverlay, Toast } from '@components/ui';
import {
  PAYROLL_STATUS_LABEL_PREFIX,
  ACTIVE_PAYROLL_OPTIONS,
  DEFAULT_PAGE_SIZE,
  PAYROLL_TYPE_LABEL_PREFIX,
  PAYROLL_TYPE_OPTIONS,
} from '@configs/constants';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { HIRE_TYPE_LABEL_PREFIX } from '@configs/constants';
import {
  COMPANY_PAYROLL_COMPANY_PAYROLL_DETAIL,
  STAFF_PAYROLL_COMPANY_PAYROLL_DETAIL,
} from '@configs/routes';

type FilterType = Filter<CompanyPayrollFilter>[];
interface TableProps {
  t: TFunction;
  session: UserSession;
  setToast: Dispatch<SetStateAction<Toast>>;
  tab: string;
  newPayrollId?: string;
}

export const Table: FC<TableProps> = ({
  t,
  session,
  setToast,
  tab,
  newPayrollId,
}) => {
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState<number>(0);
  const [rows, setRows] = useState<CompanyPayroll[]>([]);
  const [filters, setFilters] = useState<FilterType>([]);
  const theme = useTheme();
  const role = session?.user?.selectedUserContext?.role;
  const router = useRouter();

  const [rowsState, setRowsState] = useState<RowsState>({
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const attributes = useMemo<Attribute<keyof CompanyPayroll>[]>(
    () => [
      'name',
      'companyPayrollId',
      'companyId',
      'company:companyId,name',
      'countryCode',
      'country:code,name',
      'hireType',
      'cycle',
      'type',
      'periodStartDate',
      'periodEndDate',
      'workerPayrollCount',
      'status',
      'createdAt',
      'updatedAt',
    ],
    []
  );

  const sortBy = useMemo<SortBy<CompanyPayrollSortBy>>(
    () => `createdAt,${SortByOperator.DESC}`,
    []
  );

  const fetchData = useCallback(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const { companyPayrolls, meta } = await CompanyPayrollApi.list(
          session,
          {
            ...rowsState,
            attributes,
            filters,
            sortBy,
          }
        );

        if (!active) return;

        setRows(companyPayrolls);
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
  }, [
    t,
    rowsState,
    session,
    setLoading,
    filters,
    attributes,
    sortBy,
    setToast,
  ]);

  useEffect(() => {
    newPayrollId && fetchData();
    if (!filters.length) return;
    return fetchData();
  }, [fetchData, filters, newPayrollId]);

  useEffect(() => {
    setFilters([
      `status,${
        tab !== CompanyPayrollStatus.PENDING
          ? StringOperator.EQUALS
          : StringOperator.CONTAINS
      },${tab}`,
    ]);
  }, [tab]);

  const operators = getGridStringOperators().filter(
    (operator) => operator.value === StringOperator.CONTAINS
  );

  const constantOperators = getGridSingleSelectOperators().filter(
    (operator) => operator.value === SingleSelectOperator.IS
  );

  const typePayrollOptions = useMemo(
    () =>
      PAYROLL_TYPE_OPTIONS.map((payrollType) => ({
        ...payrollType,
        value: payrollType.id,
        label: t(payrollType.label),
      })),
    [t]
  );

  const statusActivePayrollOptions = useMemo(
    () =>
      ACTIVE_PAYROLL_OPTIONS.map((statusActivePayroll) => ({
        ...statusActivePayroll,
        value: statusActivePayroll.id,
        label: t(statusActivePayroll.label),
      })),
    [t]
  );

  const handleViewPayroll = useCallback(
    (companyPayrollId: string) => {
      const route = isUserPermitted(
        [Role.GP_STAFF_ADMIN, Role.GP_STAFF_AUDITOR],
        role
      )
        ? STAFF_PAYROLL_COMPANY_PAYROLL_DETAIL
        : isUserPermitted([Role.GP_COMPANY_OWNER], role)
        ? COMPANY_PAYROLL_COMPANY_PAYROLL_DETAIL
        : null;

      if (route) {
        router.push(
          renderString(route.path, { id: companyPayrollId }, '_blank')
        );
      }
    },
    [role, router]
  );

  const renderBackgroundColor = useCallback(
    (status: string) => {
      switch (status) {
        case CompanyPayrollStatus.DRAFT:
          return theme.palette.action.selected;
        case CompanyPayrollStatus.PENDING:
        case CompanyPayrollStatus.PENDING_REVIEW:
          return theme.palette.warning.shades.p190;
        case CompanyPayrollStatus.REJECTED:
          return theme.palette.error.shades.p190;
        case CompanyPayrollStatus.COMPLETED:
          return theme.palette.success.shades.p190;
        default:
          return '';
      }
    },
    [theme]
  );

  const renderTextColor = useCallback(
    (status: string) => {
      switch (status) {
        case CompanyPayrollStatus.DRAFT:
          return theme.palette.action.active;
        case CompanyPayrollStatus.PENDING:
        case CompanyPayrollStatus.PENDING_REVIEW:
          return theme.palette.warning.main;
        case CompanyPayrollStatus.REJECTED:
          return theme.palette.error.main;
        case CompanyPayrollStatus.COMPLETED:
          return theme.palette.success.main;
        default:
          return '';
      }
    },
    [theme]
  );

  const renderExtraColumns: Nullable<GridColDef> = useMemo(() => {
    switch (tab) {
      case CompanyPayrollStatus.PENDING:
        return {
          field: 'actions',
          headerName: '',
          flex: 1,
          sortable: false,
          minWidth: 200,
          filterable: false,
          disableColumnMenu: true,
          renderCell: ({ row }) => (
            <Box>
              <Button>
                <Typography
                  sx={{
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                  }}
                  onClick={() => handleViewPayroll(row.companyPayrollId)}
                >
                  {t('dataGrid.reviewPayroll')}
                </Typography>
              </Button>
            </Box>
          ),
        };
      case CompanyPayrollStatus.DRAFT:
        return {
          field: 'actions',
          headerName: '',
          flex: 1,
          sortable: false,
          minWidth: 200,
          filterable: false,
          disableColumnMenu: true,
          renderCell: ({ row }) => (
            <Box>
              <Button>
                <Typography
                  sx={{
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                  }}
                  onClick={() => handleViewPayroll(row.companyPayrollId)}
                >
                  {t('dataGrid.viewAndSubmit')}
                </Typography>
              </Button>
            </Box>
          ),
        };
      default:
        return null;
    }
  }, [t, tab, handleViewPayroll]);

  const renderTitleTooltip = useCallback((status: string, t: TFunction) => {
    switch (status) {
      case CompanyPayrollStatus.DRAFT:
        return t('dataGrid.toolTip.draft');
      case CompanyPayrollStatus.PENDING:
      case CompanyPayrollStatus.PENDING_REVIEW:
        return t('dataGrid.toolTip.pending');
      case CompanyPayrollStatus.REJECTED:
        return t('dataGrid.toolTip.rejected');
      case CompanyPayrollStatus.COMPLETED:
        return t('dataGrid.toolTip.completed');
      default:
        return '';
    }
  }, []);

  const columns: GridColDef[] = useMemo(() => {
    const clientColumn: GridColDef[] = [
      {
        field: 'company:name',
        headerName: t('dataGrid.header.company.name'),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterable: false,
        valueGetter: ({ row }) => `${row.company.name ?? '-'}`,
        disableColumnMenu: true,
      },
    ];

    const defaultColum: GridColDef[] = [
      {
        field: 'country',
        headerName: t('dataGrid.header.country'),
        flex: 1,
        sortable: false,
        filterable: false,
        minWidth: 200,
        disableColumnMenu: true,
        renderCell: ({ value }) =>
          value ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '50%',
              }}
            >
              <CountryFlag code={value?.code} />
              <Typography ml={2}>{value?.name}</Typography>
            </Box>
          ) : (
            '-'
          ),
      },
      ...(isUserPermitted([Role.GP_STAFF_ADMIN, Role.GP_STAFF_AUDITOR], role)
        ? clientColumn
        : []),
      {
        field: 'hireType',
        headerName: t('dataGrid.header.hireType'),
        flex: 1,
        sortable: false,
        minWidth: 150,
        filterOperators: operators,
        disableColumnMenu: true,
        valueGetter: ({ row }) =>
          `${t(`${HIRE_TYPE_LABEL_PREFIX}${row.hireType}`) ?? '-'}`,
      },
      {
        field: 'name',
        headerName: t('dataGrid.header.name'),
        flex: 1,
        sortable: false,
        minWidth: 150,
        filterOperators: operators,
        disableColumnMenu: true,
        valueGetter: ({ row }) => row.name ?? '-',
      },
      {
        field: 'payrollPeriod',
        headerName: t('dataGrid.header.periodStartDate;periodEndDate'),
        flex: 1,
        sortable: false,
        minWidth: 250,
        valueGetter: ({ row }) => {
          const startDate = row.periodStartDate
            ? format(new Date(row.periodStartDate), D_MMM_YYYY)
            : '';
          const endDate = row.periodEndDate
            ? format(new Date(row.periodEndDate), D_MMM_YYYY)
            : '';
          return `${startDate} - ${endDate}`;
        },
        disableColumnMenu: true,
      },
      {
        field: 'type',
        headerName: t('dataGrid.header.type'),
        flex: 1,
        sortable: false,
        minWidth: 150,
        filterOperators: constantOperators,
        type: 'singleSelect',
        valueOptions: typePayrollOptions,
        valueFormatter: ({ value }) =>
          t(`${PAYROLL_TYPE_LABEL_PREFIX}${value}`),
        disableColumnMenu: true,
      },
      {
        field: 'workerPayrollCount',
        headerName: t('dataGrid.header.workerPayrollCount'),
        flex: 1,
        sortable: false,
        minWidth: 150,
        filterable: false,
        valueGetter: ({ row }) => `${row.workerPayrollCount ?? '-'}`,
        disableColumnMenu: true,
      },
      {
        field: 'status',
        headerName: t('dataGrid.header.status'),
        flex: 1,
        sortable: false,
        minWidth: 150,
        filterOperators: constantOperators,
        valueOptions: statusActivePayrollOptions,
        type: 'singleSelect',
        disableColumnMenu: true,
        renderCell: ({ value }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                background: renderBackgroundColor(value),
                padding: '0.2rem 0.5rem',
                borderRadius: '0.2rem',
                marginRight: '1rem',
              }}
            >
              <Typography
                sx={{
                  color: renderTextColor(value),
                  fontSize: '0.8rem',
                  fontWeight: 500,
                }}
              >
                {t(`${PAYROLL_STATUS_LABEL_PREFIX}${value}`)}
              </Typography>
            </Box>
            <Tooltip title={renderTitleTooltip(value, t)}>
              <InfoOutlined sx={{ fontSize: '1rem' }} />
            </Tooltip>
          </Box>
        ),
      },
    ];

    if (!renderExtraColumns) return defaultColum;

    defaultColum.push(renderExtraColumns);

    return defaultColum;
  }, [
    t,
    operators,
    constantOperators,
    statusActivePayrollOptions,
    typePayrollOptions,
    renderBackgroundColor,
    renderTextColor,
    renderTitleTooltip,
    renderExtraColumns,
    role,
  ]);

  const handlePaginationModelChange = (newPaginationModel: RowsState) => {
    setRowsState({
      page: newPaginationModel.page,
      pageSize: newPaginationModel.pageSize,
    });
  };

  return (
    <DataGrid<FilterType>
      rows={rows}
      columns={columns}
      loading={loading}
      rowCount={rowCount}
      filters={filters}
      setFilters={setFilters}
      searchFilterColumnField="name"
      searchFilterOperatorValue={StringOperator.CONTAINS}
      searchFilterPlaceholder={t('dataGrid.searchPlaceholder')}
      components={{
        NoRowsOverlay: () => (
          <NoRowsOverlay
            icon="PersonPin"
            title={t('dataGrid.noRowsOverlay.title')}
            description={t('dataGrid.noRowsOverlay.description')}
          />
        ),
      }}
      pagination
      paginationMode="server"
      getRowId={(row) => row.companyPayrollId}
      paginationModel={{ ...rowsState }}
      onPaginationModelChange={handlePaginationModelChange}
    />
  );
};
