import { NextPage, UserSession } from '@ayp/typings/commons';
import { HireStatus, WorkerEmployment } from '@ayp/typings/entities';
import { CountryOption } from '@ayp/typings/ui';
import {
  getWorkerCountryCode,
  isErrorResponse,
  renderString,
} from '@ayp/utils';
import {
  Add,
  FileDownloadOutlined,
  MoreVert,
  PublishedWithChanges,
} from '@mui/icons-material';
import { Box, IconButton, MenuItem, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCallback, useMemo, useState } from 'react';

import { AppLayout } from '@components/commons';
import { Information } from '@components/commons/employment-detail/information';
import { ADDENDUM_FOLDER } from '@components/commons/file-management/configs';
import {
  EMPLOYMENT_DETAIL_TAB_OPTIONS,
  EmploymentDetailTabs,
} from '@components/pages/staff/audit/client-hires/[employmentId]/config';
import Documents from '@components/pages/staff/audit/client-hires/[employmentId]/documents';
import UpdateHireStatusModal from '@components/pages/staff/audit/client-hires/update-hire-status-modal';
import { AnchorMenu, Tabs, Toast } from '@components/ui';
import { DOCUMENTS_FOLDER_DEFAULT } from '@configs/constants';
import { RedirectionError } from '@configs/errors';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import {
  STAFF_AUDIT_CLIENT_HIRES_DOWNLOAD_CONTRACT,
  STAFF_HOME,
} from '@configs/routes';
import { CountryApi, WorkerEmploymentApi } from '@services/apis/people';
import { getServerSideSession } from '@utils';
import { AddAddendumFileModal } from '@components/pages/staff/audit/client-hires/[employmentId]/documents/add-addendum-file-modal';

const getWorkerEmploymentById = async (
  session: UserSession,
  employmentId: string
): Promise<WorkerEmployment> => {
  const { workerEmployment } = await WorkerEmploymentApi.getByEmploymentId(
    session,
    {
      attributes: [
        'id',
        'employmentId',
        'hireType',
        'title',
        'titleAlternate',
        'startDate',
        'endDate',
        'probationPeriod',
        'probationStartDate',
        'probationEndDate',
        'employmentType',
        'workingHoursPerWeek',
        'startAt',
        'endAt',
        'managerName',
        'managerTitle',
        'workerTypeId',
        'companyId',
        'workerUserId',
        'workerType',
        'status',
        'currency',
        'nationalityCode',
        'contractType',
        'company:companyId,name',
        'workerUser.userContext.user:id,cognitoId,firstName,lastName,email,firstNameAlternate,lastNameAlternate',
        'workerUser.address:id,addressLine,city,state,postalCode,addressLineAlternate,cityAlternate,stateAlternate,postalCodeAlternate',
        'workerUser.bankAccount:id,bankId,beneficiaryName,accountNumber,branchCode',
        'workerAddendumFiles.fileManagement:id,filePath,createdAt,createdById;workerAddendumFiles.fileManagement.createdBy.user:cognitoId,email,firstName,lastName',
        'workerUser.bankAccount.bank:bankId,bankName,bankCode,swiftCode',
        'citizenshipStatus',
        'workerIdentity:workerEmploymentId,permitId,permitIssuedDate,permitIssuedPlace,passportNumber,nationalId,nationalIdIssuedDate,permitType,nationalIdIssuedPlace,nationalIdIssuedPlaceAlternate,passportIssuedDate,passportIssuedPlace,passportIssuedPlaceAlternate,permitIssuedPlaceAlternate,taxId,oldPermitId',
        'workerRemuneration:workerEmploymentId,salaryPerMonth,monthlyAllowance,isEligibleForInsurance,isEligibleForAdditionalIncome,isEligibleForPaidExpenses,isEntitledToOvertime,isEligibleForVariablePay,isEligibleForAnnualBonus,isEligibleForCommission,overtimeDescription,paidExpensesDescription,additionalIncomeDescription,,annualBonusDescription,isEligibleForCommission,commissionDescription,variablePayDescription',
        'additionalInfo',
        'workerContact:workerEmploymentId,contactNumber,contactNumberCountryCode,,emergencyContactName,emergencyContactRelationship,emergencyContactNumberCountryCode,emergencyContactNumber',
        'workerUser.bankAccount:id,bankId,beneficiaryName,accountNumber,branchCode',
        'workerUser.bankAccount.bank:bankId,bankName,bankCode,swiftCode',
      ],
    },
    employmentId
  );
  return workerEmployment;
};

