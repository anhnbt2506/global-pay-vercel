import { UserSession } from '@ayp/typings/commons';
import {
  Company,
  DepartmentAction,
  HireStatus,
  WorkerEmployment,
} from '@ayp/typings/entities';
import { CountryOption, CurrencyOption, Option } from '@ayp/typings/ui';
import { isErrorResponse } from '@ayp/utils';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Form, Formik, FormikHelpers } from 'formik';
import { omit } from 'lodash-es';
import memoizee from 'memoizee';
import { TFunction, useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SchemaOf } from 'yup';

import { TOP_NAVIGIATION_HEIGHT } from '@configs/constants';
import {
  Loading,
  SecondaryAppLayout,
  SecondarySidebar,
} from '@components/commons';
import {
  ClientOnboardingPeoOrEorPage,
  fireNextEventDependingOnStep,
  firePreviousEventDependingOnStep,
  GuidedModePeoFormValues,
  initialValues as initValues,
  mapToPatchRequestBody,
  mapToPostRequestBody,
  validationSchema as defaultValidationSchema,
  ModeQuery,
  mapToGuidedModePeoFormValue,
} from '@components/pages/company/people/onboarding/create/guided-mode/peo/config';
import { ButtonSubmit, Stepper, Toast } from '@components/ui';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { useSessionCookies } from '@hooks/use-session-cookies';
import {
  DepartmentApi,
  DepartmentSelection,
  WorkerEmploymentApi,
} from '@services/apis/people';

import { RequestAddendumFileModal } from './request-addendum-file-modal';

const firstStep = ClientOnboardingPeoOrEorPage.CLASSIFY_YOUR_HIRE;
const secondStep = ClientOnboardingPeoOrEorPage.HIRING_DETAILS;
const lastStep = ClientOnboardingPeoOrEorPage.EMPLOYMENT_CONTRACT;

const isFirstStep = (activeStep: number) => activeStep === firstStep;
const isSecondStep = (activeStep: number) => activeStep === secondStep;
const isLastStep = (activeStep: number) => activeStep === lastStep;

const getSteps = (t: TFunction) => [
  {
    label: t('guidedMode.PEO.hiringDetails.label'),
  },
  {
    label: t('guidedMode.PEO.hireeDetails.label'),
  },
  {
    label: t('guidedMode.PEO.contractDetails.label'),
  },
  {
    label: t('guidedMode.PEO.remunerationDetails.label'),
  },
  {
    label: t('guidedMode.PEO.additionalDetails.label'),
  },
  {
    label: t('guidedMode.PEO.employmentContract.label'),
  },
];

const getSidebarTexts = (t: TFunction) => [
  {
    title: t('guidedMode.classifyYourHire.sidebar.title'),
    description: (
      <Box
        sx={{
          marginTop: '1rem',
        }}
      >
        <Typography>
          {t('guidedMode.classifyYourHire.sidebar.description')}
        </Typography>
      </Box>
    ),
  },
  {
    title: t('guidedMode.PEO.hiringDetails.sidebar.title'),
    description: (
      <Box
        sx={{
          marginTop: '1rem',
        }}
      >
        <Typography>
          {t('guidedMode.PEO.hiringDetails.sidebar.description')}
        </Typography>
      </Box>
    ),
  },
  {
    title: t('guidedMode.PEO.hireeDetails.sidebar.title'),
    description: (
      <Box
        sx={{
          marginTop: '1rem',
        }}
      >
        <Typography>
          {t('guidedMode.PEO.hireeDetails.sidebar.description')}
        </Typography>
      </Box>
    ),
  },
  {
    title: t('guidedMode.PEO.contractDetails.sidebar.title'),
    description: (
      <Box
        sx={{
          marginTop: '1rem',
        }}
      >
        <Typography>
          {t('guidedMode.PEO.contractDetails.sidebar.title')}
        </Typography>
      </Box>
    ),
  },
  {
    title: t('guidedMode.PEO.remunerationDetails.sidebar.title'),
    description: (
      <Box
        sx={{
          marginTop: '1rem',
        }}
      >
        <Typography>
          {t('guidedMode.PEO.remunerationDetails.sidebar.title')}
        </Typography>
      </Box>
    ),
  },
  {
    title: t('guidedMode.PEO.additionalDetails.sidebar.title'),
    description: (
      <Box
        sx={{
          marginTop: '1rem',
        }}
      >
        <Typography>
          {t('guidedMode.PEO.additionalDetails.sidebar.title')}
        </Typography>
      </Box>
    ),
  },
  {
    title: t('guidedMode.PEO.employmentContract.sidebar.title'),
    description: (
      <Box
        sx={{
          marginTop: '1rem',
        }}
      >
        <Typography>
          {t('guidedMode.PEO.employmentContract.sidebar.title')}
        </Typography>
      </Box>
    ),
  },
];

