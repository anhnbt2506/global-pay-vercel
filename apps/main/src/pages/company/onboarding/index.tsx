import { NextPage } from '@ayp/typings/commons';
import { Company, CompanyStatus } from '@ayp/typings/entities';
import { CurrencyOption } from '@ayp/typings/ui';
import { fireGtmEvent } from '@ayp/utils';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Form, Formik, FormikHelpers } from 'formik';
import { GetServerSideProps } from 'next';
import { TFunction, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';

import { SecondaryAppLayout, SecondarySidebar } from '@components/commons';
import {
  CompanyOnboardingFormValues,
  mapToCompanyOnboardingFormValues,
  mapToRequestBody,
  validationSchema,
} from '@components/pages/company/onboarding/config';
import { ButtonSubmit, Stepper } from '@components/ui';
import { GTM_EVENTS } from '@configs/constants/gtm-events';
import { RedirectionError } from '@configs/errors';
import { COMPANY_DASHBOARD } from '@configs/routes';
import { CompanyApi } from '@services/apis/people';
import { getServerSideSession } from '@utils';

enum Page {
  COMPANY_INFORMATION = 0,
  COMPANY_INVOICING = 1,
  ONBOARDING_IN_REVIEW = 2,
}

const firstStep = Page.COMPANY_INFORMATION;
const lastStep = Page.ONBOARDING_IN_REVIEW;
const isFirstStep = (activeStep: number) => activeStep === firstStep;
const isLastStep = (activeStep: number) => activeStep === lastStep;

const getSteps = (t: TFunction) => [
  {
    label: t('companyInformation.label'),
  },
  {
    label: t('companyInvoicing.label'),
  },
  {
    label: t('onboardingInReview.label'),
  },
];

const getContentTexts = (t: TFunction) => [
  {
    title: (
      <Typography
        variant="h4"
        data-testid="companyOnboarding-stepInformation-title"
      >
        {t('companyInformation.title')}
      </Typography>
    ),
    description: (
      <Typography
        variant="subtitle1"
        data-testid="companyOnboarding-stepInformation-description"
      >
        {t('companyInformation.description')}
      </Typography>
    ),
  },
  {
    title: (
      <Typography
        variant="h4"
        data-testid="companyOnboarding-stepInvoicing-title"
      >
        {t('companyInvoicing.title')}
      </Typography>
    ),
    description: (
      <Typography
        variant="subtitle1"
        data-testid="companyOnboarding-stepInvoicing-description"
      >
        {t('companyInvoicing.description')}
      </Typography>
    ),
  },
  {
    title: <></>,
    description: <></>,
  },
];

const getSidebarTexts = (t: TFunction) => [
  {
    title: t('companyInformation.sidebar.title'),
    description: (
      <Box
        sx={{
          marginTop: '1rem',
        }}
      >
        <Typography>{t('companyInformation.sidebar.description')}</Typography>
      </Box>
    ),
  },
  {
    title: t('companyInvoicing.sidebar.title'),
    description: (
      <Box
        sx={{
          marginTop: '1rem',
        }}
      >
        <Typography>{t('companyInvoicing.sidebar.description')}</Typography>
      </Box>
    ),
  },
  {
    title: t('onboardingInReview.sidebar.title'),
    description: (
      <Box
        sx={{
          marginTop: '1rem',
        }}
      >
        <Typography>{t('onboardingInReview.sidebar.description')}</Typography>
      </Box>
    ),
  },
];

const DynamicCompanyInformationForm = dynamic(
  () => import('@components/pages/company/onboarding/company-information-form')
);

const DynamicCompanyInvoicingForm = dynamic(
  () => import('@components/pages/company/onboarding/company-invoicing-form')
);

const DynamicOnboardingInReview = dynamic(
  () => import('@components/pages/company/onboarding/onboarding-in-review')
);

const getFirstStep = (
  initialValues: CompanyOnboardingFormValues,
  companyStatus: CompanyStatus
): number => {
  if (companyStatus === CompanyStatus.ONBOARDING) {
    if (!initialValues.address?.addressLine) return Page.COMPANY_INFORMATION;

    return Page.COMPANY_INVOICING;
  }

  return Page.ONBOARDING_IN_REVIEW;
};

interface CompanyOnboardingProps {
  company: Company;
  currencies: CurrencyOption[];
}

const CompanyOnboarding: NextPage<CompanyOnboardingProps> =
  /* istanbul ignore next */
  // Doesn't necessary to test case currencies = []
  ({ session, company, isDesktop, currencies = [] }) => {
    const initialValues = mapToCompanyOnboardingFormValues(company, currencies);
    const { t } = useTranslation('company-onboarding');
    const [activeStep, setActiveStep] = useState(
      getFirstStep(initialValues, company.status)
    );

    const sidebarTexts = getSidebarTexts(t);
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
          dataTestId="companyOnboarding-stepper"
        />
      ),
      [t, activeStep, isDesktop]
    );

    const secondarySidebar = useMemo(
      () => (
        <SecondarySidebar
          title={sidebarTexts[activeStep].title}
          dataTestId="companyOnboarding-secondarySidebar"
        >
          <Typography
            variant="h4"
            textAlign="start"
            data-testid="companyOnboarding-secondarySidebar-description"
          >
            {' '}
            {sidebarTexts[activeStep].description}
          </Typography>
          {stepper}
        </SecondarySidebar>
      ),
      [stepper, activeStep, sidebarTexts]
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
          {!isFirstStep(activeStep) && (
            <Button
              variant="outlined"
              onClick={() => {
                fireGtmEvent<GTM_EVENTS>({
                  event: GTM_EVENTS.CLIENT_PORTAL_SELF_ONBOARDING_STEP2_BACK,
                });
                setActiveStep(activeStep - 1);
              }}
              sx={{
                paddingX: '2rem',
              }}
              data-testid="companyOnboarding-previousButton"
            >
              {t('common:previous')}
            </Button>
          )}
          <ButtonSubmit
            variant="contained"
            fullWidth={!isDesktop}
            sx={{
              paddingX: '2rem',
            }}
            data-testid={`companyOnboarding-${
              activeStep === Page.COMPANY_INVOICING ? 'complete' : 'next'
            }Button`}
          >
            {t(
              activeStep === Page.COMPANY_INVOICING
                ? 'companyInvoicing.completeOnboarding'
                : 'common:next'
            )}
          </ButtonSubmit>
        </Box>
      ),
      [t, activeStep, isDesktop]
    );

    const onSubmit = async (
      values: CompanyOnboardingFormValues,
      actions: FormikHelpers<CompanyOnboardingFormValues>
    ) => {
      await CompanyApi.update(
        session,
        Object.assign(
          {},
          mapToRequestBody(values),
          activeStep === Page.COMPANY_INVOICING && {
            status: CompanyStatus.IN_REVIEW,
          }
        )
      );

      fireGtmEvent<GTM_EVENTS>({
        event:
          activeStep === Page.COMPANY_INVOICING
            ? GTM_EVENTS.CLIENT_PORTAL_CREATE_SELF_ONBOARDING_STEP2_COMPLETE
            : GTM_EVENTS.CLIENT_PORTAL_CREATE_SELF_ONBOARDING_STEP1_COMPLETE,
      });

      setActiveStep(activeStep + 1);

      actions.setTouched({});
      actions.setFormikState((prev) => ({
        ...prev,
        submitCount: 0,
      }));
    };

    const getContent = () => {
      switch (activeStep) {
        case 0:
          return <DynamicCompanyInformationForm />;
        case 1:
          return <DynamicCompanyInvoicingForm currencies={currencies} />;
        case 2:
          return <DynamicOnboardingInReview isDesktop={isDesktop} />;
        /* istanbul ignore next */
        // Scenario never exists
        default:
          return <></>;
      }
    };

    const content = isLastStep(activeStep) ? (
      <Box display="flex" justifyContent="center">
        {getContent()}
      </Box>
    ) : (
      <Formik
        onSubmit={onSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema[activeStep]}
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
        dataTestId="companyOnboarding-secondaryAppLayout"
      >
        <Container maxWidth={false}>
          {!isDesktop && stepper}
          <Stack alignItems="center" spacing={1}>
            <Typography variant="h4" textAlign="center">
              {contentTexts[activeStep].title}
            </Typography>
            <Typography>{contentTexts[activeStep].description}</Typography>
          </Stack>
          {content}
        </Container>
      </SecondaryAppLayout>
    );
  };

export default CompanyOnboarding;

export const getServerSideProps: GetServerSideProps<
  CompanyOnboardingProps
> = async (context) => {
  try {
    const session = await getServerSideSession(context);
    const { company, currencies } = await CompanyApi.onboard(session);

    if (company.status === CompanyStatus.ACTIVE) {
      return {
        props: {},
        redirect: {
          permanent: false,
          destination: COMPANY_DASHBOARD.path,
        },
      };
    }

    return {
      props: {
        company,
        currencies: currencies.map((currency) => ({
          id: currency.id,
          label: currency.name,
          code: currency.code,
        })),
        ...(await serverSideTranslations(context.locale ?? 'en', [
          'common',
          'company-onboarding',
        ])),
      },
    };
  } catch (e) {
    if (e instanceof RedirectionError) {
      return e.redirect();
    }

    return {
      props: {} as CompanyOnboardingProps,
    };
  }
};
