import {
  Attribute,
  DateOperator,
  Filter,
  RowsState,
  SortBy,
  SortByOperator,
  StringOperator,
  UserSession,
} from '@ayp/typings/commons';
import {
  Company,
  Department,
  DepartmentFilter,
  DepartmentSortBy,
} from '@ayp/typings/entities';
import { Option } from '@ayp/typings/ui';
import { isErrorResponse } from '@ayp/utils';
import { KeyboardArrowDown } from '@mui/icons-material';
import { Box, Grid, MenuItem, Typography } from '@mui/material';
import {
  getGridDateOperators,
  getGridStringOperators,
  GridColDef,
} from '@mui/x-data-grid';
import { format } from 'date-fns';
import { TFunction } from 'i18next';
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { DepartmentModal } from '@components/commons/department/department-modal';
import { DataGrid, Toast } from '@components/ui';
import { AnchorMenu } from '@components/ui/anchor-menu';
import { DEFAULT_DATE_FORMAT, DEFAULT_PAGE_SIZE } from '@configs/constants';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { DepartmentApi } from '@services/apis/people';
import EmployeeManagement from '@components/commons/department/manage-employee-modal';

type FilterType = Filter<DepartmentFilter>[];

interface DepartmentProps {
  t: TFunction;
  session: UserSession;
  company: Company;
  showDepartmentModal: boolean;
  setShowDepartmentModal: (value: boolean) => void;
  setToast: Dispatch<SetStateAction<Toast>>;
}