const getContentTexts = (t: TFunction) => [
  {
    title: t('guidedMode.classifyYourHire.title'),
    description: (
      <Typography variant="subtitle1">
        {t('guidedMode.classifyYourHire.description')}
      </Typography>
    ),
  },
  {
    title: t('guidedMode.PEO.hiringDetails.title'),
    description: (
      <Typography variant="subtitle1">
        {t('guidedMode.PEO.hiringDetails.description')}
      </Typography>
    ),
  },
  {
    title: t('guidedMode.PEO.hireeDetails.title'),
    description: (
      <Typography variant="subtitle1">
        {t('guidedMode.PEO.hireeDetails.description')}
      </Typography>
    ),
  },
  {
    title: t('guidedMode.PEO.contractDetails.title'),
    description: (
      <Typography variant="subtitle1">
        {t('guidedMode.PEO.contractDetails.description')}
      </Typography>
    ),
  },
  {
    title: t('guidedMode.PEO.remunerationDetails.title'),
    description: (
      <Typography variant="subtitle1">
        {t('guidedMode.PEO.remunerationDetails.description')}
      </Typography>
    ),
  },
  {
    title: t('guidedMode.PEO.additionalDetails.title'),
    description: (
      <Typography variant="subtitle1">
        {t('guidedMode.PEO.additionalDetails.description')}
      </Typography>
    ),
  },
  {
    title: '',
    description: '',
  },
];

const DynamicClassifyYourHireForm = dynamic(
  () =>
    import(
      '@components/pages/company/people/onboarding/create/guided-mode/peo/classify-your-hire-form'
    )
);

const DynamicHiringDetailsForm = dynamic(
  () =>
    import(
      '@components/pages/company/people/onboarding/create/guided-mode/peo/hiring-details-form'
    )
);

const DynamicHireDetailsForm = dynamic(
  () =>
    import(
      '@components/pages/company/people/onboarding/create/guided-mode/peo/hiree-details-form'
    )
);

const DynamicContractDetailsForm = dynamic(
  () =>
    import(
      '@components/pages/company/people/onboarding/create/guided-mode/peo/contract-details-form'
    )
);

const DynamicRemunerationDetailsForm = dynamic(
  () =>
    import(
      '@components/pages/company/people/onboarding/create/guided-mode/peo/remuneration-details-form'
    )
);

const DynamicAdditionalDetailsForm = dynamic(
  () =>
    import(
      '@components/pages/company/people/onboarding/create/guided-mode/peo/additional-details-form'
    )
);

const DynamicEmploymentContractForm = dynamic(
  () =>
    import(
      '@components/pages/company/people/onboarding/create/guided-mode/peo/employment-contract-form'
    )
);

const DynamicNewHireAdded = dynamic(
  () =>
    import(
      '@components/pages/company/people/onboarding/create/guided-mode/peo/new-hiree-added'
    )
);

const isStepValid = (step: number) => !!ClientOnboardingPeoOrEorPage[step];

const isStepQueryValid = (step: string | string[] | undefined) => {
  /* istanbul ignore if */
  // This case cannot reproduce
  if (typeof step !== 'string') return false;

  return isStepValid(parseInt(step));
};

const getActiveStep = (
  step: string | string[] | undefined,
  employmentId: string | string[] | undefined
) => {
  if (isStepQueryValid(step)) {
    const stepNumber = parseInt(step as string);

    if (!employmentId) return stepNumber;

    /* istanbul ignore else */
    // This case cannot reproduce
    if (!isFirstStep(stepNumber)) return stepNumber;
  }

  return !!employmentId
    ? ClientOnboardingPeoOrEorPage.HIRING_DETAILS
    : ClientOnboardingPeoOrEorPage.CLASSIFY_YOUR_HIRE;
};