interface StaffAuditClientHiresEmploymentIdProps {
  workerEmployment: WorkerEmployment;
  countries: CountryOption[];
  employmentId: string;
}

const StaffAuditClientHiresEmploymentId: NextPage<
  StaffAuditClientHiresEmploymentIdProps
> = ({
  isDesktop,
  session,
  workerEmployment: initialWorkerEmployment,
  countries,
  employmentId,
}) => {
  const { t } = useTranslation('staff-audit-client-hires-employment-id');
  const [tab, setTab] = useState(EmploymentDetailTabs.INFORMATION);
  const [anchorEl, setAnchorEl] = useState<Nullable<Element>>(null);
  const [showStatusModal, setShowModal] = useState(false);
  const [status, setStatus] = useState<HireStatus>(
    initialWorkerEmployment.status
  );
  const [isOpenAddendumFileModal, setIsOpenAddendumFileModal] = useState(false);
  const [workerEmployment, setWorkerEmployment] = useState<WorkerEmployment>(
    initialWorkerEmployment
  );
  const [toast, setToast] = useState<Toast>({});
  const employmentDetailTabOptions = useMemo(
    () =>
      EMPLOYMENT_DETAIL_TAB_OPTIONS.map((tab) => ({
        ...tab,
        value: tab.id,
        label: t(tab.label),
      })),
    [t]
  );
  const folder = new URLSearchParams(window.location.search).get('folder');

  const updateStatus = useMemo(
    () =>
      showStatusModal && (
        <UpdateHireStatusModal
          t={t}
          session={session}
          status={status}
          setStatus={setStatus}
          onClose={() => setShowModal(false)}
          setToast={setToast}
          employmentId={employmentId}
        />
      ),
    [showStatusModal, t, session, status, employmentId]
  );

  const handleDownloadContract = () => {
    if (status === HireStatus.ONBOARDED) {
      window.open(
        renderString(
          STAFF_AUDIT_CLIENT_HIRES_DOWNLOAD_CONTRACT.path,
          {
            employmentId,
          },
          '_blank'
        )
      );
    } else {
      setToast({
        severity: 'error',
        message: t('downloadContract.errorEmployeeNotOnboarded'),
      });
    }
  };

  const handleShowAddFileModal = useCallback(
    () =>
      folder?.endsWith(`/${ADDENDUM_FOLDER}`)
        ? setIsOpenAddendumFileModal(true)
        : setToast({
            severity: 'error',
            message: (
              <Trans
                i18nKey={`${t('addFile.toast.warningOutsideAddendumFolder')}`}
              />
            ),
          }),
    [folder, t]
  );

  const fetchWorkerEmployment = useCallback(async () => {
    try {
      const workerEmployment = await getWorkerEmploymentById(
        session,
        employmentId
      );
      setWorkerEmployment(workerEmployment);
    } catch (e) {
      /* istanbul ignore next */
      // this case doesn't necessary to test
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
  }, [session, employmentId, t]);

  const addAddendumFileModal = useMemo(
    () =>
      isOpenAddendumFileModal && (
        <AddAddendumFileModal
          onClose={() => setIsOpenAddendumFileModal(false)}
          setToast={setToast}
          onSuccess={fetchWorkerEmployment}
          workerEmploymentId={employmentId}
          dataTestId="staffAudit-clientHires-employmentId-addAddendumFileModal"
        />
      ),
    [employmentId, fetchWorkerEmployment, isOpenAddendumFileModal]
  );

  const contentComponent = useMemo(() => {
    switch (tab) {
      case EmploymentDetailTabs.INFORMATION:
        return (
          <Information
            workerEmployment={workerEmployment}
            fetchWorkerEmployment={fetchWorkerEmployment}
            countries={countries}
            isEditable={true}
            dataTestId="staffAudit-clientHires-employmentId"
          />
        );
      case EmploymentDetailTabs.DOCUMENTS:
        return (
          <Documents
            employmentId={employmentId}
            session={session}
            countryCode={getWorkerCountryCode(workerEmployment.workerType)}
          />
        );
      /* istanbul ignore next */
      // this case doesn't necessary to test
      default:
        return <></>;
    }
  }, [
    tab,
    workerEmployment,
    fetchWorkerEmployment,
    countries,
    employmentId,
    session,
  ]);

  return (
    <AppLayout isDesktop={isDesktop} pageName={t('pageName')}>
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
            tabs={employmentDetailTabOptions}
            value={tab}
            setTab={setTab}
            fallback={EmploymentDetailTabs.INFORMATION}
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
            data-testid="staffAudit-clientHires-employmentId-iconButton-options"
          >
            <MoreVert color="primary" />
          </IconButton>
          <AnchorMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl}>
            {!folder?.includes(`${DOCUMENTS_FOLDER_DEFAULT}`) ? (
              <>
                <MenuItem
                  key="updateClientStatus"
                  onClick={() => {
                    setShowModal(true);
                  }}
                  data-testid="staffAudit-clientHires-employmentId-updateClientStatus"
                >
                  <PublishedWithChanges fontSize="small" color="primary" />
                  <Typography marginLeft="0.5rem">
                    {t('updateClientStatus.title')}
                  </Typography>
                </MenuItem>
                <MenuItem
                  key="downloadContract"
                  onClick={handleDownloadContract}
                  data-testid="staffAudit-clientHires-employmentId-downloadContract"
                >
                  <FileDownloadOutlined fontSize="small" color="primary" />
                  <Typography marginLeft="0.5rem">
                    {t('downloadContract.title')}
                  </Typography>
                </MenuItem>
              </>
            ) : (
              <MenuItem
                key="addAddendumFile"
                onClick={handleShowAddFileModal}
                data-testid="staffAudit-clientHires-employmentId-addAddendumFile"
              >
                <Add fontSize="small" color="primary" />
                <Typography marginLeft="0.5rem">
                  {t('addFile.title')}
                </Typography>
              </MenuItem>
            )}
          </AnchorMenu>
        </Box>
        {contentComponent}
      </Box>
      {updateStatus}
      {addAddendumFileModal}
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId="staffAudit-clientHires-employmentId-toast"
      >
        {toast.message}
      </Toast>
    </AppLayout>
  );
};

