import {
  Filter,
  NextPage,
  RowsState,
  SortByOperator,
  Attribute,
  SortBy,
  StringOperator,
  DateOperator,
} from '@ayp/typings/commons';
import {
  Industry,
  IndustryFilter,
  IndustrySortBy,
} from '@ayp/typings/entities';
import { Box, MenuItem, Typography } from '@mui/material';
import {
  getGridDateOperators,
  getGridStringOperators,
  GridColDef,
} from '@mui/x-data-grid';
import { format } from 'date-fns';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { AppLayout } from '@components/commons';
import { AnchorMenu, DataGrid, NoRowsOverlay, Toast } from '@components/ui';
import { DEFAULT_DATE_FORMAT, DEFAULT_PAGE_SIZE } from '@configs/constants';
import { RedirectionError } from '@configs/errors';
import { IndustryApi } from '@services/apis/people';
import { KeyboardArrowDown, PersonAdd } from '@mui/icons-material';
import IndustryModal from '@components/pages/staff/setup/calendar/industry/industry-modal';
import { isErrorResponse } from '@ayp/utils';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';

type FilterType = Filter<IndustryFilter>[];

const StaffSetUpIndustry: NextPage = ({ isDesktop, session }) => {
  const { t } = useTranslation('staff-setup-industry');
  const [toast, setToast] = useState<Toast>({});
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState<number>(0);
  const [rows, setRows] = useState<Industry[]>([]);
  const [filters, setFilters] = useState<FilterType>([]);

  const [showAddOrEditIndustry, setShowAddOrEditIndustry] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [nameIndustry, setNameIndustry] = useState('');
  const [industryId, setIndustryId] = useState('');

  const [anchorEl, setAnchorEl] = useState<Nullable<Element>>(null);
  const [idElement, setIdElement] = useState<Nullable<string>>(null);

  const [rowsState, setRowsState] = useState<RowsState>({
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const attributes = useMemo<Attribute<keyof Industry>[]>(
    () => [
      'id',
      'name',
      'industryId',
      'createdById',
      'createdBy.user:cognitoId,id,firstName,lastName',
      'createdAt',
      'updatedById',
      'updatedBy.user:cognitoId,id,firstName,lastName',
      'updatedAt',
    ],
    []
  );

  const sortBy = useMemo<SortBy<IndustrySortBy>>(
    () => `createdAt,${SortByOperator.DESC}`,
    []
  );

  const fetchData = useCallback(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const { industries, meta } = await IndustryApi.list(session, {
          ...rowsState,
          attributes,
          filters,
          sortBy,
        });

        if (!active) return;

        setRows(industries);
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
  }, [t, rowsState, session, setLoading, filters, attributes, sortBy]);

  useEffect(() => {
    return fetchData();
  }, [fetchData]);

  const operators = getGridStringOperators().filter(
    (operator) => operator.value === StringOperator.CONTAINS
  );

  const dateOperators = getGridDateOperators().filter((operator) =>
    Object.values<string>(DateOperator).includes(operator.value)
  );

  const onHandleClick =
    (idElement: string) => (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      setIdElement(idElement);
    };

  const onHandleCloseModal = useCallback(() => {
    if (isEditMode) {
      setIsEditMode(false);
      setIndustryId('');
    }
    setShowAddOrEditIndustry(false);
  }, [isEditMode]);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: t('dataGrid.header.name'),
        flex: 1,
        sortable: false,
        minWidth: 250,
        filterOperators: operators,
        valueGetter: ({ row }) => `${row.name ?? '-'}`,
        disableColumnMenu: true,
      },
      {
        field: 'createdAt',
        headerName: t('dataGrid.header.createdAt'),
        flex: 1,
        sortable: false,
        minWidth: 150,
        filterOperators: dateOperators,
        valueFormatter: ({ value }) =>
          format(new Date(value as string), DEFAULT_DATE_FORMAT),
        disableColumnMenu: true,
      },
      {
        field: 'createdBy.user:fullName',
        headerName: t(
          'dataGrid.header.createdBy.user.firstName;createdBy.user.lastName'
        ),
        flex: 1,
        sortable: false,
        minWidth: 250,
        filterOperators: operators,
        valueGetter: ({ row }) =>
          row.createdBy
            ? `${row?.createdBy?.user?.firstName} ${row?.createdBy?.user?.lastName}`
            : '-',
        disableColumnMenu: true,
      },
      {
        field: 'updatedAt',
        headerName: t('dataGrid.header.updatedAt'),
        flex: 1,
        sortable: false,
        minWidth: 150,
        filterOperators: dateOperators,
        valueFormatter: ({ value }) =>
          format(new Date(value as string), DEFAULT_DATE_FORMAT),
        disableColumnMenu: true,
      },

      {
        field: 'updatedBy.user:fullName',
        headerName: t(
          'dataGrid.header.updatedBy.user.firstName;updatedBy.user.lastName'
        ),
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
              width: '100%',
              justifyContent: 'space-between',
            }}
            key={row.industryId}
          >
            <Typography>
              {row.updatedBy
                ? `${row?.updatedBy?.user?.firstName} ${row?.updatedBy?.user?.lastName}`
                : '-'}
            </Typography>
            <Box
              sx={{
                display: 'flex',
              }}
              onClick={onHandleClick(row.industryId)}
              data-testid="staffSetupIndustry-row-itemOptions"
            >
              <KeyboardArrowDown fontSize="small" fill="black" />
            </Box>
            <AnchorMenu
              open={!!anchorEl && idElement === row.industryId}
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
            >
              <MenuItem
                key="editIndustry"
                onClick={() => {
                  setIsEditMode(true);
                  setNameIndustry(row.name);
                  setShowAddOrEditIndustry(true);
                  setIndustryId(row.industryId);
                }}
                data-testid="staffSetupIndustry-row-editIndustry"
              >
                <Typography>{t('industry.editIndustry.title')}</Typography>
              </MenuItem>
            </AnchorMenu>
          </Box>
        ),
      },
    ],
    [t, operators, dateOperators, anchorEl, idElement]
  );

  const addOrEditIndustryMemo = useMemo(
    () =>
      showAddOrEditIndustry && (
        <IndustryModal
          t={t}
          session={session}
          isEditMode={isEditMode}
          name={nameIndustry}
          onSuccess={fetchData}
          onClose={onHandleCloseModal}
          setToast={setToast}
          industryId={industryId}
        />
      ),
    [
      t,
      session,
      showAddOrEditIndustry,
      isEditMode,
      nameIndustry,
      onHandleCloseModal,
      industryId,
      fetchData,
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
      {addOrEditIndustryMemo}
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId="staffSetUpIndustry-toast"
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
        searchFilterColumnField="name"
        searchFilterOperatorValue={StringOperator.CONTAINS}
        searchFilterPlaceholder={t('dataGrid.searchPlaceholder')}
        dataTestId="staffSetUpIndustry-dataGrid"
        components={{
          NoRowsOverlay: () => (
            <NoRowsOverlay
              icon="PersonPin"
              title={t('dataGrid.noRowsOverlay.title')}
              description={t('dataGrid.noRowsOverlay.description')}
              dataTestId="staffSetUpIndustry-noRowsOverLay"
            />
          ),
        }}
        menuItems={[
          <MenuItem
            key="addNewIndustry"
            onClick={() => {
              setNameIndustry('');
              setShowAddOrEditIndustry(true);
            }}
            data-testid="staffSetUpIndustry-addNewIndustry-button"
          >
            <PersonAdd fontSize="small" color="primary" />
            <Typography marginLeft="0.5rem">
              {t('industry.addNewIndustry.title')}
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

export default StaffSetUpIndustry;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    return {
      props: {
        ...(await serverSideTranslations(context.locale ?? 'en', [
          'common',
          'staff-setup-industry',
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