const getWorkerEmploymentMemo = memoizee(
  async (
    session: UserSession,
    employmentId: string
  ): Promise<Nullable<WorkerEmployment>> => {
    try {
      const { workerEmployment } = await WorkerEmploymentApi.getByEmploymentId(
        session,
        {
          attributes: [
            'id',
            'status',
            'agreement',
            'hireType',
            'hiringCountryCode',
            'isHaveLegalEntity',
            'isUseLegalEntity',
            'nationalityCode',
            'citizenshipStatus',
            'currency',
            'title',
            'description',
            'employeeId',
            'contractType',
            'startDate',
            'endDate',
            'employmentType',
            'startAt',
            'endAt',
            'workingHoursPerWeek',
            'workerSchedule:workerEmploymentId,monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'managerName',
            'managerTitle',
            'departmentId',
            'workerUserId',
            'workerUser.userContext.user:id,cognitoId,firstName,lastName,email',
            'workerIdentity:workerEmploymentId,isWorkPermitActive,',
            'workplaceAddressType',
            'workplaceAddressId',
            'workplaceAddress:id,addressLine,city,state,postalCode',
            'workerRemuneration:workerEmploymentId,salaryPerMonth,monthlyAllowance,isEligibleForInsurance,isEligibleForAdditionalIncome,isEligibleForPaidExpenses,isEntitledToOvertime,isEligibleForVariablePay,isEligibleForAnnualBonus,isEligibleForCommission,overtimeDescription,paidExpensesDescription,additionalIncomeDescription,annualBonusDescription,isEligibleForCommission,commissionDescription,variablePayDescription,salaryPayableDate,paidTimeOff,sickTimeOff,compassionateTimeOff,monthlyAllowance',
            'additionalInfo',
            'workerTypeId',
            'workerType',
            'terminationNotice',
            'probationPeriod',
            'probationEndDate',
            'probationStartDate',
            'employmentId',
            'workerAddendumFiles.fileManagement:id,filePath,createdAt,createdById;workerAddendumFiles.fileManagement.createdBy.user:cognitoId,email,firstName,lastName',
          ],
        },
        employmentId
      );
      return workerEmployment;
    } catch (e) {
      return null;
    }
  },
  { promise: true }
);

const getDepartmentsMemo = memoizee(
  async (session: UserSession): Promise<Nullable<DepartmentSelection[]>> => {
    try {
      const { departments } = await DepartmentApi.getDepartmentsSelection(
        session
      );

      return departments;
    } catch (e) {
      return null;
    }
  },
  { promise: true }
);

interface GuidedModePeoProps {
  company: Company;
  isDesktop: boolean;
  countries: CountryOption[];
  currencies: CurrencyOption[];
  setFormMode: (formMode: Nullable<ModeQuery>) => void;
}

