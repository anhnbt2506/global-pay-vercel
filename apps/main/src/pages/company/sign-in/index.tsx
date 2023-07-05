import { NextPage } from '@ayp/typings/commons';
import { fireGtmEvent, isErrorResponse } from '@ayp/utils';
import { Box, Container, Stack, Typography } from '@mui/material';
import { Form, Formik, FormikHelpers } from 'formik';
import type { GetServerSideProps } from 'next';
import { RedirectableProviderType } from 'next-auth/providers';
import { signIn } from 'next-auth/react';
import { TFunction, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { SecondaryAppLayout, SecondarySidebar } from '@components/commons';
import {
  CompanySignInFormValues,
  CompanySignInPage,
  initialValues,
  validationSchema,
} from '@components/pages/company/sign-in/config';
import CtaButton from '@components/pages/company/sign-in/cta-button';
import { Link, Toast } from '@components/ui';
import { GTM_EVENTS } from '@configs/constants/gtm-events';
import { ERROR_NAMES } from '@configs/errors';
import { COMPANY_SIGN_IN, COMPANY_SIGN_UP } from '@configs/routes';
import { AuthApi } from '@services/apis/people';

const DynamicCompanySignInForm = dynamic(
  () => import('@components/pages/company/sign-in/company-sign-in-form')
);

const DynamicEmailValidationForm = dynamic(
  () => import('@components/pages/company/sign-in/email-validation-form')
);

const DynamicEmailVerification = dynamic(
  () => import('@components/pages/company/sign-in/email-verification')
);

interface CompanySignInLayoutProps {
  content: JSX.Element;
  isDesktop: boolean;
  title: string;
  description: string;
  secondarySidebarProps: {
    title: string;
    subtitle: string;
  };
  email?: string;
  onSubmit: (
    values: CompanySignInFormValues,
    action: FormikHelpers<CompanySignInFormValues>
  ) => void;
  action: Nullable<JSX.Element>;
  page: CompanySignInPage;
  t: TFunction;
}

const CompanySignInWithLayout: FC<CompanySignInLayoutProps> = ({
  content,
  isDesktop,
  title,
  description,
  secondarySidebarProps,
  email,
  action,
  onSubmit,
  page,
  t,
}) => {
  const secondarySidebar = useMemo(
    () => (
      <SecondarySidebar
        dataTestId="companySignIn-sidebar"
        title={secondarySidebarProps.title}
      >
        <Box
          sx={{
            marginTop: '1rem',
          }}
        >
          <Typography
            data-testid="companySignIn-sidebar-subtitle"
            sx={{
              marginBottom: '1rem',
            }}
          >
            {secondarySidebarProps.subtitle}
          </Typography>
        </Box>
      </SecondarySidebar>
    ),
    [secondarySidebarProps.subtitle, secondarySidebarProps.title]
  );

  return (
    <SecondaryAppLayout
      isDesktop={isDesktop}
      secondarySidebar={secondarySidebar}
    >
      <Formik
        onSubmit={onSubmit}
        initialValues={Object.assign({}, initialValues, email && { email })}
        validationSchema={validationSchema[page]}
      >
        <Form>
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
                data-testid="companySignIn-title"
              >
                {title}
              </Typography>
              <Typography
                variant="subtitle1"
                textAlign="center"
                data-testid="companySignIn-description"
                marginY="1rem"
              >
                {description}{' '}
                {page !== CompanySignInPage.EMAIL_VERIFICATION && (
                  <Link href={COMPANY_SIGN_UP.path}>
                    <b>{t('signUpNow')}</b>
                  </Link>
                )}
              </Typography>
            </Stack>
            {content}
            {action}
          </Container>
        </Form>
      </Formik>
    </SecondaryAppLayout>
  );
};

interface CompanySignInProps {
  isEmailVerified?: boolean;
  email?: string;
}

const CompanySignIn: NextPage<CompanySignInProps> = ({
  isEmailVerified,
  email,
  isDesktop,
}) => {
  const router = useRouter();
  const { code, redirect } = router.query;
  const { t } = useTranslation('company-sign-in');
  const [toast, setToast] = useState<Toast>({});

  const [currentPage, setCurrentPage] = useState<number>(
    CompanySignInPage.EMAIL_VALIDATION
  );

  const checkEmailToShowVerification = async (email: string, type: string) => {
    const { isEmailVerified } = await AuthApi.checkEmail({
      email: email,
      type: type,
    });
    if (!isEmailVerified) {
      setCurrentPage(CompanySignInPage.EMAIL_VERIFICATION);
    }
    return isEmailVerified;
  };

  const onSubmit = useCallback(
    async (
      values: CompanySignInFormValues,
      actions: FormikHelpers<CompanySignInFormValues>
    ) => {
      switch (currentPage) {
        case CompanySignInPage.EMAIL_VALIDATION:
          try {
            if (!(await checkEmailToShowVerification(values.email, 'company')))
              return;
            return setCurrentPage(CompanySignInPage.LOGIN);
          } catch (e) {
            if (isErrorResponse(e)) {
              setToast({
                severity: 'error',
                message: t('form.email.error.unavailableAccess'),
              });
            }
          }
          break;
        case CompanySignInPage.LOGIN:
          if (!(await checkEmailToShowVerification(values.email, 'company')))
            return;

          const { email, password } = values;
          const data = await signIn<RedirectableProviderType>('credentials', {
            email,
            password,
            redirect: false,
          });

          if (data?.ok) {
            fireGtmEvent<GTM_EVENTS>({
              event: GTM_EVENTS.CLIENT_PORTAL_LOGIN,
            });
          }

          if (!data?.ok) {
            actions.setErrors({
              password: t('form.password.error'),
            });
          } else if (redirect && typeof redirect === 'string') {
            window.location.replace(redirect);
          } else {
            window.location.reload();
          }
        default:
          break;
      }
    },
    [currentPage, redirect, t]
  );

  const content = useMemo(() => {
    switch (currentPage) {
      case CompanySignInPage.EMAIL_VALIDATION:
        return <DynamicEmailValidationForm t={t} />;
      case CompanySignInPage.EMAIL_VERIFICATION:
        return <DynamicEmailVerification t={t} isDesktop={isDesktop} />;
      case CompanySignInPage.LOGIN:
        return <DynamicCompanySignInForm t={t} />;
      /* istanbul ignore next */
      // Scenario never exists
      default:
        return <></>;
    }
  }, [currentPage, isDesktop, t]);

  const renderCtaButton = useMemo(() => {
    switch (currentPage) {
      case CompanySignInPage.EMAIL_VERIFICATION:
        return null;
      default:
        return (
          <CtaButton
            isDesktop={isDesktop}
            actionName={
              currentPage === CompanySignInPage.LOGIN
                ? t('common:login')
                : t('common:next')
            }
          />
        );
    }
  }, [currentPage, isDesktop, t]);

  const commonLayoutProps = useMemo(
    () => ({
      title: t('title'),
      description: t('description'),
      secondarySidebarProps: {
        title: t('sidebar.title'),
        subtitle: t('sidebar.subtitle'),
      },
    }),
    [t]
  );

  const getLayoutProps = useMemo(() => {
    switch (currentPage) {
      case CompanySignInPage.EMAIL_VALIDATION:
        return commonLayoutProps;
      case CompanySignInPage.LOGIN:
        return commonLayoutProps;
      case CompanySignInPage.EMAIL_VERIFICATION:
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

  useEffect(() => {
    if (code) {
      if (!isEmailVerified) {
        setCurrentPage(CompanySignInPage.LOGIN);
        setToast({
          severity: 'error',
          message: t('emailVerification.tokenExpired'),
        });
      } else {
        setCurrentPage(CompanySignInPage.LOGIN);
        setToast({
          severity: 'success',
          message: t('emailVerification.success'),
        });
      }
    }
  }, [code, isEmailVerified, t]);

  return (
    <>
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        dataTestId="companySignIn-toast"
        onClose={() => setToast({ message: '' })}
      >
        {toast.message}
      </Toast>
      <CompanySignInWithLayout
        {...getLayoutProps}
        email={email}
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

export default CompanySignIn;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { code } = context.query;
    const translations = await serverSideTranslations(context.locale ?? 'en', [
      'common',
      'company-sign-in',
      'password-criteria',
    ]);

    if (code) {
      if (typeof code !== 'string')
        return {
          redirect: {
            permanent: false,
            destination: COMPANY_SIGN_IN.path,
          },
        };

      try {
        const { isEmailVerified, email } = await AuthApi.verifyEmail({
          type: 'company',
          verificationCode: code,
        });
        return {
          props: {
            isEmailVerified,
            email,
            ...translations,
          },
        };
      } catch (e) {
        if (isErrorResponse(e)) {
          if (
            e.error.name === ERROR_NAMES.VERIFICATION_LINK_INVALID ||
            e.error.name === ERROR_NAMES.VERIFICATION_LINK_EXPIRED
          ) {
            return {
              props: {
                ...translations,
              },
            };
          }
        }

        return {
          redirect: {
            permanent: false,
            destination: COMPANY_SIGN_IN.path,
          },
        };
      }
    }

    return {
      props: {
        ...translations,
      },
    };
  } catch (e) {
    return {
      props: {} as CompanySignInProps,
    };
  }
};