export default StaffAuditClientHiresEmploymentId;

export const getServerSideProps: GetServerSideProps<
  StaffAuditClientHiresEmploymentIdProps
> = async (context) => {
  try {
    const { employmentId } = context.query;

    const session = await getServerSideSession(context);

    if (typeof employmentId !== 'string')
      return {
        redirect: {
          permanent: false,
          destination: STAFF_HOME.path,
        },
      };

    const { countries } = await CountryApi.getCountries();

    const workerEmployment = await getWorkerEmploymentById(
      session,
      employmentId
    );

    return {
      props: {
        countries: countries.map((country) => ({
          id: country.id,
          dialingCode: country.dialingCode,
          code: country.code,
          label: country.name,
        })),
        employmentId,
        workerEmployment,
        ...(await serverSideTranslations(context.locale ?? 'en', [
          'common',
          'citizenship-status',
          'country-constant',
          'contract-type',
          'emergency-contact-relationship',
          'employment-id-information',
          'employment-type',
          'file-management',
          'file-upload-status',
          'gender',
          'hire-status',
          'hire-type',
          'marital-status',
          'permit-type',
          'religion',
          'race',
          'staff-audit-client-hires-employment-id',
          'staff-audit-client-hires-employment-id-file-management',
        ])),
      },
    };
  } catch (e) {
    if (e instanceof RedirectionError) {
      return e.redirect();
    }

    return {
      props: {} as StaffAuditClientHiresEmploymentIdProps,
    };
  }
};