const GuidedModePeo: FC<GuidedModePeoProps> = ({
  company,
  isDesktop,
  setFormMode,
  countries,
  currencies,
}) => {
  const { session } = useSessionCookies();
  const router = useRouter();

  const { step, employmentId } = router.query;
  const activeStep = getActiveStep(step, employmentId);

  const lastEmployeeIdValue = useRef<Nullable<string>>(null);
  const islastEmployeeIdValid = useRef<boolean>(false);
  const lastEmploymentId = useRef<Nullable<string>>(null);

  const [toast, setToast] = useState<Toast>({});
  const [loading, setLoading] = useState(false);
  const [validationSchema, setValidationSchema] = useState<
    SchemaOf<unknown> | undefined
  >(undefined);
  const { t } = useTranslation('company-people-onboarding-create');
  const [agreementId, setAgreementId] = useState<string>('');
  const [disableButtonNext, setDisableButtonNext] = useState<boolean>(false);
  const [isOpenAddendumFileModal, setIsOpenAddendumFileModal] =
    useState<boolean>(false);
  const [initialValues, setInitialValues] =
    useState<GuidedModePeoFormValues>(initValues);
  const [departmentOptions, setDepartmentOptions] = useState<Option[]>([]);
  const [formLoading, setFormLoading] = useState(false);
  const [workerEmployment, setWorkerEmployment] =
    useState<Nullable<WorkerEmployment>>(null);

  const sidebarTexts = getSidebarTexts(t);
  const contentTexts = getContentTexts(t);

  const defaultDepartmentOptions: Option = useMemo(
    () => ({
      id: DepartmentAction.CREATE_NEW_DEPARTMENT,
      label: t('guidedMode.PEO.contractDetails.form.department.options.create'),
    }),
    [t]
  );

  const fetchDepartmentOptions = useCallback(
    async (isSetDepartmentOptions: boolean) => {
      const departments = await getDepartmentsMemo(session);

      if (!departments) return;

      const departmentOptions = [
        defaultDepartmentOptions,
        ...departments.map(({ departmentId, name }) => ({
          id: departmentId,
          label: name,
        })),
      ];

      if (isSetDepartmentOptions) {
        setDepartmentOptions(departmentOptions);
      }

      return departmentOptions;
    },
    [defaultDepartmentOptions, session]
  );

  useEffect(() => {
    fetchDepartmentOptions(true);
  }, [fetchDepartmentOptions]);

  useEffect(() => {
    if (isStepQueryValid(step)) {
      if (!employmentId) return;

      /* istanbul ignore else */
      // This case cannot reproduce
      if (!isFirstStep(parseInt(step as string))) return;
    }

    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          step: !!employmentId
            ? ClientOnboardingPeoOrEorPage.HIRING_DETAILS
            : ClientOnboardingPeoOrEorPage.CLASSIFY_YOUR_HIRE,
        },
      },
      undefined,
      {
        shallow: true,
      }
    );
  }, [step, router, employmentId]);

  useEffect(() => {
    if (
      !employmentId ||
      typeof employmentId !== 'string' ||
      lastEmploymentId.current === employmentId ||
      !session
    )
      return;

    lastEmploymentId.current = employmentId;

    (async () => {
      setFormLoading(true);
      try {
        const [workerEmployment, departmentOptions] = await Promise.all([
          getWorkerEmploymentMemo(session, employmentId),
          fetchDepartmentOptions(false),
        ]);

        if (!workerEmployment || workerEmployment.status !== HireStatus.DRAFT) {
          router.replace(
            {
              pathname: router.pathname,
              query: {
                ...omit(router.query, 'employmentId'),
                step: ClientOnboardingPeoOrEorPage.CLASSIFY_YOUR_HIRE,
              },
            },
            undefined,
            {
              shallow: false,
            }
          );
          return;
        }

        setInitialValues(
          mapToGuidedModePeoFormValue(
            workerEmployment,
            countries,
            currencies,
            departmentOptions ??
              /* istanbul ignore next */
              // this case is not necessary to test
              []
          )
        );
        setWorkerEmployment(workerEmployment);

        lastEmployeeIdValue.current = workerEmployment.employeeId;
        islastEmployeeIdValid.current = !!workerEmployment.employeeId;
      } catch (e) {
      } finally {
        setFormLoading(false);
      }
    })();
  }, [
    employmentId,
    session,
    countries,
    currencies,
    fetchDepartmentOptions,
    router,
  ]);

  useEffect(() => {
    setValidationSchema(defaultValidationSchema[activeStep]);
  }, [activeStep]);

  const setActiveStep = useCallback(
    (step: number) => {
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            step,
          },
        },
        undefined,
        {
          shallow: true,
        }
      );
    },
    [router]
  );

  // step 0: Eligibility screen, has no stepper
  const stepper = useMemo(
    () =>
      activeStep > firstStep ? (
        <Stepper
          steps={getSteps(t)}
          activeStep={activeStep - 1}
          withoutLabel={!isDesktop}
          orientation={isDesktop ? 'vertical' : 'horizontal'}
          sx={{
            marginY: '1rem',
          }}
        />
      ) : (
        <></>
      ),
    [t, activeStep, isDesktop]
  );

  const ctaButtons = useCallback(
    (values: GuidedModePeoFormValues) => {
      return (
        <Box
          display="flex"
          marginY="1rem"
          gap={`${isDesktop ? 4 : 1}rem`}
          flexDirection={isDesktop ? 'row' : 'column'}
          justifyContent={isDesktop ? 'center' : 'space-around'}
        >
          <Button
            variant="outlined"
            onClick={() => {
              firePreviousEventDependingOnStep(activeStep);
              isFirstStep(activeStep)
                ? setFormMode(null)
                : setActiveStep(activeStep - 1);
            }}
            sx={{
              paddingX: '2rem',
            }}
            data-testid="companyPeopleOnboardingCreate-guidedMode-peo-previousButton"
            disabled={!!employmentId && isSecondStep(activeStep)}
          >
            {isFirstStep(activeStep)
              ? t('guidedMode.PEO.hiringDetails.backToHiringServices')
              : t('common:previous')}
          </Button>
          {isLastStep(activeStep) && (
            <Button
              variant="outlined"
              disabled={values.isSigned}
              onClick={() => {
                setInitialValues(values);
                setIsOpenAddendumFileModal(true);
              }}
              data-testid="companyPeopleOnboardingCreate-guidedMode-peo-requestAddendumButton"
            >
              {t('guidedMode.PEO.employmentContract.requestAddendum.label')}
            </Button>
          )}
          <ButtonSubmit
            variant="contained"
            fullWidth={!isDesktop}
            loading={loading}
            sx={{
              paddingX: '2rem',
            }}
            data-testid="companyPeopleOnboardingCreate-guidedMode-peo-nextButton"
            disabled={
              isLastStep(activeStep) ? !values.isSigned : disableButtonNext
            }
          >
            {t(
              isLastStep(activeStep)
                ? 'guidedMode.PEO.employmentContract.acknowledge'
                : 'common:next'
            )}
          </ButtonSubmit>
        </Box>
      );
    },
    [
      isDesktop,
      activeStep,
      t,
      loading,
      disableButtonNext,
      setFormMode,
      setActiveStep,
      employmentId,
    ]
  );

  const shouldValidateEmployeeId = useCallback(
    (employeeId: string) => {
      if (
        !!workerEmployment?.employeeId &&
        workerEmployment?.employeeId === employeeId
      )
        return false;

      if (
        islastEmployeeIdValid.current &&
        lastEmployeeIdValue.current === employeeId
      )
        return false;

      return true;
    },
    [workerEmployment?.employeeId]
  );

  const onSubmit = useCallback(
    async (
      values: GuidedModePeoFormValues,
      actions: FormikHelpers<GuidedModePeoFormValues>
    ) => {
      setInitialValues(values);

      if (
        activeStep === ClientOnboardingPeoOrEorPage.HIREE_DETAILS &&
        shouldValidateEmployeeId(values.employeeId)
      ) {
        try {
          /* istanbul ignore if */
          // This case cannot reproduce
          if (!values.employeeId) {
            setToast({
              severity: 'error',
              message: t(UNKNOWN_ERROR_MESSAGE),
            });
            return;
          }

          lastEmployeeIdValue.current = values.employeeId;

          setLoading(true);

          const { isEmployeeIdValidated } =
            await WorkerEmploymentApi.checkEmployeeId(
              session,
              values.employeeId
            );

          islastEmployeeIdValid.current = isEmployeeIdValidated;

          if (!isEmployeeIdValidated) {
            actions.setFieldError(
              'employeeId',
              t(
                'guidedMode.PEO.hireeDetails.form.employeeId.error.employeeIdExisted'
              )
            );
            actions.setFieldTouched('employeeId', true, false);
            return;
          }
        } catch (e) {
          /* istanbul ignore if */
          // this case is not necessary to test
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
          return;
        } finally {
          setLoading(false);
        }
      }

      if (!isLastStep(activeStep)) {
        fireNextEventDependingOnStep(activeStep);
        setActiveStep(activeStep + 1);
      } else {
        try {
          if (!!employmentId) {
            await WorkerEmploymentApi.update(
              session,
              employmentId as string,
              await mapToPatchRequestBody(values)
            );
            setAgreementId(workerEmployment?.agreement.agreementId);
          } else {
            const { workerEmployment } = await WorkerEmploymentApi.post(
              session,
              await mapToPostRequestBody(values)
            );
            setAgreementId(workerEmployment.agreement.agreementId);
          }

          fireNextEventDependingOnStep(activeStep);
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
      }

      actions.setTouched({});
      actions.setFormikState((prev) => ({
        ...prev,
        submitCount: 0,
      }));
    },
    [
      activeStep,
      employmentId,
      workerEmployment?.agreement.agreementId,
      session,
      setActiveStep,
      shouldValidateEmployeeId,
      t,
    ]
  );

  const handleDisableButtonNext = (disable: boolean) => {
    setDisableButtonNext(disable);
  };

  const getFormContent = useCallback(() => {
    switch (activeStep) {
      case ClientOnboardingPeoOrEorPage.CLASSIFY_YOUR_HIRE:
        return (
          <DynamicClassifyYourHireForm
            countries={countries}
            setToast={setToast}
            setLoading={setLoading}
            onDisableNext={handleDisableButtonNext}
          />
        );
      case ClientOnboardingPeoOrEorPage.HIRING_DETAILS:
        return (
          <DynamicHiringDetailsForm
            countries={countries}
            currencies={currencies}
            onDisableNext={handleDisableButtonNext}
          />
        );
      case ClientOnboardingPeoOrEorPage.HIREE_DETAILS:
        return <DynamicHireDetailsForm />;
      case ClientOnboardingPeoOrEorPage.CONTRACT_DETAILS:
        return (
          <DynamicContractDetailsForm
            session={session}
            companyId={company.companyId}
            departmentOptions={departmentOptions}
            fetchDepartmentOptions={fetchDepartmentOptions}
            setToast={setToast}
          />
        );
      case ClientOnboardingPeoOrEorPage.REMUNERATION_DETAILS:
        return <DynamicRemunerationDetailsForm />;
      case ClientOnboardingPeoOrEorPage.ADDITIONAL_DETAILS:
        return (
          <DynamicAdditionalDetailsForm
            setValidationSchema={setValidationSchema}
          />
        );
      case ClientOnboardingPeoOrEorPage.EMPLOYMENT_CONTRACT:
        return (
          <DynamicEmploymentContractForm
            company={company}
            session={session}
            workerAddendumFiles={workerEmployment?.workerAddendumFiles ?? []}
            setToast={setToast}
          />
        );
      /* istanbul ignore next */
      // This case cannot reproduce
      default:
        return <></>;
    }
  }, [
    activeStep,
    company,
    countries,
    currencies,
    fetchDepartmentOptions,
    departmentOptions,
    session,
    workerEmployment?.workerAddendumFiles,
  ]);

  const form = useMemo(
    () => (
      <Formik
        enableReinitialize
        onSubmit={onSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({ values }) => {
          return (
            <Form noValidate>
              <Box display="flex" justifyContent="center" marginY="3rem">
                {getFormContent()}
              </Box>
              {ctaButtons(values)}
            </Form>
          );
        }}
      </Formik>
    ),
    [ctaButtons, getFormContent, initialValues, onSubmit, validationSchema]
  );

  const toastComponent = useMemo(
    () => (
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-toast"
      >
        {toast.message}
      </Toast>
    ),
    [toast.message, toast.severity]
  );

  const secondarySidebar = useMemo(
    () => (
      <SecondarySidebar title={sidebarTexts[activeStep].title}>
        {sidebarTexts[activeStep].description}
        {stepper}
      </SecondarySidebar>
    ),
    [stepper, activeStep, sidebarTexts]
  );

  return (
    <SecondaryAppLayout
      isDesktop={isDesktop}
      secondarySidebar={secondarySidebar}
      sx={
        agreementId
          ? {
              minHeight: 0,
            }
          : {}
      }
    >
      {toastComponent}
      {isOpenAddendumFileModal && (
        <RequestAddendumFileModal
          onClose={() => setIsOpenAddendumFileModal(false)}
          workerEmploymentValues={initialValues}
          setToast={setToast}
          dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-request-addendum-modal"
        />
      )}
      {formLoading ? (
        <Loading
          sx={{ height: `calc(100vh - ${TOP_NAVIGIATION_HEIGHT}rem)` }}
        />
      ) : agreementId ? (
        <DynamicNewHireAdded isDesktop={isDesktop} agreementId={agreementId} />
      ) : (
        <Container maxWidth={false}>
          {!isDesktop && stepper}
          <Stack
            alignItems="center"
            spacing={1}
            sx={{
              marginTop: !isDesktop ? '1.5rem' : 0,
            }}
          >
            <Typography
              variant="h4"
              textAlign="center"
              data-testid="companyPeopleOnboardingCreate-guidedMode-peo-title"
            >
              {contentTexts[activeStep].title}
            </Typography>
            {contentTexts[activeStep].description}
          </Stack>
          {form}
        </Container>
      )}
    </SecondaryAppLayout>
  );
};

export default GuidedModePeo;
