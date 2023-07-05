import {
  CountryCode,
  SortByOperator,
  StringOperator,
  UserSession,
  WorkerEmploymentValidateCsvError,
} from '@ayp/typings/commons';
import { CsvTemplate, HireType } from '@ayp/typings/entities';
import { CountryOption, CurrencyOption, Option } from '@ayp/typings/ui';
import {
  csvToObject,
  fireGtmEvent,
  isErrorResponse,
  isTypeOf,
} from '@ayp/utils';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Form, Formik, FormikHelpers } from 'formik';
import memoizee from 'memoizee';
import { TFunction, useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { FC, KeyboardEvent, useCallback, useMemo, useState } from 'react';

import { SecondaryAppLayout, SecondarySidebar } from '@components/commons';
import { ButtonSubmit, Stepper, Toast } from '@components/ui';
import { GTM_EVENTS } from '@configs/constants/gtm-events';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import {
  COMPANY_PAYROLL_DASHBOARD,
  COMPANY_PEOPLE_ONBOARDING_CREATE,
  COMPANY_PEOPLE_WORKFORCE,
} from '@configs/routes';
import { useSessionCookies } from '@hooks/use-session-cookies';
import {
  CountryApi,
  CurrencyApi,
  WorkerEmploymentApi,
} from '@services/apis/people';

import {
  BulkUploadPomFormValues,
  ClientOnboardingPomPage,
  initialValues,
  mapToRequestBody,
  validationSchema,
} from './config';
import { BankApi } from '@services/apis/people/bank-api';

const getCsvTemplateMemo = memoizee(
  async (
    session: UserSession,
    countryCode: CountryCode
  ): Promise<CsvTemplate[]> => {
    const data = await WorkerEmploymentApi.getCsvTemplate(session, countryCode);

    return data;
  },
  { promise: true }
);

const getCountriesMemo = memoizee(
  async (): Promise<CountryOption[]> => {
    const { countries } = await CountryApi.getCountries();

    return countries.map((country) => ({
      id: country.id,
      code: country.code,
      label: country.name,
      dialingCode: country.dialingCode,
      value: country.code,
    }));
  },
  { promise: true }
);

const getCurrenciesMemo = memoizee(
  async (session): Promise<CurrencyOption[]> => {
    const { currencies } = await CurrencyApi.getCurrencies(session);

    return currencies.map((currency) => ({
      id: currency.id,
      code: currency.code,
      label: currency.name,
      value: currency.code,
    }));
  },
  { promise: true }
);

const getBankOptionsMemo = memoizee(
  async (
    session: UserSession,
    country: CountryCode
  ): Promise<Option<string>[]> => {
    const { banks } = await BankApi.getBanks(session, {
      attributes: ['bankId', 'bankName'],
      filters: [`countryCode,${StringOperator.EQUALS},${country}`],
      sortBy: `bankName,${SortByOperator.ASC}`,
    });

    return banks.map(({ bankId, bankName }) => ({
      id: bankId,
      label: bankName,
      value: bankId,
    }));
  },
  { promise: true }
);
const firstStep = ClientOnboardingPomPage.PAYROLL_COUNTRY;
const lastStep = ClientOnboardingPomPage.COMPLETE_ENROLLMENT;

const isFirstStep = (activeStep: number) => activeStep === firstStep;
const isLastStep = (activeStep: number) => activeStep === lastStep;
const isReviewEmployeeDataStep = (activeStep: number) =>
  activeStep === ClientOnboardingPomPage.REVIEW_EMPLOYEES_DATA;

const getSteps = (t: TFunction) => [
  {
    label: t('pom.steps.payrollCountry.title'),
  },
  {
    label: t('pom.steps.onboardEmployees.title'),
  },
  {
    label: t('pom.steps.reviewEmployeeData.title'),
  },
  {
    label: t('pom.steps.completeEnrollment.title'),
  },
];

const getFormDescription = (t: TFunction) => [
  {
    title: t('pom.steps.payrollCountry.title'),
    description: (
      <Typography variant="subtitle1">
        {t('pom.steps.payrollCountry.description')}
      </Typography>
    ),
  },
  {
    title: t('pom.steps.onboardEmployees.title'),
    description: (
      <Typography variant="subtitle1">
        {t('pom.steps.onboardEmployees.description')}
      </Typography>
    ),
  },
  {
    title: t('pom.steps.reviewEmployeeData.title'),
    description: (
      <Typography variant="subtitle1">
        {t('pom.steps.reviewEmployeeData.description')}
      </Typography>
    ),
  },
  {
    title: undefined,
    description: undefined,
  },
];

const DynamicPayrollCountryForm = dynamic(
  () =>
    import(
      '@components/pages/company/people/onboarding/create/bulk-upload-mode/pom/payroll-country-form'
    )
);

const DynamicOnboardEmployeesForm = dynamic(
  () =>
    import(
      '@components/pages/company/people/onboarding/create/bulk-upload-mode/pom/onboard-employees-form'
    )
);

const DynamicReviewEmployeeDataForm = dynamic(
  () =>
    import(
      '@components/pages/company/people/onboarding/create/bulk-upload-mode/pom/review-employee-data-form'
    )
);

const DynamicCompleteEnrollmentForm = dynamic(
  () =>
    import(
      '@components/pages/company/people/onboarding/create/bulk-upload-mode/pom/complete-enrollment-form'
    )
);

interface BulkUploadPomProps {
  countries: CountryOption[];
  isDesktop: boolean;
}

const BulkUploadPom: FC<BulkUploadPomProps> = ({
  isDesktop,
  countries = [],
}) => {
  const router = useRouter();
  const [toast, setToast] = useState<Toast>({});
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isValidEmployeeData, setIsValidEmployeeData] = useState(false);
  const { session } = useSessionCookies();
  const [csvTemplates, setCsvTemplates] = useState<CsvTemplate[]>([]);
  const [dataGridEditable, setDataGridEditable] = useState<boolean>(true);
  const [validationCsvErrors, setValidationCsvErrors] = useState<
    WorkerEmploymentValidateCsvError[]
  >([]);

  const { t } = useTranslation(
    'company-people-onboarding-create-bulk-upload-mode'
  );

  const contentTexts = getFormDescription(t);

  const fetchCsvTemplates = useCallback(
    async (countryCode: CountryCode) => {
      try {
        const data = await getCsvTemplateMemo(session, countryCode);

        return data;
      } catch (e) {
        /* istanbul ignore else */
        // This case is unnecessary to test
        if (isErrorResponse(e)) {
          setToast({
            severity: 'error',
            message: e.error.name,
          });
        } else {
          setToast({ severity: 'error', message: t(UNKNOWN_ERROR_MESSAGE) });
        }
      }
    },
    [session, setToast, t]
  );

  const fetchCountries = useCallback(async () => {
    try {
      const data = await getCountriesMemo();

      return data;
    } catch (e) {
      /* istanbul ignore next */
      // This case is unnecessary to test
      if (isErrorResponse(e)) {
        setToast({
          severity: 'error',
          message: e.error.name,
        });
      } else {
        setToast({ severity: 'error', message: t(UNKNOWN_ERROR_MESSAGE) });
      }
    }
  }, [setToast, t]);

  const fetchCurrencies = useCallback(async () => {
    try {
      const data = await getCurrenciesMemo(session);

      return data;
    } catch (e) {
      /* istanbul ignore next */
      // This case is unnecessary to test
      if (isErrorResponse(e)) {
        setToast({
          severity: 'error',
          message: e.error.name,
        });
      } else {
        setToast({ severity: 'error', message: t(UNKNOWN_ERROR_MESSAGE) });
      }
    }
  }, [session, setToast, t]);

  const fetchBankOptions = useCallback(
    async (countryCode: CountryCode) => {
      try {
        const data = await getBankOptionsMemo(session, countryCode);

        return data;
      } catch (e) {
        /* istanbul ignore next */
        // This case is unnecessary to test
        if (isErrorResponse(e)) {
          setToast({
            severity: 'error',
            message: e.error.name,
          });
        } else {
          setToast({ severity: 'error', message: t(UNKNOWN_ERROR_MESSAGE) });
        }
      }
    },
    [session, setToast, t]
  );

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

  const btnNextTitle = useMemo(() => {
    if (isReviewEmployeeDataStep(activeStep)) {
      return isValidEmployeeData ? t('common:submit') : t('common:validate');
    }

    return isLastStep(activeStep)
      ? t('common:viewWorkforce')
      : t('common:next');
  }, [t, activeStep, isValidEmployeeData]);

  const ctaButtons = useMemo(
    () => (
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
            switch (activeStep) {
              case ClientOnboardingPomPage.PAYROLL_COUNTRY:
                fireGtmEvent<GTM_EVENTS>({
                  event: GTM_EVENTS.CLIENT_PORTAL_ADD_POM_SERVICE_STEP1_LEAVE,
                });
                return router.push(COMPANY_PEOPLE_ONBOARDING_CREATE.path);
              /* istanbul ignore next */
              // This case is unnecessary to test
              case ClientOnboardingPomPage.COMPLETE_ENROLLMENT:
                fireGtmEvent<GTM_EVENTS>({
                  event: GTM_EVENTS.CLIENT_PORTAL_ADD_POM_SERVICE_DONE_PAYROLL,
                });
                return router.push(COMPANY_PAYROLL_DASHBOARD.path);
              case ClientOnboardingPomPage.ONBOARD_EMPLOYEES:
                fireGtmEvent<GTM_EVENTS>({
                  event: GTM_EVENTS.CLIENT_PORTAL_ADD_POM_SERVICE_STEP2_LEAVE,
                });
              case ClientOnboardingPomPage.REVIEW_EMPLOYEES_DATA:
                fireGtmEvent<GTM_EVENTS>({
                  event: GTM_EVENTS.CLIENT_PORTAL_ADD_POM_SERVICE_STEP3_LEAVE,
                });
                setValidationCsvErrors([]);
              default:
                return setActiveStep(activeStep - 1);
            }
          }}
          sx={{
            paddingX: '2rem',
          }}
          data-testid={
            'companyPeopleOnboardingCreate-bulkUploadMode-pom-backToHiringServicesButton'
          }
        >
          {isFirstStep(activeStep)
            ? t('backToHiringServices')
            : isLastStep(activeStep)
            ? t('common:managePayroll')
            : t('common:previous')}
        </Button>
        <ButtonSubmit
          disabled={!!validationCsvErrors.length}
          variant="contained"
          fullWidth={!isDesktop}
          loading={loading}
          sx={{
            paddingX: '2rem',
          }}
          data-testid={
            'companyPeopleOnboardingCreate-bulkUploadMode-pom-nextButton'
          }
        >
          {btnNextTitle}
        </ButtonSubmit>
      </Box>
    ),
    [
      isDesktop,
      t,
      activeStep,
      btnNextTitle,
      loading,
      router,
      validationCsvErrors,
    ]
  );

  const onSubmit = async (
    values: BulkUploadPomFormValues,
    actions: FormikHelpers<BulkUploadPomFormValues>
  ) => {
    try {
      const { country, file, onboardEmployeesCsvData } = values;

      switch (activeStep) {
        case ClientOnboardingPomPage.PAYROLL_COUNTRY:
          fireGtmEvent<GTM_EVENTS>({
            event: GTM_EVENTS.CLIENT_PORTAL_ADD_POM_SERVICE_STEP1_DONE,
          });
          break;
        case ClientOnboardingPomPage.ONBOARD_EMPLOYEES:
          setLoading(true);
          try {
            /* istanbul ignore next */
            // This case cannot happen
            if (!country?.code || !file) return;

            const [csvTemplates, countries, currencies, bankOptions] =
              await Promise.all([
                fetchCsvTemplates(country.code),
                fetchCountries(),
                fetchCurrencies(),
                fetchBankOptions(country.code),
              ]);

            if (!csvTemplates || !countries || !currencies || !bankOptions) {
              throw { message: t(UNKNOWN_ERROR_MESSAGE) };
            }

            const csvData = await csvToObject(
              file,
              csvTemplates,
              t,
              countries,
              currencies,
              bankOptions
            );
            actions.setFieldValue('onboardEmployeesCsvData', csvData);
            setCsvTemplates(csvTemplates);
            setIsValidEmployeeData(false);
            setDataGridEditable(true);
            setValidationCsvErrors([]);

            fireGtmEvent<GTM_EVENTS>({
              event: GTM_EVENTS.CLIENT_PORTAL_ADD_POM_SERVICE_STEP2_DONE,
            });
          } catch (e) {
            /* istanbul ignore else */
            // This case cannot reproduce
            if (isTypeOf<{ message: string }>(e, ['message'])) {
              actions.setFieldError('file', e.message);
              return;
            } else {
              actions.setFieldError('file', t(UNKNOWN_ERROR_MESSAGE));
            }
          } finally {
            setLoading(false);
          }
          break;
        case ClientOnboardingPomPage.REVIEW_EMPLOYEES_DATA: {
          /* istanbul ignore next */
          // This case is unnecessary to test
          if (!onboardEmployeesCsvData?.values) {
            setToast({
              severity: 'error',
              message: t(UNKNOWN_ERROR_MESSAGE),
            });

            return;
          }

          const requestBody = mapToRequestBody(
            onboardEmployeesCsvData.values,
            HireType.POM,
            csvTemplates
          );

          if (isValidEmployeeData) {
            await WorkerEmploymentApi.bulkUploadCsv(session, requestBody);

            fireGtmEvent<GTM_EVENTS>({
              event: GTM_EVENTS.CLIENT_PORTAL_ADD_POM_SERVICE_STEP3_DONE,
            });

            setActiveStep(activeStep + 1);
            break;
          }

          const validateCsvData = await WorkerEmploymentApi.validateCsv(
            session,
            requestBody
          );

          if (validateCsvData.errors.length) {
            setValidationCsvErrors(validateCsvData.errors);
            setToast({
              severity: 'error',
              message: t(
                'pom.steps.reviewEmployeeData.toast.validateErrorText'
              ),
              title: t('pom.steps.reviewEmployeeData.toast.thereAreErrors', {
                numberOfError: validateCsvData.errors.length,
              }),
            });
            return;
          }

          setToast({
            severity: 'success',
            message: t(
              'pom.steps.reviewEmployeeData.toast.validateSuccessText'
            ),
          });
          setIsValidEmployeeData(true);
          setDataGridEditable(false);

          fireGtmEvent<GTM_EVENTS>({
            event: GTM_EVENTS.CLIENT_PORTAL_ADD_POM_SERVICE_STEP3_CHECK,
          });

          return;
        }
        case ClientOnboardingPomPage.COMPLETE_ENROLLMENT:
          fireGtmEvent<GTM_EVENTS>({
            event: GTM_EVENTS.CLIENT_PORTAL_ADD_POM_SERVICE_DONE_WORKFORCE,
          });

          router.push(COMPANY_PEOPLE_WORKFORCE.path);
          break;
        default:
          break;
      }

      if (isLastStep(activeStep)) return;

      setActiveStep(activeStep + 1);
      actions.setTouched({});
      actions.setFormikState((prev) => ({
        ...prev,
        submitCount: 0,
      }));
    } catch (e) {
      /* istanbul ignore else */
      // This case is unnecessary to test
      if (isErrorResponse(e)) {
        setToast({
          severity: 'error',
          message: e.error.name,
        });
      } else {
        setToast({ severity: 'error', message: t(UNKNOWN_ERROR_MESSAGE) });
      }
    }
  };

  const getFormContent = () => {
    switch (activeStep) {
      case ClientOnboardingPomPage.PAYROLL_COUNTRY:
        return (
          <DynamicPayrollCountryForm
            countries={countries}
            setToast={setToast}
            setLoading={setLoading}
            dataTestId="companyPeopleOnboardingCreate-bulkUploadMode-pom"
          />
        );
      case ClientOnboardingPomPage.ONBOARD_EMPLOYEES:
        return (
          <DynamicOnboardEmployeesForm dataTestId="companyPeopleOnboardingCreate-bulkUploadMode-pom-onboard-employees" />
        );
      case ClientOnboardingPomPage.REVIEW_EMPLOYEES_DATA:
        return (
          <DynamicReviewEmployeeDataForm
            csvTemplates={csvTemplates}
            session={session}
            dataGridEditable={dataGridEditable}
            validationCsvErrors={validationCsvErrors}
            setValidationCsvErrors={setValidationCsvErrors}
          />
        );
      case ClientOnboardingPomPage.COMPLETE_ENROLLMENT:
        return (
          <DynamicCompleteEnrollmentForm
            dataTestId={
              'companyPeopleOnboardingCreate-bulkUploadMode-pom-notified'
            }
          />
        );
      default:
        return <></>;
    }
  };

  const onKeyDown = (keyEvent: KeyboardEvent) => {
    const enterChar = 'Enter';
    /* istanbul ignore if */
    // This case is unnecessary to test
    if (keyEvent.key === enterChar) {
      keyEvent.preventDefault();
    }
  };

  const form = (
    <Formik
      enableReinitialize
      onSubmit={onSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema[activeStep]}
    >
      <Form onKeyDown={onKeyDown} noValidate>
        <Box display="flex" justifyContent="center" marginY="3rem">
          {getFormContent()}
        </Box>
        {ctaButtons}
      </Form>
    </Formik>
  );

  return (
    <SecondaryAppLayout
      isDesktop={isDesktop}
      secondarySidebar={
        <SecondarySidebar
          title={t('pom.sidebar.title')}
          dataTestId={'companyPeopleOnboardingCreate-sidebar'}
        >
          {t('pom.sidebar.subtitle')}
          {stepper}
        </SecondarySidebar>
      }
    >
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        title={toast.title}
        dataTestId="companyPeopleOnboardingCreate-toast"
      >
        {toast.message}
      </Toast>
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
            data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-title"
          >
            {contentTexts[activeStep].title}
          </Typography>
          {contentTexts[activeStep].description}
        </Stack>
        {form}
      </Container>
    </SecondaryAppLayout>
  );
};

export default BulkUploadPom;
