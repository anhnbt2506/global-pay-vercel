import {
  Attribute,
  DateOperator,
  ErrorCode,
  Filter,
  NextPage,
  RowsState,
  SingleSelectOperator,
  SortBy,
  SortByOperator,
  StringOperator,
  UserSession,
} from '@ayp/typings/commons';
import {
  DataGridExportContext,
  WorkerEmployment,
  WorkerEmploymentFilter,
  WorkerEmploymentSortBy,
} from '@ayp/typings/entities';
import { isErrorResponse, renderString } from '@ayp/utils';
import {
  CloudDownloadOutlined,
  KeyboardArrowDown,
  PersonAdd,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  MenuItem,
  Typography,
} from '@mui/material';
import {
  getGridDateOperators,
  getGridSingleSelectOperators,
  getGridStringOperators,
  GridColDef,
} from '@mui/x-data-grid';
import { format } from 'date-fns';
import { Form, Formik } from 'formik';
import type { GetServerSideProps } from 'next';
import { TFunction, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { AppLayout } from '@components/commons';
import { AddNewHireFormFields } from '@components/pages/staff/audit/client-hires/add-new-hire-form-fields';
import {
  initialValues,
  StaffAuditClientHiresFormValues,
  validationSchema,
  WORKER_BULK_UPLOAD_TEMPLATE_LINK,
} from '@components/pages/staff/audit/client-hires/config';
import {
  ButtonSubmit,
  CountryFlag,
  DataGrid,
  Link,
  NoRowsOverlay,
  Toast,
} from '@components/ui';
import { AnchorMenu } from '@components/ui/anchor-menu';
import {
  BOOLEAN_NO_LABEL,
  BOOLEAN_OPTIONS,
  BOOLEAN_YES_LABEL,
  CITIZENSHIP_STATUS_OPTIONS,
  DEFAULT_DATE_FORMAT,
  DEFAULT_PAGE_SIZE,
  HIRE_STATUS_OPTIONS,
} from '@configs/constants';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { STAFF_AUDIT_CLIENT_HIRES_DETAIL } from '@configs/routes';
import { DataGridExportApi, WorkerEmploymentApi } from '@services/apis/people';
import { S3Api } from '@services/s3';

const AddNewHire: FC<{
  t: TFunction;
  session: UserSession;
  onClose: VoidFunction;
  onSuccess: VoidFunction;
  setToast: Dispatch<SetStateAction<Toast>>;
  setShowAddNewHire: Dispatch<SetStateAction<boolean>>;
}> = ({ t, onClose, onSuccess, session, setToast, setShowAddNewHire }) => {
  const onSubmit = async (values: StaffAuditClientHiresFormValues) => {
    try {
      const { csvBulkUpload, uploadContext, company, hireType } = values;

      /* istanbul ignore next */
      // this is already handled by validation formik
      if (!csvBulkUpload || !uploadContext || !company?.id || !hireType) return;

      await S3Api.upload(
        csvBulkUpload,
        uploadContext.presignedUrl,
        uploadContext.headers
      );

      await WorkerEmploymentApi.postCsv(session, {
        key: uploadContext.key,
        companyId: company?.id,
        hireType,
        originalFileName: csvBulkUpload.name,
      });

      setToast({
        severity: 'success',
        message: t('addNewHire.fileUploaded'),
      });
      onSuccess();
    } catch (e) {
      if (isErrorResponse(e)) {
        setToast({
          severity: 'error',
          message: e.error.name,
        });
      }
    } finally {
      setShowAddNewHire(false);
    }
  };

  return (
    <Dialog open fullWidth maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          paddingX: '2rem',
          paddingTop: '2rem',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="h6"
          data-testid="staffClientHires-selectionModal-title"
        >
          {t('addNewHire.title')}
        </Typography>
        <Typography variant="subtitle1" align="center">
          <Link newTab external href={WORKER_BULK_UPLOAD_TEMPLATE_LINK}>
            {t('addNewHire.clickHere')}
          </Link>
          {` ${t('addNewHire.toDownloadTemplate')} ${t(
            'addNewHire.description'
          )}`}
        </Typography>
      </Box>
      <DialogContent
        sx={{
          paddingBottom: '2rem',
        }}
      >
        <Formik
          onSubmit={onSubmit}
          validateOnBlur={false}
          validateOnMount={false}
          validateOnChange={false}
          initialValues={initialValues}
          validationSchema={validationSchema}
        >
          <Form
            noValidate
            style={{
              gap: '1rem',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <AddNewHireFormFields t={t} session={session} />
            <Box
              sx={{
                gap: '2rem',
                display: 'flex',
                justifyContent: 'space-around',
              }}
            >
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{
                  paddingX: '3rem',
                }}
                data-testid="staffClientHires-addNewHire-cancelButton"
              >
                {t('common:cancel')}
              </Button>
              <ButtonSubmit
                variant="contained"
                sx={{
                  paddingX: '3rem',
                }}
                data-testid="staffClientHires-addNewHire-submitButton"
              >
                {t('common:submit')}
              </ButtonSubmit>
            </Box>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

type FilterType = Filter<WorkerEmploymentFilter>[];

const StaffAuditClientHires: NextPage = ({ isDesktop, session }) => {
  const [toast, setToast] = useState<Toast>({});
  const { t } = useTranslation('staff-audit-client-hires');
  const [showAddNewHire, setShowAddNewHire] = useState(false);
  const [anchorEl, setAnchorEl] = useState<Nullable<Element>>(null);
  const [idElement, setIdElement] = useState<Nullable<string>>(null);

  const [loading, setLoading] = useState(true);
  const [rowCount, setRowCount] = useState<number>(0);
  const [rows, setRows] = useState<WorkerEmployment[]>([]);

  const [filters, setFilters] = useState<FilterType>([]);

  const [rowsState, setRowsState] = useState<RowsState>({
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const onHandleClick =
    (idElement: string) => (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      setIdElement(idElement);
    };

  const attributes = useMemo<Attribute<keyof WorkerEmployment>[]>(
    () => [
      'id',
      'hireType',
      'startDate',
      'isPermitRequired',
      'status',
      'employmentId',
      'companyId',
      'company:companyId,name',
      'hiringCountryCode',
      'hiringCountry:id,code,name',
      'workerUserId',
      'workerUser.userContext.user:id,cognitoId,firstName,lastName,email',
      'citizenshipStatus',
    ],
    []
  );

  const sortBy = useMemo<SortBy<WorkerEmploymentSortBy>>(
    () => `createdAt,${SortByOperator.DESC}`,
    []
  );

  const fetchData = useCallback(() => {
    let active = true;

    (async () => {
      setLoading(true);
      try {
        const { workerEmployments, meta } = await WorkerEmploymentApi.get(
          session,
          {
            ...rowsState,
            attributes,
            filters,
            sortBy,
          }
        );

        if (!active) return;

        setRows(workerEmployments);
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

  const constantOperators = getGridSingleSelectOperators().filter(
    (operator) => operator.value === SingleSelectOperator.IS
  );

  const dateOperators = getGridDateOperators().filter((operator) =>
    Object.values<string>(DateOperator).includes(operator.value)
  );

  const citizenshipStatusOptions = useMemo(
    () =>
      CITIZENSHIP_STATUS_OPTIONS.map((citizenshipStatus) => ({
        ...citizenshipStatus,
        value: citizenshipStatus.id,
        label: t(citizenshipStatus.label),
      })),
    [t]
  );

  const yesNoOptions = useMemo(
    () =>
      BOOLEAN_OPTIONS.map((option) => ({
        value: option.id,
        label: t(option.label),
      })),
    [t]
  );

  const hireStatusOptions = useMemo(
    () =>
      HIRE_STATUS_OPTIONS.map((option) => ({
        value: option.id,
        label: t(option.label),
      })),
    [t]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'company',
        headerName: t('dataGrid.header.company.name'),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterable: false,
        disableColumnMenu: true,
        valueGetter: ({ row }) => row.company.name,
      },
      {
        field: 'workerUser.userContext.user:fullName',
        headerName: t(
          'dataGrid.header.workerUser.userContext.user.firstName;workerUser.userContext.user.lastName'
        ),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterOperators: operators,
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
        valueGetter: ({ row }) => row.workerUser.userContext.user.email,
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
            <Typography ml={2}>{row.hiringCountry.name}</Typography>
          </Box>
        ),
      },
      {
        field: 'citizenshipStatus',
        headerName: t('dataGrid.header.citizenshipStatus'),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterOperators: constantOperators,
        valueOptions: citizenshipStatusOptions,
        type: 'singleSelect',
        disableColumnMenu: true,
        valueFormatter: ({ value }) => t(`citizenship-status:${value}`),
      },
      {
        field: 'isPermitRequired',
        headerName: t('dataGrid.header.isPermitRequired'),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterOperators: constantOperators,
        valueOptions: yesNoOptions,
        type: 'singleSelect',
        disableColumnMenu: true,
        valueFormatter: ({ value }) =>
          t(
            value
              ? BOOLEAN_YES_LABEL
              : Object.is(value, null)
              ? '-'
              : BOOLEAN_NO_LABEL
          ),
      },
      {
        field: 'startDate',
        headerName: t('dataGrid.header.startDate'),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterOperators: dateOperators,
        disableColumnMenu: true,
        valueFormatter: ({ value }) =>
          format(new Date(value as string), DEFAULT_DATE_FORMAT),
      },
      {
        field: 'status',
        headerName: t('dataGrid.header.status'),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterOperators: constantOperators,
        valueOptions: hireStatusOptions,
        type: 'singleSelect',
        disableColumnMenu: true,
        valueFormatter: ({ value }) => t(`hire-status:${value}`),
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
                onClick={onHandleClick(employmentId)}
                data-testid="staffAuditClientHires-clientRow-itemOptions"
              >
                <KeyboardArrowDown
                  fontSize="small"
                  fill="black"
                  data-testid="staffClientHires-arrowDown"
                />
              </Box>
              <AnchorMenu
                open={!!anchorEl && idElement === employmentId}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
              >
                <MenuItem
                  key="viewProfile"
                  data-testid="staffClientHires-viewProfile"
                  onClick={() => {
                    window.open(
                      renderString(
                        STAFF_AUDIT_CLIENT_HIRES_DETAIL.path,
                        { employmentId },
                        '_blank'
                      )
                    );
                  }}
                >
                  <Typography>{t('viewProfile.title')}</Typography>
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
      anchorEl,
      idElement,
      constantOperators,
      citizenshipStatusOptions,
      yesNoOptions,
      hireStatusOptions,
      dateOperators,
    ]
  );

  const onHandleExportCSV = useCallback(async () => {
    try {
      if (rowCount) {
        await DataGridExportApi.exportDataGrid<
          DataGridExportContext,
          keyof WorkerEmployment,
          WorkerEmploymentFilter,
          WorkerEmploymentSortBy
        >(session, DataGridExportContext.STAFF_AUDIT_CLIENT_HIRES, {
          attributes,
          filters,
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
        onClose={() => setToast({ message: '' })}
        dataTestId="staffClientHires-toastClientHires"
      >
        {toast.message}
      </Toast>
      <DataGrid<FilterType>
        rows={rows}
        columns={columns}
        loading={loading}
        rowCount={rowCount}
        filters={filters}
        dataTestId="staffClientHires-dataGrid"
        components={{
          NoRowsOverlay: () => (
            <NoRowsOverlay
              icon="PersonPin"
              title={t('dataGrid.noRowsOverlay.title')}
              description={t('dataGrid.noRowsOverlay.description')}
              dataTestId="no-rows-overlay-client-hires"
            />
          ),
        }}
        filterMode="server"
        setFilters={setFilters}
        useSearchFilter
        searchFilterColumnField="company:name"
        searchFilterOperatorValue={StringOperator.CONTAINS}
        searchFilterPlaceholder={t('dataGrid.searchPlaceholder')}
        menuItems={[
          <MenuItem
            key="addNewHire"
            onClick={() => setShowAddNewHire(true)}
            data-testid="staffClientHires-addNewHire-button"
          >
            <PersonAdd fontSize="small" color="primary" />
            <Typography marginLeft="0.5rem">{t('addNewHire.title')}</Typography>
          </MenuItem>,
          <MenuItem
            key="exportData"
            onClick={onHandleExportCSV}
            data-testid="staffClientHires-exportData-button"
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
      {showAddNewHire && (
        <AddNewHire
          t={t}
          session={session}
          setToast={setToast}
          setShowAddNewHire={setShowAddNewHire}
          onClose={() => setShowAddNewHire(false)}
          onSuccess={fetchData}
        />
      )}
    </AppLayout>
  );
};

export default StaffAuditClientHires;

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'common',
      'hire-type',
      'hire-status',
      'staff-audit-client-hires',
      'citizenship-status',
      'data-grid-export',
    ])),
  },
});