const DepartmentTab: FC<DepartmentProps> = ({
  t,
  company,
  session,
  showDepartmentModal,
  setShowDepartmentModal,
  setToast,
}) => {
  const [rows, setRows] = useState<Department[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [filters, setFilters] = useState<FilterType>([]);
  const [anchorEl, setAnchorEl] = useState<Nullable<Element>>(null);
  const [idElement, setIdElement] = useState<Nullable<string>>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showEmployeeManagementModal, setShowEmployeeManagementModal] =
    useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Nullable<Department>>(null);
  const [assignedEmployeeOptions, setAssignedEmployeeOptions] = useState<
    Option<string>[]
  >([]);
  const [rowsState, setRowsState] = useState<RowsState>({
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const handlePaginationModelChange = (newPaginationModel: RowsState) => {
    setRowsState({
      page: newPaginationModel.page,
      pageSize: newPaginationModel.pageSize,
    });
  };

  const attributes = useMemo<Attribute<keyof Department>[]>(
    () => [
      'departmentId',
      'name',
      'workerEmployments.workerUser.userContext.user:cognitoId,firstName,lastName,email',
      'createdBy.user:cognitoId,id,firstName,lastName',
      'createdAt',
      'updatedAt',
      'createdById',
      'updatedById',
      'updatedBy.user:cognitoId,id,firstName,lastName',
    ],
    []
  );

  const sortBy = useMemo<SortBy<DepartmentSortBy>>(
    () => `createdAt,${SortByOperator.DESC}`,
    []
  );

  const operators = getGridStringOperators().filter(
    (operator) => operator.value === StringOperator.CONTAINS
  );

  const dateOperators = getGridDateOperators().filter((operator) =>
    Object.values<string>(DateOperator).includes(operator.value)
  );

  const fetchData = useCallback(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const { departments, meta } = await DepartmentApi.getDepartments(
          session,
          company.companyId,
          { ...rowsState, attributes, filters, sortBy }
        );

        /* istanbul ignore next */
        // this case doesn't necessary to test
        if (!active) return;

        setRows(departments);
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

    /* istanbul ignore next */
    // this case doesn't necessary to test
    return () => {
      active = false;
    };
  }, [
    attributes,
    company.companyId,
    filters,
    rowsState,
    session,
    setToast,
    sortBy,
    t,
  ]);

  useEffect(() => {
    (async () => {
      fetchData();
    })();
  }, [fetchData]);

  const handleClickRowOption =
    (idElement: string) => (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      setIdElement(idElement);
    };

  const handleEditDepartment = useCallback(
    (department: Department) => {
      setShowDepartmentModal(true);
      setIsEditing(true);
      setSelectedDepartment(department);
    },
    [setShowDepartmentModal]
  );

  const handleManageEmployees = useCallback(
    (department: Department) => {
      setShowDepartmentModal(true);
      setShowEmployeeManagementModal(true);
      setSelectedDepartment(department);
      setAssignedEmployeeOptions(
        department.workerEmployments.map(({ employmentId, workerUser }) => ({
          label: `${workerUser.userContext.user.firstName} ${workerUser.userContext.user.lastName}`,
          email: workerUser.userContext.user.email,
          id: employmentId,
        }))
      );
    },
    [setShowDepartmentModal]
  );

  const handleCloseModal = useCallback(() => {
    if (isEditing) {
      setIsEditing(false);
    }
    if (showEmployeeManagementModal) {
      setShowEmployeeManagementModal(false);
    }
    setSelectedDepartment(null);
    setShowDepartmentModal(false);
  }, [isEditing, showEmployeeManagementModal, setShowDepartmentModal]);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: t('departmentTab.dataGrid.header.name'),
        flex: 1,
        sortable: false,
        disableColumnMenu: true,
        minWidth: 200,
        filterOperators: operators,
        valueGetter: ({ row }) => row.name,
      },
      {
        field: 'numberOfEmployees',
        headerName: t('departmentTab.dataGrid.header.numberOfEmployees'),
        flex: 1,
        sortable: false,
        filterable: false,
        minWidth: 200,
        type: 'singleSelect',
        disableColumnMenu: true,
        valueGetter: ({ row }) => `${row?.workerEmployments?.length ?? '-'}`,
      },
      {
        field: 'createdAt',
        headerName: t('departmentTab.dataGrid.header.createdAt'),
        flex: 1,
        sortable: false,
        filterOperators: dateOperators,
        minWidth: 200,
        disableColumnMenu: true,
        valueGetter: ({ row }) =>
          row && format(new Date(row.createdAt as string), DEFAULT_DATE_FORMAT),
      },
      {
        field: 'createdBy.user:fullName',
        headerName: t(
          'departmentTab.dataGrid.header.createdBy.user.firstName;createdBy.user.lastName'
        ),
        flex: 1,
        sortable: false,
        filterOperators: operators,
        minWidth: 200,
        disableColumnMenu: true,
        valueGetter: ({ row }) =>
          row.createdBy?.user
            ? `${row.createdBy.user.firstName} ${row.createdBy.user.lastName}`
            : '-',
      },
      {
        field: 'updatedAt',
        headerName: t('departmentTab.dataGrid.header.updatedAt'),
        flex: 1,
        sortable: false,
        filterOperators: dateOperators,
        minWidth: 200,
        disableColumnMenu: true,
        valueGetter: ({ row }) =>
          row && format(new Date(row.updatedAt as string), DEFAULT_DATE_FORMAT),
      },
      {
        field: 'updatedBy.user:fullName',
        headerName: t(
          'departmentTab.dataGrid.header.updatedBy.user.firstName;updatedBy.user.lastName'
        ),
        flex: 1,
        sortable: false,
        filterOperators: operators,
        minWidth: 200,
        type: 'singleSelect',
        disableColumnMenu: false,
        valueGetter: ({ row }) =>
          row.updatedBy?.user
            ? `${row.updatedBy.user.firstName} ${row.updatedBy.user.lastName}`
            : '-',
      },
      {
        field: 'actions',
        headerName: '',
        flex: 1,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: ({ row }) => {
          const departmentId = row.departmentId;
          return (
            <>
              <Box
                sx={{
                  display: 'flex',
                }}
                onClick={handleClickRowOption(departmentId)}
                data-testid="staffAuditClientList-companyId-departmentRow-itemOptions"
                key={departmentId}
              >
                <KeyboardArrowDown
                  fontSize="small"
                  fill="black"
                  data-testid="staffAuditClientList-companyId-departmentRow-itemOptions-arrowDown"
                />
              </Box>
              <AnchorMenu
                open={!!anchorEl && idElement === departmentId}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
              >
                <MenuItem
                  key="editDepartment"
                  data-testid="staffAuditClientList-companyId-departmentRow-itemOptions-editDepartment"
                  onClick={() => handleEditDepartment(row)}
                >
                  <Typography>
                    {t(
                      'departmentTab.dataGrid.rowOptions.editDepartment.title'
                    )}
                  </Typography>
                </MenuItem>
                <MenuItem
                  key="manageEmployees"
                  data-testid="staffAuditClientList-companyId-departmentRow-itemOptions-manageEmployees"
                  onClick={() => handleManageEmployees(row)}
                >
                  <Typography>
                    {t(
                      'departmentTab.dataGrid.rowOptions.manageEmployees.title'
                    )}
                  </Typography>
                </MenuItem>
              </AnchorMenu>
            </>
          );
        },
      },
    ],
    [
      t,
      operators,
      dateOperators,
      anchorEl,
      idElement,
      handleEditDepartment,
      handleManageEmployees,
    ]
  );

  const renderDepartmentModal = useMemo(
    () =>
      showDepartmentModal ? (
        showEmployeeManagementModal && selectedDepartment ? (
          <EmployeeManagement
            t={t}
            session={session}
            companyId={company.companyId}
            departmentId={selectedDepartment.departmentId}
            assignedEmployeeOptions={assignedEmployeeOptions}
            onSuccess={() => {
              fetchData();
              setShowDepartmentModal(false);
              setShowEmployeeManagementModal(false);
              setSelectedDepartment(null);
            }}
            onClose={handleCloseModal}
            setToast={setToast}
          />
        ) : (
          <DepartmentModal
            t={t}
            session={session}
            companyId={company.companyId}
            departmentId={selectedDepartment?.departmentId}
            name={selectedDepartment?.name}
            isEditing={isEditing}
            onSuccess={() => {
              fetchData();
              setIsEditing(false);
              setShowDepartmentModal(false);
              setSelectedDepartment(null);
            }}
            onClose={handleCloseModal}
            setToast={setToast}
          />
        )
      ) : (
        <></>
      ),
    [
      showDepartmentModal,
      selectedDepartment,
      showEmployeeManagementModal,
      t,
      session,
      company.companyId,
      assignedEmployeeOptions,
      handleCloseModal,
      setToast,
      isEditing,
      fetchData,
      setShowDepartmentModal,
    ]
  );

  return (
    <>
      <Grid
        container
        sx={{
          minHeight: '75vh',
          padding: 2,
        }}
      >
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
          searchFilterPlaceholder={t(
            'departmentTab.dataGrid.searchPlaceholder'
          )}
          components={{
            NoRowsOverlay: () => <></>,
          }}
          getRowId={(row) => row.departmentId + row.name}
          pagination
          paginationMode="server"
          paginationModel={{ ...rowsState }}
          onPaginationModelChange={handlePaginationModelChange}
        />
      </Grid>
      {renderDepartmentModal}
    </>
  );
};

export default DepartmentTab;
