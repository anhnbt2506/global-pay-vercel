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
  UserSession,
} from '@ayp/typings/commons';
import {
  Company,
  CompanyCategory,
  CompanyFilter,
  CompanySortBy,
  DataGridExportContext,
} from '@ayp/typings/entities';
import { CountryOption } from '@ayp/typings/ui';
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
  getGridSingleSelectOperators,
  getGridStringOperators,
  GridColDef,
} from '@mui/x-data-grid';
import { format } from 'date-fns';
import { Form, Formik } from 'formik';
import { GetServerSideProps } from 'next';
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
import {
  CreateCompanyAccountFormValues,
  initialValues,
  validationSchema,
} from '@components/commons/create-company-account-form/config';
import CreateCompanyAccountForm from '@components/commons/create-company-account-form/create-company-account-form';
import {
  ButtonSubmit,
  CountryFlag,
  DataGrid,
  NoRowsOverlay,
  Toast,
} from '@components/ui';
import { AnchorMenu } from '@components/ui/anchor-menu';
import {
  COMPANY_CATEGORY_LABEL_PREFIX,
  COMPANY_CATEGORY_OPTIONS,
  COMPANY_STATUS_LABEL_PREFIX,
  COMPANY_STATUS_OPTIONS,
  DEFAULT_DATE_FORMAT,
  DEFAULT_PAGE_SIZE,
  ENTITY_LINK_STATUS_LABEL_PREFIX,
  ENTITY_LINK_STATUS_OPTIONS,
} from '@configs/constants';
import { RedirectionError } from '@configs/errors';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { STAFF_AUDIT_CLIENT_LIST_DETAIL } from '@configs/routes';
import {
  CompanyApi,
  CountryApi,
  DataGridExportApi,
} from '@services/apis/people';

interface StaffAuditClientListProps {
  countries: CountryOption[];
}

