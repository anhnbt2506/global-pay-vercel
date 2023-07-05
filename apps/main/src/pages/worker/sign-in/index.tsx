import { NextPage } from '@ayp/typings/commons';
import { fireGtmEvent, isErrorResponse } from '@ayp/utils';
import { Box, Container, Stack, Typography } from '@mui/material';
import { Form, Formik, FormikHelpers } from 'formik';
import type { GetServerSideProps } from 'next';
import { RedirectableProviderType } from 'next-auth/providers';
import { signIn } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { SecondaryAppLayout, SecondarySidebar } from '@components/commons';
import {
  initialValues,
  validationSchema,
  WorkerSignInFormValues,
  WorkerSignInPage,
} from '@components/pages/worker/sign-in/config';
import CtaButton from '@components/pages/worker/sign-in/cta-button';
import { Toast } from '@components/ui';
import { GTM_EVENTS } from '@configs/constants/gtm-events';
import { ERROR_NAMES } from '@configs/errors';
import { WORKER_SIGN_IN } from '@configs/routes';
import { AuthApi } from '@services/apis/people';

const DynamicSetPasswordForm = dynamic(
  () => import('@components/pages/worker/sign-in/set-password-form')
);

const DynamicWorkerSignInForm = dynamic(
  () => import('@components/pages/worker/sign-in/worker-sign-in-form')
);

const DynamicEmailValidationForm = dynamic(
  () => import('@components/pages/worker/sign-in/email-validation-form')
);

const DynamicEmailVerification = dynamic(
  () => import('@components/pages/worker/sign-in/email-verification')
);

const DynamicTokenExpired = dynamic(
  () => import('@components/pages/worker/sign-in/token-expired')
);

interface WorkerSignInWithLayoutProps {
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
    values: WorkerSignInFormValues,
    action: FormikHelpers<WorkerSignInFormValues>
  ) => void;
  action: Nullable<JSX.Element>;
  page: WorkerSignInPage;
}

