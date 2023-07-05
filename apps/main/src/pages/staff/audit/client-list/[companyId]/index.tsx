import { NextPage, UserSession } from '@ayp/typings/commons';
import { Company, CompanyStatus } from '@ayp/typings/entities';
import { CountryOption, CurrencyOption } from '@ayp/typings/ui';
import { isErrorResponse } from '@ayp/utils';
import { MoreVert, PersonAdd } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  MenuItem,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { GetServerSideProps } from 'next';
import { TFunction, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react';

import { AppLayout } from '@components/commons';
import {
  COMPANY_DETAIL_TAB_OPTIONS,
  CompanyDetailOptionsTabs,
} from '@components/pages/staff/audit/clients-list/[companyId]/config';
import DepartmentTab from '@components/pages/staff/audit/clients-list/[companyId]/department';
import Documents from '@components/pages/staff/audit/clients-list/[companyId]/documents';
import EntityManagement from '@components/pages/staff/audit/clients-list/[companyId]/entity-management';
import Information from '@components/pages/staff/audit/clients-list/[companyId]/information';
import ServiceDetails from '@components/pages/staff/audit/clients-list/[companyId]/service-details';
import { AnchorMenu, ButtonSubmit, Select, Tabs, Toast } from '@components/ui';
import {
  COMPANY_STATUS_LABEL_PREFIX,
  COMPANY_STATUS_OPTIONS,
  DEFAULT_TIMEOUT,
} from '@configs/constants';
import { RedirectionError } from '@configs/errors';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { STAFF_HOME } from '@configs/routes';
import { CompanyApi, CountryApi, CurrencyApi } from '@services/apis/people';
import { getServerSideSession } from '@utils';

interface StaffAuditClientListCompanyIdProps {
  company: Company;
  countries: CountryOption[];
  currencies: CurrencyOption[];
}

const UpdateStatus: FC<{
  t: TFunction;
  session: UserSession;
  status: CompanyStatus;
  setStatus: Dispatch<SetStateAction<CompanyStatus>>;
  setShowUpdateStatus: Dispatch<SetStateAction<boolean>>;
  setToast: Dispatch<SetStateAction<Toast>>;
  companyId: string;
}> = ({ t, status, session, setShowUpdateStatus, setToast, companyId }) => {
  const companyStatusOptions = useMemo(
    () =>
      COMPANY_STATUS_OPTIONS.map((companyStatus) => ({
        ...companyStatus,
        value: t(`${COMPANY_STATUS_LABEL_PREFIX}${companyStatus.id}`),
        label: t(companyStatus.label),
      })),
    [t]
  );

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
        <Typography variant="h6" align="center">
          {t('selectStatus.title')}
        </Typography>
        <Typography variant="subtitle1">
          {t('selectStatus.description')}
        </Typography>
      </Box>
      <DialogContent
        sx={{
          paddingBottom: '2rem',
        }}
      >
        <Formik
          initialValues={{
            status,
          }}
          onSubmit={async (values: { status: CompanyStatus }) => {
            try {
              const { status } = values;

              await CompanyApi.updateByCompanyId(session, companyId, {
                status: status,
              });

              setToast({
                severity: 'success',
                message: t('selectStatus.toast.statusUpdated'),
              });
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
              setShowUpdateStatus(false);
              /* istanbul ignore next */
              // this case doesn't necessary to test
              setTimeout(() => {
                window.location.reload();
              }, DEFAULT_TIMEOUT);
            }
          }}
        >
          <Form>
            <Select
              required
              name="status"
              options={companyStatusOptions}
              label={t('selectStatus.form.status.label')}
              helperText={t('selectStatus.form.status.helperText')}
              dataTestId="staffAuditClientList-companyId-updateStatus-field-status"
            />
            <Box
              sx={{
                gap: '2rem',
                display: 'flex',
                marginTop: '2rem',
                justifyContent: 'space-around',
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setShowUpdateStatus(false)}
                sx={{
                  paddingX: '3rem',
                }}
                data-testid="staffAuditClientList-companyId-updateStatus-cancelButton"
              >
                {t('common:cancel')}
              </Button>
              <ButtonSubmit
                variant="contained"
                sx={{
                  paddingX: '3rem',
                }}
                data-testid="staffAuditClientList-companyId-updateStatus-submitButton"
              >
                {t('common:update')}
              </ButtonSubmit>
            </Box>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

const StaffAuditClientListCompanyId: NextPage<
  StaffAuditClientListCompanyIdProps
> = ({ isDesktop, session, company, countries, currencies }) => {
  const { status: companyStatus } = company;
  const { t } = useTranslation('staff-audit-client-list-company-id');
  const [anchorEl, setAnchorEl] = useState<Nullable<Element>>(null);
  const [status, setStatus] = useState<CompanyStatus>(companyStatus);
  const [toast, setToast] = useState<Toast>({});
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);

  const companyStatusOptions = useMemo(
    () =>
      COMPANY_DETAIL_TAB_OPTIONS.map((companyTabs) => ({
        ...companyTabs,
        value: companyTabs.id,
        label: t(companyTabs.label),
      })),
    [t]
  );

  const [tab, setTab] = useState(companyStatusOptions[0].value);

  const contentComponent = useMemo(() => {
    switch (tab) {
      case CompanyDetailOptionsTabs.INFORMATION:
        return (
          <Information
            t={t}
            company={company}
            countries={countries}
            currencies={currencies}
          />
        );
      case CompanyDetailOptionsTabs.SERVICE_DETAILS:
        return (
          <ServiceDetails
            t={t}
            setToast={setToast}
            companyId={company.companyId}
          />
        );
      case CompanyDetailOptionsTabs.DOCUMENTS:
        return <Documents companyId={company.companyId} />;
      case CompanyDetailOptionsTabs.ENTITY_MANAGEMENT:
        return (
          <EntityManagement t={t} company={company} countries={countries} />
        );
      case CompanyDetailOptionsTabs.DEPARTMENT:
        return (
          <DepartmentTab
            t={t}
            company={company}
            session={session}
            showDepartmentModal={showDepartmentModal}
            setShowDepartmentModal={setShowDepartmentModal}
            setToast={setToast}
          />
        );
      /* istanbul ignore next */
      // this case doesn't necessary to test
      default:
        return <></>;
    }
  }, [
    tab,
    t,
    company,
    countries,
    currencies,
    session,
    showDepartmentModal,
    setShowDepartmentModal,
    setToast,
  ]);

  const updateStatus = useMemo(
    () =>
      showStatusModal && (
        <UpdateStatus
          t={t}
          session={session}
          status={status}
          setStatus={setStatus}
          setShowUpdateStatus={setShowStatusModal}
          setToast={setToast}
          companyId={company.companyId}
        />
      ),
    [t, session, status, showStatusModal, company]
  );

  return (
    <AppLayout isDesktop={isDesktop} pageName={company.name ?? '-'}>
      {updateStatus}
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId="staffAuditClientList-companyId-toast"
      >
        {toast.message}
      </Toast>
      <Box
        sx={{
          width: '100%',
          overflowY: 'scroll',
          overflowX: 'hidden',
          scrollbarWidth: 'thin',
          height: '85vh',
          paddingBottom: '2rem',
          '&::-webkit-scrollbar': {
            width: '0.25rem',
          },
          '&::-webkit-scrollbar-track': {
            borderRadius: '0.5rem',
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: '0.5rem',
            backgroundColor: 'gray',
            borderTop: '0.25rem transparent solid',
            borderBottom: '0.25rem transparent solid',
            backgroundClip: 'content-box',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Tabs
            tabs={companyStatusOptions}
            value={tab}
            setTab={setTab}
            fallback={CompanyDetailOptionsTabs.INFORMATION}
            variant="scrollable"
          />
          <IconButton
            edge="end"
            onClick={(event) => setAnchorEl(event.currentTarget)}
            sx={{
              marginRight: '0.1rem',
              width: '3rem',
              height: '3rem',
            }}
          >
            <MoreVert
              color="primary"
              data-testid="staffAuditClientList-companyId-optionsButton"
            />
          </IconButton>
          <AnchorMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl}>
            {tab !== CompanyDetailOptionsTabs.DEPARTMENT && (
              <MenuItem
                key="updateClientStatus"
                onClick={() => setShowStatusModal(true)}
                data-testid="staffAuditClientList-companyId-updateClientStatus"
              >
                <PersonAdd fontSize="small" color="primary" />
                <Typography marginLeft="0.5rem">
                  {t('updateClientStatus.title')}
                </Typography>
              </MenuItem>
            )}
            {tab === CompanyDetailOptionsTabs.DEPARTMENT && (
              <MenuItem
                key="newDepartment"
                onClick={() => setShowDepartmentModal(true)}
                data-testid="staffAuditClientList-companyId-newDepartment"
              >
                <PersonAdd fontSize="small" color="primary" />
                <Typography marginLeft="0.5rem">
                  {t('newDepartment.title')}
                </Typography>
              </MenuItem>
            )}
          </AnchorMenu>
        </Box>
        {contentComponent}
      </Box>
    </AppLayout>
  );
};

export default StaffAuditClientListCompanyId;

export const getServerSideProps: GetServerSideProps<
  StaffAuditClientListCompanyIdProps
> = async (context) => {
  try {
    const { companyId } = context.query;
    const session = await getServerSideSession(context);
    const { countries } = await CountryApi.getCountries();
    const { currencies } = await CurrencyApi.getCurrencies(session);

    if (typeof companyId !== 'string')
      return {
        redirect: {
          permanent: false,
          destination: STAFF_HOME.path,
        },
      };
    const { company } = await CompanyApi.getByCompanyId(
      session,
      {
        attributes: [
          'companyId',
          'registeredById',
          'registeredBy.user:cognitoId,id,firstName,lastName,email',
          'registeredBy.info:id,jobTitle',
          'currency',
          'status',
          'taxId',
          'registrationId',
          'taxId',
          'name',
          'category',
          'industryId',
          'industry:industryId,name',
          'addressId',
          'address:id,addressLine,city,state,postalCode,countryCode',
          'address.country:id,code,name',
          'hasSgEntity',
          'sgEntityUen',
          'sgEntityName',
          'parentId',
          'billingAddressType',
          'billingAddressId',
          'billingAddress:id,addressLine,city,state,postalCode,countryCode',
          'billingAddress.country:id,code,name',
        ],
      },
      companyId
    );

    return {
      props: {
        countries: countries.map((country) => ({
          id: country.id,
          code: country.code,
          label: country.name,
        })),
        currencies: currencies.map((currency) => ({
          id: currency.id,
          code: currency.code,
          label: currency.name,
        })),
        company: company,
        ...(await serverSideTranslations(context.locale ?? 'en', [
          'common',
          'company-status',
          'company-pom-ph-statutory-deductions',
          'company-pom-sg-cpf-payment-mode',
          'company-pom-sg-cpf-submission-platform',
          'company-pom-sg-e-submission-service',
          'create-company-account-form',
          'file-management',
          'hire-type',
          'payroll-cycle',
          'prorate-salary-formula',
          'staff-audit-client-list-company-id',
          'staff-audit-client-list-company-id-file-management',
          'payroll-cycle',
          'prorate-salary-formula',
          'company-category',
          'company-department',
          'company-interest',
          'company-industry',
          'company-pom-hk-mpf-provider',
          'company-pom',
          'company-pom-hk-form',
          'company-pom-my-form',
          'company-pom-sg-form',
          'company-pom-id-form',
          'company-pom-id-contribution-for-bpjs-on-salary',
          'company-pom-sg-form',
          'company-pom-th-form',
          'company-pom-vn-form',
          'company-onboarding',
          'company-people-onboarding-create',
          'company-people-onboarding-create-bulk-upload-mode',
          'company-pom-vn-shui-provider',
          'company-pom-ph-form',
          'company-pom-ph-statutory-deductions',
          'password-criteria',
          'payroll-cycle',
          'prorate-salary-formula',
          'workplace-address-type',
          'entity-link-options',
          'entity-link-status',
          'company-billing-information',
        ])),
      },
    };
  } catch (e) {
    if (e instanceof RedirectionError) {
      return e.redirect();
    }

    return {
      props: {} as StaffAuditClientListCompanyIdProps,
    };
  }
};
