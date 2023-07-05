import { NextPage } from '@ayp/typings/commons';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { Form, Formik, FormikHelpers } from 'formik';
import type { GetServerSideProps } from 'next';
import { RedirectableProviderType } from 'next-auth/providers';
import { signIn } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { SecondaryAppLayout, SecondarySidebar } from '@components/commons';
import {
  initialValues,
  StaffSignInFormValues,
  validationSchema,
} from '@components/pages/staff/sign-in/config';
import { ButtonSubmit, TextField } from '@components/ui';

const StaffSignIn: NextPage = ({ isDesktop }) => {
  const { t } = useTranslation('staff-sign-in');
  const router = useRouter();
  const { redirect } = router.query;

  const secondarySidebar = useMemo(
    () => (
      <SecondarySidebar
        dataTestId="staffSignIn-sidebar"
        title={t('sidebar.title')}
      >
        <Box
          sx={{
            marginTop: '1rem',
          }}
        >
          <Typography
            sx={{
              marginBottom: '1rem',
            }}
            data-testid="staffSignIn-sidebar-subtitle"
          >
            {t('sidebar.subtitle')}
          </Typography>
        </Box>
      </SecondarySidebar>
    ),
    [t]
  );

  const ctaButtons = useMemo(
    () => (
      <Box
        display="flex"
        marginY="1rem"
        justifyContent="center"
        flexDirection={isDesktop ? 'row' : 'column'}
      >
        <ButtonSubmit
          variant="contained"
          fullWidth={!isDesktop}
          sx={{
            paddingX: '3rem',
          }}
          data-testid="staffSignIn-submitButton"
        >
          {t('common:login')}
        </ButtonSubmit>
      </Box>
    ),
    [t, isDesktop]
  );

  const onSubmit = async (
    values: StaffSignInFormValues,
    actions: FormikHelpers<StaffSignInFormValues>
  ) => {
    const { email, password } = values;

    const data = await signIn<RedirectableProviderType>('credentials', {
      email,
      password,
      redirect: false,
    });

    if (!data?.ok) {
      actions.setErrors({
        password: t('form.password.error'),
      });
    } else if (redirect && typeof redirect === 'string') {
      window.location.replace(redirect);
    } else {
      window.location.reload();
    }
  };

  const form = (
    <Formik
      onSubmit={onSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      <Form noValidate>
        <Box display="flex" justifyContent="center" marginY="3rem">
          <Grid container spacing={4} maxWidth="sm">
            <Grid item xs={12}>
              <TextField
                required
                name="email"
                label={t('form.email.label')}
                dataTestId="staffSignIn-emailField"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                type="password"
                name="password"
                withFieldVisibility
                label={t('form.password.label')}
                dataTestId="staffSignIn-passwordField"
              />
            </Grid>
          </Grid>
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
            data-testid="staffSignIn-title"
            variant="h4"
            textAlign="center"
          >
            {t('title')}
          </Typography>
          <Typography
            data-testid="staffSignIn-description"
            variant="subtitle1"
            textAlign="center"
          >
            {t('description')}
          </Typography>
        </Stack>
        {form}
      </Container>
    </SecondaryAppLayout>
  );
};

export default StaffSignIn;

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'staff-sign-in'])),
  },
});
