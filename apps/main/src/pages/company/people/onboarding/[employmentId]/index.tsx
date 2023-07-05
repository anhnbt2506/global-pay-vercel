import { NextPage, UserSession } from '@ayp/typings/commons';
import { WorkerEmployment } from '@ayp/typings/entities';
import { CountryOption } from '@ayp/typings/ui';
import { isErrorResponse } from '@ayp/utils';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppLayout } from '@components/commons';
import { CompanyEmploymentDetails } from '@components/commons/employment-detail/company-employment-detail';
import { Toast } from '@components/ui';
import { RedirectionError } from '@configs/errors';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { COMPANY_DASHBOARD } from '@configs/routes';
import { CountryApi, WorkerEmploymentApi } from '@services/apis/people';
import { getServerSideSession } from '@utils';

interface CompanyPeopleOnboardingEmploymentIdProps {
  countries: CountryOption[];
  workerEmployment: WorkerEmployment;
  employmentId: string;
}

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

const CompanyPeopleOnboardingEmploymentId: NextPage<
  CompanyPeopleOnboardingEmploymentIdProps
> = ({
  isDesktop,
  session,
  countries,
  workerEmployment: initialWorkerEmployment,
  employmentId,
}) => {
  const { t } = useTranslation('company-people-onboarding-employment-id');
  const [workerEmployment, setWorkerEmployment] = useState<WorkerEmployment>(
    initialWorkerEmployment
  );
  const [toast, setToast] = useState<Toast>({});

  const fetchWorkerEmployment = useCallback(async () => {
    try {
      const workerEmployment = await getWorkerEmploymentById(
        session,
        employmentId
      );
      setWorkerEmployment(workerEmployment);
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
  }, [session, employmentId, t]);

  return (
    <AppLayout isDesktop={isDesktop} pageName={t('pageName')}>
      <CompanyEmploymentDetails
        countries={countries}
        workerEmployment={workerEmployment}
        fetchWorkerEmployment={fetchWorkerEmployment}
        setToast={setToast}
        dataTestId="companyPeopleOnboarding-employmentId"
      />
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId="companyPeopleOnboarding-employmentId-toast"
      >
        {toast.message}
      </Toast>
    </AppLayout>
  );
};

export default CompanyPeopleOnboardingEmploymentId;

export const getServerSideProps: GetServerSideProps<
  CompanyPeopleOnboardingEmploymentIdProps
> = async (context) => {
  try {
    const { employmentId } = context.query;

    const session = await getServerSideSession(context);

    if (typeof employmentId !== 'string')
      return {
        redirect: {
          permanent: false,
          destination: COMPANY_DASHBOARD.path,
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
        workerEmployment,
        employmentId,
        ...(await serverSideTranslations(context.locale ?? 'en', [
          'common',
          'citizenship-status',
          'contract-type',
          'company-people-employment-id',
          'company-people-onboarding-employment-id',
          'country-constant',
          'emergency-contact-relationship',
          'employment-id-information',
          'employment-type',
          'file-management',
          'gender',
          'hire-status',
          'hire-type',
          'marital-status',
          'permit-type',
          'religion',
          'race',
        ])),
      },
    };
  } catch (e) {
    if (e instanceof RedirectionError) {
      return e.redirect();
    }

    return {
      props: {} as CompanyPeopleOnboardingEmploymentIdProps,
    };
  }
};
