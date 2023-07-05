import { NextPage } from '@ayp/typings/commons';
import { Agreement, HireStatus, WorkerEmployment } from '@ayp/typings/entities';
import { fireGtmEvent, isErrorResponse } from '@ayp/utils';
import { Button, Container } from '@mui/material';
import { Form, Formik, FormikHelpers } from 'formik';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';

import { SecondaryAppLayout, SecondarySidebar } from '@components/commons';
import {
  EmploymentContractFormValues,
  initialValues,
  validationSchema,
} from '@components/pages/worker/employment-contract/configs';
import { ButtonSubmit, Toast } from '@components/ui';
import { GTM_EVENTS } from '@configs/constants/gtm-events';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { WORKER_HOME } from '@configs/routes';
import { Box } from '@mui/system';
import { AgreementApi, WorkerEmploymentApi } from '@services/apis/people';
import { getServerSideSession } from '@utils';

const DynamicWorkerContactForm = dynamic(
  () =>
    import('@components/pages/worker/employment-contract/worker-contract-form')
);

const DynamicInReview = dynamic(
  () => import('@components/pages/worker/employment-contract/in-review-form')
);

interface WorkerEmploymentContractFormProps {
  workerEmployment: Pick<
    WorkerEmployment,
    'workerUser' | 'company' | 'workerAddendumFiles'
  >;
  agreement: Agreement;
}

enum WorkerContactPage {
  WORKER_CONTRACT,
  IN_REVIEW,
}

const WorkerEmploymentContract: NextPage<WorkerEmploymentContractFormProps> = ({
  session,
  isDesktop,
  workerEmployment,
  agreement,
}) => {
  const { t } = useTranslation('employment-contract');
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(
    WorkerContactPage.WORKER_CONTRACT
  );
  const [toast, setToast] = useState<Toast>({});

  const secondarySidebar = useMemo(
    () => (
      <SecondarySidebar title={t('sideBar.title')}>
        {t('sideBar.description', {
          companyName: workerEmployment.company.name,
        })}
      </SecondarySidebar>
    ),
    [t, workerEmployment]
  );

  const getContent = () => {
    switch (activeStep) {
      case WorkerContactPage.WORKER_CONTRACT:
        return (
          <DynamicWorkerContactForm
            workerUser={workerEmployment.workerUser}
            content={agreement.content}
            dataTestId="workerEmploymentContract-form"
            session={session}
            workerAddendumFiles={workerEmployment?.workerAddendumFiles ?? []}
            setToast={setToast}
          />
        );
      case WorkerContactPage.IN_REVIEW:
        return (
          <DynamicInReview
            isDesktop={isDesktop}
            agreementId={agreement.agreementId}
            companyName={workerEmployment.company.name ?? ''}
            dataTestId="workerEmploymentContract-inReview"
          />
        );
    }
  };

  const ctaButtons = useMemo(
    () => (
      <Box
        display="flex"
        marginY="1rem"
        gap={`${isDesktop ? 4 : 1}rem`}
        flexDirection={isDesktop ? 'row' : 'column'}
        justifyContent={isDesktop ? 'center' : 'space-around'}
      >
        {activeStep === WorkerContactPage.WORKER_CONTRACT && (
          <>
            <Button
              variant="outlined"
              onClick={() => {
                fireGtmEvent<GTM_EVENTS>({
                  event: GTM_EVENTS.WORKER_PORTAL_CONTRACT_REVIEW_LATER,
                });
                router.push(WORKER_HOME.path);
              }}
              data-testid="workerEmploymentContract-button-reviewLater"
              sx={{
                paddingX: '2rem',
              }}
            >
              {t('reviewLater')}
            </Button>

            <ButtonSubmit
              variant="contained"
              fullWidth={!isDesktop}
              sx={{
                paddingX: '2rem',
              }}
              data-testid="workerEmploymentContract-button-submit"
            >
              {t('proceedToSign')}
            </ButtonSubmit>
          </>
        )}
      </Box>
    ),
    [t, activeStep, isDesktop, router]
  );

  const onSubmit = async (
    values: EmploymentContractFormValues,
    actions: FormikHelpers<EmploymentContractFormValues>
  ) => {
    try {
      const contextEmploymentId =
        session?.user.selectedUserContext.contextEmploymentId;

      /* istanbul ignore else */
      // this case cannot be tested
      if (contextEmploymentId) {
        await WorkerEmploymentApi.signAgreement(session, contextEmploymentId);
        fireGtmEvent<GTM_EVENTS>({
          event: GTM_EVENTS.WORKER_PORTAL_CONTRACT_SIGN,
        });
      }
      setActiveStep(activeStep + 1);
      actions.setTouched({});
      /* istanbul ignore next */
      // cant not simulated this function
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

  const body =
    activeStep === WorkerContactPage.IN_REVIEW ? (
      <Box display="flex" justifyContent="center">
        {getContent()}
        {ctaButtons}
      </Box>
    ) : (
      <Formik
        enableReinitialize
        onSubmit={onSubmit}
        initialValues={initialValues}
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
        dataTestId="workerEmploymentContract-toast"
      >
        {toast.message}
      </Toast>
      <Container maxWidth={false}>{body}</Container>
    </SecondaryAppLayout>
  );
};

export default WorkerEmploymentContract;

export const getServerSideProps: GetServerSideProps = async (context) => {
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
        'status',
        'companyId',
        'agreement',
        'workerUserId',
        'company:companyId,name',
        'workerUser.userContext.user:cognitoId,id,firstName,lastName',
        'employmentId',
        'workerAddendumFiles.fileManagement:id,filePath,createdAt,createdById;workerAddendumFiles.fileManagement.createdBy.user:cognitoId,email,firstName,lastName',
      ],
    },
    contextEmploymentId
  );

  if (workerEmployment.status !== HireStatus.CONTRACT_ACCEPTANCE) {
    return {
      redirect: {
        permanent: false,
        destination: WORKER_HOME.path,
      },
    };
  }

  const { agreement } = await AgreementApi.get(
    session,
    workerEmployment.agreement.agreementId
  );

  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', [
        'common',
        'employment-contract',
        'reference-documents',
      ])),
      workerEmployment,
      agreement,
    },
  };
};
