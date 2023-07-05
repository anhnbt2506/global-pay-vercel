import {
  NextPage,
  SelectedUserContext,
  UserSession,
} from '@ayp/typings/commons';
import { WorkerEmploymentCompany } from '@ayp/typings/entities';
import { fireGtmEvent } from '@ayp/utils';
import { HomeWork as HomeWorkIcon } from '@mui/icons-material';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import type { GetServerSideProps } from 'next';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { AppLayout } from '@components/commons';
import { validationSchema } from '@components/pages/worker/home/config';
import { ButtonSubmit, Select } from '@components/ui';
import { GTM_EVENTS } from '@configs/constants/gtm-events';
import { RedirectionError } from '@configs/errors';
import { WorkerUserApi } from '@services/apis/people';
import { getServerSideSession } from '@utils';

const SelectCompanyDialog: FC<{
  companies: WorkerEmploymentCompany[];
  session: UserSession;
  onClose: VoidFunction;
  handleUpdateSession: (
    session: UserSession,
    company: WorkerEmploymentCompany
  ) => Promise<Session | null>;
}> = ({ companies, session, onClose, handleUpdateSession }) => {
  const { t } = useTranslation('worker-home');

  const workerEmploymentCompanyOptions = useMemo(
    () =>
      companies.map((company) => ({
        id: company.companyId,
        label: `${company.companyName} - ${company.countryName}`,
      })),
    [companies]
  );

  /* istanbul ignore next */
  // this function has been run through
  const onSubmit = async ({
    companyId: newCompanyId,
  }: {
    companyId: string;
  }) => {
    try {
      const company = companies.find(
        ({ companyId }) => companyId === newCompanyId
      );

      if (!company) return;

      await handleUpdateSession(session, company);
      fireGtmEvent<GTM_EVENTS>({
        event: GTM_EVENTS.WORKER_PORTAL_EMPLOYMENT_SWITCH_CONFIRM,
      });
      onClose();
      window.location.reload();
    } catch (e) {
      console.log(e);
      return;
    }
  };

  return (
    <Dialog open fullWidth maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          paddingX: '2rem',
          paddingTop: '2rem',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h6"> {t('selectProfile.title')}</Typography>
        <Typography variant="subtitle1" align="center">
          {t('selectProfile.description')}
        </Typography>
      </Box>
      <DialogContent
        sx={{
          paddingBottom: '2rem',
        }}
      >
        <Formik
          onSubmit={onSubmit}
          initialValues={{ companyId: '' }}
          validationSchema={validationSchema}
        >
          <Form
            style={{
              gap: '1rem',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
            noValidate
          >
            <Select
              required
              name="companyId"
              options={workerEmploymentCompanyOptions}
              label={t('selectProfile.form.label')}
              helperText={t('selectProfile.form.helperText')}
              dataTestId="workerHome-companySelectField"
            />
            <Box
              sx={{
                marginTop: '1rem',
                gap: '2rem',
                display: 'flex',
                justifyContent: 'space-around',
              }}
            >
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{
                  paddingX: '3rem',
                }}
                data-testid="workerHome-cancelButton"
              >
                {t('common:cancel')}
              </Button>
              <ButtonSubmit
                variant="contained"
                sx={{
                  paddingX: '3rem',
                }}
                data-testid="workerHome-confirmButton"
              >
                {t('common:confirm')}
              </ButtonSubmit>
            </Box>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

interface WorkerHomeProps {
  companies: WorkerEmploymentCompany[];
}

const WorkerHome: NextPage<WorkerHomeProps> = ({
  session,
  isDesktop,
  companies,
}) => {
  const { t } = useTranslation('worker-home');
  const { update } = useSession();

  const [showSelectCompany, setShowSelectCompany] = useState(false);
  const [selectedCompany, setSelectedCompany] =
    useState<Nullable<WorkerEmploymentCompany>>(null);

  const handleUpdateSession = useCallback(
    (session: UserSession, company: WorkerEmploymentCompany) => {
      const role = session?.user?.userContexts.find(
        (userContext) => userContext.userContextId === company.userContextId
      )?.role;

      const selectedUserContext: SelectedUserContext = {
        role,
        userContextId: company.userContextId,
        contextEmploymentId: company.employmentId,
        contextCompanyName: company.companyName,
      };

      return update(selectedUserContext);
    },
    [update]
  );

  useEffect(() => {
    let company = null;

    /* istanbul ignore else */
    // This case cannot reproduce
    if (session?.user?.selectedUserContext?.userContextId) {
      company =
        companies.find(
          ({ userContextId }) =>
            userContextId === session?.user?.selectedUserContext.userContextId
        ) ??
        /* istanbul ignore next */
        // This case is not necessary to test
        null;
    }

    setSelectedCompany(company);
  }, [companies, session?.user.selectedUserContext]);

  return (
    <AppLayout
      sx={{
        padding: 0,
      }}
      isDesktop={isDesktop}
      pageName={t('pageName')}
      dataTestId="workerHome-appLayout"
    >
      <Box
        sx={(theme) => ({
          width: '30%',
          margin: 'auto',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          [theme.breakpoints.down('md')]: {
            width: '70%',
          },
        })}
      >
        <HomeWorkIcon
          sx={{
            fontSize: '8rem',
          }}
          color="primary"
        />

        <Typography
          variant="h6"
          sx={{
            margin: ' 20px 0',
          }}
          data-testid={
            selectedCompany
              ? 'workerHome-title-withCompanyInfo'
              : 'workerHome-title-default'
          }
        >
          {selectedCompany
            ? t('titleWithCompanyInfo', {
                companyName: selectedCompany.companyName,
                countryName: selectedCompany.countryName,
              })
            : t('title')}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          data-testid="workerHome-description"
        >
          {t('description')}
        </Typography>
        <Button
          variant="contained"
          sx={{
            paddingX: '3rem',
            margin: ' 20px 0',
          }}
          onClick={() => {
            setShowSelectCompany(true);
            fireGtmEvent<GTM_EVENTS>({
              event: GTM_EVENTS.WORKER_PORTAL_EMPLOYMENT_SWITCH,
            });
          }}
          data-testid="workerHome-switchButton"
        >
          {t('common:switch')}
        </Button>
        {showSelectCompany && (
          <SelectCompanyDialog
            companies={companies}
            session={session}
            onClose={() => {
              fireGtmEvent<GTM_EVENTS>({
                event: GTM_EVENTS.WORKER_PORTAL_EMPLOYMENT_SWITCH_CANCEL,
              });
              setShowSelectCompany(false);
            }}
            handleUpdateSession={handleUpdateSession}
          />
        )}
      </Box>
    </AppLayout>
  );
};

export default WorkerHome;

export const getServerSideProps: GetServerSideProps<WorkerHomeProps> = async (
  context
) => {
  try {
    const session = await getServerSideSession(context);
    const { companies } = await WorkerUserApi.getEmploymentCompanies(session);

    if (session?.user?.selectedUserContext) {
      await WorkerUserApi.getHome(session);
    }

    return {
      props: {
        companies,
        ...(await serverSideTranslations(context.locale ?? 'en', [
          'common',
          'worker-home',
        ])),
      },
    };
  } catch (e) {
    if (e instanceof RedirectionError) {
      return e.redirect();
    }

    return {
      props: {} as WorkerHomeProps,
    };
  }
};