const WorkerSignInWithLayout: FC<WorkerSignInWithLayoutProps> = ({
  content,
  isDesktop,
  title,
  description,
  secondarySidebarProps,
  email,
  action,
  onSubmit,
  page,
}) => {
  const secondarySidebar = useMemo(
    () => (
      <SecondarySidebar
        dataTestId="workerSignIn-sidebar"
        title={secondarySidebarProps.title}
      >
        <Box
          sx={{
            marginTop: '1rem',
          }}
        >
          <Typography
            data-testid="workerSignIn-sidebar-subtitle"
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
        {({ values }) => (
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
              <Stack alignItems="center" spacing={1}>
                <Typography
                  variant="h4"
                  textAlign="center"
                  data-testid="workerSignIn-title"
                >
                  {title}
                </Typography>
                <Typography
                  variant="subtitle1"
                  textAlign="center"
                  data-testid="workerSignIn-description"
                >
                  {description}
                </Typography>
                {page === WorkerSignInPage.SET_PASSWORD && values.email && (
                  <Typography
                    variant="subtitle1"
                    textAlign="center"
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    {values.email}
                  </Typography>
                )}
              </Stack>
              {content}
              {action}
            </Container>
          </Form>
        )}
      </Formik>
    </SecondaryAppLayout>
  );
};

interface WorkerSignInProps {
  isEmailVerified?: boolean;
  hasSetPassword?: boolean;
  email?: string;
}

const WorkerSignIn: NextPage<WorkerSignInProps> = ({
  isEmailVerified,
  hasSetPassword,
  email,
  isDesktop,
}) => {
  const router = useRouter();
  const { code, redirect } = router.query;
  const [toast, setToast] = useState<Toast>({});
  const { t } = useTranslation('worker-sign-in');

  const [currentPage, setCurrentPage] = useState<number>(
    WorkerSignInPage.EMAIL_VALIDATION
  );

  const onSubmit = useCallback(
    async (
      values: WorkerSignInFormValues,
      actions: FormikHelpers<WorkerSignInFormValues>
    ) => {
      switch (currentPage) {
        case WorkerSignInPage.EMAIL_VALIDATION:
          try {
            const data = await AuthApi.checkEmail({
              email: values.email,
              type: 'worker',
            });

            if (data.isEmailAllowedToLogin) {
              if (data.isEmailVerified) {
                if (data.hasSetPassword) {
                  setCurrentPage(WorkerSignInPage.LOGIN);
                } else {
                  setCurrentPage(WorkerSignInPage.SET_PASSWORD);
                }
              } else {
                setCurrentPage(WorkerSignInPage.EMAIL_VERIFICATION);
              }

              actions.setTouched({});
              actions.setFormikState((prev) => ({
                ...prev,
                submitCount: 0,
              }));
            } else {
              setToast({
                severity: 'error',
                message: t('form.email.error.unavailableAccess'),
              });
            }
          } catch (e) {
            if (isErrorResponse(e)) {
              setToast({
                severity: 'error',
                message: t('form.email.error.unavailableAccess'),
              });
            }
          }
          break;
        case WorkerSignInPage.SET_PASSWORD:
          try {
            await AuthApi.setPassword({
              email: values.email,
              password: values.password,
              type: 'worker',
            });

            setCurrentPage(WorkerSignInPage.LOGIN);
            setToast({
              severity: 'success',
              message: t('setPassword.form.password.success'),
            });

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
            }
          }
          break;
        case WorkerSignInPage.LOGIN:
          const data = await signIn<RedirectableProviderType>('credentials', {
            email: values.email,
            password: values.password,
            redirect: false,
          });

          if (data?.ok) {
            fireGtmEvent<GTM_EVENTS>({
              event: GTM_EVENTS.WORKER_PORTAL_LOGIN,
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
          break;
      }
    },
    [currentPage, redirect, t]
  );

  const content = useMemo(() => {
    switch (currentPage) {
      case WorkerSignInPage.EMAIL_VALIDATION:
        return <DynamicEmailValidationForm t={t} />;
      case WorkerSignInPage.EMAIL_VERIFICATION:
        return <DynamicEmailVerification t={t} isDesktop={isDesktop} />;
      case WorkerSignInPage.SET_PASSWORD:
        return <DynamicSetPasswordForm t={t} />;
      case WorkerSignInPage.LOGIN:
        return <DynamicWorkerSignInForm t={t} />;
      case WorkerSignInPage.EMAIL_VERIFICATION_TOKEN_EXPIRED:
        return (
          <DynamicTokenExpired
            t={t}
            isDesktop={isDesktop}
            onHandleLogin={() => {
              setCurrentPage(WorkerSignInPage.EMAIL_VALIDATION);
              router.push(WORKER_SIGN_IN.path);
            }}
          />
        );
      /* istanbul ignore next */
      // Scenario never exists
      default:
        return <></>;
    }
  }, [currentPage, isDesktop, router, t]);

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
      case WorkerSignInPage.EMAIL_VALIDATION:
        return commonLayoutProps;
      case WorkerSignInPage.LOGIN:
        return commonLayoutProps;
      case WorkerSignInPage.EMAIL_VERIFICATION:
        return {
          title: '',
          description: '',
          secondarySidebarProps: {
            title: t('emailVerification.sidebar.title'),
            subtitle: t('emailVerification.sidebar.subtitle'),
          },
        };
      case WorkerSignInPage.SET_PASSWORD:
        return {
          title: t('setPassword.title'),
          description: t('setPassword.description'),
          secondarySidebarProps: {
            title: t('setPassword.sidebar.title'),
            subtitle: t('setPassword.sidebar.subtitle'),
          },
        };
      case WorkerSignInPage.EMAIL_VERIFICATION_TOKEN_EXPIRED:
        return {
          title: '',
          description: '',
          secondarySidebarProps: {
            title: t('tokenExpired.sidebar.title'),
            subtitle: t('tokenExpired.sidebar.subtitle'),
          },
        };
      /* istanbul ignore next */
      // Scenario never exists
      default:
        return commonLayoutProps;
    }
  }, [commonLayoutProps, currentPage, t]);

  const renderCtaButton = useMemo(() => {
    switch (currentPage) {
      case WorkerSignInPage.EMAIL_VERIFICATION:
        return null;
      case WorkerSignInPage.EMAIL_VERIFICATION_TOKEN_EXPIRED:
        return null;
      default:
        return (
          <CtaButton
            isDesktop={isDesktop}
            actionName={
              currentPage === WorkerSignInPage.LOGIN
                ? t('common:login')
                : t('common:next')
            }
          />
        );
    }
  }, [currentPage, isDesktop, t]);

  useEffect(() => {
    if (code) {
      if (!isEmailVerified) {
        setCurrentPage(WorkerSignInPage.EMAIL_VERIFICATION_TOKEN_EXPIRED);
      } else {
        if (hasSetPassword) {
          setCurrentPage(WorkerSignInPage.LOGIN);
        } else {
          setCurrentPage(WorkerSignInPage.SET_PASSWORD);
        }
        setToast({
          severity: 'success',
          message: t('emailVerification.success'),
        });
      }
    }
  }, [t, code, router, hasSetPassword, isEmailVerified]);

  return (
    <>
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        dataTestId="workerSignIn-toast"
        onClose={() => setToast({ message: '' })}
      >
        {toast.message}
      </Toast>
      <WorkerSignInWithLayout
        {...getLayoutProps}
        email={email}
        content={content}
        onSubmit={onSubmit}
        isDesktop={isDesktop}
        action={renderCtaButton}
        page={currentPage}
      />
    </>
  );
};

export default WorkerSignIn;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { code } = context.query;
    const translations = await serverSideTranslations(context.locale ?? 'en', [
      'common',
      'worker-sign-in',
      'password-criteria',
    ]);

    if (code) {
      if (typeof code !== 'string')
        return {
          redirect: {
            permanent: false,
            destination: WORKER_SIGN_IN.path,
          },
        };

      try {
        const { isEmailVerified, hasSetPassword, email } =
          await AuthApi.verifyEmail({
            type: 'worker',
            verificationCode: code,
          });

        return {
          props: {
            isEmailVerified,
            hasSetPassword,
            email,
            ...translations,
          },
        };
      } catch (e) {
        if (isErrorResponse(e)) {
          if (e.error.name === ERROR_NAMES.VERIFICATION_LINK_EXPIRED) {
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
            destination: WORKER_SIGN_IN.path,
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
      props: {} as WorkerSignInProps,
    };
  }
};
