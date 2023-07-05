import { NextPage } from '@ayp/typings/commons';
import { CountryOption } from '@ayp/typings/ui';
import { fireGtmEvent, isErrorResponse } from '@ayp/utils';
import { Box, Container, Stack, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { TFunction, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { parseCookies } from 'nookies';
import { FC, useMemo, useState } from 'react';

import { SecondaryAppLayout, SecondarySidebar } from '@components/commons';
import {
  CreateCompanyAccountFormValues,
  initialValues,
  validationSchema,
} from '@components/commons/create-company-account-form/config';
import {
  CompanySignUpPage,
  mapToRequestBody,
} from '@components/pages/company/sign-up/config';
import CtaButton from '@components/pages/company/sign-up/cta-button';
import { Link, Toast } from '@components/ui';
import { GLOBAL_PAY_CORPORATE_URL } from '@configs/constants';
import { RedirectionError } from '@configs/errors';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { COMPANY_SIGN_IN } from '@configs/routes';
import { AuthApi, CountryApi } from '@services/apis/people';
import { withNonce } from '@utils';
import { GTM_EVENTS } from '@configs/constants/gtm-events';

const DynamicEmailVerification = dynamic(
  () => import('@components/pages/company/sign-up/email-verification')
);

const DynamicCreateAccountForm = dynamic(
  () =>
    import(
      '@components/commons/create-company-account-form/create-company-account-form'
    )
);

interface CompanySignUpProps {
  countries: CountryOption[];
}

const CompanySignUp: NextPage<CompanySignUpProps> = ({
  nonce,
  isDesktop,
  countries,
}) => {
  const { t } = useTranslation('company-sign-up');
  const [toast, setToast] = useState<Toast>({});
  const [currentPage, setCurrentPage] = useState<number>(
    CompanySignUpPage.CREATE_ACCOUNT
  );
  interface CompanySignUpLayoutProps {
    content: JSX.Element;
    isDesktop: boolean;
    title: string;
    description: string;
    secondarySidebarProps: {
      title: string;
      subtitle: string;
      description?: string;
      learnMore?: string;
    };
    onSubmit: (values: CreateCompanyAccountFormValues) => void;
    action: Nullable<JSX.Element>;
    page: CompanySignUpPage;
    t: TFunction;
  }

  const CompanySignUpWithLayout: FC<CompanySignUpLayoutProps> = ({
    content,
    isDesktop,
    title,
    description,
    secondarySidebarProps,
    action,
    onSubmit,
    page,
    t,
  }) => {
    const secondarySidebar = useMemo(
      () => (
        <SecondarySidebar
          dataTestId="companySignUp-sidebar"
          title={secondarySidebarProps.title}
        >
          <Box
            sx={{
              marginTop: '1rem',
            }}
          >
            <Typography
              data-testid="companySignUp-sidebar-subtitle"
              sx={{
                marginBottom: '1rem',
              }}
            >
              {secondarySidebarProps.subtitle}
            </Typography>
            <Typography data-testid="companySignUp-description">
              {secondarySidebarProps.description ?? null}{' '}
              <Link href={GLOBAL_PAY_CORPORATE_URL} external newTab>
                {secondarySidebarProps.learnMore ?? null}
              </Link>
            </Typography>
          </Box>
        </SecondarySidebar>
      ),
      [
        secondarySidebarProps.description,
        secondarySidebarProps.learnMore,
        secondarySidebarProps.subtitle,
        secondarySidebarProps.title,
      ]
    );

    return (
      <SecondaryAppLayout
        isDesktop={isDesktop}
        secondarySidebar={secondarySidebar}
      >
        <Formik
          onSubmit={onSubmit}
          initialValues={Object.assign({}, initialValues)}
          validationSchema={validationSchema}
        >
          <Form noValidate>
            <Container
              maxWidth={false}
              sx={{
                display: 'flex',
                paddingY: '2rem',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Stack alignItems="center" spacing={1} marginBottom="1rem">
                <Typography
                  variant="h4"
                  textAlign="center"
                  data-testid="companySignUp-title"
                >
                  {title}
                </Typography>
                <Typography
                  variant="subtitle1"
                  textAlign="center"
                  data-testid="companySignUp-description"
                >
                  {description}{' '}
                  {page !== CompanySignUpPage.EMAIL_VERIFICATION && (
                    <Link href={COMPANY_SIGN_IN.path}>
                      <b>{t('login')}</b>
                    </Link>
                  )}
                </Typography>
              </Stack>
              <Stack alignItems="center">
                {content}
                {action}
              </Stack>
            </Container>
          </Form>
        </Formik>
      </SecondaryAppLayout>
    );
  };

  const content = useMemo(() => {
    switch (currentPage) {
      case CompanySignUpPage.CREATE_ACCOUNT:
        return <DynamicCreateAccountForm t={t} countries={countries} />;
      case CompanySignUpPage.EMAIL_VERIFICATION:
        return <DynamicEmailVerification t={t} isDesktop={isDesktop} />;
      /* istanbul ignore next */
      // Scenario never exists
      default:
        return <></>;
    }
  }, [countries, currentPage, isDesktop, t]);

  const renderCtaButton = useMemo(() => {
    switch (currentPage) {
      case CompanySignUpPage.EMAIL_VERIFICATION:
        return null;
      default:
        return <CtaButton t={t} isDesktop={isDesktop} />;
    }
  }, [currentPage, isDesktop, t]);

  const commonLayoutProps = useMemo(
    () => ({
      title: t('createNewAccount'),
      description: t('alreadyHaveAccount'),
      secondarySidebarProps: {
        title: t('sidebar.title'),
        subtitle: t('sidebar.subtitle'),
        description: t('sidebar.description'),
        learnMore: t('sidebar.learnMore'),
      },
    }),
    [t]
  );

  const getLayoutProps = useMemo(() => {
    switch (currentPage) {
      case CompanySignUpPage.CREATE_ACCOUNT:
        return commonLayoutProps;
      case CompanySignUpPage.EMAIL_VERIFICATION:
        return {
          title: '',
          description: '',
          secondarySidebarProps: {
            title: t('emailVerification.sidebar.title'),
            subtitle: t('emailVerification.sidebar.subtitle'),
          },
        };
      /* istanbul ignore next */
      // Scenario never exists
      default:
        return commonLayoutProps;
    }
  }, [commonLayoutProps, currentPage, t]);

  const onSubmit = async (values: CreateCompanyAccountFormValues) => {
    try {
      const cookies = parseCookies();
      const { cognitoId } = await AuthApi.register(
        mapToRequestBody(values, cookies.hubspotutk)
      );
      if (cognitoId) {
        setCurrentPage(CompanySignUpPage.EMAIL_VERIFICATION);

        fireGtmEvent<GTM_EVENTS>({
          event: GTM_EVENTS.CLIENT_PORTAL_CREATE_ACCOUNT,
        });
      }
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

  return (
    <>
      {/* <!-- Start of HubSpot Embed Code --> */}
      <Script
        async
        defer
        nonce={nonce}
        id="hs-script-loader"
        type="text/javascript"
        src="//js.hs-scripts.com/8848284.js"
      />
      {/* <!-- End of HubSpot Embed Code --> */}

      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId={'companySignUp-toast'}
      >
        {toast.message}
      </Toast>
      <CompanySignUpWithLayout
        {...getLayoutProps}
        content={content}
        onSubmit={onSubmit}
        isDesktop={isDesktop}
        action={renderCtaButton}
        page={currentPage}
        t={t}
      />
    </>
  );
};

export default CompanySignUp;

export const getServerSideProps = withNonce<CompanySignUpProps>(
  async ({ locale = 'en' }) => {
    try {
      const { countries } = await CountryApi.getCountries();

      return {
        props: {
          countries: countries.map((country) => ({
            id: country.id,
            label: country.name,
            code: country.code,
          })),
          ...(await serverSideTranslations(locale, [
            'common',
            'company-sign-up',
            'company-interest',
            'create-company-account-form',
            'password-criteria',
          ])),
        },
      };
    } catch (e) {
      if (e instanceof RedirectionError) {
        return e.redirect();
      }

      return {
        props: {} as CompanySignUpProps,
      };
    }
  }
);