const AddNewClient: FC<{
  t: TFunction;
  session: UserSession;
  onClose: VoidFunction;
  onSuccess: VoidFunction;
  setToast: Dispatch<SetStateAction<Toast>>;
  setShowAddNewClient: Dispatch<SetStateAction<boolean>>;
  countries: CountryOption[];
}> = ({
  t,
  onClose,
  onSuccess,
  session,
  setToast,
  setShowAddNewClient,
  countries,
}) => {
  const onSubmit = async (values: CreateCompanyAccountFormValues) => {
    const {
      firstName,
      lastName,
      companyName,
      jobTitle,
      country,
      email,
      password,
      interest,
      category,
      industry,
    } = values;

    try {
      /* istanbul ignore next */
      //Scenario never exists
      const countryCode = country?.code ?? null;
      /* istanbul ignore next */
      //Scenario never exists
      const categoryValue = category ?? CompanyCategory.DIRECT;

      const industryId = industry ?? null;

      await CompanyApi.post(session, {
        firstName,
        lastName,
        name: companyName,
        countryCode,
        email,
        password,
        interest,
        jobTitle,
        category: categoryValue,
        industryId,
      });

      setToast({
        severity: 'success',
        message: t('addNewClient.clientCreated'),
      });
      onSuccess();
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
    } finally {
      setShowAddNewClient(false);
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
          data-testid="staffAuditClientList-selectionModal-title"
        >
          {t('addNewClient.title')}
        </Typography>
        <Typography variant="subtitle1" align="center">
          {` ${t('addNewClient.description')}`}
        </Typography>
      </Box>
      <DialogContent
        sx={{
          paddingBottom: '2rem',
        }}
      >
        <Formik
          onSubmit={onSubmit}
          initialValues={Object.assign({}, initialValues, {
            hasCategoryField: true,
            hasIndustryField: true,
          })}
          validationSchema={validationSchema}
        >
          <Form
            style={{
              gap: '1rem',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
            noValidate
          >
            <CreateCompanyAccountForm countries={countries} t={t} />
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
                data-testid="staffAuditClientList-addNewClient-cancelButton"
              >
                {t('common:cancel')}
              </Button>
              <ButtonSubmit
                variant="contained"
                sx={{
                  paddingX: '3rem',
                }}
                data-testid="staffAuditClientList-addNewClient-submitButton"
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

type FilterType = Filter<CompanyFilter>[];

const StaffAuditClientList: NextPage<StaffAuditClientListProps> = ({
  isDesktop,
  session,
  countries,
}) => {
  const { t } = useTranslation('staff-audit-client-list');
  const [anchorEl, setAnchorEl] = useState<Nullable<Element>>(null);
  const [showAddNewClient, setShowAddNewClient] = useState(false);
  const [toast, setToast] = useState<Toast>({});

  const [idElement, setIdElement] = useState<Nullable<string>>(null);
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState<number>(0);
  const [rows, setRows] = useState<Company[]>([]);
  const [filters, setFilters] = useState<FilterType>([]);

  const [rowsState, setRowsState] = useState<RowsState>({
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const attributes = useMemo<Attribute<keyof Company>[]>(
    () => [
      'id',
      'industryId',
      'name',
      'category',
      'industry:industryId,name',
      'companyId',
      'registeredById',
      'registeredBy.user:cognitoId,id,firstName,lastName,email',
      'currency',
      'entityLinkStatus',
      'status',
      'addressId',
      'address:id,countryCode',
      'address.country:id,code,name',
      'createdAt',
    ],
    []
  );

  const sortBy = useMemo<SortBy<CompanySortBy>>(
    () => `createdAt,${SortByOperator.DESC}`,
    []
  );

  const fetchData = useCallback(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const { companies, meta } = await CompanyApi.list(session, {
          ...rowsState,
          attributes,
          filters,
          sortBy,
        });

        /* istanbul ignore if */
        //this case is  unnecessary to test
        if (!active) return;

        setRows(companies);
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

  const companyStatusOptions = useMemo(
    () =>
      COMPANY_STATUS_OPTIONS.map((companyStatus) => ({
        ...companyStatus,
        value: companyStatus.id,
        label: t(companyStatus.label),
      })),
    [t]
  );

  const companyCategoryOptions = useMemo(
    () =>
      COMPANY_CATEGORY_OPTIONS.map((companyCategory) => ({
        ...companyCategory,
        value: companyCategory.id,
        label: t(companyCategory.label),
      })),
    [t]
  );

  const entityLinkStatusOptions = useMemo(
    () =>
      ENTITY_LINK_STATUS_OPTIONS.map((entityLinkStatus) => ({
        ...entityLinkStatus,
        value: entityLinkStatus.id,
        label: t(entityLinkStatus.label),
      })),
    [t]
  );

  const operators = getGridStringOperators().filter(
    (operator) => operator.value === StringOperator.CONTAINS
  );

  const constantOperators = getGridSingleSelectOperators().filter(
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
        field: 'name',
        headerName: t('dataGrid.header.name'),
        flex: 1,
        sortable: false,
        minWidth: 250,
        filterable: false,
        valueGetter: ({ row }) => `${row.name ?? '-'}`,
        disableColumnMenu: true,
      },
      {
        field: 'category',
        headerName: t('dataGrid.header.category'),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterOperators: constantOperators,
        valueOptions: companyCategoryOptions,
        type: 'singleSelect',
        valueFormatter: ({ value }) => {
          return t(`${COMPANY_CATEGORY_LABEL_PREFIX}${value}`);
        },
        disableColumnMenu: true,
      },
      {
        field: 'industry:name',
        headerName: t('dataGrid.header.industry.name'),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterOperators: operators,
        valueGetter: ({ row }) => `${row.industry?.name ?? '-'}`,
        disableColumnMenu: true,
      },
      {
        field: 'address.country:name',
        headerName: t('dataGrid.header.address.country.name'),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterOperators: operators,
        renderCell: ({ row }) =>
          row.address?.country ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <CountryFlag code={row.address?.country.code} />
              <Typography ml={2}>{row.address?.country.name}</Typography>
            </Box>
          ) : (
            '-'
          ),
        disableColumnMenu: true,
      },
      {
        field: 'registeredBy.user:fullName',
        headerName: t(
          'dataGrid.header.registeredBy.user.firstName;registeredBy.user.lastName'
        ),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterOperators: operators,
        valueGetter: ({ row }) =>
          `${row.registeredBy.user.firstName} ${row.registeredBy.user.lastName}`,
        disableColumnMenu: true,
      },
      {
        field: 'registeredBy.user:email',
        headerName: t('dataGrid.header.registeredBy.user.email'),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterOperators: operators,
        valueGetter: ({ row }) => `${row.registeredBy.user.email}`,
        disableColumnMenu: true,
      },
      {
        field: 'currency',
        headerName: t('dataGrid.header.currency'),
        flex: 1,
        sortable: false,
        minWidth: 150,
        filterOperators: operators,
        align: 'center',
        valueGetter: ({ row }) => `${row.currency ?? '-'}`,
        disableColumnMenu: true,
      },
      {
        field: 'entityLinkStatus',
        headerName: t('dataGrid.header.entityLinkStatus'),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterOperators: constantOperators,
        type: 'singleSelect',
        valueOptions: entityLinkStatusOptions,
        valueFormatter: ({ value }) =>
          t(`${ENTITY_LINK_STATUS_LABEL_PREFIX}${value}`),
        disableColumnMenu: true,
      },
      {
        field: 'createdAt',
        headerName: t('dataGrid.header.createdAt'),
        flex: 1,
        sortable: false,
        minWidth: 150,
        filterable: false,
        valueFormatter: ({ value }) =>
          format(new Date(value as string), DEFAULT_DATE_FORMAT),
        disableColumnMenu: true,
      },
      {
        field: 'status',
        headerName: t('dataGrid.header.status'),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterOperators: constantOperators,
        valueOptions: companyStatusOptions,
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
            key={row.companyId}
          >
            <Typography>
              {t(`${COMPANY_STATUS_LABEL_PREFIX}${row.status}`)}
            </Typography>
            <Box
              sx={{
                display: 'flex',
              }}
              onClick={onHandleClick(row.companyId)}
              data-testid="staffAuditClientList-clientRow-itemOptions"
            >
              <KeyboardArrowDown fontSize="small" fill="black" />
            </Box>
            <AnchorMenu
              open={!!anchorEl && idElement === row.companyId}
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
            >
              <MenuItem
                key="viewProfile"
                onClick={() => {
                  window.open(
                    renderString(
                      STAFF_AUDIT_CLIENT_LIST_DETAIL.path,
                      { companyId: row.companyId },
                      '_blank'
                    )
                  );
                }}
                data-testid="staffAuditClientList-clientRow-viewProfile"
              >
                <Typography>{t('viewProfile.title')}</Typography>
              </MenuItem>
            </AnchorMenu>
          </Box>
        ),
      },
    ],
    [
      t,
      operators,
      constantOperators,
      anchorEl,
      companyCategoryOptions,
      companyStatusOptions,
      entityLinkStatusOptions,
      idElement,
    ]
  );

  const onHandleExportCSV = useCallback(async () => {
    try {
      if (rowCount) {
        await DataGridExportApi.exportDataGrid<
          DataGridExportContext,
          keyof Company,
          CompanyFilter,
          CompanySortBy
        >(session, DataGridExportContext.STAFF_AUDIT_CLIENT_LIST, {
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
      // this case doesn't necessary to test
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
        dataTestId="staffAuditClientList-toast"
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
        dataTestId="staffAuditClientList-dataGrid"
        components={{
          NoRowsOverlay: () => (
            <NoRowsOverlay
              icon="PersonPin"
              title={t('dataGrid.noRowsOverlay.title')}
              description={t('dataGrid.noRowsOverlay.description')}
              dataTestId="no-rows-overlay-clientList"
            />
          ),
        }}
        menuItems={[
          <MenuItem
            key="addNewClient"
            onClick={() => setShowAddNewClient(true)}
            data-testid="staffAuditClientList-addNewClient-button"
          >
            <PersonAdd fontSize="small" color="primary" />
            <Typography marginLeft="0.5rem">
              {t('addNewClient.title')}
            </Typography>
          </MenuItem>,
          <MenuItem
            key="exportData"
            onClick={onHandleExportCSV}
            data-testid="staffAuditClientList-exportData-button"
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
      {showAddNewClient && (
        <AddNewClient
          t={t}
          session={session}
          setToast={setToast}
          setShowAddNewClient={setShowAddNewClient}
          onClose={() => setShowAddNewClient(false)}
          onSuccess={fetchData}
          countries={countries}
        />
      )}
    </AppLayout>
  );
};

export default StaffAuditClientList;

export const getServerSideProps: GetServerSideProps<
  StaffAuditClientListProps
> = async (context) => {
  try {
    const { countries } = await CountryApi.getCountries();
    return {
      props: {
        countries: countries.map((country) => ({
          id: country.id,
          label: country.name,
          code: country.code,
        })),
        ...(await serverSideTranslations(context.locale ?? 'en', [
          'common',
          'company-status',
          'entity-link-status',
          'staff-audit-client-list',
          'create-company-account-form',
          'company-category',
          'company-industry',
          'company-interest',
          'password-criteria',
          'data-grid-export',
        ])),
      },
    };
  } catch (e) {
    if (e instanceof RedirectionError) {
      return e.redirect();
    }

    return {
      props: {} as StaffAuditClientListProps,
    };
  }
};
