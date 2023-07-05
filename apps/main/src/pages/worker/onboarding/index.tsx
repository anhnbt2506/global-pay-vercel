import {
  CountryCode,
  NextPage,
  SortByOperator,
  StringOperator,
  UserSession,
} from '@ayp/typings/commons';
import { HireStatus, WorkerEmployment } from '@ayp/typings/entities';
import { CurrencyOption, Option } from '@ayp/typings/ui';
import { getWorkerCountryCode, isErrorResponse } from '@ayp/utils';
import { Button, Container, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Form, Formik, FormikHelpers } from 'formik';
import memoizee from 'memoizee';
import { GetServerSideProps } from 'next';
import { TFunction, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { SchemaOf } from 'yup';

import { SecondaryAppLayout, SecondarySidebar } from '@components/commons';
import {
  fireNextEventDependingOnStepWorkerPortal,
  firePreviousEventDependingOnStepWorkerPortal,
  getInitialValues,
  mapToRequestBody,
  validationSchema as defaultValidationSchema,
  WorkerOnboardingFormValues,
  WorkerOnboardingPage,
} from '@components/pages/worker/onboarding/config';
import { ButtonSubmit, Stepper, Toast } from '@components/ui';
import { RedirectionError } from '@configs/errors';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { WORKER_HOME } from '@configs/routes';
import { CountryApi, WorkerEmploymentApi } from '@services/apis/people';
import { BankApi } from '@services/apis/people/bank-api';
import { getServerSideSession } from '@utils';

const getBankOptionsMemo = memoizee(
  async (
    session: UserSession,
    countryCode: CountryCode
  ): Promise<Option<string>[]> => {
    try {
      const { banks } = await BankApi.getBanks(session, {
        attributes: ['bankId', 'bankName'],
        filters: [`countryCode,${StringOperator.EQUALS},${countryCode}`],
        sortBy: `bankName,${SortByOperator.ASC}`,
      });

      return banks.map(({ bankId, bankName }) => ({
        id: bankId,
        label: bankName,
        value: bankId,
      }));
    } catch (e) {
      return [];
    }
  },
  { promise: true }
);

const getSteps = (t: TFunction) => [
  {
    label: t('workerPersonalProfile.title'),
  },
  {
    label: t('identification.title'),
  },
  {
    label: t('emergencyContact.title'),
  },
  {
    label: t('bankDetails.title'),
  },
  {
    label: t('additionalInformation.title'),
  },
  {
    label: t('inReview.title'),
  },
];

const getContentTexts = (t: TFunction) => [
  {
    title: t('workerPersonalProfile.title'),
  },
  {
    title: t('identification.title'),
  },
  {
    title: t('emergencyContact.title'),
  },
  {
    title: t('bankDetails.title'),
  },
  {
    title: t('additionalInformation.title'),
  },
  {
    title: <></>,
  },
];

const firstStep = WorkerOnboardingPage.PERSONAL_PROFILE;
const lastStep = WorkerOnboardingPage.IN_REVIEW;

const isFirstStep = (activeStep: number) => activeStep === firstStep;
const isLastStep = (activeStep: number) => activeStep === lastStep;

const DynamicPersonalProfileForm = dynamic(
  () => import('@components/pages/worker/onboarding/personal-profile-form')
);
const DynamicIdentificationForm = dynamic(
  () => import('@components/pages/worker/onboarding/identification-form')
);
const DynamicEmergencyContactForm = dynamic(
  () => import('@components/pages/worker/onboarding/emergency-contact-form')
);
const DynamicBankDetailsForm = dynamic(
  () => import('@components/pages/worker/onboarding/bank-details-form')
);
const DynamicAdditionalInformationForm = dynamic(
  () =>
    import('@components/pages/worker/onboarding/additional-information-form')
);
const DynamicInReviewForm = dynamic(
  () => import('@components/pages/worker/onboarding/in-review-form')
);

interface WorkerOnboardingProps {
  worker: WorkerEmployment;
  currencies: CurrencyOption[];
  dialingCodes: Option[];
  workerEmployment: WorkerEmployment;
}
const WorkerOnboarding: NextPage<WorkerOnboardingProps> = ({
  session,
  isDesktop,
  dialingCodes,
  workerEmployment,
}) => {
  const { t } = useTranslation('worker-onboarding');

  const [activeStep, setActiveStep] = useState(
    workerEmployment.status === HireStatus.EMPLOYEE_REVIEW
      ? WorkerOnboardingPage.IN_REVIEW
      : firstStep
  );
  const [validationSchema, setValidationSchema] = useState<SchemaOf<unknown>>(
    defaultValidationSchema[WorkerOnboardingPage.PERSONAL_PROFILE]
  );
  const [workerCountryCode, setWorkerCountryCode] = useState('');
  const [toast, setToast] = useState<Toast>({});
  const [bankOptions, setBankOptions] = useState<Option<string>[]>([]);

  const contextEmploymentId =
    session?.user?.selectedUserContext.contextEmploymentId;

  useEffect(() => {
    if (activeStep === WorkerOnboardingPage.PERSONAL_PROFILE) {
      setValidationSchema(
        defaultValidationSchema[WorkerOnboardingPage.PERSONAL_PROFILE]
      );
    }
  }, [activeStep]);

  useEffect(() => {
    /* istanbul ignore next */
    // this case doesn't necessary to test
    if (!workerEmployment?.workerType) return;

    (async () => {
      const countryCode = getWorkerCountryCode(workerEmployment.workerType);

      const options = await getBankOptionsMemo(session, countryCode);
      setBankOptions(options);
    })();
  }, [session, workerEmployment.workerType]);

  const contentTexts = getContentTexts(t);

  const stepper = useMemo(
    () => (
      <Stepper
        steps={getSteps(t)}
        activeStep={activeStep}
        withoutLabel={!isDesktop}
        orientation={isDesktop ? 'vertical' : 'horizontal'}
        sx={{
          marginY: '1rem',
        }}
      />
    ),
    [t, activeStep, isDesktop]
  );

  const secondarySidebar = useMemo(
    () => (
      <SecondarySidebar
        title={t('workerSideBar.title', {
          companyName: workerEmployment?.company.name,
        })}
      >
        {t('workerSideBar.description')}
        {stepper}
      </SecondarySidebar>
    ),
    [t, stepper, workerEmployment]
  );

  const ctaButtons = useMemo(
    () => (
      <Box
        display="flex"
        marginY="1rem"
        gap={`${isDesktop ? 4 : 1}rem`}
        flexDirection={isDesktop ? 'row' : 'column'}
        justifyContent={
          isDesktop && !isFirstStep(activeStep) ? 'center' : 'space-around'
        }
      >
        {!isFirstStep(activeStep) && !isLastStep(activeStep) && (
          <Button
            variant="outlined"
            onClick={() => {
              firePreviousEventDependingOnStepWorkerPortal(activeStep);
              setActiveStep(
                activeStep === WorkerOnboardingPage.ADDITIONAL_INFORMATION &&
                  !bankOptions.length
                  ? activeStep - 2
                  : activeStep - 1
              );
            }}
            sx={{
              paddingX: '2rem',
            }}
          >
            {t('common:previous')}
          </Button>
        )}
        {!isLastStep(activeStep) && (
          <ButtonSubmit
            variant="contained"
            fullWidth={!isDesktop}
            sx={{
              paddingX: '2rem',
            }}
            data-testid="workerOnboarding-nextButton"
          >
            {t('common:next')}
          </ButtonSubmit>
        )}
      </Box>
    ),
    [t, activeStep, bankOptions, isDesktop]
  );

  const getContent = () => {
    switch (activeStep) {
      case WorkerOnboardingPage.IDENTIFICATION:
        return (
          <DynamicIdentificationForm
            workerCountryCode={workerCountryCode}
            setWorkerCountryCode={setWorkerCountryCode}
            setValidationSchema={setValidationSchema}
          />
        );
      case WorkerOnboardingPage.EMERGENCY_CONTACT:
        return (
          <DynamicEmergencyContactForm
            dialingCodes={dialingCodes}
            setValidationSchema={setValidationSchema}
          />
        );
      case WorkerOnboardingPage.BANK_DETAILS:
        return (
          <DynamicBankDetailsForm
            setValidationSchema={setValidationSchema}
            session={session}
            bankOptions={bankOptions}
          />
        );
      case WorkerOnboardingPage.ADDITIONAL_INFORMATION:
        return contextEmploymentId ? (
          <DynamicAdditionalInformationForm
            setValidationSchema={setValidationSchema}
            workerEmploymentId={contextEmploymentId}
          />
        ) : (
          <Typography>{t('workerCommon.errorText')}</Typography>
        );
      case WorkerOnboardingPage.IN_REVIEW:
        return <DynamicInReviewForm isDesktop={isDesktop} />;
      default:
        return <DynamicPersonalProfileForm dialingCodes={dialingCodes} />;
    }
  };

  const onSubmit = async (
    values: WorkerOnboardingFormValues,
    actions: FormikHelpers<WorkerOnboardingFormValues>
  ) => {
    try {
      if (contextEmploymentId) {
        await WorkerEmploymentApi.update(
          session,
          contextEmploymentId,
          await mapToRequestBody(values, activeStep)
        );
      }
      fireNextEventDependingOnStepWorkerPortal(activeStep);
      setActiveStep(
        activeStep === WorkerOnboardingPage.EMERGENCY_CONTACT &&
          !bankOptions.length
          ? activeStep + 2
          : activeStep + 1
      );
      actions.setTouched({});
      actions.setFormikState((prev) => ({
        ...prev,
        submitCount: 0,
      }));
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
  };

  const content = isLastStep(activeStep) ? (
    <>
      <Box display="flex" justifyContent="center">
        {getContent()}
      </Box>
    </>
  ) : (
    <Formik
      enableReinitialize
      onSubmit={onSubmit}
      initialValues={getInitialValues(workerEmployment, dialingCodes)}
      validationSchema={validationSchema}
    >
      <Form noValidate>
        <Box display="flex" justifyContent="center" marginY="3rem">
          {getContent()}
        </Box>
        {ctaButtons}
      </Form>
    </Formik>
  );

  return (
    <SecondaryAppLayout
      isDesktop={isDesktop}
      secondarySidebar={secondarySidebar}
    >
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
      >
        {toast.message}
      </Toast>
      <Container maxWidth={false}>
        {!isDesktop && stepper}
        <Stack alignItems="center" spacing={1}>
          <Typography variant="h4" textAlign="center">
            {contentTexts[activeStep].title}
          </Typography>
          <Typography variant="subtitle1">
            {activeStep !== WorkerOnboardingPage.IN_REVIEW &&
              t('workerCommon.description')}
          </Typography>
        </Stack>
        {content}
      </Container>
    </SecondaryAppLayout>
  );
};

export default WorkerOnboarding;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getServerSideSession(context);

    const contextEmploymentId =
      session?.user.selectedUserContext.contextEmploymentId;

    if (typeof contextEmploymentId !== 'string')
      return {
        redirect: {
          permanent: false,
          destination: WORKER_HOME.path,
        },
      };

    const { workerEmployment } = await WorkerEmploymentApi.getByEmploymentId(
      session,
      {
        attributes: [
          'id',
          'workerTypeId',
          'companyId',
          'workerUserId',
          'workerType',
          'status',
          'citizenshipStatus',
          'additionalInfo',
          'company:companyId,name',
          'workerUser.userContext.user:cognitoId,id,firstName,lastName',
          'workerUser.address:id,addressLine,city,state,postalCode',
          'workerUser.bankAccount:id,bankId,beneficiaryName,accountNumber,branchCode',
          'workerUser.bankAccount.bank:bankId,bankName,bankCode,swiftCode',
          'workerIdentity:workerEmploymentId,permitId,permitIdFile,permitIssuedDate,permitIssuedPlace,passportNumber,passportFile,nationalId,nationalIdFile,nationalIdIssuedDate,permitType,taxId,permitExpiryDate',
          'workerContact:workerEmploymentId,contactNumber,contactNumberCountryCode,emergencyContactName,emergencyContactRelationship,emergencyContactNumberCountryCode,emergencyContactNumber',
        ],
      },
      contextEmploymentId
    );

    if (
      ![
        HireStatus.EMPLOYEE_INVITED,
        HireStatus.EMPLOYEE_DECLARATION,
        HireStatus.EMPLOYEE_REVIEW,
        HireStatus.EMPLOYEE_UPDATE_REQUIRED,
      ].includes(workerEmployment.status)
    ) {
      return {
        redirect: {
          permanent: false,
          destination: WORKER_HOME.path,
        },
      };
    }

    const { countries } = await CountryApi.getCountries();
    const dialingCodes = countries.map((country) => ({
      id: country.id,
      dialingCode: country.dialingCode,
      code: country.code,
      label: country.name,
    }));

    return {
      props: {
        ...(await serverSideTranslations(context.locale ?? 'en', [
          'common',
          'worker-onboarding',
          'religion',
          'permit-type',
          'gender',
          'marital-status',
          'emergency-contact-relationship',
          'race',
        ])),
        dialingCodes,
        workerEmployment,
      },
    };
  } catch (e) {
    if (e instanceof RedirectionError) {
      return e.redirect();
    }

    return {
      props: {} as WorkerOnboardingProps,
    };
  }
};
